// schusszettel-wrapper.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TabletSchusszettel } from '../../models/tablet-schusszettel.model';

@Component({
  selector: 'bla-schusszettel-wrapper',
  template: `
              <div class="schusszettel-container">
                <router-outlet></router-outlet>
              </div>
            `,
  styles: [`
             .schusszettel-container {
               width: 100%;
               height: 100%;
               min-height: 500px; /* Ensure some height for the outlet */
             }
           `]
})
export class SchusszettelWrapperComponent implements OnInit, OnDestroy {
  @Input() infos: TabletSchusszettel | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.infos) {
      console.log('[SchusszettelWrapper] Initializing with infos:', this.infos);

      const match1Id = this.deriveMatch1Id();
      const match2Id = this.deriveMatch2Id();

      console.log('[SchusszettelWrapper] Navigating to schusszettel with match IDs:', match1Id, match2Id);

      // Navigate to the nested schusszettel route
      this.router.navigate(['schusszettel', match1Id, match2Id], {
        relativeTo: this.route
      }).then((success) => {
        console.log('[SchusszettelWrapper] Navigation success:', success);
      }).catch((error) => {
        console.error('[SchusszettelWrapper] Navigation error:', error);
      });
    }
  }

  private deriveMatch1Id(): string {
    // Extract match ID from tablet data
    const teamId = this.infos?.eigenesTeam?.matchID;
    return teamId?.toString();
  }

  private deriveMatch2Id(): string {
    // Extract opponent match ID from tablet data
    const gegnerTeamId = this.infos?.gegnerischesTeam?.matchID;
    return gegnerTeamId?.toString();
  }

  ngOnDestroy() {
    console.log('[SchusszettelWrapper] Component destroying');
  }
}
