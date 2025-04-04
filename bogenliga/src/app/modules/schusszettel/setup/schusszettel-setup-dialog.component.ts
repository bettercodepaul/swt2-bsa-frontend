import { Component, Input } from '@angular/core';

@Component({
  selector: 'bla-schusszettel-setup-dialog',
  template: `
    <div class="qr-setup-container">
      <h2>Tablet-Setup für Match {{ matchId }}</h2>
      <!-- This is a rudimentary QR setup interface. It will later support one tablet per team per match day persistently. -->
      <div class="qr-group">
        <div class="qr-block">
          <qrcode [qrdata]="qrUrlA" [width]="200"></qrcode>
          <p>{{ qrUrlA }}</p>
        </div>
        <div class="qr-block">
          <qrcode [qrdata]="qrUrlB" [width]="200"></qrcode>
          <p>{{ qrUrlB }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .qr-setup-container { text-align: center; padding: 1rem; }
    .qr-group { display: flex; justify-content: center; gap: 2rem; margin-top: 1rem; }
    .qr-block { display: flex; flex-direction: column; align-items: center; }
    p { font-family: monospace; max-width: 280px; word-break: break-all; }
  `]
})
export class SchusszettelSetupDialogComponent {
  @Input() matchId!: number;
  get qrUrlA(): string {
    return `${location.origin}/schusszettel/setup?matchId=${this.matchId}&team=A`;
  }
  get qrUrlB(): string {
    return `${location.origin}/schusszettel/setup?matchId=${this.matchId}&team=B`;
  }
}
