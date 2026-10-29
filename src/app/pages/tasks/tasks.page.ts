import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem,
  IonSelect, IonSelectOption, IonTitle, IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { CategoryService } from '../../core/services/category.service';
import { FeatureFlagService } from '../../core/services/feature-flag.service';
import { TaskService } from '../../core/services/task.service';
import { CategoryFilterComponent } from '../../shared/components/category-filter/category-filter.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TASK_CARD_HEIGHT, TaskCardComponent } from '../../shared/components/task-card/task-card.component';

@Component({
  selector: 'app-tasks',
  imports: [
    ScrollingModule, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonItem,
    IonInput, IonSelect, IonSelectOption, IonButton, IonIcon,
    CategoryFilterComponent, EmptyStateComponent, TaskCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `cdk-virtual-scroll-viewport { height: 100%; }`,
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start"><ion-back-button defaultHref="/home" /></ion-buttons>
        <ion-title>Tareas</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-item lines="none">
          <ion-input #title placeholder="Nueva tarea" (keyup.enter)="add(title)" />
          @if (categoriesEnabled) {
            <ion-select slot="end" placeholder="Categoría" interface="popover" [value]="newCategoryId()"
              (ionChange)="newCategoryId.set($event.detail.value)">
              <ion-select-option [value]="null">Sin categoría</ion-select-option>
              @for (c of categoryService.categories(); track c.id) {
                <ion-select-option [value]="c.id">{{ c.name }}</ion-select-option>
              }
            </ion-select>
          }
          <ion-button slot="end" aria-label="Agregar tarea" (click)="add(title)">
            <ion-icon slot="icon-only" name="add" />
          </ion-button>
        </ion-item>
      </ion-toolbar>
      @if (categoriesEnabled) {
        <app-category-filter [categories]="categoryService.categories()" [selectedId]="selectedId()"
          (selected)="selectedId.set($event)" />
      }
    </ion-header>
    <ion-content [scrollY]="false">
      @if (filtered().length) {
        <cdk-virtual-scroll-viewport [itemSize]="itemSize">
          <app-task-card *cdkVirtualFor="let t of filtered(); trackBy: trackById" [task]="t"
            [categoryName]="categoryName(t.categoryId)"
            (toggled)="taskService.toggle($event)" (removed)="taskService.remove($event)" />
        </cdk-virtual-scroll-viewport>
      } @else {
        <app-empty-state message="No hay tareas" />
      }
    </ion-content>
  `,
})
export class TasksPage {
  taskService = inject(TaskService);
  categoryService = inject(CategoryService);
  categoriesEnabled = inject(FeatureFlagService).isEnabled('categories');

  readonly itemSize = TASK_CARD_HEIGHT;
  selectedId = signal<string | null>(null);
  newCategoryId = signal<string | null>(null);

  /** Mapa id → nombre: evita buscar la categoría por cada tarea renderizada. */
  private categoryNames = computed(() => new Map(this.categoryService.categories().map((c) => [c.id, c.name])));
  filtered = computed(() => {
    const id = this.selectedId();
    return id ? this.taskService.tasks().filter((t) => t.categoryId === id) : this.taskService.tasks();
  });

  constructor() {
    addIcons({ add });
  }

  trackById = (_: number, t: { id: string }) => t.id;

  categoryName(id: string | undefined): string | null {
    return id ? (this.categoryNames().get(id) ?? null) : null;
  }

  add(input: IonInput): void {
    const value = String(input.value ?? '').trim();
    if (!value) return;
    this.taskService.add(value, this.newCategoryId() ?? undefined);
    input.value = '';
  }
}
