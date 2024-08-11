import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedClientListComponent } from './added-client-list.component';

describe('AddedClientListComponent', () => {
  let component: AddedClientListComponent;
  let fixture: ComponentFixture<AddedClientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddedClientListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddedClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
