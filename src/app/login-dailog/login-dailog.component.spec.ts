import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDailogComponent } from './login-dailog.component';

describe('LoginDailogComponent', () => {
  let component: LoginDailogComponent;
  let fixture: ComponentFixture<LoginDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginDailogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
