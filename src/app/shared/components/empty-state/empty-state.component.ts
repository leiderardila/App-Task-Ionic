import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonText } from '@ionic/angular';

@Component({
  selector: 'app-empty-state',
  imports: [IonText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ion-text color="medium"><p class="ion-text-center ion-padding">{{ message() }}</p></ion-text>`,
})
export class EmptyStateComponent {
  message = input('No hay elementos para mostrar');
}
