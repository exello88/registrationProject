import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginWithComponent } from './login-with.component';

describe('LoginWithComponent', () => {
  let component: LoginWithComponent;
  let fixture: ComponentFixture<LoginWithComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginWithComponent]
    });
    fixture = TestBed.createComponent(LoginWithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
