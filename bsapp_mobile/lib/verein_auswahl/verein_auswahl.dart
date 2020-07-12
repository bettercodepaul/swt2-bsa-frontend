/*
*  verein_auswahl.dart
*  baspp-mobile
* Dialog zur Auswahl des eigenen Vereins - ggf. ersetzen durch einen Serveraufruf
* ist eigentlich nur Backup, wenn bei den Daten des DSB-Mitglieds der Vereins
* nicht gepflegt ist
* ggf. könnte man die DSB-Mitgleidsdaten auch aktualisieren... aber aktuell eher nicht
*
*  Created by [Author].
*  Copyright © 2018 [Company]. All rights reserved.
    */

import '../values/values.dart';
import 'package:flutter/material.dart';


class IPhone11ThreeWidget extends StatelessWidget {
  
  @override
  Widget build(BuildContext context) {
  
    return Scaffold(
      body: Container(
        constraints: BoxConstraints.expand(),
        decoration: BoxDecoration(
          color: Color.fromARGB(255, 255, 255, 255),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 350,
              height: 502,
              margin: EdgeInsets.only(left: 33, top: 305),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Align(
                    alignment: Alignment.topLeft,
                    child: Container(
                      width: 350,
                      height: 59,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          Positioned(
                            top: 0,
                            child: Container(
                              width: 350,
                              height: 59,
                              decoration: BoxDecoration(
                                color: AppColors.primaryElement,
                                border: Border.fromBorderSide(Borders.primaryBorder),
                                borderRadius: Radii.k8pxRadius,
                              ),
                              child: Container(),
                            ),
                          ),
                          Positioned(
                            left: 33,
                            top: 28,
                            child: Text(
                              "Verein auswählen",
                              textAlign: TextAlign.left,
                              style: TextStyle(
                                color: AppColors.secondaryText,
                                fontFamily: "Helvetica",
                                fontWeight: FontWeight.w400,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  Align(
                    alignment: Alignment.topLeft,
                    child: Container(
                      width: 350,
                      height: 432,
                      margin: EdgeInsets.only(top: 11),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          Positioned(
                            top: 82,
                            child: Opacity(
                              opacity: 0.36019,
                              child: Image.asset(
                                "assets/images/logo-3.png",
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                          Positioned(
                            top: 0,
                            child: Container(
                              width: 350,
                              height: 432,
                              decoration: BoxDecoration(
                                border: Border.fromBorderSide(Borders.primaryBorder),
                                borderRadius: Radii.k8pxRadius,
                              ),
                              child: Container(),
                            ),
                          ),
                          Positioned(
                            left: 33,
                            top: 46,
                            child: Text(
                              "Bogensport Reutlingen\nBSV Stuttgart\nBSC Schömberg\nBs\nBS\nBS\n\n\n\n\n\n\n\n\n\n\n\n\n",
                              textAlign: TextAlign.left,
                              style: TextStyle(
                                color: AppColors.primaryText,
                                fontFamily: "Helvetica",
                                fontWeight: FontWeight.w400,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Container(
              margin: EdgeInsets.only(top: 268),
              child: Text(
                "Abbrechen",
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
              width: 53,
              height: 53,
              margin: EdgeInsets.only(left: 25, top: 252),
              child: Image.asset(
                "assets/images/logo.png",
                fit: BoxFit.none,
              ),
            ),
            Spacer(),
            Container(
              margin: EdgeInsets.only(top: 268, right: 49),
              child: Text(
                "Mein Verein",
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
              margin: EdgeInsets.only(top: 268, right: 39),
              child: Text(
                "Speichern",
                textAlign: TextAlign.left,
                style: TextStyle(
                  color: AppColors.primaryText,
                  fontFamily: "Helvetica",
                  fontWeight: FontWeight.w400,
                  fontSize: 14,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}