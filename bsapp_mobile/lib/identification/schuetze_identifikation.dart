/*
*  schuetze_identifikation.dart
*  Bogenliga-App
*
*  Created by [Author].
*  Copyright © 2018 [Company]. All rights reserved.
    */

import 'package:http/http.dart' as http;

import 'package:flutter/cupertino.dart';

import '../values/values.dart';
import 'package:flutter/material.dart';



// Beim intialen Screen werden die nächsten Wettkämpfe angezeigt
// dazu wird hier die Liste per Rest-Api Call geladen
// TODO: der Call muss noch so angepasst werden, dass man für die Titel der Veranstaltungen nichts nachladen muss


/*List<WettkampfTable_DO> parseWettkampfTable(String responseBody){
  final parsed = json.decode(responseBody).cast<Map<String, dynamic>>();
  return parsed.map<WettkampfTable_DO>((json) =>WettkampfTable_DO.fromJson(json)).toList();
}

Future<List<WettkampfTable_DO>> fetchWettkampfTable() async {
  final response = await http.get('http://localhost:9000/v1/wettkampf');
  if (response.statusCode == 200){
    return parseWettkampfTable(response.body);
  }else{
    throw Exception ('Unable to fetch WettkampfTable from Rest API');
  }
}

*/
class Request_Ident extends StatelessWidget{

  static BuildContext context;
  static DateTime birthday_selected;
//  final Future<List<WettkampfTable_DO>> wettkampftable = fetchWettkampfTable();
  // ToDO prüfen ob null init ok...

  _date_changed(DateTime date_selected){
      birthday_selected = date_selected;
  }
  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    // Within the `FirstScreen` widget
    return Scaffold(
      body: Container(
        constraints: BoxConstraints.expand(),
        decoration: BoxDecoration(
          color: Color.fromARGB(255, 255, 255, 255),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Align(
              alignment: Alignment.topLeft,
              child: Container(
                width: MediaQuery.of(context).size.width,
                height: 83,
                margin: EdgeInsets.only(left: 20, top: 40),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Align(
                      alignment: Alignment.topLeft,
                      child: Container(
                        width: MediaQuery.of(context).size.width*0.2,
                        height: 58,
                        child: Image.asset(
                          "assets/images/logo.png",
                          fit: BoxFit.none,
                        ),
                      ),
                    ),
                    Align(
                      alignment: Alignment.topLeft,
                      child: Container(
                        width: MediaQuery.of(context).size.width*0.3,
                        margin: EdgeInsets.only(left: 49, top: 26),
                        height: 58,
                        child: Text(
                          "Bogenliga-App",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: AppColors.primaryText,
                            fontFamily: "Helvetica",
                            fontWeight: FontWeight.w400,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ),
                    Align(
                      alignment: Alignment.topLeft,
                      child: Container(
                        width: MediaQuery.of(context).size.width*0.3,
                        height: 58,
                        child: Image.asset(
                          "assets/images/wsv1850-kl.png",
                          fit: BoxFit.none,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Ende der Titelzeile
            Container(
              width: MediaQuery.of(context).size.width,
              height: MediaQuery.of(context).size.height*0.5,
              margin: EdgeInsets.only(left: 20, right: 20, top: 25),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Positioned(
                    left: 1,
                    top: 32,
                    right: 0,
                    child: Opacity(
                      opacity: 0.36,
                      child: Image.asset(
                        "assets/images/logo-3.png",
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Positioned(
                    left: 1,
                    top: 0,
                    right: 1,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Container(
                          height: 104,
                          decoration: BoxDecoration(
                            border: Border.fromBorderSide(Borders.primaryBorder),
                            borderRadius: Radii.k8pxRadius,
                          ),
                          child: Container(),
                        ),
                        Container(
                          height: 64,
                          margin: EdgeInsets.only(top: 17),
                          decoration: BoxDecoration(
                            border: Border.fromBorderSide(Borders.primaryBorder),
                            borderRadius: Radii.k8pxRadius,
                          ),
                          child: Container(),
                        ),
                        Container(
                          height: 64,
                          margin: EdgeInsets.only(top: 17),
                          decoration: BoxDecoration(
                            border: Border.fromBorderSide(Borders.primaryBorder),
                            borderRadius: Radii.k8pxRadius,
                          ),
                          child: Container(),
                        ),
                       ],
                    ),
                  ),
                  Positioned(
                    left: 12,
                    top: 6,
                    width: MediaQuery.of(context).size.width*0.85,
                    child: Row(
                      children: [
                        Expanded(
                            child: Column( //Vorname - Nachname
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    margin: EdgeInsets.only(left: 12, right: 12, top: 10),
                                    child: CupertinoTextField(
                                      placeholder: 'Vorname',
                                      ),
                                    ),
                                  Container(
                                    margin: EdgeInsets.only(left: 12, right: 12, top: 10),
                                    child: CupertinoTextField(
                                      placeholder: 'Nachname',
                                    ),
                                  ),
                                ]
                            )
                        ),
                       ],
                    ),
                  ),
                  // Ende "Vorname - Nachname"
                  Positioned( //Dsb-Mitgliedsnummer
                    left: 12,
                    top: 133,
                    width: MediaQuery.of(context).size.width*0.85,
                    child: Row(
                      children: [
                        Expanded(
                            child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    child: Text(
                                      "   DSB-Mitgliedsnummer gem. Schützenausweis:",
                                      textAlign: TextAlign.left,
                                      style: TextStyle(
                                        color: AppColors.primaryText,
                                        fontFamily: "Helvetica",
                                        fontWeight: FontWeight.w400,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    margin: EdgeInsets.only(left: 12, right: 12, top: 1),
                                    child: CupertinoTextField(
                                      placeholder: '123456789',
                                    ),
                                  ),
                                ]
                            )
                        ),
                      ],
                    ),
                  ),
                  // Ende Dsb-Mitgliedsnummer
                  Positioned( //Geburtsdatum
                    left: 12,
                    top: 214,
                    width: MediaQuery.of(context).size.width*0.85,
                    child: Row(
                      children: [
                        Expanded(
                            child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    child: Text(
                                      birthday_selected.toString(),
                                      textAlign: TextAlign.left,
                                      style: TextStyle(
                                        color: AppColors.primaryText,
                                        fontFamily: "Helvetica",
                                        fontWeight: FontWeight.w400,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                ]
                            )
                        ),
/*                        IconButton(
                          icon: Icon(Icons.edit),
                          tooltip: 'Ändern',
                          onPressed: () {
                            showCupertinoModalPopup(
                              context: context,
                              builder: (BuildContext builder) => CupertinoDatePicker(
                                  mode: CupertinoDatePickerMode.date,
                                  initialDateTime: DateTime.parse("1969-07-20 20:18:04Z"),
                                  maximumDate: DateTime.now(),
                                  showCupertinoModalPopup,
                                  onDateTimeChanged: (DateTime newDateTime) {
                                    _date_changed(newDateTime);
                                  },
                                ),

                                );
                              },
                            )
 */
                       ],
                    ),
                  ),
                  // Ende Geburtsdatum
                ],
              ),
            ),
            //Inhalt der Seite
            Container(//Platzhalter für den Rest
              width: MediaQuery.of(context).size.width,
              height: (MediaQuery.of(context).size.height*0.5)-83-177,
              margin: EdgeInsets.only(left: 12, right:12, top: 10),
              child: Text(
                "Wenn Sie persönlich Schütze in der Bogenliga sind, kann diese App ihre Ergebnisse der zurückliegenden Wettkämpfe anzeigen. Dazu müssen Sie sich über die hier abgefragten Daten identifizieren. Damit werden auch ihr Verein und ihre Liga hinterlegt",
                textAlign: TextAlign.left,
                style: TextStyle(
                  color: AppColors.primaryText,
                  fontFamily: "Helvetica",
                  fontWeight: FontWeight.w400,
                  fontSize: 14,
                ),
              ),
            ),
            // Platzhalter damit Navigation ganzn unten liegt
            Container(
              width: MediaQuery.of(context).size.width,
              height: 76,
              margin: EdgeInsets.only(top: 26),
              color: Color.fromARGB(55, 55, 55, 55),
              child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    IconButton(
                        icon:Icon(Icons.home),
                        onPressed: () {
                          Navigator.pushNamed(context, '/');
                        }
                    ),
                    IconButton(
                        icon:Icon(Icons.settings),
                        onPressed: () {
                          Navigator.pushNamed(context, '/');
                        }
                    ),
                    IconButton(
                        icon:Icon(Icons.person),
                        onPressed: () {
                          Navigator.pushNamed(context, '/');
                        }
                    ),
                    IconButton(
                        icon:Icon(Icons.people),
                        onPressed: () {
                          Navigator.pushNamed(context, '/');
                        }
                    ),
                    IconButton(
                        icon:Icon(Icons.view_list),
                        onPressed: () {
                          Navigator.pushNamed(context, '/');
                        }
                    )
                  ]
              ),
            )
            // Navigationsleiste
          ],//Children
        ),
      ),
    );
  }
}
