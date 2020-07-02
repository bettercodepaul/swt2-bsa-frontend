import {NavigationDialogConfig} from '@shared/components';
import {UserPermission} from '@shared/services';

export const VERWALTUNG_CONFIG: NavigationDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.VERWALTUNG.TITLE',
  navigationCardsConfig:   {
    navigationCards: [
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.DSBMITGLIEDER.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.DSBMITGLIEDER.DESCRIPTION',
        icon:           'users',
        route:          'dsbmitglieder',
        permissions:    [UserPermission.CAN_MODIFY_DSBMITGLIEDER,UserPermission.CAN_MODIFY_VEREIN_DSBMITGLIEDER]
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.BENUTZER.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.BENUTZER.DESCRIPTION',
        icon:           'address-card',
        route:          'benutzer',
        permissions:    [UserPermission.CAN_MODIFY_SYSTEMDATEN]
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.KLASSEN.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.KLASSEN.DESCRIPTION',
        icon:           'wrench',
        route:          'klassen',
        permissions:    [UserPermission.CAN_MODIFY_SYSTEMDATEN]
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.VEREINE.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.VEREINE.DESCRIPTION',
        icon:           'sitemap',
        route:          'vereine',
        detailType:     'Verein',
        permissions:    [UserPermission.CAN_MODIFY_STAMMDATEN, UserPermission.CAN_CREATE_MANNSCHAFT,UserPermission.CAN_READ_MY_VEREIN]
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.LIGA.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.LIGA.DESCRIPTION',
        icon:           'users',
        route:          'liga',
        permissions:    [UserPermission.CAN_MODIFY_SYSTEMDATEN]
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.REGIONEN.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.REGIONEN.DESCRIPTION',
        icon:           'sitemap',
        route:          'regionen',
        permissions:    [UserPermission.CAN_MODIFY_SYSTEMDATEN]
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.VERANSTALTUNG.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.VERANSTALTUNG.DESCRIPTION',
        icon:           'calendar-alt',
        route:          'veranstaltung',
        permissions:    [UserPermission.CAN_MODIFY_STAMMDATEN,UserPermission.CAN_MODIFY_MY_VERANSTALTUNG],
        detailType: "Veranstaltungen",
      },
      // When editing Bug: BSAPP-498 it was decided to comment out the site or the button related to "Sportjahre",
      // because the exactly function of the site "Sportjahre" is still unclear.
      // If the button is needed again, just delete the uncommenting below.
      /*
      {
        labelKey:       'Sportjahre',
        descriptionKey: 'Verwaltung der Sportjahre',
        icon:           'campground',
        route:          'sportjahr',
       permissions:     [UserPermission.CAN_READ_MY_VERANSTALTUNG, UserPermission.CAN_READ_SPORTJAHR]
      }
      */
      ]
  }
};
