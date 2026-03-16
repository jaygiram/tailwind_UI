import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroLanyardComponent } from './hero-lanyard.component';

describe('HeroLanyardComponent', () => {
  let component: HeroLanyardComponent;
  let fixture: ComponentFixture<HeroLanyardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroLanyardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeroLanyardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
