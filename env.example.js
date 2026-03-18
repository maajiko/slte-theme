/**
 * SLTE Theme — 环境配置
 *
 * 前后端分离部署：将本文件复制为 env.js，修改 routerBase 为你的 API 服务地址。
 * 其余字段均为可选项，留空或删除则使用默认值。
 *
 * 注意：其他配置（如注册验证码、充值赠送规则等）由后端接口动态下发，无需在此配置。
 */

// API 服务地址，末尾不加斜杠
window.routerBase = 'https://your-api-domain.com';

window.settings = {

  // 站点名称（显示在侧边栏和顶栏）
  title: 'SLTE',

  // 站点 Logo 图片 URL，留空则使用站点名称首字母作为图标
  logo: '',

  // 主题配色：default（清新绿）| blue（天空蓝）| black（暖灰黑）| darkblue（深海蓝）
  theme: {
    color: 'default'
  },

  // 自定义背景图 URL，留空使用默认纯色背景
  background_url: '',

  // 货币符号（显示在金额前）
  currency_symbol: '¥',

  // 注册开关（可选覆盖）
  // 设置后以此为准，忽略后端配置；不设置则以后端配置为准
  // is_register: 1,   // 1 = 开放注册，0 = 关闭注册

};
