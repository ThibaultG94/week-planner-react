import { describe, it, expect, beforeEach, vi } from "vitest";
import TaskStorageService from "../../../lib/TaskStorageService";
import { STORAGE_KEY } from "../../../utils/constants";

describe("TaskStorageService", () => {
  let service;
  const mockUser = { id: "user123" };
  const mockTask = {
    title: "Test Task",
    location: {
      type: "week",
      day: "Lundi",
      period: "morning",
      position: 0,
    },
  };

  beforeEach(() => {
    // Reset all mocks before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("addTask", () => {
    it("should add task to localStorage when user is not logged in", async () => {
      // Arrange
      service = new TaskStorageService(null); // pas d'utilisateur connecté
      localStorage.getItem.mockReturnValue("[]");

      // Act
      const result = await service.addTask(mockTask);

      // Assert
      expect(localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.any(String)
      );
      expect(result).toEqual({
        ...mockTask,
        id: expect.any(Number),
      });
    });
  });
});
