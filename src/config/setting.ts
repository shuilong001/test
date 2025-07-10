export const webSetting = {
  server_testUrls: [
    [
      'https://cocos.pkbet.cloud/speedtest.txt',
      'wss://ws.pkbet.cloud/pk/switch/1',
    ],
  ],
  serverInfo: {
    app_download_url: '',
    res_download_url: '',
    app_version: '',
    hall_version: '0.0.0',
  },
  media_url: 'https://media.pkbet.cloud',
  api_url: 'https://api.pkbet.cloud',
  default_agent_id: 666888,
  geoip_api: 'https://geoip.pkbet.cloud/geoip/',
  url_loading: 'https://txh5.pkbet.site/loading/loading.html',
  chat_setting: 'http://18.167.187.79:8030/api/settings/site',
  backend_upload: 'https://media.pkbet.cloud',
  third_game_kind: 'https://backend.pkbet.cloud/backend/switch/kind.json',
  third_game: 'https://backend.pkbet.cloud/backend/switch/game.json',
  third_platform: 'https://backend.pkbet.cloud/backend/switch/platform.json',
  video_url: 'https://video.pkbet.cloud/video/index.php',
  serviceTelegram: 'https://t.me/PKBET888',
  communityUrl: 'https://www.facebook.com/groups/pkbet888',
  GET_IP_LIST: [
    'https://api.pkbet.app/get_ip/',
  ],
  admin_i18n_add_url: 'https://backend.pkbet.cloud/backend/switch/backend.json',
  chat_res: {
    chat_ws: 'wss://gochat.pkbet.cloud/switch/ws',
    chat_info: 'https://gochat.pkbet.cloud/switch/info/',
  },
  lang_list: [
    {
      name: 'en',
      icon: 'us',
      index: 0,
    },
    {
      name: 'vn',
      icon: 'vietnam',
      index: 1,
    },
    {
      name: 'zh',
      icon: 'china',
      index: 2,
    },
  ],
  currencyList: [
    {
      id: 1,
      name: 'VND',
      icon: 'VND',
    },
  ],
  phoneCodeMap: {
    84: {
      name: 'vietnam',
      code: '84',
      regExp: '^(84)?(3|5|7|8|9)[0-9]{8}$',
    },
  },
  appDownTipList: {
    is_show: 0,
    app_down_url: 'http://18.167.187.79/offial/index.html',
    app_down_url_iOS: 'https://apps.apple.com/app/id6737147629',
    app_down_url_android: 'https://d18uoo4icul0qu.cloudfront.net/pkbet_qyq_main.apk',
  },
  community_list: [
    {
      name_key: 'Facebook Home page',
      icon: 'facebook',
      url: 'https://www.facebook.com/PKBETPKBET',
    },
    {
      name_key: 'Facebook group',
      icon: 'facebook',
      url: 'https://www.facebook.com/groups/pkbet888',
    },
    {
      name_key: 'Telegram Channel',
      icon: 'telegram',
      url: 'https://t.me/PKBET888',
    },
  ],
  exchange_list: [
    {
      type: 0,
      url: 'https://www.binance.com/vi/price/tether/VND',
      name: 'Binance',
      isshow: true,
    },
    {
      type: 1,
      url: 'https://www.coinbase.com/zh-cn/converter',
      name: 'Coinbase',
      isshow: true,
    },
    {
      type: 2,
      url: 'https://www.gate.io/zh/crypto/buy/tether-usdt?crypto=USDT&fiat=vnd',
      name: 'Gate.io',
      isshow: true,
    },
    {
      type: 3,
      url: 'https://www.bybit.com/fiat/trade/express/home',
      name: 'Bybit',
      isshow: true,
    },
    {
      type: 4,
      url: 'https://www.okx.com/zh-hans/price/tether-usdt',
      name: 'OKX',
      isshow: true,
    },
    {
      type: 5,
      url: 'https://www.htx.com/zh-cn/fiat-crypto/one-trade/buy-usdt-vnd',
      name: 'HTX',
      isshow: true,
    },
  ],
  service_list: [
    {
      name_key: 'messenger',
      icon: 'messenger',
      url: 'https://t.me/PKBET888',
      i18n_key: 'service_message_url',
    },
    {
      name_key: 'telegram',
      icon: 'telegram',
      url: 'https://t.me/PKBET01',
      i18n_key: 'service_tg_url',
    },
  ],
  not_open_platforms: [
    17,
  ],
  _backend_upload: 'http://18.167.187.79:8050/uploads/',
}
