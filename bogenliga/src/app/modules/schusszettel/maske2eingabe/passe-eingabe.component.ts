import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SchusszettelService} from '../schusszettel.service';

@Component({
  selector:    'bla-maske2eingabe',
  templateUrl: './passe-eingabe.component.html',
  styleUrls:   ['./passe-eingabe.component.scss']
})
export class PasseEingabeComponent implements OnInit {
  schuesse: string[][] = [];
  @Input() infos: any;
  constructor(
    private service: SchusszettelService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.schuesse = Array.from({ length: 3 }, () => Array(arrows).fill(''));
  }

  confirmPass() {
    this.service.submitPassData(this.schuesse).subscribe((success) => {
      if (success) {
        this.router.navigate(['/schusszettel/tablet']);
      }
    });
  }
}
