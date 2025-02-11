import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePostComponent } from './profile-post.component';

describe('ProfilePostComponent', () => {
  let component: ProfilePostComponent;
  let fixture: ComponentFixture<ProfilePostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilePostComponent]
    });
    fixture = TestBed.createComponent(ProfilePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
