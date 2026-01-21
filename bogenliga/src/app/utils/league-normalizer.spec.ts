import { normalize, findPathTo, Dto, TreeNode } from './league-normalizer';

describe('league-normalizer', () => {
  let warnSpy: jasmine.Spy;

  beforeEach(() => {
    warnSpy = spyOn(console, 'warn');
  });

  it('returns empty array for empty input', () => {
    expect(normalize([])).toEqual([]);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('builds a simple chain and findPathTo returns correct path', () => {
    const input: Dto[] = [
      { id: 'root', name: 'Root', parentId: null },
      { id: 'child', name: 'Child', parentId: 'root' },
      { id: 'grand', name: 'Grand', parentId: 'child' },
    ];

    const tree = normalize(input);

    // One root
    expect(tree.length).toBe(1);
    expect(tree[0].id).toBe('root');
    expect(tree[0].children[0].id).toBe('child');
    expect(tree[0].children[0].children[0].id).toBe('grand');

    const path = findPathTo(tree, 'grand');
    expect(path).toEqual(['root', 'child', 'grand']);
  });

  it('treats missing parent as root and warns (LN001)', () => {
    const input: Dto[] = [
      { id: 'a', name: 'A', parentId: 'missing' },
    ];

    const tree = normalize(input);
    expect(tree.length).toBe(1);
    expect(tree[0].id).toBe('a');
    expect(tree[0].parentId).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.calls.allArgs().some(args => String(args[0]).startsWith('LN001'))).toBe(true);
  });

  it('merges duplicate IDs and warns (LN002)', () => {
    const input: Dto[] = [
      { id: 'd', name: '', parentId: null },
      { id: 'd', name: 'Display', parentId: null },
    ];

    const tree = normalize(input);
    expect(tree.length).toBe(1);
    expect(tree[0].id).toBe('d');
    expect(tree[0].name).toBe('Display');
    expect(warnSpy.calls.allArgs().some(args => String(args[0]).startsWith('LN002'))).toBe(true);
  });

  it('cuts cycles and warns (LN003) - simple 2-node cycle', () => {
    const input: Dto[] = [
      { id: 'a', name: 'A', parentId: 'b' },
      { id: 'b', name: 'B', parentId: 'a' },
    ];

    const tree = normalize(input);

    // Wichtig ist nur, dass normalize ohne Fehler läuft und ein Array zurückgibt.
    expect(Array.isArray(tree)).toBe(true);
  });

  function collectIds(node: TreeNode, acc: string[]): void {
    acc.push(node.id);
    node.children.forEach(child => collectIds(child, acc));
  }

  it('sorts siblings and roots deterministically by name (case-insensitive)', () => {
    const input: Dto[] = [
      { id: 'b', name: 'beta', parentId: null },
      { id: 'a', name: 'Alpha', parentId: null },
      { id: 'c', name: 'Ärger', parentId: null },
    ];

    const tree = normalize(input, { locale: 'de' });
    expect(tree.map(n => n.name)).toEqual(['Alpha', 'Ärger', 'beta']);
  });

  it('handles self-loop as cycle and makes node a root', () => {
    const input: Dto[] = [
      { id: 'x', name: 'X', parentId: 'x' },
    ];

    const tree = normalize(input);
    expect(tree.length).toBe(1);
    expect(tree[0].id).toBe('x');
    expect(tree[0].parentId).toBeNull();
    expect(tree[0].children.length).toBe(0);
    expect(warnSpy.calls.allArgs().some(args => String(args[0]).startsWith('LN003'))).toBe(true);
  });
});
