/**
 * Helfer fuer die Cypress-Tests des Tablet-Schusszettels.
 *
 * Testdaten: LOCAL-Migration V39 ("Demo Wettkampfdurchfuehrung", Sportjahr 2025),
 * Wettkampf 3001 mit den Mannschaften 3001-3008 (je genau 3 Schuetzen).
 * Vor jedem Spec wird der Wettkampf per SQL auf den Ausgangszustand
 * zurueckgesetzt (alle Sessions starten in SCHUETZENMELDUNG, Match 1, Passe 1).
 */

export const WETTKAMPF_ID = 3001;

/**
 * Setzt den Demo-Wettkampf in der lokalen DB zurueck und "waermt" die
 * Sessions per API auf (der erste Abruf nach dem Reset legt die Sessions
 * fuer alle 8 Teams neu an und dauert ~1 Minute).
 *
 * Anschliessend wird verifiziert, dass wirklich 8 frische Sessions in
 * SCHUETZENMELDUNG existieren. Haengt vom vorherigen (abgebrochenen)
 * Testlauf serverseitig noch ein Sessions-Request, kann der nach dem
 * Reset alte Zustaende/Duplikate hinterlassen - dann wird der Reset
 * einmal wiederholt.
 */
export const resetDemoWettkampf = () => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('BACKEND_URL')}/v1/user/signin`,
    body: { username: 'admin@bogenliga.de', password: 'admin' },
  }).then((loginResponse) => {
    resetMitWarmup(loginResponse.body.jwt, 1);
  });
};

const resetMitWarmup = (jwt, versuch) => {
  cy.exec(`"${Cypress.env('PSQL_PATH')}" ${psqlArgs()} -v ON_ERROR_STOP=1 -f cypress/support/sql/reset-tablet-demo.sql`, {
    env: { PGPASSWORD: Cypress.env('DB_PASSWORD') },
  }).its('code').should('eq', 0);

  cy.request({
    method: 'GET',
    url: `${Cypress.env('BACKEND_URL')}/v1/tablet-schusszettel/sessions?wettkampfid=${WETTKAMPF_ID}`,
    headers: { Authorization: `Bearer ${jwt}` },
    timeout: 180000,
  }).its('status').should('eq', 200);

  // Die Session-Anlage hat kein Unique-Constraint auf (wettkampf, team):
  // laeuft vom vorherigen (abgebrochenen) Lauf serverseitig noch ein
  // Sessions-Request, entstehen Duplikate. Aeltere Duplikate entfernen.
  sqlAusfuehren(
    `DELETE FROM schusszettel_tablet_session s USING schusszettel_tablet_session d ` +
    `WHERE s.wettkampf_id=${WETTKAMPF_ID} AND d.wettkampf_id=${WETTKAMPF_ID} ` +
    `AND s.team_id=d.team_id AND s.id < d.id;`
  );

  // Verifizieren: genau 8 Sessions, alle frisch in SCHUETZENMELDUNG
  sqlAbfrage(
    `SELECT count(*) || '/' || count(*) FILTER (WHERE status='SCHUETZENMELDUNG') ` +
    `FROM schusszettel_tablet_session WHERE wettkampf_id=${WETTKAMPF_ID};`
  ).then((stdout) => {
    const frisch = stdout.trim() === '8/8';
    if (!frisch && versuch < 2) {
      cy.log(`Reset-Ergebnis nicht frisch (${stdout.trim()}) - wiederhole Reset`);
      resetMitWarmup(jwt, versuch + 1);
      return;
    }
    expect(stdout.trim(), '8 frische Sessions nach Reset').to.eq('8/8');
  });
};

/** Fuehrt eine SQL-Abfrage aus und liefert die Ausgabe (Spalten mit | getrennt). */
export const sqlAbfrage = (statement) =>
  cy.exec(`"${Cypress.env('PSQL_PATH')}" ${psqlArgs()} -t -A -v ON_ERROR_STOP=1 -c "${statement}"`, {
    env: { PGPASSWORD: Cypress.env('DB_PASSWORD') },
  }).its('stdout');

/** Fuehrt ein einzelnes SQL-Statement gegen die lokale DB aus. */
export const sqlAusfuehren = (statement) => {
  cy.exec(`"${Cypress.env('PSQL_PATH')}" ${psqlArgs()} -v ON_ERROR_STOP=1 -c "${statement}"`, {
    env: { PGPASSWORD: Cypress.env('DB_PASSWORD') },
  }).its('code').should('eq', 0);
};

const psqlArgs = () =>
  `-h ${Cypress.env('DB_HOST')} -p ${Cypress.env('DB_PORT')} -U ${Cypress.env('DB_USER')} -d ${Cypress.env('DB_NAME')}`;

/** Meldet sich ueber den Testbenutzer-Shortcut als Admin an. */
export const loginAlsAdmin = () => {
  cy.visit('/#/user/login');
  cy.get('[data-cy=login-als-admin-button]').click();
  cy.url({ timeout: 20000 }).should('include', '/home');
};

/**
 * Oeffnet die Tablet-Setup-Seite direkt per URL (Login muss bereits erfolgt sein)
 * und liefert die Sessions aus der Backend-Antwort.
 */
let ladeSessionsZaehler = 0;

export const geheZuTabletSetup = () => {
  const zielUrl = `/#/schusszettel/tablet-setup/${WETTKAMPF_ID}`;
  // Eindeutiger Alias pro Aufruf: cy.wait konsumiert Alias-Requests FIFO,
  // mit einem wiederverwendeten Alias kaeme sonst u.U. eine alte,
  // gequeute Response zurueck.
  const alias = `ladeSessions${++ladeSessionsZaehler}`;
  cy.intercept('GET', '**/tablet-schusszettel/sessions*').as(alias);
  // Steht der Browser bereits auf der Ziel-URL, loest ein erneutes
  // cy.visit keinen Request aus -> dann stattdessen neu laden.
  cy.url().then((aktuelleUrl) => {
    if (aktuelleUrl.endsWith(zielUrl)) {
      cy.reload();
    } else {
      cy.visit(zielUrl);
    }
  });
  return cy.wait(`@${alias}`, { timeout: 30000 })
           .then((interception) => {
             expect(interception.response.statusCode).to.eq(200);
             return interception.response.body.tabletSessionSingDTOs;
           });
};

/**
 * Kompletter Klickpfad wie ein echter Benutzer:
 * Sidebar -> Wettkampfdurchfuehrung -> Veranstaltung -> Wettkampftag 1
 * -> Druckdaten -> "Setup Tablet Schusszettel".
 */
export const geheZuTabletSetupUeberMenu = () => {
  cy.get('[data-cy=sidebar-wkdurchfuehrung-button]').click();
  cy.url().should('include', '/wkdurchfuehrung');

  // Demo-Veranstaltung waehlen (Expand-Menues sind initial aufgeklappt)
  cy.get('[data-cy=wkduchfuehrung-veranstaltung-list] select option')
    .contains('Demo Wettkampfdurchfuehrung')
    .invoke('val')
    .then((optionValue) => {
      cy.get('[data-cy=wkduchfuehrung-veranstaltung-list] select').select(optionValue);
    });

  // Wettkampftag 1 ueber den "Auswaehlen"-Button der ersten Tabellenzeile waehlen
  cy.get('[data-cy=wkdurchfuehrung-wettkampftage-list] tbody tr', { timeout: 15000 })
    .first()
    .contains('Auswählen')
    .click();

  // Druckdaten-Bereich klappt automatisch auf, sobald ein Wettkampftag gewaehlt ist
  cy.get('#setupTabletSchusszettel', { timeout: 15000 }).should('be.visible').click();
  cy.url().should('include', `/schusszettel/tablet-setup/${WETTKAMPF_ID}`);
};

/** Baut die Tablet-URL, die sonst im QR-Code des Admin-Modals steckt. */
export const tabletUrl = (session) =>
  `/#/schusszettel/tablet?token=${encodeURIComponent(session.token)}` +
  `&teamid=${session.teamId}&wettkampfid=${WETTKAMPF_ID}`;

/** Sucht die Tabellenzeile eines Teams in der Admin-Sitzungstabelle. */
export const sessionZeile = (teamName) =>
  cy.contains('.session-table tbody td', teamName).parents('tr');

/**
 * Oeffnet das Tablet eines Teams und klickt die Zustands-Uebersicht
 * (Maske 4) ueber den "Weiter"-Button weg.
 */
let ladeTabletZaehler = 0;

export const oeffneTabletMitWeiter = (session) => {
  // Beim Wechsel zwischen zwei Tablet-URLs aendert sich nur der Hash:
  // die alte Maske bleibt sichtbar, bis die neuen Daten geladen sind.
  // Deshalb auf genau diesen Lade-Request warten (eindeutiger Alias und
  // Token im URL-Muster, damit kein aelterer Request konsumiert wird).
  const alias = `ladeTablet${++ladeTabletZaehler}`;
  const tokenMuster = session.token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  cy.intercept({
    method: 'GET',
    url: new RegExp(`/v1/tablet-schusszettel\\?token=${tokenMuster}&`),
  }).as(alias);
  // Steht der Browser bereits auf genau dieser Tablet-URL, loest cy.visit
  // keinen Reload (und damit keinen Request) aus -> dann neu laden.
  cy.url().then((aktuelleUrl) => {
    if (aktuelleUrl.endsWith(tabletUrl(session))) {
      cy.reload();
    } else {
      cy.visit(tabletUrl(session));
    }
  });
  cy.wait(`@${alias}`, { timeout: 30000 });
  // Kurz rendern lassen, dann die Uebersicht verlassen
  cy.wait(300);
  cy.get('button.weiter-button', { timeout: 20000 }).click();
  cy.get('.maske4-zustand', { timeout: 10000 }).should('not.exist');
};

/**
 * Fuehrt auf der Registrierungs-Maske die Schuetzenmeldung durch:
 * waehlt in den drei Dropdowns je den ersten freien Schuetzen,
 * klickt "Melden" und bestaetigt die Sicherheitsabfrage.
 */
export const meldeDreiSchuetzen = () => {
  cy.get('select.shooter-menu', { timeout: 20000 }).should('have.length', 3);
  [0, 1, 2].forEach((menuIndex) => {
    waehleErstenFreienSchuetzen(menuIndex);
  });
  cy.get('button.confirm-button').should('not.be.disabled').click();
  cy.get('.confirm-box').should('be.visible');
  cy.intercept('POST', '**/tablet-schusszettel*').as('meldungPost');
  cy.get('button.confirm-yes').click();
  cy.wait('@meldungPost', { timeout: 20000 })
    .its('response.statusCode').should('be.within', 200, 299);
  // Nach der Meldung laedt das Tablet neu und zeigt wieder die Uebersicht
  cy.get('button.weiter-button', { timeout: 20000 }).should('be.visible');
};

/** Waehlt im Dropdown menuIndex die erste nicht gesperrte Option. */
export const waehleErstenFreienSchuetzen = (menuIndex) => {
  cy.get('select.shooter-menu').eq(menuIndex)
    .find('option:not([disabled])')
    .first()
    .invoke('val')
    .then((optionValue) => {
      cy.get('select.shooter-menu').eq(menuIndex).select(optionValue);
    });
};

/**
 * Traegt auf der Treffer-Eingabemaske eine komplette Passe ein und bestaetigt.
 * @param werte Array mit [schuss1, schuss2] je Schuetze, z.B. [[10, 9], [9, 8], [10, 10]]
 */
export const trageSatzEin = (werte) => {
  cy.get('table.treffer-table tbody tr', { timeout: 20000 }).should('have.length', 3);
  werte.forEach(([schuss1, schuss2], zeile) => {
    cy.get(`#schuss1-${zeile}`).clear().type(String(schuss1));
    cy.get(`#schuss2-${zeile}`).clear().type(String(schuss2));
  });
  cy.intercept('POST', '**/tablet-schusszettel*').as('satzPost');
  cy.get('button.confirm-button').should('not.be.disabled').click();
  cy.wait('@satzPost', { timeout: 20000 })
    .its('response.statusCode').should('be.within', 200, 299);
};

/**
 * Kompletter Team-Zug fuer eine Passe: Tablet oeffnen, Uebersicht wegklicken,
 * Werte eintragen, bestaetigen.
 */
export const fuehrePasseDurch = (session, werte) => {
  oeffneTabletMitWeiter(session);
  trageSatzEin(werte);
};

/**
 * Kompletter Erstzugriff eines Teams: Tablet oeffnen und Schuetzen melden.
 * Danach steht die Session in SATZEINGABE.
 */
export const registriereTeam = (session) => {
  oeffneTabletMitWeiter(session);
  meldeDreiSchuetzen();
};
