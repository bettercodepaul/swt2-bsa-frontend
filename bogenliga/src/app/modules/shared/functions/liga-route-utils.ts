/**
 * Extrahiert aus einem kombinierten Param (z.B. "123-bundesliga-nord") die numerische ID.
 */
export function extractLigaId(combined: string | null | undefined): number | null {
  if (!combined) return null;
  const first = combined.split('-')[0];
  const idNum = Number(first);
  return (!isNaN(idNum) && first === String(idNum)) ? idNum : null;
}

/**
 * Extrahiert den Slug (alles nach dem ersten Bindestrich) oder null.
 */
export function extractLigaSlug(combined: string | null | undefined): string | null {
  if (!combined) return null;
  const idx = combined.indexOf('-');
  if (idx === -1) return null;
  const slug = combined.substring(idx + 1);
  return slug.length > 0 ? slug : null;
}
