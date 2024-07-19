import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';


@Component({
  selector: 'app-page-number-display',
  templateUrl: './pagenumber-display.component.html',
  styleUrls: ['./pagenumber-display.component.scss']
})
export class PageNumberDisplayComponent implements OnInit {

  @Input() currentPage: number;
  @Input() totalPages: number;

  @Input() public id: string;
  @Input() public visible = true;
  @Input() public disabled = false;
  @Input() public loading = false;
  @Input() public minWidth: string;
  @Input() public margin: string;

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

}
