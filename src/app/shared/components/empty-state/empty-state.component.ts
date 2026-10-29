import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonText } from '@ionic/angular';

@Component({
  selector: 'app-empty-state',
  imports: [IonText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card border-0 bg-body-tertiary text-center m-3">
      <div class="card-body py-4">
        <ion-text color="medium">{{ message() }}</ion-text>
      </div>
    </div>
  `,
})
export class EmptyStateComponent {
  message = input('No hay elementos para mostrar');
}
