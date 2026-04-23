import {Directive, ElementRef, Input} from '@angular/core';

/**
 * Index generator for tabindex number generation,
 * required for tab order in schusszettel form.
 */
class IndexGenerator {
  indices: Array<number>;
  currIdx: number;

  public getNext() {
    if (this.currIdx < this.indices.length) {
      const item = this.indices[this.currIdx];
      this.currIdx += 1;
      return item;
    } else {
      this.currIdx = 0;
      return this.getNext();
    }
  }
}

/**
 * Incremented each time when used on a ringzahl field in the schusszettel-Formular
 */
class RingzahlIndexGenerator extends IndexGenerator {
  constructor() {
    super();
    const rows = [
      [4, 29], // top left first table, top right first table
      [6, 31], // mid left first table, mid right first table
      [8, 33], // bottom left first table, bottom right first table
      [37, 62], // top left second table, top right second table
      [39, 64], // mid left second table, mid right second table
      [41, 66], // bottom left second table, bottom right second table
    ];

    // Tabindex-Start für Team 1
    const TEAM1_OFFSET = 20;
    // Tabindex-Start für Team 2
    const TEAM2_OFFSET = 120;

    this.indices = [];
    for (const row of rows) {
      for (let i = row[0]; i <= row[1]; i += 6) {
        const offset = i < 37 ? TEAM1_OFFSET : TEAM2_OFFSET;

        // Pfeil 1 bekommt den nächsten Tabindex
        this.indices.push(i + offset);
        // Pfeil 2 bekommt den nächsten Tabindex
        this.indices.push(i + 1 + offset);
      }
    }
    this.currIdx = 0;
  }
}

const ringzahlIdxGen = new RingzahlIndexGenerator();

export class TabIndexDirective {
  protected el: ElementRef;

  constructor(el: ElementRef) {
    this.el = el;
  }
}

/**
 * Element-directive for ringzahl inputs.
 * Sets the next available rinzahl tabindex value as HTML-Attribute.
 */
@Directive({
  selector: '[blaRingzahlTabIndexDirective]'
})
export class RingzahlTabIndexDirective extends TabIndexDirective {
  constructor(el: ElementRef) {
    super(el);
    this.el.nativeElement.setAttribute('tabindex', ringzahlIdxGen.getNext());
  }
}

// Directive, die einem Schützen im Formular einen Tabindex gibt
@Directive({
  selector: '[blaSchuetzeTabIndex]'
})
export class SchuetzeTabIndexDirective {
  // Startindex für Team 1
  private static team1Idx = 1;
  // Startindex für Team 2
  private static team2Idx = 101;

  @Input('blaSchuetzeTabIndex') team!: number;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    const idx =
      this.team === 1
        ? SchuetzeTabIndexDirective.team1Idx++
        : SchuetzeTabIndexDirective.team2Idx++;

    // Tabindex als HTML-Attribut setzen
    this.el.nativeElement.setAttribute('tabindex', idx);
  }
}
