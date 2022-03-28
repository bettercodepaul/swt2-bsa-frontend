import {UserPermission} from '@shared/services';

export interface NavigationCard {
  labelKey: string;
  descriptionKey: string;
  icon: string;
  route: string;
  permissions?: UserPermission[];
  detailType ?: string;
  datacy: string;
  /*Tooltip text shown for help by hovering over the button */
  tooltipTitle: string
  tooltipText: string;
}
