import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForgPassPage } from './forg-pass.page';

describe('ForgPassPage', () => {
  let component: ForgPassPage;
  let fixture: ComponentFixture<ForgPassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgPassPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
