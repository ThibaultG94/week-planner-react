import React from "react";
import { AuthProvider } from "../../contexts/AuthContext";
import { TaskProvider } from "../../contexts/TaskContext";
import { BrowserRouter } from "react-router-dom";

export const TestWrapper = ({ children, initialAuthState = null }) => (
  <BrowserRouter>
    <AuthProvider>
      <TaskProvider>{children}</TaskProvider>
    </AuthProvider>
  </BrowserRouter>
);
