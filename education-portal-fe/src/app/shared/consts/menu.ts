import { ROLE } from './role';

interface Menu {
  url: string;
  title: string;
  acceptRoles?: string[];
}
export const MENU: Menu[] = [
  {
    url: '/user-management',
    title: 'User management',
    acceptRoles: [ROLE.SystemAdmin],
  },
  {
    url: '/system-health',
    title: 'System Health',
    acceptRoles: [ROLE.Developer, ROLE.SystemAdmin],
  },
];
