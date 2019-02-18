import {OverviewDialogConfig} from '../../../shared/components/dialogs';

export const VEREIN_MANNSCHAFTEN_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'VEREINE',
  pageTitleTranslationKey: 'VEREINE.VEREINE.TITLE',
  tableConfig: {
    columns: [
      {
        translationKey: 'VEREINE.MANNSCHAFTSMITGLIEDER.TABLE.HEADERS.VORNAME',
        propertyName:   'dsbMitgliedVorname',
        width:          20,
      },
      {
        translationKey: 'VEREINE.MANNSCHAFTSMITGLIEDER.TABLE.HEADERS.NACHNAME',
        propertyName:   'dsbMitgliedNachname',
        width:          20,
      },
      {
        translationKey: 'VEREINE.MANNSCHAFTSMITGLIEDER.TABLE.HEADERS.EINGESETZT',
        propertyName:   'dsbMitgliedEingesetzt',
        width:          10,
      }
    ],
  }
};
