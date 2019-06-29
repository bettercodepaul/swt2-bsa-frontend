

export class ChartNode {

  private color: string;
  private name: string;
  private children: ChartNode[];


  constructor(name: string, color: string, untergeordneteNodes?: ChartNode[]) {
    this.name = name;
    this.color = color;
    if (untergeordneteNodes == null) {
      this.children = [];
    } else {
      this.children = untergeordneteNodes;
    }
  }

  add(node: ChartNode): void {
    this.children.push(node);
  }

  toJsonString() {
    let str =
      '{' + '"name":"' + this.name + '",' +
      '"color":"' + this.color + '"';

    if (this.children.length > 0) {
      str += ',';
      str += '"children":[';


      for (let i = 0; i < this.children.length; i++) {
        str += this.children[i].toJsonString();
        if (this.children.length > 0 && i < this.children.length - 1) {
          str += ',';
        }
      }
      str += ']';
    } else {
      str += ',"size":1';
    }
    str += '}';

    return str;
  }


}
