import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileInputPage } from './profile-input.page';

describe('ProfileInputPage', () => {
  let component: ProfileInputPage;
  let fixture: ComponentFixture<ProfileInputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileInputPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
