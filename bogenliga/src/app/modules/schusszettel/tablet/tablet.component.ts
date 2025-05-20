import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.teamId = this.route.snapshot.queryParamMap.get('teamid');
    this.wettkampfId = this.route.snapshot.queryParamMap.get('wettkampfid');

    if (this.token && this.teamId && this.wettkampfId) {
      const url = `/v1/tablet-schusszettel?token=${this.token}&teamid=${this.teamId}&wettkampfid=${this.wettkampfId}`;

      this.http.get(url).subscribe((response: any) => {
        this.status = response.status;
        this.data = response;
      });
    }
  }
}
