import { TestBed } from '@angular/core/testing';

import { ChanelAdminService } from './chanel-admin.service';

describe('ChanelAdminService', () => {
  let service: ChanelAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChanelAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
