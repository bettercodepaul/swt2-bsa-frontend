import {Injectable} from '@angular/core';
import {DataProviderService} from '@shared/data-provider/services/data-provider.service';



@Injectable({
  providedIn: 'root'
})
export class SelectedLigaDataprovider extends DataProviderService{
  private selectedLigaID: number;




  public setSelectedLigaID(ligaID: number) {
    this.selectedLigaID = ligaID;
  }


  public getSelectedLigaID(): number {
    return this.selectedLigaID
  }

  serviceSubUrl: string;
}
