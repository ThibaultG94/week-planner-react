import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "../../App";
import { AuthProvider } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

describe("Authentication Flow", () => {
  // Réinitialiser les mocks et l'état avant chaque test
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset des mocks Supabase
    vi.spyOn(supabase.auth, "signInWithPassword").mockResolvedValue({
      data: null,
      error: null,
    });
    vi.spyOn(supabase.auth, "signUp").mockResolvedValue({
      data: null,
      error: null,
    });
    vi.spyOn(supabase.auth, "signOut").mockResolvedValue({
      error: null,
    });
  });

  describe("Sign Up Flow", () => {
    it("should show sign up form when clicking register button", async () => {
      render(
        <AuthProvider>
          <App />
        </AuthProvider>
      );

      const signUpButton = screen.getByText(/s'inscrire/i);
      await userEvent.click(signUpButton);

      expect(screen.getByText(/créer un compte/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/mot de passe/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/confirmer le mot de passe/i)
      ).toBeInTheDocument();
    });

    it("should handle successful registration", async () => {
      // Mock d'une inscription réussie
      supabase.auth.signUp.mockResolvedValueOnce({
        data: { user: { id: "test-user", email: "test@example.com" } },
        error: null,
      });

      render(
        <AuthProvider>
          <App />
        </AuthProvider>
      );

      // Ouvrir le formulaire d'inscription
      await userEvent.click(screen.getByText(/s'inscrire/i));

      // Remplir le formulaire
      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com"
      );
      await userEvent.type(
        screen.getByPlaceholderText(/^mot de passe$/i),
        "password123"
      );
      await userEvent.type(
        screen.getByPlaceholderText(/confirmer le mot de passe/i),
        "password123"
      );

      // Soumettre le formulaire
      const submitButton = screen.getByRole("button", { name: /s'inscrire/i });
      await userEvent.click(submitButton);

      // Vérifier que l'API a été appelée correctement
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });

      // Vérifier que l'UI est mise à jour
      await waitFor(() => {
        expect(screen.queryByText(/créer un compte/i)).not.toBeInTheDocument();
      });
    });

    it("should handle registration validation errors", async () => {
      render(
        <AuthProvider>
          <App />
        </AuthProvider>
      );

      await userEvent.click(screen.getByText(/s'inscrire/i));

      // Soumettre avec un mot de passe trop court
      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com"
      );
      await userEvent.type(
        screen.getByPlaceholderText(/^mot de passe$/i),
        "12345"
      );
      await userEvent.type(screen.getByPlaceholderText(/confirmer/i), "12345");

      await userEvent.click(
        screen.getByRole("button", { name: /s'inscrire/i })
      );

      expect(
        screen.getByText(/mot de passe doit contenir au moins 6 caractères/i)
      ).toBeInTheDocument();
    });

    it("should handle registration API errors", async () => {
      // Mock d'une erreur d'API
      supabase.auth.signUp.mockResolvedValueOnce({
        data: null,
        error: new Error("Email already registered"),
      });

      render(
        <AuthProvider>
          <App />
        </AuthProvider>
      );

      await userEvent.click(screen.getByText(/s'inscrire/i));
      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com"
      );
      await userEvent.type(
        screen.getByPlaceholderText(/^mot de passe$/i),
        "password123"
      );
      await userEvent.type(
        screen.getByPlaceholderText(/confirmer/i),
        "password123"
      );

      await userEvent.click(
        screen.getByRole("button", { name: /s'inscrire/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/email already registered/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Sign In Flow", () => {
    it("should show sign in form when clicking login button", async () => {
      render(
        <AuthProvider>
          <App />
        </AuthProvider>
      );

      await userEvent.click(screen.getByText(/se connecter/i));

      expect(screen.getByText(/se connecter/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/mot de passe/i)).toBeInTheDocument();
    });

    it("should handle successful login", async () => {
      const mockUser = { id: "test-user", email: "test@example.com" };
      supabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      render(
        <AuthProvider>
          <App />
        </AuthProvider>
      );

      await userEvent.click(screen.getByText(/se connecter/i));
      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com"
      );
      await userEvent.type(
        screen.getByPlaceholderText(/mot de passe/i),
        "password123"
      );

      await userEvent.click(
        screen.getByRole("button", { name: /se connecter/i })
      );

      // Vérifier l'appel API
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });

      // Vérifier l'UI après connexion
      await waitFor(() => {
        expect(screen.queryByText(/se connecter/i)).not.toBeInTheDocument();
        expect(screen.getByText(/se déconnecter/i)).toBeInTheDocument();
      });
    });

    it("should handle login errors", async () => {
      supabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: null,
        error: new Error("Invalid credentials"),
      });

      render(
        <AuthProvider>
          <App />
        </AuthProvider>
      );

      await userEvent.click(screen.getByText(/se connecter/i));
      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com"
      );
      await userEvent.type(
        screen.getByPlaceholderText(/mot de passe/i),
        "wrongpass"
      );

      await userEvent.click(
        screen.getByRole("button", { name: /se connecter/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/email ou mot de passe incorrect/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Session Management", () => {
    it("should handle sign out", async () => {
      // Simuler un utilisateur connecté
      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "test-user", email: "test@example.com" } },
        error: null,
      });

      render(
        <AuthProvider>
          <App />
        </AuthProvider>
      );

      // Attendre que le bouton de déconnexion soit visible
      const signOutButton = await screen.findByText(/se déconnecter/i);
      await userEvent.click(signOutButton);

      // Vérifier l'appel API
      expect(supabase.auth.signOut).toHaveBeenCalled();

      // Vérifier l'UI après déconnexion
      await waitFor(() => {
        expect(screen.getByText(/se connecter/i)).toBeInTheDocument();
        expect(screen.queryByText(/se déconnecter/i)).not.toBeInTheDocument();
      });
    });

    it("should restore session on page load", async () => {
      // Simuler une session existante
      supabase.auth.getSession.mockResolvedValueOnce({
        data: {
          session: {
            user: { id: "test-user", email: "test@example.com" },
          },
        },
        error: null,
      });

      render(
        <AuthProvider>
          <App />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/se déconnecter/i)).toBeInTheDocument();
        expect(screen.queryByText(/se connecter/i)).not.toBeInTheDocument();
      });
    });
  });
});
