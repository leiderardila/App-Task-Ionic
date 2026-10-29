import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AlertController, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput,
  IonItem, IonLabel, IonList, IonTitle, IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, createOutline, trashOutline } from 'ionicons/icons';
import { CategoryService } from '../../core/services/category.service';
import { TaskService } from '../../core/services/task.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-categories',
  imports: [
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonInput, IonButton, IonIcon, EmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start"><ion-back-button defaultHref="/home" /></ion-buttons>
        <ion-title>Categorías</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="container py-3">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <h2 class="h6 text-secondary mb-0">Mis categorías</h2>
          <span class="badge rounded-pill text-bg-secondary">{{ categoryService.categories().length }}</span>
        </div>
        <div class="card shadow-sm overflow-hidden">
          <ion-item lines="full">
            <ion-input #name placeholder="Nueva categoría" (keyup.enter)="add(name)" />
            <ion-button slot="end" aria-label="Agregar categoría" (click)="add(name)">
              <ion-icon slot="icon-only" name="add" />
            </ion-button>
          </ion-item>
        </div>
      </div>
      <ion-list class="mx-3 rounded overflow-hidden shadow-sm">
        @for (c of categoryService.categories(); track c.id) {
          <ion-item>
            <ion-label>{{ c.name }}</ion-label>
            <ion-button slot="end" fill="clear" aria-label="Editar categoría" (click)="edit(c.id, c.name)">
              <ion-icon slot="icon-only" name="create-outline" />
            </ion-button>
            <ion-button slot="end" fill="clear" color="danger" aria-label="Eliminar categoría" (click)="remove(c.id)">
              <ion-icon slot="icon-only" name="trash-outline" />
            </ion-button>
          </ion-item>
        } @empty {
          <app-empty-state message="No hay categorías" />
        }
      </ion-list>
    </ion-content>
  `,
})
export class CategoriesPage {
  categoryService = inject(CategoryService);
  private taskService = inject(TaskService);
  private alertCtrl = inject(AlertController);

  constructor() {
    addIcons({ add, createOutline, trashOutline });
  }

  add(input: IonInput): void {
    const value = String(input.value ?? '').trim();
    if (!value) return;
    this.categoryService.add(value);
    input.value = '';
  }

  async edit(id: string, current: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Editar categoría',
      inputs: [{ name: 'name', type: 'text', value: current }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: ({ name }: { name: string }) => {
            const value = name.trim();
            if (value) this.categoryService.rename(id, value);
          },
        },
      ],
    });
    await alert.present();
  }

  remove(id: string): void {
    this.taskService.clearCategory(id);
    this.categoryService.remove(id);
  }
}
