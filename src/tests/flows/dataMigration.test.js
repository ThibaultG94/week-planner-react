import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "../../App";
import { AuthProvider } from "../../contexts/AuthContext";
import { TaskProvider } from "../../contexts/TaskContext";
import { STORAGE_KEY } from "../../utils/constants";

describe("Data Migration Flow", () => {
  const mockLocalTasks = [
    {
      id: 1,
      title: "Local Task 1",
      location: { type: "week", day: "Lundi", period: "morning", position: 0 },
    },
    {
      id: 2,
      title: "Local Task 2",
      location: { type: "parking", position: 0 },
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should show migration dialog when user logs in with existing local tasks", async () => {
    // Arrange
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockLocalTasks));

    // Act
    render(
      <AuthProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AuthProvider>
    );

    // Simuler la connexion utilisateur
    const loginButton = screen.getByText(/se connecter/i);
    await userEvent.click(loginButton);

    // Fill login form and submit
    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      "test@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/mot de passe/i),
      "password"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /se connecter/i })
    );

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText(/données locales détectées/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/2 tâches stockées localement/i)
      ).toBeInTheDocument();
    });
  });

  it("should handle successful migration and update UI accordingly", async () => {
    // Arrange
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockLocalTasks));

    // Act
    render(
      <AuthProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AuthProvider>
    );

    // Simuler le processus de migration
    await waitFor(() => {
      const migrateButton = screen.getByText(/transférer vers mon compte/i);
      userEvent.click(migrateButton);
    });

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/migration réussie/i)).toBeInTheDocument();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
      // Vérifier que les tâches sont affichées dans l'interface
      expect(screen.getByText("Local Task 1")).toBeInTheDocument();
      expect(screen.getByText("Local Task 2")).toBeInTheDocument();
    });
  });

  it("should handle migration errors and show appropriate error message", async () => {
    // Arrange
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockLocalTasks));
    // Mock migration error
    vi.spyOn(global, "fetch").mockRejectedValueOnce(
      new Error("Migration failed")
    );

    // Act & Assert
    render(
      <AuthProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AuthProvider>
    );

    await waitFor(() => {
      const migrateButton = screen.getByText(/transférer vers mon compte/i);
      userEvent.click(migrateButton);
    });

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText(/une erreur est survenue pendant la migration/i)
      ).toBeInTheDocument();
      // Vérifier que les données locales sont conservées
      expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();
    });
  });

  it("should allow user to dismiss migration and clear local data", async () => {
    // Arrange
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockLocalTasks));

    // Act
    render(
      <AuthProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AuthProvider>
    );

    // Cliquer sur le bouton de suppression des données locales
    await waitFor(() => {
      const clearButton = screen.getByText(/supprimer les données locales/i);
      userEvent.click(clearButton);
    });

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByText(/données locales détectées/i)
      ).not.toBeInTheDocument();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });
});
