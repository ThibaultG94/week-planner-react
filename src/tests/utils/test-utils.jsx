// src/tests/utils/test-utils.jsx
import { render, screen, act } from "@testing-library/react";
import { AuthProvider } from "../../contexts/AuthContext";
import { TaskProvider } from "../../contexts/TaskContext";

export async function renderWithProviders(ui, options = {}) {
  // Wrapper le rendu dans un act
  await act(async () => {
    render(ui, {
      wrapper: ({ children }) => (
        <AuthProvider>
          <TaskProvider>{children}</TaskProvider>
        </AuthProvider>
      ),
      ...options,
    });
  });
}

export { screen };
