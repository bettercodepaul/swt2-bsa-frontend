import {CommonDialogConfig} from './common-dialog-config.interface';
import {NavigationCardsConfig} from '../../navigation-cards';

export interface NavigationDialogConfig extends CommonDialogConfig {
  navigationCardsConfig: NavigationCardsConfig;
}
