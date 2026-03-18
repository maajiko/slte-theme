/* ── Dashboard & Layout ── */

const ICONS = {
  dashboard: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>`,
  book: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>`,
  creditCard: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>`,
  shoppingBag: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>`,
  signal: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>`,
  sparkles: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>`,
  ticket: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"/></svg>`,
  chartBar: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>`,
  logout: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`,
  bell: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>`,
  chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>`,
  gift: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1012 10.125 2.625 2.625 0 0012 4.875zM12 10.125v1.125m0 0H9.75m2.25 0H14.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>`,
  wallet: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"/></svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>`,
  sun: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>`,
};

const SIDEBAR_GROUPS = [
  {
    label: null,
    items: [
      { id: 'dashboard', icon: 'dashboard', label: '仪表盘',   route: '/dashboard' },
      { id: 'knowledge', icon: 'book',      label: '使用文档', route: '/knowledge' },
    ]
  },
  {
    label: '财务',
    items: [
      { id: 'deposit',  icon: 'wallet',      label: '余额充值', route: '/deposit' },
      { id: 'orders',   icon: 'shoppingBag', label: '我的订单', route: '/orders' },
      { id: 'invite',   icon: 'users',       label: '推广赚钱', route: '/invite' },
      { id: 'giftcard', icon: 'gift',        label: '礼品卡',   route: '/giftcard', badge: 'new' },
    ]
  },
  {
    label: '订阅',
    items: [
      { id: 'plans',   icon: 'sparkles', label: '购买订阅', route: '/plans' },
      { id: 'servers', icon: 'signal',   label: '节点状态', route: '/servers' },
    ]
  },
  {
    label: '用户',
    items: [
      { id: 'profile',  icon: 'user',     label: '个人中心', route: '/profile' },
      { id: 'tickets',  icon: 'ticket',   label: '我的工单', route: '/tickets' },
      { id: 'traffic',  icon: 'chartBar', label: '流量明细', route: '/traffic' },
    ]
  }
];

const MOBILE_NAV_ITEMS = [
  { id: 'dashboard', icon: 'dashboard', label: '仪表',  route: '/dashboard' },
  { id: 'plans',     icon: 'sparkles',  label: '订阅',  route: '/plans' },
  { id: 'knowledge', icon: 'book',      label: '文档',  route: '/knowledge' },
  { id: 'profile',   icon: 'user',      label: '我的',  route: '/profile' },
];

/* ── Lottie 空状态 ── */
const LottieHelper = {
  _instances: {},
  play(containerId, jsonPath, opts = {}) {
    const container = document.getElementById(containerId);
    if (!container || typeof lottie === 'undefined') return;
    if (this._instances[containerId]) this._instances[containerId].destroy();
    this._instances[containerId] = lottie.loadAnimation({
      container, renderer: 'svg',
      loop: opts.loop !== false, autoplay: true, path: jsonPath,
    });
  },
  destroy(containerId) {
    if (this._instances[containerId]) {
      this._instances[containerId].destroy();
      delete this._instances[containerId];
    }
  }
};

function emptyState(id, title, desc, btnLabel, btnAction) {
  const btnHtml = btnLabel
    ? `<button class="btn btn-primary" onclick="${btnAction}">${Utils.escapeHtml(btnLabel)}</button>`
    : '';
  return `
    <div class="empty-state">
      <div class="lottie-empty" id="${Utils.escapeHtml(id)}" style="width:120px;height:120px"></div>
      <div class="empty-state-title">${Utils.escapeHtml(title)}</div>
      ${desc ? `<div class="empty-state-desc">${Utils.escapeHtml(desc)}</div>` : ''}
      ${btnHtml}
    </div>`;
}

function initLottieEmpty(id) {
  requestAnimationFrame(() => LottieHelper.play(id, 'assets/lottie/empty.json', { loop: true }));
}

function scanIconify() {
  requestAnimationFrame(() => {
    if (window.Iconify && typeof Iconify.scan === 'function') Iconify.scan();
  });
}

/* ── 主布局渲染 ── */
function renderLayout() {
  const app = document.getElementById('app');
  const siteName = SETTINGS.title || 'SLTE';
  const logo = SETTINGS.logo;
  const allNavItems = SIDEBAR_GROUPS.flatMap(g => g.items);

  app.innerHTML = `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        ${logo
          ? `<img src="${logo}" alt="${siteName}" class="sidebar-logo-img">`
          : `<div class="sidebar-logo-icon">${(siteName[0]||'S').toUpperCase()}</div>`
        }
        <span class="sidebar-logo-text">${siteName}</span>
      </div>
      <nav class="sidebar-nav" id="sidebar-nav">
        ${SIDEBAR_GROUPS.map(group => `
          <div class="nav-group">
            ${group.label ? `<div class="nav-group-label">${group.label}</div>` : ''}
            ${group.items.map(item => `
              <a class="nav-item" id="nav-${item.id}" data-route="${item.route}"
                 href="#${item.route}"
                 onclick="Router.navigate('${item.route}');return false;">
                <span class="nav-icon">${ICONS[item.icon] || ''}</span>
                <span class="nav-label">${item.label}</span>
                ${item.badge ? `<span class="badge badge-primary badge-xs">${item.badge}</span>` : ''}
              </a>
            `).join('')}
          </div>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        <button class="nav-item nav-item-danger" onclick="logout()">
          <span class="nav-icon">${ICONS.logout}</span>
          <span class="nav-label">退出登录</span>
        </button>
      </div>
    </aside>

    <div class="sidebar-overlay hidden" id="sidebar-overlay" onclick="closeSidebar()"></div>

    <div class="main-wrapper" id="main-wrapper">
      <header class="topbar" id="topbar">
        <div class="topbar-inner">
          <button class="icon-btn menu-toggle" id="menu-toggle" onclick="toggleSidebar()" aria-label="菜单">
            <span id="menu-icon">${ICONS.menu}</span>
          </button>
          <span class="topbar-title" id="topbar-title">仪表盘</span>
          <div class="topbar-actions">
            <button class="icon-btn" id="dark-toggle-btn" onclick="toggleDarkMode()" aria-label="切换夜色模式">
              <span id="dark-toggle-icon">${ICONS.moon}</span>
            </button>
            <button class="icon-btn" onclick="Router.navigate('/notices')" aria-label="公告">
              ${ICONS.bell}
            </button>
            <button class="avatar-btn" onclick="Router.navigate('/profile')" aria-label="个人中心">
              <span id="topbar-avatar" class="avatar-text">U</span>
            </button>
          </div>
        </div>
      </header>

      <main class="main-content" id="content"></main>

      <nav class="mobile-nav" id="mobile-nav" role="navigation" aria-label="底部导航">
        ${MOBILE_NAV_ITEMS.map(item => `
          <button class="mobile-nav-item" id="mnav-${item.id}" data-route="${item.route}"
                  onclick="Router.navigate('${item.route}')" aria-label="${item.label}">
            <span class="mobile-nav-icon">${ICONS[item.icon] || ''}</span>
            <span class="mobile-nav-label">${item.label}</span>
          </button>
        `).join('')}
      </nav>
    </div>`;

  app.classList.remove('auth-mode');
  app.classList.add('app-mode');

  State.on('user', user => {
    if (!user) return;
    const avatarEl = document.getElementById('topbar-avatar');
    if (avatarEl) avatarEl.textContent = (user.email?.[0] || 'U').toUpperCase();
  });
  if (State.user) {
    const avatarEl = document.getElementById('topbar-avatar');
    if (avatarEl) avatarEl.textContent = (State.user.email?.[0] || 'U').toUpperCase();
  }
}

function updateActiveNav(route) {
  $$('.nav-item[data-route]').forEach(el => el.classList.remove('active'));
  $$('.mobile-nav-item[data-route]').forEach(el => el.classList.remove('active'));

  const navEl   = $(`.nav-item[data-route="${route}"]`);
  const mnavEl  = $(`.mobile-nav-item[data-route="${route}"]`);
  if (navEl)  navEl.classList.add('active');
  if (mnavEl) mnavEl.classList.add('active');

  const allItems = SIDEBAR_GROUPS.flatMap(g => g.items).concat(MOBILE_NAV_ITEMS);
  const found = allItems.find(i => i.route === route);
  const titleEl = $('#topbar-title');
  if (titleEl && found) titleEl.textContent = found.label;
}

function toggleSidebar() {
  const sidebar = $('#sidebar');
  const overlay = $('#sidebar-overlay');
  const isOpen  = sidebar?.classList.contains('open');
  if (isOpen) {
    sidebar?.classList.remove('open');
    overlay?.classList.add('hidden');
  } else {
    sidebar?.classList.add('open');
    overlay?.classList.remove('hidden');
  }
}

function closeSidebar() {
  $('#sidebar')?.classList.remove('open');
  $('#sidebar-overlay')?.classList.add('hidden');
}

/* ── Dashboard Page ── */
async function initDashboard() {
  updateActiveNav('/dashboard');
  const content = $('#content');
  if (!content) return;

  content.innerHTML = `
    <div class="page-header">
      <div class="skeleton" style="height:28px;width:160px;border-radius:6px"></div>
      <div class="skeleton" style="height:16px;width:240px;border-radius:6px;margin-top:8px"></div>
    </div>
    <div class="dashboard-grid">
      ${[1,2,3,4].map(() => `<div class="stat-card"><div class="skeleton" style="height:100px;border-radius:8px"></div></div>`).join('')}
    </div>`;

  try {
    const [userRes, subRes] = await Promise.all([API.userInfo(), API.getSubscribe()]);
    const user = userRes.data;
    const sub  = subRes.data;
    State.set('user', user);
    State.set('subscribe', sub);

    const usedUp   = sub?.u || 0;
    const usedDown = sub?.d || 0;
    const total    = sub?.transfer_enable || 0;
    const used     = usedUp + usedDown;
    const pct      = Utils.trafficPercent(used, total);
    const daysLeft = Utils.daysLeft(sub?.expired_at);
    const currency = Utils.currency();

    content.innerHTML = `
      <div class="page-header animate-slide-down">
        <h1 class="page-title">仪表盘</h1
>
        <p class="page-subtitle">欢迎回来，${Utils.escapeHtml(user.email)}</p>
      </div>

      <div class="dashboard-grid stagger">
        <div class="stat-card">
          <div class="flex items-center justify-between" style="margin-bottom:12px">
            <div class="stat-card-icon" style="background:var(--color-primary-bg);color:var(--color-primary)">
              <span class="iconify" data-icon="heroicons:signal" style="font-size:22px"></span>
            </div>
            <span class="badge ${pct>=90?'badge-danger':pct>=70?'badge-warning':'badge-success'}">${pct}%</span>
          </div>
          <div class="stat-card-value">${Utils.formatGB(total - used)}</div>
          <div class="stat-card-label">剩余流量</div>
          <div class="progress" style="margin-top:12px">
            <div class="progress-bar ${pct>=90?'danger':pct>=70?'warning':''}" style="width:${pct}%"></div>
          </div>
          <div class="flex justify-between text-xs text-muted" style="margin-top:6px">
            <span>已用 ${Utils.formatGB(used)}</span>
            <span>共 ${Utils.formatGB(total)}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between" style="margin-bottom:12px">
            <div class="stat-card-icon" style="background:var(--color-info-bg);color:var(--color-info)">
              <span class="iconify" data-icon="heroicons:calendar-days" style="font-size:22px"></span>
            </div>
            <span class="badge ${daysLeft<=7?'badge-danger':daysLeft<=30?'badge-warning':'badge-success'}">${daysLeft<=0?'已过期':daysLeft+'天'}</span>
          </div>
          <div class="stat-card-value">${sub?.expired_at ? Utils.formatDate(sub.expired_at) : '无限期'}</div>
          <div class="stat-card-label">订阅到期</div>
          <div style="margin-top:12px">
            <button class="btn btn-secondary btn-sm" onclick="Router.navigate('/plans')">续费套餐</button>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between" style="margin-bottom:12px">
            <div class="stat-card-icon" style="background:var(--color-success-bg);color:var(--color-success)">
              <span class="iconify" data-icon="heroicons:wallet" style="font-size:22px"></span>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="Router.navigate('/deposit')">充值</button>
          </div>
          <div class="stat-card-value">${currency}${Utils.formatMoney(user.balance)}</div>
          <div class="stat-card-label">账户余额</div>
          <div style="margin-top:8px">
            <span class="text-xs text-muted">佣金余额: ${currency}${Utils.formatMoney(user.commission_balance)}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between" style="margin-bottom:12px">
            <div class="stat-card-icon" style="background:var(--color-warning-bg);color:var(--color-warning)">
              <span class="iconify" data-icon="heroicons:user-group" style="font-size:22px"></span>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="Router.navigate('/invite')">推广</button>
          </div>
          <div class="stat-card-value">${user.invite_count || 0} 人</div>
          <div class="stat-card-label">邀请人数</div>
          <div style="margin-top:8px">
            <span class="text-xs text-muted">累计佣金: ${currency}${Utils.formatMoney(user.commission_balance)}</span>
          </div>
        </div>
      </div>

      <div class="dashboard-row stagger">
        <div class="card flex-1">
          <div class="card-header">
            <div>
              <div class="card-title">订阅信息</div>
              <div class="card-subtitle">${Utils.escapeHtml(sub?.plan?.name || '暂无套餐')}</div>
            </div>
            <div class="auto-renewal-toggle" title="自动续费">
              <span class="auto-renewal-label text-xs text-muted">自动续费</span>
              <button
                id="auto-renewal-btn"
                class="toggle-switch ${user?.auto_renewal ? 'on' : ''}"
                onclick="toggleAutoRenewal(this)"
                data-state="${user?.auto_renewal ? '1' : '0'}"
                title="${user?.auto_renewal ? '关闭自动续费' : '开启自动续费'}"
              >
                <span class="toggle-thumb"></span>
              </button>
            </div>
          </div>
          <input type="hidden" id="sub-url-input" value="${sub?.subscribe_url || ''}">
          <div class="sub-action-list" style="margin-top:var(--space-2)">
            <button class="sub-action-item" onclick="subCopyLink()">
              <span class="sub-action-icon" style="background:var(--color-primary-bg)">
                <span class="iconify" data-icon="heroicons:clipboard-document" style="color:var(--color-primary);font-size:18px"></span>
              </span>
              <span class="sub-action-label">复制订阅地址</span>
              <span class="sub-action-arrow">›</span>
            </button>
            <button class="sub-action-item" onclick="showSubQR($('#sub-url-input').value)">
              <span class="sub-action-icon" style="background:var(--color-info-bg)">
                <span class="iconify" data-icon="heroicons:qr-code" style="color:var(--color-info);font-size:18px"></span>
              </span>
              <span class="sub-action-label">扫描二维码订阅</span>
              <span class="sub-action-arrow">›</span>
            </button>
            ${getImportActions(sub?.subscribe_url || '')}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-1);margin-top:var(--space-2)">
            <div class="subscribe-stat-item">
              <div class="text-xs text-muted">上传</div>
              <div class="text-sm font-medium">${Utils.formatGB(sub?.u||0)}</div>
            </div>
            <div class="subscribe-stat-item">
              <div class="text-xs text-muted">下载</div>
              <div class="text-sm font-medium">${Utils.formatGB(sub?.d||0)}</div>
            </div>
            <div class="subscribe-stat-item">
              <div class="text-xs text-muted">设备限制</div>
              <div class="text-sm font-medium">${sub?.device_limit||'不限'}</div>
            </div>
          </div>
        </div>

        <div class="card" style="width:280px;min-width:240px">
          <div class="card-header"><div class="card-title">快捷操作</div></div>
          <div class="quick-actions">
            ${[
              { icon: 'heroicons:sparkles',    label: '购买订阅', route: '/plans',    bg: 'var(--color-primary-bg)',  color: 'var(--color-primary)' },
              { icon: 'heroicons:wallet',       label: '余额充值', route: '/deposit',  bg: 'var(--color-success-bg)', color: 'var(--color-success)' },
              { icon: 'heroicons:gift',         label: '礼品卡',   route: '/giftcard', bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
              { icon: 'heroicons:shopping-bag', label: '我的订单', route: '/orders',   bg: 'var(--color-info-bg)',    color: 'var(--color-info)' },
              { icon: 'heroicons:user-group',   label: '推广赚钱', route: '/invite',   bg: 'var(--color-danger-bg)',  color: 'var(--color-danger)' },
              { icon: 'heroicons:ticket',       label: '提交工单', route: '/tickets',  bg: 'var(--color-surface-2)',  color: 'var(--color-text-secondary)' },
            ].map(a => `
              <button class="quick-action-btn" onclick="Router.navigate('${a.route}')"
                style="--qa-bg:${a.bg};--qa-text:${a.color}">
                <span class="iconify quick-action-icon" data-icon="${a.icon}" style="font-size:22px"></span>
                <span class="quick-action-label">${a.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <div id="dash-notices"></div>
    `;

    loadDashboardNotices().then(() => scanIconify());
    scanIconify();

  } catch (e) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="lottie-empty" id="lottie-dash-err" style="width:120px;height:120px"></div>
        <div class="empty-state-title">加载失败</div>
        <div class="empty-state-desc">${Utils.escapeHtml(e.message)}</div>
        <button class="btn btn-primary" onclick="initDashboard()">重试</button>
      </div>`;
    initLottieEmpty('lottie-dash-err');
  }
}

async function loadDashboardNotices() {
  try {
    const res = await API.noticeList();
    const notices = res.data || [];
    if (!notices.length) return;
    const el = $('#dash-notices');
    if (!el) return;
    el.innerHTML = `
      <div class="card animate-slide-up" style="margin-top:var(--space-2)">
        <div class="card-header">
          <div class="card-title">
            <span class="iconify" data-icon="heroicons:megaphone" style="font-size:18px;vertical-align:-3px;margin-right:6px"></span>
            最新公告
          </div>
          <button class="btn btn-ghost btn-sm" onclick="Router.navigate('/notices')">查看全部</button>
        </div>
        <div class="notice-list">
          ${notices.slice(0, 3).map(n => `
            <div class="notice-item" onclick="Router.navigate('/notices')">
              <div class="notice-title">${Utils.escapeHtml(n.title)}</div>
              <div class="flex items-center gap-1">
                <span class="text-xs text-muted">${Utils.formatDate(n.created_at)}</span>
                <span class="nav-icon" style="width:14px;height:14px;color:var(--color-text-muted)">${ICONS.chevronRight}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;
  } catch (e) {
    console.error('[SLTE] loadDashboardNotices failed:', e.message);
  }
}

/* ── 自动续费开关 ── */
window.toggleAutoRenewal = async (btn) => {
  const current = btn.dataset.state === '1';
  const next = !current;
  btn.disabled = true;
  btn.classList.add('toggle-loading');
  try {
    await API.userUpdate({ auto_renewal: next ? 1 : 0 });
    btn.dataset.state = next ? '1' : '0';
    btn.classList.toggle('on', next);
    btn.title = next ? '关闭自动续费' : '开启自动续费';
    if (State.user) State.user.auto_renewal = next ? 1 : 0;
    Toast.success(next ? '已开启自动续费' : '已关闭自动续费');
  } catch (e) {
    Toast.error('操作失败：' + e.message);
  } finally {
    btn.disabled = false;
    btn.classList.remove('toggle-loading');
  }
};

/* ── Servers Page ── */
async function initServers() {
  updateActiveNav('/servers');
  const content = $('#content');
  content.innerHTML = `
    <div class="page-header animate-slide-down">
      <h1 class="page-title">节点状态</h1>
      <p class="page-subtitle">查看所有可用节点的实时状态</p>
    </div>
    <div id="servers-container">
      <div class="dashboard-grid">
        ${[1,2,3,4,5,6].map(()=>`<div class="stat-card"><div class="skeleton" style="height:80px;border-radius:8px"></div></div>`).join('')}
      </div>
    </div>`;

  try {
    const res = await API.serverList();
    const servers = res.data || [];
    if (!servers.length) {
      $('#servers-container').innerHTML = emptyState('lottie-servers', '暂无节点', '当前没有可用的节点');
      initLottieEmpty('lottie-servers');
      return;
    }
    $('#servers-container').innerHTML = `
      <div class="servers-grid stagger">
        ${servers.map(s => {
          const online  = s.online_user || 0;
          const load    = s.load || 0;
          const loadPct = Math.min(100, Math.round(load * 100));
          const statusColor = loadPct > 80 ? 'var(--color-danger)' : loadPct > 50 ? 'var(--color-warning)' : 'var(--color-success)';
          return `
            <div class="server-card">
              <div class="flex items-center justify-between" style="margin-bottom:10px">
                <div class="flex items-center gap-1">
                  <span class="dot" style="color:${statusColor}"></span>
                  <span class="text-sm font-medium truncate" style="max-width:140px">${Utils.escapeHtml(s.name)}</span>
                </div>
                <span class="badge ${loadPct>80?'badge-danger':loadPct>50?'badge-warning':'badge-success'}">${loadPct}%</span>
              </div>
              <div class="flex justify-between text-xs text-muted">
                <span>在线: ${online}</span>
                <span>${s.type?.toUpperCase() || 'V2'}</span>
              </div>
              <div class="progress" style="margin-top:8px;height:4px">
                <div class="progress-bar ${loadPct>80?'danger':loadPct>50?'warning':''}" style="width:${loadPct}%"></div>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  } catch (e) {
    console.error('[SLTE] initServers failed:', e.message);
  }
}

/* ── Traffic Page ── */
async function initTraffic() {
  updateActiveNav('/traffic');
  const content = $('#content');
  content.innerHTML = `
    <div class="page-header animate-slide-down">
      <h1 class="page-title">流量明细</h1>
      <p class="page-subtitle">查看近期流量使用记录</p>
    </div>
    <div id="traffic-container"><div class="skeleton" style="height:300px;border-radius:16px"></div></div>`;

  try {
    const res = await API.getTrafficLog();
    const logs = res.data || [];
    if (!logs.length) {
      $('#traffic-container').innerHTML = emptyState('lottie-traffic', '暂无流量记录', '近期没有流量使用记录');
      initLottieEmpty('lottie-traffic');
      return;
    }
    $('#traffic-container').innerHTML = `
      <div class="card stagger">
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>时间</th><th>上传</th><th>下载</th><th>合计</th></tr></thead>
            <tbody>
              ${logs.map(l => `
                <tr>
                  <td class="text-sm text-muted">${Utils.formatDate(l.record_at)}</td>
                  <td class="text-sm">${Utils.formatGB(l.u)}</td>
                  <td class="text-sm">${Utils.formatGB(l.d)}</td>
                  <td class="text-sm font-medium">${Utils.formatGB(l.u + l.d)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  } catch (e) {
    console.error('[SLTE] initTraffic failed:', e.message);
  }
}

/* ── 设备检测 ── */
function detectDevice() {
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua))                                    return 'android';
  if (/ipad/i.test(ua))                                       return 'ios';
  if (/iphone|ipod/i.test(ua))                                return 'ios';
  if (/macintosh|mac os x/i.test(ua) && !/windows/i.test(ua)) return 'mac';
  if (/windows/i.test(ua))                                    return 'windows';
  return 'other';
}

function getClientsByDevice(url) {
  const enc = encodeURIComponent(url);
  const device = detectDevice();

  const all = {
    hiddify:      { name: 'Hiddify',                  color: '#2563eb', bg: '#eff6ff',
                    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>`,
                    scheme: `hiddify://import/${enc}` },
    singbox:      { name: 'Sing-box',                 color: '#7c3aed', bg: '#f5f3ff',
                    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17.5h7M17.5 14v7"/></svg>`,
                    scheme: `sing-box://import-remote-profile?url=${enc}` },
    clashAndroid: { name: 'ClashMeta For Android',    color: '#059669', bg: '#ecfdf5',
                    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
                    scheme: `clash://install-config?url=${enc}` },
    surfboard:    { name: 'Surfboard',                color: '#0891b2', bg: '#ecfeff',
                    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
                    scheme: `surfboard://install-config?url=${enc}` },
    clashWindows: { name: 'ClashMeta',                color: '#059669', bg: '#ecfdf5',
                    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
                    scheme: `clash://install-config?url=${enc}` },
    shadowrocket: { name: 'Shadowrocket',             color: '#ef4444', bg: '#fef2f2',
                    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
                    scheme: `shadowrocket://add/sub://${btoa(url)}` },
    quantumultx:  { name: 'Quantumult X',             color: '#f59e0b', bg: '#fffbeb',
                    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
                    scheme: `quantumult-x:///update-remote-resource?remote-resource=${encodeURIComponent(JSON.stringify({subscriptions:[{url,tag:'SLTE'}]}))}` },
    surge:        { name: 'Surge',                    color: '#6366f1', bg: '#eef2ff',
                    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
                    scheme: `surge:///install-config?url=${enc}` },
    stash:        { name: 'Stash',                    color: '#8b5cf6', bg: '#f5f3ff',
                    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>`,
                    scheme: `stash://install-config?url=${enc}` },
  };

  if (device === 'android') return [all.hiddify, all.singbox, all.clashAndroid, all.surfboard];
  if (device === 'windows') return [all.hiddify, all.singbox, all.clashWindows];
  if (device === 'ios' || device === 'mac') return [all.hiddify, all.singbox, all.shadowrocket, all.quantumultx, all.surge, all.stash];
  return [all.hiddify, all.singbox, all.clashAndroid, all.clashWindows, all.shadowrocket, all.quantumultx, all.surge, all.stash, all.surfboard];
}

function getImportActions(url) {
  if (!url) return '';
  return getClientsByDevice(url).map(c => `
    <a href="${Utils.escapeHtml(c.scheme)}" class="sub-action-item" onclick="setTimeout(()=>{},100)">
      <span class="sub-action-icon" style="background:${c.bg}">
        <span style="color:${c.color};display:flex;align-items:center">${c.icon}</span>
      </span>
      <span class="sub-action-label">导入到 ${Utils.escapeHtml(c.name)}</span>
      <span class="sub-action-arrow">›</span>
    </a>
  `).join('');
}

window.subCopyLink = function() {
  const url = $('#sub-url-input')?.value;
  if (!url) return Toast.warning('暂无订阅链接');
  Utils.copy(url);
};

/* ── 订阅二维码弹窗 ── */
window.showSubQR = function(url) {
  if (!url) return Toast.warning('暂无订阅链接');

  let modal = $('#modal-sub-qr');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-sub-qr';
    modal.className = 'modal-overlay hidden';
    modal.innerHTML = `
      <div class="modal" style="max-width:360px">
        <div class="modal-header">
          <span class="modal-title">扫码导入订阅</span>
          <button class="icon-btn" onclick="Modal.close('modal-sub-qr')">${ICONS.close}</button>
        </div>
        <div class="modal-body" style="display:flex;flex-direction:column;align-items:center;gap:var(--space-2)">
          <div id="sub-qr-wrap" style="background:#fff;padding:12px;border-radius:var(--radius-md);border:1px solid var(--color-border-light)">
            <canvas id="sub-qr-canvas" width="220" height="220"></canvas>
          </div>
          <p class="text-sm text-muted" style="text-align:center">使用代理客户端扫描此二维码<br>即可一键导入订阅</p>
          <button class="btn btn-secondary btn-sm btn-full" onclick="subCopyLink()">
            <span class="iconify" data-icon="heroicons:clipboard-document" style="font-size:14px"></span>
            复制链接
          </button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) Modal.close('modal-sub-qr'); });
  }

  Modal.open('modal-sub-qr');

  const wrap = document.getElementById('sub-qr-wrap');
  if (typeof QRCode !== 'undefined') {
    try {
      wrap.innerHTML = '';
      new QRCode(wrap, {
        text: url, width: 220, height: 220,
        colorDark: '#000000', colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch (err) {
      console.error('[SLTE] QR generation failed:', err);
      wrap.innerHTML = '<canvas id="sub-qr-canvas" width="220" height="220"></canvas>';
      _drawQRFallback(document.getElementById('sub-qr-canvas'));
    }
  } else {
    wrap.innerHTML = '<canvas id="sub-qr-canvas" width="220" height="220"></canvas>';
    _drawQRFallback(document.getElementById('sub-qr-canvas'));
  }
};

function _drawQRFallback(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 220, 220);
  ctx.fillStyle = '#f5f6f8';
  ctx.fillRect(0, 0, 220, 220);
  ctx.fillStyle = '#8e9baa';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('二维码生成失败', 110, 100);
  ctx.fillText('请手动复制链接', 110, 120);
}

/* ── 夜色模式 ── */
const DARK_KEY = 'slte_dark';

function applyDarkMode(isDark) {
  if (!document.body.hasAttribute('data-dark-ready')) {
    document.body.setAttribute('data-dark-ready', '1');
  }
  if (isDark) {
    document.body.setAttribute('data-dark', '1');
  } else {
    document.body.removeAttribute('data-dark');
  }

  const iconEl = document.getElementById('dark-toggle-icon');
  if (iconEl) iconEl.innerHTML = isDark ? ICONS.sun : ICONS.moon;

  const btn = document.getElementById('dark-toggle-btn');
  if (btn) btn.setAttribute('aria-label', isDark ? '切换为日间模式' : '切换为夜色模式');

  const themeColor  = isDark ? '#1A1D27' : '#4A7C6F';
  const statusStyle = isDark ? 'black-translucent' : 'default';

  function refreshMeta(id, attrName, value) {
    var el = document.getElementById(id);
    if (!el) return;
    var parent = el.parentNode;
    var next = el.nextSibling;
    el.setAttribute(attrName, value);
    if (parent) { parent.removeChild(el); parent.insertBefore(el, next); }
  }

  refreshMeta('meta-theme-color', 'content', themeColor);
  refreshMeta('meta-status-bar',  'content', statusStyle);

  var t = document.title;
  document.title = t + '\u200b';
  requestAnimationFrame(function() { document.title = t; });
}

window.toggleDarkMode = function() {
  const isDark = document.body.getAttribute('data-dark') === '1';
  const next = !isDark;
  localStorage.setItem(DARK_KEY, next ? '1' : '0');
  applyDarkMode(next);
};

function initDarkMode() {
  const saved = localStorage.getItem(DARK_KEY);
  const prefersDark = saved !== null
    ? saved === '1'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyDarkMode(prefersDark);
  document.documentElement.removeAttribute('data-dark-init');

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (localStorage.getItem(DARK_KEY) === null) applyDarkMode(e.matches);
  });
}

initDarkMode();

/* ── Safe Area 适配 ── */
var _safeAreaInited = false;

function initSafeArea() {
  if (_safeAreaInited) return;
  _safeAreaInited = true;

  var probeTop = document.createElement('div');
  probeTop.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;pointer-events:none;opacity:0;z-index:-1;';
  document.body.appendChild(probeTop);

  var probeBottom = document.createElement('div');
  probeBottom.style.cssText = 'position:fixed;bottom:0;left:0;width:1px;height:1px;pointer-events:none;opacity:0;z-index:-1;';
  document.body.appendChild(probeBottom);

  function measure() {
    var rawTop    = Math.round(probeTop.getBoundingClientRect().top);
    var safeTop   = Math.max(0, Math.min(rawTop, 44));
    var rawBottom = 0;
    try { rawBottom = Math.round(window.innerHeight - probeBottom.getBoundingClientRect().bottom); } catch(e) { rawBottom = 0; }
    var safeBottom = Math.max(0, Math.min(rawBottom, 34));
    document.documentElement.style.setProperty('--safe-top',    safeTop    + 'px');
    document.documentElement.style.setProperty('--safe-bottom', safeBottom + 'px');
  }

  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('orientationchange', function() { setTimeout(measure, 300); });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', measure);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSafeArea);
} else {
  initSafeArea();
}
