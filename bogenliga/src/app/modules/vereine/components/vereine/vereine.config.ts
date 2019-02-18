import {OverviewDialogConfig} from '../../../shared/components/dialogs';

export const VEREINE_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey: 'VEREINE',
  pageTitleTranslationKey: 'VEREINE.VEREINE.TITLE',
  tableConfig: {
    columns: [
      {
        translationKey: 'VEREINE.VEREINE.TABLE.HEADERS.NAME',
        propertyName: 'name',
        width: 20,
      },
      {
        translationKey: 'VEREINE.VEREINE.TABLE.HEADERS.REGION_NAME',
        propertyName: 'regionName',
        width: 20,
      }
    ],
  }
};
