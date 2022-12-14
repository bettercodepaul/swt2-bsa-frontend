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
        icon:           'users-cog',
        route:          'dsbmitglieder',
        permissions:    [UserPermission.CAN_READ_DSBMITGLIEDER, UserPermission.CAN_MODIFY_VEREIN_DSBMITGLIEDER],
        datacy:         'verwaltung-dsb-mitglieder-button',
        tooltipText:    'MANAGEMENT.VERWALTUNG.NAVIGATION.DSBMITGLIEDER.TOOLTIP'
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.USER.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.USER.DESCRIPTION',
        icon:           'address-card',
        route:          'user',
        permissions:    [UserPermission.CAN_READ_SYSTEMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN],
        datacy:         'verwaltung-user-button',
        tooltipText:    'MANAGEMENT.VERWALTUNG.NAVIGATION.USER.TOOLTIP'
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.KLASSEN.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.KLASSEN.DESCRIPTION',
        icon:           'restroom',
        route:          'klassen',
        permissions:    [UserPermission.CAN_READ_SYSTEMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN],
        datacy:         'verwaltung-klassen-button',
        tooltipText:    'MANAGEMENT.VERWALTUNG.NAVIGATION.KLASSEN.TOOLTIP'
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.VEREINE.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.VEREINE.DESCRIPTION',
        icon:           'users',
        route:          'vereine',
        detailType:     'Verein',
        permissions:    [UserPermission.CAN_MODIFY_STAMMDATEN, UserPermission.CAN_CREATE_MANNSCHAFT, UserPermission.CAN_READ_MY_VEREIN],
        datacy:         'verwaltung-vereine-button',
        tooltipText:    'MANAGEMENT.VERWALTUNG.NAVIGATION.VEREINE.TOOLTIP'
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.LIGA.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.LIGA.DESCRIPTION',
        icon:           'sitemap',
        route:          'liga',
        permissions:    [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
        datacy:         'verwaltung-liga-button',
        tooltipText:    'MANAGEMENT.VERWALTUNG.NAVIGATION.LIGA.TOOLTIP'
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.REGIONEN.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.REGIONEN.DESCRIPTION',
        icon:           'map-marked-alt',
        route:          'regionen',
        permissions:    [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
        datacy:         'verwaltung-regionen-button',
        tooltipText:    'MANAGEMENT.VERWALTUNG.NAVIGATION.REGIONEN.TOOLTIP'
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.VERANSTALTUNG.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.VERANSTALTUNG.DESCRIPTION',
        icon:           'calendar-alt',
        route:          'veranstaltung',
        permissions:    [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_MY_VERANSTALTUNG, UserPermission.CAN_MODIFY_STAMMDATEN],
        detailType:     'Veranstaltungen',
        datacy:         'verwaltung-veranstaltung-button',
        tooltipText:    'MANAGEMENT.VERWALTUNG.NAVIGATION.VERANSTALTUNG.TOOLTIP'
      },
      {
        labelKey:       'MANAGEMENT.VERWALTUNG.NAVIGATION.EINSTELLUNGEN.LABEL',
        descriptionKey: 'MANAGEMENT.VERWALTUNG.NAVIGATION.EINSTELLUNGEN.DESCRIPTION',
        icon:           'wrench',
        route:          'einstellungen',
        permissions:    [UserPermission.CAN_MODIFY_SYSTEMDATEN],
        datacy:         'verwaltung-einstellungen-button',
        tooltipText:    'MANAGEMENT.VERWALTUNG.NAVIGATION.EINSTELLUNGEN.TOOLTIP'
      },
      ]
  }
};
