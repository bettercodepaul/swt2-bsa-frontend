import { DataObject } from '../../../data-provider';

export class BreadcrumbDO implements DataObject {
  label: string;
  route: string | any[]; // weiterhin String möglich; Array für komplexere Links erlaubt
  isLast: boolean;
  queryParams?: { [key: string]: any } | null;

  constructor(
    label: string,
    route: string | any[],
    isLast: boolean,
    queryParams?: { [key: string]: any } | null
  ) {
    this.label = label;
    this.route = route;
    this.isLast = isLast;
    this.queryParams = queryParams;
  }
}
