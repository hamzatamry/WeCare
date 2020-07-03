import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PatientListPage } from './patient-list.page';

describe('PatientListPage', () => {
  let component: PatientListPage;
  let fixture: ComponentFixture<PatientListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
