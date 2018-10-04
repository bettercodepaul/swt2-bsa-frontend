export enum UserPermission {
  /*
   * Permissions to work with:
   * DSB_Mitglied
   * Verein
   * Region
   * Liga
   */
  CAN_READ_STAMMDATEN,
  CAN_MODIFY_STAMMDATEN,

  /*
   * Permissions to work with:
   * Wettkampf
   * Match
   * Passe
   * Kampfrichter
   */
  CAN_READ_WETTKAMPF,
  CAN_MODIFY_WETTKAMPF,

  /*
   * Permissions to work with:
   * Veranstaltung
   * Wettkampftyp
   * Ligatabelle
   * Klasse
   * Disziplin
   */
  CAN_READ_SPORTJAHR,
  CAN_MODIFY_SPORTJAHR,

  /**
   * Permissions to work with: Benutzer Rolle Recht Configuration
   */
  CAN_READ_SYSTEMDATEN,
  CAN_MODIFY_SYSTEMDATEN

}
