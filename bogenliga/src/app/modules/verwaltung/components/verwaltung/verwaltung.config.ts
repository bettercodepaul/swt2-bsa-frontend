import {NavigationDialogConfig} from '@shared/components';

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
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.KLASSEN.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.KLASSEN.DESCRIPTION',
        icon:           'wrench',
        route:          'klassen'
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.VEREINE.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.VEREINE.DESCRIPTION',
        icon:           'sitemap',
        route:          'vereine'
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.LIGA.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.LIGA.DESCRIPTION',
        icon:           'users',
        route:          'liga'
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.REGIONEN.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.REGIONEN.DESCRIPTION',
        icon:           'sitemap',
        route:          'regionen'
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.VERANSTALTUNG.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.VERANSTALTUNG.DESCRIPTION',
        icon:           'calendar-alt',
        route:          'veranstaltung'
      },
      // When editing Bug: BSAPP-498 it was decided to comment out the site or the button related to "Sportjahre",
      // because the exactly function of the site "Sportjahre" is still unclear.
      // If the button is needed again, just delete the uncommenting below.
      /*
      {
        labelKey:       'Sportjahre',
        descriptionKey: 'Verwaltung der Sportjahre',
        icon:           'campground',
        route:          'sportjahr'
      }
      */

      ]

  }
};
