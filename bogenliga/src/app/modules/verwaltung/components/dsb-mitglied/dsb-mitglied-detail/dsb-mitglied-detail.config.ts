import {DetailDialogConfig} from '../../../../shared/components/dialogs';

export const DSB_MITGLIED_DETAIL_CONFIG: DetailDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.TITLE',

  formConfig: {
    properties: [
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER.TABLE.HEADERS.ID',
        propertyName:   'id',
      },
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER.TABLE.HEADERS.VORNAME',
        propertyName:   'vorname',
      },
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER.TABLE.HEADERS.NACHNAME',
        propertyName:   'nachname',
      },
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER.TABLE.HEADERS.GEBURTSDATUM',
        propertyName:   'geburtsdatum',
      },
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER.TABLE.HEADERS.MITGLIEDSNUMMER',
        propertyName:   'mitgliedsnummer',
      }
    ]
  }
};
