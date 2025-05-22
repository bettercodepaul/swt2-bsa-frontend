import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {SchusszettelService} from '@schusszettel/services/schusszettel.service';


@Component({
  selector:    'bla-maske1registrierung',
  templateUrl: './register-rueckennummer.component.html',
  styleUrls:   ['./register-rueckennummer.component.scss']
})
export class RegisterRueckennummerComponent {
  rueckennummern: string[] = ['', '', ''];
  @Input() infos: any;
  constructor(private service: SchusszettelService, private router: Router) {}

  confirmInput(): void {
    const payload = {
      token: this.infos?.token,
      teamid: this.infos?.teamid,
      wettkampfid: this.infos?.wettkampfid,
      rueckennummern: this.rueckennummern
    };

    this.service.sendRueckennummern(
      this.infos?.token,
      this.infos?.wettkampfId,
      this.infos?.teamid,
      this.rueckennummern
    ).subscribe({
      next: () => {

        // state call

        window.location.reload();
      },
      error: (err) => {
        console.error('Fehler beim Senden der Rückennummern:', err);
      }
    });
  }
}
