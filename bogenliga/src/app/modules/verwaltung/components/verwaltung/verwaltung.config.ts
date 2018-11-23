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
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.KLASSEN.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.KLASSEN.DESCRIPTION',
        icon:           'users',
        route:          'klassen'
      },
      {
        labelKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.DSBMANNSCHAFTEN.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.DSBMANNSCHAFTEN.DESCRIPTION',
        icon: 'campground',
        route: 'dsbmannschaft'
      }
    ]
  }
};
