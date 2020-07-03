import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SampleCountdownPage } from './sample-countdown.page';

describe('SampleCountdownPage', () => {
  let component: SampleCountdownPage;
  let fixture: ComponentFixture<SampleCountdownPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleCountdownPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SampleCountdownPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
