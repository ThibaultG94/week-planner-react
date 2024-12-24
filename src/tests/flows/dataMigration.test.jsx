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

  it("should show loading state during migration", async () => {
    // Arrange
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockLocalTasks));

    // Simuler un délai de migration
    const mockMigration = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () => resolve({ success: true, data: mockLocalTasks }),
            100
          );
        })
    );
    vi.spyOn(global, "fetch").mockImplementation(mockMigration);

    // Act
    render(
      <AuthProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AuthProvider>
    );

    // Cliquer sur le bouton de migration
    await waitFor(() => {
      const migrateButton = screen.getByText(/transférer vers mon compte/i);
      userEvent.click(migrateButton);
    });

    // Assert - Vérifier l'état de chargement
    expect(screen.getByText(/migration en cours/i)).toBeInTheDocument();

    // Attendre la fin de la migration
    await waitFor(
      () => {
        expect(
          screen.queryByText(/migration en cours/i)
        ).not.toBeInTheDocument();
      },
      { timeout: 200 }
    );
  });

  it("should handle partial migration success", async () => {
    // Arrange
    const largeTaskSet = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      title: `Task ${i + 1}`,
      location: { type: "week", day: "Lundi", period: "morning", position: i },
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(largeTaskSet));

    // Simuler un succès partiel (certaines tâches échouent)
    const mockPartialSuccess = vi.fn().mockResolvedValue({
      data: largeTaskSet.slice(0, 3), // Seules les 3 premières tâches réussissent
      error: {
        details: "Certaines tâches n'ont pas pu être migrées",
      },
    });
    vi.spyOn(global, "fetch").mockImplementation(mockPartialSuccess);

    // Act
    render(
      <AuthProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AuthProvider>
    );

    // Cliquer sur le bouton de migration
    await waitFor(() => {
      const migrateButton = screen.getByText(/transférer vers mon compte/i);
      userEvent.click(migrateButton);
    });

    // Assert
    await waitFor(() => {
      // Vérifier le message d'avertissement
      expect(
        screen.getByText(/certaines tâches n'ont pas pu être migrées/i)
      ).toBeInTheDocument();
      // Vérifier que les données partiellement migrées sont affichées
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
      expect(screen.getByText("Task 3")).toBeInTheDocument();
      // Vérifier que les données non migrées ne sont pas affichées
      expect(screen.queryByText("Task 4")).not.toBeInTheDocument();
      expect(screen.queryByText("Task 5")).not.toBeInTheDocument();
    });
  });

  it("should handle large dataset migration gracefully", async () => {
    // Arrange
    const largeTaskSet = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      title: `Large Task ${i + 1}`,
      location: {
        type: i % 2 === 0 ? "week" : "parking",
        ...(i % 2 === 0
          ? {
              day: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"][i % 5],
              period: i % 2 === 0 ? "morning" : "afternoon",
              position: i % 4,
            }
          : {
              position: Math.floor(i / 2),
            }),
      },
      note: `Note pour la tâche ${i + 1}`,
      completed: i % 3 === 0,
    }));

    // Mesurer la taille approximative des données
    const dataSize = new Blob([JSON.stringify(largeTaskSet)]).size;
    console.log(`Test data size: ${dataSize / 1024}KB`);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(largeTaskSet));

    // Simuler une migration par lots avec délais réalistes
    let migratedCount = 0;
    const batchSize = 100;
    const mockBatchMigration = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          const start = migratedCount;
          const end = Math.min(start + batchSize, largeTaskSet.length);
          const batch = largeTaskSet.slice(start, end);
          migratedCount += batch.length;

          // Simuler un délai réaliste pour chaque lot
          setTimeout(() => {
            resolve({
              data: batch,
              metadata: {
                progress: (migratedCount / largeTaskSet.length) * 100,
              },
            });
          }, 50);
        })
    );

    vi.spyOn(global, "fetch").mockImplementation(mockBatchMigration);

    // Spy sur requestAnimationFrame pour vérifier la fluidité de l'UI
    const rafSpy = vi.spyOn(window, "requestAnimationFrame");

    // Act
    render(
      <AuthProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AuthProvider>
    );

    // Déclencher la migration
    await waitFor(() => {
      const migrateButton = screen.getByText(/transférer vers mon compte/i);
      userEvent.click(migrateButton);
    });

    // Assert
    // 1. Vérifier que l'UI reste réactive
    await waitFor(() => {
      expect(rafSpy).toHaveBeenCalled();
      expect(screen.queryByText(/migration en cours/i)).toBeInTheDocument();
    });

    // 2. Vérifier la complétion de la migration
    await waitFor(
      () => {
        expect(screen.queryByText(/migration réussie/i)).toBeInTheDocument();
        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
      },
      { timeout: 5000 }
    ); // Timeout plus long pour le grand jeu de données

    // 3. Vérifier quelques tâches au hasard dans l'UI
    const randomIndexes = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * largeTaskSet.length)
    );

    for (const index of randomIndexes) {
      const task = largeTaskSet[index];
      await waitFor(() => {
        expect(screen.queryByText(task.title)).toBeInTheDocument();
      });
    }

    // 4. Vérifier la performance
    expect(rafSpy).toHaveBeenCalledTimes(expect.any(Number));
    const frameDrops = rafSpy.mock.calls.filter((call, i) => {
      if (i === 0) return false;
      const timeDiff = call[0] - rafSpy.mock.calls[i - 1][0];
      return timeDiff > 1000 / 30; // Considérer comme drop si > 33ms (30fps)
    }).length;

    console.log(`Dropped frames during migration: ${frameDrops}`);
    expect(frameDrops).toBeLessThan(30); // Tolérer quelques drops de frames
  });

  it("should handle memory limits gracefully during large dataset migration", async () => {
    // Arrange
    const originalMemoryUsage = window.performance.memory?.usedJSHeapSize;
    let peakMemoryUsage = 0;

    // Observer la mémoire périodiquement
    const memoryObserver = setInterval(() => {
      const currentMemory = window.performance.memory?.usedJSHeapSize;
      if (currentMemory > peakMemoryUsage) {
        peakMemoryUsage = currentMemory;
      }
    }, 100);

    // Créer un très grand jeu de données (10000 tâches avec contenu riche)
    const hugeTaskSet = Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      title: `Memory Test Task ${
        i + 1
      } with extended title for memory consumption`,
      note: `Une longue note pour consommer plus de mémoire. `.repeat(10),
      location: {
        type: i % 2 === 0 ? "week" : "parking",
        ...(i % 2 === 0
          ? {
              day: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"][i % 5],
              period: i % 2 === 0 ? "morning" : "afternoon",
              position: i % 4,
            }
          : {
              position: Math.floor(i / 2),
            }),
      },
      metadata: {
        created: new Date().toISOString(),
        tags: Array.from({ length: 5 }, (_, j) => `tag-${j}`),
        priority: i % 3,
        customData: { field1: "value1", field2: "value2" },
      },
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(hugeTaskSet));

    // Act
    render(
      <AuthProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AuthProvider>
    );

    // Attendre la fin de la migration
    await waitFor(() => {
      const migrateButton = screen.getByText(/transférer vers mon compte/i);
      userEvent.click(migrateButton);
    });

    await waitFor(
      () => {
        expect(screen.queryByText(/migration réussie/i)).toBeInTheDocument();
      },
      { timeout: 10000 }
    );

    // Cleanup
    clearInterval(memoryObserver);

    // Assert
    if (originalMemoryUsage) {
      const memoryIncrease =
        (peakMemoryUsage - originalMemoryUsage) / 1024 / 1024;
      console.log(`Peak memory increase: ${memoryIncrease.toFixed(2)}MB`);
      expect(memoryIncrease).toBeLessThan(100); // Moins de 100MB d'augmentation
    }
  });

  it("should handle timeout during migration and retry gracefully", async () => {
    // Arrange
    const taskSet = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      title: `Timeout Test Task ${i + 1}`,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(taskSet));

    // Simuler un timeout puis une réussite
    let attempt = 0;
    const mockTimeoutThenSuccess = vi.fn().mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          if (attempt === 0) {
            attempt++;
            setTimeout(() => reject(new Error("Request timeout")), 5000);
          } else {
            resolve({ data: taskSet });
          }
        })
    );

    vi.spyOn(global, "fetch").mockImplementation(mockTimeoutThenSuccess);

    // Act
    render(
      <AuthProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AuthProvider>
    );

    // Déclencher la migration
    await waitFor(() => {
      const migrateButton = screen.getByText(/transférer vers mon compte/i);
      userEvent.click(migrateButton);
    });

    // Assert
    // 1. Vérifier le message de timeout
    await waitFor(
      () => {
        expect(
          screen.getByText(/délai d'attente dépassé/i)
        ).toBeInTheDocument();
      },
      { timeout: 6000 }
    );

    // 2. Vérifier la possibilité de réessayer
    const retryButton = screen.getByText(/réessayer/i);
    await userEvent.click(retryButton);

    // 3. Vérifier le succès après la nouvelle tentative
    await waitFor(() => {
      expect(screen.getByText(/migration réussie/i)).toBeInTheDocument();
    });
  });

  it("should resume interrupted migration from last successful batch", async () => {
    // Arrange
    const taskSet = Array.from({ length: 300 }, (_, i) => ({
      id: i + 1,
      title: `Resume Test Task ${i + 1}`,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(taskSet));

    // Simuler une interruption à mi-chemin puis une reprise
    let migratedCount = 0;
    const batchSize = 50;
    let hasInterrupted = false;

    const mockInterruptedMigration = vi.fn().mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          const start = migratedCount;
          const end = Math.min(start + batchSize, taskSet.length);
          const batch = taskSet.slice(start, end);

          // Simuler une interruption après 150 tâches
          if (migratedCount >= 150 && !hasInterrupted) {
            hasInterrupted = true;
            reject(new Error("Connection lost"));
            return;
          }

          migratedCount += batch.length;

          setTimeout(() => {
            resolve({
              data: batch,
              metadata: {
                progress: (migratedCount / taskSet.length) * 100,
                lastMigratedId: batch[batch.length - 1].id,
              },
            });
          }, 50);
        })
    );

    vi.spyOn(global, "fetch").mockImplementation(mockInterruptedMigration);

    // Act
    render(
      <AuthProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AuthProvider>
    );

    // Déclencher la migration initiale
    await waitFor(() => {
      const migrateButton = screen.getByText(/transférer vers mon compte/i);
      userEvent.click(migrateButton);
    });

    // Assert
    // 1. Vérifier l'interruption
    await waitFor(() => {
      expect(screen.getByText(/connexion perdue/i)).toBeInTheDocument();
      expect(screen.getByText(/150 tâches migrées/i)).toBeInTheDocument();
    });

    // 2. Reprendre la migration
    const resumeButton = screen.getByText(/reprendre/i);
    await userEvent.click(resumeButton);

    // 3. Vérifier la complétion
    await waitFor(
      () => {
        expect(screen.getByText(/migration réussie/i)).toBeInTheDocument();
        expect(screen.getByText(/300 tâches migrées/i)).toBeInTheDocument();
      },
      { timeout: 8000 }
    );

    // 4. Vérifier que toutes les tâches sont présentes
    const lastTask = taskSet[taskSet.length - 1];
    await waitFor(() => {
      expect(screen.queryByText(lastTask.title)).toBeInTheDocument();
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
