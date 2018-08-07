import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransferDataService {

  constructor() { }
  private data

  setData(data): void {
  	this.data = data;
  }

  getData(): any {
  	return this.data;
  }
}
