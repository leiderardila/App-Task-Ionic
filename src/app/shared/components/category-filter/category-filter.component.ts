import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular';
import { Category } from '../../../core/models/category.model';

const ALL = 'all';

@Component({
  selector: 'app-category-filter',
  imports: [IonSegment, IonSegmentButton, IonLabel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-segment [scrollable]="true" [value]="selectedId() ?? ALL" (ionChange)="onChange($event.detail.value)">
      <ion-segment-button [value]="ALL"><ion-label>Todas</ion-label></ion-segment-button>
      @for (c of categories(); track c.id) {
        <ion-segment-button [value]="c.id"><ion-label>{{ c.name }}</ion-label></ion-segment-button>
      }
    </ion-segment>
  `,
})
export class CategoryFilterComponent {
  readonly ALL = ALL;
  categories = input.required<Category[]>();
  selectedId = input<string | null>(null);
  selected = output<string | null>();

  onChange(value: string | number | undefined): void {
    this.selected.emit(value === ALL || value == null ? null : String(value));
  }
}
