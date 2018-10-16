import {DetailDialogConfig} from '../../../../shared/components/dialogs';
import {FormPropertyType} from '../../../../shared/components/forms';

export const DSB_MITGLIED_DETAIL_CONFIG: DetailDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.TITLE',

  formConfig: {
    properties: [
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.FORM.VORNAME.LABEL',
        propertyName:   'vorname',
        type:           FormPropertyType.TEXT,
        required:       true,
        regex:          '.*'
      },
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.FORM.NACHNAME.LABEL',
        propertyName:   'nachname',
        type:           FormPropertyType.TEXT,
        required:       true,
        regex:          '.*'
      },
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.FORM.GEBURTSDATUM.LABEL',
        propertyName:   'geburtsdatum',
        type:           FormPropertyType.TEXT,
        required:       true,
        regex:          '.*'
      },
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.FORM.MITGLIEDSNUMMER.LABEL',
        propertyName:   'mitgliedsnummer',
        type:           FormPropertyType.TEXT,
        required:       true,
        regex:          '.*'
      },
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.FORM.NATIONALITAET.LABEL',
        propertyName:   'nationalitaet',
        type:           FormPropertyType.TEXT,
        required:       false,
        regex:          '[D|F|A|C]'
      }
    ]
  }
};
