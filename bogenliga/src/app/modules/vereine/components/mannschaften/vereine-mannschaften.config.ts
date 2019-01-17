import {OverviewDialogConfig} from '../../../shared/components/dialogs';

export const VEREIN_MANNSCHAFTEN_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'VEREINE',
  pageTitleTranslationKey: 'VEREINE.VEREINE.TITLE',
  tableConfig: {
    columns: [
      {
        translationKey: 'VEREINE.MANNSCHAFTSMITGLIEDER.TABLE.HEADERS.VORNAME',
        propertyName:   'name',
        width:          20,
      },
      {
        translationKey: 'VEREINE.MANNSCHAFTSMITGLIEDER.TABLE.HEADERS.NACHNAME',
        propertyName:   'identifier',
        width:          20,
      },
      {
        translationKey: 'VEREINE.MANNSCHAFTSMITGLIEDER.TABLE.HEADERS.EINGESETZT',
        propertyName:   'regionId',
        width:          10,
      }
    ],
  }
};
