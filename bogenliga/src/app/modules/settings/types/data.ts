import {TransferObject} from '../../shared/data-provider/models/transfer-object.interface';

export class Data implements TransferObject {
  key: string;
  value: string;

  constructor(key?: string, value?: string) {
    this.key = key ? key : '';
    this.value = value ? value : '';
  }
}

