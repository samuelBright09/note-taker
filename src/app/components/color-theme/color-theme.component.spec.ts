import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorThemeComponent } from './color-theme.component';

describe('ColorThemeComponent', () => {
  let component: ColorThemeComponent;
  let fixture: ComponentFixture<ColorThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorThemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
