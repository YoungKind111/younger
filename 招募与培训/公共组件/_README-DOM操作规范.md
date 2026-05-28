# Vue 3 + Element Plus 原型开发规范

## 问题现象

点击按钮（如"新增"、"编辑"）无反应，对话框不弹出，控制台无错误或有 DOM 相关错误。

## 根本原因

`shared-menu.js` 的 `createLayoutStructure()` 函数如果**替换**了 `#app` 元素，会导致 Vue 3 绑定的事件监听器全部丢失。

### ❌ 错误写法（会导致事件失效）

```javascript
// 错误：用 innerHTML 提取内容，再替换元素
const appContent = appDiv.innerHTML;
container.innerHTML = `<div id="app">${appContent}</div>`;
appDiv.parentNode.replaceChild(container, appDiv);  // 原元素被替换！
```

### ✅ 正确写法（保留原元素，只移动位置）

```javascript
// 正确：直接操作 DOM 节点，保留原 #app 元素
appDiv.classList.add('app-content');
appMain.appendChild(appDiv);  // 移动原元素，不替换
```

## 文件结构要求

### 1. shared-menu.js 的规范实现

```javascript
function createLayoutStructure() {
  if (document.querySelector('.app-container')) return;

  const appDiv = document.getElementById('app');
  if (!appDiv) return;

  const parent = appDiv.parentNode;

  // 创建布局元素
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

  // 组装布局
  appMain.appendChild(header);
  appMain.appendChild(appDiv);  // 直接移动原元素

  const container = document.createElement('div');
  container.className = 'app-container';
  container.appendChild(sidebar);
  container.appendChild(appMain);

  parent.appendChild(container);
}
```

### 2. HTML 页面模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>页面标题</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/element-plus/dist/index.css">
  <link rel="stylesheet" href="shared-styles.css">
</head>
<body>
  <!-- 保持简单，不要预写内容 -->
  <div id="app"></div>

  <!-- 按此顺序加载 -->
  <script src="https://cdn.jsdelivr.net/npm/vue@3"></script>
  <script src="https://cdn.jsdelivr.net/npm/element-plus"></script>
  <script src="shared-menu.js"></script>

  <script>
    const { createApp, ref } = Vue;

    // ✅ 步骤1：先初始化布局（在 Vue 创建之前！）
    SharedMenu.initPageLayout('menuId', {
      title: '页面标题',
      breadcrumb: '<a href="dashboard.html">首页</a> / 当前页面'
    });

    // ✅ 步骤2：创建 Vue 应用
    createApp({
      template: `...`,
      setup() { ... }
    }).use(ElementPlus).mount('#app');
  </script>
</body>
</html>
```

### 3. 表单数据使用规范

```javascript
// ✅ 推荐：使用 ref，重置时直接赋值新对象
const form = ref({ name: '', status: 'active' });
const handleAdd = () => {
  form.value = { name: '', status: 'active' };  // 重置
};

// ❌ 避免：reactive 在 el-form 中可能有响应式问题
const form = reactive({ name: '', status: 'active' });
```

## 检查清单

新建页面时确认：

- [ ] `<div id="app"></div>` 结构简单，无预写内容
- [ ] `shared-menu.js` 在 `vue@3` 和 `element-plus` **之后**加载
- [ ] `SharedMenu.initPageLayout()` 在 `createApp()` **之前**调用
- [ ] 表单数据使用 `ref` 而非 `reactive`
- [ ] 对话框使用 `v-model="dialogVisible"` 控制显示

## 调试技巧

如果按钮仍无反应：

1. **检查元素**：右键按钮 → 检查，看是否有 `@click` 绑定
2. **控制台**：查看是否有红色错误
3. **断点**：在 `handleAdd` 函数第一行加 `debugger;` 测试
4. **简化测试**：先做一个简单的 `alert('test')` 测试点击是否生效

## 参考文件

- `_template.html` - 可直接复制的完整示例
- `shared-menu.js` - 已修复的共享菜单组件
