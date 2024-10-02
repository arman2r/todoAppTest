import { TestBed } from '@angular/core/testing';

import { TaskPersonService } from './task-person.service';

describe('TaskPersonService', () => {
  let service: TaskPersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskPersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
