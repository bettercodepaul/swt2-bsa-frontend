import {FormConfig} from '../../forms';
import {CommonDialogConfig} from './common-dialog-config.interface';

export interface DetailDialogConfig extends CommonDialogConfig {
  formConfig: FormConfig;
}
