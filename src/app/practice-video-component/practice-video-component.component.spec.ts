import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeVideoComponentComponent } from './practice-video-component.component';

describe('PracticeVideoComponentComponent', () => {
  let component: PracticeVideoComponentComponent;
  let fixture: ComponentFixture<PracticeVideoComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeVideoComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeVideoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
