

export class ChartNode{

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
      '{' + 'name:\'' + this.name + '\',' +
      'color:\'' + this.color + '\',';

    if (this.children.length > 0) {
      str += 'children:[';


      this.children.forEach((c) => str += c.toJsonString());

      str += ']';
    }
    str += '}';
    return str;
  }



}
