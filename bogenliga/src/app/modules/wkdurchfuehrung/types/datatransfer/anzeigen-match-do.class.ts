import { DataObject } from '../../../shared/data-provider';

export class AnzeigenMatchDO implements DataObject {
  matchNr: number;
  verein1: string;
  verein2: string;
  schuesseVerein1: number[];
  schuesseVerein2: number[];
  totalVerein1: number;
  totalVerein2: number;
  satzpunkteVerein1: number;
  satzpunkteVerein2: number;
}
