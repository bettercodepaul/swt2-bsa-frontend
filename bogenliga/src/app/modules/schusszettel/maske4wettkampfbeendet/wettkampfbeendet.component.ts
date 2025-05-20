import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SchusszettelService } from '../schusszettel.service';

@Component({
  selector:    'bla-maske4wettkampbeendet',
  templateUrl: './wettkampfbeendet.component.html',
  styleUrls:   ['./wettkampfbeendet.component.scss']
})
export class WettkampfbeendetComponent {
  @Input() infos: any;
}
