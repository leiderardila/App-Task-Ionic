import { Injectable, computed, inject, signal } from '@angular/core';
import { Task } from '../models/task.model';
import { StorageService } from './storage.service';

const KEY = 'tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private storage = inject(StorageService);
  private readonly _tasks = signal<Task[]>([]);
  readonly tasks = this._tasks.asReadonly();
  readonly pending = computed(() => this._tasks().filter((t) => !t.completed));

  constructor() {
    void this.load();
  }

  add(title: string, categoryId?: string): void {
    const task: Task = { id: crypto.randomUUID(), title, completed: false, categoryId, createdAt: new Date() };
    this.persist([task, ...this._tasks()]);
  }

  toggle(id: string): void {
    this.persist(this._tasks().map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  remove(id: string): void {
    this.persist(this._tasks().filter((t) => t.id !== id));
  }

  /** Deja sin categoría las tareas que apuntaban a una categoría eliminada. */
  clearCategory(categoryId: string): void {
    this.persist(this._tasks().map((t) => (t.categoryId === categoryId ? { ...t, categoryId: undefined } : t)));
  }

  private async load(): Promise<void> {
    const stored: Task[] = (await this.storage.get(KEY)) ?? [];
    // JSON convierte Date en string: se restaura al leer.
    this._tasks.set(stored.map((t) => ({ ...t, createdAt: new Date(t.createdAt) })));
  }

  private persist(list: Task[]): void {
    this._tasks.set(list);
    void this.storage.save(KEY, list);
  }
}
