import {RequestResult} from '..';

export interface BogenligaResponse<T> {
  payload?: T;
  result: RequestResult;
}
