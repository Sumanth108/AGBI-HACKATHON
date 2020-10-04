import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultAiComponent } from './consult-ai.component';

describe('ConsultAiComponent', () => {
  let component: ConsultAiComponent;
  let fixture: ComponentFixture<ConsultAiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultAiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
