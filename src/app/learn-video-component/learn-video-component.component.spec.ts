import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnVideoComponentComponent } from './learn-video-component.component';

describe('LearnVideoComponentComponent', () => {
  let component: LearnVideoComponentComponent;
  let fixture: ComponentFixture<LearnVideoComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnVideoComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnVideoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
