import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedRankingsComponent } from './completed-rankings.component';

describe('CompletedRankingsComponent', () => {
  let component: CompletedRankingsComponent;
  let fixture: ComponentFixture<CompletedRankingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedRankingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedRankingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
