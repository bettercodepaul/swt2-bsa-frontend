import {DataTransferObject} from '../../../data-provider';

export class ErrorDTO implements DataTransferObject {
  errorCode: string;
  param: string[];
  errorMessage: string;

  constructor(errorCode?: string, param?: string[], errorMessage?: string) {
    this.errorCode = !!errorCode ? errorCode : '';
    this.param = !!param ? param : [];
    this.errorMessage = !!errorMessage ? errorMessage : '';
  }

  static copyFromJson(json: {
    errorCode: string,
    param: string[],
    errorMessage: string
  }): ErrorDTO {
    const userSign = new ErrorDTO();
    userSign.errorCode = json.errorCode;
    userSign.param = json.param;
    userSign.errorMessage = json.errorMessage;

    return userSign;
  }


}
