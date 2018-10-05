import { SideBarNavigationItem } from './types/sidebar-navigation-item.interface';

export const SIDE_BAR_CONFIG: SideBarNavigationItem[] = [
  { label: 'SIDEBAR.HOME', icon: 'home', route: '/home' },
  { label: 'SIDEBAR.VERWALTUNG', icon: 'file_copy', route: '/vewaltung' },
  { label: 'SIDEBAR.WETTKAMPF', icon: 'play_arrow', route: '/wettkaempfe' },
  { label: 'SIDEBAR.SPORTJAHRESPLAN', icon: 'today', route: '/sportjahresplan' }
];
