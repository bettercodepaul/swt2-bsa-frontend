export enum UserPermission {
  /**
   * has no rights but may read unrestricted data
   */
  CAN_READ_DEFAULT,

  /*
   * Permissions to work with:
   * DSB_Mitglied
   * Verein
   * Region
   * Liga
   */
  CAN_READ_STAMMDATEN,
  CAN_MODIFY_STAMMDATEN,
  CAN_DELETE_STAMMDATEN,

  /**
   * Permissions to work with:
   * Benutzer
   * Rolle
   * Recht
   * Configuration
   */
  CAN_READ_SYSTEMDATEN,
  CAN_MODIFY_SYSTEMDATEN,
  CAN_DELETE_SYSTEMDATEN,


   /*
   * Permissions to work with:
   * Ligatabelle
   * Match
   * Passe
   * Kampfrichter
   */
  CAN_READ_WETTKAMPF,
  CAN_MODIFY_WETTKAMPF,




  // für die Pflege der Daten des eigenen Vereins
  CAN_READ_MY_VEREIN,
  CAN_MODIFY_MY_VEREIN,



  // für Ligaleiter zur Modifikation der eigenen Events
  CAN_READ_MY_VERANSTALTUNG,
  CAN_MODIFY_MY_VERANSTALTUNG,



  // für Ausrichter zur Modifikation der eigenen Events
  CAN_READ_MY_ORT,
  CAN_MODIFY_MY_ORT,

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


  // für die technische User der Tablets
  CAN_OPERATE_SPOTTING,
  CAN_CREATE_STAMMDATEN,
  CAN_CREATE_SYSTEMDATEN,
  CAN_CREATE_WETTKAMPF,
  CAN_CREATE_EINSTELLUNGEN,

  // DSB Mitglieder Permissions
  CAN_READ_DSBMITGLIEDER,
  CAN_CREATE_DSBMITGLIEDER,
  CAN_MODIFY_DSBMITGLIEDER,
  CAN_DELETE_DSBMITGLIEDER,

  CAN_CREATE_MANNSCHAFT,

  CAN_CREATE_VEREIN_DSBMITGLIEDER,
  CAN_MODIFY_VEREIN_DSBMITGLIEDER,

  CAN_DELETE_MANNSCHAFT,
  CAN_MODIFY_MANNSCHAFT,

  // This is a specific LIGALEITER Permission for allowing the function 'Benutzer anlegen'
  CAN_MODIFY_SYSTEMDATEN_LIGALEITER,
  CAN_CREATE_SYSTEMDATEN_LIGALEITER,
  CAN_CREATE_STAMMDATEN_LIGALEITER,
  CAN_MODIFY_STAMMDATEN_LIGALEITER,

  //Spezielles Recht für den Ligaleiter der untersten Region, der eine neue Liga als unterste Liga anlegen darf und diese bearbeiten kann
  CAN_CREATE_MY_LIGA,
}
