import 'package:bsapp_mobile/start_screen/wettkampf_table_do.dart';
import 'package:flutter/material.dart';

//Eine Liste der Wettkämpfe mit Kacheln der einzelnen Termine

class WettkampfTableBoxList extends StatelessWidget {
  final List<WettkampfTable_DO> items;
  WettkampfTableBoxList({Key key, this.items});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: items.length,
      itemBuilder: (context, index) {
        return GestureDetector(
          child: WettkampfTableBox(item: items[index]),
          onTap: () {
            Navigator.push(
              context, MaterialPageRoute(
                builder: (context) => WettkampfPage(item: items[index]),
            ),
            );
          },
        );
      },
    );
  }
}


// Eine Kachel eines Wettkampfs
class WettkampfTableBox extends StatelessWidget {
  WettkampfTableBox({Key key, this.item}) : super(key: key);
  final WettkampfTable_DO item;

  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.all(2), height: 140,
        child: Card(
          child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                Image.asset("assets/images/logo.png"),
                Expanded(
                    child: Container(
                        padding: EdgeInsets.all(5),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: <Widget>[
                            Text(this.item.wettkampfTag +' ' + this.item.wettkampfUhrzeit, style:TextStyle(fontWeight: FontWeight.bold)),
                            Text(this.item.wettkampfOrt),
                          ],
                        )
                    )
                )
              ]
          ),
        )
    );
  }
}

// Bei  Anwählen einer Kachel die Detaildaten des Wettkampfs
class WettkampfPage extends StatelessWidget {
  WettkampfPage({Key key, this.item}) : super(key: key);
  final WettkampfTable_DO item;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(this.item.wettkampfLiga),),
      body: Center(
        child: Container(
          padding: EdgeInsets.all(0),
          child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Image.asset("assets/images/logo.png"),
                Expanded(
                    child: Container(
                        padding: EdgeInsets.all(5),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: <Widget>[
                            Text(this.item.wettkampfTag, style:
                            TextStyle(fontWeight: FontWeight.bold)),
                            Text(this.item.wettkampfUhrzeit+'Uhr'),
                            Text(this.item.wettkampfOrt),
                          ],
                        )
                    )
                )
              ]
          ),
        ),
      ),
    );
  }
}
