import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IonButton, IonCheckbox, IonIcon, IonItem, IonLabel } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Task } from '../../../core/models/task.model';

/** Alto fijo (px): lo usa el virtual scroll de la página de tareas. */
export const TASK_CARD_HEIGHT = 72;

@Component({
  selector: 'app-task-card',
  imports: [IonItem, IonCheckbox, IonLabel, IonButton, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: `display:block;height:${TASK_CARD_HEIGHT}px` },
  template: `
    <ion-item lines="full" [style.height.px]="height">
      <ion-checkbox slot="start" [checked]="task().completed" (ionChange)="toggled.emit(task().id)" />
      <ion-label [style.text-decoration]="task().completed ? 'line-through' : 'none'">
        <h2>{{ task().title }}</h2>
        @if (categoryName()) {
          <span class="badge rounded-pill text-bg-primary">{{ categoryName() }}</span>
        }
      </ion-label>
      <ion-button slot="end" fill="clear" color="danger" aria-label="Eliminar tarea" (click)="removed.emit(task().id)">
        <ion-icon slot="icon-only" name="trash-outline" />
      </ion-button>
    </ion-item>
  `,
})
export class TaskCardComponent {
  readonly height = TASK_CARD_HEIGHT;
  task = input.required<Task>();
  categoryName = input<string | null>(null);
  toggled = output<string>();
  removed = output<string>();

  constructor() {
    addIcons({ trashOutline });
  }
}
