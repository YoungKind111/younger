/**
 * 共享菜单组件 - 一处修改，全局生效
 * 氧阁 · 月嫂运营后台（PC 端原型骨架）
 *
 * 依赖（需在本文件之前引入）：
 *   - Vue 3 全局构建（vue.global.prod.js）
 *   - Element Plus（index.full.min.js）+ 中文语言包（zh-cn.min.js）
 *   - @element-plus/icons-vue（index.iife.min.js）
 */

// ==================== 菜单配置 ====================
const MENU_CONFIG = {
  logo: '氧阁 · 月嫂运营',
  groups: [
    {
      title: '月嫂运营',
      items: [
        // icon 填 @element-plus/icons-vue 的组件名（PascalCase）
        { id: 'nanny-profile', name: '月嫂档案', icon: 'User', url: 'nanny-profile.html' }
      ]
    }
  ]
};

/**
 * 创建 Vue 应用：统一注册 Element Plus（含中文语言包）和全部图标。
 * 页面应用也必须通过此函数创建，否则图标组件不可用、分页等组件显示英文。
 */
function createVueApp(rootComponent) {
  const app = Vue.createApp(rootComponent);
  app.use(ElementPlus, { locale: ElementPlusLocaleZhCn });
  for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(name, component);
  }
  return app;
}

/**
 * 初始化页面布局
 * 调用时机：页面脚本放在 body 末尾，此时 #app 已存在于 DOM 中，同步调用即可。
 * @param {string} activeMenuId - 当前激活的菜单ID
 * @param {Object} headerOptions - 顶部导航配置 { title, breadcrumb }
 */
function initPageLayout(activeMenuId, headerOptions = {}) {
  if (!createLayoutStructure()) return;
  mountSideMenu(activeMenuId);
  mountTopHeader(headerOptions);
}

/**
 * 创建页面布局结构
 * ⚠️ 核心规则：只移动 #app 节点的位置并追加 class，绝不替换元素或 innerHTML 重建。
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

  // ✅ 关键：给原 #app 添加类，不替换元素
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

/** 挂载侧边菜单（独立迷你 Vue 应用，与页面 #app 互不干扰） */
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

/** 挂载顶部导航（含移动端汉堡按钮） */
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

// 导出全局对象
window.SharedMenu = {
  MENU_CONFIG,
  initPageLayout,
  createVueApp
};
