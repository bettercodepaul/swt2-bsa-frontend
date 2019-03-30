import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonSize} from '../types/button-size.enum';
import {ButtonType} from '../types/button-type.enum';

@Component({
  selector:    'bla-button',
  templateUrl: './button.component.html'
})
export class ButtonComponent implements OnInit {

  @Input() public id: string;
  @Input() public visible = true;
  @Input() public disabled = false;
  @Input() public loading = false;
  @Input() public minWidth: string;

  @Input() public buttonType: ButtonType = ButtonType.PRIMARY;
  @Input() public buttonSize: ButtonSize = ButtonSize.NORMAL;

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

  public getButtonClass(): string {
    let buttonClass = 'btn-primary';
    switch (this.buttonType) {
      case ButtonType.SECONDARY:
        buttonClass = 'btn-secondary';
        break;
      case ButtonType.SUCCESS:
        buttonClass = 'btn-success';
        break;
      case ButtonType.WARNING:
        buttonClass = 'btn-warning';
        break;
      case ButtonType.DANGER:
        buttonClass = 'btn-danger';
        break;
      case ButtonType.LINK:
        buttonClass = 'btn-link';
        break;
      case ButtonType.PRIMARY_OUTLINE:
        buttonClass = 'btn-outline-primary';
        break;
      case ButtonType.SECONDARY_OUTLINE:
        buttonClass = 'btn-outline-secondary';
        break;
      case ButtonType.SUCCESS_OUTLINE:
        buttonClass = 'btn-outline-success';
        break;
      case ButtonType.WARNING_OUTLINE:
        buttonClass = 'btn-outline-warning';
        break;
      case ButtonType.DANGER_OUTLINE:
        buttonClass = 'btn-outline-danger';
        break;
      // default
      case ButtonType.PRIMARY:
      default:
        buttonClass = 'btn-primary';
    }

    buttonClass += ' ';

    switch (this.buttonSize) {
      case ButtonSize.LARGE_BLOCK:
        buttonClass += 'btn-lg btn-block';
        break;
      case ButtonSize.SMALL:
        buttonClass += 'btn-sm';
        break;
      case ButtonSize.NORMAL:
      default:
    }

    return buttonClass;
  }
}
