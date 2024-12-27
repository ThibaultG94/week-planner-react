import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock de Supabase plus détaillé
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    getSession: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  })),
};

// Export pour utilisation dans les tests
global.mockSupabase = mockSupabase;
