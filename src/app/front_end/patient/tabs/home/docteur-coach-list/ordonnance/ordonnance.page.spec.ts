import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrdonnancePage } from './ordonnance.page';

describe('OrdonnancePage', () => {
  let component: OrdonnancePage;
  let fixture: ComponentFixture<OrdonnancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdonnancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdonnancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
