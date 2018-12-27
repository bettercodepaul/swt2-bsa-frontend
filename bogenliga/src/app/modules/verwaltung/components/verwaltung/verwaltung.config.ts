import {NavigationDialogConfig} from '../../../shared/components/dialogs';

export const VERWALTUNG_CONFIG: NavigationDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.VERWALTUNG.TITLE',
  navigationCardsConfig:   {
    navigationCards: [
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.DSBMITGLIEDER.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.DSBMITGLIEDER.DESCRIPTION',
        icon:           'users',
        route:          'dsbmitglieder'
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.BENUTZER.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.BENUTZER.DESCRIPTION',
        icon:           'address-card',
        route:          'benutzer'
      }
    ]
  }
};
