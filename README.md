# SLTE Theme

> 一款专为 v2board 设计的现代化卡片式用户端主题，采用淡雅低饱和度配色、严格的 8px 间距体系，并对移动端交互进行了深度优化。

---

## ✨ 特性

- **卡片式设计语言**：全局统一的 16px 圆角、淡色边框与轻量级阴影，悬浮时带有弹性上浮动画
- **四套内置配色**：清新绿（default）、天空蓝（blue）、暖灰黑（black）、深海蓝（darkblue）
- **夜色模式**：支持手动切换，切换时带有 0.25s 平滑过渡动画，自动持久化用户偏好
- **移动端深度优化**：底部 4 项核心导航、抽屉式侧边栏、iOS 风格底部弹窗、Safe Area 全机型适配
- **完整功能支持**：
  - 余额充值（预设金额 + 自定义输入 + 充值赠送展示）
  - 自动续费（仪表盘与个人设置页快捷 Toggle）
  - 礼品卡兑换（支持余额 / 时长 / 流量 / 重置 / 套餐五种类型）
  - 工单系统、知识库、邀请返佣、节点列表、流量统计
- **零构建依赖**：纯原生 HTML / CSS / JS，无需 Node.js，无需编译，即插即用
- **安全加固**：全面 XSS 防护、富文本白名单净化、二维码本地生成（不依赖第三方服务）、CSP 策略

---

## 🚀 部署

### 方式一：宝塔面板（推荐）

1. 下载本仓库，解压到任意目录
2. 修改 `env.js` 中的 `routerBase` 为你的 API 服务地址
3. 在宝塔中新建静态网站，将目录指向解压后的文件夹
4. 配置 SSL 证书，开启 HTTPS

### 方式二：Nginx 直接部署

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    root /path/to/slte-theme;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 配置说明

复制 `env.example.js` 为 `env.js`，按需修改：

```js
// 必填：API 服务地址，末尾不加斜杠
window.routerBase = 'https://your-api-domain.com';

window.settings = {
  title: 'SLTE',          // 站点名称
  logo: '',               // Logo 图片 URL，留空使用首字母图标
  currency_symbol: '¥',  // 货币符号
  theme: { color: 'default' }, // 配色方案
  background_url: '',     // 自定义背景图 URL
};
```

---

## 🔍 在线预览

- 🌐 **预览地址**：https://slte-theme.shgn.me
- 👤 **测试账号**：demo@example.com
- 🔑 **测试密码**：12345678

> 仅用于主题演示，请勿修改账号信息。

---

## 📁 项目结构

```
slte-theme/
├── index.html              # 主入口
├── env.js                  # 环境配置（本地，不提交）
├── env.example.js          # 配置模板
├── config.json             # 项目元数据
├── assets/
│   ├── css/
│   │   ├── design-system.css   # 设计系统变量与基础样式
│   │   └── layout.css          # 布局与组件样式
│   ├── js/
│   │   ├── core.js             # 核心工具、HTTP 客户端、路由
│   │   ├── auth.js             # 登录 / 注册 / 找回密码
│   │   ├── dashboard.js        # 仪表盘、布局、节点、流量
│   │   ├── pages.js            # 套餐、订单、支付、充值、公告
│   │   ├── pages2.js           # 知识库、邀请、工单、个人中心
│   │   └── vendor/             # 本地第三方库
│   │       ├── iconify.min.js
│   │       ├── lottie.min.js
│   │       └── qrcode.min.js
│   └── lottie/
│       └── empty.json          # 空状态动画
├── README.md
└── DEVELOPMENT.md          # 开发文档
```

---

## 📢 社区

- 📣 **Telegram 频道**：https://t.me/Ciallo_RT
- 💬 **Telegram 群组**：https://t.me/Ciallo_hi

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源，你可以自由地使用、修改和分发。
