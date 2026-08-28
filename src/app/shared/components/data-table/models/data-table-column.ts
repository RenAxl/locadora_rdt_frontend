import { CustomizableField } from 'src/app/shared/models/customizable-field';

export interface DataTableColumn extends CustomizableField {
  sortable?: boolean;
}
