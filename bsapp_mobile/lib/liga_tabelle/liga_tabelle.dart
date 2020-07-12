/*
*  liga_tabelle.dart
*  Bogenliga-App
*
*  Created by [Author].
*  Copyright © 2018 [Company]. All rights reserved.
    */

import '../values/values.dart';
import 'package:flutter/material.dart';


class IPhone11Widget extends StatelessWidget {
  
  @override
  Widget build(BuildContext context) {
  
    return Scaffold(
      body: Container(
        constraints: BoxConstraints.expand(),
        decoration: BoxDecoration(
          color: Color.fromARGB(255, 255, 255, 255),
        ),
        child: Stack(
          alignment: Alignment.topCenter,
          children: [
            Positioned(
              top: 142,
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
              left: 15,
              top: 124,
              right: 16,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Align(
                    alignment: Alignment.topLeft,
                    child: Container(
                      width: 160,
                      height: 58,
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Align(
                            alignment: Alignment.topLeft,
                            child: Container(
                              margin: EdgeInsets.only(top: 22),
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
                              width: 58,
                              height: 58,
                              margin: EdgeInsets.only(left: 59),
                              child: Image.asset(
                                "assets/images/logo.png",
                                fit: BoxFit.none,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  Container(
                    height: 65,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Positioned(
                          left: 0,
                          top: 0,
                          right: 0,
                          child: Container(
                            height: 65,
                            decoration: BoxDecoration(
                              color: AppColors.primaryBackground,
                              border: Border.fromBorderSide(Borders.primaryBorder),
                              borderRadius: Radii.k8pxRadius,
                            ),
                            child: Container(),
                          ),
                        ),
                        Positioned(
                          left: 37,
                          top: 21,
                          child: Text(
                            "Württemberg Liga",
                            textAlign: TextAlign.left,
                            style: TextStyle(
                              color: AppColors.primaryText,
                              fontFamily: "Helvetica",
                              fontWeight: FontWeight.w400,
                              fontSize: 24,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    height: 472,
                    margin: EdgeInsets.only(top: 12),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Positioned(
                          left: 0,
                          top: 89,
                          right: 0,
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
                          right: 0,
                          child: Container(
                            height: 472,
                            decoration: BoxDecoration(
                              border: Border.fromBorderSide(Borders.primaryBorder),
                              borderRadius: Radii.k8pxRadius,
                            ),
                            child: Container(),
                          ),
                        ),
                        Positioned(
                          top: 48,
                          child: Text(
                            "Platz      Verein          			   Match-        Satzpunkte\n",
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
                          left: 15,
                          top: 81,
                          child: Text(
                            "1. 		   BSV ABC 				30:12		12:0",
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
          ],
        ),
      ),
    );
  }
}