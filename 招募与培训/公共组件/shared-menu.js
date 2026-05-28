/**
 * 护理招募培训系统 - 共享侧边菜单组件
 * 所有后台页面引入此JS，实现一处修改全局生效
 */

// 菜单配置数据
const MENU_CONFIG = {
  // 当前激活的菜单项，由各个页面设置
  activeMenu: '',
  
  // 菜单分组
  groups: [
    {
      title: '推广管理',
      icon: 'el-icon-s-promotion',
      items: [
        { id: 'channel', name: '渠道管理', icon: 'el-icon-connection', url: '../推广管理/channel-enhanced.html' },
        { id: 'promoter', name: '推广人管理', icon: 'el-icon-user', url: '../推广管理/promoter-manage.html' },
        { id: 'commission-rule', name: '佣金规则', icon: 'el-icon-coin', url: '../推广管理/commission-rule.html' },
        { id: 'commission-detail', name: '佣金明细', icon: 'el-icon-document', url: '../推广管理/commission-detail.html' },
        { id: 'settlement', name: '佣金结算', icon: 'el-icon-wallet', url: '../推广管理/settlement.html' }
      ]
    },
    {
      title: '招募管理',
      icon: 'el-icon-s-custom',
      items: [
        { id: 'recruiter', name: '招生老师', icon: 'el-icon-s-custom', url: '../招募管理/recruiter.html' },
        { id: 'lead-public', name: '所有线索', icon: 'el-icon-share', url: '../招募管理/lead-public.html' },
        { id: 'lead-my', name: '我的线索', icon: 'el-icon-user', url: '../招募管理/lead-my.html' },
        { id: 'interview', name: '邀约到店', icon: 'el-icon-chat-dot-square', url: '../招募管理/interview.html' },
        { id: 'contract', name: '签约入册', icon: 'el-icon-document-checked', url: '../招募管理/contract.html' },
        { id: 'deposit', name: '押金台账', icon: 'el-icon-wallet', url: '../招募管理/deposit.html' }
      ]
    },
    {
      title: '人员档案',
      icon: 'el-icon-s-order',
      items: [
        { id: 'staff', name: '人员档案', icon: 'el-icon-folder', url: '../人员档案/staff.html' },
        { id: 'tags', name: '标签管理', icon: 'el-icon-price-tag', url: '../人员档案/tags.html' }
      ]
    },
    {
      title: '培训考核',
      icon: 'el-icon-s-claim',
      items: [
        { id: 'position', name: '岗位管理', icon: 'el-icon-suitcase', url: '../培训考核/position.html' },
        { id: 'course-template', name: '课程管理', icon: 'el-icon-s-management', url: '../培训考核/course-template.html' },
        { id: 'course-fee', name: '课程费用', icon: 'el-icon-money', url: '../培训考核/course-fee.html' },
        { id: 'exam-paper', name: '考卷管理', icon: 'el-icon-document', url: '../培训考核/exam-paper.html' },
        { id: 'training-class', name: '班级管理', icon: 'el-icon-reading', url: '../培训考核/training-class.html' },
        { id: 'exam-results', name: '考核结果', icon: 'el-icon-trophy', url: '../培训考核/exam-results.html' },
        { id: 'handover', name: '运营交接', icon: 'el-icon-s-promotion', url: '../培训考核/handover.html' }
      ]
    }
    
   
  ]
};

/**
 * 渲染侧边菜单
 * @param {string} activeId - 当前激活的菜单ID
 * @param {string} containerId - 菜单容器ID，默认为 'side-menu'
 */
function renderSideMenu(activeId, containerId = 'side-menu') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Menu container not found:', containerId);
    return;
  }

  let html = `
    <div class="app-logo">
      <i class="el-icon-first-aid-kit"></i>
      <span>护理招募培训系统</span>
    </div>
    <div class="menu-groups">
  `;

  MENU_CONFIG.groups.forEach(group => {
    html += `
      <div class="menu-group">
        <div class="menu-group-title">
          <i class="${group.icon}"></i>
          <span>${group.title}</span>
        </div>
        <div class="menu-items">
    `;

    group.items.forEach(item => {
      const isActive = item.id === activeId;
      html += `
        <a href="${item.url}" class="menu-item ${isActive ? 'active' : ''}" data-id="${item.id}">
          <i class="${item.icon}"></i>
          <span>${item.name}</span>
        </a>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  html += '</div>';
  
  // 添加用户信息
  html += `
    <div class="menu-user">
      <div class="user-avatar">
        <i class="el-icon-user-solid"></i>
      </div>
      <div class="user-info">
        <div class="user-name">张经理</div>
        <div class="user-role">招生部主管</div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * 渲染顶部导航栏
 * @param {Object} options - 配置选项
 * @param {string} options.title - 页面标题
 * @param {string} options.breadcrumb - 面包屑导航HTML
 * @param {string} containerId - 容器ID，默认为 'top-header'
 */
function renderTopHeader(options = {}, containerId = 'top-header') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Header container not found:', containerId);
    return;
  }

  const { title = '页面标题', breadcrumb = '' } = options;

  container.innerHTML = `
    <div class="header-left">
      <div class="header-title">${title}</div>
      ${breadcrumb ? `<div class="header-breadcrumb">${breadcrumb}</div>` : ''}
    </div>
    <div class="header-right">
      <div class="header-action">
        <i class="el-icon-bell"></i>
        <span class="badge">3</span>
      </div>
      <div class="header-action">
        <i class="el-icon-question"></i>
      </div>
      <div class="header-action">
        <i class="el-icon-setting"></i>
      </div>
    </div>
  `;
}

/**
 * 创建页面布局结构
 * 将简单的 <div id="app"> 转换为完整的布局结构
 */
function createLayoutStructure() {
  // 检查是否已存在布局结构
  if (document.querySelector('.app-container')) {
    return;
  }

  const appDiv = document.getElementById('app');
  if (!appDiv) {
    console.error('未找到 #app 元素，无法创建布局');
    return;
  }

  // 获取 #app 的父节点
  const parent = appDiv.parentNode;

  // 创建侧边栏
  const sidebar = document.createElement('aside');
  sidebar.className = 'app-sidebar';
  sidebar.id = 'side-menu';

  // 创建顶部导航
  const header = document.createElement('header');
  header.className = 'app-header';
  header.id = 'top-header';

  // 创建主内容区包装器
  const appMain = document.createElement('div');
  appMain.className = 'app-main';

  // 给原 #app 添加 app-content 类
  appDiv.classList.add('app-content');

  // 组装布局：app-main 包含 header 和 #app
  appMain.appendChild(header);
  appMain.appendChild(appDiv);

  // 创建容器并组装
  const container = document.createElement('div');
  container.className = 'app-container';
  container.appendChild(sidebar);
  container.appendChild(appMain);

  // 将容器添加到 body 末尾
  parent.appendChild(container);
}

/**
 * 初始化页面布局（用于没有预定义布局的页面）
 * @param {string} activeMenuId - 当前激活的菜单ID
 * @param {Object} headerOptions - 顶部导航配置
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

// 导出函数供外部使用
window.SharedMenu = {
  renderSideMenu,
  renderTopHeader,
  initPageLayout,
  MENU_CONFIG
};
