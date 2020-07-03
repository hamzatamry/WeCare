import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DocteurCoachListPage } from './docteur-coach-list.page';

describe('DocteurCoachListPage', () => {
  let component: DocteurCoachListPage;
  let fixture: ComponentFixture<DocteurCoachListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocteurCoachListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DocteurCoachListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
