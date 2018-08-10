import { TestBed, inject } from '@angular/core/testing';

import { CalendarHelperService } from './calendar-helper.service';

describe('CalendarHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarHelperService]
    });
  });

  it('should be created', inject([CalendarHelperService], (service: CalendarHelperService) => {
    expect(service).toBeTruthy();
  }));
});
