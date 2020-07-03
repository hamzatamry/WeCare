import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiagramPage } from './diagram.page';

describe('DiagramPage', () => {
  let component: DiagramPage;
  let fixture: ComponentFixture<DiagramPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiagramPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
