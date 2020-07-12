
import 'package:flutter/material.dart';
import 'package:bsapp_mobile/start_screen/start_screen.dart';
import 'package:bsapp_mobile/identification/identification.dart';
import 'package:bsapp_mobile/identification/schuetze_identifikation.dart';

// Diese App ist ein Interface zum Lesen auf logenliga.de /liga.bsapp.de
// in den drei Masken werden persönliche Ergebnisse des Schützen, der Mannschaft und des Vereins dargestellt
// einen allgemeine Maske zeigt die Liagtabelle an
// persönnliche Daten werden einmalig erfasst und gegen das Backend validiert
// lokal gepseichert werden vier IDs in den App-Preferences:
// die IS des DSB-Mitgligeds, die ID des Vereins und die ID der Mannschaft und deren Liga-ID

// Diese Daten werden für das intiale Laden der Masken verwendet

// die Startmaske zeigt die nächsten Events, Ort und Zeit


void main() => runApp(MyApp());


class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  MyApp({Key key}): super(key:key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bogensport APP',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.blue,
        // This makes the visual density adapt to the platform that you run
        // the app on. For desktop platforms, the controls will be smaller and
        // closer together (more dense) than on mobile platforms.
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      initialRoute: '/',
      routes:{
//        '/': (context)=> StartScreen(),
//        '/': (context)=> IdentScreen(),
        '/': (context)=> Request_Ident(),
        //der nächste Screen mit:
        //When navigating to the "/second" route, build the SecondScreen widget.
        //    '/second': (context) => SecondScreen(),
      },
    );
  }
}


