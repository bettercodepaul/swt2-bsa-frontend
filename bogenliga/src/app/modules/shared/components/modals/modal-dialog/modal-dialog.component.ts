import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonType} from '../../buttons';
import {ModalDialogOption} from '../types/modal-dialog-option.enum';
import {ModalDialogResult} from '../types/modal-dialog-result.enum';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'bla-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss'],
  providers: [TranslatePipe]
})
export class ModalDialogComponent implements OnInit {

  @Input() public id: string;
  @Input() public visible = false;
  @Input() public disabled = false;
  @Input() public modalDialogOption: ModalDialogOption = ModalDialogOption.OK;
  @Input() public header: string; // use [header] attribute or <h5> inside the element

  @Output() public onClose = new EventEmitter<ModalDialogResult>();

  public ButtonType = ButtonType;
  public ModalDialogOption = ModalDialogOption;
  public ModalDialogResult = ModalDialogResult;

  public minOptionButtonWidth = '6rem'; // uniform size of all options

  constructor() {
  }

  ngOnInit() {
  }

  public closeDialog(result: ModalDialogResult): void {
    this.visible = false;
    this.onClose.emit(result);
  }
}
