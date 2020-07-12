class DSBmitglied_DO{
  final String vorname;
  final String name;
  final DateTime gebutstag;
  final String mitgliedsnummer;
  final int dsmmitglied_id;

  DSBmitglied_DO(this.vorname, this.name, this.gebutstag, this.mitgliedsnummer, this.dsmmitglied_id);
  factory DSBmitglied_DO.fromMap(Map<String, dynamic> json){
    return DSBmitglied_DO(
        json['vorname'],
        json['name'],
        json['geburtstag'],
        json['mitgliedsnummer'],
        json['dsbmitglied_id']
    );
  }

  factory DSBmitglied_DO.fromJson(Map<String, dynamic> data) {
    return DSBmitglied_DO(
      data['vorname'],
      data['name'],
      data['geburtstag'],
      data['mitgliedsnummer'],
      data['dsbmitglied_id'],
    );
  }
}