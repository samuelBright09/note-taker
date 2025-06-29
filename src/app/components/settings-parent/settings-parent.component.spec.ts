import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsParentComponent } from './settings-parent.component';

describe('SettingsParentComponent', () => {
  let component: SettingsParentComponent;
  let fixture: ComponentFixture<SettingsParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
