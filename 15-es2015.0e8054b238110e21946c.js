(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{"9N29":function(e,t,n){"use strict";n.r(t),n.d(t,"UserModule",(function(){return y}));var r=n("ofXK"),o=n("3Pt+"),a=n("tyNb"),i=n("btWG"),l=n("th7h"),c=n("fXoL");let s=(()=>{class e{constructor(e){this.currentUserService=e}canActivate(){return this.currentUserService.hasAnyPermisson([])}}return e.\u0275fac=function(t){return new(t||e)(c.Ub(l.a))},e.\u0275prov=c.Hb({token:e,factory:e.\u0275fac}),e})();var b=n("X628"),d=n("AytR"),u=n("Rkqy"),g=n("VQQ0"),P=n("U19w"),R=n("RBHD"),E=n("SMp3");const h={moduleTranslationKey:"USER",pageTitleTranslationKey:"USER.LOGIN.TITLE"};var f=n("NJqk"),m=n("w90F"),p=n("LJ8u"),L=n("/2r1"),M=n("sYmb");function O(e,t){if(1&e){const e=c.Rb();c.Qb(0,"div"),c.Qb(1,"bla-alert",29),c.Qb(2,"p"),c.Bc(3,"Username: admin@bogenliga.de "),c.Mb(4,"br"),c.Bc(5,"Password: admin"),c.Mb(6,"br"),c.Bc(7,"Rolle: ADMIN"),c.Mb(8,"br"),c.Qb(9,"bla-button",30),c.Xb("onClick",(function(t){return c.pc(e),c.Zb().onAutoLogin(t)})),c.Bc(10,"Login als Admin "),c.Pb(),c.Pb(),c.Qb(11,"p"),c.Bc(12,"Username: moderator@bogenliga.de "),c.Mb(13,"br"),c.Bc(14,"Password: moderator"),c.Mb(15,"br"),c.Bc(16,"Rolle: MODERATOR"),c.Mb(17,"br"),c.Qb(18,"bla-button",31),c.Xb("onClick",(function(t){return c.pc(e),c.Zb().onAutoLogin(t)})),c.Bc(19,"Login als Moderator "),c.Pb(),c.Pb(),c.Qb(20,"p"),c.Bc(21,"Username: user@bogenliga.de "),c.Mb(22,"br"),c.Bc(23,"Password: user "),c.Mb(24,"br"),c.Bc(25,"Rolle: USER"),c.Mb(26,"br"),c.Qb(27,"bla-button",31),c.Xb("onClick",(function(t){return c.pc(e),c.Zb().onAutoLogin(t)})),c.Bc(28,"Login als User "),c.Pb(),c.Pb(),c.Qb(29,"p"),c.Bc(30,"Username: Malorie.Artman@bogenliga.de "),c.Mb(31,"br"),c.Bc(32,"Password: swt2 "),c.Mb(33,"br"),c.Bc(34,"Rolle: USER"),c.Mb(35,"br"),c.Qb(36,"bla-button",31),c.Xb("onClick",(function(t){return c.pc(e),c.Zb().onAutoLogin(t)})),c.Bc(37,"Login als Test-Benutzer "),c.Pb(),c.Pb(),c.Qb(38,"p"),c.Bc(39,"Username: Nicholas.Corle@bogenliga.de "),c.Mb(40,"br"),c.Bc(41,"Password: swt2 "),c.Mb(42,"br"),c.Bc(43,"Rolle: MODERATOR"),c.Mb(44,"br"),c.Qb(45,"bla-button",31),c.Xb("onClick",(function(t){return c.pc(e),c.Zb().onAutoLogin(t)})),c.Bc(46,"Login als Test-Moderator "),c.Pb(),c.Pb(),c.Qb(47,"p"),c.Bc(48,"Username: TeamLigaleiter@bogenliga.de "),c.Mb(49,"br"),c.Bc(50,"Password: swt2 "),c.Mb(51,"br"),c.Bc(52,"Rolle: LIGALEITER"),c.Mb(53,"br"),c.Qb(54,"bla-button",31),c.Xb("onClick",(function(t){return c.pc(e),c.Zb().onAutoLogin(t)})),c.Bc(55,"Login f\xfcr Team Ligaleiter "),c.Pb(),c.Pb(),c.Qb(56,"p"),c.Bc(57,"Username: TeamSportleiter@bogenliga.de "),c.Mb(58,"br"),c.Bc(59,"Password: swt2 "),c.Mb(60,"br"),c.Bc(61,"Rolle: SPORTLEITER"),c.Mb(62,"br"),c.Qb(63,"bla-button",31),c.Xb("onClick",(function(t){return c.pc(e),c.Zb().onAutoLogin(t)})),c.Bc(64,"Login f\xfcr Team Sportleiter "),c.Pb(),c.Pb(),c.Qb(65,"p"),c.Bc(66,"Username: TeamModerator@bogenliga.de "),c.Mb(67,"br"),c.Bc(68,"Password: swt2 "),c.Mb(69,"br"),c.Bc(70,"Rolle: MODERATOR"),c.Mb(71,"br"),c.Qb(72,"bla-button",31),c.Xb("onClick",(function(t){return c.pc(e),c.Zb().onAutoLogin(t)})),c.Bc(73,"Login f\xfcr Team Moderator "),c.Pb(),c.Pb(),c.Pb(),c.Pb()}if(2&e){const e=c.Zb();c.zb(1),c.fc("alertType",e.AlertType.INFO),c.zb(8),c.fc("buttonSize",e.ButtonSize.SMALL)("value",e.testAdminUser),c.zb(9),c.fc("buttonSize",e.ButtonSize.SMALL)("value",e.testModeratorUser),c.zb(9),c.fc("buttonSize",e.ButtonSize.SMALL)("value",e.testUserUser),c.zb(9),c.fc("buttonSize",e.ButtonSize.SMALL)("value",e.testDummyUserUser),c.zb(9),c.fc("buttonSize",e.ButtonSize.SMALL)("value",e.testDummyModeratorUser),c.zb(9),c.fc("buttonSize",e.ButtonSize.SMALL)("value",e.testTeamLigaleiter),c.zb(9),c.fc("buttonSize",e.ButtonSize.SMALL)("value",e.testTeamSportleiter),c.zb(9),c.fc("buttonSize",e.ButtonSize.SMALL)("value",e.testTeamModerator)}}let S=(()=>{class e{constructor(e,t,n,r){this.loginDataProviderService=e,this.currentUserService=t,this.route=n,this.router=r,this.credentials=new R.a,this.loading=!1,this.loginResult=E.a.PENDING,this.ButtonSize=g.b,this.AlertType=u.b,this.LoginResult=E.a,this.inProd=d.a.production,this.isSpotterAuthenticationEnabled=!1,this.testAdminUser=new R.a("admin@bogenliga.de","admin"),this.testModeratorUser=new R.a("moderator@bogenliga.de","moderator"),this.testUserUser=new R.a("user@bogenliga.de","user"),this.testDummyModeratorUser=new R.a("Nicholas.Corle@bogenliga.de","swt2"),this.testDummyUserUser=new R.a("Malorie.Artman@bogenliga.de","swt2"),this.testTeamLigaleiter=new R.a("TeamLigaleiter@bogenliga.de","swt2"),this.testTeamSportleiter=new R.a("TeamSportleiter@bogenliga.de","swt2"),this.testTeamModerator=new R.a("TeamModerator@bogenliga.de","swt2"),this.config=h,this.destinationRouteAfterLogin="/home"}ngOnInit(){this.route.queryParams.subscribe(e=>{Object(b.c)(e.destination)||(this.destinationRouteAfterLogin=e.destination)}),this.initRememberedUsername()}onLogin(e){this.loading=!0,this.currentUserService.disableDefaultUser(),this.loginDataProviderService.signIn(this.credentials).then(()=>this.handleSuccessfulLogin(),e=>this.showFailedLogin(e))}onSpotterLogin(e){this.destinationRouteAfterLogin="/spotter/authentication",this.credentials=e,this.onLogin(null)}onAutoLogin(e){this.credentials=e,this.onLogin(null)}initRememberedUsername(){this.credentials.username=this.loginDataProviderService.getEmailAddress(),Object(b.a)(this.credentials.username)||(this.credentials.rememberMe=!0)}showFailedLogin(e){this.loading=!1,this.loginResult=e}handleSuccessfulLogin(){this.loading=!1,this.loginResult=E.a.SUCCESS,this.router.navigateByUrl(this.destinationRouteAfterLogin)}}return e.\u0275fac=function(t){return new(t||e)(c.Lb(P.a),c.Lb(f.a),c.Lb(a.a),c.Lb(a.c))},e.\u0275cmp=c.Fb({type:e,selectors:[["bla-login"]],decls:68,vars:82,consts:[[3,"config"],["id","login"],["id","login-dialog"],[3,"visible","header","alertType"],[1,"card","mb-4","shadow-sm"],[1,"card-body","login-dialog"],["id","loginForm"],["loginForm","ngForm"],[1,"imgcontainer"],["src","assets/img/logo.png","alt","Logo",1,"avatar"],[1,"h3","mb-3","font-weight-normal"],[1,"container"],[1,"form-group"],["for","loginEmail"],["type","email","name","loginEmail","id","loginEmail","required","","pattern","^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,63}$",1,"form-control",3,"ngModel","placeholder","ngModelChange"],["loginEmail","ngModel"],[1,"invalid-feedback"],["for","loginPassword"],["type","password","id","loginPassword","name","loginPassword","required","","minlength","3",1,"form-control",3,"ngModel","placeholder","ngModelChange","keyup.enter"],["loginPassword","ngModel"],["for","loginCode"],["type","text","id","loginCode","name","loginCode","minlength","3",1,"form-control",3,"ngModel","placeholder","ngModelChange","keyup.enter"],["loginCode","ngModel"],[1,"form-group","form-check"],["type","checkbox","id","loginRememberMe","name","loginRememberMe",1,"form-check-input",3,"ngModel","ngModelChange"],["for","loginRememberMe",1,"form-check-label"],[3,"id","buttonSize","disabled","loading","onClick"],[3,"buttonSize","disabled","visible","onClick"],[4,"ngIf"],["header","Testbenutzer:",3,"alertType"],["data-cy","login-als-admin-button",3,"buttonSize","value","onClick"],[3,"buttonSize","value","onClick"]],template:function(e,t){if(1&e&&(c.Qb(0,"bla-common-dialog",0),c.Qb(1,"div",1),c.Qb(2,"div",2),c.Qb(3,"bla-alert",3),c.ac(4,"translate"),c.Bc(5),c.ac(6,"translate"),c.Pb(),c.Qb(7,"bla-alert",3),c.ac(8,"translate"),c.Bc(9),c.ac(10,"translate"),c.Pb(),c.Qb(11,"bla-alert",3),c.ac(12,"translate"),c.Bc(13),c.ac(14,"translate"),c.Pb(),c.Qb(15,"div",4),c.Qb(16,"div",5),c.Qb(17,"form",6,7),c.Qb(19,"div",8),c.Mb(20,"img",9),c.Qb(21,"h5",10),c.Bc(22),c.ac(23,"translate"),c.Pb(),c.Pb(),c.Qb(24,"div",11),c.Qb(25,"div",12),c.Qb(26,"label",13),c.Bc(27),c.ac(28,"translate"),c.Pb(),c.Qb(29,"input",14,15),c.Xb("ngModelChange",(function(e){return t.credentials.username=e})),c.ac(31,"translate"),c.Pb(),c.Qb(32,"div",16),c.Bc(33),c.ac(34,"translate"),c.Pb(),c.Pb(),c.Qb(35,"div",12),c.Qb(36,"label",17),c.Bc(37),c.ac(38,"translate"),c.Pb(),c.Qb(39,"input",18,19),c.Xb("ngModelChange",(function(e){return t.credentials.password=e}))("keyup.enter",(function(e){return t.onLogin(e)})),c.ac(41,"translate"),c.Pb(),c.Qb(42,"div",16),c.Bc(43),c.ac(44,"translate"),c.Pb(),c.Pb(),c.Qb(45,"div",12),c.Qb(46,"label",20),c.Bc(47),c.ac(48,"translate"),c.Pb(),c.Qb(49,"input",21,22),c.Xb("ngModelChange",(function(e){return t.credentials.code=e}))("keyup.enter",(function(e){return t.onLogin(e)})),c.ac(51,"translate"),c.Pb(),c.Qb(52,"div",16),c.Bc(53),c.ac(54,"translate"),c.Pb(),c.Pb(),c.Qb(55,"div",23),c.Qb(56,"input",24),c.Xb("ngModelChange",(function(e){return t.credentials.rememberMe=e})),c.Pb(),c.Qb(57,"label",25),c.Bc(58),c.ac(59,"translate"),c.Pb(),c.Pb(),c.Qb(60,"bla-button",26),c.Xb("onClick",(function(e){return t.onLogin(e)})),c.Bc(61),c.ac(62,"translate"),c.Pb(),c.Mb(63,"br"),c.Qb(64,"bla-button",27),c.Xb("onClick",(function(){return t.onSpotterLogin(t.testModeratorUser)})),c.Bc(65),c.ac(66,"translate"),c.Pb(),c.Pb(),c.Pb(),c.Pb(),c.Pb(),c.zc(67,O,74,17,"div",28),c.Pb(),c.Pb(),c.Pb()),2&e){const e=c.oc(18),n=c.oc(30),r=c.oc(40),o=c.oc(50);c.fc("config",t.config),c.zb(3),c.gc("header",c.bc(4,44,"USER.LOGIN.NOTIFICATION.LOGIN_SUCCESSFUL.HEADER")),c.fc("visible",t.loginResult===t.LoginResult.SUCCESS)("alertType",t.AlertType.SUCCESS),c.zb(2),c.Dc(" ",c.bc(6,46,"USER.LOGIN.NOTIFICATION.LOGIN_SUCCESSFUL.TEXT")," "),c.zb(2),c.gc("header",c.bc(8,48,"USER.LOGIN.NOTIFICATION.LOGIN_FAILURE.HEADER")),c.fc("visible",t.loginResult===t.LoginResult.FAILURE)("alertType",t.AlertType.DANGER),c.zb(2),c.Dc(" ",c.bc(10,50,"USER.LOGIN.NOTIFICATION.LOGIN_FAILURE.TEXT")," "),c.zb(2),c.gc("header",c.bc(12,52,"USER.LOGIN.NOTIFICATION.LOGIN_CONNECTION_PROBLEM.HEADER")),c.fc("visible",t.loginResult===t.LoginResult.CONNECTION_PROBLEM)("alertType",t.AlertType.WARNING),c.zb(2),c.Dc(" ",c.bc(14,54,"USER.LOGIN.NOTIFICATION.LOGIN_CONNECTION_PROBLEM.TEXT")," "),c.zb(9),c.Cc(c.bc(23,56,"USER.LOGIN.HEADER")),c.zb(5),c.Cc(c.bc(28,58,"USER.LOGIN.USERNAME.LABEL")),c.zb(2),c.Db("is-invalid",n.invalid&&!n.untouched||t.loginResult===t.LoginResult.FAILURE),c.gc("placeholder",c.bc(31,60,"USER.LOGIN.USERNAME.LABEL")),c.fc("ngModel",t.credentials.username),c.zb(4),c.Dc(" ",c.bc(34,62,"USER.LOGIN.USERNAME.ERROR")," "),c.zb(4),c.Cc(c.bc(38,64,"USER.LOGIN.PASSWORD.LABEL")),c.zb(2),c.Db("is-invalid",r.invalid&&!r.untouched||t.loginResult===t.LoginResult.FAILURE),c.gc("placeholder",c.bc(41,66,"USER.LOGIN.PASSWORD.PLACEHOLDER")),c.fc("ngModel",t.credentials.password),c.zb(4),c.Dc(" ",c.bc(44,68,"USER.LOGIN.PASSWORD.ERROR")," "),c.zb(4),c.Cc(c.bc(48,70,"USER.LOGIN.CODE.LABEL")),c.zb(2),c.Db("is-invalid",o.invalid&&!o.untouched||t.loginResult===t.LoginResult.FAILURE),c.gc("placeholder",c.bc(51,72,"USER.LOGIN.CODE.PLACEHOLDER")),c.fc("ngModel",t.credentials.code),c.zb(4),c.Dc(" ",c.bc(54,74,"USER.LOGIN.CODE.ERROR")," "),c.zb(3),c.fc("ngModel",t.credentials.rememberMe),c.zb(2),c.Cc(c.bc(59,76,"USER.LOGIN.REMEMBER_ME.LABEL")),c.zb(2),c.fc("id","loginButton")("buttonSize",t.ButtonSize.LARGE_BLOCK)("disabled",!e.valid)("loading",t.loading),c.zb(1),c.Dc("",c.bc(62,78,"USER.LOGIN.BUTTON.LOGIN")," "),c.zb(3),c.fc("buttonSize",t.ButtonSize.SMALL)("disabled",!t.isSpotterAuthenticationEnabled)("visible",t.isSpotterAuthenticationEnabled),c.zb(1),c.Dc(" ",c.bc(66,80,"SPOTTER.LINK.TEXT")," "),c.zb(2),c.fc("ngIf",!(!0===t.inProd))}},directives:[m.a,p.a,o.D,o.o,o.p,o.c,o.y,o.u,o.n,o.q,o.m,o.a,L.a,r.t],pipes:[M.d],styles:["#login[_ngcontent-%COMP%]{display:flex;justify-content:center}#login-dialog[_ngcontent-%COMP%]{width:500px;max-width:500px}.imgcontainer[_ngcontent-%COMP%]{text-align:center;margin:24px 0 12px}img.avatar[_ngcontent-%COMP%]{width:40%;border-radius:50%}"]}),e})();var U=n("PEb7"),v=n("gQPg"),C=n("/k8H"),A=n("XUa0");const I={moduleTranslationKey:"USER",pageTitleTranslationKey:"USER.PROFILE.TITLE"};var w=n("20cS");let T=(()=>{class e extends U.CommonComponentDirective{constructor(e,t,n,r,o){super(),this.userProfileDataProvider=e,this.router=t,this.route=n,this.notificationService=r,this.currentUserService=o,this.config=I,this.ButtonType=U.ButtonType,this.currentUserProfile=new A.a,this.sessionHandling=new w.a(this.currentUserService)}ngOnInit(){this.loading=!0,this.notificationService.discardNotification(),this.loadCurrentUserProfile()}onMouseOver(e){this.sessionHandling.checkSessionExpired()&&window.location.reload()}loadCurrentUserProfile(){this.userProfileDataProvider.findCurrentUserProfile().then(e=>this.handleSuccess(e)).catch(e=>this.handleFailure(e))}handleSuccess(e){this.currentUserProfile=e.payload,this.loading=!1}handleFailure(e){this.loading=!1}}return e.\u0275fac=function(t){return new(t||e)(c.Lb(C.a),c.Lb(a.c),c.Lb(a.a),c.Lb(v.c),c.Lb(f.a))},e.\u0275cmp=c.Fb({type:e,selectors:[["bla-user-profile"]],features:[c.yb([]),c.wb],decls:101,vars:86,consts:[[3,"config","loading","mouseover"],["id","userProfileForm",1,"horizontal-form","half-page"],["userProfileForm","ngForm"],[1,"form-group","row"],["for","userProfileVorname",1,"col-sm-3","col-form-label"],[1,"col-sm-9"],["type","text","readonly","","id","userProfileVorname","name","userProfileVorname",1,"form-control-plaintext",3,"ngModel","placeholder","ngModelChange"],["userProfileVorname","ngModel"],[1,"invalid-feedback"],["for","userProfileNachname",1,"col-sm-3","col-form-label"],["type","text","readonly","","id","userProfileNachname","name","userProfileNachname",1,"form-control-plaintext",3,"ngModel","placeholder","ngModelChange"],["userProfileNachname","ngModel"],["for","userProfileEmail",1,"col-sm-3","col-form-label"],["type","text","readonly","","id","userProfileEmail","name","userProfileEmail",1,"form-control-plaintext",3,"ngModel","placeholder","ngModelChange"],["userProfileEmail","ngModel"],["for","userProfileGeburtsdatum",1,"col-sm-3","col-form-label"],["type","text","readonly","","pattern","[0-9]{4}-[0-9]{2}-[0-9]{2}","id","userProfileGeburtsdatum","name","userProfileGeburtsdatum",1,"form-control-plaintext",3,"ngModel","placeholder","ngModelChange"],["userProfileGeburtsdatum","ngModel"],["for","userProfileMitgliedsnummer",1,"col-sm-3","col-form-label"],["type","text","readonly","","id","userProfileMitgliedsnummer","name","userProfileMitgliedsnummer",1,"form-control-plaintext",3,"ngModel","placeholder","ngModelChange"],["userProfileMitgliedsnummer","ngModel"],["for","userProfileNationalitaet",1,"col-sm-3","col-form-label"],["type","text","readonly","","pattern","[D|AT|CH|FR|IT|GB]","id","userProfileNationalitaet","name","userProfileNationalitaet",1,"form-control-plaintext",3,"ngModel","placeholder","ngModelChange"],["userProfileNationalitaet","ngModel"],["for","userProfileVerein",1,"col-sm-3","col-form-label"],["type","text","readonly","","id","userProfileVerein","name","userProfileVerein",1,"form-control-plaintext",3,"ngModel","placeholder","ngModelChange"],["userProfileVerein","ngModel"]],template:function(e,t){if(1&e&&(c.Qb(0,"bla-common-dialog",0),c.Xb("mouseover",(function(e){return t.onMouseOver(e)})),c.Qb(1,"form",1,2),c.Qb(3,"div",3),c.Qb(4,"label",4),c.Qb(5,"span"),c.Bc(6),c.ac(7,"translate"),c.Pb(),c.Qb(8,"span"),c.Bc(9," *"),c.Pb(),c.Pb(),c.Qb(10,"div",5),c.Qb(11,"input",6,7),c.Xb("ngModelChange",(function(e){return t.currentUserProfile.vorname=e})),c.ac(13,"translate"),c.Pb(),c.Qb(14,"div",8),c.Bc(15),c.ac(16,"translate"),c.Pb(),c.Pb(),c.Pb(),c.Qb(17,"div",3),c.Qb(18,"label",9),c.Qb(19,"span"),c.Bc(20),c.ac(21,"translate"),c.Pb(),c.Qb(22,"span"),c.Bc(23," *"),c.Pb(),c.Pb(),c.Qb(24,"div",5),c.Qb(25,"input",10,11),c.Xb("ngModelChange",(function(e){return t.currentUserProfile.nachname=e})),c.ac(27,"translate"),c.Pb(),c.Qb(28,"div",8),c.Bc(29),c.ac(30,"translate"),c.Pb(),c.Pb(),c.Pb(),c.Qb(31,"div",3),c.Qb(32,"label",12),c.Qb(33,"span"),c.Bc(34),c.ac(35,"translate"),c.Pb(),c.Qb(36,"span"),c.Bc(37," *"),c.Pb(),c.Pb(),c.Qb(38,"div",5),c.Qb(39,"input",13,14),c.Xb("ngModelChange",(function(e){return t.currentUserProfile.email=e})),c.ac(41,"translate"),c.Pb(),c.Qb(42,"div",8),c.Bc(43),c.ac(44,"translate"),c.Pb(),c.Pb(),c.Pb(),c.Qb(45,"div",3),c.Qb(46,"label",15),c.Qb(47,"span"),c.Bc(48),c.ac(49,"translate"),c.Pb(),c.Qb(50,"span"),c.Bc(51," *"),c.Pb(),c.Pb(),c.Qb(52,"div",5),c.Qb(53,"input",16,17),c.Xb("ngModelChange",(function(e){return t.currentUserProfile.geburtsdatum=e})),c.ac(55,"translate"),c.Pb(),c.Qb(56,"div",8),c.Bc(57),c.ac(58,"translate"),c.Pb(),c.Pb(),c.Pb(),c.Qb(59,"div",3),c.Qb(60,"label",18),c.Qb(61,"span"),c.Bc(62),c.ac(63,"translate"),c.Pb(),c.Qb(64,"span"),c.Bc(65," *"),c.Pb(),c.Pb(),c.Qb(66,"div",5),c.Qb(67,"input",19,20),c.Xb("ngModelChange",(function(e){return t.currentUserProfile.mitgliedsnummer=e})),c.ac(69,"translate"),c.Pb(),c.Qb(70,"div",8),c.Bc(71),c.ac(72,"translate"),c.Pb(),c.Pb(),c.Pb(),c.Qb(73,"div",3),c.Qb(74,"label",21),c.Qb(75,"span"),c.Bc(76),c.ac(77,"translate"),c.Pb(),c.Qb(78,"span"),c.Bc(79," *"),c.Pb(),c.Pb(),c.Qb(80,"div",5),c.Qb(81,"input",22,23),c.Xb("ngModelChange",(function(e){return t.currentUserProfile.nationalitaet=e})),c.ac(83,"translate"),c.Pb(),c.Qb(84,"div",8),c.Bc(85),c.ac(86,"translate"),c.Pb(),c.Pb(),c.Pb(),c.Qb(87,"div",3),c.Qb(88,"label",24),c.Qb(89,"span"),c.Bc(90),c.ac(91,"translate"),c.Pb(),c.Qb(92,"span"),c.Bc(93," *"),c.Pb(),c.Pb(),c.Qb(94,"div",5),c.Qb(95,"input",25,26),c.Xb("ngModelChange",(function(e){return t.currentUserProfile.vereinsId=e})),c.ac(97,"translate"),c.Pb(),c.Qb(98,"div",8),c.Bc(99),c.ac(100,"translate"),c.Pb(),c.Pb(),c.Pb(),c.Pb(),c.Pb()),2&e){const e=c.oc(12),n=c.oc(26),r=c.oc(40),o=c.oc(54),a=c.oc(68),i=c.oc(82),l=c.oc(96);c.fc("config",t.config)("loading",t.loading),c.zb(6),c.Cc(c.bc(7,44,"USER.PROFILE.FORM.VORNAME.LABEL")),c.zb(5),c.Db("is-invalid",e.invalid&&!e.untouched),c.gc("placeholder",c.bc(13,46,"USER.PROFILE.FORM.VORNAME.PLACEHOLDER")),c.fc("ngModel",t.currentUserProfile.vorname),c.zb(4),c.Dc(" ",c.bc(16,48,"USER.PROFILE.FORM.VORNAME.ERROR")," "),c.zb(5),c.Cc(c.bc(21,50,"USER.PROFILE.FORM.NACHNAME.LABEL")),c.zb(5),c.Db("is-invalid",n.invalid&&!n.untouched),c.gc("placeholder",c.bc(27,52,"USER.PROFILE.FORM.NACHNAME.PLACEHOLDER")),c.fc("ngModel",t.currentUserProfile.nachname),c.zb(4),c.Dc(" ",c.bc(30,54,"USER.PROFILE.FORM.NACHNAME.ERROR")," "),c.zb(5),c.Cc(c.bc(35,56,"USER.PROFILE.FORM.EMAIL.LABEL")),c.zb(5),c.Db("is-invalid",r.invalid&&!r.untouched),c.gc("placeholder",c.bc(41,58,"USER.PROFILE.FORM.EMAIL.PLACEHOLDER")),c.fc("ngModel",t.currentUserProfile.email),c.zb(4),c.Dc(" ",c.bc(44,60,"USER.PROFILE.FORM.EMAIL.ERROR")," "),c.zb(5),c.Cc(c.bc(49,62,"USER.PROFILE.FORM.GEBURTSDATUM.LABEL")),c.zb(5),c.Db("is-invalid",o.invalid&&!o.untouched),c.gc("placeholder",c.bc(55,64,"USER.PROFILE.FORM.GEBURTSDATUM.PLACEHOLDER")),c.fc("ngModel",t.currentUserProfile.geburtsdatum),c.zb(4),c.Dc(" ",c.bc(58,66,"USER.PROFILE.FORM.GEBURTSDATUM.ERROR")," "),c.zb(5),c.Cc(c.bc(63,68,"USER.PROFILE.FORM.MITGLIEDSNUMMER.LABEL")),c.zb(5),c.Db("is-invalid",a.invalid&&!a.untouched),c.gc("placeholder",c.bc(69,70,"USER.PROFILE.FORM.MITGLIEDSNUMMER.PLACEHOLDER")),c.fc("ngModel",t.currentUserProfile.mitgliedsnummer),c.zb(4),c.Dc(" ",c.bc(72,72,"USER.PROFILE.FORM.MITGLIEDSNUMMER.ERROR")," "),c.zb(5),c.Cc(c.bc(77,74,"USER.PROFILE.FORM.NATIONALITAET.LABEL")),c.zb(5),c.Db("is-invalid",i.invalid&&!i.untouched),c.gc("placeholder",c.bc(83,76,"USER.PROFILE.FORM.NATIONALITAET.PLACEHOLDER")),c.fc("ngModel",t.currentUserProfile.nationalitaet),c.zb(4),c.Dc(" ",c.bc(86,78,"USER.PROFILE.FORM.NATIONALITAET.ERROR")," "),c.zb(5),c.Cc(c.bc(91,80,"USER.PROFILE.FORM.VEREIN.LABEL")),c.zb(5),c.Db("is-invalid",l.invalid&&!l.untouched),c.gc("placeholder",c.bc(97,82,"USER.PROFILE.FORM.VEREIN.PLACEHOLDER")),c.fc("ngModel",t.currentUserProfile.vereinsId),c.zb(4),c.Dc(" ",c.bc(100,84,"USER.PROFILE.FORM.VEREIN.ERROR")," ")}},directives:[m.a,o.D,o.o,o.p,o.c,o.n,o.q,o.u],pipes:[M.d],styles:[".half-page[_ngcontent-%COMP%]{width:50%}.button-box[_ngcontent-%COMP%]{display:flex;justify-content:space-between;flex-direction:row-reverse;flex-wrap:wrap}@media (max-width:1400px){.half-page[_ngcontent-%COMP%]{width:80%}}@media (max-width:950px){.half-page[_ngcontent-%COMP%]{width:100%}}"]}),e})();var N=n("YfBl");class D{constructor(e,t){this.password=e,this.newPassword=t}}let B=(()=>{class e extends N.DataProviderService{constructor(e){super(),this.restClient=e,this.serviceSubUrl="v1/user"}update(e){return new Promise((t,n)=>{const r=new D(e.password,e.newPassword);this.sendUpdateRequest(r,t,n)})}sendUpdateRequest(e,t,n){this.restClient.PUT((new N.UriBuilder).fromPath(this.getUrl()).build(),e).then(e=>{t(N.RequestResult.SUCCESS)},e=>{n(0===e.status?{result:N.RequestResult.CONNECTION_PROBLEM}:{result:N.RequestResult.FAILURE})})}}return e.\u0275fac=function(t){return new(t||e)(c.Ub(N.RestClient))},e.\u0275prov=c.Hb({token:e,factory:e.\u0275fac,providedIn:"root"}),e})();class Q{constructor(e,t){this.password=e||"",this.newPassword=t||"",this.verifyPassword=t||""}}const F={moduleTranslationKey:"USER",pageTitleTranslationKey:"USER.PWD.TITLE"},z=[{path:"profile",pathMatch:"full",component:T,canActivate:[s]},{path:"pwd",pathMatch:"full",component:(()=>{class e{constructor(e,t){this.userPwdDataProvider=e,this.currentUserService=t,this.config=F,this.changeCredentials=new Q,this.loginResult=E.a.PENDING,this.LoginResult=E.a,this.AlertType=u.b,this.sessionHandling=new w.a(this.currentUserService)}ngOnInit(){}onMouseOver(e){this.sessionHandling.checkSessionExpired()&&window.location.reload()}onUpdate(e){this.userPwdDataProvider.update(this.changeCredentials).then(()=>this.handleSuccessUpdate(),e=>this.showFailedUpdate(e))}showFailedUpdate(e){this.loginResult=e}handleSuccessUpdate(){this.loginResult=E.a.SUCCESS}}return e.\u0275fac=function(t){return new(t||e)(c.Lb(B),c.Lb(f.a))},e.\u0275cmp=c.Fb({type:e,selectors:[["bla-user-pwd"]],decls:55,vars:66,consts:[[3,"config","mouseover"],["id","pwd"],["id","userPwd-dialog"],[3,"visible","header","alertType"],[1,"card","mb-4","shadow-sm"],[1,"card-body","userPwd-dialog"],["id","userPwdForm"],["userPwdForm","ngForm"],[1,"imgcontainer"],["src","../assets/img/logo.png","alt","Logo",1,"avatar"],[1,"container"],[1,"form-group"],["for","userPwdFormPassword"],["type","password","id","userPwdFormPassword","name","userPwdFormPassword","required","",1,"form-control",3,"ngModel","placeholder","ngModelChange"],["userPwdFormPassword","ngModel"],[1,"invalid-feedback"],["for","userPwdFormNewPwd"],["type","password","required","","pattern","^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d#$^+=!*()@%&?]{8,}$","id","userPwdFormNewPwd","name","userPwdFormNewPwd",1,"form-control",3,"ngModel","placeholder","ngModelChange"],["userPwdFormNewPwd","ngModel"],["for","userPwdFormVerifyPwd"],["type","password","id","userPwdFormVerifyPwd","name","userPwdFormVerifyPwd","required","","minlength","8",1,"form-control",3,"ngModel","placeholder","ngModelChange"],["userPwdFormVerifyPwd","ngModel"],[3,"id","disabled","onClick"]],template:function(e,t){if(1&e&&(c.Qb(0,"bla-common-dialog",0),c.Xb("mouseover",(function(e){return t.onMouseOver(e)})),c.Qb(1,"div",1),c.Qb(2,"div",2),c.Qb(3,"bla-alert",3),c.ac(4,"translate"),c.Bc(5),c.ac(6,"translate"),c.Pb(),c.Qb(7,"bla-alert",3),c.ac(8,"translate"),c.Bc(9),c.ac(10,"translate"),c.Pb(),c.Qb(11,"bla-alert",3),c.ac(12,"translate"),c.Bc(13),c.ac(14,"translate"),c.Pb(),c.Qb(15,"div",4),c.Qb(16,"div",5),c.Qb(17,"form",6,7),c.Qb(19,"div",8),c.Mb(20,"img",9),c.Pb(),c.Qb(21,"div",10),c.Qb(22,"div",11),c.Qb(23,"label",12),c.Bc(24),c.ac(25,"translate"),c.Pb(),c.Qb(26,"input",13,14),c.Xb("ngModelChange",(function(e){return t.changeCredentials.password=e})),c.ac(28,"translate"),c.Pb(),c.Qb(29,"div",15),c.Bc(30),c.ac(31,"translate"),c.Pb(),c.Pb(),c.Qb(32,"div",11),c.Qb(33,"label",16),c.Bc(34),c.ac(35,"translate"),c.Pb(),c.Qb(36,"input",17,18),c.Xb("ngModelChange",(function(e){return t.changeCredentials.newPassword=e})),c.ac(38,"translate"),c.Pb(),c.Qb(39,"div",15),c.Bc(40),c.ac(41,"translate"),c.Pb(),c.Pb(),c.Qb(42,"div",11),c.Qb(43,"label",19),c.Bc(44),c.ac(45,"translate"),c.Pb(),c.Qb(46,"input",20,21),c.Xb("ngModelChange",(function(e){return t.changeCredentials.verifyPassword=e})),c.ac(48,"translate"),c.Pb(),c.Qb(49,"div",15),c.Bc(50),c.ac(51,"translate"),c.Pb(),c.Pb(),c.Qb(52,"bla-button",22),c.Xb("onClick",(function(e){return t.onUpdate(e)})),c.Bc(53),c.ac(54,"translate"),c.Pb(),c.Pb(),c.Pb(),c.Pb(),c.Pb(),c.Pb(),c.Pb(),c.Pb()),2&e){const e=c.oc(18),n=c.oc(27),r=c.oc(37),o=c.oc(47);c.fc("config",t.config),c.zb(3),c.gc("header",c.bc(4,34,"USER.PWD.NOTIFICATION.PWD_SUCCESSFUL.HEADER")),c.fc("visible",t.loginResult===t.LoginResult.SUCCESS)("alertType",t.AlertType.SUCCESS),c.zb(2),c.Dc(" ",c.bc(6,36,"USER.PWD.NOTIFICATION.PWD_SUCCESSFUL.TEXT")," "),c.zb(2),c.gc("header",c.bc(8,38,"USER.PWD.NOTIFICATION.PWD_FAILURE.HEADER")),c.fc("visible",t.loginResult===t.LoginResult.FAILURE)("alertType",t.AlertType.DANGER),c.zb(2),c.Dc(" ",c.bc(10,40,"USER.PWD.NOTIFICATION.PWD_FAILURE.TEXT")," "),c.zb(2),c.gc("header",c.bc(12,42,"USER.PWD.NOTIFICATION.PWD_CONNECTION_PROBLEM.HEADER")),c.fc("visible",t.loginResult===t.LoginResult.CONNECTION_PROBLEM)("alertType",t.AlertType.WARNING),c.zb(2),c.Dc(" ",c.bc(14,44,"USER.PWD.NOTIFICATION.PWD_CONNECTION_PROBLEM.TEXT")," "),c.zb(11),c.Cc(c.bc(25,46,"USER.PWD.FORM.PASSWORD.LABEL")),c.zb(2),c.Db("is-invalid",n.invalid&&!n.untouched),c.gc("placeholder",c.bc(28,48,"USER.PWD.FORM.PASSWORD.PLACEHOLDER")),c.fc("ngModel",t.changeCredentials.password),c.zb(4),c.Dc(" ",c.bc(31,50,"USER.PWD.FORM.PASSWORD.ERROR")," "),c.zb(4),c.Cc(c.bc(35,52,"USER.PWD.FORM.NEWPASSWORD.LABEL")),c.zb(2),c.Db("is-invalid",r.invalid&&!r.untouched),c.gc("placeholder",c.bc(38,54,"USER.PWD.FORM.NEWPASSWORD.PLACEHOLDER")),c.fc("ngModel",t.changeCredentials.newPassword),c.zb(4),c.Dc(" ",c.bc(41,56,"USER.PWD.FORM.NEWPASSWORD.ERROR")," "),c.zb(4),c.Cc(c.bc(45,58,"USER.PWD.FORM.VERIFYPASSWORD.LABEL")),c.zb(2),c.Db("is-invalid",o.value!=r.value),c.gc("placeholder",c.bc(48,60,"USER.PWD.FORM.VERIFYPASSWORD.PLACEHOLDER")),c.fc("ngModel",t.changeCredentials.verifyPassword),c.zb(4),c.Dc(" ",c.bc(51,62,"USER.PWD.FORM.VERIFYPASSWORD.ERROR")," "),c.zb(2),c.fc("id","userPwdUpdateButton")("disabled",!e.valid),c.zb(1),c.Dc("",c.bc(54,64,"USER.PWD.FORM.UPDATE")," ")}},directives:[m.a,p.a,o.D,o.o,o.p,o.c,o.y,o.n,o.q,o.u,o.m,L.a],pipes:[M.d],styles:["#pwd[_ngcontent-%COMP%]{display:flex;justify-content:center}#userPwd-dialog[_ngcontent-%COMP%]{width:500px;max-width:500px}.imgcontainer[_ngcontent-%COMP%]{text-align:center;margin:24px 0 12px}img.avatar[_ngcontent-%COMP%]{width:40%;border-radius:50%}"]}),e})(),canActivate:[s]},{path:"login",component:S,canActivate:[s]}];n("FpXt");let y=(()=>{class e{}return e.\u0275mod=c.Jb({type:e}),e.\u0275inj=c.Ib({factory:function(t){return new(t||e)},providers:[s],imports:[[r.c,a.g.forChild(z),i.SharedModule.forChild(),o.k]]}),e})()}}]);