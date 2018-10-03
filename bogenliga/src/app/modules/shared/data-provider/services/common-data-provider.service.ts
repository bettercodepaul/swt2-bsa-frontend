import {Observable} from 'rxjs';
import {TransferObject} from '../models/transfer-object.interface';
import {DataProviderService} from './data-provider.service';

export abstract class CommonDataProviderService extends DataProviderService {

  abstract findAll(): Observable<TransferObject[]>;

  abstract findById(key: string | number): Observable<TransferObject>;

  abstract deleteById(key: string | number): Observable<any>;

  abstract update(payload: TransferObject): Observable<TransferObject>;

  abstract addOne(payload: TransferObject): Observable<TransferObject>;

}


