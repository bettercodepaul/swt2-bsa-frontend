(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{KDU1:function(t,e,s){"use strict";s.d(e,"a",(function(){return n})),s.d(e,"b",(function(){return l})),s.d(e,"c",(function(){return u}));class r{static copyFrom(t={}){const e=new r;return e.matchId=t.matchId?t.matchId:null,e.mannschaftId=t.mannschaftId?t.mannschaftId:null,e.wettkampfId=t.wettkampfId?t.wettkampfId:null,e.matchNr=t.matchNr?t.matchNr:null,e.lfdNr=t.lfdNr?t.lfdNr:null,e.dsbMitgliedId=t.dsbMitgliedId?t.dsbMitgliedId:null,e.ringzahl=t.ringzahl?t.ringzahl:[],e.rueckennummer=t.rueckennummer?t.rueckennummer:null,e}}function n(t){return t.map(t=>function(t){return{matchID:(e=r.copyFrom(t)).matchId,mannschaftId:e.mannschaftId,wettkampfId:e.wettkampfId,matchNr:e.matchNr,lfdNr:e.lfdNr,dsbMitgliedId:e.dsbMitgliedId,ringzahlPfeil1:e.ringzahl[0],ringzahlPfeil2:e.ringzahl[1],ringzahlPfeil3:e.ringzahl[2],ringzahlPfeil4:e.ringzahl[3],ringzahlPfeil5:e.ringzahl[4],ringzahlPfeil6:e.ringzahl[5],rueckennummer:e.rueckennummer};var e}(t))}function l(t){return t.map(t=>function(t){return{dsbMitgliedId:t.dsbMitgliedId,id:t.id,lfdNr:t.lfdNr,mannschaftId:t.mannschaftId,matchId:t.matchID,matchNr:t.matchNr,ringzahl:[t.ringzahlPfeil1,t.ringzahlPfeil2,0,0,0,0],schuetzeNr:t.rueckennummer,version:t.version,wettkampfId:t.wettkampfId}}(t))}function u(t){return t.map(t=>function(t){return{dsbMitgliedId:t.dsbMitgliedId,id:t.id,lfdNr:t.lfdNr,mannschaftId:t.mannschaftId,matchId:t.matchId,matchNr:t.matchNr,ringzahl:t.ringzahl,rueckennummer:t.schuetzeNr,wettkampfId:t.wettkampfId}}(t))}},S0PF:function(t,e,s){"use strict";s.d(e,"a",(function(){return r}));class r{constructor(t,e,s,r,n,l,u){this.scheibenNr=t||null,this.wettkampfID=e||null,this.isActive=!!s,this.satzNr=r||null,this.matchID=n||null,this.otherMatchId=l||null,this.accessToken=u||null}}},TcZ0:function(t,e,s){"use strict";s.d(e,"a",(function(){return c}));var r=s("YfBl"),n=s("5egv"),l=s("NJqk"),u=s("4ipa"),i=s("KDU1"),a=s("fXoL");let c=(()=>{class t extends r.DataProviderService{constructor(t,e,s){super(),this.restClient=t,this.currentUserService=e,this.onOfflineService=s,this.serviceSubUrl="v1/passen"}findByWettkampfId(t){return new Promise((e,s)=>{this.restClient.GET((new r.UriBuilder).fromPath(this.getUrl()).path("findByWettkampfId/wettkampfid="+t).build()).then(t=>{e({result:r.RequestResult.SUCCESS,payload:Object(n.a)(t)})},t=>{s(0===t.status?{result:r.RequestResult.CONNECTION_PROBLEM}:{result:r.RequestResult.FAILURE})})})}findOfflineByMatchIds(t,e){return new Promise((s,n)=>{u.a.passeTabelle.where("matchID").equals(t).or("matchID").equals(e).toArray().then(t=>{s({result:r.RequestResult.SUCCESS,payload:Object(i.b)(t)})},()=>{n({result:r.RequestResult.FAILURE})})})}findAll(){return new Promise((t,e)=>{this.restClient.GET(this.getUrl()+"/").then(e=>{t({result:r.RequestResult.SUCCESS,payload:Object(n.a)(e)})},t=>{e(0===t.status?{result:r.RequestResult.CONNECTION_PROBLEM}:{result:r.RequestResult.FAILURE})})})}}return t.\u0275fac=function(e){return new(e||t)(a.Sb(r.RestClient),a.Sb(l.a),a.Sb(l.i))},t.\u0275prov=a.Fb({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()},mwxE:function(t,e,s){"use strict";s.d(e,"a",(function(){return a}));var r=s("YfBl");class n{constructor(t,e,s,r,n,l,u){this.scheibennummer=t||null,this.wettkampfId=e||null,this.active=!!s,this.satznummer=r||null,this.matchId=n||null,this.otherMatchId=l||null,this.accessToken=u||null}}var l=s("S0PF");class u{static tabletSessionToDO(t){return new l.a(t.scheibennummer,t.wettkampfId,t.active,t.satznummer,t.matchId,t.otherMatchId,t.accessToken)}static tabletSessionToDTO(t){return new n(t.scheibenNr,t.wettkampfID,t.isActive,t.satzNr,t.matchID,t.otherMatchId,t.accessToken)}}var i=s("fXoL");let a=(()=>{class t extends r.DataProviderService{constructor(t){super(),this.restClient=t,this.serviceSubUrl="v1/tabletsessions"}findAllTabletSessions(t){return new Promise((e,s)=>{this.restClient.GET((new r.UriBuilder).fromPath(this.getUrl()).path(t).build()).then(t=>{const s=[];for(const e of t)s.push(u.tabletSessionToDO(e));e({result:r.RequestResult.SUCCESS,payload:s})},t=>{s(0===t.status?{result:r.RequestResult.CONNECTION_PROBLEM}:{result:r.RequestResult.FAILURE})})})}findAllTabletSessionswithoutArgument(){return new Promise((t,e)=>{this.restClient.GET((new r.UriBuilder).fromPath(this.getUrl()).build()).then(e=>{const s=[];for(const t of e)s.push(u.tabletSessionToDO(t));t({result:r.RequestResult.SUCCESS,payload:s})},t=>{e(0===t.status?{result:r.RequestResult.CONNECTION_PROBLEM}:{result:r.RequestResult.FAILURE})})})}findTabletSession(t,e){const s=(new r.UriBuilder).fromPath(this.getUrl()).path(t).path(e).build();return new Promise((t,e)=>{this.restClient.GET(s).then(e=>{t({result:r.RequestResult.SUCCESS,payload:u.tabletSessionToDO(e)})},t=>{e(0===t.status?{result:r.RequestResult.CONNECTION_PROBLEM}:{result:r.RequestResult.FAILURE})})})}create(t,e,s){const n=(new r.UriBuilder).fromPath(this.getUrl()).path(e).path(s).build();return new Promise((e,s)=>{this.restClient.POST(n,u.tabletSessionToDTO(t)).then(t=>{e({result:r.RequestResult.SUCCESS,payload:u.tabletSessionToDO(t)})},t=>{s(0===t.status?{result:r.RequestResult.CONNECTION_PROBLEM}:{result:r.RequestResult.FAILURE})})})}update(t){return t.accessToken=this.createAccessToken().toString(),new Promise((e,s)=>{this.restClient.PUT(this.getUrl(),u.tabletSessionToDTO(t)).then(t=>{e({result:r.RequestResult.SUCCESS,payload:u.tabletSessionToDO(t)})},t=>{s(0===t.status?{result:r.RequestResult.CONNECTION_PROBLEM}:{result:r.RequestResult.FAILURE})})})}updateWithoutTokenCreation(t){return new Promise((e,s)=>{this.restClient.PUT(this.getUrl(),u.tabletSessionToDTO(t)).then(t=>{e({result:r.RequestResult.SUCCESS,payload:u.tabletSessionToDO(t)})},t=>{s(0===t.status?{result:r.RequestResult.CONNECTION_PROBLEM}:{result:r.RequestResult.FAILURE})})})}delete(t,e){const s=(new r.UriBuilder).fromPath(this.getUrl()).path(t).path(e).build();return new Promise((t,e)=>{this.restClient.DELETE(s).then(e=>{t({result:r.RequestResult.SUCCESS,payload:e})},t=>{e(0===t.status?{result:r.RequestResult.CONNECTION_PROBLEM}:{result:r.RequestResult.FAILURE})})})}createAccessToken(){return Math.floor(1e5+9e5*Math.random())}}return t.\u0275fac=function(e){return new(e||t)(i.Sb(r.RestClient))},t.\u0275prov=i.Fb({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()}}]);