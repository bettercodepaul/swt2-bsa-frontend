import { OnInit, EventEmitter } from '@angular/core';
import { Options } from "./options";
export declare class Popup implements OnInit {
    visibleChanged: EventEmitter<any>;
    optionsChanged: EventEmitter<any>;
    options: Options;
    constructor();
    ngOnInit(): void;
    show(options?: Options): void;
    hide(): void;
}
