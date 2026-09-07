import type { Menu } from '@prisma/client';

export interface MenuTreeNode extends Menu {
  children?: MenuTreeNode[];
}

/** 把扁平菜单列表构建成树（按 sort 升序） */
export function buildMenuTree(menus: Menu[], parentId: number | null = null): MenuTreeNode[] {
  return menus
    .filter((m) => (m.parentId ?? null) === parentId)
    .sort((a, b) => a.sort - b.sort)
    .map((m) => {
      const children = buildMenuTree(menus, m.id);
      return children.length ? { ...m, children } : { ...m };
    });
}
