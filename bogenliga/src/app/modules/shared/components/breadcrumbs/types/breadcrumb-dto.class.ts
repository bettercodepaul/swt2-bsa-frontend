import {DataObject} from '../../../data-provider';

export class BreadcrumbDO implements DataObject {
  label: string;
  route: string;
  isLast: boolean;

  constructor(label: string, route: string, isLast: boolean) {
    this.label = label;
    this.route = route;
    this.isLast = isLast;
  }
}
