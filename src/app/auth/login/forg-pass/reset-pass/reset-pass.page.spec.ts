import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResetPassPage } from './reset-pass.page';

describe('ResetPassPage', () => {
  let component: ResetPassPage;
  let fixture: ComponentFixture<ResetPassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPassPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
