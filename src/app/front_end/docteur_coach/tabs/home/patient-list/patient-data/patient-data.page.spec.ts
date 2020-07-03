import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PatientDataPage } from './patient-data.page';

describe('PatientDataPage', () => {
  let component: PatientDataPage;
  let fixture: ComponentFixture<PatientDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientDataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
