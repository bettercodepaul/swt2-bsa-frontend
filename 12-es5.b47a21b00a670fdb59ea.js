!function(){function e(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),n&&t(e,n)}function t(e,n){return(t=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,n)}function n(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,l=o(e);if(t){var a=o(this).constructor;n=Reflect.construct(l,arguments,a)}else n=l.apply(this,arguments);return i(this,n)}}function i(e,t){return!t||"object"!=typeof t&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function o(e){return(o=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function c(e,t,n){return t&&a(e.prototype,t),n&&a(e,n),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{OK0s:function(t,i,o){"use strict";o.r(i),o.d(i,"PlaygroundModule",(function(){return ce}));var a,b,r=o("ofXK"),s=o("tyNb"),d=o("6NWb"),u=o("btWG"),h=o("AytR"),m={moduleTranslationKey:"PLAYGROUND",pageTitleTranslationKey:"PLAYGROUND.PLAYGROUND.TITLE"},p=o("20cS"),P=o("NJqk"),f=o("fXoL"),D=o("w90F"),g=o("hIfO"),w=o("3bVr"),Q=o("3lZk"),v=o("wmQx"),y=((a=function(){function e(){l(this,e)}return c(e,[{key:"ngOnInit",value:function(){}}]),e}()).\u0275fac=function(e){return new(e||a)},a.\u0275cmp=f.Fb({type:a,selectors:[["bla-layout-example"]],decls:168,vars:0,consts:[[1,"layout-elements"],["name","bla-col-layout"],[1,"layout-element-1"],[1,"layout-element-2"],[1,"layout-element-3"],[1,"layout-element-4"],["name","bla-grid-layout"],[1,"layout-element-5"],[1,"layout-element-6"],[1,"layout-element-7"],["name","bla-row-layout"],["name","bla-centered-layout"],["width","75"],["width","100"]],template:function(e,t){1&e&&(f.Qb(0,"h4"),f.Dc(1,"Layouts"),f.Pb(),f.Qb(2,"div",0),f.Qb(3,"p"),f.Dc(4,"Die farblichen Elemente haben eine urspr\xfcngliche Gr\xf6\xdfe von 100x100 Pixeln."),f.Pb(),f.Qb(5,"h5"),f.Dc(6,"bla-col-layout"),f.Pb(),f.Mb(7,"a",1),f.Qb(8,"p"),f.Dc(9,'Das "Spalten"-Layout teilt den verf\xfcgbaren Platz einer Zeile in gleichgro\xdfe Spalten f\xfcr die Elemente auf.'),f.Pb(),f.Qb(10,"bla-col-layout"),f.Qb(11,"div",2),f.Dc(12,"1"),f.Pb(),f.Pb(),f.Qb(13,"bla-col-layout"),f.Qb(14,"div",2),f.Dc(15,"1"),f.Pb(),f.Qb(16,"div",3),f.Dc(17,"2"),f.Pb(),f.Pb(),f.Qb(18,"bla-col-layout"),f.Qb(19,"div",2),f.Dc(20,"1"),f.Pb(),f.Qb(21,"div",3),f.Dc(22,"2"),f.Pb(),f.Qb(23,"div",4),f.Dc(24,"3"),f.Pb(),f.Pb(),f.Qb(25,"bla-col-layout"),f.Qb(26,"div",2),f.Dc(27,"1"),f.Pb(),f.Qb(28,"div",3),f.Dc(29,"2"),f.Pb(),f.Qb(30,"div",4),f.Dc(31,"3"),f.Pb(),f.Qb(32,"div",5),f.Dc(33,"4"),f.Pb(),f.Pb(),f.Qb(34,"h5"),f.Dc(35,"bla-grid-layout"),f.Pb(),f.Mb(36,"a",6),f.Qb(37,"p"),f.Dc(38,"Das Grid-Layout ist f\xfcr ein responsives Verhalten n\xfctzlich. Falls kein Platz mehr in der Zeile ist, werden die restlichen Elemente umgebrochen."),f.Pb(),f.Qb(39,"p"),f.Dc(40,"1 Element"),f.Pb(),f.Qb(41,"bla-grid-layout"),f.Qb(42,"div",2),f.Dc(43,"1"),f.Pb(),f.Pb(),f.Qb(44,"p"),f.Dc(45,"3 Elemente"),f.Pb(),f.Qb(46,"bla-grid-layout"),f.Qb(47,"div",2),f.Dc(48,"1"),f.Pb(),f.Qb(49,"div",3),f.Dc(50,"2"),f.Pb(),f.Qb(51,"div",4),f.Dc(52,"3"),f.Pb(),f.Pb(),f.Qb(53,"p"),f.Dc(54,"5 Elemente"),f.Pb(),f.Qb(55,"bla-grid-layout"),f.Qb(56,"div",2),f.Dc(57,"1"),f.Pb(),f.Qb(58,"div",3),f.Dc(59,"2"),f.Pb(),f.Qb(60,"div",4),f.Dc(61,"3"),f.Pb(),f.Qb(62,"div",5),f.Dc(63,"4"),f.Pb(),f.Qb(64,"div",7),f.Dc(65,"5"),f.Pb(),f.Pb(),f.Qb(66,"p"),f.Dc(67,"7 Elemente"),f.Pb(),f.Qb(68,"bla-grid-layout"),f.Qb(69,"div",2),f.Dc(70,"1"),f.Pb(),f.Qb(71,"div",3),f.Dc(72,"2"),f.Pb(),f.Qb(73,"div",4),f.Dc(74,"3"),f.Pb(),f.Qb(75,"div",5),f.Dc(76,"4"),f.Pb(),f.Qb(77,"div",7),f.Dc(78,"5"),f.Pb(),f.Qb(79,"div",8),f.Dc(80,"6"),f.Pb(),f.Qb(81,"div",9),f.Dc(82,"7"),f.Pb(),f.Pb(),f.Qb(83,"h5"),f.Dc(84,"bla-row-layout"),f.Pb(),f.Mb(85,"a",10),f.Qb(86,"p"),f.Dc(87,'Das "Zeilen"-Layout ordnet die Element zeilenweise untereinander an.'),f.Pb(),f.Qb(88,"p"),f.Dc(89,"1 Element"),f.Pb(),f.Qb(90,"bla-row-layout"),f.Qb(91,"div",2),f.Dc(92,"1"),f.Pb(),f.Pb(),f.Qb(93,"p"),f.Dc(94,"2 Elemente"),f.Pb(),f.Qb(95,"bla-row-layout"),f.Qb(96,"div",2),f.Dc(97,"1"),f.Pb(),f.Qb(98,"div",3),f.Dc(99,"2"),f.Pb(),f.Pb(),f.Qb(100,"p"),f.Dc(101,"3 Elemente"),f.Pb(),f.Qb(102,"bla-row-layout"),f.Qb(103,"div",2),f.Dc(104,"1"),f.Pb(),f.Qb(105,"div",3),f.Dc(106,"2"),f.Pb(),f.Qb(107,"div",4),f.Dc(108,"3"),f.Pb(),f.Pb(),f.Pb(),f.Qb(109,"h5"),f.Dc(110,"bla-centered-layout"),f.Pb(),f.Mb(111,"a",11),f.Qb(112,"p"),f.Dc(113,'Das "Zentrierte"-Layout ordnet die Elemente in einer "Spalte" in der Mitte der Zeile an. Standardm\xe4\xdfig betr\xe4gt die Breite der "Spalte" 60%. Bei Webseiten '),f.Qb(114,"u"),f.Dc(115,"ohne"),f.Pb(),f.Dc(116," Side-Nav ist dieses Layout h\xe4ufig vertreten."),f.Pb(),f.Qb(117,"p"),f.Dc(118,"1 Element"),f.Pb(),f.Qb(119,"bla-centered-layout"),f.Qb(120,"div",2),f.Dc(121,"1"),f.Pb(),f.Pb(),f.Qb(122,"p"),f.Dc(123,'2 Elemente innerhalb eines "Spalten"-Layouts, damit die div-Tags nebeneinander stehen und der gesamte Platz eingenommen wird. Standardm\xe4\xdfig betr\xe4gt die Breite 60%.'),f.Pb(),f.Qb(124,"bla-centered-layout"),f.Qb(125,"bla-col-layout"),f.Qb(126,"div",2),f.Dc(127,"1"),f.Pb(),f.Qb(128,"div",3),f.Dc(129,"2"),f.Pb(),f.Pb(),f.Pb(),f.Qb(130,"p"),f.Dc(131,'3 Elemente innerhalb eines "Spalten"-Layouts, damit die div-Tags nebeneinander stehen und der gesamte Platz eingenommen wird. Standardm\xe4\xdfig betr\xe4gt die Breite 60%.'),f.Pb(),f.Qb(132,"bla-centered-layout"),f.Qb(133,"bla-col-layout"),f.Qb(134,"div",2),f.Dc(135,"1"),f.Pb(),f.Qb(136,"div",3),f.Dc(137,"2"),f.Pb(),f.Qb(138,"div",4),f.Dc(139,"3"),f.Pb(),f.Pb(),f.Pb(),f.Qb(140,"p"),f.Dc(141,'5 Elemente innerhalb eines "Spalten"-Layouts, damit die div-Tags nebeneinander stehen und der gesamte Platz eingenommen wird. Die Breite des Layouts ist auf 75% erh\xf6ht worden.'),f.Pb(),f.Qb(142,"bla-centered-layout",12),f.Qb(143,"bla-col-layout"),f.Qb(144,"div",2),f.Dc(145,"1"),f.Pb(),f.Qb(146,"div",3),f.Dc(147,"2"),f.Pb(),f.Qb(148,"div",4),f.Dc(149,"3"),f.Pb(),f.Qb(150,"div",5),f.Dc(151,"4"),f.Pb(),f.Qb(152,"div",7),f.Dc(153,"5"),f.Pb(),f.Pb(),f.Pb(),f.Qb(154,"p"),f.Dc(155,'5 Elemente innerhalb eines "Spalten"-Layouts, damit die div-Tags nebeneinander stehen und der gesamte Platz eingenommen wird. Die Breite des Layouts ist auf 100% erh\xf6ht worden.'),f.Pb(),f.Qb(156,"bla-centered-layout",13),f.Qb(157,"bla-col-layout"),f.Qb(158,"div",2),f.Dc(159,"1"),f.Pb(),f.Qb(160,"div",3),f.Dc(161,"2"),f.Pb(),f.Qb(162,"div",4),f.Dc(163,"3"),f.Pb(),f.Qb(164,"div",5),f.Dc(165,"4"),f.Pb(),f.Qb(166,"div",7),f.Dc(167,"5"),f.Pb(),f.Pb(),f.Pb())},directives:[g.a,w.a,Q.a,v.a],styles:[".layout-element-1[_ngcontent-%COMP%]{background-color:#ff833a}.layout-element-1[_ngcontent-%COMP%], .layout-element-2[_ngcontent-%COMP%]{width:100px;height:100px;text-align:center;font-size:4em;margin:.3em}.layout-element-2[_ngcontent-%COMP%]{background-color:#6495ed}.layout-element-3[_ngcontent-%COMP%]{background-color:#006400}.layout-element-3[_ngcontent-%COMP%], .layout-element-4[_ngcontent-%COMP%]{width:100px;height:100px;text-align:center;font-size:4em;margin:.3em}.layout-element-4[_ngcontent-%COMP%]{background-color:#ff1493}.layout-element-5[_ngcontent-%COMP%]{background-color:#b22222}.layout-element-5[_ngcontent-%COMP%], .layout-element-6[_ngcontent-%COMP%]{width:100px;height:100px;text-align:center;font-size:4em;margin:.3em}.layout-element-6[_ngcontent-%COMP%]{background-color:#fff350}.layout-element-7[_ngcontent-%COMP%]{background-color:#adff2f;width:100px;height:100px;text-align:center;font-size:4em;margin:.3em}"]}),a),S=o("wHSu"),O=o("TdNb"),k=((b=function(){function e(){l(this,e),this.infoIcon=S.k,this.infoTooltipText="Info Tooltip Text"}return c(e,[{key:"ngOnInit",value:function(){}},{key:"getTooltipText",value:function(){return"Button Tooltip Text"}}]),e}()).\u0275fac=function(e){return new(e||b)},b.\u0275cmp=f.Fb({type:b,selectors:[["bla-tooltip-example"]],decls:20,vars:3,consts:[[1,"playground-label"],["value","'Tooltip Inhalt'"],[3,"value"],["size","lg",3,"icon"],[1,"btn","btn-light"]],template:function(e,t){1&e&&(f.Qb(0,"h4"),f.Dc(1,"Tooltips"),f.Pb(),f.Qb(2,"h5"),f.Dc(3,"bla-tooltip"),f.Pb(),f.Qb(4,"bla-col-layout"),f.Qb(5,"p",0),f.Dc(6," Tooltip f\xfcr Text: "),f.Pb(),f.Qb(7,"bla-tooltip",1),f.Dc(8," Text "),f.Pb(),f.Pb(),f.Qb(9,"bla-col-layout"),f.Qb(10,"p",0),f.Dc(11," Tooltip f\xfcr ein Icon: "),f.Pb(),f.Qb(12,"bla-tooltip",2),f.Mb(13,"fa-icon",3),f.Pb(),f.Pb(),f.Qb(14,"bla-col-layout"),f.Qb(15,"p",0),f.Dc(16," Tooltip f\xfcr einen Button: "),f.Pb(),f.Qb(17,"bla-tooltip",2),f.Qb(18,"button",4),f.Dc(19,"Button"),f.Pb(),f.Pb(),f.Pb()),2&e&&(f.zb(12),f.gc("value",t.infoTooltipText),f.zb(1),f.gc("icon",t.infoIcon),f.zb(4),f.gc("value",t.getTooltipText()))},directives:[g.a,O.a,d.b],styles:[".playground-label[_ngcontent-%COMP%]{width:30vw;max-width:30vw}"]}),b),I=o("X628"),M=o("LRne"),z=o("D0XW"),L=o("7o/Q"),F=o("WMd4");function T(e){var t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:z.a,i=(t=e)instanceof Date&&!isNaN(+t)?+e-n.now():Math.abs(e);return function(e){return e.lift(new R(i,n))}}var x,E,C,A,R=function(){function e(t,n){l(this,e),this.delay=t,this.scheduler=n}return c(e,[{key:"call",value:function(e,t){return t.subscribe(new _(e,this.delay,this.scheduler))}}]),e}(),_=function(t){e(o,t);var i=n(o);function o(e,t,n){var a;return l(this,o),(a=i.call(this,e)).delay=t,a.scheduler=n,a.queue=[],a.active=!1,a.errored=!1,a}return c(o,[{key:"_schedule",value:function(e){this.active=!0,this.destination.add(e.schedule(o.dispatch,this.delay,{source:this,destination:this.destination,scheduler:e}))}},{key:"scheduleNotification",value:function(e){if(!0!==this.errored){var t=this.scheduler,n=new N(t.now()+this.delay,e);this.queue.push(n),!1===this.active&&this._schedule(t)}}},{key:"_next",value:function(e){this.scheduleNotification(F.a.createNext(e))}},{key:"_error",value:function(e){this.errored=!0,this.queue=[],this.destination.error(e),this.unsubscribe()}},{key:"_complete",value:function(){this.scheduleNotification(F.a.createComplete()),this.unsubscribe()}}],[{key:"dispatch",value:function(e){for(var t=e.source,n=t.queue,i=e.scheduler,o=e.destination;n.length>0&&n[0].time-i.now()<=0;)n.shift().notification.observe(o);if(n.length>0){var l=Math.max(0,n[0].time-i.now());this.schedule(e,l)}else this.unsubscribe(),t.active=!1}}]),o}(L.a),N=function e(t,n){l(this,e),this.time=t,this.notification=n},U=function e(t,n){l(this,e),this.version=0,this.id=t,this.name=n},j=o("cHN3"),V=((x=function(){function e(){l(this,e),this.loading=!0}return c(e,[{key:"ngOnInit",value:function(){var e=this;Object(M.a)(!0).pipe(T(5e3)).subscribe((function(t){return e.loading=!1}))}},{key:"onSelect",value:function(e){this.selectedDTO=e}},{key:"getSelectedDTO",value:function(){return Object(I.a)(this.selectedDTO)?"":(console.log("Dropdown Men\xfc: selectedDTO = "+JSON.stringify(this.selectedDTO)),this.selectedDTO.name)}},{key:"isLoading",value:function(){return this.loading}},{key:"getEmptyList",value:function(){return[]}},{key:"getVersionedDataObjects",value:function(){return[new U(1,"Sch\xfctze 1"),new U(2,"Sch\xfctze 2"),new U(3,"Sch\xfctze 3"),new U(4,"Sch\xfctze 4"),new U(5,"Sch\xfctze 5")]}}]),e}()).\u0275fac=function(e){return new(e||x)},x.\u0275cmp=f.Fb({type:x,selectors:[["bla-dropdown-menu-example"]],decls:38,vars:16,consts:[[1,"playground-row"],[1,"playground-label"],[2,"width","50%",3,"id","items","optionFieldSelector","onSelect"],[2,"width","50%",3,"items","optionFieldSelector","selectedItemId"],["disabled","true",2,"width","50%",3,"items","optionFieldSelector","selectedItemId"],[2,"width","50%",3,"items","optionFieldSelector","selectedItemId","loading"],[2,"width","50%",3,"items","optionFieldSelector"],[2,"width","50%"]],template:function(e,t){1&e&&(f.Qb(0,"h4"),f.Dc(1,"Dropdowns"),f.Pb(),f.Qb(2,"h5"),f.Dc(3,"bla-dropdown-menu"),f.Pb(),f.Qb(4,"p"),f.Dc(5,' Das "selbstgebaute" Dropdown-Men\xfc basiert auf dem Men\xfc f\xfcr angemeldete Benutzer (siehe oben links). Das Ein- und Ausblenden wird \xfcber Angular gesteuert. Der Style wird von Bootstrap genutzt.\n'),f.Pb(),f.Qb(6,"div",0),f.Qb(7,"bla-col-layout"),f.Qb(8,"p",1),f.Dc(9," Dropdown Men\xfc mit einer Liste von DTOs mit ID: "),f.Mb(10,"br"),f.Dc(11),f.Pb(),f.Qb(12,"bla-dropdown-menu",2),f.Xb("onSelect",(function(e){return t.onSelect(e)})),f.Pb(),f.Pb(),f.Pb(),f.Qb(13,"div",0),f.Qb(14,"bla-col-layout"),f.Qb(15,"p",1),f.Dc(16," Dropdown Men\xfc mit Vorauswahl (per ID): "),f.Pb(),f.Mb(17,"bla-dropdown-menu",3),f.Pb(),f.Pb(),f.Qb(18,"div",0),f.Qb(19,"bla-col-layout"),f.Qb(20,"p",1),f.Dc(21," Deaktiviertes Dropdown Men\xfc mit Vorauswahl (per ID): "),f.Pb(),f.Mb(22,"bla-dropdown-menu",4),f.Pb(),f.Pb(),f.Qb(23,"div",0),f.Qb(24,"bla-col-layout"),f.Qb(25,"p",1),f.Dc(26," Dropdown Men\xfc mit Ladeindikator (bitte Seite neu laden, um die 5 Sek. Verz\xf6gerung zu sehen): "),f.Pb(),f.Mb(27,"bla-dropdown-menu",5),f.Pb(),f.Pb(),f.Qb(28,"div",0),f.Qb(29,"bla-col-layout"),f.Qb(30,"p",1),f.Dc(31," Dropdown Men\xfc mit leerer Liste: "),f.Pb(),f.Mb(32,"bla-dropdown-menu",6),f.Pb(),f.Pb(),f.Qb(33,"div",0),f.Qb(34,"bla-col-layout"),f.Qb(35,"p",1),f.Dc(36," Dropdown Men\xfc ohne Parameter: "),f.Pb(),f.Mb(37,"bla-dropdown-menu",7),f.Pb(),f.Pb()),2&e&&(f.zb(11),f.Fc(" Auswahl: ",t.getSelectedDTO()," "),f.zb(1),f.gc("id","playground-dropdown-menu")("items",t.getVersionedDataObjects())("optionFieldSelector","name"),f.zb(5),f.gc("items",t.getVersionedDataObjects())("optionFieldSelector","name")("selectedItemId",3),f.zb(5),f.gc("items",t.getVersionedDataObjects())("optionFieldSelector","name")("selectedItemId",3),f.zb(5),f.gc("items",t.getVersionedDataObjects())("optionFieldSelector","name")("selectedItemId",3)("loading",t.isLoading()),f.zb(5),f.gc("items",t.getEmptyList())("optionFieldSelector","name"))},directives:[g.a,j.a],styles:[".playground-label[_ngcontent-%COMP%]{width:40vw;max-width:40vw}.playground-row[_ngcontent-%COMP%]{margin-bottom:2em}"]}),x),B=o("yljE"),q=o("zLSN"),X=o("MLKY"),Y=function(){return[3,4]},G=((E=function(){function e(){l(this,e),this.loading=!0,this.multipleSelections=!0,this.selectedRightItems=[]}return c(e,[{key:"ngOnInit",value:function(){var e=this;Object(M.a)(!0).pipe(T(5e3)).subscribe((function(t){return e.loading=!1}))}},{key:"onSelect",value:function(e){this.selectedDTOs=[],this.selectedDTOs=e}},{key:"getSelectedDTO",value:function(){if(Object(I.a)(this.selectedDTOs))return"";console.log("Auswahllisten: selectedDTO = "+JSON.stringify(this.selectedDTOs));var e=[];return this.selectedDTOs.forEach((function(t){e.push(t.name)})),e.join(", ")}},{key:"isLoading",value:function(){return this.loading}},{key:"getEmptyList",value:function(){return[]}},{key:"getVersionedDataObjects",value:function(){return[new U(1,"Sch\xfctze 1"),new U(2,"Sch\xfctze 2"),new U(3,"Sch\xfctze 3"),new U(4,"Sch\xfctze 4"),new U(5,"Sch\xfctze 5"),new U(6,"Sch\xfctze 6"),new U(7,"Sch\xfctze 7"),new U(8,"Sch\xfctze 8"),new U(9,"Sch\xfctze 9"),new U(10,"Sch\xfctze 10")]}}]),e}()).\u0275fac=function(e){return new(e||E)},E.\u0275cmp=f.Fb({type:E,selectors:[["bla-selectionlist-example"]],decls:87,vars:51,consts:[["name","bla-selectionlist"],[1,"playground-row"],[1,"playground-label"],[2,"width","50%","height","10em",3,"id","items","optionFieldSelector","multipleSelections","onSelect"],[2,"width","50%","height","10em",3,"items","optionFieldSelector","selectedItemIds","multipleSelections","onSelect"],["disabled","true",2,"width","50%","height","10em",3,"items","optionFieldSelector","selectedItemIds"],[2,"width","50%","height","10em",3,"items","optionFieldSelector","selectedItemIds","loading"],[2,"width","50%","height","10em",3,"items","optionFieldSelector"],[2,"width","50%","height","10em"],["name","bla-quicksearch-list"],["selectionListHeight","15em",2,"width","50%",3,"items","optionFieldSelector","multipleSelections","onSelect"],[2,"width","50%",3,"items","optionFieldSelector","selectedItemIds","multipleSelections","onSelect"],["disabled","true",2,"width","50%",3,"items","optionFieldSelector","selectedItemIds"],[2,"width","50%",3,"items","optionFieldSelector","selectedItemIds","loading"],[2,"width","50%",3,"items","optionFieldSelector"],[2,"width","50%"],[2,"height","12em",3,"leftItems","rightItems","fieldSelector","idLeftList","idRightList","rightItemsChange"]],template:function(e,t){1&e&&(f.Qb(0,"h4"),f.Dc(1,"Auswahllisten"),f.Pb(),f.Qb(2,"h5"),f.Dc(3,"bla-selectionlist"),f.Pb(),f.Mb(4,"a",0),f.Qb(5,"div",1),f.Qb(6,"bla-col-layout"),f.Qb(7,"p",2),f.Dc(8," Auswahlliste mit einer Liste von DTOs mit ID. Nur Single-Select m\xf6glich. "),f.Mb(9,"br"),f.Dc(10),f.Pb(),f.Qb(11,"bla-selectionlist",3),f.Xb("onSelect",(function(e){return t.onSelect(e)})),f.Pb(),f.Pb(),f.Pb(),f.Qb(12,"div",1),f.Qb(13,"bla-col-layout"),f.Qb(14,"p",2),f.Dc(15," Auswahlliste mit Vorauswahl (per ID): "),f.Mb(16,"br"),f.Dc(17),f.Pb(),f.Qb(18,"bla-selectionlist",4),f.Xb("onSelect",(function(e){return t.onSelect(e)})),f.Pb(),f.Pb(),f.Pb(),f.Qb(19,"div",1),f.Qb(20,"bla-col-layout"),f.Qb(21,"p",2),f.Dc(22," Deaktivierte Auswahlliste mit Vorauswahl (per ID): "),f.Pb(),f.Mb(23,"bla-selectionlist",5),f.Pb(),f.Pb(),f.Qb(24,"div",1),f.Qb(25,"bla-col-layout"),f.Qb(26,"p",2),f.Dc(27," Auswahlliste mit Ladeindikator (bitte Seite neu laden, um die 5 Sek. Verz\xf6gerung zu sehen): "),f.Pb(),f.Mb(28,"bla-selectionlist",6),f.Pb(),f.Pb(),f.Qb(29,"div",1),f.Qb(30,"bla-col-layout"),f.Qb(31,"p",2),f.Dc(32," Auswahlliste mit leerer Liste: "),f.Pb(),f.Mb(33,"bla-selectionlist",7),f.Pb(),f.Pb(),f.Qb(34,"div",1),f.Qb(35,"bla-col-layout"),f.Qb(36,"p",2),f.Dc(37," Auswahlliste ohne Parameter: "),f.Pb(),f.Mb(38,"bla-selectionlist",8),f.Pb(),f.Pb(),f.Qb(39,"h5"),f.Dc(40,"bla-quicksearch-list"),f.Pb(),f.Mb(41,"a",9),f.Qb(42,"div",1),f.Qb(43,"bla-col-layout"),f.Qb(44,"p",2),f.Dc(45," Quicksearch Auswahlliste mit einer Liste von DTOs mit ID. Nur Single-Select m\xf6glich. "),f.Mb(46,"br"),f.Dc(47),f.Pb(),f.Qb(48,"bla-quicksearch-list",10),f.Xb("onSelect",(function(e){return t.onSelect(e)})),f.Pb(),f.Pb(),f.Pb(),f.Qb(49,"div",1),f.Qb(50,"bla-col-layout"),f.Qb(51,"p",2),f.Dc(52," Quicksearch Auswahlliste mit Vorauswahl (per ID) mit Multi-Select: "),f.Mb(53,"br"),f.Dc(54),f.Pb(),f.Qb(55,"bla-quicksearch-list",11),f.Xb("onSelect",(function(e){return t.onSelect(e)})),f.Pb(),f.Pb(),f.Pb(),f.Qb(56,"div",1),f.Qb(57,"bla-col-layout"),f.Qb(58,"p",2),f.Dc(59," Deaktivierte Quicksearch Auswahlliste mit Vorauswahl (per ID): "),f.Pb(),f.Mb(60,"bla-quicksearch-list",12),f.Pb(),f.Pb(),f.Qb(61,"div",1),f.Qb(62,"bla-col-layout"),f.Qb(63,"p",2),f.Dc(64," Quicksearch Auswahlliste mit Ladeindikator (bitte Seite neu laden, um die 5 Sek. Verz\xf6gerung zu sehen): "),f.Pb(),f.Mb(65,"bla-quicksearch-list",13),f.Pb(),f.Pb(),f.Qb(66,"div",1),f.Qb(67,"bla-col-layout"),f.Qb(68,"p",2),f.Dc(69," Quicksearch Auswahlliste mit leerer Liste: "),f.Pb(),f.Mb(70,"bla-quicksearch-list",14),f.Pb(),f.Pb(),f.Qb(71,"div",1),f.Qb(72,"bla-col-layout"),f.Qb(73,"p",2),f.Dc(74," Quicksearch Auswahlliste ohne Parameter: "),f.Pb(),f.Mb(75,"bla-quicksearch-list",15),f.Pb(),f.Pb(),f.Qb(76,"div",1),f.Qb(77,"bla-col-layout"),f.Qb(78,"p",2),f.Dc(79," Doppelte Auswahlliste: "),f.Pb(),f.Qb(80,"bla-double-selectionlist",16),f.Xb("rightItemsChange",(function(e){return t.selectedRightItems=e})),f.Pb(),f.Pb(),f.Pb(),f.Qb(81,"div",1),f.Dc(82," Ausgew\xe4hlte Elemente auf der rechten Seite: "),f.Qb(83,"pre"),f.Qb(84,"code"),f.Dc(85),f.ac(86,"json"),f.Pb(),f.Pb(),f.Pb()),2&e&&(f.zb(10),f.Fc(" Auswahl: ",t.getSelectedDTO()," "),f.zb(1),f.gc("id","quickSearch")("items",t.getVersionedDataObjects())("optionFieldSelector","name")("multipleSelections",!t.multipleSelections),f.zb(6),f.Fc(" Auswahl: ",t.getSelectedDTO()," "),f.zb(1),f.gc("items",t.getVersionedDataObjects())("optionFieldSelector","name")("selectedItemIds",f.kc(45,Y))("multipleSelections",t.multipleSelections),f.zb(5),f.gc("items",t.getVersionedDataObjects())("optionFieldSelector","name")("selectedItemIds",f.kc(46,Y)),f.zb(5),f.gc("items",t.getVersionedDataObjects())("optionFieldSelector","name")("selectedItemIds",f.kc(47,Y))("loading",t.isLoading()),f.zb(5),f.gc("items",t.getEmptyList())("optionFieldSelector","name"),f.zb(14),f.Fc(" Auswahl: ",t.getSelectedDTO()," "),f.zb(1),f.gc("items",t.getVersionedDataObjects())("optionFieldSelector","name")("multipleSelections",!t.multipleSelections),f.zb(6),f.Fc(" Auswahl: ",t.getSelectedDTO()," "),f.zb(1),f.gc("items",t.getVersionedDataObjects())("optionFieldSelector","name")("selectedItemIds",f.kc(48,Y))("multipleSelections",t.multipleSelections),f.zb(5),f.gc("items",t.getVersionedDataObjects())("optionFieldSelector","name")("selectedItemIds",f.kc(49,Y)),f.zb(5),f.gc("items",t.getVersionedDataObjects())("optionFieldSelector","name")("selectedItemIds",f.kc(50,Y))("loading",t.isLoading()),f.zb(5),f.gc("items",t.getEmptyList())("optionFieldSelector","name"),f.zb(10),f.gc("leftItems",t.getVersionedDataObjects())("rightItems",t.selectedRightItems)("fieldSelector","name")("idLeftList","left")("idRightList","right"),f.zb(5),f.Ec(f.bc(86,43,t.selectedRightItems)))},directives:[g.a,B.a,q.a,X.a],pipes:[r.k],styles:[".playground-label[_ngcontent-%COMP%]{width:40vw;max-width:40vw}.playground-row[_ngcontent-%COMP%]{margin-bottom:2em}"]}),E),Z=o("YfBl"),K=o("gQPg"),W=o("6ciE"),H=o("asUR"),J=((C=function(t){e(o,t);var i=n(o);function o(e){var t;return l(this,o),(t=i.call(this)).restClient=e,t.serviceSubUrl="v1/hello-world/download",t}return c(o,[{key:"downloadExamplePdf",value:function(e,t,n){return this.downloadFile((new Z.UriBuilder).fromPath(this.getUrl()).path(e).build(),t,n)}},{key:"getRestClient",value:function(){return this.restClient}}]),o}(H.a)).\u0275fac=function(e){return new(e||C)(f.Ub(Z.RestClient))},C.\u0275prov=f.Hb({token:C,factory:C.\u0275fac,providedIn:"root"}),C),$=o("sNGV"),ee=o("WBa3"),te=["downloadLink"],ne=((A=function(){function e(t,n){l(this,e),this.helloResourceService=t,this.notificationService=n,this.ActionButtonColors=$.a,this.downloadingFile=!1}return c(e,[{key:"ngOnInit",value:function(){}},{key:"getDownloadUrl",value:function(e){return(new Z.UriBuilder).fromPath(h.a.backendBaseUrl).path("v1/hello-world/download").path(e).build()}},{key:"download",value:function(e){var t=this;this.downloadingFile=!0;var n=e.toLowerCase(),i=n+" -example."+n;console.log("Invoke "+e+" download"),this.helloResourceService.downloadExamplePdf(n,i,this.aElementRef).then((function(n){return t.handleSuccess(n,e)})).catch((function(n){return t.handleFailure(n,e)}))}},{key:"handleSuccess",value:function(e,t){var n=this,i={id:"download_example_success",title:t,description:"Download completed: "+e.payload,severity:W.c.INFO,origin:W.b.USER,type:W.d.OK,userAction:W.e.PENDING};this.notificationService.observeNotification("download_example_success").subscribe((function(i){i.userAction===W.e.ACCEPTED&&(console.log("Download "+t+" from "+e.payload+" completed"),n.downloadingFile=!1)})),this.notificationService.showNotification(i)}},{key:"handleFailure",value:function(e,t){var n=this,i={id:"download_example_failure",title:t,description:"Download failed",severity:W.c.ERROR,origin:W.b.USER,type:W.d.OK,userAction:W.e.PENDING};this.notificationService.observeNotification("download_example_failure").subscribe((function(e){e.userAction===W.e.ACCEPTED&&(console.log("Download "+t+" failed"),n.downloadingFile=!1)})),this.notificationService.showNotification(i)}}]),e}()).\u0275fac=function(e){return new(e||A)(f.Lb(J),f.Lb(K.c))},A.\u0275cmp=f.Fb({type:A,selectors:[["bla-download-file-example"]],viewQuery:function(e,t){var n;1&e&&f.wc(te,!0),2&e&&f.oc(n=f.Yb())&&(t.aElementRef=n.first)},decls:34,vars:30,consts:[["downloadLink",""],[3,"color","iconClass","id","downloadUrl","fileName"]],template:function(e,t){1&e&&(f.Qb(0,"h4"),f.Dc(1,"Downloads"),f.Pb(),f.Mb(2,"a",null,0),f.Qb(4,"h5"),f.Dc(5,"PDF-Download"),f.Pb(),f.Qb(6,"p"),f.Qb(7,"bla-download-actionbutton",1),f.Dc(8,"Download PDF "),f.Pb(),f.Dc(9),f.Pb(),f.Qb(10,"h5"),f.Dc(11,"Excel-Download"),f.Pb(),f.Qb(12,"p"),f.Qb(13,"bla-download-actionbutton",1),f.Dc(14,"Download EXCEL (XLS) "),f.Pb(),f.Dc(15),f.Pb(),f.Qb(16,"h5"),f.Dc(17,"Word-Download"),f.Pb(),f.Qb(18,"p"),f.Qb(19,"bla-download-actionbutton",1),f.Dc(20,"Download WORD (DOC) "),f.Pb(),f.Dc(21),f.Pb(),f.Qb(22,"h5"),f.Dc(23,"CSV-Download"),f.Pb(),f.Qb(24,"p"),f.Qb(25,"bla-download-actionbutton",1),f.Dc(26,"Download CSV "),f.Pb(),f.Dc(27),f.Pb(),f.Qb(28,"h5"),f.Dc(29,"MDB-Download"),f.Pb(),f.Qb(30,"p"),f.Qb(31,"bla-download-actionbutton",1),f.Dc(32,"Download MDB (Microsoft Access) "),f.Pb(),f.Dc(33),f.Pb()),2&e&&(f.zb(7),f.gc("color",t.ActionButtonColors.PRIMARY)("iconClass","file-download")("id","downloadPdf")("downloadUrl",t.getDownloadUrl("pdf"))("fileName","download.pdf"),f.zb(2),f.Fc(" ",t.getDownloadUrl("pdf"),"\n"),f.zb(4),f.gc("color",t.ActionButtonColors.PRIMARY)("iconClass","file-download")("id","downloadXls")("downloadUrl",t.getDownloadUrl("xls"))("fileName","download.xls"),f.zb(2),f.Fc(" ",t.getDownloadUrl("xls"),"\n"),f.zb(4),f.gc("color",t.ActionButtonColors.PRIMARY)("iconClass","file-download")("id","downloadDoc")("downloadUrl",t.getDownloadUrl("doc"))("fileName","download.doc"),f.zb(2),f.Fc(" ",t.getDownloadUrl("doc"),"\n"),f.zb(4),f.gc("color",t.ActionButtonColors.PRIMARY)("iconClass","file-download")("id","downloadCsv")("downloadUrl",t.getDownloadUrl("csv"))("fileName","download.csv"),f.zb(2),f.Fc(" ",t.getDownloadUrl("csv"),"\n"),f.zb(4),f.gc("color",t.ActionButtonColors.PRIMARY)("iconClass","file-download")("id","downloadMdb")("downloadUrl",t.getDownloadUrl("mdb"))("fileName","download.mdb"),f.zb(2),f.Fc(" ",t.getDownloadUrl("mdb"),"\n"))},directives:[ee.a],encapsulation:2}),A);function ie(e,t){if(1&e){var n=f.Rb();f.Qb(0,"bla-common-dialog",1),f.Qb(1,"div",2),f.Xb("mouseover",(function(e){return f.qc(n),f.Zb().onMouseOver(e)})),f.Qb(2,"p"),f.Dc(3,"Auf dieser Seite k\xf6nnen neue Komponenten ausprobiert werden. Falls ihr noch eine passende Komponente f\xfcr eure Dialoge sucht, k\xf6nnt ihr hier st\xf6bern."),f.Pb(),f.Qb(4,"h4"),f.Dc(5,"Inhalt"),f.Pb(),f.Qb(6,"ul"),f.Qb(7,"li"),f.Qb(8,"a",3),f.Dc(9,"Layouts"),f.Pb(),f.Qb(10,"ul"),f.Qb(11,"li"),f.Qb(12,"a",4),f.Dc(13,"Spalten-Layout"),f.Pb(),f.Pb(),f.Qb(14,"li"),f.Qb(15,"a",5),f.Dc(16,"Zeilen-Layout"),f.Pb(),f.Pb(),f.Qb(17,"li"),f.Qb(18,"a",6),f.Dc(19,"Grid-Layout"),f.Pb(),f.Pb(),f.Qb(20,"li"),f.Qb(21,"a",7),f.Dc(22,"Zentriertes Spalten-Layout"),f.Pb(),f.Pb(),f.Pb(),f.Pb(),f.Qb(23,"li"),f.Qb(24,"a",8),f.Dc(25,"Tooltips"),f.Pb(),f.Pb(),f.Qb(26,"li"),f.Qb(27,"a",9),f.Dc(28,"Dropdowns (1 Element ausw\xe4hlen)"),f.Pb(),f.Pb(),f.Qb(29,"li"),f.Qb(30,"a",10),f.Dc(31,"Auswahllisten"),f.Pb(),f.Qb(32,"ul"),f.Qb(33,"li"),f.Qb(34,"a",11),f.Dc(35,"Auswahlliste (1 bis n Elemente ausw\xe4hlen)"),f.Pb(),f.Pb(),f.Qb(36,"li"),f.Qb(37,"a",12),f.Dc(38,"Schnellsuche (1 bis n Elemente ausw\xe4hlen)"),f.Pb(),f.Pb(),f.Pb(),f.Pb(),f.Qb(39,"li"),f.Qb(40,"a",13),f.Dc(41,"Datei-Downloads"),f.Pb(),f.Pb(),f.Pb(),f.Mb(42,"a",14),f.Mb(43,"bla-layout-example"),f.Mb(44,"a",15),f.Mb(45,"bla-tooltip-example"),f.Mb(46,"a",16),f.Mb(47,"bla-dropdown-menu-example"),f.Mb(48,"a",17),f.Mb(49,"bla-selectionlist-example"),f.Mb(50,"a",18),f.Mb(51,"bla-download-file-example"),f.Pb(),f.Pb()}if(2&e){var i=f.Zb();f.gc("config",i.config)}}var oe,le,ae=[{path:"",component:(oe=function(){function e(t,n){l(this,e),this.currentUserService=t,this.onOfflineService=n,this.config=m,this.inProd=h.a.production,this.sessionHandling=new p.a(this.currentUserService,this.onOfflineService)}return c(e,[{key:"ngOnInit",value:function(){}},{key:"onMouseOver",value:function(e){this.sessionHandling.checkSessionExpired()&&window.location.reload()}}]),e}(),oe.\u0275fac=function(e){return new(e||oe)(f.Lb(P.a),f.Lb(P.i))},oe.\u0275cmp=f.Fb({type:oe,selectors:[["bla-playground"]],decls:1,vars:1,consts:[[3,"config",4,"ngIf"],[3,"config"],[3,"mouseover"],["href","#layouts"],["href","#bla-col-layout"],["href","#bla-row-layout"],["href","#bla-grid-layout"],["href","#bla-centered-layout"],["href","#tooltip"],["href","#dropdown"],["href","#selectionlists"],["href","#bla-selectionlist"],["href","#bla-quicksearch-list"],["href","#downloads"],["name","layouts"],["name","tooltip"],["name","dropdown"],["name","selectionlists"],["name","downloads"]],template:function(e,t){1&e&&f.Bc(0,ie,52,1,"bla-common-dialog",0),2&e&&f.gc("ngIf",!(!0===t.inProd))},directives:[r.t,D.a,y,k,V,G,ne],styles:[""]}),oe)}],ce=((le=function e(){l(this,e)}).\u0275mod=f.Jb({type:le}),le.\u0275inj=f.Ib({factory:function(e){return new(e||le)},imports:[[r.c,s.h.forChild(ae),u.SharedModule,d.i]]}),le)}}])}();