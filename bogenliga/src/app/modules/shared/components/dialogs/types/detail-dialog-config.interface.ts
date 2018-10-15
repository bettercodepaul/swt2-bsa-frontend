import {CommonDialogConfig} from './common-dialog-config.interface';
import {FormConfig} from '../../forms';

export interface DetailDialogConfig extends CommonDialogConfig {
  formConfig: FormConfig;
}
