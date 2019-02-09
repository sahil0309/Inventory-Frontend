import { TestBed, inject } from '@angular/core/testing';

import { ExcelexportService } from './excelexport.service';

describe('ExcelexportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExcelexportService]
    });
  });

  it('should be created', inject([ExcelexportService], (service: ExcelexportService) => {
    expect(service).toBeTruthy();
  }));
});
