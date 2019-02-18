import { Injectable, Output, EventEmitter } from '@angular/core';
import { Options } from "./options";
export var Popup = (function () {
    function Popup() {
        this.visibleChanged = new EventEmitter();
        this.optionsChanged = new EventEmitter();
        this.options = new Options();
        Object.assign(this, this.options);
    }
    Popup.prototype.ngOnInit = function () {
        //init
    };
    Popup.prototype.show = function (options) {
        if (options == undefined) {
            options = this.options;
        }
        this.optionsChanged.emit(options);
        this.visibleChanged.emit(true);
    };
    Popup.prototype.hide = function () {
        this.visibleChanged.emit(false);
    };
    Popup.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Popup.ctorParameters = function () { return []; };
    Popup.propDecorators = {
        'visibleChanged': [{ type: Output },],
        'optionsChanged': [{ type: Output },],
    };
    return Popup;
}());
//# sourceMappingURL=C:/_git/ng2-opd-popup/src/components/popup/popup.service.js.map