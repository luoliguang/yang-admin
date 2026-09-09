import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始 seed...');

  // 幂等：清空关联与数据（开发种子）
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.menu.deleteMany();

  // ---- 菜单 / 权限 ----
  const dashboard = await prisma.menu.create({
    data: { type: 1, title: '仪表盘', name: 'Dashboard', path: '/dashboard', component: 'dashboard/index', icon: 'Odometer', sort: 1 },
  });

  const system = await prisma.menu.create({
    data: { type: 0, title: '系统管理', path: '/system', icon: 'Setting', sort: 2 },
  });

  // 三个管理页 + 各自的按钮权限
  const buildPage = async (
    title: string,
    name: string,
    path: string,
    component: string,
    prefix: string,
    sort: number,
  ) => {
    const page = await prisma.menu.create({
      data: {
        parentId: system.id,
        type: 1,
        title,
        name,
        path,
        component,
        permission: `${prefix}:list`,
        sort,
      },
    });
    const actions: Array<[string, string]> = [
      ['新增', 'add'],
      ['编辑', 'edit'],
      ['删除', 'delete'],
    ];
    for (const [label, act] of actions) {
      await prisma.menu.create({
        data: { parentId: page.id, type: 2, title: `${title}-${label}`, permission: `${prefix}:${act}` },
      });
    }
    return page;
  };

  await buildPage('用户管理', 'SystemUser', '/system/user', 'system/user/index', 'system:user', 1);
  await buildPage('角色管理', 'SystemRole', '/system/role', 'system/role/index', 'system:role', 2);
  await buildPage('菜单管理', 'SystemMenu', '/system/menu', 'system/menu/index', 'system:menu', 3);

  // ---- 组件中心：组件预览 + 可复制用法（起新项目时可整块删除）----
  const comp = await prisma.menu.create({
    data: { type: 0, title: '组件中心', path: '/components', icon: 'Grid', sort: 3 },
  });
  await prisma.menu.createMany({
    data: [
      { parentId: comp.id, type: 1, title: '概览', name: 'CompOverview', path: '/components/overview', component: 'components/overview', icon: 'Grid', sort: 1 },
      { parentId: comp.id, type: 1, title: '交互演练场', name: 'CompPlayground', path: '/components/playground', component: 'components/playground', icon: 'Odometer', sort: 2 },
      { parentId: comp.id, type: 1, title: '基础与令牌', name: 'CompBasic', path: '/components/basic', component: 'components/basic', icon: 'List', sort: 2 },
      { parentId: comp.id, type: 1, title: 'ProTable', name: 'CompTable', path: '/components/table', component: 'components/table', icon: 'List', sort: 3 },
      { parentId: comp.id, type: 1, title: '表单与弹窗', name: 'CompForm', path: '/components/form', component: 'components/form', icon: 'Document', sort: 4 },
      { parentId: comp.id, type: 1, title: '文件上传', name: 'CompUpload', path: '/components/upload', component: 'components/upload', icon: 'Document', sort: 5 },
      { parentId: comp.id, type: 1, title: '图表', name: 'CompChart', path: '/components/chart', component: 'components/chart', icon: 'Odometer', sort: 6 },
      { parentId: comp.id, type: 1, title: '生成示例·订单概览', name: 'GenOrderOverview', path: '/components/order-overview', component: 'order-overview/index', icon: 'ShoppingCart', sort: 7 },
    ],
  });

  // ---- 角色：管理员拥有全部菜单 ----
  const allMenus = await prisma.menu.findMany({ select: { id: true } });
  const adminRole = await prisma.role.create({
    data: {
      name: '超级管理员',
      code: 'admin',
      remark: '拥有全部权限',
      menus: { connect: allMenus.map((m) => ({ id: m.id })) },
    },
  });

  // 只读访客角色：仅仪表盘
  await prisma.role.create({
    data: {
      name: '访客',
      code: 'guest',
      remark: '仅可查看仪表盘',
      menus: { connect: [{ id: dashboard.id }] },
    },
  });

  // ---- 用户：admin / admin123 ----
  await prisma.user.create({
    data: {
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      nickname: '管理员',
      email: 'admin@yang-admin.dev',
      roles: { connect: [{ id: adminRole.id }] },
    },
  });

  console.log('✅ seed 完成：用户 admin / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
