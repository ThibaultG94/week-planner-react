import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "../../App";
import { AuthProvider } from "../../contexts/AuthContext";
import { TaskProvider } from "../../contexts/TaskContext";
import { supabase } from "../../lib/supabase";
import { STORAGE_KEY } from "../../utils/constants";

describe("Error Handling Flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("Task Operations Error Handling", () => {
    it("should handle and rollback failed task creation", async () => {
      // Simuler une erreur lors de la création d'une tâche
      const mockError = new Error("Failed to create task");
      vi.spyOn(supabase.from("tasks"), "insert").mockRejectedValueOnce(
        mockError
      );

      render(
        <AuthProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </AuthProvider>
      );

      // Ouvrir le formulaire de tâche
      const addButton = screen.getByText(/nouvelle tâche/i);
      await userEvent.click(addButton);

      // Remplir et soumettre le formulaire
      await userEvent.type(screen.getByPlaceholderText(/titre/i), "Test Task");
      await userEvent.click(screen.getByRole("button", { name: /ajouter/i }));

      // Vérifier le message d'erreur
      await waitFor(() => {
        expect(
          screen.getByText(/erreur lors de la création/i)
        ).toBeInTheDocument();
      });

      // Vérifier que l'état est cohérent (pas de tâche ajoutée)
      expect(screen.queryByText("Test Task")).not.toBeInTheDocument();
    });

    it("should handle optimistic updates and rollback on failure", async () => {
      // Setup initial tasks
      const initialTask = {
        id: 1,
        title: "Task to update",
        completed: false,
        location: {
          type: "week",
          day: "Lundi",
          period: "morning",
          position: 0,
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([initialTask]));

      // Mock d'erreur pour la mise à jour
      vi.spyOn(supabase.from("tasks"), "update").mockRejectedValueOnce(
        new Error("Update failed")
      );

      render(
        <AuthProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </AuthProvider>
      );

      // Attendre que la tâche soit affichée
      await waitFor(() => {
        expect(screen.getByText("Task to update")).toBeInTheDocument();
      });

      // Tenter de marquer comme complétée
      const checkbox = screen.getByRole("checkbox");
      await userEvent.click(checkbox);

      // Vérifier le rollback
      await waitFor(() => {
        expect(checkbox).not.toBeChecked();
        expect(
          screen.getByText(/erreur lors de la mise à jour/i)
        ).toBeInTheDocument();
      });
    });

    it("should handle task deletion errors gracefully", async () => {
      // Setup initial task
      const taskToDelete = {
        id: 1,
        title: "Task to delete",
        location: {
          type: "week",
          day: "Lundi",
          period: "morning",
          position: 0,
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([taskToDelete]));

      // Mock d'erreur pour la suppression
      vi.spyOn(supabase.from("tasks"), "delete").mockRejectedValueOnce(
        new Error("Delete failed")
      );

      render(
        <AuthProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </AuthProvider>
      );

      // Attendre l'affichage de la tâche
      await waitFor(() => {
        expect(screen.getByText("Task to delete")).toBeInTheDocument();
      });

      // Ouvrir le modal de confirmation de suppression
      const deleteButton = screen.getByRole("button", { name: /supprimer/i });
      await userEvent.click(deleteButton);

      // Confirmer la suppression
      const confirmButton = screen.getByRole("button", { name: /supprimer$/i });
      await userEvent.click(confirmButton);

      // Vérifier que la tâche est toujours présente et qu'une erreur est affichée
      await waitFor(() => {
        expect(screen.getByText("Task to delete")).toBeInTheDocument();
        expect(
          screen.getByText(/erreur lors de la suppression/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Network Error Handling", () => {
    it("should retry failed API requests automatically", async () => {
      // Mock de requête qui échoue puis réussit
      const successData = { id: 1, title: "Test Task" };
      const mockFetch = vi
        .fn()
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(successData),
        });
      global.fetch = mockFetch;

      render(
        <AuthProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </AuthProvider>
      );

      // Vérifier que la requête a été réessayée
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });

    it("should handle offline state gracefully", async () => {
      // Simuler mode hors ligne
      const originalOnline = window.navigator.onLine;
      Object.defineProperty(window.navigator, "onLine", {
        writable: true,
        value: false,
      });

      render(
        <AuthProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </AuthProvider>
      );

      // Vérifier le message hors ligne
      expect(
        screen.getByText(/connexion internet indisponible/i)
      ).toBeInTheDocument();

      // Simuler retour en ligne
      Object.defineProperty(window.navigator, "onLine", {
        writable: true,
        value: originalOnline,
      });
      window.dispatchEvent(new Event("online"));

      // Vérifier que le message disparaît
      await waitFor(() => {
        expect(
          screen.queryByText(/connexion internet indisponible/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Authentication Error Handling", () => {
    it("should handle session expiration gracefully", async () => {
      // Simuler une session expirée
      supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
        error: null,
      });
      vi.spyOn(supabase.auth, "signOut").mockResolvedValueOnce({ error: null });

      render(
        <AuthProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/session expirée/i)).toBeInTheDocument();
        expect(screen.getByText(/se connecter/i)).toBeInTheDocument();
      });
    });

    it("should handle authentication API errors", async () => {
      // Mock d'erreur d'API
      supabase.auth.signInWithPassword.mockRejectedValueOnce(
        new Error("Authentication service unavailable")
      );

      render(
        <AuthProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </AuthProvider>
      );

      // Tenter de se connecter
      await userEvent.click(screen.getByText(/se connecter/i));
      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com"
      );
      await userEvent.type(
        screen.getByPlaceholderText(/mot de passe/i),
        "password"
      );
      await userEvent.click(
        screen.getByRole("button", { name: /se connecter$/i })
      );

      // Vérifier le message d'erreur
      await waitFor(() => {
        expect(
          screen.getByText(/service d'authentification indisponible/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Form Validation Error Handling", () => {
    it("should handle and display task form validation errors", async () => {
      render(
        <AuthProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </AuthProvider>
      );

      // Ouvrir le formulaire
      await userEvent.click(screen.getByText(/nouvelle tâche/i));

      // Soumettre sans titre
      await userEvent.click(screen.getByRole("button", { name: /ajouter/i }));

      // Vérifier les messages de validation
      expect(screen.getByText(/le titre est requis/i)).toBeInTheDocument();
    });

    it("should preserve form data after failed submission", async () => {
      render(
        <AuthProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </AuthProvider>
      );

      // Ouvrir le formulaire
      await userEvent.click(screen.getByText(/nouvelle tâche/i));

      // Remplir le formulaire
      const title = "Test Task";
      const note = "Test Note";
      await userEvent.type(screen.getByPlaceholderText(/titre/i), title);
      await userEvent.type(screen.getByPlaceholderText(/note/i), note);

      // Simuler une erreur de soumission
      vi.spyOn(supabase.from("tasks"), "insert").mockRejectedValueOnce(
        new Error("Submission failed")
      );

      // Soumettre le formulaire
      await userEvent.click(screen.getByRole("button", { name: /ajouter/i }));

      // Vérifier que les données sont préservées
      await waitFor(() => {
        expect(screen.getByDisplayValue(title)).toBeInTheDocument();
        expect(screen.getByDisplayValue(note)).toBeInTheDocument();
      });
    });
  });
});
