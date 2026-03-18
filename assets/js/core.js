'use strict';

const BASE_URL  = (window.routerBase || '').replace(/\/$/, '');
const API_BASE  = BASE_URL + '/api/v1';
const SETTINGS  = window.settings || {};
const TOKEN_KEY = 'slte_token';

/* ── State ── */
const State = {
  user: null,
  subscribe: null,
  token: localStorage.getItem(TOKEN_KEY) || null,
  config: null,
  _listeners: {},

  set(key, val) {
    this[key] = val;
    (this._listeners[key] || []).forEach(fn => fn(val));
  },
  on(key, fn) {
    if (!this._listeners[key]) this._listeners[key] = [];
    if (!this._listeners[key].includes(fn)) this._listeners[key].push(fn);
  },
  off(key, fn) {
    if (!this._listeners[key]) return;
    this._listeners[key] = this._listeners[key].filter(f => f !== fn);
  }
};

/* ── HTTP Client ── */
const Http = {
  async request(method, path, data = null, opts = {}) {
    let url;
    if (path.startsWith('http')) {
      url = path;
    } else if (path.startsWith('/api/')) {
      url = BASE_URL + path;
    } else {
      url = API_BASE + (path.startsWith('/') ? path : '/' + path);
    }

    const headers = { 'Content-Type': 'application/json' };
    if (State.token) headers['Authorization'] = State.token;

    const config = { method, headers };
    if (data && method !== 'GET') config.body = JSON.stringify(data);
    if (data && method === 'GET') {
      const params = new URLSearchParams(data);
      const sep = url.includes('?') ? '&' : '?';
      return this.request(method, url + sep + params, null, opts);
    }

    try {
      const res  = await fetch(url, config);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || json.errors?.[0] || `HTTP ${res.status}`);
      return json;
    } catch (e) {
      if (!opts.silent) Toast.error(e.message || '请求失败');
      throw e;
    }
  },

  get(path, params, opts)  { return this.request('GET',    path, params, opts); },
  post(path, data, opts)   { return this.request('POST',   path, data,   opts); },
  put(path, data, opts)    { return this.request('PUT',    path, data,   opts); },
  delete(path, data, opts) { return this.request('DELETE', path, data,   opts); },
};

/* ── API ── */
const API = {
  login:            d => Http.post('/passport/auth/login', d),
  register:         d => Http.post('/passport/auth/register', d),
  forget:           d => Http.post('/passport/auth/forget', d),
  sendEmailCode:    d => Http.post('/passport/comm/sendEmailVerify', d),
  guestConfig: (() => {
    let _cache = null, _pending = null;
    return (opts) => {
      if (_cache)   return Promise.resolve(_cache);
      if (_pending) return _pending;
      _pending = Http.get('/guest/comm/config', null, opts || { silent: true })
        .then(r => { _cache = r; _pending = null; return r; })
        .catch(e => { _pending = null; throw e; });
      return _pending;
    };
  })(),

  userInfo:         ()=> Http.get('/user/info'),
  getSubscribe:     ()=> Http.get('/user/getSubscribe'),
  getStat:          ()=> Http.get('/user/getStat'),
  userUpdate:       d => Http.post('/user/update', d),
  changePassword:   d => Http.post('/user/changePassword', d),
  resetSecurity:    ()=> Http.get('/user/resetSecurity'),
  userConfig:       ()=> Http.get('/user/comm/config'),
  getTrafficLog:    ()=> Http.get('/user/stat/getTrafficLog'),
  getActiveSession: ()=> Http.get('/user/getActiveSession'),
  removeSession:    d => Http.post('/user/removeActiveSession', d),
  transfer:         d => Http.post('/user/transfer', d),
  newPeriod:        ()=> Http.post('/user/newPeriod'),
  redeemGiftcard:   d => Http.post('/user/redeemgiftcard', d),

  orderList:        d => Http.get('/user/order/fetch', d),
  orderDetail:      d => Http.get('/user/order/detail', d),
  orderSave:        d => Http.post('/user/order/save', d),
  orderCheckout:    d => Http.post('/user/order/checkout', d),
  orderCheck:       d => Http.get('/user/order/check', d),
  orderCancel:      d => Http.post('/user/order/cancel', d),
  paymentMethods:   ()=> Http.get('/user/order/getPaymentMethod'),

  planList:         ()=> Http.get('/user/plan/fetch'),
  serverList:       ()=> Http.get('/user/server/fetch'),

  inviteInfo:       ()=> Http.get('/user/invite/fetch'),
  inviteGen:        ()=> Http.get('/user/invite/save'),
  inviteDetails:    d => Http.get('/user/invite/details', d),

  ticketList:       d => Http.get('/user/ticket/fetch', d),
  ticketSave:       d => Http.post('/user/ticket/save', d),
  ticketReply:      d => Http.post('/user/ticket/reply', d),
  ticketClose:      d => Http.post('/user/ticket/close', d),
  ticketWithdraw:   d => Http.post('/user/ticket/withdraw', d),

  noticeList:       ()=> Http.get('/user/notice/fetch'),
  couponCheck:      d => Http.post('/user/coupon/check', d),
  knowledgeList:    d => Http.get('/user/knowledge/fetch', d),

  subscribeUrl:     token => `${BASE_URL}/api/v1/client/subscribe?token=${token}`,
};

/* ── Router ── */
const Router = {
  routes: {},
  current: null,

  register(path, handler) {
    this.routes[path] = handler;
  },

  async navigate(path, replace = false) {
    const url = '#' + path;
    if (replace) history.replaceState(null, '', url);
    else         history.pushState(null, '', url);
    await this._handle(path);
  },

  async _handle(path) {
    const [route, query] = path.split('?');
    const params = Object.fromEntries(new URLSearchParams(query || ''));

    const publicRoutes = ['/login', '/register', '/forget'];
    if (!State.token && !publicRoutes.includes(route)) {
      return this.navigate('/login', true);
    }
    if (State.token && publicRoutes.includes(route)) {
      return this.navigate('/dashboard', true);
    }

    this.current = route;
    const handler = this.routes[route] || this.routes['*'];
    if (handler) await handler(params);
  },

  init() {
    const initHash   = location.hash.slice(1) || (State.token ? '/dashboard' : '/login');
    const initRoute  = initHash.split('?')[0];
    const publicRoutes = ['/login', '/register', '/forget'];
    const app = document.getElementById('app');
    if (app) {
      if (publicRoutes.includes(initRoute) || !State.token) {
        app.classList.add('auth-mode');
        app.classList.remove('app-mode');
      }
    }
    window.addEventListener('popstate', () => {
      const hash = location.hash.slice(1) || '/dashboard';
      this._handle(hash);
    });
    this._handle(initHash);
  }
};

/* ── Toast ── */
const Toast = {
  container: null,
  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(msg, type = 'info', duration = 3000) {
    if (!this.container) this.init();
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const iconSpan = document.createElement('span');
    iconSpan.style.cssText = 'font-size:14px;font-weight:600';
    iconSpan.textContent = icons[type] || 'ℹ';
    const msgSpan = document.createElement('span');
    msgSpan.textContent = msg;
    el.appendChild(iconSpan);
    el.appendChild(msgSpan);
    this.container.appendChild(el);
    setTimeout(() => {
      el.style.animation = `toast-out 250ms var(--ease-in) forwards`;
      setTimeout(() => el.remove(), 260);
    }, duration);
  },
  success: (m, d) => Toast.show(m, 'success', d),
  error:   (m, d) => Toast.show(m, 'error', d || 4000),
  warning: (m, d) => Toast.show(m, 'warning', d),
  info:    (m, d) => Toast.show(m, 'info', d),
};

/* ── Modal ── */
const Modal = {
  _trapHandlers: new Map(),
  _prevFocus: null,

  open(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('hidden');
    this._prevFocus = document.activeElement;
    const focusable = this._getFocusable(el);
    if (focusable.length) setTimeout(() => focusable[0].focus(), 50);
    if (!this._trapHandlers.has(id)) {
      const handler = (e) => this._trapFocus(e, el);
      this._trapHandlers.set(id, handler);
      el.addEventListener('keydown', handler);
    }
  },

  close(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('hidden');
    const handler = this._trapHandlers.get(id);
    if (handler) { el.removeEventListener('keydown', handler); this._trapHandlers.delete(id); }
    if (this._prevFocus && typeof this._prevFocus.focus === 'function') {
      this._prevFocus.focus();
      this._prevFocus = null;
    }
  },

  _getFocusable(container) {
    return [...container.querySelectorAll(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )].filter(el => !el.closest('[hidden]') && !el.closest('.hidden'));
  },

  _trapFocus(e, container) {
    if (e.key !== 'Tab') return;
    const focusable = this._getFocusable(container);
    if (!focusable.length) { e.preventDefault(); return; }
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  },

  confirm(title, msg, onConfirm, opts = {}) {
    const id = 'modal-confirm';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      el.className = 'modal-overlay hidden';
      el.innerHTML = `
        <div class="modal" style="max-width:380px">
          <div class="modal-header">
            <span class="modal-title" id="mc-title"></span>
            <button class="icon-btn" onclick="Modal.close('${id}')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-body"><p id="mc-msg" class="text-secondary" style="line-height:1.7"></p></div>
          <div class="modal-footer">
            <button class="btn btn-ghost" onclick="Modal.close('${id}')">取消</button>
            <button class="btn btn-primary" id="mc-confirm">确认</button>
          </div>
        </div>`;
      document.body.appendChild(el);
    }
    el.querySelector('#mc-title').textContent = title;
    el.querySelector('#mc-msg').textContent = msg;
    const btn = el.querySelector('#mc-confirm');
    btn.className = `btn ${opts.danger ? 'btn-danger' : 'btn-primary'}`;
    btn.onclick = () => { Modal.close(id); onConfirm(); };
    Modal.open(id);
    el.addEventListener('click', e => { if (e.target === el) Modal.close(id); }, { once: true });
  }
};

/* ── Utils ── */
const Utils = {
  formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024, sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  formatGB(bytes) {
    if (!bytes) return '0 GB';
    return (bytes / 1073741824).toFixed(2) + ' GB';
  },
  formatMoney(fen) {
    if (fen == null) return '0.00';
    return (Math.round(Number(fen)) / 100).toFixed(2);
  },
  formatDate(ts) {
    if (!ts) return '—';
    const d = new Date(ts * 1000);
    return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  },
  formatDateTime(ts) {
    if (!ts) return '—';
    const d = new Date(ts * 1000);
    return d.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  },
  daysLeft(ts) {
    if (!ts) return 0;
    const diff = ts * 1000 - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  },
  copy(text) {
    navigator.clipboard?.writeText(text).then(() => Toast.success('已复制到剪贴板'))
      .catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        Toast.success('已复制到剪贴板');
      });
  },
  trafficPercent(used, total) {
    if (!total) return 0;
    return Math.min(100, Math.round((used / total) * 100));
  },
  periodLabel(p) {
    const map = {
      month_price: '月付', quarter_price: '季付',
      half_year_price: '半年付', year_price: '年付',
      two_year_price: '两年付', three_year_price: '三年付',
      onetime_price: '一次性', reset_price: '流量包', deposit: '余额充值'
    };
    return map[p] || p;
  },
  orderStatus(s) {
    const map = { 0: ['待支付', 'warning'], 1: ['开通中', 'info'], 2: ['已取消', 'neutral'], 3: ['已完成', 'success'], 4: ['已取消', 'neutral'] };
    return map[s] || ['未知', 'neutral'];
  },
  ticketStatus(s) {
    const map = { 0: ['待处理', 'warning'], 1: ['回复中', 'info'], 2: ['已关闭', 'neutral'] };
    return map[s] || ['未知', 'neutral'];
  },
  ticketLevel(l) {
    const map = { 1: ['低', 'neutral'], 2: ['中', 'warning'], 3: ['高', 'danger'] };
    return map[l] || ['低', 'neutral'];
  },
  serverType(t) {
    const map = { shadowsocks: 'SS', vmess: 'VMess', vless: 'VLESS', trojan: 'Trojan', hysteria: 'Hysteria', hysteria2: 'Hysteria2' };
    return map[t] || t;
  },
  currency() {
    return SETTINGS.currency_symbol || '¥';
  },
  skeletonRows(n = 3, height = 80) {
    return Array(n).fill(`<div class="skeleton" style="height:${height}px;border-radius:8px;margin-bottom:8px"></div>`).join('');
  },
  skeletonGrid(n = 3, height = 280) {
    return `<div class="dashboard-grid">${Array(n).fill(`<div class="stat-card"><div class="skeleton" style="height:${height}px;border-radius:12px"></div></div>`).join('')}</div>`;
  },
  escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },
  escapeAttr(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },
  debounce(fn, ms = 300) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  },
  addRipple(el) {
    el.classList.add('ripple');
    el.addEventListener('click', e => {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const wave = document.createElement('span');
      wave.className = 'ripple-wave';
      wave.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
      el.appendChild(wave);
      setTimeout(() => wave.remove(), 600);
    });
  },
  sanitizeHtml(html) {
    if (!html) return '';
    const allowedTags  = /^(p|br|strong|b|em|i|u|s|ul|ol|li|h[1-6]|blockquote|code|pre|a|img|hr|table|thead|tbody|tr|th|td|colgroup|col|caption|span|div|figure|figcaption|mark|del|ins|sub|sup)$/i;
    const allowedAttrs = /^(href|src|alt|title|class|target|rel|style|width|height|colspan|rowspan|align|valign|id|name|lang|dir)$/i;
    const div = document.createElement('div');
    div.innerHTML = html;
    function clean(node) {
      const toRemove = [];
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          if (!allowedTags.test(child.tagName)) {
            toRemove.push(child);
          } else {
            [...child.attributes].forEach(attr => {
              if (!allowedAttrs.test(attr.name)) {
                child.removeAttribute(attr.name);
              } else if (attr.name === 'href' || attr.name === 'src') {
                const val = attr.value.trim().toLowerCase();
                if (val.startsWith('javascript:') || val.startsWith('data:text')) {
                  child.removeAttribute(attr.name);
                }
              } else if (attr.name === 'style') {
                child.setAttribute('style', attr.value.replace(/expression\s*\(|javascript:|url\s*\(/gi, ''));
              }
            });
            if (child.tagName.toLowerCase() === 'a') {
              child.setAttribute('rel', 'noopener noreferrer');
              if (!child.getAttribute('target')) child.setAttribute('target', '_blank');
            }
            clean(child);
          }
        } else if (child.nodeType === Node.COMMENT_NODE) {
          toRemove.push(child);
        }
      });
      toRemove.forEach(n => node.removeChild(n));
    }
    clean(div);
    return div.innerHTML;
  }
};

/* ── DOM Helpers ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const html = (strings, ...vals) => strings.reduce((a, s, i) => a + s + (vals[i] != null ? vals[i] : ''), '');

function setHTML(sel, content) {
  const el = typeof sel === 'string' ? $(sel) : sel;
  if (el) el.innerHTML = content;
}

function showView(id) {
  $$('.view').forEach(v => v.classList.add('hidden'));
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
  const app = document.getElementById('app');
  if (!app) return;
  const authViews = ['view-login', 'view-register', 'view-forget'];
  if (authViews.includes(id)) {
    app.classList.add('auth-mode');
    app.classList.remove('app-mode');
  } else {
    app.classList.remove('auth-mode');
  }
}

function logout() {
  State.token = null;
  State.user  = null;
  localStorage.removeItem(TOKEN_KEY);
  location.replace(location.pathname + '?_t=' + Date.now() + '#/login');
}

async function loadUserData() {
  try {
    const [userRes, subRes] = await Promise.all([API.userInfo(), API.getSubscribe()]);
    State.set('user', userRes.data);
    State.set('subscribe', subRes.data);
  } catch (e) {
    if (e.message?.includes('401') || e.message?.includes('Unauthorized')) logout();
    else console.error('[SLTE] loadUserData failed:', e.message);
  }
}

window.addEventListener('error', e => {
  if (e.filename && !e.filename.includes(location.hostname)) return;
  console.error('[SLTE] Uncaught error:', e.message, e.filename, e.lineno);
});
window.addEventListener('unhandledrejection', e => {
  const msg = e.reason?.message || String(e.reason);
  if (msg.includes('401') || msg.includes('Unauthorized')) return;
  console.error('[SLTE] Unhandled rejection:', msg);
});

document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  const theme = SETTINGS.theme?.color;
  if (theme && theme !== 'default') document.documentElement.setAttribute('data-theme', theme);
  if (SETTINGS.background_url) {
    const bgUrl = SETTINGS.background_url.trim();
    if (/^https?:\/\//i.test(bgUrl)) {
      document.body.style.backgroundImage = `url(${CSS.escape ? JSON.stringify(bgUrl) : bgUrl})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
    }
  }
});
