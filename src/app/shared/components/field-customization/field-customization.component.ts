import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CustomizableField } from '../../models/customizable-field';

@Component({
  selector: 'app-field-customization',
  templateUrl: './field-customization.component.html',
  styleUrls: ['./field-customization.component.css'],
})
export class FieldCustomizationComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() selectedFields: string[] = [];
  @Input() fields: CustomizableField[] = [];
  @Input() contentName: string = '';

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() apply = new EventEmitter<string[]>();

  fieldsToApply: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.fieldsToApply = [...this.selectedFields];
    }
  }

  onVisibilityChange(visible: boolean): void {
    this.visible = visible;
    this.visibleChange.emit(visible);
  }

  changeField(field: string, checked: boolean): void {
    if (checked && !this.fieldsToApply.includes(field)) {
      this.fieldsToApply.push(field);
    }

    if (!checked) {
      if (this.fieldsToApply.length === 1) {
        return;
      }

      this.fieldsToApply = this.fieldsToApply.filter(
        (selectedField) => selectedField !== field,
      );
    }

    this.apply.emit([...this.fieldsToApply]);
  }

  isSelected(field: string): boolean {
    return this.fieldsToApply.includes(field);
  }
}
