import { Injectable, inject, signal } from '@angular/core';
import { Category } from '../models/category.model';
import { StorageService } from './storage.service';

const KEY = 'categories';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private storage = inject(StorageService);
  private readonly _categories = signal<Category[]>([]);
  readonly categories = this._categories.asReadonly();

  constructor() {
    void this.load();
  }

  add(name: string, color = '#3880ff'): void {
    this.persist([...this._categories(), { id: crypto.randomUUID(), name, color }]);
  }

  rename(id: string, name: string): void {
    this.persist(this._categories().map((c) => (c.id === id ? { ...c, name } : c)));
  }

  remove(id: string): void {
    this.persist(this._categories().filter((c) => c.id !== id));
  }

  private async load(): Promise<void> {
    this._categories.set((await this.storage.get(KEY)) ?? []);
  }

  private persist(list: Category[]): void {
    this._categories.set(list);
    void this.storage.save(KEY, list);
  }
}
