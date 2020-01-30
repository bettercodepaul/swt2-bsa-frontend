import { DataTransferObject } from './../../../shared/data-provider/models/data-transfer-object.interface';
export class AccessCodeDTO implements DataTransferObject {

    accessCode: string;
    newPassword: string;

    constructor(accessCode: string) {
      this.accessCode = accessCode;
    }

}
