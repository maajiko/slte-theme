/* ── Pages: Invite / Tickets / Knowledge / Profile ── */

/* ── Invite Page ── */
async function initInvite() {
  updateActiveNav('/invite');
  const content = $('#content');
  content.innerHTML = `
    <div class="page-header animate-slide-down">
      <h1 class="page-title">邀请推广</h1>
      <p class="page-subtitle">邀请好友，赚取佣金</p>
    </div>
    <div id="invite-container"><div class="skeleton" style="height:300px;border-radius:16px"></div></div>`;

  try {
    const res = await API.inviteInfo();
    const data = res.data;
    const currency = Utils.currency();
    const codes = data.codes || [];
    const stat = data.stat || {};
    const siteUrl = window.routerBase || location.origin;

    content.innerHTML = `
      <div class="page-header animate-slide-down">
        <h1 class="page-title">邀请推广</h1>
        <p class="page-subtitle">邀请好友，赚取佣金</p>
      </div>

      <div class="dashboard-grid stagger" style="margin-bottom:var(--space-2)">
        <div class="stat-card">
          <div class="stat-card-icon" style="background:var(--color-primary-bg);color:var(--color-primary)">
            <span class="iconify" data-icon="heroicons:user-group" style="font-size:22px"></span>
          </div>
          <div class="stat-card-value" style="margin-top:8px">${stat.register_count || 0}</div>
          <div class="stat-card-label">注册人数</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon" style="background:var(--color-success-bg);color:var(--color-success)">
            <span class="iconify" data-icon="heroicons:banknotes" style="font-size:22px"></span>
          </div>
          <div class="stat-card-value" style="margin-top:8px">${currency}${Utils.formatMoney(stat.commission_total || 0)}</div>
          <div class="stat-card-label">累计佣金</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon" style="background:var(--color-warning-bg);color:var(--color-warning)">
            <span class="iconify" data-icon="heroicons:clock" style="font-size:22px"></span>
          </div>
          <div class="stat-card-value" style="margin-top:8px">${currency}${Utils.formatMoney(stat.commission_pending_total || 0)}</div>
          <div class="stat-card-label">待结算佣金</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon" style="background:var(--color-info-bg);color:var(--color-info)">
            <span class="iconify" data-icon="heroicons:check-circle" style="font-size:22px"></span>
          </div>
          <div class="stat-card-value" style="margin-top:8px">${currency}${Utils.formatMoney(stat.commission_valid_total || 0)}</div>
          <div class="stat-card-label">可提现佣金</div>
        </div>
      </div>

      <div class="dashboard-row stagger">
        <div class="card flex-1">
          <div class="card-header">
            <div class="card-title">邀请码</div>
            <button class="btn btn-secondary btn-sm" onclick="genInviteCode()">生成新邀请码</button>
          </div>
          <div id="invite-codes">
            ${codes.length ? codes.map(code => {
              const inviteUrl = `${siteUrl}/#/register?invite_code=${code.code}`;
              return `
                <div class="invite-code-item">
                  <div class="invite-code-info">
                    <code class="invite-code-text">${code.code}</code>
                    <span class="text-xs text-muted">已使用 ${code.pv || 0} 次</span>
                  </div>
                  <div class="flex gap-1">
                    <button class="btn btn-ghost btn-sm"
                      data-code="${Utils.escapeAttr(code.code)}"
                      onclick="Utils.copy(this.dataset.code)">复制码</button>
                    <button class="btn btn-secondary btn-sm"
                      data-url="${Utils.escapeAttr(inviteUrl)}"
                      onclick="Utils.copy(this.dataset.url)">复制链接</button>
                  </div>
                </div>`;
            }).join('') : emptyState('lottie-invite-codes', '暂无邀请码', '点击生成邀请码开始推广', '生成邀请码', 'genInviteCode()')}
          </div>
        </div>

        <div class="card" style="width:300px;min-width:260px">
          <div class="card-header"><div class="card-title">佣金提取</div></div>
          <div class="text-sm text-muted" style="margin-bottom:var(--space-2)">
            可将佣金划转至账户余额，或申请提现
          </div>
          <div class="form-group">
            <label class="form-label">划转金额 (${currency})</label>
            <input class="form-input" id="transfer-amount" type="number" min="0.01" step="0.01" placeholder="输入划转金额">
          </div>
          <button class="btn btn-primary btn-full" style="margin-top:var(--space-1)" onclick="submitTransfer()">
            划转至余额
          </button>
          <div class="divider-text" style="margin:var(--space-2) 0"><span>或</span></div>
          <button class="btn btn-ghost btn-full" onclick="openWithdrawModal()">申请提现</button>
        </div>
      </div>

      <div class="card stagger" style="margin-top:var(--space-2)">
        <div class="card-header"><div class="card-title">佣金明细</div></div>
        <div id="commission-details">
          <div class="skeleton" style="height:120px;border-radius:8px"></div>
        </div>
      </div>`;

    loadCommissionDetails();
    scanIconify();
  } catch (e) {
    console.error('[SLTE] initInvite failed:', e.message);
  }
}

async function loadCommissionDetails() {
  try {
    const res = await API.inviteDetails({ current: 1, page_size: 20 });
    const items = res.data || [];
    const currency = Utils.currency();
    const el = $('#commission-details');
    if (!el) return;
    if (!items.length) {
      el.innerHTML = emptyState('lottie-commission', '暂无佣金记录', '邀请好友购买套餐后将产生佣金');
      initLottieEmpty('lottie-commission');
      return;
    }
    el.innerHTML = `
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>时间</th><th>订单金额</th><th>佣金</th><th>状态</th></tr></thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td class="text-sm text-muted">${Utils.formatDate(item.created_at)}</td>
                <td class="text-sm">${currency}${Utils.formatMoney(item.order_amount)}</td>
                <td class="text-sm text-success font-medium">+${currency}${Utils.formatMoney(item.get_amount)}</td>
                <td><span class="badge ${item.commission_status === 1 ? 'badge-success' : 'badge-warning'}">${item.commission_status === 1 ? '已结算' : '待结算'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  } catch (e) {
    console.error('[SLTE] loadCommissionDetails failed:', e.message);
  }
}

window.genInviteCode = async () => {
  try {
    await API.inviteGen();
    Toast.success('邀请码已生成');
    initInvite();
  } catch (e) {
    console.error('[SLTE] genInviteCode failed:', e.message);
  }
};

window.submitTransfer = async () => {
  const val = parseFloat($('#transfer-amount')?.value || 0);
  if (!val || val <= 0) return Toast.warning('请输入有效金额');
  const fen = Math.round(val * 100);
  try {
    await API.transfer({ transfer_amount: fen });
    Toast.success('划转成功！');
    await loadUserData();
    initInvite();
  } catch (e) {
    console.error('[SLTE] submitTransfer failed:', e.message);
  }
};

window.openWithdrawModal = () => {
  let modal = $('#modal-withdraw');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-withdraw';
    modal.className = 'modal-overlay hidden';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">申请提现</span>
          <button class="icon-btn" onclick="Modal.close('modal-withdraw')">${ICONS.close}</button>
        </div>
        <div class="modal-body">
          <div class="form-group" style="margin-bottom:var(--space-2)">
            <label class="form-label">提现方式</label>
            <select class="form-input" id="withdraw-method">
              <option value="alipay">支付宝</option>
              <option value="wechat">微信</option>
              <option value="bank">银行卡</option>
              <option value="usdt">USDT</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">账户信息</label>
            <input class="form-input" id="withdraw-account" placeholder="请输入提现账户">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="Modal.close('modal-withdraw')">取消</button>
          <button class="btn btn-primary" onclick="submitWithdraw()">提交申请</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) Modal.close('modal-withdraw'); });
  }
  Modal.open('modal-withdraw');
};

window.submitWithdraw = async () => {
  const method = $('#withdraw-method').value;
  const account = $('#withdraw-account').value.trim();
  if (!account) return Toast.warning('请输入提现账户');
  try {
    await API.ticketWithdraw({ withdraw_method: method, withdraw_account: account });
    Modal.close('modal-withdraw');
    Toast.success('提现申请已提交，请等待处理');
  } catch (e) {
    console.error('[SLTE] submitWithdraw failed:', e.message);
  }
};

/* ── Tickets Page ── */
async function initTickets() {
  updateActiveNav('/tickets');
  const content = $('#content');
  content.innerHTML = `
    <div class="page-header animate-slide-down">
      <h1 class="page-title">工单支持</h1>
      <p class="page-subtitle">遇到问题？提交工单获取帮助</p>
    </div>
    <div class="flex justify-end" style="margin-bottom:var(--space-2)">
      <button class="btn btn-primary" onclick="openNewTicketModal()">
        <span class="iconify" data-icon="heroicons:plus" style="font-size:16px"></span>
        新建工单
      </button>
    </div>
    <div id="tickets-container"><div class="skeleton" style="height:200px;border-radius:16px"></div></div>`;

  try {
    const res = await API.ticketList();
    const tickets = res.data || [];
    if (!tickets.length) {
      $('#tickets-container').innerHTML = emptyState('lottie-tickets', '暂无工单', '有问题可以提交工单联系我们', '新建工单', 'openNewTicketModal()');
      initLottieEmpty('lottie-tickets');
      return;
    }
    scanIconify();
    $('#tickets-container').innerHTML = `
      <div class="card stagger">
        <div class="tickets-list">
          ${tickets.map(t => {
            const [statusText, statusType] = Utils.ticketStatus(t.status);
            const [levelText, levelType] = Utils.ticketLevel(t.level);
            return `
              <div class="ticket-item" onclick="openTicketDetail(${t.id})">
                <div class="ticket-item-left">
                  <div class="ticket-subject">${Utils.escapeHtml(t.subject)}</div>
                  <div class="flex gap-1" style="margin-top:6px">
                    <span class="badge badge-${levelType}">优先级: ${levelText}</span>
                    <span class="text-xs text-muted">${Utils.formatDateTime(t.created_at)}</span>
                  </div>
                </div>
                <div class="ticket-item-right">
                  <span class="badge badge-${statusType}">${statusText}</span>
                  <span class="iconify" data-icon="heroicons:chevron-right" style="font-size:16px;color:var(--color-text-muted);margin-top:4px"></span>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>`;
  } catch (e) {
    console.error('[SLTE] initTickets failed:', e.message);
  }
}

window.openNewTicketModal = () => {
  let modal = $('#modal-new-ticket');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-new-ticket';
    modal.className = 'modal-overlay hidden';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">新建工单</span>
          <button class="icon-btn" onclick="Modal.close('modal-new-ticket')">${ICONS.close}</button>
        </div>
        <div class="modal-body">
          <div class="form-group" style="margin-bottom:var(--space-2)">
            <label class="form-label">主题</label>
            <input class="form-input" id="ticket-subject" placeholder="请简要描述问题">
          </div>
          <div class="form-group" style="margin-bottom:var(--space-2)">
            <label class="form-label">优先级</label>
            <select class="form-input" id="ticket-level">
              <option value="1">低</option>
              <option value="2" selected>中</option>
              <option value="3">高</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">详细描述</label>
            <textarea class="form-input" id="ticket-message" rows="5"
              placeholder="请详细描述您遇到的问题..." style="resize:vertical"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="Modal.close('modal-new-ticket')">取消</button>
          <button class="btn btn-primary" onclick="submitTicket()">提交工单</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) Modal.close('modal-new-ticket'); });
  }
  Modal.open('modal-new-ticket');
};

window.submitTicket = async () => {
  const subject = $('#ticket-subject').value.trim();
  const level   = parseInt($('#ticket-level').value);
  const message = $('#ticket-message').value.trim();
  if (!subject || !message) return Toast.warning('请填写完整信息');
  try {
    await API.ticketSave({ subject, level, message });
    Modal.close('modal-new-ticket');
    Toast.success('工单已提交');
    initTickets();
  } catch (e) {
    console.error('[SLTE] submitTicket failed:', e.message);
  }
};

window.openTicketDetail = async (id) => {
  let modal = $('#modal-ticket-detail');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-ticket-detail';
    modal.className = 'modal-overlay hidden';
    modal.innerHTML = `
      <div class="modal" style="max-width:600px;max-height:85vh">
        <div class="modal-header">
          <span class="modal-title" id="ticket-detail-title">工单详情</span>
          <button class="icon-btn" onclick="Modal.close('modal-ticket-detail')">${ICONS.close}</button>
        </div>
        <div class="modal-body" id="ticket-detail-body" style="overflow-y:auto;max-height:calc(85vh - 140px)"></div>
        <div class="modal-footer" id="ticket-detail-footer"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) Modal.close('modal-ticket-detail'); });
  }
  Modal.open('modal-ticket-detail');
  $('#ticket-detail-body').innerHTML = `<div class="skeleton" style="height:200px;border-radius:8px"></div>`;

  try {
    const res = await API.ticketList({ id });
    const ticket = res.data;
    const messages = ticket.message || [];
    $('#ticket-detail-title').textContent = ticket.subject;

    $('#ticket-detail-body').innerHTML = `
      <div class="ticket-messages">
        ${messages.map(msg => `
          <div class="ticket-msg ${msg.is_me ? 'ticket-msg-user' : 'ticket-msg-staff'}">
            <div class="ticket-msg-bubble">
              <div class="ticket-msg-text" style="white-space:pre-wrap">${Utils.escapeHtml(msg.message)}</div>
              <div class="ticket-msg-time text-xs text-muted">${Utils.formatDateTime(msg.created_at)}</div>
            </div>
          </div>
        `).join('')}
      </div>`;

    if (ticket.status !== 2) {
      $('#ticket-detail-footer').innerHTML = `
        <div class="flex gap-1 w-full">
          <input class="form-input flex-1" id="ticket-reply-input" placeholder="输入回复内容...">
          <button class="btn btn-primary" onclick="replyTicket(${id})">发送</button>
          <button class="btn btn-ghost" onclick="closeTicket(${id})">关闭工单</button>
        </div>`;
    } else {
      $('#ticket-detail-footer').innerHTML = `<span class="badge badge-neutral">工单已关闭</span>`;
    }
  } catch (e) {
    console.error('[SLTE] openTicketDetail failed:', e.message);
  }
};

window.replyTicket = async (id) => {
  const msg = $('#ticket-reply-input').value.trim();
  if (!msg) return;
  try {
    await API.ticketReply({ id, message: msg });
    Toast.success('回复已发送');
    openTicketDetail(id);
  } catch (e) {
    console.error('[SLTE] replyTicket failed:', e.message);
  }
};

window.closeTicket = (id) => {
  Modal.confirm('关闭工单', '确定要关闭该工单吗？', async () => {
    await API.ticketClose({ id });
    Toast.success('工单已关闭');
    Modal.close('modal-ticket-detail');
    initTickets();
  });
};

let _knowledgeReqId = 0;

async function initKnowledge() {
  updateActiveNav('/knowledge');
  const content = $('#content');
  content.innerHTML = `
    <div class="page-header animate-slide-down">
      <h1 class="page-title">使用教程</h1>
      <p class="page-subtitle">查看使用指南和常见问题</p>
    </div>
    <div class="form-input-group" style="margin-bottom:var(--space-2);max-width:400px">
      <span class="input-prefix">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>
      <input class="form-input has-prefix" id="knowledge-search"
        placeholder="搜索文章..." oninput="searchKnowledge(this.value)">
    </div>
    <div id="knowledge-container"><div class="skeleton" style="height:200px;border-radius:16px"></div></div>`;

  await loadKnowledge();
}

async function loadKnowledge(keyword = '') {
  const reqId = ++_knowledgeReqId;
  try {
    const res = await API.knowledgeList({ language: 'zh-CN', keyword });
    if (reqId !== _knowledgeReqId) return;
    const groups = res.data || {};
    const el = $('#knowledge-container');
    if (!el) return;

    const allItems = Object.values(groups).flat();
    if (!allItems.length) {
      el.innerHTML = emptyState('lottie-knowledge', '暂无文章', '知识库暂无内容');
      initLottieEmpty('lottie-knowledge');
      return;
    }

    el.innerHTML = `
      <div class="stagger">
        ${Object.entries(groups).map(([cat, items]) => `
          <div class="card" style="margin-bottom:var(--space-1)">
            <div class="card-header">
              <div class="card-title">
                <span class="iconify" data-icon="heroicons:folder"
                  style="font-size:18px;vertical-align:-3px;margin-right:6px;color:var(--color-primary)"></span>
                ${Utils.escapeHtml(cat || '未分类')}
              </div>
            </div>
            <div class="knowledge-list">
              ${items.map(item => `
                <div class="knowledge-item" onclick="openKnowledgeArticle(${item.id})">
                  <span class="iconify" data-icon="heroicons:document-text"
                    style="font-size:16px;color:var(--color-primary);flex-shrink:0"></span>
                  <span class="knowledge-item-title">${Utils.escapeHtml(item.title)}</span>
                  <span class="text-xs text-muted">${Utils.formatDate(item.updated_at)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>`;
    scanIconify();
  } catch (e) {
    console.error('[SLTE] loadKnowledge failed:', e.message);
  }
}

window.searchKnowledge = Utils.debounce((kw) => loadKnowledge(kw), 400);

window.openKnowledgeArticle = async (id) => {
  let modal = $('#modal-knowledge');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-knowledge';
    modal.className = 'modal-overlay hidden';
    modal.innerHTML = `
      <div class="modal" style="max-width:680px;max-height:88vh">
        <div class="modal-header">
          <span class="modal-title" id="knowledge-title">文章</span>
          <button class="icon-btn" onclick="Modal.close('modal-knowledge')">${ICONS.close}</button>
        </div>
        <div class="modal-body" id="knowledge-body"
          style="overflow-y:auto;max-height:calc(88vh - 80px)"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) Modal.close('modal-knowledge'); });
  }
  Modal.open('modal-knowledge');
  $('#knowledge-body').innerHTML = `<div class="skeleton" style="height:300px;border-radius:8px"></div>`;
  try {
    const res = await API.knowledgeList({ id });
    const article = res.data;
    $('#knowledge-title').textContent = article.title;
    $('#knowledge-body').innerHTML = `<div class="knowledge-article">${Utils.sanitizeHtml(article.body)}</div>`;
  } catch (e) {
    console.error('[SLTE] openKnowledgeArticle failed:', e.message);
  }
};

/* ── Profile Page ── */
async function initProfile() {
  updateActiveNav('/profile');
  const content = $('#content');
  const currency = Utils.currency();
  content.innerHTML = `
    <div class="page-header animate-slide-down">
      <h1 class="page-title">个人设置</h1>
      <p class="page-subtitle">管理您的账户信息和偏好设置</p>
    </div>
    <div class="profile-layout">
      ${[1,2,3].map(() => `<div class="card"><div class="skeleton" style="height:120px;border-radius:8px"></div></div>`).join('')}
    </div>`;

  try {
    const res = await API.userInfo();
    State.set('user', res.data);
  } catch (e) {
    console.error('[SLTE] initProfile userInfo failed:', e.message);
  }

  const user = State.user;

  content.innerHTML = `
    <div class="page-header animate-slide-down">
      <h1 class="page-title">个人设置</h1>
      <p class="page-subtitle">管理您的账户信息和偏好设置</p>
    </div>
    <div class="profile-layout stagger">
      <div class="card">
        <div class="card-header"><div class="card-title">账户信息</div></div>
        <div class="profile-avatar-section">
          <div class="profile-avatar">${(user?.email || 'U')[0].toUpperCase()}</div>
          <div>
            <div class="font-medium">${Utils.escapeHtml(user?.email || '—')}</div>
            <div class="text-sm text-muted">UID: ${user?.id || '—'}</div>
          </div>
        </div>
        <div class="profile-info-list">
          <div class="profile-info-row">
            <span class="profile-info-label">账户余额</span>
            <span class="profile-info-value font-medium">${currency}${Utils.formatMoney(user?.balance)}</span>
          </div>
          <div class="profile-info-row">
            <span class="profile-info-label">佣金余额</span>
            <span class="profile-info-value font-medium">${currency}${Utils.formatMoney(user?.commission_balance)}</span>
          </div>
          <div class="profile-info-row">
            <span class="profile-info-label">注册时间</span>
            <span class="profile-info-value">${Utils.formatDate(user?.created_at)}</span>
          </div>
          <div class="profile-info-row">
            <span class="profile-info-label">邀请人</span>
            <span class="profile-info-value">${Utils.escapeHtml(user?.invite_user?.email || '无')}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">安全设置</div></div>
        <div class="settings-list">
          <div class="settings-item">
            <div>
              <div class="settings-item-label">修改密码</div>
              <div class="settings-item-desc text-sm text-muted">定期更换密码保护账户安全</div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="openChangePasswordModal()">修改</button>
          </div>
          <div class="settings-item">
            <div>
              <div class="settings-item-label">重置订阅 Token</div>
              <div class="settings-item-desc text-sm text-muted">重置后旧的订阅链接将失效</div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="resetSecurity()">重置</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">通知设置</div></div>
        <div class="settings-list">
          <div class="settings-item">
            <div>
              <div class="settings-item-label">自动续费</div>
              <div class="settings-item-desc text-sm text-muted">到期前自动从余额扣款续费</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="toggle-auto-renewal"
                ${user?.auto_renewal ? 'checked' : ''}
                onchange="updateSetting('auto_renewal', this.checked ? 1 : 0)">
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
            </label>
          </div>
          <div class="settings-item">
            <div>
              <div class="settings-item-label">到期提醒</div>
              <div class="settings-item-desc text-sm text-muted">订阅即将到期时发送邮件提醒</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="toggle-remind-expire"
                ${user?.remind_expire ? 'checked' : ''}
                onchange="updateSetting('remind_expire', this.checked ? 1 : 0)">
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
            </label>
          </div>
          <div class="settings-item">
            <div>
              <div class="settings-item-label">流量提醒</div>
              <div class="settings-item-desc text-sm text-muted">流量即将用完时发送邮件提醒</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="toggle-remind-traffic"
                ${user?.remind_traffic ? 'checked' : ''}
                onchange="updateSetting('remind_traffic', this.checked ? 1 : 0)">
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
            </label>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">活跃会话</div>
          <button class="btn btn-ghost btn-sm" onclick="loadSessions()">刷新</button>
        </div>
        <div id="sessions-list"><div class="skeleton" style="height:80px;border-radius:8px"></div></div>
      </div>
    </div>`;

  loadSessions();
}

async function loadSessions() {
  try {
    const res = await API.getActiveSession();
    const sessions = res.data || [];
    const el = $('#sessions-list');
    if (!el) return;
    if (!sessions.length) {
      el.innerHTML = `<div class="text-sm text-muted" style="padding:var(--space-1)">暂无活跃会话</div>`;
      return;
    }
    el.innerHTML = sessions.map(s => `
      <div class="session-item">
        <div class="session-info">
          <div class="text-sm font-medium">${Utils.escapeHtml(s.ip || '未知 IP')}</div>
          <div class="text-xs text-muted">${Utils.escapeHtml(s.device_info || '未知设备')} · ${Utils.formatDateTime(s.last_activity)}</div>
        </div>
        <button class="btn btn-ghost btn-sm"
          data-session-id="${Utils.escapeAttr(String(s.id))}"
          onclick="removeSession(this.dataset.sessionId)">移除</button>
      </div>
    `).join('');
  } catch (e) {
    console.error('[SLTE] loadSessions failed:', e.message);
  }
}

window.removeSession = async (sessionId) => {
  try {
    await API.removeSession({ session_id: sessionId });
    Toast.success('会话已移除');
    loadSessions();
  } catch (e) {
    console.error('[SLTE] removeSession failed:', e.message);
  }
};

window.updateSetting = async (key, val) => {
  try {
    await API.userUpdate({ [key]: val });
    Toast.success('设置已保存');
    if (State.user) State.user[key] = val;
  } catch (e) {
    console.error('[SLTE] updateSetting failed:', e.message);
    const el = $(`#toggle-${key.replace(/_/g, '-')}`);
    if (el) el.checked = !el.checked;
  }
};

window.resetSecurity = () => {
  Modal.confirm('重置订阅 Token', '重置后所有订阅链接将失效，需要重新导入，确定继续？', async () => {
    await API.resetSecurity();
    Toast.success('Token 已重置，请重新获取订阅链接');
    await loadUserData();
    initProfile();
  }, { danger: true });
};

window.openChangePasswordModal = () => {
  let modal = $('#modal-change-pwd');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-change-pwd';
    modal.className = 'modal-overlay hidden';
    modal.innerHTML = `
      <div class="modal" style="max-width:400px">
        <div class="modal-header">
          <span class="modal-title">修改密码</span>
          <button class="icon-btn" onclick="Modal.close('modal-change-pwd')">${ICONS.close}</button>
        </div>
        <div class="modal-body">
          <div class="form-group" style="margin-bottom:var(--space-2)">
            <label class="form-label">当前密码</label>
            <input class="form-input" type="password" id="old-pwd" placeholder="请输入当前密码">
          </div>
          <div class="form-group" style="margin-bottom:var(--space-2)">
            <label class="form-label">新密码</label>
            <input class="form-input" type="password" id="new-pwd" placeholder="至少8位">
          </div>
          <div class="form-group">
            <label class="form-label">确认新密码</label>
            <input class="form-input" type="password" id="new-pwd2" placeholder="再次输入新密码">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="Modal.close('modal-change-pwd')">取消</button>
          <button class="btn btn-primary" onclick="submitChangePassword()">确认修改</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) Modal.close('modal-change-pwd'); });
  }
  Modal.open('modal-change-pwd');
};

window.submitChangePassword = async () => {
  const old_password  = $('#old-pwd').value;
  const new_password  = $('#new-pwd').value;
  const new_password2 = $('#new-pwd2').value;
  if (!old_password || !new_password) return Toast.warning('请填写完整信息');
  if (new_password !== new_password2) return Toast.warning('两次密码不一致');
  if (new_password.length < 8) return Toast.warning('新密码至少8位');
  try {
    await API.changePassword({ old_password, new_password });
    Modal.close('modal-change-pwd');
    Toast.success('密码修改成功，请重新登录');
    setTimeout(logout, 1500);
  } catch (e) {
    console.error('[SLTE] submitChangePassword failed:', e.message);
  }
};
