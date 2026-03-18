/* ── Pages: Plans / Orders / Deposit / Giftcard / Notices ── */

async function initPlans() {
  updateActiveNav('/plans');
  const content = $('#content');
  content.innerHTML = `
    <div class="page-header animate-slide-down">
      <h1 class="page-title">订阅套餐</h1>
      <p class="page-subtitle">选择适合您的套餐方案</p>
    </div>
    <div id="plans-container">
      <div class="dashboard-grid">
        ${[1,2,3].map(()=>`<div class="stat-card"><div class="skeleton" style="height:280px;border-radius:12px"></div></div>`).join('')}
      </div>
    </div>`;

  try {
    const res = await API.planList();
    const plans = (res.data || []).filter(p => p.show);
    const currency = Utils.currency();

    if (!plans.length) {
      $('#plans-container').innerHTML = emptyState('lottie-plans', '暂无可用套餐', '管理员尚未配置套餐，请稍后再试');
      initLottieEmpty('lottie-plans');
      return;
    }

    const periodGroups = [
      { key: 'month_price',      label: '月付',   cat: 'cycle' },
      { key: 'quarter_price',    label: '季付',   cat: 'cycle' },
      { key: 'half_year_price',  label: '半年付', cat: 'cycle' },
      { key: 'year_price',       label: '年付',   cat: 'cycle' },
      { key: 'two_year_price',   label: '两年付', cat: 'cycle' },
      { key: 'three_year_price', label: '三年付', cat: 'cycle' },
      { key: 'onetime_price',    label: '一次性', cat: 'cycle' },
      { key: 'reset_price',      label: '流量包', cat: 'traffic' },
    ];

    const availPeriods = periodGroups.filter(p => plans.some(plan => plan[p.key] != null));
    const hasCycle   = availPeriods.some(p => p.cat === 'cycle');
    const hasTraffic = availPeriods.some(p => p.cat === 'traffic');

    const catTabs = [
      { id: 'all',     label: '全部' },
      ...(hasCycle   ? [{ id: 'cycle',   label: '按周期' }] : []),
      ...(hasTraffic ? [{ id: 'traffic', label: '按流量' }] : []),
    ];

    let selectedCat    = 'all';
    let selectedPeriod = availPeriods[0]?.key || 'month_price';

    function getFilteredPeriods(cat) {
      if (cat === 'cycle')   return availPeriods.filter(p => p.cat === 'cycle');
      if (cat === 'traffic') return availPeriods.filter(p => p.cat === 'traffic');
      return availPeriods;
    }

    function renderPlans(period, cat) {
      const filteredPeriods = getFilteredPeriods(cat);
      if (!filteredPeriods.find(p => p.key === period)) {
        period = filteredPeriods[0]?.key || period;
      }
      return `
        <div class="plan-cat-tabs">
          ${catTabs.map(c => `
            <button class="plan-cat-tab ${c.id === cat ? 'active' : ''}"
              onclick="switchPlanCat('${c.id}')">${c.label}</button>
          `).join('')}
        </div>
        ${filteredPeriods.length > 1 ? `
        <div class="period-tabs">
          ${filteredPeriods.map(p => `
            <button class="period-tab ${p.key === period ? 'active' : ''}"
              onclick="switchPeriod('${p.key}')">${p.label}</button>
          `).join('')}
        </div>` : ''}
        <div class="plans-grid stagger">
          ${plans.map((plan, idx) => {
            const price = plan[period];
            if (price == null) return '';
            const planCat = (plan.reset_price != null && plan.month_price == null && plan.year_price == null) ? 'traffic' : 'cycle';
            if (cat !== 'all' && planCat !== cat) return '';
            const isPopular = idx === 1;
            return `
              <div class="plan-card ${isPopular ? 'plan-card-featured' : ''}">
                ${isPopular ? '<div class="plan-badge">推荐</div>' : ''}
                <div class="plan-name">${Utils.escapeHtml(plan.name)}</div>
                <div class="plan-price">
                  <span class="plan-currency">${currency}</span>
                  <span class="plan-amount">${Utils.formatMoney(price)}</span>
                  <span class="plan-period">/${periodGroups.find(p=>p.key===period)?.label||''}</span>
                </div>
                <div class="plan-features">
                  <div class="plan-feature">
                    <span class="iconify" data-icon="heroicons:signal" style="font-size:16px;flex-shrink:0"></span>
                    <span>${plan.transfer_enable ? plan.transfer_enable + ' GB' : '不限'} 流量</span>
                  </div>
                  <div class="plan-feature">
                    <span class="iconify" data-icon="heroicons:clock" style="font-size:16px;flex-shrink:0"></span>
                    <span>${period === 'onetime_price' ? '永久有效' : periodGroups.find(p=>p.key===period)?.label}</span>
                  </div>
                  ${plan.speed_limit ? `
                  <div class="plan-feature">
                    <span class="iconify" data-icon="heroicons:bolt" style="font-size:16px;flex-shrink:0"></span>
                    <span>限速 ${plan.speed_limit} Mbps</span>
                  </div>` : ''}
                  ${plan.device_limit ? `
                  <div class="plan-feature">
                    <span class="iconify" data-icon="heroicons:device-phone-mobile" style="font-size:16px;flex-shrink:0"></span>
                    <span>最多 ${plan.device_limit} 设备</span>
                  </div>` : ''}
                </div>
                ${plan.content ? `<div class="plan-desc text-sm text-muted" style="margin:12px 0;padding:12px;background:var(--color-surface-2);border-radius:8px">${Utils.escapeHtml(plan.content)}</div>` : ''}
                <button class="btn btn-full ${isPopular ? 'btn-primary' : 'btn-secondary'}" style="margin-top:auto"
                  data-plan-id="${plan.id}"
                  data-plan-name="${Utils.escapeHtml(plan.name)}"
                  data-period="${period}"
                  data-price="${price}"
                  data-currency="${currency}"
                  onclick="openOrderModal(
                    parseInt(this.dataset.planId),
                    this.dataset.planName,
                    this.dataset.period,
                    parseInt(this.dataset.price),
                    this.dataset.currency
                  )">
                  立即购买
                </button>
              </div>`;
          }).join('')}
        </div>`;
    }

    window.switchPeriod = (period) => {
      selectedPeriod = period;
      $('#plans-container').innerHTML = renderPlans(period, selectedCat);
      scanIconify();
    };

    window.switchPlanCat = (cat) => {
      selectedCat = cat;
      const fp = getFilteredPeriods(cat);
      if (!fp.find(p => p.key === selectedPeriod)) selectedPeriod = fp[0]?.key || selectedPeriod;
      $('#plans-container').innerHTML = renderPlans(selectedPeriod, cat);
      scanIconify();
    };

    $('#plans-container').innerHTML = renderPlans(selectedPeriod, selectedCat);
    scanIconify();
  } catch (e) {
    $('#plans-container').innerHTML = emptyState('lottie-plans-err', '加载失败', e.message, '重试', 'initPlans()');
    initLottieEmpty('lottie-plans-err');
  }
}

/* ── Order Modal ── */
let _orderData = {};
window.openOrderModal = async (planId, planName, period, price, currency) => {
  _orderData = { planId, planName, period, price, currency };

  let modal = $('#modal-order');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-order';
    modal.className = 'modal-overlay hidden';
    modal.innerHTML = `
      <div class="modal" style="max-width:520px">
        <div class="modal-header">
          <span class="modal-title">确认订单</span>
          <button class="icon-btn" onclick="Modal.close('modal-order')">${ICONS.close}</button>
        </div>
        <div class="modal-body" id="order-modal-body"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) Modal.close('modal-order'); });
  }

  Modal.open('modal-order');
  const body = $('#order-modal-body');
  body.innerHTML = `<div class="skeleton" style="height:200px;border-radius:8px"></div>`;

  try {
    const methods = (await API.paymentMethods()).data || [];

    body.innerHTML = `
      <div class="order-summary">
        <div class="order-summary-row">
          <span class="text-muted">套餐</span>
          <span class="font-medium">${Utils.escapeHtml(planName)}</span>
        </div>
        <div class="order-summary-row">
          <span class="text-muted">周期</span>
          <span class="font-medium">${Utils.periodLabel(period)}</span>
        </div>
        <div class="order-summary-row">
          <span class="text-muted">原价</span>
          <span class="font-medium">${currency}${Utils.formatMoney(price)}</span>
        </div>
      </div>

      <div class="form-group" style="margin:var(--space-2) 0">
        <label class="form-label">优惠券（可选）</label>
        <div class="flex gap-1">
          <input class="form-input" id="coupon-input" placeholder="输入优惠券码">
          <button class="btn btn-secondary" onclick="applyCoupon(${planId})">验证</button>
        </div>
        <div id="coupon-result" class="text-xs" style="margin-top:4px"></div>
      </div>

      <div class="form-group" style="margin-bottom:var(--space-2)">
        <label class="form-label">支付方式</label>
        <div class="payment-methods" id="payment-methods">
          ${methods.map((m, i) => `
            <label class="payment-method ${i===0?'selected':''}">
              <input type="radio" name="payment" value="${m.id}" ${i===0?'checked':''}
                onchange="selectPaymentMethod(this)">
              <span class="payment-icon"><span class="iconify" data-icon="heroicons:credit-card" style="font-size:18px"></span></span>
              <span class="payment-name">${Utils.escapeHtml(m.name)}</span>
            </label>
          `).join('')}
          <label class="payment-method" id="balance-pay-opt">
            <input type="radio" name="payment" value="0"
              onchange="selectPaymentMethod(this)">
            <span class="payment-icon"><span class="iconify" data-icon="heroicons:wallet" style="font-size:18px"></span></span>
            <span class="payment-name">余额支付 (${currency}${Utils.formatMoney(State.user?.balance)})</span>
          </label>
        </div>
      </div>

      <div class="order-total">
        <span class="text-muted">实付金额</span>
        <span class="order-total-amount" id="order-total">${currency}${Utils.formatMoney(price)}</span>
      </div>

      <button class="btn btn-primary btn-full btn-lg" style="margin-top:var(--space-2)" onclick="submitOrder()">
        <span class="btn-text">确认支付</span>
      </button>`;
    scanIconify();
  } catch (e) {
    console.error('[SLTE] openOrderModal failed:', e.message);
    Toast.error('加载支付方式失败，请重试');
  }
};

let _couponDiscount = 0;
window.applyCoupon = async (planId) => {
  const code = $('#coupon-input').value.trim();
  if (!code) return;
  const el = $('#coupon-result');
  el.textContent = '验证中...';
  try {
    const res = await API.couponCheck({ code, plan_id: planId });
    const c = res.data;
    _couponDiscount = c.type === 1 ? c.value : Math.round(_orderData.price * c.value / 100);
    const newTotal = Math.max(0, _orderData.price - _couponDiscount);
    el.className = 'text-xs text-success';
    el.textContent = `优惠券有效，减免 ${_orderData.currency}${Utils.formatMoney(_couponDiscount)}`;
    $('#order-total').textContent = `${_orderData.currency}${Utils.formatMoney(newTotal)}`;
    _orderData.couponCode = code;
  } catch (e) {
    el.className = 'text-xs text-danger';
    el.textContent = '✕ ' + (e.message || '优惠券无效');
    _couponDiscount = 0;
    _orderData.couponCode = null;
  }
};

window.submitOrder = async () => {
  const btn = $('#modal-order .btn-primary');
  const methodEl = $('input[name=payment]:checked');
  if (!methodEl) return Toast.warning('请选择支付方式');
  const method = parseInt(methodEl.value);

  btn.classList.add('btn-loading');
  try {
    const orderData = { plan_id: _orderData.planId, period: _orderData.period };
    if (_orderData.couponCode) orderData.coupon_code = _orderData.couponCode;
    const saveRes = await API.orderSave(orderData);
    const tradeNo = saveRes.data;

    if (method === 0) {
      await API.orderCheckout({ trade_no: tradeNo, method: 0 });
      Modal.close('modal-order');
      Toast.success('支付成功！');
      await loadUserData();
      Router.navigate('/orders');
    } else {
      const checkoutRes = await API.orderCheckout({ trade_no: tradeNo, method });
      Modal.close('modal-order');
      if (checkoutRes.data?.type === 'qrcode') {
        showPayQR(checkoutRes.data, tradeNo);
      } else if (checkoutRes.data?.type === 'redirect') {
        window.location.href = checkoutRes.data.data;
      } else {
        Router.navigate('/orders');
      }
    }
  } finally {
    btn.classList.remove('btn-loading');
  }
};

let _payQRTimer   = null;
let _payQRSession = 0;

function showPayQR(data, tradeNo) {
  if (_payQRTimer) { clearInterval(_payQRTimer); _payQRTimer = null; }

  let modal = $('#modal-payqr');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-payqr';
    modal.className = 'modal-overlay hidden';
    modal.innerHTML = `
      <div class="modal" style="max-width:360px;text-align:center">
        <div class="modal-header">
          <span class="modal-title">扫码支付</span>
          <button class="icon-btn" onclick="Modal.close('modal-payqr')">${ICONS.close}</button>
        </div>
        <div class="modal-body">
          <img id="qr-img" style="width:200px;height:200px;margin:0 auto;border-radius:8px;border:1px solid var(--color-border)">
          <p class="text-sm text-muted" style="margin-top:12px">请使用对应 App 扫码完成支付</p>
          <p class="text-xs text-muted" style="margin-top:4px" id="qr-countdown"></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary btn-full" id="qr-pay-btn">我已完成支付</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  const qrBtn   = document.getElementById('qr-pay-btn');
  const closeBtn = modal.querySelector('.icon-btn');
  function _stopQRTimer() { clearInterval(_payQRTimer); _payQRTimer = null; }

  qrBtn.onclick  = () => checkPayStatus(tradeNo);
  modal.onclick  = e => { if (e.target === modal) _stopQRTimer(); };
  if (closeBtn) closeBtn.onclick = () => { _stopQRTimer(); Modal.close('modal-payqr'); };

  $('#qr-img').src = data.data;
  Modal.open('modal-payqr');

  let checks = 0;
  const mySession = ++_payQRSession;
  _payQRTimer = setInterval(async () => {
    checks++;
    if (checks > 30) { _stopQRTimer(); return; }
    try {
      const r = await API.orderCheck({ trade_no: tradeNo }, { silent: true });
      if (mySession !== _payQRSession) return;
      if (r.data === 3) {
        _stopQRTimer();
        Modal.close('modal-payqr');
        Toast.success('支付成功！');
        Router.navigate('/orders');
      }
    } catch (e) {
      console.warn('[SLTE] payQR polling error:', e.message);
    }
  }, 3000);
}

window.checkPayStatus = async (tradeNo) => {
  try {
    const r = await API.orderCheck({ trade_no: tradeNo });
    if (r.data === 3) {
      Modal.close('modal-payqr');
      Toast.success('支付成功！');
      Router.navigate('/orders');
    } else {
      Toast.info('订单尚未支付，请完成支付后再试');
    }
  } catch (e) {
    console.error('[SLTE] checkPayStatus failed:', e.message);
  }
};

/* ── Orders Page ── */
async function initOrders() {
  updateActiveNav('/orders');
  const content = $('#content');
  content.innerHTML = `
    <div class="page-header animate-slide-down">
      <h1 class="page-title">我的订单</h1>
      <p class="page-subtitle">查看所有历史订单记录</p>
    </div>
    <div id="orders-container">
      <div class="skeleton" style="height:300px;border-radius:16px"></div>
    </div>`;

  try {
    const res = await API.orderList();
    const orders = res.data || [];
    const currency = Utils.currency();

    if (!orders.length) {
      $('#orders-container').innerHTML = emptyState(
        'lottie-orders', '暂无订单', '去购买套餐吧', '浏览套餐', "Router.navigate('/plans')"
      );
      initLottieEmpty('lottie-orders');
      return;
    }

    $('#orders-container').innerHTML = `
      <div class="card stagger">
        <div class="orders-list">
          ${orders.map(order => {
            const [statusText, statusType] = Utils.orderStatus(order.status);
            return `
              <div class="order-item" data-trade-no="${Utils.escapeHtml(order.trade_no)}"
                   onclick="openOrderDetail(this.dataset.tradeNo)" style="cursor:pointer">
                <div class="order-item-left">
                  <div class="order-plan-name">${Utils.escapeHtml(order.plan?.name || (order.period === 'deposit' ? '余额充值' : '套餐'))}</div>
                  <div class="order-meta">
                    <span class="text-xs text-muted">${Utils.periodLabel(order.period)}</span>
                    <span class="text-xs text-muted">·</span>
                    <span class="text-xs text-muted">${Utils.formatDateTime(order.created_at)}</span>
                  </div>
                  <div class="order-trade-no text-xs font-mono text-muted" style="margin-top:2px">${Utils.escapeHtml(order.trade_no)}</div>
                </div>
                <div class="order-item-right">
                  <div class="order-amount">${currency}${Utils.formatMoney(order.total_amount)}</div>
                  <span class="badge badge-${statusType}">${statusText}</span>
                  ${order.status === 0 ? `
                    <div class="flex gap-1" style="margin-top:6px" onclick="event.stopPropagation()">
                      <button class="btn btn-primary btn-sm"
                        data-trade-no="${Utils.escapeHtml(order.trade_no)}"
                        onclick="continueOrder(this.dataset.tradeNo)">继续支付</button>
                      <button class="btn btn-ghost btn-sm"
                        data-trade-no="${Utils.escapeHtml(order.trade_no)}"
                        onclick="cancelOrder(this.dataset.tradeNo)">取消</button>
                    </div>` : ''}
                  <span class="iconify" data-icon="heroicons:chevron-right" style="font-size:16px;color:var(--color-text-muted);margin-top:4px"></span>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>`;
    scanIconify();
  } catch (e) {
    $('#orders-container').innerHTML = emptyState('lottie-orders-err', '加载失败', e.message, '重试', 'initOrders()');
    initLottieEmpty('lottie-orders-err');
  }
}

/* ── Order Detail ── */
window.openOrderDetail = async (tradeNo) => {
  const content = $('#content');
  content.innerHTML = `
    <div class="page-header animate-slide-down">
      <button class="btn btn-ghost btn-sm" onclick="initOrders()" style="margin-bottom:8px">
        <span class="iconify" data-icon="heroicons:arrow-left" style="font-size:16px;vertical-align:-2px;margin-right:4px"></span>
        返回订单
      </button>
      <h1 class="page-title">订单详情</h1>
    </div>
    <div id="order-detail-container">
      <div class="skeleton" style="height:400px;border-radius:16px"></div>
    </div>`;
  scanIconify();

  try {
    const res = await API.orderDetail({ trade_no: tradeNo });
    const order = res.data;
    const currency = Utils.currency();
    const [statusText, statusType] = Utils.orderStatus(order.status);

    const detailRows = [
      { label: '订单号',   value: `<span class="font-mono text-sm">${Utils.escapeHtml(order.trade_no)}</span>` },
      { label: '套餐名称', value: Utils.escapeHtml(order.plan?.name || (order.period === 'deposit' ? '余额充值' : '套餐')) },
      { label: '订阅周期', value: Utils.periodLabel(order.period) },
      { label: '原价',     value: `${currency}${Utils.formatMoney(order.total_amount)}` },
      { label: '优惠金额', value: order.discount_amount ? `-${currency}${Utils.formatMoney(order.discount_amount)}` : '无', valueClass: order.discount_amount ? 'text-success' : '' },
      { label: '实付金额', value: `<span class="font-medium text-lg">${currency}${Utils.formatMoney(order.total_amount - (order.discount_amount||0))}</span>` },
      { label: '支付方式', value: order.payment_id ? '第三方支付' : '余额支付' },
      { label: '订单状态', value: `<span class="badge badge-${statusType}">${statusText}</span>` },
      { label: '创建时间', value: Utils.formatDateTime(order.created_at) },
      ...(order.updated_at ? [{ label: '更新时间', value: Utils.formatDateTime(order.updated_at) }] : []),
    ];

    $('#order-detail-container').innerHTML = `
      <div class="card stagger" style="max-width:600px">
        <div class="order-detail-hero">
          <div class="order-detail-status-icon order-status-${statusType}">
            <span class="iconify" data-icon="${
              order.status === 3 ? 'heroicons:check-circle' :
              order.status === 0 ? 'heroicons:clock' :
              order.status === 4 ? 'heroicons:x-circle' :
              'heroicons:information-circle'
            }" style="font-size:40px"></span>
          </div>
          <div class="order-detail-status-text">${statusText}</div>
          <div class="order-detail-amount">${currency}${Utils.formatMoney(order.total_amount - (order.discount_amount||0))}</div>
          <div class="text-sm text-muted">${Utils.escapeHtml(order.plan?.name || '余额充值')} · ${Utils.periodLabel(order.period)}</div>
        </div>
        <div class="order-detail-rows">
          ${detailRows.map(r => `
            <div class="order-detail-row">
              <span class="order-detail-label text-muted">${r.label}</span>
              <span class="order-detail-value ${r.valueClass||''}">${r.value}</span>
            </div>
          `).join('')}
        </div>
        <div class="order-detail-actions">
          ${order.status === 0 ? `
            <button class="btn btn-primary btn-full"
              data-trade-no="${Utils.escapeHtml(order.trade_no)}"
              onclick="continueOrder(this.dataset.tradeNo)">继续支付</button>
            <button class="btn btn-ghost btn-full" style="margin-top:8px"
              data-trade-no="${Utils.escapeHtml(order.trade_no)}"
              onclick="cancelOrder(this.dataset.tradeNo)">取消订单</button>
          ` : ''}
          ${order.status === 3 ? `
            <button class="btn btn-secondary btn-full" onclick="Router.navigate('/plans')">续费套餐</button>
          ` : ''}
          <button class="btn btn-ghost btn-full" style="margin-top:8px" onclick="initOrders()">返回订单列表</button>
        </div>
      </div>`;
    scanIconify();
  } catch (e) {
    $('#order-detail-container').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-title">加载失败</div>
        <div class="empty-state-desc">${Utils.escapeHtml(e.message)}</div>
        <button class="btn btn-primary" onclick="initOrders()">返回列表</button>
      </div>`;
  }
};

window.cancelOrder = (tradeNo) => {
  Modal.confirm('取消订单', '确定要取消该订单吗？', async () => {
    await API.orderCancel({ trade_no: tradeNo });
    Toast.success('订单已取消');
    initOrders();
  }, { danger: true });
};

window.continueOrder = async (tradeNo) => {
  try {
    const methods = (await API.paymentMethods()).data || [];
    const balanceOpt = `
      <label class="payment-method" style="margin-bottom:8px">
        <input type="radio" name="pay-method" value="0" checked>
        <span class="payment-icon"><span class="iconify" data-icon="heroicons:wallet" style="font-size:18px"></span></span>
        <span class="payment-name">余额支付 (${Utils.currency()}${Utils.formatMoney(State.user?.balance)})</span>
      </label>`;
    const methodsHtml = methods.map(m => `
      <label class="payment-method" style="margin-bottom:8px">
        <input type="radio" name="pay-method" value="${m.id}">
        <span class="payment-icon"><span class="iconify" data-icon="heroicons:credit-card" style="font-size:18px"></span></span>
        <span class="payment-name">${Utils.escapeHtml(m.name)}</span>
      </label>`).join('');

    Modal.confirm('选择支付方式', '', async () => {
      try {
        const sel = document.querySelector('input[name="pay-method"]:checked');
        const payId = sel ? sel.value : '0';
        const res = await API.orderCheckout({ trade_no: tradeNo, method: payId === '0' ? undefined : parseInt(payId) }).catch(() => null);
        if (!res) return;
        if (res.data?.type === 'qrcode') {
          Modal.close('modal-confirm');
          showPayQR(res.data, tradeNo);
        } else if (res.data?.type === 'redirect') {
          window.location.href = res.data.data;
        } else {
          Toast.success('支付成功！');
          initOrders();
        }
      } catch (e) {
        Toast.error(e.message || '操作失败');
      }
    }, {});

    const mc = document.getElementById('modal-confirm');
    if (mc) {
      mc.querySelector('#mc-msg').innerHTML = `<div class="payment-methods" style="margin-top:8px">${balanceOpt}${methodsHtml}</div>`;
      mc.querySelectorAll('input[name="pay-method"]').forEach(r => {
        r.addEventListener('change', () => {
          mc.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
          r.closest('.payment-method').classList.add('selected');
        });
      });
      mc.querySelector('.payment-method')?.classList.add('selected');
      scanIconify();
    }
  } catch (e) {
    console.error('[SLTE] continueOrder failed:', e.message);
    Toast.error('操作失败：' + e.message);
  }
};

/* ── Deposit Page ── */
async function initDeposit() {
  updateActiveNav('/deposit');
  const content = $('#content');
  const currency = Utils.currency();

  content.innerHTML = `
    <div class="page-header animate-slide-down">
      <h1 class="page-title">余额充值</h1>
      <p class="page-subtitle">充值余额用于购买套餐或自动续费</p>
    </div>
    <div class="deposit-layout stagger">
      <div class="card flex-1">
        <div class="card-header"><div class="card-title">选择充值金额</div></div>
        <div id="deposit-bonuses" style="margin-bottom:var(--space-2)"></div>
        <div class="deposit-presets" id="deposit-presets">
          ${[10, 30, 50, 100, 200, 500].map(v => `
            <button class="deposit-preset" onclick="selectDepositAmount(${v * 100})">${currency}${v}</button>
          `).join('')}
        </div>
        <div class="form-group" style="margin-top:var(--space-2)">
          <label class="form-label">自定义金额</label>
          <div class="form-input-group">
            <span class="input-prefix" style="left:12px;font-weight:500;color:var(--color-text-secondary)">${currency}</span>
            <input class="form-input has-prefix" id="deposit-amount" type="number" min="1"
              placeholder="输入充值金额" oninput="updateDepositPreview()">
          </div>
        </div>
        <div id="deposit-bonus-hint" class="text-sm" style="margin-top:8px;color:var(--color-success)"></div>
      </div>

      <div class="card" style="width:320px;min-width:280px">
        <div class="card-header"><div class="card-title">支付方式</div></div>
        <div id="deposit-methods" class="payment-methods">
          <div class="skeleton" style="height:120px;border-radius:8px"></div>
        </div>
        <div class="order-total" style="margin-top:var(--space-2)">
          <span class="text-muted">充值金额</span>
          <span class="order-total-amount" id="deposit-total">${currency}0.00</span>
        </div>
        <div id="deposit-bonus-total" class="flex justify-between text-sm" style="margin-top:4px;display:none">
          <span class="text-success">赠送金额</span>
          <span class="text-success font-medium" id="deposit-bonus-val">+${currency}0.00</span>
        </div>
        <button class="btn btn-primary btn-full btn-lg" id="submit-deposit-btn"
          style="margin-top:var(--space-2)" onclick="submitDeposit()">
          <span class="btn-text">立即充值</span>
        </button>
      </div>
    </div>`;

  scanIconify();
  try {
    const [methodsRes, configRes] = await Promise.all([
      API.paymentMethods(),
      Http.get('/api/v1/guest/comm/config', null, { silent: true }).catch(() => ({ data: {} }))
    ]);
    const methods = methodsRes.data || [];
    const bonuses = configRes?.data?.deposit_bonus || configRes?.data?.deposit_bounus || [];

    const methodsEl = $('#deposit-methods');
    methodsEl.innerHTML = methods.length
      ? methods.map((m, i) => `
          <label class="payment-method ${i===0?'selected':''}">
            <input type="radio" name="deposit-payment" value="${m.id}" ${i===0?'checked':''}
              onchange="selectPaymentMethod(this)">
            <span class="payment-icon"><span class="iconify" data-icon="heroicons:credit-card" style="font-size:18px"></span></span>
            <span class="payment-name">${Utils.escapeHtml(m.name)}</span>
          </label>
        `).join('')
      : '<p class="text-muted text-sm">暂无可用支付方式</p>';

    if (bonuses && bonuses.length) {
      $('#deposit-bonuses').innerHTML = `
        <div class="bonus-tiers">
          <div class="text-sm font-medium" style="margin-bottom:8px">
            <span class="iconify" data-icon="heroicons:gift" style="font-size:16px;vertical-align:-2px;margin-right:4px"></span>
            充值赠送活动
          </div>
          <div class="bonus-list">
            ${bonuses.map(b => `
              <div class="bonus-item">
                <span>充 ${currency}${Utils.formatMoney(b.deposit)}</span>
                <span class="text-success font-medium">赠 ${currency}${Utils.formatMoney(b.give)}</span>
              </div>
            `).join('')}
          </div>
        </div>`;
      window._depositBonuses = bonuses;
    }
    scanIconify();
  } catch (e) {
    console.error('[SLTE] initDeposit failed:', e.message);
  }
}

window._depositBonuses = [];
window._depositAmount  = 0;

window.selectDepositAmount = (fen) => {
  window._depositAmount = fen;
  $('#deposit-amount').value = (fen / 100).toFixed(0);
  $$('.deposit-preset').forEach(el => {
    el.classList.toggle('active', parseInt(el.textContent.replace(/[^\d]/g,'')) * 100 === fen);
  });
  updateDepositPreview();
};

window.updateDepositPreview = () => {
  const rawVal = parseFloat($('#deposit-amount')?.value || 0);
  const val    = isNaN(rawVal) ? 0 : Math.max(0, parseFloat(rawVal.toFixed(2)));
  const fen    = Math.round(val * 100);
  window._depositAmount = fen;
  const currency = Utils.currency();
  const totalEl = $('#deposit-total');
  if (totalEl) totalEl.textContent = `${currency}${Utils.formatMoney(fen)}`;

  const bonuses  = window._depositBonuses || [];
  const bonus    = bonuses.filter(b => fen >= b.deposit).sort((a,b) => b.deposit - a.deposit)[0];
  const hintEl   = $('#deposit-bonus-hint');
  const bonusTotalEl = $('#deposit-bonus-total');
  const bonusValEl   = $('#deposit-bonus-val');
  if (bonus && hintEl) {
    hintEl.innerHTML = `<span class="iconify" data-icon="heroicons:gift" style="font-size:15px;vertical-align:-2px;margin-right:4px"></span>达到赠送条件，额外赠送 ${currency}${Utils.formatMoney(bonus.give)}`;
    if (bonusTotalEl) bonusTotalEl.style.display = 'flex';
    if (bonusValEl)   bonusValEl.textContent = `+${currency}${Utils.formatMoney(bonus.give)}`;
    scanIconify();
  } else {
    if (hintEl)        hintEl.textContent = '';
    if (bonusTotalEl)  bonusTotalEl.style.display = 'none';
  }
};

window.submitDeposit = async () => {
  const amount = window._depositAmount;
  if (!amount || amount <= 0) return Toast.warning('请输入充值金额');
  const methodEl = $('input[name=deposit-payment]:checked');
  if (!methodEl) return Toast.warning('请选择支付方式');
  const method = parseInt(methodEl.value);

  const btn = $('#submit-deposit-btn');
  if (!btn) return;
  btn.classList.add('btn-loading');
  try {
    const saveRes = await API.orderSave({ plan_id: 0, period: 'deposit', deposit_amount: amount });
    const tradeNo = saveRes.data;
    const checkoutRes = await API.orderCheckout({ trade_no: tradeNo, method });
    if (checkoutRes.data?.type === 'qrcode') {
      showPayQR(checkoutRes.data, tradeNo);
    } else if (checkoutRes.data?.type === 'redirect') {
      window.location.href = checkoutRes.data.data;
    } else {
      Toast.success('充值成功！');
      await loadUserData();
      Router.navigate('/dashboard');
    }
  } finally {
    btn.classList.remove('btn-loading');
  }
};

/* ── Giftcard Page ── */
async function initGiftcard() {
  updateActiveNav('/giftcard');
  const content = $('#content');
  content.innerHTML = `
    <div class="page-header animate-slide-down">
      <h1 class="page-title">礼品卡兑换</h1>
      <p class="page-subtitle">输入礼品卡卡密，立即兑换权益</p>
    </div>
    <div class="giftcard-layout stagger">
      <div class="card" style="max-width:520px;margin:0 auto;width:100%">
        <div class="giftcard-hero">
          <div class="giftcard-icon">
            <span class="iconify" data-icon="heroicons:gift" style="font-size:48px"></span>
          </div>
          <div class="giftcard-title">礼品卡兑换</div>
          <div class="giftcard-desc text-muted text-sm">支持余额、时长、流量、套餐等多种类型</div>
        </div>
        <div class="form-group" style="margin-top:var(--space-3)">
          <label class="form-label">礼品卡卡密</label>
          <input class="form-input" id="giftcard-input"
            placeholder="请输入礼品卡卡密" maxlength="32"
            style="font-family:var(--font-mono);letter-spacing:2px;font-size:16px;text-align:center"
            oninput="formatGiftcardInput(this)">
        </div>
        <button class="btn btn-primary btn-full btn-lg" style="margin-top:var(--space-2)" onclick="redeemGiftcard()">
          <span class="btn-text">立即兑换</span>
        </button>
        <div class="giftcard-types" style="margin-top:var(--space-3)">
          <div class="text-sm font-medium text-muted" style="margin-bottom:12px;text-align:center">礼品卡类型说明</div>
          <div class="giftcard-type-grid">
            ${[
              { icon: 'heroicons:wallet',       name: '余额卡', desc: '充入账户余额' },
              { icon: 'heroicons:clock',         name: '时长卡', desc: '延长订阅有效期' },
              { icon: 'heroicons:signal',        name: '流量卡', desc: '增加可用流量' },
              { icon: 'heroicons:arrow-path',    name: '重置卡', desc: '重置已用流量' },
              { icon: 'heroicons:cube',          name: '套餐卡', desc: '兑换指定套餐' },
            ].map(t => `
              <div class="giftcard-type-item">
                <span class="giftcard-type-icon"><span class="iconify" data-icon="${t.icon}" style="font-size:22px"></span></span>
                <span class="giftcard-type-name text-sm font-medium">${t.name}</span>
                <span class="giftcard-type-desc text-xs text-muted">${t.desc}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>`;
  scanIconify();
}

window.formatGiftcardInput = (el) => {
  el.value = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

window.redeemGiftcard = async () => {
  const code = $('#giftcard-input').value.trim();
  if (!code) return Toast.warning('请输入礼品卡卡密');
  const btn = document.querySelector('#content .btn-primary');
  btn.classList.add('btn-loading');
  try {
    const res = await API.redeemGiftcard({ giftcard: code });
    const currency = Utils.currency();
    let msg = '兑换成功！';
    if (res.data?.type === 1)      msg = `兑换成功！余额增加 ${currency}${Utils.formatMoney(res.data.value)}`;
    else if (res.data?.type === 2) msg = `兑换成功！订阅延长 ${res.data.value} 天`;
    else if (res.data?.type === 3) msg = `兑换成功！流量增加 ${res.data.value} GB`;
    else if (res.data?.type === 4) msg = '兑换成功！流量已重置';
    else if (res.data?.type === 5) msg = res.data.value ? `兑换成功！已获得套餐：${Utils.escapeHtml(res.data.value)}` : '兑换成功！已获得套餐';
    Toast.success(msg, 5000);
    $('#giftcard-input').value = '';
    await loadUserData();
  } finally {
    btn.classList.remove('btn-loading');
  }
};

/* ── Notices Page ── */
async function initNotices() {
  updateActiveNav('/notices');
  const content = $('#content');
  content.innerHTML = `
    <div class="page-header animate-slide-down">
      <h1 class="page-title">系统公告</h1>
      <p class="page-subtitle">查看最新系统通知</p>
    </div>
    <div id="notices-container">
      <div class="skeleton" style="height:200px;border-radius:16px"></div>
    </div>`;
  try {
    const res = await API.noticeList();
    const notices = res.data || [];
    if (!notices.length) {
      $('#notices-container').innerHTML = emptyState('lottie-notices', '暂无公告', '目前没有系统公告');
      initLottieEmpty('lottie-notices');
      return;
    }
    $('#notices-container').innerHTML = `
      <div class="stagger">
        ${notices.map(n => `
          <div class="card" style="margin-bottom:var(--space-1)">
            <div class="flex justify-between items-start" style="margin-bottom:8px">
              <div class="card-title">${Utils.escapeHtml(n.title)}</div>
              <span class="text-xs text-muted">${Utils.formatDate(n.created_at)}</span>
            </div>
            <div class="notice-content text-sm text-secondary" style="line-height:1.8;white-space:pre-wrap">${Utils.escapeHtml(n.content)}</div>
          </div>
        `).join('')}
      </div>`;
  } catch (e) {
    $('#notices-container').innerHTML = emptyState('lottie-notices-err', '加载失败', e.message, '重试', 'initNotices()');
    initLottieEmpty('lottie-notices-err');
  }
}
