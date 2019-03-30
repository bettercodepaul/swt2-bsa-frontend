import {RequestResult} from '..';

export interface Response<T> {
  payload?: T;
  result: RequestResult;
}
