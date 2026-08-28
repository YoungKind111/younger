/**
 * 共享菜单组件 - 统一管理后台 · 权限模块原型
 * 依赖（需在本文件之前引入）：Vue 3 / Element Plus + zh-cn / @element-plus/icons-vue
 */

// ==================== 菜单配置 ====================
const MENU_CONFIG = {
  logo: '统一管理后台',
  groups: [
    {
      title: '组织与员工',
      items: [
        { id: 'org-tree', name: '组织架构', icon: 'OfficeBuilding', url: 'org-tree.html' },
        { id: 'staff-list', name: '员工管理', icon: 'User', url: 'staff-list.html' }
      ]
    },
    {
      title: '权限管理（RBAC）',
      items: [
        { id: 'role', name: '角色管理', icon: 'Avatar', url: 'role-list.html' },
        { id: 'perm', name: '权限点清单', icon: 'Key', url: 'perm-points.html' },
        { id: 'grant', name: '授权查询', icon: 'Search', url: 'grant-query.html' },
        { id: 'menu-config', name: '菜单配置', icon: 'Menu', url: 'menu-config.html' },
        { id: 'system-access', name: '系统接入', icon: 'Connection', url: 'system-access.html' }
      ]
    },
    {
      title: '账号管理',
      items: [
        { id: 'account', name: '账号查询', icon: 'UserFilled', url: 'account-search.html' },
        { id: 'appeal', name: '申诉审核', icon: 'Tickets', url: 'appeal-review.html' }
      ]
    },
    {
      title: '全局配置',
      items: [
        { id: 'config-auth', name: '认证源配置', icon: 'Lock', url: 'config-auth.html' },
        { id: 'config-security', name: '安全策略', icon: 'Setting', url: 'config-security.html' },
        { id: 'config-channel', name: '端与准入', icon: 'Grid', url: 'config-channel.html' },
        { id: 'config-text', name: '文案配置', icon: 'Document', url: 'config-text.html' },
        { id: 'config-message', name: '消息模板', icon: 'Message', url: 'config-message.html' }
      ]
    },
    {
      title: '审计中心',
      items: [
        { id: 'audit', name: '审计查询', icon: 'Document', url: 'audit-log.html' }
      ]
    }
  ]
};

/**
 * 创建 Vue 应用：统一注册 Element Plus（含中文语言包）和全部图标。
 */
function createVueApp(rootComponent) {
  const app = Vue.createApp(rootComponent);
  app.use(ElementPlus, { locale: ElementPlusLocaleZhCn });
  for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(name, component);
  }
  return app;
}

function initPageLayout(activeMenuId, headerOptions = {}) {
  if (!createLayoutStructure()) return;
  mountSideMenu(activeMenuId);
  mountTopHeader(headerOptions);
}

/**
 * ⚠️ 核心规则：只移动 #app 节点并追加 class，绝不替换元素或 innerHTML 重建。
 */
function createLayoutStructure() {
  if (document.querySelector('.app-container')) return true;

  const appDiv = document.getElementById('app');
  if (!appDiv) {
    console.error('[SharedMenu] 未找到 #app 元素');
    return false;
  }

  const parent = appDiv.parentNode;

  const sidebar = document.createElement('aside');
  sidebar.className = 'app-sidebar';
  sidebar.id = 'side-menu';

  const header = document.createElement('header');
  header.className = 'app-header';
  header.id = 'top-header';

  const appMain = document.createElement('div');
  appMain.className = 'app-main';

  appDiv.classList.add('app-content');

  appMain.appendChild(header);
  appMain.appendChild(appDiv);

  const container = document.createElement('div');
  container.className = 'app-container';
  container.appendChild(sidebar);
  container.appendChild(appMain);
  parent.appendChild(container);
  return true;
}

function mountSideMenu(activeId) {
  createVueApp({
    template: `
      <div class="app-logo">${MENU_CONFIG.logo}</div>
      <div v-for="group in groups" :key="group.title" class="menu-group">
        <div class="menu-group-title">{{ group.title }}</div>
        <a v-for="item in group.items" :key="item.id"
           :href="item.url"
           class="menu-item"
           :class="{ active: item.id === activeId }">
          <el-icon :size="16"><component :is="item.icon" /></el-icon>
          <span>{{ item.name }}</span>
        </a>
      </div>
    `,
    setup() {
      return { groups: MENU_CONFIG.groups, activeId };
    }
  }).mount('#side-menu');
}

function mountTopHeader(options = {}) {
  const { title = '页面标题', breadcrumb = '' } = options;
  createVueApp({
    template: `
      <div class="header-left">
        <el-icon class="menu-toggle" :size="20" @click="toggleSidebar"><Expand /></el-icon>
        <div>
          <div class="header-title">${title}</div>
          <div v-if="breadcrumb" class="header-breadcrumb" v-html="breadcrumb"></div>
        </div>
      </div>
      <div class="header-right">
        <el-icon :size="18"><Bell /></el-icon>
        <span class="header-user">管理员</span>
      </div>
    `,
    setup() {
      const toggleSidebar = () => {
        document.querySelector('.app-container').classList.toggle('sidebar-open');
      };
      return { breadcrumb, toggleSidebar };
    }
  }).mount('#top-header');
}

window.SharedMenu = {
  MENU_CONFIG,
  initPageLayout,
  createVueApp
};
