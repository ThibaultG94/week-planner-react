import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import App from "../../App";

describe("Authentication Flow", () => {
  describe("Initial Render", () => {
    it("should render login button", async () => {
      renderWithProviders(<App />);
      await screen.findByText(/se connecter/i);
    });

    it("should not show logout button when not logged in", async () => {
      renderWithProviders(<App />);
      expect(screen.queryByText(/se déconnecter/i)).not.toBeInTheDocument();
    });
  });

  describe("Sign Up Flow", () => {
    it("should open signup modal when clicking signup button", async () => {
      await renderWithProviders(<App />);

      // Utiliser un sélecteur plus spécifique
      const signUpButton = screen.getByRole("button", {
        name: /s'inscrire/i,
        // Ajouter un test-id si nécessaire sur le bouton dans AppHeader
        // "data-testid": "header-signup-button"
      });

      await act(async () => {
        await userEvent.click(signUpButton);
      });

      expect(screen.getByText(/créer un compte/i)).toBeInTheDocument();
    });

    it("should validate password length", async () => {
      renderWithProviders(<App />);
      const signUpButton = await screen.findByText(/s'inscrire/i);
      await userEvent.click(signUpButton);

      const passwordInput = screen.getByPlaceholderText(/mot de passe/i);
      await userEvent.type(passwordInput, "123");

      const submitButton = screen.getByRole("button", { name: /s'inscrire/i });
      await userEvent.click(submitButton);

      expect(
        screen.getByText(/doit contenir au moins 6 caractères/i)
      ).toBeInTheDocument();
    });
  });

  // // À implémenter ensuite :
  // describe("Login Flow", () => {});
  // describe("Logout Flow", () => {});
  // describe("Session Management", () => {});
});
