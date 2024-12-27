import React from "react";
import { AuthProvider } from "../../contexts/AuthContext";
import { TaskProvider } from "../../contexts/TaskContext";

export const TestWrapper = ({ children }) => (
  <AuthProvider>
    <TaskProvider>{children}</TaskProvider>
  </AuthProvider>
);
