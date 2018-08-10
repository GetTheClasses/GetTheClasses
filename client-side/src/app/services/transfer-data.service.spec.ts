import { TestBed, inject } from '@angular/core/testing';

import { TransferDataService } from './transfer-data.service';

describe('TransferDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransferDataService]
    });
  });

  it('should be created', inject([TransferDataService], (service: TransferDataService) => {
    expect(service).toBeTruthy();
  }));
});
