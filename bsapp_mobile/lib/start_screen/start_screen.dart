import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import '../values/values.dart';
import 'wettkampf_table_do.dart';
import 'wettkampftableboxlist.dart';
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;



// Beim intialen Screen werden die nächsten Wettkämpfe angezeigt
// dazu wird hier die Liste per Rest-Api Call geladen
// TODO: der Call muss noch so angepasst werden, dass man für die Titel der Veranstaltungen nichts nachladen muss

List<WettkampfTable_DO> parseWettkampfTable(String responseBody){
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


class StartScreen extends StatelessWidget{

  final Future<List<WettkampfTable_DO>> wettkampftable = fetchWettkampfTable();
  // ToDO prüfen ob null init ok...


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
                        margin: EdgeInsets.only(left: 29, top: 26),
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
              height: 103,
              margin: EdgeInsets.only(left: 19, top: 8, right: 18),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Positioned(
                    left: 0,
                    top: 0,
                    right: 0,
                    child: Container(
                      height: 83,
                      decoration: BoxDecoration(
                        border: Border.fromBorderSide(Borders.primaryBorder),
                        borderRadius: Radii.k8pxRadius,
                      ),
                      child: Container(),
                    ),
                  ),
                  Positioned(
                    width: MediaQuery.of(context).size.width-18-19,
                    top: 11,
                    child: FlatButton(
                      child: Text('\nWillkommen in der Bogensport-Liga in Württemberg\n\nWeiter...\n',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: AppColors.primaryText,
                        fontFamily: "Helvetica",
                        fontWeight: FontWeight.w400,
                        fontSize: 14,
                      ),
                      ),
                      onPressed: () {
                        Navigator.pushNamed(context, '/');
                      },
                    ),
                  ),
                 ],
              ),
             ),
            Container(
              width: MediaQuery.of(context).size.width,
              height: (MediaQuery.of(context).size.height)-83-103-160,
              margin: EdgeInsets.only(left: 19, top: 8, right: 18),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Positioned(
                    left: 0,
                    top: 0,
                    right: 0,
                    child: Container(
                      height: (MediaQuery.of(context).size.height)-83-103-160-8,
                      decoration: BoxDecoration(
                        border: Border.fromBorderSide(Borders.primaryBorder),
                        borderRadius: Radii.k8pxRadius,
                      ),
                      child: Container(),
                    ),
                  ),
                  Center(
                    child: FutureBuilder<List<WettkampfTable_DO>>(
                      future: wettkampftable, builder: (context, snapshot) {
                      if (snapshot.hasError) print(snapshot.error);
                      return snapshot.hasData ? WettkampfTableBoxList(items: snapshot.data) :

                      // return the ListView widget
                      Center(child: CircularProgressIndicator());

                    },//future
                    ),
                  ),
                ],
              ),
            ),
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
          ],
        ),
      ),
    );
  }
}
