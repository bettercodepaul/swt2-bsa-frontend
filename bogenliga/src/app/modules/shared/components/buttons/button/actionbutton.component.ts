import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';

@Component({
  selector:    'bla-actionbutton',
  templateUrl: './actionbutton.component.html'
})
export class ActionButtonComponent implements OnInit {

  @Input() public id: string;
  @Input() public visible = true;
  @Input() public disabled = false;
  @Input() public loading = false;
  @Input() public minWidth: string;
  @Input() public margin: string;
  @Input() public iconClass: IconProp;
  @Input() public color: ActionButtonColors = ActionButtonColors.PRIMARY;


  /**
   * The value is send via the event emitter to the parent component
   * @type {any} event emitter value
   */
  @Input() value: any = null;

  /**
   * The parent component can receive the onClick event.
   * @type {EventEmitter<any>} void or the defined return value
   */
  @Output() onClick = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * Disable the button, if the disabled flag is true or
   * the button action (invoked by the onButtonClick event) is running
   *
   * @returns {boolean} true, if the disabled or loading flag is true
   */
  public isDisabled() {
    return this.disabled || this.loading;
  }

  public onButtonClick(): void {
    if (!this.value || this.value.length === 0) {
      this.onClick.emit();
    } else {
      this.onClick.emit(this.value);
    }
  }

  public getColorClass() {
    return this.color;
  }
}
