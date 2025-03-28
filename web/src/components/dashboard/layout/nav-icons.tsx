import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { Brain as BrainIcon } from '@phosphor-icons/react/dist/ssr/Brain';
import { Package as PackageIcon } from '@phosphor-icons/react/dist/ssr/Package';

export const navIcons = {
  chat: BrainIcon,
  products: PackageIcon,
} as Record<string, Icon>;
