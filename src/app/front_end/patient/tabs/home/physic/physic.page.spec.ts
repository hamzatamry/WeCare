import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PhysicPage } from './physic.page';

describe('PhysicPage', () => {
  let component: PhysicPage;
  let fixture: ComponentFixture<PhysicPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PhysicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
