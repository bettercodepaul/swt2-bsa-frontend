/*
*  verein_ergebnisse.dart
*  Bogenliga-App
*
*  Created by [Author].
*  Copyright © 2018 [Company]. All rights reserved.
    */

import '../values/values.dart';
import 'package:flutter/material.dart';


class IPhone11TwoWidget extends StatelessWidget {
  
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
              width: 165,
              height: 46,
              margin: EdgeInsets.only(left: 50, top: 235),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Align(
                    alignment: Alignment.topLeft,
                    child: Container(
                      margin: EdgeInsets.only(top: 14),
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
                      width: 46,
                      height: 46,
                      margin: EdgeInsets.only(left: 29),
                      child: Image.asset(
                        "assets/images/logo.png",
                        fit: BoxFit.none,
                      ),
                    ),
                  ),
                  Align(
                    alignment: Alignment.topLeft,
                    child: Container(
                      margin: EdgeInsets.only(left: 3, top: 14),
                      child: Text(
                        "Verein ",
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
              width: 305,
              height: 52,
              margin: EdgeInsets.only(left: 41),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Positioned(
                    left: 0,
                    top: 0,
                    child: Container(
                      width: 305,
                      height: 52,
                      decoration: BoxDecoration(
                        color: AppColors.primaryElement,
                        border: Border.fromBorderSide(Borders.primaryBorder),
                        borderRadius: Radii.k8pxRadius,
                      ),
                      child: Container(),
                    ),
                  ),
                  Positioned(
                    left: 29,
                    top: 26,
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
              width: 305,
              height: 376,
              margin: EdgeInsets.only(left: 41, top: 9),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Positioned(
                    left: 0,
                    top: 71,
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
                      width: 305,
                      height: 376,
                      decoration: BoxDecoration(
                        border: Border.fromBorderSide(Borders.primaryBorder),
                        borderRadius: Radii.k8pxRadius,
                      ),
                      child: Container(),
                    ),
                  ),
                  Positioned(
                    left: 11,
                    top: 16,
                    child: Text(
                      "Match/Satz Mannschaft	 Ergebnis	    Gegner                 Satz\n",
                      textAlign: TextAlign.left,
                      style: TextStyle(
                        color: AppColors.primaryText,
                        fontFamily: "Helvetica",
                        fontWeight: FontWeight.w400,
                        fontSize: 10,
                      ),
                    ),
                  ),
                  Positioned(
                    left: 11,
                    top: 35,
                    child: Text(
                      "1/1	    BS Schönberg -  1. 52:50     BS Stuttgart-3            2:0",
                      textAlign: TextAlign.left,
                      style: TextStyle(
                        color: AppColors.primaryText,
                        fontFamily: "Helvetica",
                        fontWeight: FontWeight.w400,
                        fontSize: 10,
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