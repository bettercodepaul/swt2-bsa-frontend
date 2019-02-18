import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PopupComponent } from './popup.component';
import { Popup } from './popup.service';
export var PopupModule = (function () {
    function PopupModule() {
    }
    PopupModule.forRoot = function () {
        return { ngModule: PopupModule, providers: [Popup] };
    };
    PopupModule.decorators = [
        { type: NgModule, args: [{
                    imports: [BrowserModule],
                    declarations: [PopupComponent],
                    exports: [PopupComponent]
                },] },
    ];
    /** @nocollapse */
    PopupModule.ctorParameters = function () { return []; };
    return PopupModule;
}());
//# sourceMappingURL=C:/_git/ng2-opd-popup/src/components/popup/popup.module.js.map