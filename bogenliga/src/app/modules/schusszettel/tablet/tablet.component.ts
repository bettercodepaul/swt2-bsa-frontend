import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {SchusszettelService} from '../schusszettel.service';

@Component({
  selector: 'bla-tablet',
  templateUrl: './tablet.component.html',
  styleUrls: ['./tablet.component.scss']
})
export class TabletComponent implements OnInit {
  token: string | null = null;
  teamId: string | null = null;
  wettkampfId: string | null = null;

  status: string | null = null;
  data: any = null; // status ist z.b. warte, schutzemeldung ...

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private schusszettelService: SchusszettelService
  ) {
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.teamId = this.route.snapshot.queryParamMap.get('teamid');
    this.wettkampfId = this.route.snapshot.queryParamMap.get('wettkampfid');

    if (this.token && this.teamId && this.wettkampfId) {
      const token = this.token;
      const teamId = Number(this.teamId);
      const wettkampfId = Number(this.wettkampfId);

      this.schusszettelService.getSchusszettel(token, wettkampfId, teamId)
          .subscribe({
            next:  (response: any) => {
              this.status = response.status;
              this.data = response;
              console.log('Empfangene Daten vom Backend:', response);
            },
            error: (err) => {
              console.error('Fehler beim Laden der Daten:', err);
            }
          });
    }
  }
}
