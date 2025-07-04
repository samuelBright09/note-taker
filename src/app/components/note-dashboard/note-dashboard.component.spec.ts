import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteDashboardComponent } from './note-dashboard.component';

describe('NoteDashboardComponent', () => {
  let component: NoteDashboardComponent;
  let fixture: ComponentFixture<NoteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
