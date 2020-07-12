/*
*  schuetze_ergebnisse.dart
*  Bogenliga-App
*
*  Created by [Author].
*  Copyright © 2018 [Company]. All rights reserved.
    */

import '../values/values.dart';
import 'package:flutter/material.dart';


class IPhone11SevenWidget extends StatelessWidget {
  
  @override
  Widget build(BuildContext context) {
  
    return Scaffold(
      body: Container(
        constraints: BoxConstraints.expand(),
        decoration: BoxDecoration(
          color: Color.fromARGB(255, 255, 255, 255),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 181,
              height: 44,
              margin: EdgeInsets.only(left: 43, top: 232),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Align(
                    alignment: Alignment.topLeft,
                    child: Container(
                      margin: EdgeInsets.only(top: 16),
                      child: Text(
                        "Zurück",
                        textAlign: TextAlign.left,
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
                      width: 45,
                      height: 44,
                      margin: EdgeInsets.only(left: 34),
                      child: Image.asset(
                        "assets/images/logo.png",
                        fit: BoxFit.none,
                      ),
                    ),
                  ),
                  Align(
                    alignment: Alignment.topLeft,
                    child: Container(
                      margin: EdgeInsets.only(left: 6, top: 13),
                      child: Text(
                        "Statistik ",
                        textAlign: TextAlign.left,
                        style: TextStyle(
                          color: AppColors.primaryText,
                          fontFamily: "Helvetica",
                          fontWeight: FontWeight.w400,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Container(
              width: 291,
              height: 49,
              margin: EdgeInsets.only(left: 43),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Positioned(
                    left: 0,
                    top: 0,
                    child: Container(
                      width: 291,
                      height: 49,
                      decoration: BoxDecoration(
                        color: AppColors.primaryElement,
                        border: Border.fromBorderSide(Borders.primaryBorder),
                        borderRadius: Radii.k8pxRadius,
                      ),
                      child: Container(),
                    ),
                  ),
                  Positioned(
                    left: 28,
                    top: 16,
                    child: Text(
                      "3.Wettkampftag Oberliga Süd",
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
            Container(
              width: 291,
              height: 360,
              margin: EdgeInsets.only(left: 43, top: 9),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Positioned(
                    left: 0,
                    top: 69,
                    child: Opacity(
                      opacity: 0.36019,
                      child: Image.asset(
                        "assets/images/logo-4.png",
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Positioned(
                    left: 0,
                    top: 0,
                    child: Container(
                      width: 291,
                      height: 360,
                      decoration: BoxDecoration(
                        border: Border.fromBorderSide(Borders.primaryBorder),
                        borderRadius: Radii.k8pxRadius,
                      ),
                      child: Container(),
                    ),
                  ),
                  Positioned(
                    left: 11,
                    top: 15,
                    child: Text(
                      "Anzahl Pfeile: 						30\n\nDurchschnittliche Punkte:			7,53\n\nAnzahl 10:							5\n\nAnzahl 9:								8\n\nAnzahl 8:								12\n\nAnzahl 7:								15\n\nAnzahl 6:								4\n\nAnzahl M:								1\n\nRangliste Schütze / Wettkampftag:  12 / 32\n\nRangliste Schütze / Liga				10 / 45\n\nRangliste Schütze / alle Ligen		45 / 502",
                      textAlign: TextAlign.left,
                      style: TextStyle(
                        color: AppColors.primaryText,
                        fontFamily: "Helvetica",
                        fontWeight: FontWeight.w400,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}