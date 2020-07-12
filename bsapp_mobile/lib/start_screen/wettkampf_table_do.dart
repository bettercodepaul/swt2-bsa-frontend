class WettkampfTable_DO{
  final String wettkampfTag;
  final String wettkampfUhrzeit;
  final String wettkampfLiga;
  final String wettkampfOrt;

  WettkampfTable_DO(this.wettkampfTag, this.wettkampfUhrzeit, this.wettkampfLiga, this.wettkampfOrt);
  factory WettkampfTable_DO.fromMap(Map<String, dynamic> json){
    return WettkampfTable_DO(
      json['wettkampfTag'],
      json['wettkampfUhrzeit'],
      json['wettkampfLiga'],
      json['wettkampfOrt']
    );
  }

  factory WettkampfTable_DO.fromJson(Map<String, dynamic> data) {
    return WettkampfTable_DO(
      data['wettkampfTag'],
      data['wettkampfUhrzeit'],
      data['wettkampfLiga'],
      data['wettkampfOrt'],
    );
  }
}