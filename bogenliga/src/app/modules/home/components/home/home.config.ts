import {CommonDialogConfig} from '../../../shared/components/dialogs';
import {
  ShortcutButtonsConfig
} from '@shared/components/buttons/shortcut-button/types/shortcut-buttons-config.interface';
import {UserPermission} from '@shared/services';
// @ts-ignore
import AddManschaftsmitglied from '../home/Buttons/AddManschaftsmitglied.svg';
// @ts-ignore
import DSBMitgliedAnlegen from '../home/Buttons/DSBMitgliedAnlegen.svg';
// @ts-ignore
import ManschaftAnlegen from '../home/Buttons/ManschaftAnlegen.svg';
// @ts-ignore
import Terminübersicht from '../home/Buttons/Terminübersicht.svg';
// @ts-ignore
import VeranstaltungAnlegen from '../home/Buttons/VeranstaltungAnlegen.svg';
// @ts-ignore
import VorauswahlVeranstaltung from '../home/Buttons/VorauswahlVeranstaltung.svg';

import {Routes, RouterModule } from '@angular/router';
import {DsbMitgliedDetailComponent, LigaDetailComponent, VerwaltungComponent} from '@verwaltung/components';
import {NgModule} from '@angular/core';


export const HOME_CONFIG: CommonDialogConfig = {
  moduleTranslationKey:    'HOME',
  pageTitleTranslationKey: 'HOME.HOME.TITLE',
};

const routes: Routes = [
  { path: 'Verwaltung', component: LigaDetailComponent}
];

// @ts-ignore
export const HOME_SHORTCUT_BUTTON_CONFIG: ShortcutButtonsConfig = {
  shortcutButtons: [
    {
      title: 'Terminübersicht',
      icon: Terminübersicht,
      route: '#',
      permissions: [UserPermission.CAN_READ_WETTKAMPF],
      roles:[""]
    },
    {
      title: 'Vorauswahl Veranstaltungen',
      icon: VorauswahlVeranstaltung,
      route: '#',
      permissions: [UserPermission.CAN_READ_STAMMDATEN],
      roles:[""]
    },
    {
      title: 'Veranstaltung anlegen',
      icon: VeranstaltungAnlegen,
      route: '#',
      permissions: [UserPermission.CAN_READ_STAMMDATEN],
      roles: [""]
    },
    {
      title: 'Manschaftsmitglied hinzufügen',
      icon: AddManschaftsmitglied,
      route: '/Verwaltung',
      permissions: [UserPermission.CAN_MODIFY_MANNSCHAFT, UserPermission.CAN_MODIFY_MY_VEREIN],
      roles: ['']
    },
    {
      title: 'DSB-Mitglied Anlegen',
      icon: DSBMitgliedAnlegen,
      route: '#',
      permissions: [UserPermission.CAN_CREATE_DSBMITGLIEDER, UserPermission.CAN_CREATE_VEREIN_DSBMITGLIEDER],
      roles:["Sportleiter", ""]
    },
    {
      title: 'Mannschaften anlegen',
      icon: ManschaftAnlegen,
      route: '#',
      permissions: [UserPermission.CAN_CREATE_MANNSCHAFT, UserPermission.CAN_MODIFY_STAMMDATEN],
      roles:[""]
    },
  ]
};

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class HomeConfig {}
