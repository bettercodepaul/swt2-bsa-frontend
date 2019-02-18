

## Popup component for Angular 2

> - [ONLINE DEMO](http://dahlmann.no/ng2-opd-popup-sample/)
> - Source code for demo project [HERE](https://github.com/opdahlmann/ng2-opd-popup-sample)



in your module include:
```javascript
import {PopupModule} from 'ng2-opd-popup';

@NgModule({
  imports: [
    ...
    PopupModule.forRoot()
  ],
  declarations: [
   ...
  ],
  providers: [
   ...
  ],
  bootstrap: [...]
})
```

in your view (html)
```html
<popup>
    Add your custom html elements here
</popup>
```

In your component:

```javascript
import {Popup} from 'ng2-opd-popup';

export class YourComponent {
 constructor(private popup:Popup) { }

 ClickButton(){
    this.popup.show();
  }
}
```

If you want to have multiple popups in your page with different html content you can use @ViewChild, in that case you don't need to inject it in your constructor

in your view (html)
```html
<popup  #popup1>
    Add your custom html elements here
</popup>

<popup  #popup2>
    Add your other custom html elements here
</popup>
```
In your component:

```javascript
import { Component, ViewChild } from '@angular/core';
import {Popup} from 'ng2-opd-popup';

export class YourComponent {
  
  @ViewChild('popup1') popup1: Popup;
  @ViewChild('popup2') popup2: Popup;
  
  constructor() { }

  ClickButton(){
    this.popup1.show();
  }

  ClickAnotherButton(){
    this.popup2.show();
  }
}
```

Options:

You can set the following options for your popup:

```javascript
this.popup.options = {
    header: "Your custom header",
    color: "#5cb85c", // red, blue....
    widthProsentage: 40, // The with of the popou measured by browser width
    animationDuration: 1, // in seconds, 0 = no animation
    showButtons: true, // You can hide this in case you want to use custom buttons
    confirmBtnContent: "OK", // The text on your confirm button
    cancleBtnContent: "Cancel", // the text on your cancel button
    confirmBtnClass: "btn btn-default", // your class for styling the confirm button
    cancleBtnClass: "btn btn-default", // you class for styling the cancel button
    animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown'
};

  this.popup.show(this.popup.options);
```

Events:

You can subscribe to the confirm and cancel button event.

```html
<popup  (confirmClick)="YourConfirmEvent()" (cancelClick)="YourCancelEvent()">
    Add your own html elements here
</popup>
```


```javascript
YourConfirmEvent(){
  alert('You cliked confirm');
}

YourCancelEvent(){
  alert('You cliked cancel');
}
```