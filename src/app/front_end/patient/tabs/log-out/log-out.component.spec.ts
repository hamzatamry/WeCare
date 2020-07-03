import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogOutComponent } from './log-out.component';

describe('LogOutComponent', () => {
  let component: LogOutComponent;
  let fixture: ComponentFixture<LogOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogOutComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LogOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
