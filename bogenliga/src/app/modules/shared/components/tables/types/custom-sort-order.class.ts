export class CustomPropertySortOrder {
  sortOrderPriority: number;
  property: string;

  constructor(sortOrderPriority: number, property: string) {
    this.sortOrderPriority = sortOrderPriority;
    this.property = property;
  }
}
