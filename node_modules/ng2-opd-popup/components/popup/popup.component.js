import { Component, Output, EventEmitter } from '@angular/core';
import { Popup } from './popup.service';
import { Size } from "./size";
export var PopupComponent = (function () {
    function PopupComponent(popupService) {
        this.popupService = popupService;
        this.confirmBtnStyle = "ng2-opd-popup-Button";
        this.cancelBtnStyle = "ng2-opd-popup-Button";
        this.mainClass = "container ng2-opd-popup-content-main";
        this.confirmClick = new EventEmitter();
        this.cancelClick = new EventEmitter();
        // Object.assign(this, this.popupService.options);
    }
    PopupComponent.prototype.onResize = function (event) {
        if (event.target.innerWidth < 736) {
            this.mainStyle = { 'border-color': this.popupService.options.color, 'border-style': 'solid', 'border-width': '1px', 'width': '96%', 'margin-left': '2%' };
        }
        else {
            if (this.popupService.options != undefined) {
                var width = this.popupService.options.widthProsentage + "%";
                var marginLeft = (((this.popupService.options.widthProsentage - 100) / 2) * -1) + "%";
                var color = this.popupService.options.color;
                this.mainStyle = { 'border-color': color, 'border-style': 'solid', 'border-width': '1px', 'width': width, 'margin-left': marginLeft };
            }
        }
    };
    PopupComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.popupService.optionsChanged.subscribe(function (options) {
            _this.setOptions(options);
        });
        this.popupService.visibleChanged.subscribe(function (val) {
            if (val == true) {
                _this.show();
            }
            else {
                _this.hide();
            }
        });
    };
    PopupComponent.prototype.show = function (options) {
        if (options) {
            this.setOptions(options);
        }
        if (this.popupService.options.confirmBtnClass) {
            this.confirmBtnStyle = this.popupService.options.confirmBtnClass;
        }
        if (this.popupService.options.cancleBtnClass) {
            this.cancelBtnStyle = this.popupService.options.cancleBtnClass;
        }
        this.setWidth();
        var setSize = this.setSize;
        this.wellStyle = { 'border-color': this.popupService.options.color, 'background-color': this.popupService.options.color, 'border-style': 'solid', 'border-width': "1px", 'color': '#fff', 'border-radius': '1px' };
        var _mainstyle = { 'border-color': this.popupService.options.color, 'border-style': 'solid', 'border-width': '1px', 'width': setSize.width, 'margin-left': setSize.marginLeft, 'animation-duration': this.popupService.options.animationDuration + 's', 'animation-name': this.popupService.options.animation };
        this.mainStyle = _mainstyle; //{'border-color': this.popupService.options.color, 'border-style': 'solid', 'border-width': '1px', 'width': setSize.width, 'margin-left': setSize.marginLeft, 'animation-duration': this.popupService.options.animationDuration + 's','animation-name': 'fadeInDown' };
        this.visible = true;
    };
    PopupComponent.prototype.setOptions = function (options) {
        if (options.widthProsentage != undefined) {
            this.popupService.options.widthProsentage = options.widthProsentage;
        }
        else {
            this.popupService.options.widthProsentage = 40;
        }
        ;
        if (options.cancleBtnClass != undefined) {
            this.popupService.options.cancleBtnClass = options.cancleBtnClass;
        }
        else {
            this.popupService.options.cancleBtnClass = "ng2-opd-popup-Button";
        }
        ;
        ;
        if (options.confirmBtnClass != undefined) {
            this.popupService.options.confirmBtnClass = options.confirmBtnClass;
        }
        else {
            this.popupService.options.confirmBtnClass = "ng2-opd-popup-Button";
        }
        ;
        if (options.color != undefined) {
            this.popupService.options.color = options.color;
        }
        else {
            this.popupService.options.color = "#5cb85c";
        }
        ;
        if (options.header != undefined) {
            this.popupService.options.header = options.header;
        }
        else {
            this.popupService.options.header = "...";
        }
        ;
        if (options.showButtons != undefined) {
            this.popupService.options.showButtons = options.showButtons;
        }
        else {
            this.popupService.options.showButtons = true;
        }
        ;
        if (options.confirmBtnContent != undefined) {
            this.popupService.options.confirmBtnContent = options.confirmBtnContent;
        }
        else {
            this.popupService.options.confirmBtnContent = "OK";
        }
        ;
        if (options.cancleBtnContent != undefined) {
            this.popupService.options.cancleBtnContent = options.cancleBtnContent;
        }
        else {
            this.popupService.options.cancleBtnContent = "Cancle";
        }
        ;
        if (options.animationDuration != undefined) {
            this.popupService.options.animationDuration = options.animationDuration;
        }
        else {
            this.popupService.options.animationDuration = 1;
        }
        ;
        if (options.animation != undefined) {
            this.popupService.options.animation = options.animation;
        }
        else {
            this.popupService.options.animation = "fadeInDown";
        }
        ;
    };
    PopupComponent.prototype.hide = function () {
        this.visible = false;
    };
    PopupComponent.prototype.confirmNo = function () {
        this.cancelClick.emit();
        this.hide();
    };
    PopupComponent.prototype.confirmYes = function () {
        this.confirmClick.emit();
    };
    PopupComponent.prototype.setWidth = function () {
        this.setSize = new Size();
        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (this.popupService.options.widthProsentage == undefined) {
            this.setSize.width = "40%";
            this.setSize.marginLeft = "30%";
        }
        else {
            this.setSize.width = this.popupService.options.widthProsentage + "%";
            this.setSize.marginLeft = (((this.popupService.options.widthProsentage - 100) / 2) * -1) + "%";
        }
        if (w < 736) {
            this.setSize.marginLeft = "2%";
            this.setSize.width = "96%";
        }
    };
    PopupComponent.decorators = [
        { type: Component, args: [{
                    selector: 'popup',
                    template: "<div id=\"ng2-opd-popup-main\"  *ngIf=\"visible\" [ngClass]=\"mainClass\" [ngStyle]=\"mainStyle\"> <div class=\"row\"> <div style=\"display: inline-block;width:100%\"> <div id=\"ng2-opd-popup-well\"  [ngStyle]=\"wellStyle\" class=\"ng2-opd-popup-well ng2-opd-popup-well-sm\">{{popupService.options.header}}</div> </div> <div style=\"margin:20px;\"> <ng-content></ng-content> <div *ngIf=\"popupService.options.showButtons\" style=\"margin-bottom:20px;margin-top:20px;float: right\"> <button id=\"cancelBtn\" [ngClass]=\"cancelBtnStyle\" type=\"reset\" (click)=\"confirmNo()\">{{popupService.options.cancleBtnContent}}</button> <button id=\"confirmBtn\" [ngClass]=\"confirmBtnStyle\"  (click)=\"confirmYes()\">{{popupService.options.confirmBtnContent}}</button> </div> </div> </div> </div>",
                    styles: [".ng2-opd-popup-content-main { position: absolute; border-radius: 3px; background-color: white; z-index: 999; top: 30%; } @keyframes fadeInDown { from { opacity: 0; transform: translate3d(0, -30%, 0); } to { opacity: 1; transform: none; } } @keyframes fadeInLeft { from { opacity: 0; transform: translate3d(-100%, 0, 0); } to { opacity: 1; transform: none; } } @keyframes fadeInRight { from { opacity: 0; transform: translate3d(100%, 0, 0); } to { opacity: 1; transform: none; } } @keyframes fadeInUp { from { opacity: 0; transform: translate3d(0, 100%, 0); } to { opacity: 1; transform: none; } } @keyframes bounceIn { from, 20%, 40%, 60%, 80%, to { animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); } 0% { opacity: 0; transform: scale3d(0.3, 0.3, 0.3); } 20% { transform: scale3d(1.1, 1.1, 1.1); } 40% { transform: scale3d(0.9, 0.9, 0.9); } 60% { opacity: 1; transform: scale3d(1.03, 1.03, 1.03); } 80% { transform: scale3d(0.97, 0.97, 0.97); } to { opacity: 1; transform: scale3d(1, 1, 1); } } @keyframes bounceInDown { from, 60%, 75%, 90%, to { animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); } 0% { opacity: 0; transform: translate3d(0, -3000px, 0); } 60% { opacity: 1; transform: translate3d(0, 25px, 0); } 75% { transform: translate3d(0, -10px, 0); } 90% { transform: translate3d(0, 5px, 0); } to { transform: none; } } .ng2-opd-popup-well { min-height: 20px; padding: 19px; margin-bottom: 20px; background-color: #f5f5f5; border: 1px solid #e3e3e3; border-radius: 4px; } .ng2-opd-popup-well blockquote { border-color: #ddd; border-color: rgba(0, 0, 0, 0.15); } .ng2-opd-popup-well-lg { padding: 24px; border-radius: 6px; } .ng2-opd-popup-well-sm { padding: 9px; border-radius: 3px; } .ng2-opd-popup-Button { -moz-box-shadow: inset 0px 1px 0px 0px #ffffff; -webkit-box-shadow: inset 0px 1px 0px 0px #ffffff; box-shadow: inset 0px 1px 0px 0px #ffffff; background-color: #fcfcfc; -moz-border-radius: 6px; -webkit-border-radius: 6px; border-radius: 6px; border: 1px solid #dcdcdc; display: inline-block; cursor: pointer; color: #777777; font-family: Arial; font-size: 15px; font-weight: bold; padding: 6px 24px; text-decoration: none; text-shadow: 0px 1px 0px #ffffff; } .ng2-opd-popup-Button:hover { background-color: #dfdfdf; } .ng2-opd-popup-Button:active { position: relative; top: 1px; } .btn:focus, .btn:active { outline: none !important; } .pull-right { float: right !important; } /*Spaces*/ .margin-bottom-5, .margin-bottom-10, .margin-bottom-20, .margin-bottom-20, .margin-bottom-25, .margin-bottom-30, .margin-bottom-35, .margin-bottom-40, .margin-bottom-50, .margin-bottom-60 { clear: both; } .margin-bottom-5 { margin-bottom: 5px; } .margin-bottom-10 { margin-bottom: 10px; } .margin-bottom-20 { margin-bottom: 20px; } .margin-bottom-25 { margin-bottom: 25px; } .margin-bottom-30 { margin-bottom: 30px; } .margin-bottom-35 { margin-bottom: 35px; } .margin-bottom-40 { margin-bottom: 40px; } .margin-bottom-50 { margin-bottom: 50px; } .margin-bottom-60 { margin-bottom: 60px; } /*Spaces*/ .margin-top-5, .margin-top-10, .margin-top-20, .margin-top-20, .margin-top-25, .margin-top-30, .margin-top-35, .margin-top-40, .margin-top-50, .margin-top-60 { clear: both; } .margin-top-5 { margin-top: 5px; } .margin-top-10 { margin-top: 10px; } .margin-top-20 { margin-top: 20px; } .margin-top-25 { margin-top: 25px; } .margin-top-30 { margin-top: 30px; } .margin-top-35 { margin-top: 35px; } .margin-top-40 { margin-top: 40px; } .margin-top-50 { margin-top: 50px; } .margin-top-60 { margin-top: 60px; } "],
                    host: {
                        '(window:resize)': 'onResize($event)'
                    }
                },] },
    ];
    /** @nocollapse */
    PopupComponent.ctorParameters = function () { return [
        { type: Popup, },
    ]; };
    PopupComponent.propDecorators = {
        'confirmClick': [{ type: Output },],
        'cancelClick': [{ type: Output },],
    };
    return PopupComponent;
}());
//# sourceMappingURL=C:/_git/ng2-opd-popup/src/components/popup/popup.component.js.map