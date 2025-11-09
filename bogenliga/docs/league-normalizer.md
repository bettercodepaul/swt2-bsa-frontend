# League Normalizer

Transformiert das rohe API-DTO-Format in eine UI-freundliche, deterministisch sortierte Baumstruktur und bietet Deeplink-Unterstützung über Pfadsuche.

## Ziele
- Konsistentes Datenmodell für Tree-Komponenten
- Robuste Behandlung inkonsistenter API-Daten (fehlende Eltern, Duplikate, Zyklen)
- Stabile IDs und deterministische Darstellung

## Datenmodell
- Eingabe Dto
  - id: string
  - name: string
  - parentId?: string | null
- Ausgabe TreeNode
  - id: string
  - name: string
  - parentId?: string | null
  - children: TreeNode[]

## API
- normalize(dto: Dto[], opts?: { locale?: string | string[] }): TreeNode[]
  - Erzeugt eine Liste von Wurzeln (TreeNode[]), alphabetisch nach name sortiert (localeCompare, default 'de').
- findPathTo(tree: TreeNode[], nodeId: string): string[] | null
  - Liefert den Pfad (Liste Node-IDs) von einer Root bis nodeId; null, wenn nicht auffindbar.

## Verhalten & Regeln
- Stabile IDs: TreeNode.id = dto.id
- Eltern-Kind-Auflösung
  - parentId vorhanden und Parent existiert → Kind anhängen
  - parentId fehlt/nicht gefunden → Node wird Root (Warnung LN001)
- Duplikate (gleiche id)
  - Mergen: erster nicht-leerer Name gewinnt; parentId bleibt falls gesetzt, sonst übernehmen
  - Warnung LN002
- Zyklen
  - Erkennung via DFS; Back-Edges werden ignoriert/geschnitten
  - Self-Loop (parentId === id) wird als Root behandelt
  - Warnung LN003
- Sortierung
  - Alphabetisch nach name, case-insensitive, leere Namen ans Ende
  - Für Roots und alle Children rekursiv

## Beispiel
```ts
import { normalize, findPathTo } from '../app/utils/league-normalizer';

const dto = [
  { id: 'l1', name: 'League', parentId: null },
  { id: 'd1', name: 'Division A', parentId: 'l1' },
  { id: 't1', name: 'Team X', parentId: 'd1' },
  { id: 'orphan', name: 'Orphan', parentId: 'missing' }, // -> Root + LN001
];

const tree = normalize(dto);
const path = findPathTo(tree, 't1');
// ['l1', 'd1', 't1']
```

## Logging-Codes
- LN001 Missing parent: Node {id} wird als Root behandelt (parentId={parentId} nicht gefunden)
- LN002 Duplicate id: Node {id} gemerged
- LN003 Cycle detected: Kante {from}->{to} ignoriert

## Tests (Jasmine/Karma)
- Leere Eingabe → []
- Einfache Kette → korrekter Pfad
- Orphans → Root + LN001
- Duplikat-IDs → Merge + LN002
- Zyklus → acyclischer Baum + LN003
- Sortierung → deterministisch (Locale 'de')
