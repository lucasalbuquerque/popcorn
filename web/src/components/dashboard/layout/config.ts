import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const allNavItems = [
  { key: 'products', title: 'Products', href: paths.dashboard.products, icon: 'products', active: true },
  { key: 'chat', title: 'Popcorn AI', href: paths.dashboard.chat, icon: 'chat', active: true },
] satisfies NavItemConfig[];

export const navItems = allNavItems.filter((item) => item.active);
