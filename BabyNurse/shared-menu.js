/**
 * 共享菜单组件 - 育婴师服务系统运营后台
 * 实现一处修改，全局生效
 */

// 菜单配置
const MENU_CONFIG = {
  groups: [
    {
      title: '业务管理',
      items: [
        { id: 'requirement', name: '需求管理', icon: 'el-icon-document', url: 'requirement-list.html' },
        { id: 'nanny', name: '育婴师管理', icon: 'el-icon-user', url: 'nanny-list.html' },
        { id: 'operator', name: '链接配置', icon: 'el-icon-link', url: 'operator-config.html' }
      ]
    }
  ]
};

/**
 * 初始化页面布局
 * @param {string} activeMenuId - 当前激活的菜单ID
 * @param {Object} headerOptions - 顶部导航配置 { title, breadcrumb }
 */
function initPageLayout(activeMenuId, headerOptions = {}) {
  const init = () => {
    createLayoutStructure();
    renderSideMenu(activeMenuId);
    renderTopHeader(headerOptions);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

/**
 * 创建页面布局结构 - 关键：必须保留原 #app 元素
 */
function createLayoutStructure() {
  if (document.querySelector('.app-container')) return;

  const appDiv = document.getElementById('app');
  if (!appDiv) {
    console.error('未找到 #app 元素');
    return;
  }

  const parent = appDiv.parentNode;

  // 创建侧边栏
  const sidebar = document.createElement('aside');
  sidebar.className = 'app-sidebar';
  sidebar.id = 'side-menu';

  // 创建顶部导航
  const header = document.createElement('header');
  header.className = 'app-header';
  header.id = 'top-header';

  // 创建主内容区
  const appMain = document.createElement('div');
  appMain.className = 'app-main';

  // 关键：给原 #app 添加类，不替换元素
  appDiv.classList.add('app-content');

  // 组装布局
  appMain.appendChild(header);
  appMain.appendChild(appDiv);

  const container = document.createElement('div');
  container.className = 'app-container';
  container.appendChild(sidebar);
  container.appendChild(appMain);

  parent.appendChild(container);
}

/**
 * 渲染侧边菜单
 */
function renderSideMenu(activeId) {
  const container = document.getElementById('side-menu');
  if (!container) return;

  let html = `
    <div class="app-logo">
      <i class="el-icon-s-home"></i>
      <span>育婴师管理系统</span>
    </div>
  `;

  html += MENU_CONFIG.groups.map(group => {
    return `
      <div class="menu-group">
        <div class="menu-group-title">${group.title}</div>
        <div class="menu-items">
          ${group.items.map(item => `
            <a href="${item.url}" class="menu-item ${item.id === activeId ? 'active' : ''}">
              <i class="${item.icon}"></i>
              <span>${item.name}</span>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

/**
 * 渲染顶部导航
 */
function renderTopHeader(options = {}) {
  const container = document.getElementById('top-header');
  if (!container) return;

  const { title = '页面标题', breadcrumb = '' } = options;

  container.innerHTML = `
    <div class="header-left">
      <div class="header-title">${title}</div>
      ${breadcrumb ? `<div class="header-breadcrumb">${breadcrumb}</div>` : ''}
    </div>
    <div class="header-right">
      <div class="header-icon-wrap">
        <i class="el-icon-bell" style="font-size: 18px; cursor: pointer;"></i>
        <span class="header-badge">3</span>
      </div>
      <div class="user-info">
        <div class="user-avatar">
          <i class="el-icon-user-solid"></i>
        </div>
        <span class="user-name">运营专员</span>
      </div>
    </div>
  `;
}

// 导出全局对象
window.SharedMenu = {
  initPageLayout,
  renderSideMenu,
  renderTopHeader,
  MENU_CONFIG
};
