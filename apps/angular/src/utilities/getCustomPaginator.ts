import { MatPaginatorIntl } from '@angular/material/paginator';

export function getCustomPaginatorIntl(itemsName: string) {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = itemsName;

  return customPaginatorIntl;
}
