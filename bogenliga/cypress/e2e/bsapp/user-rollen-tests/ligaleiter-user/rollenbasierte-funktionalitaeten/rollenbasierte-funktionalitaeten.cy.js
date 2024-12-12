/**
 * Testblock describing all anonymous user tests as specified on Confluence
 */
function generateID() {
  return Math.floor(100000 + Math.random() * 900000);
}

function generateLigaID() {
  //generates a number between 1 and the amount of ligas that exist
  //this is an example if only 19 liga exist
  return Math.floor(Math.random() * 18 + 1);
}

describe('Ligaleiter User Tests', function(){
    const randomID = generateLigaID().toString();


    // admin wird hier abgemeldet
    // nach Test ist Ligaleiter angemeldet
    it('Ligadetail bearbeiten für zuständige Liga', function() {
/*
      cy.visit('http://localhost:4200/#/verwaltung/liga')

      cy.wait(12000)

      //Überprüfen, ob eine Liga existiert die der Ligaleiter bearbeiten kann
      cy.get('body').then($body => {
        if($body.text().includes('TeamLigaleiter@bogenliga.de')) {
          // Liga existiert
          cy.log('existiert')
        } else {
          // keine Liga existiert für die Ligaleiter zuständig ist
          // hier wird eine solche Liga erstellt

          cy.log('existiert nicht')
          cy.visit('http://localhost:4200/#/verwaltung/liga/add')

          cy.wait(10000)

          cy.get('#ligaForm > div > .form-group > .col-sm-9 > #ligaName').click()

          cy.get('#ligaForm > div > .form-group > .col-sm-9 > #ligaName').type('Ligaleiter Test Liga')

          cy.get('[data-cy=liga-detail-verantwortlicher]').select("TeamLigaleiter@bogenliga.de");

          cy.get('#ligaForm > div > .form-group > .col-sm-9 > #ligaVerantwortlicher').select('TeamLigaleiter@bogenliga.de')

          // TinyMCE Text eingeben
          cy.get('iframe#ligaDetail_ifr')
            .then(($iframe) => {
              const body = $iframe.contents().find('body');

              cy.wrap(body).clear().type('Hier ist ein Text, der eingegeben wird');
            });

          // Save Button nach Eingabe von TinyMCE Text
          cy.get('#ligaSaveButton').click();

          // nach klick auf Speichern warten
          cy.wait(6000)

          //auf ok klicken
          cy.get('#OKBtn1 > .action-btn-circle').click();
        }
      })


      // auf Profil klicken
      cy.get('.fa-user-circle').click();
      // auf ausloggen klicken
      cy.contains('Logout').click();
      cy.wait(2000);

     */

      // ab hier Ligaleiter

      cy.visit('http://localhost:4200/#/user/login')
      cy.wait(2000);

      cy.contains('Login für Team Ligaleiter').click();
      cy.wait(2000);

      cy.visit('http://localhost:4200/#/verwaltung/liga')
      cy.wait(12000)

      // auf Liga bearbeiten klicken
      cy.get('.action_icon > a > .ng-fa-icon > .fa-edit > path').click()
      cy.wait(2000)

      // random Text generieren
      const text = Math.random().toString(36).substring(2,7);
      // in TinyMCE Text eingeben
      cy.get('iframe#ligaDetail_ifr')
        .then(($iframe) => {
          const body = $iframe.contents().find('body');

          cy.wrap(body).clear().type(text);
        });

      // klick auf Update
      cy.get('#ligaForm > .form-group > .col-sm-9 > bla-actionbutton > #ligaUpdateButton').click()
      cy.wait(6000)

      cy.reload(true)
      cy.wait(2000)

      let textReadFromEditor

      // Text von Editor einlesen und mit random-Text vergleichen
      cy.window()
        .then(win => {
          textReadFromEditor = win.tinymce.activeEditor.getContent({format: 'text'});
        }).then(() => {
        expect(textReadFromEditor).to.equal(text)})

    })

    it('Neue unterste Liga hinzufuegen',function (){

      // Login Ligaleiter

      cy.visit('http://localhost:4200/#/user/login')
      cy.wait(2000);

      cy.contains('Login für Team Ligaleiter').click();
      cy.wait(2000);

      cy.visit('http://localhost:4200/#/verwaltung/liga')
      cy.wait(12000)

      /*
      cy.get('#payload-id-1127 > #undefinedActions > .action_icon > a > .ng-fa-icon > .fa-edit > path').click()

      cy.wait(13000)

      cy.get('#ligaForm > .form-group > .col-sm-9 > bla-actionbutton:nth-child(3) > #undefined').click()

      cy.get('#ligaForm > div > .form-group > .col-sm-9 > #ligaName').click()

      cy.get('#ligaForm > div > .form-group > .col-sm-9 > #ligaName').type('cypress 1')

      cy.wait(1000)



      cy.url().should('include', '#/verwaltung/liga/add')
    */

      // auf Profil klicken
      cy.get('.fa-user-circle').click();
      // auf ausloggen klicken
      cy.contains('Logout').click();
      cy.wait(2000);

      //Ligaleiter wieder ausgelogged

    })


  }
)
