import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedComponentComponent } from './embed-component.component';

describe('EmbedComponentComponent', () => {
  let component: EmbedComponentComponent;
  let fixture: ComponentFixture<EmbedComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbedComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
