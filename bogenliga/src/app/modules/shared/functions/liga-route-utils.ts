import { LigaDO } from '@verwaltung/types/liga-do.class';
import { slugifyLigaName } from '@shared/functions/slug-utils';

export function ligaSlug(liga: LigaDO): string {
  return slugifyLigaName(liga.name ?? '') || String(liga.id);
}

export function buildLigaHomeLink(liga: LigaDO): string {
  return `/home/liga=${ligaSlug(liga)}`;
}

export function buildLigaTabelleLink(liga: LigaDO): string {
  return `/tabelle/liga=${ligaSlug(liga)}`;
}
