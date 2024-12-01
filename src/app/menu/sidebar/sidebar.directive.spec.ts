import { SidebarComponent } from './sidebar.component';
import { SidebarDirective } from './sidebar.directive';

describe('SidebarDirective', () => {
  let mockSidebarComponent: SidebarComponent;
  it('should create an instance', () => {
    const directive = new SidebarDirective(mockSidebarComponent);
    expect(directive).toBeTruthy();
  });
});
