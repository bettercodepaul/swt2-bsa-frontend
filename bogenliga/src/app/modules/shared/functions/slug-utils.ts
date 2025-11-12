import {LigaDO} from "@verwaltung/types/liga-do.class";

/**
 * Erzeugt einen URL-tauglichen Slug aus einem Liga-Namen.
 */
export function slugifyLigaName(name: string): string {
  if (!name) return 'liga';
  const umlautMap: Record<string, string> = {
    'ä': 'ae', 'Ä': 'ae',
    'ö': 'oe', 'Ö': 'oe',
    'ü': 'ue', 'Ü': 'ue',
    'ß': 'ss'
  };
  let slug = name.replace(/[ÄÖÜäöüß]/g, ch => umlautMap[ch] || ch);
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  slug = slug.toLowerCase();
  slug = slug.replace(/[^a-z0-9]+/g, '-');
  slug = slug.replace(/-+/g, '-');
  slug = slug.replace(/^-|-$/g, '');
  return slug || 'liga';
}

/**
 * Prüft, ob ein Slug syntaktisch gültig ist.
 * Erlaubt: a-z0-9 und Bindestriche, keine führenden oder abschließenden Bindestriche,
 * keine aufeinanderfolgenden Bindestriche.
 */
export function isValidLigaSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Validiert einen gegebenen Slug gegen die erwartete Berechnung aus dem Liga-Namen.
 */
export function matchesLigaSlug(ligaName: string, slug: string): boolean {
  return slugifyLigaName(ligaName) === slug;
}

/**
 * Baut die kanonische Liga-Home-URL via dem Liga Objekt.
 */
export function buildLigaHomeLinkCanonical(liga: Pick<LigaDO, 'id' | 'name'>): string {
  const slug = slugifyLigaName(liga.name ?? '');
  return `/home/liga=${slug || liga.id}`;
}

/**
 * Legacy-Variante, falls weiterhin benötigt.
 */
export function buildLigaHomeLinkLegacy(liga: Pick<LigaDO, 'id' | 'name'>): string {
  const slug = slugifyLigaName(liga.name ?? '');
  return `/home/${liga.id}-${slug}`;
}

// Ergänzung (falls noch nicht vorhanden):
export function buildLigaQueryLink(liga: Pick<LigaDO,'id'|'name'>): string {
  const slug = slugifyLigaName(liga.name ?? '');
  return `/liga?liga=${slug || liga.id}`;
}
