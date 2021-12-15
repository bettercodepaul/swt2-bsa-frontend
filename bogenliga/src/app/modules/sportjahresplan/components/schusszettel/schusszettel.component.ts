import {Component, OnInit} from '@angular/core';
import {MatchDOExt} from '../../types/match-do-ext.class';
import {PasseDO} from '../../types/passe-do.class';
import {SchusszettelProviderService} from '../../services/schusszettel-provider.service';
import {BogenligaResponse, RequestResult, UriBuilder} from '../../../shared/data-provider';
import {MatchProviderService} from '../../services/match-provider.service';
import {isUndefined} from '@shared/functions';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../shared/services';
import {environment} from '@environment';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {PasseDataProviderService} from '@wettkampf/services/passe-data-provider.service';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {PasseDoClass} from '@verwaltung/types/passe-do-class';
import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {MannschaftsmitgliedDataProviderService} from '@verwaltung/services/mannschaftsmitglied-data-provider.service';

const NOTIFICATION_ZURUECK = 'schusszettel-weiter';
const NOTIFICATION_WEITER_SCHALTEN = 'schusszettel_weiter';
const NOTIFICATION_SCHUSSZETTEL_EINGABEFEHLER = 'schusszettelEingabefehler';
const NOTIFICATION_SCHUSSZETTEL_ENTSCHIEDEN = 'schusszettelEntschieden';
const NOTIFICATION_SCHUSSZETTEL_SPEICHERN = 'schusszettelSave';
const NOTIFICATION_SCHUSSZETTEL_SCHUETZENNUMMER = 'schusszettelEntschieden';
const NOTIFACTION_SCHUETZE = 'schuetze';


@Component({
  selector:    'bla-schusszettel',
  templateUrl: './schusszettel.component.html',
  styleUrls:   ['./schusszettel.component.scss']
})
export class SchusszettelComponent implements OnInit {

  tempMatch: MatchDOExt;
  tempMannschaft1: MatchDOExt;
  tempMannschaft2: MatchDOExt;
  match1: MatchDOExt;
  match2: MatchDOExt;
  dirtyFlag: boolean;
  match1singlesatzpoints = [];
  match2singlesatzpoints = [];
  popupSelberTag: boolean;
  popupAndererTag: boolean;
  mannschaften: DsbMannschaftDO[] = [];
  vereine: VereinDO[] = [];
  allPasse: PasseDoClass[] = [];
  allWettkaempfe: WettkampfDO[];
  allVeranstaltungen: VeranstaltungDO[];
  passeSelberTag: number;
  passeAndererTag: number;
  selberTagVeranstaltung: string;
  andererTagVeranstaltung: VeranstaltungDO;
  andererTagAnzahl: number;
  ligaleiterAktuelleLiga: string;
  ligaleiterVorherigeLiga: string;

  matchMannschaft: DsbMannschaftDO;
  matchAllPasseMannschaft: PasseDoClass[];
  wettkampf: WettkampfDO;
  veranstaltung: VeranstaltungDO;
  matchAllPasse = new Array<PasseDO>();

  selberWettkampftag = new Array<boolean>();
  selberWettkampftagVeranstaltung = Array<VeranstaltungDO>();
  vorherigerWettkampf: WettkampfDO;
  vorherigeVeranstaltung: VeranstaltungDO;
  anzahlAnTagenMannschaft = new Array<Array<number>>();
  veranstaltungVorherig: VeranstaltungDO;
  veranstaltungGegenwaertig: VeranstaltungDO;

  allowedMitglieder1: number[];
  allowedMitglieder2: number[];


  constructor(private router: Router,
              private schusszettelService: SchusszettelProviderService,
              private matchProvider: MatchProviderService,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private vereinDataProvider: VereinDataProviderService,
              private dsbMannschaftDataProvider: DsbMannschaftDataProviderService,
              private passeDataProvider: PasseDataProviderService,
              private wettkampfDataProvider: WettkampfDataProviderService,
              private veranstaltungDataProvider: VeranstaltungDataProviderService,
              private mannschaftsMitgliedDataProvider: MannschaftsmitgliedDataProviderService
  ) {
  }

  /**
   * Called when component is initialized.
   *
   * Initializes the match objects needed for template bindings,
   * then reads the matchIds from url and gets them via schusszettel-service.
   */
  ngOnInit() {
    // initialwert schützen inputs

    this.match1 = new MatchDOExt(null, null, null, 1, 1, 1, 1, [], 0, 0, null, null);
    this.match1.nr = 1;
    this.match1.schuetzen = [];
    this.match1singlesatzpoints = [];

    this.match2 = new MatchDOExt(null, null, null, 1, 1, 1, 1, [], 0, 0, null, null);
    this.match2.nr = 1;
    this.match2.schuetzen = [];
    this.match2singlesatzpoints = [];

    // am Anfang sind keine Änderungen
    this.dirtyFlag = false;
    // this.initSchuetzen();
    this.initSchuetzenMatch1();
    this.initSchuetzenMatch2();

    this.route.params.subscribe((params) => {
      if (!isUndefined(params['match1id']) && !isUndefined(params['match2id'])) {
        const match1id = params['match1id'];
        const match2id = params['match2id'];

        //Notification while preparing
        this.notificationService.showNotification({
          id:          'NOTIFICATION_SCHUSSZETTEL_LOADING',
          title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.LADEN.TITLE',
          description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.LADEN.DESCRIPTION',
          severity:    NotificationSeverity.INFO,
          origin:      NotificationOrigin.USER,
          userAction:  NotificationUserAction.PENDING
        });


        this.schusszettelService.findMatches(match1id, match2id)
            .then((data: BogenligaResponse<Array<MatchDOExt>>) => {

              this.tempMannschaft1 = data.payload[0];
              this.tempMannschaft2 = data.payload[1];
              this.tempMatch = data.payload[0];

              //this.initSchuetzenMatch1();
              //this.initSchuetzenMatch2();

              console.log('tempMatch', this.tempMatch);
              //console.log('M1', this.match1);
              //console.log('M2', this.match2);


              /*
              this.match1.id = this.tempMannschaft1.id;
              this.match1.mannschaftId = this.tempMannschaft1.mannschaftId;
              this.match1.mannschaftName = this.tempMannschaft1.mannschaftName;
              this.match1.wettkampfTag = this.tempMannschaft1.wettkampfTag;
              this.match1.wettkampfTyp = this.tempMannschaft1.wettkampfTyp;
              this.match1.matchpunkte = this.tempMannschaft1.matchpunkte;

              this.match2.id = this.tempMannschaft2.id;
              this.match2.mannschaftId = this.tempMannschaft2.mannschaftId;
              this.match2.mannschaftName = this.tempMannschaft2.mannschaftName;
              this.match2.wettkampfTag = this.tempMannschaft2.wettkampfTag;
              this.match2.wettkampfTyp = this.tempMannschaft2.wettkampfTyp;
              this.match2.matchpunkte = this.tempMannschaft2.matchpunkte;

               this.initSchuetzenMatch1();
               this.initSchuetzenMatch2();

               */

              //console.log('Match Temp1', this.tempMannschaft1);
              //console.log('Match Temp2', this.tempMannschaft2);


              //console.log('Match Pos1', this.match1);
              //console.log('Match Pos12', this.match2);

              for(let i = 0; i <this.tempMatch.schuetzen.length; i++) {

                let tempM1 = 0;
                let tempM2 = 0;
                console.log('Passe an Stelle ${i}', this.match1.schuetzen[i]);
                for(let j= 0; j<this.tempMatch.schuetzen[i].length; j++) {
                  if(this.tempMannschaft1.mannschaftId == this.tempMatch.schuetzen[i][j].mannschaftId && tempM1 <5) {

                    console.log('insert M1',this.tempMatch.schuetzen[i][j], 'tempM1', tempM1);

                    this.match1.schuetzen[i][tempM1] = this.tempMatch.schuetzen[i][j];
                    ++tempM1;

                    console.log('M1',this.match1.schuetzen[i][tempM1-1], 'tempM1', tempM1);

                  } else if(this.tempMannschaft2.mannschaftId == this.tempMatch.schuetzen[i][j].mannschaftId && tempM2 < 5) {
                    //console.log('Insert M2', this.tempMatch.schuetzen[i][j], 'TempM2', tempM2);
                    //console.log('Insert M2', this.match2.schuetzen, 'TempM2', tempM2);
                    //console.log('Insert M2', this.match2.schuetzen[i], 'TempM2', tempM2);

                    this.match2.schuetzen[i][tempM2] = this.tempMatch.schuetzen[i][j];
                    ++tempM2;

                    //console.log('M2', this.match2.schuetzen[i][tempM2-1],'TempM2', tempM2);
                  } else {
                    console.log('not a Memeber of M1 and M2', this.tempMatch.schuetzen[i][j]);
                  }
                }
              }

              console.log('match1', this.match1);
              console.log('match2', this.match2);
              let shouldInitSumSatz = true;
              if (this.match1.schuetzen.length <= 0) {
                this.initSchuetzenMatch1();
                shouldInitSumSatz = false;
              }

              if (this.match2.schuetzen.length <= 0) {
                this.initSchuetzenMatch2();
                shouldInitSumSatz = false;
              }


              if (shouldInitSumSatz) {
                this.initSumSatz();
                this.setPoints();
              }

              this.wettkampfDataProvider.findAllowedMember(this.match1.wettkampfId, this.match1.mannschaftId, this.match2.mannschaftId).then((value) => {
                this.allowedMitglieder1=value;
                console.log('Allowed for match1: ', this.allowedMitglieder1);
                if(this.match1.wettkampfId == this.match2.wettkampfId){
                  this.allowedMitglieder2 = this.allowedMitglieder1;
                  //Close notification when ready
                  this.notificationService.discardNotification();
                }
              });
              if(this.match1.wettkampfId != this.match2.wettkampfId){
                this.wettkampfDataProvider.findAllowedMember(this.match2.wettkampfId, this.match1.mannschaftId, this.match2.mannschaftId).then((value)=>{
                  this.allowedMitglieder2 = value;
                  console.log('Allowed for match2: ', this.allowedMitglieder2);
                  //Close notification when ready
                  this.notificationService.discardNotification();
                });
              }
            }, (error) => {
              console.error(error);
            });

      }
    });
    this.getAllMannschaften();
    this.getAllVerein();
    this.getAllPasse();
    this.getAllWettkaempfe();
    this.getAllVeranstaltungen();

  }

  /**
   * Called when ngModel for passe.ringzahlPfeilx changes.
   * If the new, inputed value contains a '+', the ringzahl is set to 10.
   * With the params, the correct PasseDO and its ringzahlPfeilx is selected and set.
   * The value is a string, so before setting the ringzahl it needs to be parsed to number.
   * After that, sets the match's sumSatzx depending on which Satz was edited.
   * @param value
   * @param matchNr
   * @param rueckennnummer
   * @param satzNr
   * @param pfeilNr
   */
  onChange(value: string, matchNr: number, rueckennummer: number, satzNr: number, pfeilNr: number) {
    const match = this['match' + matchNr];
    const satz = match.schuetzen[rueckennummer][satzNr];
    let realValue = parseInt(value, 10); // value ist string, ringzahlen sollen number sein -> value in number umwandeln
    realValue = realValue >= 0 ? realValue : null;
    pfeilNr === 1 ? satz.ringzahlPfeil1 = realValue : satz.ringzahlPfeil2 = realValue;
    match.sumSatz[satzNr] = this.getSumSatz(match, satzNr);
    this.setPoints();
    this.dirtyFlag = true; // Daten geändert
  }

  async onSchuetzeChange(value: string, matchNr: number, rueckennummer: number){
    const mannschaftId = matchNr == 1 ? this.match1.mannschaftId : this.match2.mannschaftId;

    let valid = true;
    let allowed = [];
    let mitglied = null;

    try {
      mitglied = await this.mannschaftsMitgliedDataProvider.findByTeamIdAndRueckennummer(mannschaftId, value);
    }catch (e){
      valid = false;
    }

    if(mitglied != null && mitglied.result == RequestResult.SUCCESS) {
      let dsbNummer = mitglied.payload.dsbMitgliedId;
      console.log('DsbNummer for Mannschaftsmitglied in Mannschaft ' +
        mannschaftId + " and Rueckennummer " + value + " is " + dsbNummer);

      allowed = matchNr == 1 ? this.allowedMitglieder1 : this.allowedMitglieder2;

      if (!allowed.includes(dsbNummer)) {
        valid = false;
      }
    }

    if(!valid){
      this.notificationService.showNotification({
        id:          'NOTIFICATION_SCHUSSZETTEL_SCHUETZENNUMMER',
        title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.SCHUETZENNUMMER.TITLE',
        description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.SCHUETZENNUMMER.DESCRIPTION',
        severity:    NotificationSeverity.ERROR,
        origin:      NotificationOrigin.SYSTEM,
        type:        NotificationType.OK,
        userAction:  NotificationUserAction.ACCEPTED
      });
    }
  }

  onFehlerpunkteChange(value: string, matchNr: number, satzNr: number) {
    const match = this['match' + matchNr];
    let realValue = parseInt(value, 10); // value ist string, ringzahlen sollen number sein -> value in number -->
                                         // umwandeln
    realValue = realValue >= 1 ? realValue : null;
    match.fehlerpunkte[satzNr] = realValue;
    match.sumSatz[satzNr] = this.getSumSatz(match, satzNr);
    this.setPoints();
    this.dirtyFlag = true; // Daten geändert
  }


  private getAllMannschaften(): void {
    this.dsbMannschaftDataProvider.findAll()
        .then((response: BogenligaResponse<DsbMannschaftDO[]>) => {
          this.mannschaften = response.payload;
        });
  }

  private getAllVerein(): void {
    this.vereinDataProvider.findAll()
        .then((response: BogenligaResponse<VereinDO[]>) => {
          this.vereine = response.payload;
        });
  }

  private getAllPasse(): void {
    this.passeDataProvider.findAll()
        .then((response: BogenligaResponse<PasseDoClass[]>) => {
          this.allPasse = response.payload;
        });
  }

  private getAllWettkaempfe(): void {
    this.wettkampfDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfDO[]>) => {
          this.allWettkaempfe = response.payload;
        });
  }

  private getAllVeranstaltungen(): void {
    this.veranstaltungDataProvider.findAll()
        .then((response: BogenligaResponse<VeranstaltungDO[]>) => {
          this.allVeranstaltungen = response.payload;
        });
  }

  private maxMannschaftsId(): number {
    let maxMid = this.mannschaften[0].id;
    this.mannschaften.forEach((mannschaft) => {
      if (mannschaft.id > maxMid) {
        maxMid = mannschaft.id;
      }
    });
    return maxMid;
  }

  private getInfosToCheckSchuetze(match: MatchDOExt): void {
    // Ermittlung der Mannschaft, der Schützen, des Vereins, der Mannschaften des Vereins von match1
    // Ermittlung des Wettkampfs und der Veranstaltung

    this.matchMannschaft = this.mannschaften.find((mannschaft) => mannschaft.id === match.mannschaftId);
    this.matchAllPasseMannschaft = this.allPasse.filter((passe) => passe.mannschaftId === this.matchMannschaft.id);
    this.wettkampf = this.allWettkaempfe.find((wettkampf) => wettkampf.id === match.wettkampfId);
    this.veranstaltung = this.allVeranstaltungen.find((veranstaltung) => veranstaltung.id === this.matchMannschaft.veranstaltungId);
    for (let i = 0; i < match.schuetzen.length; i++) {
      this.matchAllPasse[i] = match.schuetzen[i][0];
    }
    // Vergleich aller Schützen mit den Schützen von match1
    // Ermittlung, ob der Schütze bereits geschossen hat, wann (Wettkampftag) und wo (Veranstaltung/Liga) und wie oft

    // ist es derselbe Wettkampftag gewesen?
    this.selberWettkampftag.length = this.matchAllPasse.length;
    // und welche Veranstaltung war es
    this.selberWettkampftagVeranstaltung.length = this.matchAllPasse.length;

    // Anzahl an Veranstaltungen orientiert sich der Einfachheit halber an der höchsten VeranstaltungsId
    // 2 dimensionales Array für jeden Schützen von match1 und jede Mannschaft, mit der er möglicherweise
    // teilgenommen hat, wird die Anzahl an Wettkampftagen, an denen geschossen wurde, gespeichert
    const maxMannschaftId = this.maxMannschaftsId();
    for (let i = 0; i < this.matchAllPasse.length; i++) {
      this.anzahlAnTagenMannschaft[i] = [];
      for (let j = 0; j < maxMannschaftId; j++) {
        this.anzahlAnTagenMannschaft[i][j] = 0;
      }
    }
  }

  private getBereitsgeschossenToCheckSchuetze(): void {
    // Ermittlung der Anzahl der Wettkampftage
    this.allPasse.forEach((passe) => {
      for (let i = 0; i < this.matchAllPasse.length; i++) {

        // Aussortierung aller Schützen, die nicht Teil von match1 sind
        if (passe.dsbMitgliedId === this.matchAllPasse[i].dsbMitgliedId) {

          // Ermittlung des Wettkampfs
          this.vorherigerWettkampf = this.allWettkaempfe.find((wettkampf) => passe.wettkampfId === wettkampf.id);

          // Ermittlung der Veranstaltung
          this.vorherigeVeranstaltung = this.allVeranstaltungen.find((veranstaltung) => veranstaltung.id === this.vorherigerWettkampf.wettkampfVeranstaltungsId);

          // Aussortierung aller Veranstaltungen von vorherigen Sportjahren
          if (this.vorherigeVeranstaltung.sportjahr === this.veranstaltung.sportjahr) {

            // Ermittlung, ob es derselbe Wettkampftag war
            if (this.vorherigerWettkampf.wettkampfTag === this.wettkampf.wettkampfTag) {
              this.selberWettkampftag[i] = true;
              this.selberWettkampftagVeranstaltung[i] = this.vorherigeVeranstaltung;
            }

            // Zuweisung der Teilnahme an der Veranstaltung an anzahlAnTagenMannschaft
            this.anzahlAnTagenMannschaft[i][passe.mannschaftId] += 1;
          }
        }
      }
    });
  }

  private darunterLiegendeMannschaftenToCheckSchuetze(mannschaftsId: number, passe: PasseDO, positionMatchAllPasse: number): void {
    const mannschaft = this.mannschaften.find((mannschaftVal) => mannschaftVal.id === mannschaftsId);
    for (const mannschaftValue of this.mannschaften) {
      if (mannschaftValue.vereinId === mannschaft.vereinId && mannschaftValue.id !== mannschaftsId) {
        if (mannschaftValue.nummer > mannschaft.nummer && mannschaft.veranstaltungId !== mannschaftValue.veranstaltungId) {
          this.allPasse.forEach((passeDoClass) => {
            if (passeDoClass.dsbMitgliedId === passe.dsbMitgliedId) {
              if (this.anzahlAnTagenMannschaft[positionMatchAllPasse][mannschaftValue.id] >= 1) {
                this.passeAndererTag = passeDoClass.dsbMitgliedId;
                this.andererTagAnzahl = this.anzahlAnTagenMannschaft[positionMatchAllPasse][mannschaftsId];
                this.andererTagVeranstaltung = this.veranstaltung;
                console.log('Popup: ', this.passeAndererTag, 'hat bereits ', this.andererTagAnzahl, ' Mal in der', this.andererTagVeranstaltung.name);
                this.veranstaltungVorherig = this.allVeranstaltungen.find((veranstaltung) => mannschaftValue.veranstaltungId === veranstaltung.id);
                this.veranstaltungGegenwaertig = this.allVeranstaltungen.find((veranstaltung) => mannschaft.veranstaltungId === veranstaltung.id);
                this.ligaleiterAktuelleLiga = this.veranstaltungGegenwaertig.ligaleiterEmail;
                this.ligaleiterVorherigeLiga = this.veranstaltungVorherig.ligaleiterEmail;
                this.savepopAndererTag();
              }
            }
          });
        }
      }
    }
  }

  private checkSchuetze(match: MatchDOExt): void {
    this.getInfosToCheckSchuetze(match);
    this.getBereitsgeschossenToCheckSchuetze();

    // Kontrolle, ob die die Regeln eingehalten wurden
    /*
    for (let i = 0; i < this.matchAllPasse.length; i++) {

      // Hat der Schütze 2x in einer Liga geschossen -> darf er nicht mehr in einer Liga darunter schießen
      // hat er bereits in einer Liga darunter geschossen, werden die Ergebnisse auf verloren gesetzt
      // -> Email an den Ligaleiter

      if (this.anzahlAnTagenMannschaft[i][match.mannschaftId] >= 2) {

        this.darunterLiegendeMannschaftenToCheckSchuetze(match.mannschaftId, this.matchAllPasse[i], i);
      }


      // es ist nicht erlaubt, dass der Schütze 2x am selben Wettkampftag teilnimmt
      if (this.selberWettkampftag[i] === true
        && this.selberWettkampftagVeranstaltung[i].id !== this.veranstaltung.id) {
        this.passeSelberTag = this.matchAllPasse[i].dsbMitgliedId;
        this.selberTagVeranstaltung = this.selberWettkampftagVeranstaltung[i].name;
        console.log('Popup: ', this.passeSelberTag, 'hat bereits diesen Wettkampftag in der', this.selberTagVeranstaltung, 'geschossen');
        this.savepopSelberTag();
      }
    }*/
  }

  savepopSelberTag() {
    this.popupSelberTag = true;
  }

  savepopAndererTag() {
    this.popupAndererTag = true;
  }

  save(){
    if (this.match1.satzpunkte > 7 || this.match2.satzpunkte > 7) {
      this.notificationService.showNotification({
        id:          'NOTIFICATION_SCHUSSZETTEL_ENTSCHIEDEN',
        title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.ENTSCHIEDEN.TITLE',
        description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.ENTSCHIEDEN.DESCRIPTION',
        severity:    NotificationSeverity.ERROR,
        origin:      NotificationOrigin.SYSTEM,
        type:        NotificationType.OK,
        userAction:  NotificationUserAction.ACCEPTED
      });
    } else if (
      // zum Speichern konsitenteer Daten müssen alle Schützennnummern erfasst sein
      // daher prüfen wir hier ersten auf "leer" d.h. gleich 0
      this.match1.schuetzen[0][0].rueckennummer == null ||
      this.match1.schuetzen[1][0].rueckennummer == null ||
      this.match1.schuetzen[2][0].rueckennummer == null ||
      this.match2.schuetzen[0][0].rueckennummer == null ||
      this.match2.schuetzen[1][0].rueckennummer == null ||
      this.match2.schuetzen[2][0].rueckennummer == null) {
      this.notificationService.showNotification({
        id:          'NOTIFICATION_SCHUSSZETTEL_SCHUETZENNUMMER',
        title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.SCHUETZENNUMMER.TITLE',
        description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.SCHUETZENNUMMER.DESCRIPTION',
        severity:    NotificationSeverity.ERROR,
        origin:      NotificationOrigin.SYSTEM,
        type:        NotificationType.OK,
        userAction:  NotificationUserAction.ACCEPTED
      });
    } else if (
      // und jetzt prüfen wir noch ob in einer Mannschaft die gleiche
      // Schützennummer zweimal angegeben wurde -> auch nicht möglich
      this.match1.schuetzen[0][0].rueckennummer === this.match1.schuetzen[1][0].rueckennummer ||
      this.match1.schuetzen[1][0].rueckennummer === this.match1.schuetzen[2][0].rueckennummer ||
      this.match1.schuetzen[2][0].rueckennummer === this.match1.schuetzen[0][0].rueckennummer ||
      this.match2.schuetzen[0][0].rueckennummer === this.match2.schuetzen[1][0].rueckennummer ||
      this.match2.schuetzen[1][0].rueckennummer === this.match2.schuetzen[2][0].rueckennummer ||
      this.match2.schuetzen[2][0].rueckennummer === this.match2.schuetzen[0][0].rueckennummer) {
      this.notificationService.showNotification({
        id:          'NOTIFICATION_SCHUSSZETTEL_SCHUETZENNUMMER',
        title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.SCHUETZENEINDEUTIG.TITLE',
        description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.SCHUETZENEINDEUTIG.DESCRIPTION',
        severity:    NotificationSeverity.ERROR,
        origin:      NotificationOrigin.SYSTEM,
        type:        NotificationType.OK,
        userAction:  NotificationUserAction.ACCEPTED
      });
    } else {
      this.notificationService.showNotification({
        id:          'NOTIFICATION_SCHUSSZETTEL_SPEICHERN',
        title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.SPEICHERN.TITLE',
        description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.SPEICHERN.DESCRIPTION',
        severity:    NotificationSeverity.INFO,
        origin:      NotificationOrigin.USER,
        // type: NotificationType.OK, //--TO-DO Maximilian
        userAction:  NotificationUserAction.PENDING
      });

      // im Ausgabefeld ist die Schutzennummer aktuell nur in der 0-ten Passe gesetzt
      // kopieren in jede Passe, damit Datenanlage möglich --> Schüsselwert für DB
      for (let i = 0; i < 3; i++) {
        for (let j = 1; j < 5; j++) {
          if (this.match1.schuetzen[i][j].lfdNr <= 1) {
            this.match1.schuetzen[i][j].lfdNr = j + 1;
          }
          if (this.match2.schuetzen[i][j].lfdNr <= 1) {
            this.match2.schuetzen[i][j].lfdNr = j + 1;
          }

          this.match1.schuetzen[i][j].dsbMitgliedId = this.match1.schuetzen[i][0].dsbMitgliedId;
          this.match2.schuetzen[i][j].dsbMitgliedId = this.match2.schuetzen[i][0].dsbMitgliedId;

          this.match1.schuetzen[i][j].rueckennummer = this.match1.schuetzen[i][0].rueckennummer;
          this.match2.schuetzen[i][j].rueckennummer = this.match2.schuetzen[i][0].rueckennummer;
        }
      }
      this.schusszettelService.create(this.match1, this.match2)
          .then((data: BogenligaResponse<Array<MatchDOExt>>) => {
            this.match1 = data.payload[0];
            this.match2 = data.payload[1];
            this.checkSchuetze(this.match1);
            this.checkSchuetze(this.match2);
            // neu initialisieren, damit passen die noch keine ID haben eine ID vom Backend erhalten
            this.ngOnInit();
            this.notificationService.showNotification({
              id:          'NOTIFICATION_SCHUSSZETTEL_ENTSCHIEDEN',
              title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.GESPEICHERT.TITLE',
              description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.GESPEICHERT.DESCRIPTION',
              severity:    NotificationSeverity.ERROR,
              origin:      NotificationOrigin.SYSTEM,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.ACCEPTED
            });
          }, (error) => {
            console.error(error);
            this.notificationService.showNotification({
              id:          'NOTIFICATION_SCHUSSZETTEL_ENTSCHIEDEN',
              title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.RUECKENNUMMERZUHOCH.TITLE',
              description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.RUECKENNUMMERZUHOCH.DESCRIPTION',
              severity:    NotificationSeverity.ERROR,
              origin:      NotificationOrigin.SYSTEM,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.ACCEPTED
            });
            this.notificationService.discardNotification();
          });
      this.dirtyFlag = false; // Daten gespeichert
    }
  }

  // zurueck zu Sportjahresplan
  back() {

    // falls es ungespeichert Änderungen gibt - dann erst fragen ob sie verworfen werden sollen
    if (this.dirtyFlag === true) {
      // TODO Texte in json.de anlegen
      const notification: Notification = {
        id:          NOTIFICATION_ZURUECK,
        title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.ZURUECK.TITLE',
        description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.ZURUECK.DESCRIPTION',
        severity:    NotificationSeverity.QUESTION,
        origin:      NotificationOrigin.USER,
        type:        NotificationType.YES_NO,
        userAction:  NotificationUserAction.PENDING
      };

      console.log('show notification');
      this.notificationService.showNotification(notification);

      console.log('notification.userAction before: ' + notification.userAction);
      this.notificationService.observeNotification(NOTIFICATION_ZURUECK)
          .subscribe((myNotification) => {
            console.log('observe notification');
            if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
              console.log('accepted');
              this.dirtyFlag = false;
              console.log('Wettkampftag', this.match1.wettkampfTag);
              this.router.navigate(['/sportjahresplan' + '/' + this.match1.wettkampfId]);
            }
            console.log('notification.userAction after: ' + notification.userAction);
          });

    } else {

      console.log('Keine Änderung');
      console.log('Wettkampftag', this.match1.wettkampfTag);
      this.router.navigate(['/sportjahresplan' + '/' + this.match1.wettkampfId]);
    }
  }


  next() {

    // falls es ungespeichert Änderungen gibt - dann erst fragen ob sie verworfen werden sollen
    if (this.dirtyFlag === true) {
      // TODO TExte in json.de anlegen
      const notification: Notification = {
        id:          NOTIFICATION_WEITER_SCHALTEN,
        title:       'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.WEITER.TITLE',
        description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.WEITER.DESCRIPTION',
        severity:    NotificationSeverity.QUESTION,
        origin:      NotificationOrigin.USER,
        type:        NotificationType.YES_NO,
        userAction:  NotificationUserAction.PENDING
      };

      this.notificationService.observeNotification(NOTIFICATION_WEITER_SCHALTEN)
          .subscribe((myNotification) => {
            if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
              this.dirtyFlag = false;
              this.matchProvider.pairToFollow(this.match2.id)
                  .then((data) => {
                    if (data.payload.length === 2) {
                      this.router.navigate(['/sportjahresplan/schusszettel/' + data.payload[0] + '/' + data.payload[1]]);
                    }
                  });
            }
          });
      this.notificationService.showNotification(notification);

    } else {
      // nächste Matches bestimmen --> schusszettel-service --> Backend-Call --> zwei IDs
      this.matchProvider.pairToFollow(this.match2.id)
          .then((data) => {
            if (data.payload.length === 2) {
              this.router.navigate(['/sportjahresplan/schusszettel/' + data.payload[0] + '/' + data.payload[1]]);
            }
          });
    }


  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  /**
   * Initializes schuetzen-array of matches.
   * Pushes three arrays into schuetzen for match 1, then pushes five PasseDO in each of the three arrays.
   */
  private initSchuetzenMatch1() {

    // 1.löschen der Felder
    this.match1singlesatzpoints = [];
    this.match1.sumSatz = [];

    // 2. intialisieren der Felder mit 5 Einträgen des Werts 0
    for (let i = 0; i < 5; i++) {
      this.match1.sumSatz.push(0);
      this.match1singlesatzpoints.push(0);
    }
    this.match1.schuetzen = [];

    // Vorbelegen der Felder mit den Daten des Matches
    for (let i = 0; i < 3; i++) {
      this.match1.schuetzen.push(new Array<PasseDO>());
      for (let j = 0; j < 5; j++) {
        if (i === 0) {
          this.match1.schuetzen[i].push(new PasseDO(null, this.match1.id, this.match1.mannschaftId, this.match1.wettkampfId, this.match1.nr, j + 1));
        } else if (i === 1) {
          this.match1.schuetzen[i].push(new PasseDO(null, this.match1.id, this.match1.mannschaftId, this.match1.wettkampfId, this.match1.nr, j + 1));
        } else {
          this.match1.schuetzen[i].push(new PasseDO(null, this.match1.id, this.match1.mannschaftId, this.match1.wettkampfId, this.match1.nr, j + 1));
        }
      }
    }
  }


  /**
   * Initializes schuetzen-array of matches.
   * Pushes three arrays into schuetzen for match 2, then pushes five PasseDO in each of the three arrays.
   */
  private initSchuetzenMatch2() {

    // 1.löschen der Felder
    this.match2singlesatzpoints = [];
    this.match2.sumSatz = [];

    // 2. intialisieren der Felder mit 5 Einträgen des Werts 0
    for (let i = 0; i < 5; i++) {
      this.match2.sumSatz.push(0);
      this.match2singlesatzpoints.push(0);
    }
    this.match2.schuetzen = [];
    // Vorbelegen der Felder mit den Daten des Matches
    for (let i = 0; i < 3; i++) {
      this.match2.schuetzen.push(new Array<PasseDO>());
      for (let j = 0; j < 5; j++) {
        if (i === 0) {
          this.match2.schuetzen[i].push(new PasseDO(null, this.match2.id, this.match2.mannschaftId, this.match2.wettkampfId, this.match2.nr, j + 1));
        } else if (i === 1) {
          this.match2.schuetzen[i].push(new PasseDO(null, this.match2.id, this.match2.mannschaftId, this.match2.wettkampfId, this.match2.nr, j + 1));
        } else {
          this.match2.schuetzen[i].push(new PasseDO(null, this.match2.id, this.match2.mannschaftId, this.match2.wettkampfId, this.match2.nr, j + 1));
        }
      }
    }
  }


  /**
   * Adds each ringzahlen of all three schuetzen of the match of the Satz and returns it.
   * @param match
   * @param satzNr
   */
  private getSumSatz(match: MatchDOExt, satzNr: number): number {
    let sum = 0;
    for (const i of Object.keys(match.schuetzen)) {
      sum += match.schuetzen[i][satzNr].ringzahlPfeil1;
      sum += match.schuetzen[i][satzNr].ringzahlPfeil2;
    }
    sum -= match.fehlerpunkte[satzNr];

    return sum;
  }

  /**
   * Sets satzpunkte and matchpunkte of both matches according to the sumSatzx and satzpunkte.
   */
  private setPoints() {
    // kumulativ
    if (this.match1.wettkampfTyp === 'Liga kummulativ') {
      this.setKummulativePoints();
    } else {
      this.setSatzPoints();
    }

    if (this.match1.satzpunkte >= 6) {
      this.match1.matchpunkte = 2;
      this.match2.matchpunkte = 0;
    } else if (this.match2.satzpunkte >= 6) {
      this.match1.matchpunkte = 0;
      this.match2.matchpunkte = 2;
    } else if (this.match2.satzpunkte === 5 && this.match1.satzpunkte === 5) {
      this.match1.matchpunkte = 1;
      this.match2.matchpunkte = 1;
    }
  }

  private setSatzPoints() {

    let counterMatch1 = 0;
    let counterMatch2 = 0;

    for (let i = 0; i < 5; i++) {
      if (this.match1.sumSatz[i] > this.match2.sumSatz[i]) {
        counterMatch1 += 2;
        this.match1singlesatzpoints[i] = 2;
        this.match2singlesatzpoints[i] = 0;
      } else if (this.match1.sumSatz[i] < this.match2.sumSatz[i]) {
        counterMatch2 += 2;
        this.match1singlesatzpoints[i] = 0;
        this.match2singlesatzpoints[i] = 2;
      } else if (this.match1.sumSatz[i] === this.match2.sumSatz[i] &&
        this.match1.sumSatz[i] > 0 && this.match2.sumSatz[i] > 0) {
        counterMatch1++;
        counterMatch2++;
        this.match1singlesatzpoints[i] = 1;
        this.match2singlesatzpoints[i] = 1;
      }
    }
    this.match1.satzpunkte = counterMatch1;
    this.match2.satzpunkte = counterMatch2;
    this.match1.matchpunkte = 0;
    this.match2.matchpunkte = 0;

  }

  private setKummulativePoints() {
    let kumuluativ1 = 0;
    let kumuluativ2 = 0;

    for (let i = 0; i < 3; i++) {
      kumuluativ1 += this.match1.sumSatz[i];
      kumuluativ2 += this.match2.sumSatz[i];
    }

    if (kumuluativ1 > kumuluativ2) {
      this.match1.satzpunkte = 6;
      this.match2.satzpunkte = 0;
    } else if (kumuluativ1 < kumuluativ2) {
      this.match1.satzpunkte = 0;
      this.match2.satzpunkte = 6;
    }
  }

  private initSumSatz() {

    for (let i = 0; i < 5; i++) {
      this.match1.sumSatz[i] = this.getSumSatz(this.match1, i);
      this.match2.sumSatz[i] = this.getSumSatz(this.match2, i);
    }

  }

  private getSummeSchuetze(schuetzeNr: number, matchNr: number): number {
    let sum = 0;
    const match = this['match' + matchNr];
    for (const passe of match.schuetzen[schuetzeNr]) {
      sum += passe.ringzahlPfeil1 + passe.ringzahlPfeil2;
    }
    return sum;
  }

  public onButtonDownload(path: string): string {
    return new UriBuilder()
      .fromPath(environment.backendBaseUrl)
      .path('v1/download')
      .path(path)
      .path(this.match1.id + '/' + this.match2.id)
      .build();
  }
}
