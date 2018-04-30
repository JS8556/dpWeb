import { TestBed, inject } from '@angular/core/testing';

import { WebDataService } from './web-data.service';

describe('WebDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebDataService]
    });
  });

  it('should be created', inject([WebDataService], (service: WebDataService) => {
    expect(service).toBeTruthy();
  }));
});
