import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonNote, IonTitle, IonToolbar } from '@ionic/angular';
import { FeatureFlagService } from '../../core/services/feature-flag.service';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonNote],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-header><ion-toolbar color="primary"><ion-title>Inicio</ion-title></ion-toolbar></ion-header>
    <ion-content>
      <ion-list>
        <ion-item routerLink="/tasks" detail>
          <ion-label>Tareas</ion-label>
          <ion-note slot="end">{{ taskService.pending().length }} pendientes</ion-note>
        </ion-item>
        @if (flags.isEnabled('categories')) {
          <ion-item routerLink="/categories" detail><ion-label>Categorías</ion-label></ion-item>
        }
      </ion-list>
    </ion-content>
  `,
})
export class HomePage {
  taskService = inject(TaskService);
  flags = inject(FeatureFlagService);
}
