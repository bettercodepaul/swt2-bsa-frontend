/*
*  nav_screen.dart
*  Bogenliga-App
*
*  Created by [Author].
*  Copyright © 2018 [Company]. All rights reserved.
    */

import '../values/values.dart';
import 'package:flutter/material.dart';


class IPhone11FourWidget extends StatelessWidget {
  
  @override
  Widget build(BuildContext context) {
  
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
                width: 199,
                height: 58,
                margin: EdgeInsets.only(left: 20, top: 108),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Align(
                      alignment: Alignment.topLeft,
                      child: Container(
                        width: 58,
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
                        margin: EdgeInsets.only(left: 49, top: 26),
                        child: Text(
                          "Bogenliga-App",
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
            ),
            Container(
              height: 63,
              margin: EdgeInsets.only(left: 19, top: 8, right: 18),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Positioned(
                    left: 0,
                    top: 0,
                    right: 0,
                    child: Container(
                      height: 63,
                      decoration: BoxDecoration(
                        border: Border.fromBorderSide(Borders.primaryBorder),
                        borderRadius: Radii.k8pxRadius,
                      ),
                      child: Container(),
                    ),
                  ),
                  Positioned(
                    left: 12,
                    top: 21,
                    child: Text(
                      "Meine Ergebnisse",
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
              height: 409,
              margin: EdgeInsets.only(left: 19, top: 17, right: 17),
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
                        "assets/images/logo-4.png",
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Positioned(
                    left: 0,
                    top: 0,
                    right: 1,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Container(
                          height: 64,
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
                    top: 24,
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
                  Positioned(
                    left: 12,
                    top: 103,
                    child: Text(
                      "Ligatabelle",
                      textAlign: TextAlign.left,
                      style: TextStyle(
                        color: AppColors.primaryText,
                        fontFamily: "Helvetica",
                        fontWeight: FontWeight.w400,
                        fontSize: 14,
                      ),
                    ),
                  ),
                  Positioned(
                    left: 12,
                    top: 103,
                    child: Text(
                      "Die nächsten Wettkämpfe:\n\nBundesliga \n15.7.2021 - Beginn 9:00Uhr\n Welzheim\n Schützennhaus \nHeideweg 5\n73642 Welzheim\n\nOberliga Nord \n16.7.2021 - Beginn 14:00Uhr\n Welzheim\n Schützennhaus \nHeideweg 5\n73642 Welzheim",
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
          ],
        ),
      ),
    );
  }
}