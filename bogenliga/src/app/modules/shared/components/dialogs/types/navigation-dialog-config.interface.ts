import {NavigationCardsConfig} from '../../navigation-cards';
import {CommonDialogConfig} from './common-dialog-config.interface';

export interface NavigationDialogConfig extends CommonDialogConfig {
  navigationCardsConfig: NavigationCardsConfig;
}
