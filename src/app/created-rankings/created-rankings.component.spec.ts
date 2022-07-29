import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedRankingsComponent } from './created-rankings.component';

describe('CreatedRankingsComponent', () => {
  let component: CreatedRankingsComponent;
  let fixture: ComponentFixture<CreatedRankingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatedRankingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedRankingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
