import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CountdownPage } from './countdown.page';

describe('CountdownPage', () => {
  let component: CountdownPage;
  let fixture: ComponentFixture<CountdownPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountdownPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CountdownPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
