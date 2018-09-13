import { Component } from '@angular/core';

@Component({
  selector: 'bla-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bla';
  open =  '';

  public isActive = true;

  public toggle(): void {
    this.isActive = !this.isActive;
    //this.isOpen();
  }
  public isOpen(): void {
    if (this.isActive === true) {
      this.open = '>>';
    } else {
      this.open = '<<';
    }
  }
}


