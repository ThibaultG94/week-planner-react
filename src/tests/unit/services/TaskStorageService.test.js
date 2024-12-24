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

  describe("updateTask", () => {
    const updatedFields = { title: "Updated Task" };
    const taskId = 1;

    it("should update task in localStorage when user is not logged in", async () => {
      // Arrange
      service = new TaskStorageService(null);
      const existingTasks = [{ ...mockTask, id: taskId }];
      localStorage.getItem.mockReturnValue(JSON.stringify(existingTasks));

      // Act
      const result = await service.updateTask(taskId, updatedFields);

      // Assert
      expect(localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.any(String)
      );
      expect(result).toEqual({
        ...mockTask,
        ...updatedFields,
        id: taskId,
      });
    });

    it("should update task in Supabase when user is logged in", async () => {
      // Arrange
      service = new TaskStorageService(mockUser);
      const mockUpdatedTask = {
        ...mockTask,
        ...updatedFields,
        id: taskId,
        user_id: mockUser.id,
      };
      const supabaseMock = vi
        .spyOn(service.supabase.from("tasks"), "update")
        .mockResolvedValue({ data: mockUpdatedTask });

      // Act
      const result = await service.updateTask(taskId, updatedFields);

      // Assert
      expect(supabaseMock).toHaveBeenCalledWith(updatedFields);
      expect(result).toEqual(mockUpdatedTask);
    });

    it("should throw error when updating non-existent task in localStorage", async () => {
      // Arrange
      service = new TaskStorageService(null);
      localStorage.getItem.mockReturnValue(JSON.stringify([]));

      // Act & Assert
      await expect(service.updateTask(999, updatedFields)).rejects.toThrow(
        "Tâche non trouvée"
      );
    });
  });

  describe("getTasks", () => {
    it("should get tasks from localStorage when user is not logged in", async () => {
      // Arrange
      service = new TaskStorageService(null);
      const mockTasks = [
        { ...mockTask, id: 1 },
        { ...mockTask, id: 2 },
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));

      // Act
      const result = await service.getTasks();

      // Assert
      expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
      expect(result).toEqual(mockTasks);
    });

    it("should get tasks from Supabase when user is logged in", async () => {
      // Arrange
      service = new TaskStorageService(mockUser);
      const mockTasks = [
        { ...mockTask, id: 1, user_id: mockUser.id },
        { ...mockTask, id: 2, user_id: mockUser.id },
      ];
      const supabaseMock = vi
        .spyOn(service.supabase.from("tasks"), "select")
        .mockResolvedValue({ data: mockTasks });

      // Act
      const result = await service.getTasks();

      // Assert
      expect(supabaseMock).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });

    it("should handle errors when getting tasks from Supabase", async () => {
      // Arrange
      service = new TaskStorageService(mockUser);
      const mockError = new Error("Database error");
      vi.spyOn(service.supabase.from("tasks"), "select").mockRejectedValue(
        mockError
      );

      // Act & Assert
      await expect(service.getTasks()).rejects.toThrow("Database error");
    });
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

    it("should add task to Supabase when user is logged in", async () => {
      // Arrange
      service = new TaskStorageService(mockUser);
      const mockSupabaseResponse = {
        data: { ...mockTask, id: 1, user_id: mockUser.id },
      };
      const supabaseMock = vi
        .spyOn(service.supabase.from("tasks"), "insert")
        .mockResolvedValue(mockSupabaseResponse);

      // Act
      const result = await service.addTask(mockTask);

      // Assert
      expect(supabaseMock).toHaveBeenCalledWith([
        expect.objectContaining({
          ...mockTask,
          user_id: mockUser.id,
        }),
      ]);
      expect(result).toEqual(mockSupabaseResponse.data);
    });
  });
});
