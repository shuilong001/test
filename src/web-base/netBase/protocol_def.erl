%% Author: NoteBook
%% Created: 2009-9-9
%% Description: 网络协议模块的定义
-module(protocol_def).

-export([get_struct_def/0, get_enum_def/0, get_version/0]).

%% 获得消息结构体的定义
get_struct_def() ->
  [
    %%%===================================================================================================
    %%% 大厅公共协议
    %%%===================================================================================================
    [proto_lobby_common_100],
      % 通用时间
      [stime,
        {int, year},                                        % 年
        {int, month},                                       % 月
        {int, day},                                         % 日
        {int, hour},                                        % 时
        {int, minute},                                      % 分
        {int, second}                                       % 秒
      ],

      % 游戏下注得分记录信息
      [game_record_item,
        {int64, role_id},
        {string, nickname},
        {int64, bet_count},                                 % 游戏下注分
        {int64, get_count},                                 % 游戏得分
        {stime, update_time}                                % 游戏时间
      ],

      % 三方游戏id
      [three_game_id,
        {int,agent_id},                                     % 平台id
        {string,game_id}                                    % 游戏id
      ],
      
      [msg_kv,
        {string, key},
        {array, int, val}
      ],

      % slots 投注参数
      [slots_bet,
        {int, bet},                                          % 下注第几个索引，对应投注大小索引,slots_bet_list 中的bet_list的索引
        {int, bet_line},                                     % 基础投注,slots_bet_list 中的bet_line_list的数值，基础倍数，X线
        {int, multiple}                                      % 下注倍数索引，投注倍数索引,slots_bet_list 中的multiple_list的索引
      ],
      % slots 投注参数列表
      [slots_bet_list,
        {array, int, bet_list},                              % 投注大小列表
        {array, int, bet_line_list},                         % 基础投注列表，一般只有一个，可能某些游戏有多个
        {array, int, multiple_list}                          % 投注倍数列表
      ],

    %%%===================================================================================================
    %%% 大厅基础协议
    %%%===================================================================================================
    [proto_lobby_base_1000],

      % 初始化连接
      [req_init_connect],

      % 验证版本
      [req_check_version,
        {int, version}                                      % 版本号
      ],
      % 返回验证版本的结果
      [notify_check_version,
        {check_version_result, result},                     % 验证结果
        {stime, curtime}
      ],
      % 心跳
      [notify_heartbeat],

      % 验证当前时间
      [req_check_time],
      [notify_check_time,
        {uint64, curtime}                                   % 返回当前时间
      ],

      % 发送系统消息给客户端
      [notify_sys_msg,
        {int, code},                                        % 系统消息代码, 参见sys_msg.hrl
        {int, type},                                        % 系统消息类型
        {array, string, params},                            % 参数消息内容参数
        {int, priority}                                     % 系统消息优先级 数字越大优先级越高
      ],
      % 向登录玩家发送系统公告
      [notice_record,
        {int, position},
        {int, type},
        {string, title},
        {string, content},
        {int, priority}
      ],
      [notify_send_system_notice,
        {array, notice_record, notice_list}
      ],
      % web端玩家未登录获取汇率
      [req_get_currency_rate
      ],
      % 返回汇率
      [notify_get_currency_rate,
        {string, currency_rate}
      ],

    %%%===================================================================================================
    %%% 大厅登录，账号相关协议
    %%%===================================================================================================
    [proto_lobby_login_1100],
      % 请求注册随机验证码
      [req_register_captcha,
        {string, sign},
        {string, aaa},
        {string, bbb}
      ],
      [notify_register_captcha,
        {string, url},
        {array, string, promotion_url},                     % 推广链接
        {array, string, seo_url}
      ],
      % 账号登录时请求图形随机验证码
      [req_login_captcha,
        {string, sign},
        {string, aaa},
        {string, bbb}
      ],
      [notify_login_captcha,
        {string, url}
      ],

      % 手机短信登录获取验证码/手机密码找回
      [req_get_mobile_sms_login_code,
        {string, mobile},
        {string, username}                                  % 忘记密码时，需要填写账号，用于验证账号是否有效
      ],
      [nodify_get_mobile_sms_login_code,
        {int, code},
        {string, message}
      ],
      % 邮箱注册账号获取验证码
      [req_get_email_verification_code,
        {int, operate_type},                                % 1表示邮箱注册，2表示邮箱绑定，3表示邮箱登录，4表示邮箱修改密码，5表示邮箱忘记密码
        {string, email},
        {string, username}                                  % 忘记密码时，需要填写账号，用于验证账号是否有效
      ],
	    % 返回值：code=3, verification_codes_sent_more_than_10_times
      % code=2, verification_code_sending_interval_is_less_than_180_seconds
      % code=1, verification_code_sent_success
      % code=4, verification_code_sent_failed
      [notify_get_email_verification_code,
        {int, code},
        {string, message}
      ],
      % 注册账号
      [req_register_account,
        {string, username},
        {string, password},
        {int, register_type},                               % 填写1，为登陆前注册账号,  通过register_type来区分账号注册类型，其中register_type=1表示账号注册; register_type=5表示邮箱注册，进行邮箱注册时，username填写邮箱地址。
        {string, sign},
        {string, ip},
        {string, ip_error},
        {string, device_model},
        {int, channel_id},
        {int, agent_id},
        {string, aaa},
        {string, bbb},
        {string, captcha},
        {int, currency},
        {string, from_url}
      ],
      [notify_register_account,
        {int, code},                                        % code=4444, key_checking_failed, code=2, account_or_password_incorrect, code=1, register_success
        {string, message}
      ],

      % 请求创建角色
      [req_create_role,
        {string, nickname},                                 % 角色昵称
        {int, server_id}                                    % 服务器id
      ],
      % 返回角色创建结果
      [notify_create_role_result],

      [nodify_create_v2,
        {int, code},
        {string, message}
      ],

      % 请求登录
      [req_role_login,
        {string, uid},                                      % uid
        {int, server_id},                                   % q
        {string, token},                                    % token
        {connect_type, type},                               % 连接类型 1正常登陆 2重登
        {int, version},                                     % 版本号
        {string, device_id}                                 % 设备Id
      ],
      % 返回登录结果
      [notify_login_result,
        {uint64, id},
        {common_result, result}
      ],

      % 登入附带ip
      [req_role_login_with_ip,                               % 请求登录
        {string, uid},                                       % uid
        {int, server_id},                                    % q
        {string, token},                                     % token
        {connect_type, type},                                % 连接类型 1正常登陆 2重登
        {int, version},                                      % 版本号
        {string, device_id},                                 % 设备Id
        {string, ip},                                        % ip
        {int, flag_id},                                      % 默认-1,可用记推广、邀请等功能 邀请时对应角色role_id
        {int, flag_type}                                     % 默认-1,可用记推广、邀请等功能 1:邀请
      ],

      % 请求登录效验
      [req_login_check,
        {string, uid},                                      % uid
        {string, token}                                     % token
      ],
      % 返回登录效验结果
      [notify_login_check_result,
        {common_result, result},
        {int, error_code}
      ],
      % 登录成功后返回玩家信息
      [req_user_info],
      [notify_user_info,
        {int, result},
        {string, full_name},                                % 玩家姓名
        {string, email},                                    % 邮箱
        {int, currency},                                    % 货币
        {int, country},                                     % 国家
        {int, usdt_rate},                                   % usdt汇率
        {string, real_name},                                % 玩家真实姓名，即绑定银行卡的姓名
        {string, mobile},                                   % 玩家绑定的手机号
        {int, account_type}                                 % 账号注册类型，1手机号，2临时账号，3普通账号，4邮箱账号
      ],
      % 通知客户端重复登陆
      [notify_repeat_login,
        {string, account}                                   % 用户帐号
      ],

      % 通知客户端踢人原因
      [notify_kickplayer_reason,
        {string, reason}                                    % 原因
      ],

      % 返回Loading结束
      [notify_loading_end],
      % 绑定账号
      [req_bind_account,
        {string, turist_username},
        {string, turist_password},
        {string, username},
        {string, password},
        {string, nickname},
        {int, register_type},                               % 填写2或者3，其中2为玩家以游客身份登录游戏之后进行账号绑定，3为游客进来后进行账号注册并绑定
        {string, sign},
        {string, ip},
        {string, ip_error},
        {string, device_model},
        {int, channel_id},
        {int, agent_id},
        {string, aaa},
        {string, bbb}
      ],
      [notify_bind_account,
        {int, code},
        {string, message}
      ],
      % 取消绑定电话号码协议
      [req_mobile_cancel],
      [notify_mobile_cancel,
        {common_result, result}
      ],
      % 升级账号，绑定手机相关协议
      [req_update_account_verify_code,
        {string, mobile}
      ],
      % 获取请求账号绑定短信
      [notify_update_account_verify_code,
        {common_result, is_success}
      ],
      % 账号升级
      [req_update_account,
        {string, password},
        {string, verify_code}
      ],
      [notify_update_account,
        {common_result, is_success}
      ],
      % 请求客服信息
      [req_customer_info],
      % 通知客服信息结果
      [notify_customer_info,
        {string, url}
      ],
      % 请求登录三方游戏平台
      [req_3rd_game_login,
        {int, agentId},                                     % 三方代理ID
        {string, gameId},                                   % 游戏ID,自身平台是room_id
        {string, kindId},                                   % 游戏类型(备用,大部分平台只需一个gameId参数,少数平台需要用到2个参数)
        {int, lang},                                        % 语言
        {int, device_type},                                 % 登录设备类型
        {int, trial}                                        %  整形,  1 = 试玩,  0 = 非试玩
      ],
      % 通知三方游戏平台登录结果
      [notify_3rd_game_login_result,
        {int, code},                                        % 错误码
        {string, url},                                      % 游戏入口地址,客户端跳转(code = 0)
        {string, msg}                                       % 错误提示消息(code != 0)
      ],
      % login game,单链接使用三方返回的token登录
      [req_login_game, {int, version}, {string, token}, {string, device_id}],
      % 绑定及修改邮箱
      [req_bind_modify_email,
        {string, username},
        {string, password},
        {int, operate_type},                                % 绑定邮箱或者修改邮箱 operate_type=1表示绑定邮箱，email填写要绑定的邮箱，captcha填写邮箱验证码。operate_type=2表示修改会员账号（仅限手机或邮箱注册的账号修改为普通账号）email填写修改后的普通账号，普通账号没有验证码，所以captcha不需要填写。operate_type=3表示绑定手机，email填写要绑定的手机号，captcha填写手机验证码。
        {string, sign},
        {string, ip},
        {string, ip_error},
        {string, device_model},
        {int, channel_id},
        {int, agent_id},                                    % agent_id填写role_id
        {string, aaa},
        {string, bbb},
        {string, captcha},
        {string, email}
      ],
      [notify_bind_modify_email,
        {int, code},
        {string, message}
      ],
      % 手机短信验证码
      [req_get_mobile_sms_code,
        {int, operate_type},                                % 1表示账号绑定手机获取验证码
        {string, mobile}
      ],
      [notify_get_mobile_sms_code,
        {int, code},
        {string, message}
      ],
      % 会员账号是否可以修改
      % 仅限手机或者邮箱注册的账号是否可以修改
      [req_can_modify_account,
        {int, operate_type},                                % 1表示检测该用户是否已经修改过账号，2表示检测新的账号是否已经被注册过
        {string, newusername}                               % 为新的账号，返回是否可以修改（有可能这个账号已经被注册或者绑定过了）。
      ],
      [notify_can_modify_account,
        {int, code},
        {string, message}
      ],
      % 请求修改密码
      [req_reset_account_password,
        {string, username},                                 % 手机找回或修改密码username填写手机号，邮箱找回或修改密码username填写邮箱
        {int, modify_type},                                 % modify_type=1表示常规修改密码，modify_type=2表示通过手机修改密码，modify_type=3表示通过邮箱修改密码
        {int, operate_type},                                % operate_type=1表示点击下一步需要校验手机或者邮箱是否已经绑定，验证码是否正确；operate_type=2表示立即修改密码
        {string, mobile_or_email},                          % 玩家账号（cocos不需要输入玩家账号，所以这个字段赋值为空）
        {string, captcha},                                  % 通过手机或者邮箱修改密码，需要输入收到的验证码
        {string, old_password},
        {string, new_password},
        {string, new_password_confirm}
      ],
      [notify_reset_account_password,
        {int, code},
        {string, message}
      ],
      % 资金密码
      [req_open_or_close_withdraw_password,
        {int64, role_id},                                   % 角色ID
        {int, operate_type},                                % operate_type=1表示开启资金密码；operate_type=2表示关闭资金密码，关闭需要验证原资金密码是否正确；operate_type=3表示请求资金密码是开启还是关闭状态
        {string, withdraw_password}                         % 进行关闭资金密码操作时填写资金密码
      ],
      [notify_open_or_close_withdraw_password,
        {int, code},
        {string, message}
      ],
      [req_bind_or_modify_withdraw_password,
        {int64, role_id},                                   % 角色ID
        {int, operate_type},                                % operate_type=1表示绑定资金密码；operate_type=2表示常规修改资金密码；operate_type=3表示通过手机修改密码；operate_type=4表示通过邮箱修改密码
        {int, step},                                        % 当operate_type=3或4时，step=1表示点击下一步，需要校验手机或者邮箱是否已经绑定，验证码是否正确；step=2表示立即修改密码
        {string, mobile_or_email},                          % 当operate_type=3且step=1时，填写手机号；当operate_type=4且step=1时，填写邮箱地址
        {string, captcha},                                  % 当operate_type=3且step=1时，填写手机收到的验证码；当operate_type=4且step=1时，填写邮箱收到的验证码
        {string, old_password},                             % operate_type=2时填写旧的资金密码
        {string, new_password},                             % operate_type=1时填写要绑定的资金密码，operate_type=2时填写新的资金密码；operate_type=3且step=2时填写新的资金密码；operate_type=4且step=2时填写新的资金密码
        {string, new_password_confirm}                      % operate_type=1时填写要绑定的资金密码，operate_type=2时填写新的资金密码
      ],
      [notify_bind_or_modify_withdraw_password,
        {int, code},
        {string, message}
      ],
	  % 账号登录时请求图形滑动
      [req_login_moving_check,
        {string, sign},
        {string, aaa},
        {string, bbb}
      ],
      [notify_login_moving_check,
        {string, url},
		{int, y_pos}
      ],
	  % 注册时的请求图形滑动
      [req_register_moving_check,
        {string, username},
        {string, sign},
        {string, aaa},
        {string, bbb},
        {int, agent_id}                                     % agent_id填写role_id
      ],
      [notify_register_moving_check,
        {common_result, is_success},                        
        {string,  message},                                 % 如果失败， 这里返回失败原因
        {string, url},
		    {int, y_pos},
        {array, string, promotion_url},                     % 推广链接
        {array, string, seo_url}
      ],

    %%%===================================================================================================
    %%% 服务器内部协议 web api
    %%%===================================================================================================
    [proto_lobby_webapi_1200],
      % api/user/load_ip
      [req_load_ip,
        {uint64, role_id},                                    % 角色id
        {string, md5_key}                                     % 密钥凭证
      ],
      [nodify_load_id,
        {int, code},
        {array, string, ip_list}
      ],
      % api/auth/login
      [req_login,
        {int, login_type},                                    % 登陆类型  101 微信登陆，3 手机短信登录，4 账号登录，5 邮箱登录
        {string, username},
        {string, password},
        {string, device_id},
        {string, debug},
        {string, device_model},
        {string, app_version},
        {int, channel_id},
        {string, aaa},
        {string, bbb},
        {string, ip},
        {string, captcha}
      ],
      [nodify_login,
        {int, code},
        {string, message},
        {uint64, user_id},
        {string, token},
        {int, account_type},
        {int, is_default_bankpwd},
        {string, tokenid},
        {int, newguidestate},
        {string , ipGroupName}
      ],
      % api/auth/confirm_agent_level1_transfer  //确认一级代理转账
      [req_confirm_agent_level1_transfer,
        {string, aaa},
        {string, bbb},
        {int, transferId}
      ],
      [nodify_confirm_agent_level1_transfer,
        {int, code},
        {string, message}
      ],
      % api/auth/get_agent_lock_bankmoney
      [req_get_agent_lock_bankmoney,
        {string, aaa},
        {string, bbb},
        {uint64, role_id}
      ],
      [nodify_get_agent_lock_bankmoney,
        {int, code},
        {string, message},
        {uint64, agent_lock_bankmoney}
      ],
      % api/user/set_newguidestate
      [set_newguidestate,
        {string, aaa},
        {string, bbb},
        {uint64, role_id}
      ],
      % 8.api/user/get_config
      [req_get_config,
        {string, aaa},
        {string, bbb},
        {uint64, role_id},
        {int, channel_id}
      ],
      [nodify_get_config,
        {int, code},
        {string, message},
        {string, share_url},
        {int, omm_state},
        {string, omm_content},
        {int, rank_status},
        {int, rebate_status},
        {uint64, znhl_starttime},
        {uint64, znhl_endtime},
        {int, show_rank},
        {int, show_user_bind_new},
        {int, show_newbees},
        {int, show_win_100},
        {int, show_lucky_roulette},
        {int, show_first_recharge},
        {int, show_rebate},
        {int, show_vip},
        {int, show_notice},
        {int, show_dragon}
      ],
      % api/user/set_channel/
      [set_channel,
        {string, aaa},
        {string, bbb},
        {uint64, role_id},
        {int, channel_id}
      ],
      % api/user/set_client_ip/
      [set_client_ip,
        {string, aaa},
        {string, bbb},
        {uint64, role_id}
      ],

      % api/user/submit_suggest
      [req_submit_suggest,
        {string, aaa},
        {string, bbb},
        {uint64, role_id},
        {string, content}
      ],
      [nodify_submit_suggest,
        {int, code},
        {string, message}
      ],
      % api/user/get_send_sms_check_code      //换设备登录,获取短信验证码
      [req_get_send_sms_check_code,
        {string, username},
        {string, password}
      ],
      [nodify_get_send_sms_check_code,
        {int, code},
        {string, message}
      ],
      % api/user/check_sms_code
      [req_check_sms_code,
        {string, username},
        {int, verify_code}
      ],
      [nodify_check_sms_code,
        {int, code},
        {string, message}
      ],
      % api/user/reset_password
      [req_reset_password,
        {string, mobile},
        {string, new_password},
        {int, verify_code}
      ],
      [nodify_reset_password,
        {int, code},
        {string, message}
      ],
      % api/user/get_send_create_user_sms_code  //获取注册短信验证码(真)
      [req_get_send_create_user_sms_code,
        {string, mobile},
        {string, ip},
        {int, type},
        {string, username}
      ],
      [nodify_get_send_create_user_sms_code,
        {int, code},
        {string, message}
      ],
      % api/user/add_guest
      [req_add_guest,
        {string, username},
        {string, password},
        {string, captcha},
        {string, sign},
        {string, ip},
        {string, ip_error},
        {string, device_model},
        {string, aaa},
        {string, bbb}
      ],
      [nodify_add_guest,
        {int, code},
        {string, message},
        {string, username},
        {string, password}
      ],
      % api/user/create_v2
      [req_create_v2,
        {string, username},
        {string, password},
        {int, verify_code},
        {string, sign},
        {string, ip},
        {string, ip_error},
        {string, device_model},
        {int, channel_id},
        {int, agent_id},
        {string, aaa},
        {string, bbb}
      ],
      % 请求踢出三方游戏平台, 无需返回给客户端
      [req_3rd_game_kick,
        {int, agentId},                                     % 三方代理ID
        {string, gameId}                                    % 游戏ID
      ],
      % 三方充值请求
      % 请求充值
      [req_recharge_from_third,
        {string, amount},                                   % 充值金额
        {int, channel_type},                                % 充值渠道
        {int, bank_channel_type},                           % 银行卡通道类型
        {int, got_discount},                                % 优惠ID
        {int, network_type}                                 % USDT网络类型1:TRC20/2:ERC20
      ],
      % 通知三方充值结果
      [notify_recharge_from_third,
        {int, code},                                        % 错误码(-1：充值优惠检查失败)
        {string, url},                                      % 充值入口地址,客户端跳转(code = 0)
        {string, msg}                                       % 错误提示消息(code != 0)
      ],
      % 通知玩家充值成功了(在第三方回调成功后)
      [notify_recharge_success_from_third,
        {int64, amount},                                    % 充值金额
        {int, is_first_recharge},                           % 是否首充
        {int64, reward}                                     % 福龙临门活动奖金
      ],
      % 充值请求补充
      [req_recharge_from_third_add,
        {int, got_discount}                                 % 首充2选1用户选择优惠:1领取20%，2不领取；0表示其它玩家
      ],
      % 请求在线充值
      [req_recharge2,
        {string, money},                                    % 充值金额
        {int, channel_id}                                   % 充值渠道
      ],
      % 通知金币变化值更新
      [notify_money_update2,
        {int64, update_money},                              % 更新值
        {int64, cur_money},                                 % 当前总值
        {int, type}                                         % 0=>充值
      ],

    %%%===================================================================================================
    %%% 角色相关协议
    %%%===================================================================================================
    [proto_lobby_role_1300],
      [notify_roleinfo_msg,
        {uint64, id},
        {string, nickname},
        {string, head_photo},                               % 头像id
        {uint64, money},
        {int, vip_lv},
        {int, sex},
        {string, signature},
        {string, mobile},
        {uint64, bank_money},
        {bank_password_state, password_state},              % 1 : 已设置 2: 未设置
        {int, agent_level},                                 % 代理等级
        {int64, recharge_amount},                           % 充值总量
        {int64, reserve0},                                  % 预留字段
        {int64, reserve1},
        {int64, reserve2},
        {int64, reserve3},
        {int64, reserve4},
        {int, withdraw_pwd_status},                         % 资金密码状态 1关闭 2开启
        {string, withdraw_pwd},                             % 资金密码
        {uint64, currencyrate},
        {uint64, currencyrate_fix}                          % 保留几位小数
      ],
      % 请求用户界面信息
      [req_roleinfo_with_id,
        {uint64, id}
      ],
      [notify_roleinfo_with_id,
        {uint64, id},
        {string, nickname},
        {string, head_photo},                               % 头像id
        {int64, money},
        {int, vip_lv},
        {int, sex},
        {string, signature},
        {int64, bank_money}
      ],
      % 通知金币更新
      [notify_money_update,
        {int64, money},
        {int, flag}                                         % =1时前端可以特殊处理
      ],

      % 修改玩家名字
      [req_rename,
        {string, new_name},                                 % 新名
        {string, captcha},                                  % 随机验证码
        {int, type}                                         % 是否需要验证码，0表示不需要验证码，1表示需要验证码
      ],
      [notify_rename_result,
        {common_result, is_success}
      ],
      % 修改玩家头像
      [req_select_head_icon,
        {string, new_head_icon}
      ],
      [notify_select_head_icon_result,
        {common_result, is_success}
      ],
      % 修改玩家性别
      [req_update_sex,
        {sex, new_sex}
      ],
      [notify_update_sex_result,
        {common_result, is_success}
      ],
      % 修改玩家签名
      [req_update_signature,
        {string, new_signature}
      ],
      [notify_update_signature_result,
        {common_result, is_success}
      ],
      % 修改自动跟随
      [req_update_auto],
      [notify_update_auto,
        {common_result, is_success}
      ],
      % 请求申请设置电话
      [req_set_mobile_apply,
        {string, mobile}
      ],
      [notify_set_mobile_apply_result,
        {common_result, is_success}
      ],
      % 请求设置电话,verify_code为手机短信的验证码
      [req_set_mobile,
        {string, verify_code}
      ],
      [notify_set_mobile_result,
        {common_result, is_success}
      ],
      % 自定义头像
      [req_custom_head_icon_info],
      [notify_custom_head_icon_info,
        {int, sta},                                         % 0未设置1审核中2已通过3拒绝
        {string, head_icon_name},
        {string, upload_address}
      ],
      % 自动跟随及钱包转钱
      [req_auto_trans],
      [notify_auto_trans,
        {int, auto_trans}                                   % 自动跟随 1打开，0关闭，默认打开
      ],
      [req_inner_trans,
        {int, to_bank},                                     % 1为钱包存到银行，其它为从银行中转到钱包
        {uint64, amount}
      ],
      [notify_inner_trans,
        {int,rlt}                                           % 0成功，1失败
      ],
      % 设置默认银行卡
      [req_set_default_bankcard,
        {string, bankcard}                                  % 格式：银行ID_卡号
      ],
      [notify_set_default_bankcard,
        {int,rlt}                                           % 0成功，1失败
      ],
      % 请求自定义头像
      [req_upload_custom_head_icon,
        {string, head_icon_name}                            % 客户端自定义，服务器只负责存
      ],
      [notify_upload_custom_head_icon,
        {common_result, is_success}
      ],


    %%%===================================================================================================
    %%% 银行相关协议
    %%%===================================================================================================
    [proto_lobby_bank_1400],
      % 请求设置银行密码
      [req_set_bank_password,
        {string, password}
      ],
      [notify_set_bank_password_result,
        {common_result, is_success}
      ],
      % 请求重置银行密码
      [req_reset_bank_password,
        {string, old_password},
        {string, new_password},
        {string, new_password_confirm}
      ],
      [notify_reset_bank_password_result,
        {common_result, is_success}
      ],
      % 请求短信获取银行密码
      [req_get_bank_password],
      [notify_get_bank_password_result,
        {common_result, is_success}
      ],
      % 请求验证银行密码
      [req_auth_bank_password,
        {string, password}
      ],
      [notify_auth_bank_password_result,
        {common_result, is_success}
      ],
      % 请求银行存入
      [req_bank_save,
        {string, money}
      ],
      [notify_bank_save_result,
        {common_result, is_success},
        {int64, money}
      ],
      % 请求银行取出
      [req_bank_take,
        {string, money}
      ],
      [notify_bank_take_result,
        {common_result, is_success},
        {int64, money}
      ],
      % 请求转账申请
      [req_bank_transfer_apply,
        {string, role_id},
        {string, money}
      ],
      [notify_bank_transfer_apply_result,
        {common_result, is_success},
        {uint64, role_id},
        {string, nickname},
        {string, money}
      ],
      % 请求转账确认
      [req_bank_transfer_confirm],
      [notify_bank_transfer_confirm_result,
        {common_result, is_success}
      ],

      [transfer_log,
        {uint64, role_id},
        {int64, money},
        {string, nickname},
        {stime, time},
        {int, status}
      ],
      % 请求转账记录
      [req_bank_transfer_log,
        {transfer_log_type, type},
        {int, page}                                         % 第几页
      ],
      [notify_bank_transfer_log,
        {transfer_log_type, type},
        {int, page},                                        % 第几页
        {array, transfer_log, log_list}
      ],
      % 请求刷新金钱数据
      [req_bank_money_refresh],
      [notify_bank_money_refresh,
        {uint64, money},
        {uint64, bank_money}
      ],
      [bank_card_info,
        {int, bank_id},
        {string, bank_name},
        {string, account_number}
      ],

      [req_bank_card_info_list],
      [notify_bank_card_info_list,
        {string, cardholder_name},
        {array, bank_card_info, bank_card_info_list},
        {int, min_withdraw_money},
        {int, max_withdraw_money},
        {int, max_withdraw_count},
        {int, min_usdt},
        {int, max_usdt},
        {int, bank_card_maintain_status},
        {int, usdt_maintain_status},
        {int, bankrule_tip_status}
      ],

      [req_new_bank_card_info,
        {int, bank_id},
        {string, cardholder_name},
        {string, account_number}
      ],

      [notify_req_new_bank_card_info,
        {int, result}                                       % 1 = Success; 2 = failed; 3 = error_already_exists ;4 = input params error;5 bank account check failed
      ],

      [bank_info,
        {int, bank_id},
        {string, bank_name}
      ],

      [req_bank_name_list],
      [notify_req_bank_name_list,
        {array, bank_info, bank_name_list},
        {array, int, status_list}
      ],
      % 充值/提现 记录，用同一个协议结构
      [recharge_record,
        {int, way_id},                                      % 充值记录：通道Id， 银行卡、MOMO等 / 提现记录：提现类型，1=>银行卡 2=>USDT
        {uint64, pay_money},                                % 充值记录：交易状态为1时为：原始实际支付金额，其他状态为：充值金额 / 提现记录：提现金额
        {uint64, bonus},                                    % 充值记录：赠送金额 / 提现记录：无
        {int, order_status},                                % 充值记录：交易状态:1成功0失败-1交易中2回调成功 / 提现记录：1:审核中，2:交易完成，3:审核异常，4:处理中
        {stime, pay_time}                                   % 充值记录：支付时间 / 提现记录：提现时间
      ],
      % 获取充值记录
      [req_get_recharge_record_list,
        {int, page},
        {stime, start_time},
        {stime, end_time},
        {int, status},                                      % 1成功0失败-1交易中2回调成功 9表示所有
        {int, currency},                                    % 币种:1法币/2USDT/0所有
        {int, number_per_page}                              % 每页显示的条数
      ],
      [notify_get_recharge_record_list,
        {int, total_page},
        {array, recharge_record, recharge_record_list},
        {int, total_items}                                  % 记录总条数
      ],
      % 申请提现
      [req_apply_withdraw,
        {string, money},                                    % 提现金额
        {string, bank_card_id},                             % 提现银行卡(或USTD地址)
        {int, bank_id},                                     % 银行编号
        {int, way},                                         % 1银行卡，2USTD
        {string, passwd}                                    % 资金密码
      ],
      [notify_apply_withdraw,
        {int, result},                                      % 0=>申请成功, 1=>银行信息不存在 或 持卡人姓名不存在 2流水要求不符合 3提款金额超出提款范围 4取款密码错误 5银行分数不够 6 有未完成的提现记录 7今日提现次数超过后台设置的限制 8总资产小于提现金额
        {string, tip}
      ],
      % 取消申请提现
      [req_cancel_apply_withdraw,
        {string, id}                                        % 取消的订单Id
      ],
      [notify_cancel_apply_withdraw,
        {int, result}                                       % 0=>取消成功, 1=>取消失败
      ],
      % 获取提现记录
      [req_get_withdraw_record_list,
        {int, page},
        {stime, start_time},
        {stime, end_time},
        {int, status},                                      % 状态 0=>等待审核 1=>打款中 2=>交易完成 3=>审核异常 4=>交易取消 9表示所有
        {int, currency},                                    % 币种:1法币/2USDT/0所有
        {int, number_per_page}                              % 每页显示的条数
      ],
      [notify_get_withdraw_record_list,
        {int, total_page},
        {array, recharge_record, withdraw_record_list},
        {int, total_items}                                  % 记录总条数
      ],
      % 获取账变记录
      [req_get_accounting_change_record_list,
        {int, page},
        {stime, start_time},
        {stime, end_time},
        {int, type},
        {int, number_per_page}                              % 每页显示的条数
      ],
      [accounting_change_record,
        {int, type},                                        % 1增加，2为减少
        {int, b_type},                                      % 业务类型
        {uint64, pay_money},
        {int, item},                                        % 1为游戏钱包，2为中心钱包
        {stime, create_time},
        {string, remark}
      ],
      [notify_get_accounting_change_record_list,
        {int, total_page},
        {array, accounting_change_record, record_list},
        {int, total_items}                                  % 记录总条数
      ],
      % 是否可以提款
      [req_can_withdraw],
      [notify_can_withdraw,
        {int, rlt},                                         % 0可提，1不可提
        {uint64, can_withdraw},                             % 可提金额
        {uint64, canot_withdraw},                           % 不可提金额
        {uint64, turnover},                                 % 所需流水
        {string, revenueratio_withdraw},                    % 提现手续费率
        {string, exchange_ratio_withdraw}                   % 提现兑换比例
      ],
      % 删除银行卡
      [req_del_bank_card_info,
        {string, bankcard}                                  % 格式：银行ID_卡号
      ],

      [notify_del_bank_card_info,
        {int, result}                                       % 1 = Success; 2 = failed; 3 = error_already_exists
      ],
	  %% 从携带直接提现
	  % 申请提现
      [req_apply_withdraw_ex,
        {string, money},                                    % 提现金额
        {string, bank_card_id},                             % 提现银行卡(或USTD地址)
        {int, bank_id},                                     % 银行编号
        {int, way},                                         % 1银行卡，2USTD
        {string, passwd}                                    % 资金密码
      ],     

    %%%===================================================================================================
    %%% 充值商城
    %%%===================================================================================================
    [proto_lobby_recharge_1500],
      % 每种充值方式充值列表
      [recharge_list,
        {int, paymenttype},
        {string, rechargelist},                             % 金币按钮列表
        {uint64, minrecharge},                              % 充值区间最小值
        {uint64, maxrecharge},                              % 充值区间最大值
        {string, paymethod},                                % 充值支付方式
        {string, payname},                                  % 渠道名称
        {int,status}                                        % 渠道状态0维护，1开户
      ],
      [recharge_discount,
        {int, discount_ID},                                 % 优惠ID
        {int, limit},                                       % 优惠上限
        {int, ratio},                                       % 赠送比例， 50表示50%
        {int, require},                                     % 流水倍数
        {string, restrict},                                 % 限定场馆
        {string, name},                                     % 优惠名称
        {uint64, threshold},                                % 参与最低金额
        {uint64, save_trigger},                             % 复活金触发金额
        {int, save_ratio},                                  % 复活金百分比
        {int, save_require},                                % 复活金流水倍数
        {uint64, up_limit},                                 % 参与最高计算金额
        {int, bind_card}                                    % 是否要求绑卡0不需要1需要
      ],
      [pay_info,
        {int, pay_id},
        {string, pay_name}
      ],
      % 请求充值商城信息
      [req_get_shop_info],
      % 返回充值商城信息
      [notify_req_get_shop_info,
        {array, recharge_list, rechargelist_by_paymenttype}, % 充值渠道
        {array, recharge_discount, discount_list},          % 充值优惠列表
        {array, pay_info, bank_list},                       % 银行列表
        {int, usdt_viet_rate},
        {int, is_speical_player},                           % 是否为首充2选1用户:1是，0不是
        {int, last_bank},                                   % 最后一次充值时选择的银行
        {string, bank_name}
      ],
      % 充值信息
      [req_pay_name_list],

      [notify_req_pay_name_list,
        {array, pay_info, pay_name_list}
      ],

    %%%===================================================================================================
    %%% 添加USDT地址
    %%%===================================================================================================
    [proto_lobby_usdt_1600],
      % 添加USDT地址
      [req_add_usdt_info,
        {int, usdt_type},                                   % usdt地址类型，1表示trc20，2表示erc20
        {string, usdt_addr},                                % usdt地址
        {string, desc}
      ],

      [notify_add_usdt_info,
        {int, result}                                       % 1 = Success; 2 = failed
      ],

      % 客户端请求usdt地址列表
      [usdt_info,
        {int, usdt_type},                                   % usdt地址类型，1表示trc20，2表示erc20
        {string, usdt_addr},                                % usdt地址
        {string, desc}
      ],
      [req_usdt_info_list],
      [notify_usdt_info_list,
        {array, usdt_info, usdt_info_list}
      ],

      % u的汇率和提现手续费率
      [revenue_ratio,
        {int, type},                                        % 提现类型，1为银行卡，2为USDT
        {string, ratio}                                     % 提现手续费率，例如:0.0005
      ],

      [req_usdt_and_revenue_ratio],

      [notify_usdt_and_revenue_ratio,
        {int, u_ratio},
        {array, revenue_ratio, rev_ratio_list}
      ],
      % 手动打款条数
      [req_withdraw_count],
      [nodify_withdraw_count,
        {int, waitstart},
        {int, waitend}
      ],

      % 删除USDT地址
      [req_del_usdt_info,
        {string, usdtaddr}                                  % usdt地址
      ],

      [notify_del_usdt_info,
        {int, result}                                       % 1 = Success; 2 = failed;
      ],

      % 设置默认USDT地址
      [req_set_default_usdt,
        {string, usdtaddr}                                  % usdt地址
      ],
      [notify_set_default_usdt,
        {int, result}                                       % 0成功，1失败
      ],

    %%%===================================================================================================
    %%% 代理相关协议
    %%%===================================================================================================
    [proto_lobby_agent_1700],
      [agent_item,
        {string, name},
        {string, weixin_id},
        {uint64, role_id},
        {string, qq}
      ],
      [req_agent_list],
      [notify_agent_list,
        {array, agent_item, agent_list}
      ],

    %%%===================================================================================================
    %%% 排行榜相关协议
    %%%===================================================================================================
    [proto_lobby_rank_1800],
      [rank_item,
        {int, rank},
        {uint64, role_id},
        {string, head_icon},
        {string, nickname},
        {uint64, money},
        {string, signature},
        {string, weixin_id},
        {int, sex},
        {string, qq}
      ],

      [req_rank_list],
      [notify_rank_list,
        {array, rank_item, rich_list},
        {array, rank_item, win_list}
      ],
      [rank_item_bet,
        {int, rank},
        {uint64, role_id},
        {string, head_icon},
        {string, nickname},
        {int, sex},
        {int64, score},                                     % 总积分
        {int64, money},                                     % 奖励
        {int, has_reward}                                   % 是否已领取过奖励
      ],
      % 获取龙虎榜数据
      [req_rank_bet,
        {int, type}                                         % 0表示昨日榜， 1表示今日榜
      ],
      % 龙虎榜数据通知
      [notify_rank_bet,
        {int, type},                                        % 0表示昨日榜， 1表示今日榜
        {array, rank_item_bet, rank_item},                  % 前50名排行数据
        {rank_item_bet, self_rank_item}                     % 自己的排行数据
      ],

      % 领取昨日奖励
      [req_rank_getreward],
      % 龙虎榜奖励通知
      [notify_rank_getreward,
        {common_result, result},
        {int64, money}                                      % 奖励
      ],
      % New Rank
      [new_rank_item,
        {string, nickname},               % 昵称
        {int64, money},                   % 爆奖金额
        {string, game_no},                % 投注id
        {three_game_id, three_game}       % 三方游戏
      ],
      [new_rank_item_detail,
        {int, role_id},
        {string, head_icon},
        {string, nickname},
        {int, vip_level},
        {int64, money},                   % 爆奖金额
        {string, game_no},                % 投注id
        {int64, bet_money},               % 投注金额
        {int64, multiple},                % 赔率，放大10000倍
        {int64, timestamp},               % 中奖时间
        {three_game_id, three_game}
      ],

      [req_new_rank_list,
        {int, room_type}
      ],
      [notify_new_rank_list,
        {int, room_type},
        {array, new_rank_item, room_rank_list}
      ],
      % 带机器人的新版排行榜
      % [req_rank_with_robot_list],
      % [notify_rank_with_robot_list,
      %   {array, new_rank_item, room_rank_list}
      % ],
      [
        req_rank_with_player_list,
        {int, game_kind}                     % 类型 0 全部 1 电子 2 捕鱼 3 视讯 4 体育 5 棋牌 6 彩票
      ],
      [notify_rank_with_player_list,
        {array, new_rank_item, room_rank_list}
      ],
      [
        req_rank_with_player_detail,
        {string, game_no}                     % 投注id
      ],
      [notify_rank_with_player_detail,
        {new_rank_item_detail, rank_item}
      ],
    %%%===================================================================================================
    %%% 邮件相关协议
    %%%===================================================================================================
    [proto_lobby_email_1900],
      [award_info,
        {int, award_id},                                    % 奖励id
        {int64, award_value}                                % 奖励数量
      ],
      [email,
        {string, email_id},                                 % 邮件id
        {uchar, type},                                      % 发件类型，1个人 2全服
        {uchar, email_type},                                % 邮件类型， 1个人， 2系统 3赠送返利(旧), 4月返利
        {string, addressor},                                % 发件人昵称
        {string, title},                                    % 主题
        {string, content},                                  % 内容
        {array, award_info, attachments},                   % 附件
        {stime, recv_time},                                 % 发件时间
        {stime, end_time},                                  % 过期时间
        {common_judge, is_get}                              % 是否已领取
      ],
      % 通知玩家所有邮件
      [notify_email_list,
        {array, email, emails},                             % 所有邮件
        {array, string, email_readed}                       % 已读的邮件id列表
      ],
      % 请求领取附件
      [req_get_email_attachments,
        {string, email_id}
      ],
      % 通知附件领取成功
      [notify_get_email_attachments,
        {string, email_id}
      ],
      % 通知新邮件
      [notify_new_email,
        {email, new_email}
      ],
      % 读取新的邮件
      [req_read_email,
        {string, email_id}
      ],
      % 通知已读取
      [notify_read_email,
        {string, email_id}
      ],
      % 删除邮件
      [req_del_email,
        {string, email_id}
      ],
      %通知删除结果
      [notify_del_email,
        {string, email_id}
      ],
    %%%===================================================================================================
    %%% 任务相关协议
    %%%===================================================================================================
    [proto_lobby_task_2000],
      [award_state,
        {award_type, type},                                 % 奖励类型
        {int, state}                                        % 0没有奖励， 1 有奖励
      ],
      % 请求每日任务
      [req_day_task],
      [task_msg,
        {int, task_id},
        {int, cur_times},                                   % 当前任务完成次数
        {int, state}                                        % 1已领 0 未领
      ],
      % 通知每日任务
      [notify_day_task,
        {array, task_msg, task}
      ],
      % 通知任务状态
      [notify_day_task_state,
        {array, award_state, award_states}
      ],
      % 请求领取奖励
      [req_get_reward,
        {int, id}                                            % 任务id
      ],

      [notify_get_reward,
        {int, id}
      ],                                                     % 领取成功返回
    %%%===================================================================================================
    %%% 大厅房间协议
    %%%===================================================================================================
    [proto_lobby_room_2100],
      [desk,
        {string, id},                                       % 请求进入桌子的ID
        {string, name},                                     % 列表显示的名称
        {int, cur_count}                                    % 当前房间游戏人数
      ],
      % 请求房间桌子列表
      [req_desk_list,
        {int, room_id}                                      % 房间类型,房间模板表类型ID
      ],
      % 返回房间桌子列表列表
      [notify_desk_list,
        {array, desk, desk_list}
      ],
      % 角色基础信息
      [room_role_base,
        {uint64, role_id},
        {string, nickname},                                 % 这里用的是username,不改字段名字为了方便维护
        {uint64, money},
        {string, head_photo},
        {sex, gender}
      ],
      % 离开房间
      [req_leave_room,
        {string, param1},                                   % 为第三方游戏加的
        {string, param2}                                    % 为第三方游戏加的
      ],
      % 离开通知
      [notify_leave_room_result,
        {common_result, result}
      ],
      % 离开通知
      [notify_leave_room,
        {uint64, role_id}
      ],
      % 离开房间
      [req_leave_minigame_room,
        {int, room_id}
      ],
      % 离开通知
      [notify_leave_minigame_room_result,
        {int, room_id},
        {common_result, result}
      ],

      [req_enter_room,
        {int, room_id}                                      % 请求进入房间的ID,在room_tplt的id字段
      ],
      [notify_enter_room_result,
        {common_result, result},
        {string, desk_id},
        {int, is_first_time}                                % 0 表示不是第一次进入，1 表示是第一次进入
      ],

      [req_enter_desk,
        {string, desk_id}                                   % notify_enter_room_result返回的desk_id
      ],
      [notify_enter_desk_result,
        {common_result, result},
        {string, desk_id}
      ],
      % 请求换桌子
      [req_change_desk],
      [notify_change_desk_result,
        {common_result, result},
        {string, desk_id}
      ],
      % 玩家进入通知
      [notify_role_enter,
        {room_role_base, role},
        {int, pos},
        {int, status}                                       % 玩家状态，有需要通知客户端玩家状态的游戏，使用游戏内部定义的玩家状态
      ],
      % 玩家准备通知
      [notify_role_prepare,
        {uint64, role_id}
      ],

      [room_role_money,
        {uint64, role_id},
        {uint64, money}
      ],
      % 通知房间内所用玩家 玩家的钱币状态
      [notify_room_roles_money,
        {array, room_role_money, roles_money_list}
      ],

      % 游戏信息
      [room_game_info, {int, game_type}, {int, role_count}, {game_status, status}], % 游戏类型id, 游戏人数,游戏状态：0:正常，1:维护中
      % 房间配置
      [room_config,
        {int, room_id},                                     % 房间id
        {int, level},                                       % 0:体验房，其他:正常房间
        {int, type},                                        % 1:普通房间，2:比赛房间
        {int, play_type},                                   % 玩法
        {int64, club_id},                                   % 俱乐部id
        {int, game_type},                                   % 游戏类型
        {string, name},                                     % 房间名字
        {string, icon},                                     % 房间图标
        {int, min_bet},                                     % 房间底注
        {int, need_chip},                                   % 最小携带
        {int, max_chip},                                    % 最大携带
        {int, min_take},                                    % 买入下限
        {int, max_take},                                    % 买入上限
        {int, small_blind},                                 % 小盲
        {int, big_blind},                                   % 大盲
        {int, max_player},                                  % 最多玩家数量
        {int, desk_count},                                  % 桌子数量
        {int, role_count},                                  % 游戏人数
        {int, is_open},                                     % 0:未开启，1:开启
        {int, ip_limit},                                    % 是否限制ip，0:不限制，1:限制
        {array, int, extra1},                               % 房间配置1:房间配置中可以配置限红，筹码面额，房间开奖结果等，各游戏自己的配置
        {array, int, extra2},                               % 房间配置2
        {array, int, extra3}                                % 比赛配置
      ],

      % 请求游戏信息
      [req_room_game_info, {array, int, game_type_list}],
      % 返回游戏信息
      [notify_room_game_info, {array, room_game_info, game_info_list}],
      % 请求房间列表
      [req_room_list, {int, game_type}, {array, int, club_id}, {int, page_size}, {int, page_index}],
      % 返回房间列表
      [notify_room_list, {array, room_config, room_list}, {int, page_size}, {int, total_page}, {int, page_index}, {array, int, play_type}, {int, is_tournament}],
      % 请求房间信息
      [req_room_info, {int, room_id}],
      % 返回请求房间信息，玩家是否可以更新,是否获取成功
      [notify_room_info, {room_config, room_config}, {common_judge, can_update}, {common_result, result}],

      % 创建游戏房间
      [req_room_create,
        {int, type},                                        % 1:普通房间，2:比赛房间
        {int, play_type},                                   % 玩法
        {int64, club_id},                                   % 俱乐部id
        {int, game_type},                                   % 游戏类型
        {string, name},                                     % 房间名字
        {string, icon},                                     % 房间图标
        {int, min_bet},                                     % 房间底注
        {int, need_chip},                                   % 最小携带
        {int, max_chip},                                    % 最大携带
        {int, min_take},                                    % 买入下限
        {int, max_take},                                    % 买入上限
        {int, small_blind},                                 % 小盲
        {int, big_blind},                                   % 大盲
        {int, max_player},                                  % 最多玩家数量
        {int, desk_count},                                  % 桌子数量
        {int, ip_limit},                                    % 是否限制ip，0:不限制，1:限制
        {array, int, extra1},                               % 房间配置1:房间配置中可以配置限红，筹码面额，房间开奖结果等，各游戏自己的配置
        {array, int, extra2},                               % 房间配置2
        {array, int, extra3}                                % 比赛配置
      ],
      % 返回创建游戏信息
      [notify_room_create, {room_config, room}],

      % 删除游戏房间,返回所在游戏类型游戏列表
      [req_room_delete, {int, room_id}],

      % 可修改配置配置
      [room_update,
        {int, room_id},                                     % 房间id
        {string, name},                                     % 房间名字
        {string, icon},                                     % 房间图标
        {int, min_bet},                                     % 房间底注
        {int, need_chip},                                   % 最小携带
        {int, max_chip},                                    % 最大携带
        {int, min_take},                                    % 买入下限
        {int, max_take},                                    % 买入上限
        {int, small_blind},                                 % 小盲
        {int, big_blind},                                   % 大盲
        {int, ip_limit},                                    % 是否限制ip，0:不限制，1:限制
        {array, int, extra1},                               % 房间配置1:房间配置中可以配置限红，筹码面额，房间开奖结果等，各游戏自己的配置
        {array, int, extra2},                               % 房间配置2
        {array, int, extra3}                                % 比赛配置
      ],
      %solt中奖线
      [line_item,
        {int, line},                                        % 线
        {array, int, pos}                                   % 位置数组
      ],
      % 修改游戏房间,返回游戏列表
      [req_room_update, {room_update, config}],
      [notify_room_update, {room_config, room}],
      % 关闭游戏房间,返回所在游戏类型游戏列表
      [req_room_close, {int, room_id}],
      % 开启游戏房间,返回所在游戏类型游戏列表
      [req_room_open, {int, room_id}],
      % 判断是否自己在某个房间
      [req_room_current_desk, {int, room_id}],
      % 返回当前桌子id，如果没有在某个房间，则返回空字符串
      [notify_room_current_desk, {int, room_id}, {string, desk_id}],
      % 游戏中通知玩家上线
      [notify_room_role_online, {int64, role_id}],
      % 游戏中通知玩家离线
      [notify_room_role_offline, {int64, role_id}],
      % 返回上一次结果
      [notity_last_spin,
        {uint64, last_money},                               % 最后一把的金额，不管是免费还是付费,有其他额外将池也加在里面 <jackpot, bonus, 转盘，红利游戏等>
        {uint64, total_money},                              % 普通加免费所有的钱，如果没有免费，就和last_money相等,有其他额外将池也加在里面 <jackpot, bonus, 转盘，红利游戏等>
        {int, left_free_times},                             % 剩余免费次数, left_free_times 不为0，直接取last_money， 为0 取total_money
        {int, total_free_times},                            % 当前轮总共获取的免费次数
        {array, int, icon_list},                            % 最后一屏图标
        {array, line_item, lines}                           % 最后一屏中奖线<可选>
      ],
      % 设置押注信息
      [req_set_slots_bet,{slots_bet, bet_info}],
      % 返回设置状态 0失败 1成功
      [notity_set_slots_status, {int, status}],
      % 获取slots 押注配置信息
      [req_slots_bet_info, {int, room_id}],
      % 返回slots 押注配置信息
      [notify_slots_bet_info, {slots_bet_list, bet_list}],
      % slots 比赛参数
      [notify_game_slots_match_info,
        {int,rank},                                       % 排名
        {int,count},                                      % 剩余次数
        {int,remain_time},                                % 比赛剩余时间
        {int,countdown}                                   % 小于等于0就是已经开始可以比赛了 大于0就是开始比赛的倒计时
      ],
    %%%===================================================================================================
    %%% 刮刮乐相关协议
    %%%===================================================================================================
    [proto_lobby_scratch_2200],
    %%%===================================================================================================
    %%% 建议反馈相关协议
    %%%===================================================================================================
    [proto_lobby_suggest_2300],
      [req_suggest,
        {string, suggest}
      ],
      [notify_suggest,
        {common_result, result}
      ],

    %%%===================================================================================================
    %%% 新加救济金相关协议
    %%%===================================================================================================
    [proto_lobby_helpmoney_2400],
      % 获取救济金次数请求
      [req_help_money_info,
        {uint64, role_id}                                   % 角色ID
      ],
      % 获取救济金通知
      [notify_help_money_info,
        {int, left_count}                                   % 救济金剩余次数
      ],
      % 救济金领取请求
      [req_help_money_draw,
        {uint64, role_id}                                   % 角色ID
      ],
      % 救济金领取请求
      [notify_help_money_draw,
        {int, status},                                      % 状态
        {int64, score},                                     % 救济金奖励金币数
        {int, left_count}                                   % 救济金剩余次数
      ],

    %%%===================================================================================================
    %%% 返利相关协议
    %%%===================================================================================================
    [proto_lobby_returnmoney_2500],
      % 领取界面信息
      [req_role_return_money_info],
      [notify_role_return_money_info,
        {int64, self_money},                                % 自身返利
        {int64, spread_money}                               % 推广返利
      ],
      [req_get_role_return_money,
        {int, type}                                         % 请求领取 1:自身返利 2:推广返利
      ],
      [notify_get_role_return_money,
        {common_result, result}
      ],
      % 请求返池信息
      [req_return_money_info],
      [notify_return_money_info,
        {string, return_money}
      ],
      % 请求返池金币
      [req_get_return_money],
      [notify_get_return_money,
        {common_result, result}
      ],

    %%%===================================================================================================
    %%% 邀请升级为vip到期时间通知相关协议
    %%%===================================================================================================
    [proto_lobby_invitetimeout_2600],
    %%%===================================================================================================
    %%% 签到相关协议
    %%%===================================================================================================
    [proto_lobby_signin_2700],
      [sign_in_cfg,
        {int, bet},                                         % 每日有效投注额度
        {int, day},                                         % 单日奖励
        {int, week},                                        % 周奖励
        {int, month}                                        % 月奖励
      ],
      % 签到请求配置
      [req_sign_in_config],
      % 通知所有玩家签到奖励
      [notify_sign_in_list,
        {int, is_open},                                     % 1为开启
        {array, sign_in_cfg, sign_in_cfgs_0},               % 普通正式用户签到配置
        {array, int, sign_status},                          % 本月已签到的日期
        {int, add_sign_in},                                 % 补签额度
        {int, day_status},                                  % 日奖励状态 0未签到，1签到，2已领取
        {int, day_money},                                   % 日奖励
        {int, week_money},                                  % 周奖励
        {int, month_money},                                 % 月奖励
        {int64, cur_bet},                                   % 玩家的当天有效下注
        {int, used_bet},                                    % 当天已用下注
        {int, free},                                        % 是否可免流水签到0可以1不可以
        {stime, cur_time}                                   % 当前时间
      ],
      % 签到请求
      [req_sign_in,
        {stime, sign_date}
      ],
      [notify_sign_in,
        {int, result},                                      % 签到结果 0:成功 1:参数错误 2:已签到 3 下注未达到签到要求 4 IP 或 设备已签到
        {array, int, bonus}                                 % 0日奖励1周奖励2月奖励
      ],

    %%%===================================================================================================
    %%% 红包模块
    %%%===================================================================================================
    [proto_lobby_redpacket_2800],
      % 请求是否有开红包资格
      [req_whether_can_open_red_packet],
      % 通知是否能开红包
      [notify_whether_can_open_red_packet,
        {int, is_can_open}                                  % 是否能开红包,0不能开,1能开
      ],
      % 请求打开红包
      [req_open_red_packet],
      % 打开红包
      [notify_open_red_packet,
        {int64, money}                                      % 打开红包后获得的金币
      ],

    %%%===================================================================================================
    %%% 新春好礼活动
    %%%===================================================================================================
    [proto_lobby_rebate_2900],
      [rebate_item_bet,
        {int, gameType},
        {int64, money}                                      % 积分
      ],
      % 获取新春好礼数据
      [req_bet_rebate],
      % 新春好礼数据通知
      [notify_bet_rebate,
        {array, rebate_item_bet, today_rebate_item},        % 今天的返利数据
        {array, rebate_item_bet, yesterday_rebate_item},    % 昨天的返利数据
        {int, has_reward}                                   % 昨天是否已领取过奖励
      ],
      % 领取昨日奖励
      [req_rebate_getreward],
      % 新春好礼奖励通知
      [notify_rebate_getreward,
        {common_result, result},
        {int64, money}                                      % 奖励
      ],

      % Rebate All Event
      [rebate_all_item_bet,
        {string, gameType},
        {int64, money}
      ],

      [rebate_to_date,
        {int, rebate_date},
        {int64, rebate_money}
      ],

      [rebate_benefit_status,
        {int64, rebate_money},
        {int, has_reward}                                   % 0 = not available; 1 = claimed; 2 = expired
      ],

      [req_bet_rebate_all_info],
      [notify_bet_rebate_all_info,
        {rebate_to_date, first_rebate_benefit},
        {rebate_to_date, second_rebate_benefit},
        {rebate_to_date, third_rebate_benefit},
        {int64, total_rebate},
        {int, has_reward}                                   % 0 = not available; 1 = claimed
      ],

      [req_bet_rebate_all_details,
        {int, rebate_date}
      ],
      [notify_bet_rebate_all_details,
        {array, rebate_all_item_bet, today_rebate_item},
        {int64, total_rebate},
        {rebate_benefit_status, first_rebate_benefit},
        {rebate_benefit_status, second_rebate_benefit},
        {rebate_benefit_status, third_rebate_benefit}
      ],

      [req_rebate_all_getreward],

      [notify_rebate_all_getreward,
        {common_result, result},                            % 1 = success; 2 = failed
        {int64, money}
      ],

    %%%===================================================================================================
    %%% VIP Super Benefits
    %%%===================================================================================================
    [proto_lobby_rvipreward_3000],
      [vip_reward_status,
        {int, status},                                      % 0 = not available; 1 = ready to claim; 2 = already claimed
        {int64, money}
      ],
      [vip_level_config,
        {int, level},
        {int64, target_bet_money},
        {vip_reward_status, promotional_reward_status},
        {int64, gift_money_amount},
        {string, ratio}
      ],
      [req_vip_info],
      [notify_vip_info,
        {int64, total_bet_money},
        {int, current_vip_level},
        {int, last_month_vip_level},
        {vip_reward_status, gift_money_status},
        {vip_reward_status, holiday_reward_status},
        {int, mysterious_reward_status},                    % 1 = available; 0 = not available
        {array, vip_level_config, vip_level_reward_config},
        {int64, daily_rebate}
      ],
      [req_vip_claim_promotional_reward,
        {int, vip_level}
      ],
      [req_vip_claim_gift_money],
      [req_vip_claim_holiday_reward],
      [req_vip_claim_mysterious_reward],

      [notify_vip_claim_status,
        {common_result, result},                            % 1 = success; 2 = failed
        {int64, money}
      ],
      [req_vip_level],
      [notify_vip_level,
        {int, vip_level}
      ],
      % 购买vip
      [req_buy_vip],
      % 购买vip通知
      [notify_buy_vip,
        {int, result},
        {stime, time_out}                                   % 到期的时间
      ],
      % 领取签到额外奖励
      [req_get_signin_extra_reward,
        {int, type}                                         % 0日奖励1周奖励2月奖励
      ],
      % 领取签到额外奖励通知
      [notify_get_signin_extra_reward,
        {int, result},                                      % 0成功， 1没签到或者已经领取， 2下注额度无法领取,3没可周月奖金可领取
        {int, pos},                                         % 领取的是第几周
        {array, int, week_sta}                              % 周奖励状态:0未领取-1已领取
      ],

      [invite_role_data,
        {stime, create_time},                               % 角色创建时间
        {string, name},                                     % 角色昵称
        {uint64, role_id}                                   % 角色ID
      ],
      % 请求vip
      [req_invite_time_out2],
      % 返回到期时间
      [notify_invite_time_out2,
        {stime, time_out},
        {int, is_time_out},                                 % 0:没有过期 1:没有vip 2:过期
        {int, invite_count},                                % 邀请人数
        {array, invite_role_data, invite_data}              % 邀请明细
      ],
      % vip每日反水领取
      [req_vip_daily_claim],
      % vip反水记录
      [req_get_vip_rebate,
        {int, page},
        {int, type},                                        % 0全部/-1按厂商汇总/
        {stime, start_time},
        {stime, end_time},
        {int, number_per_page}                              % 每页显示的条数
      ],
      [vip_rebate_record,
        {uint64, bet_money},
        {uint64, rebate},
        {int, type},
        {int, status},
        {stime, create_time}
      ],
      [notify_get_vip_rebate,
        {int, total_page},
        {array, vip_rebate_record, record_list},
        {int, total_items}                                  % 记录总条数
      ],

      % 交个朋友SVIP
      % svip报名
      [req_svip_signup],
      [notify_svip_signup,
        {int, result}
      ],
      % 请求svip信息
      [req_svip_info],
      [notify_svip_info,
        {stime, start_time},                                % 活动开始时间
        {stime, end_time},                                  % 活动结束时间
        {stime, recharge_time},                             % 首充时间
        {int64, init_money},                                % 首充的奖励
        {int64, get_money},                                 % 当前可领取的奖励
        {int, svip_state}                                   % svip状态
      ],
      % svip领取奖励
      [req_svip_getreawrd],
      [notify_svip_getreawrd,
        {int, result},
        {int64, get_money}                                  % 当前领取的奖励
      ],
      % 请求活动红点提示
      [req_get_red_point],
      % 返回到期时间
      [notify_get_red_point,
        {array, int, red_point_array}                       % 红点提示
      ],
      % 请求体验房在线时长
      [req_get_exp_room_time],
      % 返回到期时间
      [notify_get_exp_room_time,
        {int, times},                                       % 在线多长时间
        {int, is_end}                                       % 当天是否达到了体验时间限制
      ],

    %%%===================================================================================================
    %%% 大玩家商城界面相关
    %%%===================================================================================================
    [proto_lobby_agentlist2_3100],
      [agent_item2,
        {uint64, role_id},
        {string, head_icon},
        {string, nickname},
        {int64, money},
        {string, signature},
        {string, weixin_id},
        {int, sex},
        {string, qq}
      ],
      [req_agent_list2],
      [notify_agent_list2,
        {array, agent_item2, agent_list}
      ],

    %%%===================================================================================================
    %%% 圣诞活动相关协议
    %%%===================================================================================================
    [proto_lobby_christmas_3200],
      [christmas_rank_data,
        {string, name},                                     % 角色昵称
        {uint64, role_id},                                  % 角色ID
        {string, head_icon},                                % 头像id
        {int64, money}                                      % 奖励
      ],
      % 获取圣诞活动信息
      [req_christmas_info],
      [notify_christmas_info,
        {stime, start_time},                                % 活动开始时间
        {stime, end_time},                                  % 活动结束时间
        {int, is_open}                                      % 活动是否显示
      ],
      % 通知所有玩家倒计时开始
      [notify_christmas_countdown],
      % 圣诞活动点击飘花
      [req_christmas_hit],
      [notify_christmas_hit],
      % 通知所有玩家得到奖励
      [notify_christmas_reward,
        {int64, get_money},                                 % 当前领取的奖励
        {array, christmas_rank_data, rank_data}             % 活动奖励排行数据
      ],

    %%%===================================================================================================
    %%% 幸运转盘活动
    %%%===================================================================================================
    [proto_lobby_luckyroulette_3300],
      [lucky_roulette_record,
        {string, name},                                     % 角色昵称
        {string, win},                                      % 奖励物品(可能是卡或者金币)
        {stime, update_time}                                % 抽奖时间
      ],
      % 获取转盘信息请求
      [req_lucky_roulette_info],
      [action_info,
        {int, require_times},                               % 要求次数
        {int, done_times}                                   % 完成次数
      ],
      % 获取转盘信息通知
      [notify_lucky_roulette_info,
        {int, is_open},                                     % 活动是否显示
        {int, result},                                      % 剩余次数
        {stime, start_time},                                % 活动开始时间
        {stime, end_time},                                  % 活动结束时间
        {int, latest_id},                                   % 高分记录中的最新ID（根据此ID请求最新大奖数据）
        {array, action_info, task_detail},                  % 分别是下注、充值、邀请好友
        {array, lucky_roulette_record, my_list},            % 个人记录
        {array, lucky_roulette_record, record_list}         % 高分记录
      ],
      % 转盘开始请求
      [req_lucky_roulette_start,
        {uint64, role_id}                                   % 角色ID
      ],
      % 转盘开始通知
      [notify_lucky_roulette_reward,
        {int, result},
        {int, item_no},                                     % 奖项ID(与后台配置文件对应)
        {string, win}                                       % 奖励物品
      ],
      % 立即通知用户获得了抽奖机会
      [notify_lucky_roulette_got_chance,
        {int, result}
      ],
      % 请求1条最新大奖记录
      [req_lucky_roulette_latest_record,
        {int, record_id}
      ],
      % 通知最新高分记录
      [notify_lucky_roulette_latest_record,
        {lucky_roulette_record, new_record},
        {int, latest_id}                                    % 高分记录中的最新ID（根据此ID请求最新大奖数据）
      ],

    %%%===================================================================================================
    %%% 背包协议
    %%%===================================================================================================
    [proto_lobby_bag_3400],
      [bag_item,
        {int, id},                                          % 物品的编号
        {int, item_id},                                     % 物品的类型
        {int, count},
        {int, info1},
        {int, info2},
        {int, info3},
        {int, info4},
        {int, info5}
      ],
      % 请求玩家背包数据
      [req_role_bag],
      % 玩家背包数据通知
      [notify_role_bag,
        {array, bag_item, items}
      ],
      % 请求使用物品,这里并不会直接把物品减掉，而是服务器会做一个使用的标记，然后真正服务器操作完后再去扣掉物品
      [req_use_item,
        {int, id},
        {int, count}
      ],
      % 玩家背包数据通知
      [notify_use_item,
        {common_result, result},                            % 1=>成功，2=>失败
        {bag_item, item}
      ],

    %%%===================================================================================================
    %%% 新的兑换码协议
    %%%===================================================================================================
    [proto_lobby_exchange_3500],
      % 请求兑换码兑换
      [req_exchange,
        {string, code}                                      % 兑换码
      ],
      % 请求兑换码通知
      [notify_exchange,
        {int, result},                                      % 结果值
        {int, code_type},                                   % 兑换的物品类型  1=>直接兑换成分数, 2=>兑换成游戏礼品卡
        {int64, money},                                     % 兑换的分数,或游戏礼品卡的面额
        {int, game_type},                                   % 指定游戏礼品卡的游戏类型
        {int, count}                                        % 指定游戏礼品卡的数量
      ],

    %%%===================================================================================================
    %%% 首充X3活动
    %%%===================================================================================================
    [proto_lobby_firstrecharge_3600],
      % 获取转盘信息请求
      [req_first_recharge_info],
      % 获取转盘信息通知
      [notify_first_recharge_info,
        {int, is_open},                                     % 活动是否显示
        {stime, start_time},                                % 活动开始时间
        {stime, end_time},                                  % 活动结束时间
        {array, int, process},                              % 当前任务进度（1~6）0未完成/1完成未领取/2已领取
        {uint64, amount},                                   % 首充金额
        {uint64, turnover},                                 % 用户当前流水
        {int, left_time},                                   % 任务剩余时间
        {array, int, prize_ratio},                          % 奖项比例
        {array, int, turnover_times}                        % 后三项的流水倍数
      ],
      % 领取活动奖励请求
      [req_first_recharge_start,
        {int, taskID}                                       % 任务序号
      ],
      % 领取活动奖励通知
      [notify_first_recharge_reward,
        {int, result},
        {uint64, money}                                     % 奖励金额
      ],
      % 查询是否显示转盘活动
      [req_first_recharge_show],
      % 是否显示转盘活动
      [notify_first_recharge_show,
        {int, show}                                         % 1显示，0不显示
      ],
      %查询首充x3/首存100状态
      [req_first_recharge_status],
      [notify_first_recharge_status,
        {int, status}                                       % 0可参与x3或100/1已参与x3/2可参与100/3都不能参与
      ],

    %%%===================================================================================================
    %%% 设置邀请码
    %%%===================================================================================================
    [proto_lobby_invitecode_3700],
      % 请求设置邀请码
      [req_set_invitecode,
        {string, superior_id}                               % 上级Id
      ],

      % 请求强制刷新分数
      [req_refresh_money],

    %%%===================================================================================================
    %%% 中奖100%活动
    %%%===================================================================================================
    [proto_lobby_win100_3800],
      % 请求参与分享
      [req_win_100_share],
      % 参与分享结果
      [notify_win_100_share,
        {int, rlt}                                          % 0成功，1失败
      ],

    %%%===================================================================================================
    %%% 游戏礼品卡相关协议%活动
    %%%===================================================================================================
    [proto_lobby_gamecard_3900],
      % 请求游戏卡还差多少分
      [req_game_card_leftscore,
        {int, game_type}                                    % 当前所在的子游戏类型
      ],
      [notify_game_card_leftscore,
        {int, leftscore}                                    % 游戏卡还差多少分, >0表示还差的分数，=-1并且客户端标记当前是从游戏卡进入的，就提示:恭喜您已达成目标
      ],

    %%%===================================================================================================
    %%% 新手任务
    %%%===================================================================================================
    [proto_lobby_newbees_4000],
      % 新手任务信息
      [req_newbees_info],
      % 通知新手任务
      [notify_newbees_info,
        {int, is_open},                                     % 活动是否显示
        {stime, start_time},                                % 活动开始时间
        {stime, end_time},                                  % 活动结束时间
        {int, is_follow_fb},                                % 是否关注facebook
        {int, is_follow_fb_group},                          % 是否关注facebook群组
        {int, is_follow_tg_group},                          % 是否关注tg群组
        {int, is_bind_card},                                % 是否绑定银行卡
        {int64, amount},                                    % 奖金
        {int, status}                                       % 0未参与，1待领奖, 2已参与
      ],
      % 请求领奖
      [req_newbees_prize],
      % 通知领奖
      [notify_newbees_prize,
        {int, rlt}                                          % 0成功，1失败
      ],
      % 联系客服，在后台生成一条审核记录
      [req_contact_customer_service],
      % 插入审核记录是否成功
      [notify_contact_customer_service,
        {int, rlt}                                          % 0成功，1失败
      ],

    %%%===================================================================================================
    %%% 礼品卡相关协议
    %%%===================================================================================================
    [proto_lobby_giftcard_4100],
      % 客户端请求礼品卡剩余分数
      [req_game_giftcard_remainpoints,
        {int, game_type}                                    % 当前所在的子游戏类型
      ],
      [notify_game_giftcard_remainpoints,
        {int, remainpoints}                                 % 通知客户端礼品卡当前剩余分数
      ],

    %%%===================================================================================================
    %%% 福龙临门活动
    %%%===================================================================================================
    [proto_lobby_fllm_4200],
      % 玩家领取奖励
      [req_fllm_reward],
      [notify_fllm_reward,
        {int, rlt}
      ],

    %%%===================================================================================================
    %%% 龙年生财活动
    %%%===================================================================================================
    [proto_lobby_guaguacard_4300],
      [guaguacard_record,
        {int, card1state},                                  % 刮刮卡1的状态
        {int, card2state},                                  % 刮刮卡2的状态
        {int, card3state},                                  % 刮刮卡3的状态
        {int, card1content},                                % 刮刮卡1的奖励内容
        {int, card2content},                                % 刮刮卡2的奖励内容
        {int, card3content},                                % 刮刮卡3的奖励内容
        {stime, card1opentime},                             % 如果卡1的状态为1表示以开奖，则填充刮奖的时间；如果是倒计时状态，则填写到期时间
        {stime, card2opentime},                             % 如果卡1的状态为2表示以开奖，则填充刮奖的时间；如果是倒计时状态，则填写到期时间
        {stime, card3opentime}                              % 如果卡1的状态为3表示以开奖，则填充刮奖的时间；如果是倒计时状态，则填写到期时间
      ],
      % 浇水竞赛
      [watering_record,
        {int64, role_id},                                   % 玩家角色ID
        {string, nickname},                                 % 玩家昵称
        {string, head_photo},                               % 头像id
        {int, level},                                       % 玩家等级
        {int, watering_count},                              % 浇水次数
        {int, rank}                                         % 玩家排名(如果为0表示不在排行榜)
      ],
      % 领水滴
      [get_water_record,
        {int, task_id},                                     % 任务ID
        {int, state},                                       % 1表示可以领取，2表示需要去完成任务，3表示全部任务已经完成并且全部领取完毕
        {int, complete_count},                              % 当前完成局数
        {int, total_count},                                 % 总需要的局数
        {int, water_count_from},                            % 领取水滴数量区间的开始
        {int, water_count_to},                              % 领取水滴数量区间的结束
        {int, ready_num},                                   % 可领取次数
        {string, task_desc}                                 % 任务描述
      ],
      % 摇钱树升级条件
      [tree_upgrade_record,
        {int, level},                                       % 摇钱树等级
        {int, water_count},                                 % 水量要求
        {int, fertilizer_count},                            % 化肥要求
        {int, reward}                                       % 奖励金额
      ],
      % 获取摇钱树信息请求
      [req_dragon_fortune_info],
      % 获取摇钱树信息通知
      [notify_dragon_fortune_info,
        {int, is_open},                                     % 活动是否显示
        {stime, start_time},                                % 活动开始时间
        {stime, end_time},                                  % 活动结束时间
        {int, level},                                       % 发财树当前等级
        {int, level_reward},                                % 发财树当前等级未领取的奖励金币
        {int, watering_count},                              % 浇水次数
        {int, fertilize_count},                             % 施肥次数
        {array, tree_upgrade_record, tree_upgrade},         % 摇钱树升级条件列表
        {int, left_fertilizer_count},                       % 剩余化肥数量
        {int, left_water_count},                            % 剩余水滴数量
        {int, invite_reward_type},                          % 弹窗类型，0表示不弹窗，1表示弹出邀请好友领取一袋化肥的窗口，2表示当天充值30w起领取一袋化肥窗口，3表示邀请好友并且充值30w起领取两袋化肥，4表示弹出领取礼包的窗口
        {string, nickname},                                 % 被邀请玩家昵称，如果是化肥窗口则表示第一个好友的昵称，如果是大礼包窗口则表示第二个好友的昵称
        {guaguacard_record, card_record}                    % 刮刮卡信息
      ],
      % 刮刮卡刮奖
      [req_dragon_fortune_open_guaguacard,
        {int, cardid}                                       % 第几张刮刮卡刮奖
      ],
      % 刮刮卡刮奖结果通知
      [notify_dragon_fortune_open_guaguacard,
        {guaguacard_record, card_state},                    % 刮奖后刮刮卡状态
        {int, left_water_count},                            % 当前水滴存量
        {int, result}                                       % 状态结果，1成功，2失败
      ],
      % 施肥和浇水
      [req_dragon_fortune_fertilize_watering,
        {int, type},                                        % 用于区分施肥还是浇水，1表示施肥，2表示浇水
        {int, count}                                        % 施肥或者浇水次数
      ],
      % 施肥和浇水结果通知
      [notify_dragon_fortune_fertilize_watering,
        {int, left_fertilizer},                             % 化肥存量
        {int, left_water_count},                            % 水滴存量
        {int, tree_level},                                  % 发财树当前等级,判断发财树是否已经升级，如果升级了通知客户端升到下一级
        {int, fertilize_count},                             % 发财树施肥次数
        {int, watering_count},                              % 发财树浇水次数
        {int, level_reward},                                % 发财树当前等级未领取的奖励金币
        {int, result}                                       % 状态结果，1成功，2失败
      ],
      % 浇水竞赛
      [req_dragon_fortune_watering_competition],
      % 浇水竞赛结果通知
      [notify_dragon_fortune_watering_competition,
        {array, watering_record, watering_list},            % 浇水竞赛排名
        {int, remain_seconds}                               % 剩余时间
      ],
      % 助力加速
      [req_dragon_fortune_invite_friend],
      % 助力加速结果通知
      [notify_dragon_fortune_invite_friend,
        {int, friend_count},                                % 邀请好友并充值的数量
        {int64, role_id1},                                  % 被邀请玩家1角色ID
        {string, nickname1},                                % 被邀请玩家1昵称
        {string, head_photo1},                              % 被邀请玩家1头像id
        {int64, role_id2},                                  % 被邀请玩家2角色ID
        {string, nickname2},                                % 被邀请玩家2昵称
        {string, head_photo2}                               % 被邀请玩家2头像id
      ],
      % 领取水滴列表
      [req_dragon_fortune_get_water_list],
      % 领取水滴列表结果通知
      [notify_dragon_fortune_get_water_list,
        {array, get_water_record, water_task}               % 领水滴任务
      ],
      % 领取水滴
      [req_dragon_fortune_get_water,
        {int, task_id}                                      % 任务ID
      ],
      % 领取水滴结果通知
      [notify_dragon_fortune_get_water,
        {int, water_count},                                 % 领取的水滴数量(数量为0表示失败)
        {int, left_water_count},                            % 领取后水滴存量
        {int, state},                                       % 1表示可以领取，2表示需要去完成任务，3表示全部任务已经完成并且全部领取完毕
        {array, int, state_arr}                             % 一键领取返回所有的任务状态
      ],
      % 领化肥列表
      [req_dragon_fortune_get_fertilizer_list],
      % 领化肥列表结果通知
      [notify_dragon_fortune_get_fertilizer_list,
        {array, get_water_record, fertilizer_task}          % 领化肥任务
      ],
      % 当天邀请一位好友领化肥或者当天充值成功1次（金额30w起）
      [req_dragon_fortune_get_fertilizer,
        {int, reward_type},                                 % 弹窗类型，0表示不弹窗，1表示弹出邀请好友领取一袋化肥的窗口，2表示当天充值30w起领取一袋化肥窗口，3表示邀请好友并且充值30w起领取两袋化肥，4表示弹出领取礼包的窗口
        {int, task_id}
      ],
      % 邀请一位好友领化肥结果通知
      [notify_dragon_fortune_get_fertilizer,
        {int, fertilizer_count},                            % 领化肥数量
        {int, left_fertilizer_count},                       % 领取后化肥存量
        {int, is_get_gift},                                 % 领取化肥后通知客户端是否还有大礼包需要领取，0表示没有，1表示有
        {string, nickname2},                                % 如果还有大礼包需要领取，则填写被邀请玩家2昵称
        {int, result}                                       % 状态结果，1成功，2失败
      ],
      % 邀请两位好友获取随机大礼
      [req_dragon_fortune_invite_friend_get_gift,
        {int, reward_type},                                 % 弹窗类型，0表示不弹窗，1表示弹出邀请好友领取一袋化肥的窗口，2表示当天充值30w起领取一袋化肥窗口，3表示邀请好友并且充值30w起领取两袋化肥，4表示弹出领取礼包的窗口
        {int, task_id}
      ],
      % 邀请两位好友获取随机大礼结果通知
      [notify_dragon_fortune_invite_friend_get_gift,
        {int, gift_type},                                   % 礼物类型，1为水滴，2为金币，3为充赠卡
        {int, gift_count},                                  % 礼物数量
        {int, left_water_count},                            % 如果为水滴，则表示领取水滴后的水滴存量
        {int, result}                                       % 状态结果，1成功，2失败
      ],
      % 发财树升级后领取金币的动作
      [req_dragon_fortune_get_reward,
        {int, reward_count}                                 % 需要领取的金币的数量
      ],
      % 发财树升级后领取金币的结果通知
      [notify_dragon_fortune_get_reward,
        {int, level},                                       % 发财树下一个需要领取的等级
        {int, watering_count},                              % 浇水次数
        {int, fertilize_count},                             % 施肥次数
        {int, level_reward},                                % 发财树当前等级未领取的奖励金币，如果有则填写奖励金额，如果没有则填写0
        {int, result}                                       % 状态结果，1成功，2失败
      ],
      % 龙年生财领取通知
      [req_dragon_fortune_claim_info],
      [notify_dragon_fortune_claim_info,
        {int, gift_type}                                    % 1为可领取，0不可领取
      ],

    %%%===================================================================================================
    %%% 无尽代理每日反水
    %%%===================================================================================================
    [proto_lobby_dailyreturn_4400],
      [req_daily_return_info],
      [notify_daily_return_info,
        {int, level},                                       % 代理等级
        {string, ratio},                                    % 赌场分成
        {int64, personal_money},                            % 直属佣金
        {int64, team_money},                                % 团队佣金
        {string, s_link},                                   % 推广链接
        {int, count}                                        % 邀请人数
      ],
      [req_daily_return_claim],
      [notify_daily_return_claim,
        {int, result}                                       % 状态结果，0成功，1失败
      ],
      [daily_return_record,
        {int64, role_id},
        {int, level},
        {int, team_num},
        {int64, personal_bet},
        {int64, team_bet},
        {int64, personal_return},
        {int64, team_return},
        {string, username}
      ],
      % 请求返点历史记录
      [req_daily_return_his,
        {string, search_name},                              % 搜索会员账号,0为不指定
        {int, search_lev},                                  % 搜索会员层级,0为不指定
        {stime, start_time},                                % 活动开始时间
        {stime, end_time},                                  % 活动结束时间
        {int, page}
      ],
      [notify_daily_return_his,
        {array, daily_return_record, records},
        {int, total}
      ],
      % 请求提升代理层级
      [req_improve_agent_lev,
        {string, role_id},
        {int, level}                                        % 目标等级
      ],
      [notify_improve_agent_lev,
        {int, result}                                       % 状态结果，0成功，1失败
      ],
      
      %%改版界面协议=======================
      % 代理链接
      [req_agent_link_info],
      [notify_agent_link_info,		
        {int, level},                                       % 代理等级
        {int, agent_ratio},                                 % 代理返点率
        {int, invite_code},                                 % 邀请码   
        {int64, personal_money},                            % 直属佣金
        {int64, team_money},                                % 团队佣金
        {string, superior_name},                            % 上级名字
        {int, superioro_type},                              % 上级类型 0官方1代理2玩家
        {string, s_link},                                   % 推广链接
        {int, count}                                        % 团队人数
      ],
      % 数据汇总
      [req_summary_info,
        {stime, start_time},                                % 开始时间
        {stime, end_time}                                   % 结束时间
      ],
      [notify_summary_info,
        {int, new_direct},                                  % 直属新增
        {int, deposit_num_direct},                          % 直属充值人数
        {int, deposit1_num_direct},                         % 直属首充人数
        {int64, deposit_direct},                            % 直属充值金额
        {int64, deposit1_direct},                           % 直属首充金额
        {int64, withdraw_direct},                           % 直属提现金额
        {int64, bet_direct},                                % 直属有效投注
        {int64, netwin_direct},                             % 直属输赢金额
        {int64, return_direct},                             % 直属佣金
        {int, new_team},                                    % 团队新增
        {int, deposit_num_team},                            % 团队充值人数
        {int, deposit1_num_team},                           % 团队首充人数
        {int64, deposit_team},                              % 团队充值金额
        {int64, deposit1_team},                             % 团队首充金额
        {int64, withdraw_team},                             % 团队提现金额
        {int64, bet_team},                                  % 团队有效投注
        {int64, netwin_team},                               % 团队输赢金额
        {int64, return_team},                               % 团队佣金	
        {int64, deposit},                                   % 累计充值
        {int64, bet},                                       % 累计有效投注
        {int64, netwin},                                    % 累计输赢
        {int64, return}                                     % 累计佣金
      ],
      %我的佣金
      [req_my_return,
        {int, page},
		{int, pageSize},
        {stime, start_time},                                % 开始时间
        {stime, end_time}                                   % 结束时间
      ],
      [my_return_info,
        {int, type},                                        % 类型
        {int64, bet},                                       % 有效投注
        {int64, netwin},                                    % 输赢
        {int64, return},                                    % 佣金
        {string, win_date}                                  % 结算日期
      ],
      [notify_my_return,
        {int, total},
        {array, my_return_info, info}
      ],
      [notify_my_return_f,
        {int, total},
        {int64, bet_sum},                                   % 有效投注
        {int64, netwin_sum},                                % 输赢
        {int64, return_sum},                                % 佣金
        {array, my_return_info, info}
      ],
      % 直属/团队数据
      [req_follower_detailed_info,
        {int, page},
		{int, pageSize},
        {int, type},                                        % 0为直属1为团队
        {string, user_name},                                % 会员账号
        {stime, start_time},                                % 开始时间
        {stime, end_time}                                   % 结束时间
      ],
      [follower_detailed_info,
	    {int64, role_id},                                   % 会员账号
        {string, user_name},                                % 用户名
        {int, vip_level},                                   % 会员等级
        {int, agent_level},                                 % 代理等级
        {int, count},                                       % 下级人数
        {int, status},                                      % 状态
        {int64, bet},                                       % 有效投注
        {int64, deposit},                                   % 充值
        {int64, return},                                    % 佣金
        {string, login_date},                               % 最后登录日期
        {string, register_date}                             % 注册日期
      ],
      [notify_follower_detailed_info,
        {int, total},
        {array, follower_detailed_info, info}
      ],
      [notify_follower_detailed_info_f,
        {int, total},
        {int, new},                                         % 新增
        {int, deposit_num},                                 % 充值人数
        {int, deposit1_num},                                % 首充人数
        {int64, deposit},                                   % 充值金额
        {int64, bet},                                       % 有效投注
        {array, follower_detailed_info, info}
      ],
      % 游戏分类返点率(1电子 2捕鱼 3视讯 4体育 5棋牌 6彩票  7俱乐部)
      [req_agent_return_ratio
      ],
      [notify_agent_return_ratio,
        {string, ratio}
      ],
      % 给下级设置代理返佣比
      [req_set_agent_ratio,
        {string, user_name},                                % 会员账号
        {int, ratio}
      ],
      [notify_set_agent_ratio,
        {int,rlt}                                           % 0成功，1失败
      ],
	  % 某个代理的返点率
      [req_player_return_ratio,
        {int64, role_id}
      ],
      [notify_player_return_ratio,
        {int, agent_ratio}                                 % 代理返点率
      ],

    %%%===================================================================================================
    %%% 投注记录
    %%%===================================================================================================
    [proto_lobby_betrecord_4500],
      [bet_record,
        {string, platform_id},                              % 所属平台
        {string, game_type},                                % 游戏名称
        {int64, bet_total},                                 % 投注金额
        {int64, net_value},                                 % 输赢
        {string, video},                                    % 录像id
        {stime, balance_time}                               % 结算时间
      ],
      % 获取投注记录
      [req_get_bet_record_list,
        {string, platform_id},                              % 所属平台
        {string, game_type},                                % 游戏名称
        {string, play_type},                                % 玩法
        {stime, start_time},                                % 记录开始时间
        {stime, end_time},                                  % 记录结束时间
        {int, page_num},                                    % 页码，也就是客户端传过来的第几页，从第一页开始
        {int, page},                                        % 页码，也就是客户端传过来的第几页，从第一页开始，web端为了统一用page名称而专门额外增加这个字段，含义跟page_num相同
        {int, number_per_page}                              % 每一页显示的条数
      ],
      [notify_get_bet_record_list,
        {int, total_pages},                                 % 查询到的总页数
        {array, bet_record, bet_record_list},               % 点击查询，返回查询到的结果的第一页给客户端，每页显示20条记录
        {int64, total_bet},                                 % 查询条件范围内的总投注
        {int64, total_net_value},                           % 查询条件范围内的总输赢
        {int, total_items}                                  % 记录总条数
      ],
      % 投注记录翻页，上一页或者下一页
      [req_get_bet_record_list_by_page,
        {int, page_num}                                     % 页码，也就是客户端传过来的第几页，从第一页开始
      ],
      [notify_get_bet_record_list_by_page,
        {array, bet_record, bet_record_list}                % 查询到的第几页的记录结果
      ],

    %%%===================================================================================================
    %%% 代理转账
    %%%===================================================================================================
    [proto_lobby_agenttrans_4600],
      [req_agent_trans,
        {uint64, amount},
        {string, name}                                      % 会员账号
      ],
      [notify_agent_trans,
        {int,rlt}                                           % 0成功，1失败
      ],

    %%%===================================================================================================
    %%% 活动页面
    %%%===================================================================================================
    [proto_lobby_activites_4700],
      % 获取活动列表
      [req_activites,
        {int, show}                                         % 0所有活动，1自己可以参与的
      ],
      % 活动详情
      [activity_info,
        {int, id},                                          % 定制活动为8001:首存X3',8002:存款100%，9020:签到 10005:新手任务，等，更多活动和服务器沟通，为0代表普通活动
        {string, tag},                                      % 活动标签:多语言backend.json字段，洗码：xima，代理：agent，首存：first_recharge，二存：second_recharge，复活金：dole，预热：preview
        {string, pic_link},                                 % 图片地址:多语言backend.json字段
        {string, name},                                     % 活动名字:多语言backend.json字段
        {string, restrict},                                 % 场馆限制:多语言backend.json字段
        {string, content},                                  % 活动内容:多语言backend.json字段
        {string, details},                                  % 活动细则:多语言backend.json字段
        {string, rules},                                    % 规则条款
        {uint64, total},                                    % 总量
        {uint64, current},                                  % 当前投注量
        {uint64, bonus},                                    % 奖励金额
        {string, have_save},                                % 是否带复活金0不带，1带
        {int, status},                                      % 0未参加，1已参加 2设备已参加
        {int, join}                                         % 0可参加1不可参加
      ],
      % 返回活动列表
      [notify_activites,
        {array, activity_info, promo}
      ],
      % 查询优惠活动的赠送金额
      [req_activity_bonus,
        {int, activity_ID}
      ],
      [notify_activity_bonus,
        {int, join},                                        % (在bonus为0时)0可参加1不可参加且未充过值2不可参加充过值
        {uint64, bonus}
      ],
      %%查询优惠活动的复活金
      [req_activity_save_money,
        {int, activity_ID}
      ],
      [notify_activity_save_money,
        {int, join},                                        % （(在未参加时)）0可参加1不可参加
        {int, status},                                      % 0未参加，1已参加未触发，2已触发,3已领取
        {string,email_id},
        {uint64, bonus}
      ],

    %%%===================================================================================================
    %%% 平台列表和游戏类型列表
    %%%===================================================================================================
    [proto_lobby_platrec_4800],
      [req_platform_gametype_list,
        {stime, start_time},
        {stime, end_time}
      ],
      [notify_platform_gametype_list,
        {array, string, plat_rec_list},
        {array, string, gtype_rec_list}
      ],
      % 获取代理账变记录
      [req_get_agent_accounting_change,
        {int, page},
        {stime, start_time},
        {stime, end_time},
        {int, type},
        {int, number_per_page}                              % 每页显示的条数
      ],

      % 获取稽核记录
      [req_get_audit_record,
        {int, page},
        {stime, start_time},
        {stime, end_time},
        {int, type},                                        % 0所有，1进行中，2已完成
        {int, number_per_page}                              % 每页显示的条数
      ],
      [audit_record,
        {string, title},
        {uint64, amount},
        {uint64, progess},
        {int, type},
        {stime, create_time}
      ],
      [notify_get_audit_record,
        {int, total_page},
        {array, audit_record, record_list},
        {int, total_items}                                  % 记录总条数
      ],
      [agent_accounting_change_record,
        {int, type},                                        % 1增加，2为减少
        {uint64, pay_money},
        {int, item},                                        % 1为游戏钱包，2为中心钱包
        {string, trans_to},                                 % 转账对象
        {stime, create_time}
      ],
      [notify_get_agent_accounting_change,
        {int, total_page},
        {array, agent_accounting_change_record, record_list},
        {int, total_items}                                  % 记录总条数
      ],

    %%%===================================================================================================
    %%% 俱乐部
    %%%===================================================================================================
    [proto_lobby_club_4900],
      % 创建俱乐部
      [club_info_record,
        {int, club_id},                                     % 俱乐部ID
        {string, club_name},                                % 俱乐部名称
        {string, club_logo},                                % 俱乐部logo图片url地址
        {int, is_official},                                 % 是否官方俱乐部，0为非官方，1为官方
        {string, club_intro},                               % 俱乐部简介
        {int, is_admin},                                    % 是否管理员，0为非管理员，1为管理员
        {int, table_count},                                 % 牌局(即桌子)的数量，一个房间可以有一张或者多张桌子
        {int, is_creator},                                  % 是否是俱乐部创建者，0为非创建者，1为创建者
        {int, totalmember},                                 % 俱乐部成员人数
        {int, is_timeout}                                   % 加入俱乐部的时间是否超过72小时
      ],
      [member_info,
        {uint64, role_id},
        {string, username},
        {string, head_photo},                               % 会员的头像
        {int, level},
        {int, is_admin},                                    % 是否管理员
        {int, is_club_creator}                              % 是否俱乐部创建者
      ],
      [member_state,
        {uint64, role_id},
        {string, username},
        {string, head_photo},                               % 会员的头像
        {int, level},
        {int, approval_state}                               % 会员的审批状态
      ],
      [club_game_info,
        {int, game_type},                                   % 游戏名称
        {string, game_icon},                                % 游戏图标H5
        {int, game_lock_status},                            % 游戏是否开启
        {int, game_table_count},                            % 游戏牌局数量
        {int, room_id},                                     % 房间ID
        {string, game_intro},                               % 游戏介绍
        {string, game_icon_pc}                              % 游戏图标PC
      ],
      % 桌子的信息
      [desk_info,
        {int, room_id},                                     % 房间ID
        {int, game_type},                                   % 游戏名称
        {string, name},                                     % 由牌局名称和牌桌ID组成：牌局名称-牌桌id
        {uint64, min_bet},                                  % 房间底注
        {uint64, need_chip},                                % 最低入场金额
        {uint64, min_money},                                % 德州填写小盲注；跑得快填写房间底注；21点填写最低投注限额
        {uint64, max_money},                                % 德州填写大盲注；跑得快无需填写，默认为0；21点填写最高投注限额
        {string, game_logo},                                % h5游戏logo
        {string, game_logo_pc},                             % pc游戏logo
        {int, role_count},                                  % 当前桌子人数
        {int, max_player},                                  % 桌子最大人数
        {int, desk_state},                                  % 桌子状态，0表示开启，1表示停止
        {int, play_type},                                   % 玩法
        {int, min_take},                                    % 买入下限
        {int, max_take},                                    % 买入上限
        {int, small_blind},                                 % 小盲
        {int, big_blind}                                    % 大盲
      ],
      % 创建俱乐部
      [req_create_club,
        {string, club_name},                                % 俱乐部名称
        {string, club_introduction},                        % 俱乐部简介
        {string, club_logo}                                 % logo图片的url地址
      ],
      [notify_create_club,
        {int, result},
        {int, club_id}                                      % 俱乐部ID
      ],
      % 解散俱乐部
      [req_disband_club,
        {int, club_id}                                      % 俱乐部ID
      ],
      [notify_disband_club,
        {int, result}
      ],
      % 修改俱乐部信息
      [req_modify_club_info,
        {int, club_id},                                     % 俱乐部ID
        {string, club_name},                                % 俱乐部名称
        {string, club_intro},                               % 俱乐部简介
        {string, club_logo}                                 % 俱乐部头像
      ],
      [notify_modify_club_info,
        {int, result}
      ],
      % 获取创建和加入的俱乐部列表
      [req_get_club_list,
        {int, type},                                        % 0表示查询玩家创建和加入的俱乐部，1表示查询所有俱乐部
        {int, page},                                        % 页码，从第一页开始
        {int, page_size}                                    % 每页显示的条数
      ],
      [notify_get_club_list,
        {array, club_info_record, created_club_list},       % 创建的俱乐部列表
        {array, club_info_record, joined_club_list},        % 加入的俱乐部列表
        {int, total},                                       % 查询到的总条数
        {array, club_info_record, all_club_list}            % 所有俱乐部的列表
      ],

      % 获取俱乐部的信息
      [req_get_club_info,
        {int, club_id}                                      % 俱乐部ID
      ],
      [notify_get_club_info,
        {int, club_id},
        {string, club_logo},                                % 俱乐部logo
        {string, club_name},
        {string, club_introduction},
        {int, is_official},                                 % 是否官方俱乐部，0为非官方，1为官方
        {int, is_admin},                                    % 是否是俱乐部管理员，0为普通会员，1为管理员
        {int, is_creator},                                  % 是否是俱乐部创建者，0为非创建者，1为创建者
        {int, is_audit},                                    % 是否免审核，0为免审核，1为审核
        {int, is_create_table},                             % 是否允许管理员创建牌局，0为不允许，1为允许
        {int, totalmember},                                 % 俱乐部成员人数
        {array, member_info, userinfo},                       % 俱乐部成员的信息
        {array, club_game_info, gamelist}                   % 俱乐部拥有的游戏列表
      ],
      % 获取俱乐部的其它信息
      [req_get_extra_club_info,
        {int, club_id}                                      % 俱乐部ID
      ],
      [notify_get_extra_club_info,
        {int, allow_admin_createtable},                     % 是否允许管理员创建牌局
        {int, approve_count},                               % 待审批的玩家数量
        {int, room_count},                                  % 房间的数量
        {int, table_count},                                 % 牌局(即桌子)的数量，一个房间可以有一张或者多张桌子
        {int, approve_admin_count}                          % 待审批的管理员申请数量
      ],
      % 根据俱乐部ID和会员账号搜索会员是否存在
      [req_search_member,
        {int, search_type},                                 % 1表示管理员设置模块的搜索，2表示成员管理模块的搜索，3表示审批管理模块的搜索
        {int, club_id},
        {string, username},
        {uint64, role_id}                                   % role_id,username 可以选填
      ],
      [notify_search_member,
        {int, result},                                      % 是否搜索到会员
        {uint64, role_id},
        {string, head_photo},                               % 会员的头像
        {int, level},                                       % 会员的等级
        {int, is_admin},                                    % 是否是管理员
        {int, approve_state}                                % 会员申请审批状态
      ],
      % 添加管理员
      [req_add_admin,
        {int, club_id},
        {uint64, role_id}
      ],
      [notify_add_admin,
        {int, result}
      ],
      % 取消管理员
      [req_del_admin,
        {int, club_id},
        {uint64, role_id}
      ],
      [notify_del_admin,
        {int, result}
      ], % 获取管理员列表
      [req_get_admin_list,
        {int, club_id}
      ],
      % 管理员信息列表
      [notify_get_admin_list,
        {int, total_added_admin},
        {int, add_admin_limit},
        {array, member_info, adminlist}
      ],
      % 设置管理员是否可以创建牌局
      [req_admin_create_table,
        {int, club_id}
      ],
      [notify_admin_create_table,
        {int, result}                                       % 是否设置成功
      ],
      % 推送未审批会员数量
      [notify_unapproved_member_count,
        {int, count}                                        % 待审批会员数量
      ],

      % 获取俱乐部拥有的minigame
      [req_get_club_minigame,
        {int, club_id}                                      % 俱乐部ID
      ],
      [notify_get_club_minigame,
        {int, result},                                      % 是否查找成功
        {array, club_game_info, gamelist}                   % 俱乐部拥有的minigame列表
      ],
      % 获取俱乐部拥有的其它游戏
      [req_get_club_othergame,
        {int, club_id}                                      % 俱乐部ID
      ],
      [notify_get_club_othergame,
        {int, result},                                      % 是否查找成功
        {array, club_game_info, gamelist}                   % 俱乐部拥有的其它游戏列表
      ],
      % 开启或关闭显示满桌
      [req_display_desk_reach_max_capacity,
        {int, is_display},                                  % 是否显示满桌，0不显示，1显示
        {int, page},                                        % 页码，从第一页开始
        {int, page_size}                                    % 每页显示的条数
      ],
      [notify_display_desk_reach_max_capacity,
        {int, result},                                      % 是否操作成功
        {int, total},                                       % 返回的牌桌的总数
        {array, desk_info, desk_list}                       % 返回加入的牌桌列表，如果显示满桌就把满桌的牌桌也显示出来，反之则不显示
      ],
      % 加入牌桌
      [req_join_desk,
        {int, desk_id}                                      % 牌桌ID（牌桌ID填写roomid，因为一个房间只允许有一张桌子，俱乐部的其它协议也一样）
      ],
      [notify_join_desk,
        {int, result},                                      % 是否加入成功
        {int, join_club_audit}                              % 是否开启加入俱乐部自动审核
      ],
      % 获取已加入的牌局的列表（牌局指的就是一个房间只能有一张桌子）
      [req_get_joined_dest_list,
        {int, page},                                        % 页码，从第一页开始
        {int, game_type},                                   % 游戏类型
        {int, page_size}                                    % 每页显示的条数
      ],
      [notify_get_joined_dest_list,
        {int, total},                                       % 返回的牌桌的总数
        {array, desk_info, desk_list}                       % 加入的牌局列表
      ],
      % 快速开始游戏
      [req_quick_start_game],
      [notify_quick_start_game,
        {int, result},                                      % 返回0表示有匹配到牌桌，返回牌局roomid；返回1表示玩家没有参加过任何俱乐部的游戏或者没有匹配到牌桌，这时还需返回官方俱乐部的游戏列表，让玩家选择一个游戏牌局进入。
        {int, room_id},                                     % 房间ID
        {array, club_game_info, official_game_list}         % 官方游戏列表
      ],
      % 牌局筛选
      [req_filter_desk,
        {int, club_id},                                     % 俱乐部ID
        {int, game_type},                                   % 游戏类型。德州、跑得快
        {int, play_type},                                   % 玩法。目前只有德州有不同玩法
        {int, player_count},                                % 每桌人数上限， 0表示全部。德州、跑得快
        {int, blind_count},                                 % 开局盲注数量，0表示全部； 1表示：1小盲+1大盲； 2表示：1小盲+1大盲+1随机大盲注； 3表示：1小盲+1大盲+每人1大盲。德州
        {int, limit_bet_rule},                              % 限注规则，0表示全部； 1表示：底注； 2表示：底池限注； 3表示：无限下注。德州
        {int, all_insurance},                               % 全下保险功能， 0表示全部； 1表示开启； 2表示关闭。德州
        {uint64, min_bet},                                  % 底注， 0表示全部。跑得快
        {uint64, max_bet},                                  % 底注， 0表示全部。跑得快
        {int, win_rule},                                    % 输赢规则， 0表示全部； 1表示：1家赢其他家； 2表示：1、2、3、4。跑得快
        {int, page_index},                                  % 页码，从第一页开始
        {uint64, min_take},                                 % 买入下限 0表示全部
        {uint64, max_take},                                 % 买入上限 0表示全部
        {uint64, min_blind},                                % 筛选最小盲注 0表示全部
        {uint64, max_blind},                                % 筛选最大盲注 0表示全部
        {int, page_size}                                    % 每页显示的条数
      ],
      [notify_filter_desk,
        {int, total_page},                                  % 筛选到的总页数
        {array, room_config, room_list}                     % 筛选到的牌局列表
      ],

      % 加入俱乐部
      % 根据俱乐部ID搜索俱乐部
      [req_search_club,
        {int, club_id}
      ],
      [notify_search_club,
        {club_info_record, club_info}                       % 搜索俱乐部结果
      ],
      [req_join_club,
        {int, club_id}
      ],
      [notify_join_club,
        {int, result}
      ],
      % 查询未审批会员列表
      [req_unapproved_list,
        {int, page},
        {int, club_id},
        {int, page_size}                                    % 每页显示的条数
      ],
      [notify_unapproved_list,
        {int, total},
        {array, member_state, info}
      ],
      % 查询已审批会员列表
      [req_approved_list,
        {int, page},
        {int, club_id},
        {int, page_size}                                    % 每页显示的条数
      ],
      [notify_approved_list,
        {int, total},
        {array, member_state, info}
      ],
      % 审批
      [req_club_approve,
        {uint64, role_id},
        {int, club_id},
        {int, rlt}                                          % 0通过，1拒绝
      ],
      [notify_club_operate,
        {int, rlt}                                          % 0操作成功，1失败
      ],
      % 查询成员
      [req_club_member,
        {int, page},
        {int, club_id},
        {string, username},                                 % 用户名，输入空字符串表示展示全部用户
        {uint64, role_id},                                  % roleid，输入0表示全部用户
        {int, page_size}                                    % 每页显示的条数
      ],
      [notify_club_member,
        {int, total},
        {array, member_info, info}
      ],
      % 踢出成员
      [req_club_kickout,
        {int, club_id},
        {uint64, role_id}
      ],
      % 修改简介
      [req_club_modify,
        {int, club_id},
        {string, name},
        {string, details}
      ],
      % 获取logo上传url地址
      [req_resource_upload_url],
      [notify_resource_upload_url,
        {string, upload_url}                                % 上传logo地址
      ],
      %根据游戏名称搜索游戏
      [web_game_info,
        {int, game_type},                                   % 游戏类型
        {string, game_name},                                % 游戏名称
        {string, game_icon}                                 % 游戏图标
      ],
      [req_search_game,
        {string, game_name}
      ],
      [notify_search_game,
        {array, web_game_info, game_info}                   % 搜索游戏结果
      ],
      % 管理员申请
      [req_admin_application,
        {int, club_id}
      ],
      [notify_admin_application,
        {int, result}
      ],
      % 查询管理员列表,包括未审批和已审批的
      [req_club_admin_list,
        {int, page},
        {int, club_id},
        {int, page_size},                                   % 每页显示的条数
        {string, username},                                 % 用户名，输入空字符串表示展示全部用户
        {uint64, role_id}                                   % roleid，输入0表示全部用户
      ],
      [notify_club_admin_list,
        {int, total},
        {array, member_state, info},
        {int, unapprove_member_count},
        {int, unapprove_admin_count}
      ],
      % 管理员申请审批
      [req_club_admin_approve,
        {uint64, role_id},
        {int, club_id},
        {int, rlt}                                          % 0通过，1拒绝
      ],
      [notify_club_admin_approve,
        {int, rlt}                                          % 0操作成功，1失败
      ],
      % 推送未审批管理员数量
      [notify_unapproved_admin_count,
        {int, count}                                        % 待审批管理员数量
      ],
      % 设置俱乐部成员免审核
      [req_club_member_audit_required,
        {int, club_id}
      ],
      [notify_club_member_audit_required,
        {int, result}                                       % 是否设置成功
      ],
      [notify_room_operate,
        {string, result}   % 操作结果，字符串形式的错误码
      ],
      % 查询俱乐部会员审批状态列表
      [req_member_approved_status_list,
        {int, page},
        {int, club_id},
        {int, page_size},                                   % 每页显示的条数
        {string, username},                                 % 用户名，输入空字符串表示展示全部用户
        {uint64, role_id}                                   % roleid，输入0表示全部用户
      ],
      [notify_member_approved_status_list,
        {int, total},
        {array, member_state, info},
        {int, unapprove_member_count},
        {int, unapprove_admin_count}
      ],

      % 根据牌局ID搜索牌局
      [req_search_desk,
        {int, room_id}                                      % 牌桌ID（牌桌ID填写roomid，因为一个房间只允许有一张桌子，俱乐部的其它协议也一样）
      ],
      [notify_search_desk,
        {int, result},                                      % 搜索结果
        {int, room_id},                                     % 房间id
        {string, club_name},                                % 俱乐部名称
        {string, username},                                 % 俱乐部创建者
        {int, game_type},                                   % 游戏类型
        {string, name},                                     % 房间名字
        {string, icon},                                     % 房间图标
        {int, min_bet},                                     % 房间底注
        {int, need_chip},                                   % 最小携带
        {int, max_chip},                                    % 最大携带
        {int, min_take},                                    % 买入下限
        {int, max_take},                                    % 买入上限
        {int, small_blind},                                 % 小盲
        {int, big_blind},                                   % 大盲
        {int, max_player},                                  % 最多玩家数量
        {int, role_count},                                  % 游戏人数
        {int, join_club_audit},                             % 是否开启加入俱乐部自动审核
        {int, play_type}                                    % 游戏玩法
      ],
      % 俱乐部分享
      [req_club_share,
        {int, club_id}                                      % 俱乐部id
      ],
      [notify_club_share,
        {int, result},
        {int, club_id},
        {uint64, invite_code},                              % 邀请人的邀请码，填写邀请人的roleid
        {string, url}                                       % 分享链接地址
      ],
      % 获取当前用户创建的俱乐部id
      [req_get_create_club_id                              
      ],
      [notify_get_create_club_id,
        {int, result},
        {array, int, club_id}
      ],
      % 所在俱乐部牌局分类
      [req_get_club_all_rooms,
        {int, club_id}                                      % 俱乐部ID
      ],
      [club_room_info,
        {int, game_type},                                    % 牌局所属的游戏类型
        {int, roomid},                                       % 牌局ID
        {int, closed_flag}                                   % 关闭标识：0表示牌局未关闭，1表示已关闭
      ],
      [notify_get_club_all_rooms,
        {int, result},                                       % 返回结果，0表示成功，其它值表示错误
        {array, club_room_info, rooms}                       % 牌局列表，每个元素包含游戏类型、牌局ID和关闭标识
      ],
      [req_get_filter_condition,
        {int, game_type}   %% 目前只支持 德州、跑得快
      ],
      [notify_get_filter_condition,
        {int, game_type},
        {int64, wei_min},
        {int64, wei_max},
        {int64, xiao_min},
        {int64, xiao_max},
        {int64, zhong_min},
        {int64, zhong_max},
        {int64, da_min},
        {int64, da_max}
      ],
      [notify_disband_club_to_role,
        {int, result}
      ],
      [notify_club_kickout_to_role,
        {int, result}
      ],
      [notify_add_admin_to_role,
        {int, result}
      ],
      [notify_del_admin_to_role,
        {int, result}
      ],
      [notify_join_club_to_role,
        {int, result}
      ],
      [notify_create_club_to_role,
        {int, result},
        {int, club_id}                                      % 俱乐部ID
      ],
    %%%===================================================================================================
    %%% 赛事管理
    %%%===================================================================================================
    [proto_lobby_tournament_5000],
      % 比赛房间的信息
      [tournament_info,
        {int, room_id},                                     % 赛事ID，填写房间ID
        {string, tournm_name},                              % 赛事名称
        {string, tournm_logo},                              % 赛事logo，填写logo的url地址h5
        {string, tournm_logo_pc},                           % 赛事logo，填写logo的url地址pc
        {int, game_type},                                   % 游戏名称
        {int, apply_count},                                 % 比赛报名人数
        {uint64, need_chip},                                % 起始筹码
        {stime, begin_time},                                % 比赛开始时间
        {stime, end_time},                                  % 比赛结束时间
        {int, tournm_state},                                % 赛事状态，0未报名(未分享)，1等待比赛，2比赛已开始，3比赛结束
        {int, countdown},                                   % 赛事倒计时秒数，等待比赛和比赛已开始这两种状态需要发送倒计时秒数给客户端
        {uint64, bonus},                                    % 奖金
        {int, play_type},                                   % 游戏玩法
        {int, countdown_end},                               % 比赛结束时间减去比赛开始时间的秒数
        {string, tournm_cover},                             % 赛事封面h5
        {string, tournm_cover_pc}                           % 赛事封面pc
      ],
      % 比赛结束后的排行榜信息
      [tournament_rankings,
        {int, ranking},                                     % 名次
        {string, username},                                 % 参赛用户名
        {uint64, points},                                   % 参赛积分
        {uint64, bonus}                                     % 赛事奖金
      ],
      % 盲注信息
      [tournament_blind,
        {int, level},                                       % 级别
        {uint64, big_blind},                                % 大盲注
        {uint64, front_bet},                                % 前注
        {uint64, points}                                    % 分
      ],
      % 获取赛事列表
      [req_tournament_events_list,
        {int, game_type},                                   % 游戏类型，如果为0表示所有的游戏
        {int, page},
        {int, page_size},                                   % 每页显示的条数
        {string, language}                                  % 中文zh-CN，英文en-US，越南vi-VN
      ],
      [notify_tournament_events_list,
        {int, total_page},
        {array, tournament_info, tournm_list}               % 赛事列表
      ],
      % 赛事分享（报名）
      [req_tournament_events_share,
        {int, room_id}                                      % 赛事id（房间id）
      ],
      [notify_tournament_events_share,
        {int, room_id},
        {int, result},
        {uint64, invite_code},                              % 邀请人的邀请码，填写邀请人的roleid
        {string, url}                                       % 分享链接地址
      ],
      % 赛况
      [req_tournament_introduction,
        {int, room_id},                                     % 赛事id（房间id）
        {string, language}                                  % 中文zh-CN，英文en-US，越南vi-VN
      ],
      [notify_tournament_introduction,
        {string, detail},                                   % 比赛详情
        {string, banner},                                   % banner图片地址h5(首页赛事封面)
        {string, banner_pc},                                % banner图片地址pc(首页赛事封面)
        {int, tournament_state},                            % 赛事状态
        {int, downcount},                                   % 倒计时秒数
        {string, bonus_detail},                             % 奖金介绍，web首页需求
        {string, tournm_name},                              % 赛事名称
        {string, tournm_logo},                              % 赛事logo，填写logo的url地址h5
        {string, tournm_logo_pc},                           % 赛事logo，填写logo的url地址pc
        {int, game_type},                                   % 游戏名称
        {int, apply_count},                                 % 比赛报名人数
        {uint64, need_chip},                                % 【德州】显示【买入限制】的金额下限,【跑的快】最低带入金额或固定带入金额
        {stime, begin_time},                                % 比赛开始时间
        {stime, end_time},                                  % 比赛结束时间
        {uint64, bonus},                                    % 奖金
        {int, current_blind_level},                         % 当前盲注等级（从后台配置读取）
        {int, next_blind_level_countdown},                  % 下一等级盲注倒计时（从后台配置读取下一等级盲注开始时间计算倒计时）
        {uint64, current_blind_amount},                     % 当前盲注等级金额（从后台配置读取）
        {uint64, next_blind_amount},                        % 下一等级盲注金额（从后台配置读取）
        {array, tournament_rankings, ranking_info},         % 比赛结束后的排行榜信息
        {uint64, initial_amount},                           % 比赛初始的筹码积分
        {int, room_id},                                     % 赛事id
        {int, is_share},                                    % 是否需要分享赛事
        {int, countdown_end},                               % 比赛结束时间减去比赛开始时间的秒数
        {int, play_type}                                    % 游戏玩法
      ],
      % 奖金
      [req_tournament_bonus,
        {int, room_id}                                      % 赛事id（房间id）
      ],
      [notify_tournament_bonus,
        {string, bonus_detail},                             % 奖金介绍
        {int, tournament_state},                            % 赛事状态
        {int, downcount}                                    % 倒计时秒数
      ],
      % 请求赛事牌桌状态
      [req_tournament_desk,
        {int, room_id}                                      % 赛事id（房间id）
      ],
      [notify_tournament_desk,
        {int, tournament_state},                            % 赛事状态
        {int, downcount},                                   % 倒计时秒数
        {int, player_count}                                 % 参与人数
      ],
      % 排行榜
      [req_tournament_rankings,
        {int, room_id},                                     % 赛事id（房间id）
        {int, page},
        {int, page_size}                                    % 每页显示的条数
      ],
      [notify_tournament_rankings,
        {int, total_page},
        {array, tournament_rankings, ranking_info},         % 比赛结束后的排行榜信息
        {int, tournament_state},                            % 赛事状态，-1赛事不存在，0未报名(未分享)，1等待比赛，2比赛已开始，3比赛结束
        {int, downcount}                                    % 倒计时秒数
      ],
      % 盲注
      [req_tournament_blind,
        {int, room_id},                                     % 赛事id（房间id）
        {int, page},
        {int, page_size}                                    % 每页显示的条数
      ],
      [notify_tournament_blind,
        {int, total_page},
        {array, tournament_blind, blind_info},              % 盲注信息
        {int, tournament_state},                            % 赛事状态
        {int, downcount}                                    % 倒计时秒数
      ],
      % 赛事筛选
      [req_filter_tournament,
        {int, game_type},                                   % 游戏类型。德州、跑得快
        {stime, start_time},                                % 比赛开始时间的筛选起始时间， 年月日时分秒全部传0表示全部
        {stime, end_time},                                  % 比赛开始时间的筛选截至时间， 年月日时分秒全部传0表示全部
        {int, tournament_type},                             % 赛事类型， -1表示全部。1表示SNG； 2表示MTT。 德州、跑得快
        {int, page_index},                                  % 页码，从第一页开始
        {int, page_size},                                   % 每页显示的条数
        {string, language}                                  % 中文zh-CN，英文en-US，越南vi-VN
      ],
      [notify_filter_tournament,
        {int, total_page},                                  % 筛选到的总页数
        {array, tournament_info, tournm_list}               % 筛选到的赛事列表
      ],
      % 获取赛事游戏类型列表
      [req_tournament_events_gametype_list
      ],
      [notify_tournament_events_gametype_list,
        {array, int, gametype_list}                         % 游戏类型列表
      ],
      % 快速开始比赛
      [req_quick_start_tournament],
      [notify_quick_start_tournament,
        {int, result},                                      % 返回0表示有匹配到比赛，返回赛事id：roomid；返回1表示匹配失败。
        {int, room_id}                                      % 赛事id
      ],

    %%%===================================================================================================
    %%% minigame聊天协议
    %%%===================================================================================================
    [proto_lobby_minigamechat_5100],
      [minigame_chat_item,
        {int64, id},
        {int64, role_id},
        {int, viplevel},
        {string, nickname},
        {string, content}
      ],
      % minigame聊天请求
      [req_minigame_chat,
        {string, content}
      ],
      % minigame聊天通知
      [notify_minigame_chat,
        {int64, id},
        {int64, role_id},
        {int, viplevel},
        {string, nickname},
        {string, content}
      ],
      % 获取minigame聊天记录
      [req_get_minigame_chat_record],
      [notify_get_minigame_chat_record,
        {array, minigame_chat_item, chat_item}
      ],

    %%%===================================================================================================
    %%% 二级页面最近玩的各平台游戏
    %%%===================================================================================================
    [proto_lobby_ecentgames_5200],
      [req_recent_games,
        {int, agent_id}                         %-1表示获取所有agentid下最近游戏
      ],
      [notify_recent_games,
        {array, three_game_id, games}
      ],

    %%%===================================================================================================
    %%% 我的优惠点击详情
    %%%===================================================================================================
    [proto_lobby_discountdetails_5300],
      [req_discount_details,
        {int, activity_ID}
      ],
      [notify_discount_details,
        {recharge_discount, details},
        {array, int,  extra},                               % 特殊活动的额外参数
        {stime, start_time},                                % 活动开始时间
        {stime, end_time}                                   % 活动结束时间
      ],
      % 用活动ID请求活动状态
      [req_activity_status,
        {array, int, activity_ID}
      ],
      % 0可参加1不可参加2因为互斥活动无法参加
      [notify_activity_status,
        {array, int, rlt}
      ],
      % vip洗码昨天和今天的值
      [req_vip_rebate_today_data],
      [notify_vip_rebate_today_data,
        {uint64, yesterday},
        {uint64, today},
        {stime, last_time}                                  % 当天记录最后更新时间
      ],

    %%%===================================================================================================
    %%% 我的优惠
    %%%===================================================================================================
    [proto_lobby_myrechargediscount_5400],
      % 我的优惠
      [req_my_recharge_discount],
      [my_recharge_discount,
        {int, id},                                          % 9020表示签到活动，10005表示新手任务活动 10015表示老虎机比赛
        {string, tag},
        {string, name},
        {string, content},
        {string, details},
        {uint64, bonus},
        {int, status},                                      % 签到活动时表示日签到状态，0可签到，2已签到；新手任务活动时表示活动状态，0可参与，1可领奖, 2已参与；老虎机比赛  0 未开始 1进行中 2暂停 3 结束
        {int, bind_card},                                   % 0不需要; 老虎机比赛（1已报名 0未报名）
        {int, week_status},                                 % 签到活动在我的优惠显示的7日签到状态，0未达到领取时，1达到领取当日，2完成7日时可领取，3当月的所有七日签到奖励都领取完毕；老虎机比赛（期数）
        {uint64, week_bonus},                               % 周奖励金额 ；老虎机比赛（开始时间）    
        {int, month_status},                                % 签到活动在我的优惠显示的满月签到状态，0未达到领取时，1达到领取当日，2完成28日即满月时可领取，3当月的满月签到奖励领取完毕
        {uint64, month_bonus}                               % 月奖励金额；老虎机比赛（结束时间）
      ],
      [notify_my_recharge_discount,
        {array, my_recharge_discount, dis}
      ],
      [req_ready_to_claim_bonus],
      [notify_ready_to_claim_bonus,
       {int, type},                                         % 0全部，1新增
       {array, int, related_id}                             % 0为vip相关，1为系统优惠， 定时活动为对应的ID
      ],

    %%%===================================================================================================
    %%% 数字竞猜
    %%%===================================================================================================
    [proto_lobby_numbersbetting_5500],
      [req_numbers_betting_info],
      [his_record,
        {int, role_id},
        {string, username},
        {int, numbers},
        {int, ranking},
        {int, prize},
        {int, roundid},
        {int, status},                                       % 0为审核，1通过，2拒绝, 3已领取, 4未中奖，5未上榜， 6未参加
        {stime, bet_time}
      ],
      [reward_cfg,
        {string, ranking},
        {int, prize}
      ],
      [lott_result,
        {int, roundid},                                     % 期数
        {int, result}                                       % 开奖结果
      ],
      [notify_numbers_betting_info,
        {int, qualified},                                   % 能否能加活动0可以，1不能（要绑卡）
        {int, roundid},                                     % 本日期数
        {int, result},                                      % 开奖结果
        {int, status},                                      % 0竞猜倒计时1开奖倒计时2派奖倒计时3派奖中4已派奖
        {int, joined},                                      % 参与状态：0未分享1已分享2已竞猜3已分享结果  4已通过5已拒绝6已领取
        {int, set_fb},                                      % 是否已设置主页0未设置1已设置
        {int, numbers},                                     % 选择的数字
        {int, ranking},                                     % 当期排名
        {int, prize},                                       % 当期奖金
        {stime, cur_time},                                  % 当前时间
        {stime, open_time},                                 % 当前时间
        {stime, start_time},                                % 活动开始时间
        {stime, end_time},                                  % 活动结束时间
        {string, share_url},                                % 分享链接
        {string, share_words},                              % 分享信息
        {string, reason},                                   % 审核失败原因
        {array, reward_cfg, prize_cfg},                     % 奖项配置
        {array, his_record, my_records},                    % 参与记录
        {array, lott_result, recent_rlt}                    % 最近几期的开奖结果
      ],
      % （进入活动页面的）我的竞猜
      [req_numbers_record_details
      ],
      [notify_numbers_record_details,
        {array, his_record, my_records},
        {array, lott_result, recent_rlt}                    % 最近几期的开奖结果
      ],
      % 竞猜排名
      [req_numbers_betting_rank,
        {int, roundid},
        {int, page},
        {int, type}                                         % 0中奖名单1竞猜榜单
      ],
      [notify_numbers_betting_rank,
        {int, total},
        {int, result},                                      % 开奖结果
        {array, his_record, my_records}
      ],
      % 竞猜
      [req_start_betting,
        {int, numbers}
      ],
      [notify_start_betting,
        {int, rlt}                                          % 1当前时间不能参加活动 2 已参加或未分享  3 IP和设备号已参加
      ],
      % 分享
      [req_numbers_betting_share,
        {int, type}                                         % 0立即分享1中奖分享2重新分享
      ],
      [notify_numbers_betting_share,
        {int, rlt}
      ],
      % 设置fb主页
      [req_set_fb_homepage,
        {string, home}
      ],
      [notify_set_fb_homepage,
        {int, rlt}                                          % 0成功，1该主页已被其它账号设置过，2输入错误
      ],
      % 领奖
      [req_numbers_betting_claim_bonus],
      [notify_numbers_betting_claim_bonus,
        {int, rlt}
      ],

    %%%===================================================================================================
    %%% 三方游戏列表配置
    %%%===================================================================================================
    [proto_lobby_gameinfo_5600],
      % 获取当前收藏的游戏ID,最近玩过的游戏
      [req_my_games],
      [notify_req_my_games,
        {array, three_game_id, collected},                            %我的收藏游戏
        {array, three_game_id, recently}                              %我最近玩过的游戏
      ],

    %%%===================================================================================================
    %%% 分享投票活动
    %%%===================================================================================================
    [proto_lobby_share_5700],
      % 奖励信息
      [prize_info,
        {int, ranking},
        {int, money}
      ],
      [video_info,
        {int, num_likes},
        {int, video_id},
        {int, voted},                                       % 0未点赞1已点赞
        {int, reward},                                      % 奖励金额
        {string, uploader},
        {stime, upload_time},
        {string, name}
      ],
      % 获取活动信息
      [req_share_vote_info],
      [notify_share_vote_info,
        {int, vote_prize},                                  % 投票奖励金额
        {array, prize_info, join_prize},                    % 参与奖励金额
        {array, prize_info, rank_prize},                    % 排名奖励金额
        {array, string, marquee},                           % 跑马灯
        {int, num_likes},                                   % 点赞总数
        {int, can_vote},                                    % 能否点赞0可以1不能
        {int, got_amount},                                  % 累计发放金额
        {int, ready_amount},                                % 待领取金额
        {stime, cur_time},                                  % 服务器当前时间
        {stime, start_time},                                % 活动开始时间
        {stime, end_time},                                  % 活动结束时间
        {string, share_url},                                % 上传视频地址
        {int, vote_flag},                                   % 是否参与投票 0未参与1已参与
        {int, upload_flag},                                 % 是否上传视频 0未参与1已参与
        {int, claim_flag}                                   % 是否领取奖励 0未参与1已参与
      ],
      [req_share_vote_reward_details],
      [notify_share_vote_reward_details,
        {int, got_vote_money},                              % 已发放投票奖励
        {int, got_join_money},                              % 已发放参与奖励
        {int, got_rank_money},                              % 已发放排名奖励
        {int, ready_vote_money},                            % 待领取投票奖励
        {int, ready_join_money},                            % 待领取参与奖励
        {int, ready_rank_money}                             % 待领取排名奖励
      ],
      % 获取榜单
      [req_ranking_videos,
        {int, roundid},
        {int, page}
      ],
      [notify_ranking_videos,
        {int, page},
        {int, total},
        {array, video_info, info}
      ],
      % 我的分享
      [req_my_shared_videos,
        {int, page}
      ],
      [my_video_info,
        {int, roundid},
        {int, num_likes},                                   % 点赞数
        {int, video_id},
        {int, status},                                      % 默认0为审核，1通过，2拒绝
        {string, uploader},
        {stime, upload_time},
        {string, name},
        {int, pos},                                         % 排名
        {int, reward},                                      % 奖励金额
        {string, remark}                                    % 拒绝原因
      ],
      [notify_my_shared_videos,
        {int, page},
        {int, total},                                       % 参加活动的期数
        {array, my_video_info, videos},
        {array, int, info}                                  % 期数信息
      ],
      % 投票总榜
      [req_num_likes_ranking_info,
        {int, page}
      ],
      [num_likes_info,
        {string, username},
        {int, num_likes},
        {int, prize}
      ],
      [notify_num_likes_ranking_info,
        {int, page},
        {int, total},
        {array, num_likes_info, info}
      ],
      % 点赞
      [req_like_a_video,
        {int, video_id}
      ],
      [notify_like_a_video,
        {int, rlt},                                         % 1活动未生效2IP超过投票限制3未找到视频
        {int, video_id},
        {int, amount}
      ],
      % 领奖
      [req_claim_share_vote_prize],
      [notify_claim_share_vote_prize,
        {int, rlt},
        {int, amount},
        {int, vote_flag},                                   % 投票奖是否领取0未领取1已领取
        {int, join_flag},                                   % 参与奖是否领取0未领取1已领取
        {int, rank_flag}                                    % 排名奖是否领取0未领取1已领取
      ],
      [notify_marquee_update,
        {int, type},                                        % 1上传成功2审核通过3某人投票给我
        {int, total_like_num},                              % 累计获得票数
        {string, username}
      ],
      %获奖记录
      [req_winner_history,
        {int, roundid},
        {int, page},
        {int, type}                                         % 0投票奖励1高光时刻
      ],
      [notify_winner_history,
        {int, page},
        {int, total},
        {array, video_info, info}
      ],
      % 上传路径
      [req_share_vote_upload_path,
        {string, upload_path}                               % 上传路径  
      ],
      [notify_share_vote_upload_path,
        {string, upload_path},
        {common_result, rlt}                                         % 1成功，2失败
      ],


    %%%===================================================================================================
    %%% 免费夺宝
    %%%===================================================================================================
    [proto_lobby_freetreasure_5800],
      [req_free_treasure_info],
      [gameInfo,
        {int, gameId},
        {int, roomId}
      ],
      [notify_free_treasure_info,
        {int, qualified},                                   % 能否能加活动0可以，1不能（要绑卡）
        {int, rank},                                        % 当日排名
        {int, winner_num},                                  % 有奖玩家数量
        {uint64, score},                                    % 当前试玩分数
        {array, gameInfo, gameIds},                         % 试玩游戏列表
        {stime, start_time},                                % 开始时间
        {stime, end_time}                                   % 结束时间
      ],
      [req_free_treasure_his,
        {int, roundid},
        {int, page},
        {int, pageSize}
      ],
      [free_treasure_rank_data,
        {int, rank},
        {uint64, role_id},
        {string, head_icon},
        {string, username},
        {uint64, score},
        {uint64, reward}
      ],
      [notify_free_treasure_his,
        {array, free_treasure_rank_data, info}
      ],

    %%%===================================================================================================
    %%% 玩家登录记录
    %%%===================================================================================================
    [proto_lobby_loginrecord_5900],
      [login_record,
        {int, login_type},                                  % 登录类型
        {string, ip},                                       % 登录的ip
        {int, device_model},                                % 登录的设备类型，1为web-windows，2为web-mac，3为web-android，4为web-ios，5为app-android，6为app-ios，7为other-system
        {stime, login_time}                                 % 登录的时间
      ],
      [req_login_record_list,
        {int, page},                                        % 页码，也就是客户端传过来的第几页，从第一页开始
        {int, number_per_page}                              % 每页显示的条数
      ],
      [notify_login_record_list,
        {int, total_pages},                                 % 查询到的总页数
        {array, login_record, login_record_list},           % 查询到的记录列表
        {int, total_items}                                  % 记录总条数
      ],
      % 下线通知
      [notify_offline_notification,
        {stime, login_time},                                % 另一台设备的登录时间
        {int, device_id}                                    % 另一台设备的设备类型，1为web-windows，2为web-mac，3为web-android，4为web-ios，5为app-android，6为app-ios，7为other-system
      ],
      % 异地登录提醒
      [notify_diff_loc_login_notification,
        {stime, login_time},                                % 另一台设备的登录时间
        {string, ip},                                       % 登录的ip
        {int, device_id}                                    % 另一台设备的设备类型，1为web-windows，2为web-mac，3为web-android，4为web-ios，5为app-android，6为app-ios，7为other-system
      ],

    %%%===================================================================================================
    %%% 三方游戏添加取消收藏
    %%%===================================================================================================
    [proto_lobby_collect_6000],
      [req_modify_collect,
        {three_game_id, key},                                 % 
        {int, type}                                           % 0收藏1取消收藏
      ],
      [notify_modify_collect,
        {int,rlt}                                           % 0成功，1收藏达到上限 2其它
      ],

    %%%===================================================================================================
    %%% 获取玩家详细信息，目前德州使用
    %%%===================================================================================================
    [proto_game_detail_6100],

    %%%===================================================================================================
    %%% 落地页相关协议
    %%%===================================================================================================
    [proto_landing_page_6200],
      % 请求获取游戏全部信息
      [req_get_game_full_info,
        {three_game_id, key}
      ],
      [play_info_today_belongs,
        {string, nickname},                                 % 昵称
        {int64, bonus},                                     % 奖金
        {int64, bet_money},                                 % 下注金额
        {string, odds}                                      % 赔率   赢钱的金额 / 下注金额
      ],
      % 返回游戏全部信息
      [notify_game_full_info,
        {three_game_id, three_gameid},                      % 游戏ID
        {string, dealer_advantage},                         % 庄家优势
        {string, rtp},                                      % 返奖率（RTP）
        {string, reels},                                    % 转轴，例如 "5X4"
        {int64, max_win},                                   % 最大盈利
        {int, volatility},                                  % 波动性（1.高、2.中、3.低）
        {int64, min_bet},                                   % 最小投注金额
        {int64, max_bet},                                   % 最大投注金额
        {int64, daily_max_win},                             % 当日最高盈利
        {string, updated_at},                               % 更新时间
        {string, rating},                                   % 游戏评分 举例"[3,0,0,0,0,3,5]" 1.点赞总人数 2.1星人数 3.2星人数  4.3星人数 5.4星人数  6.5星人数  7.自己评分数
        {string, money_type},                               % 货币类型
        {int, game_status},                                 % 0,表示未点赞，未收藏  1,表示已点赞，未收藏  2,表示未点赞，已收藏  3,表示已点赞，已收藏
        {int, like_count},                                  % 点赞数量
        {int, favorite_count},                              % 收藏数量
        {int, custom_game}                                  % 是否是自研游戏 1自研
      ],
      % 请求获取当日最高盈利
      [req_get_top_winners,
        {three_game_id, key}
      ],
      [notify_get_top_winners,
        {array, play_info_today_belongs, top_winners}
      ],
      % 请求获取当日单注最高盈利
      [req_get_top_single_winners,
        {three_game_id, key}
      ],
      [notify_get_top_single_winners,
        {array, play_info_today_belongs, top_single_winners}
      ],
      % 请求游戏操作（点赞、取消点赞）
      [req_game_action,
        {three_game_id, key},
        {int, action_type}          % 操作类型：1=点赞，2=取消点赞
      ],
      % 返回游戏操作结果
      [notify_game_action_result,
        {int, result},               % 结果，1成功，2表示失败
        {int, action_type},          % 操作类型：同上
        {three_game_id, game_id},    % 游戏ID
        {int, status}                % 当前状态：对于点赞操作，0未点赞，1已点赞；
      ],
      % 请求提交游戏评分
      [req_submit_game_rating,
        {three_game_id, key},
        {int, rating}                      % 评分（1-5）
      ],
      % 返回提交评分结果
      [notify_submit_game_rating_result,
        {int, result}                      % 结果，1成功，非2表示失败
      ],

    %%%===================================================================================================
    %%% web优化游戏记录
    %%%===================================================================================================
    [proto_game_record_6300],
      % 资金查询
      [req_web_game_get_record_list,
        {int, page},
        {int, type},                                        % 0 全部 1,充值 2,提现 3,活动/任务 4,代理 5,vip 6,其他
        {int, second_type},                                 % 100 全部 1 成功  2 充值异常 -1 充值中  -2 超时关闭 /提现记录：100 全部 2:成功，3:审核异常，(1:审核中，4:处理中 全部中不显示)
        {stime, start_time},
        {stime, end_time},
        {int, number_per_page},
        {string,asyn_data}                                  %客户端传过来的异步数据，返回一起带回
      ],
      
      [game_record,
        {int, type},                                        % 类型 根据映射表去查 大标题和小标题
        {int, status},                                      % 充值记录：交易状态:1 成功, -2 超时关闭, (-1 充值中, 2 充值异常[*服务器tfserver调用失败，情况非常少，数据库中的回调成功] 全部中不显示 )/ 提现记录：2:成功，3:审核异常，(1:审核中，4:处理中 全部中不显示)
        {int64, money},                                     % 充值记录：交易状态为1时为：原始实际支付金额，其他状态为：充值金额 / 提现记录：提现金额
        {uint64, order_index},                              % 提现充值的index，用来查询详细用的
        {stime, create_time},                               % 充值记录：支付时间 / 提现记录：提现时间
        {int,id},                                           % 如果order_index=0，这个字段表示详情中得交易id（无需向服务器再次请求详情 详情得数据这里面都有）
        {int, way_id}                                       % 充值方式 银行卡 1, momo 2, zalo 3, viettel 4, 刮刮卡 5, usdt 6 提现方式 1=>银行卡 2=>USDT
      ],

      [notify_web_game_record_list,
        {int, total_page},
        {array, game_record, record_list},
        {int, total_items},                                  % 记录总条数
        {int64, income},  % 收入
        {int64, expense},  % 支出
        {string,asyn_data}                                  %客户端传过来的异步数据，返回一起带回
      ],
      % 根据订单号查充值提现记录
      [req_web_game_record_by_order_id,
        {int, type},                                        % 0充值 1提现
        {uint64, order_index}                               % 提现充值的单号，用来查询详细用的
      ],

      % 返回充值详情
      [notify_web_game_recharge_info,
        {string, order_id},                                 % 订单号
        {int64, pay_money_o},                               % 充值金额 实际支付金额
        {string, bank_card_id},                             % 汇率 usdt的时候用得上
        {int64, order_money},                               % 充值金额 usdt要除100
        {stime, pay_time},                                  % 到账时间
        {int, way_id}                                       % 充值方式 银行卡 1, momo 2, zalo 3, viettel 4, 刮刮卡 5, usdt 6
      ],

      % 返回提现详情
      [notify_web_game_withdraw_info,
        {int64, money},                                     % 提现金额
        {int, type},                                        % 提现类型，1=>银行卡 2=>USDT
        {string, bank_card_id},                             % 提现绑定的银行卡Id(USDT地址)
        {string, order_no},                                 % 交易Id
        {stime, pay_time},                                  % 到账时间
        {int,bank_id},                                      % usdt提现表示汇率
        {string, holder_name}                               % usdt 表示金额
      ],
      % 投注记录
      [web_game_bet_record,
        {int64, id},                                        % 单号
        {string, platform_id},                              % 所属平台
        {string, game_type},                                % 游戏名称
        {int64, bet_total},                                 % 投注金额
        {int64, bet_valid},                                 % 流水 有效投注
        {int64, net_value},                                 % 输赢
        {string, video},                                    % 录像id
        {string, remark},                                   % 备注
        {int, venue_id},                                     % 类型id
        {stime, balance_time}                               % 结算时间
      ],
      % 获取投注记录
      [req_web_game_get_bet_record_list,
        {string, type},                                     % 类型 %0全部 1电子 2捕鱼 3视讯  4体育 5棋牌 6彩票
        {stime, start_time},                                % 记录开始时间
        {stime, end_time},                                  % 记录结束时间
        {int, page},                                        % 页码
        {int, number_per_page},                             % 每一页显示的条数
        {string,asyn_data}                                 % 客户端传过来的异步数据，返回一起带回
      ],
      [notify_web_game_get_bet_record_list,
        {int, total_pages},                                 % 查询到的总页数
        {array, web_game_bet_record, bet_record_list},      % 点击查询，返回查询到的结果的第一页给客户端，每页显示20条记录
        {int, total_items},                                 % 记录总条数
        {int64, total_bet},                                 % 有效投注总额
        {int64, total_stream},                              % 总流水
        {int64, total_net_value},                            % 总输赢
        {string,asyn_data}                                 % 客户端传过来的异步数据，返回一起带回
      ],
      % 流水记录
      [req_web_game_get_audit_record,
        {int, page},
        {stime, start_time},
        {stime, end_time},
        {int, type},                                        % 0所有，1进行中，2已完成
        {int, number_per_page}                              % 每页显示的条数
      ],
      [web_game_audit_record,
        {string, title},                                    % 稽核名称
        {int, type},                                        % 稽核类型：1充值,2活动,3手动上分
        {uint64, amount},                                   % 稽核金额
        {uint64, progress},                                 % 稽核进度
        {uint64, in_amount},                                % 存入流水
        {int, status},                                      % 状态:1=进行中,2=已完成
        {stime, create_time}                                % 时间
        %{int,activity_id}                                  % 活动id
      ],
      [notify_web_game_get_audit_record,
        {int, total_page},
        {array, web_game_audit_record, record_list},
        {int, total_items}                                  % 记录总条数
      ],

      % 洗码记录
      [req_web_game_get_vip_rebate,
        {int, page},
        {int, type},                                        %  0全部 1电子 2捕鱼 3视讯  4体育 5棋牌 6彩票
        {stime, start_time},
        {stime, end_time},
        {int, number_per_page},                             % 每页显示的条数
        {string,asyn_data}                                  % 客户端传过来的异步数据，返回一起带回
      ],
      [web_game_vip_rebate_details,
        {uint64, bet_money},                                % 有效投注
        {string, bet_name}                                  % 名称
      ],
      [web_game_vip_rebate_record,
        {uint64, bet_money},                                % 下注金额
        {uint64, rebate},                                   % 返点金额   
        {int, type},                                        % 平台ID (pg 根据id转字符串)
        {int, status},                                      % 默认为0，待审核，1审核通过，2拒绝, 3已领取
        {int, venue_id},                                    % 0全部 1电子 2捕鱼 3视讯  4体育 5棋牌 6彩票
        {array, web_game_vip_rebate_details, details_list}, % 详细信息列表
        {stime, create_time},
        {string,ratio},                                     % 返回比例（保留百分位后两位小数 0.20%）
        {string,win_date}                                   % 结算时间
      ],

      [notify_web_game_get_vip_rebate,
        {int, total_page},
        {array, web_game_vip_rebate_record, record_list},
        {int, total_items},                                  % 记录总条数
        {string,asyn_data},                                  % 客户端传过来的异步数据，返回一起带回
        {uint64, rebate_money},                              % 待结算
        {uint64, can_rebate},                                % 可领取
        {uint64, has_rebate}                                 % 已领取
      ],

      % 登录记录
      [web_game_login_record,
        {int, login_type},                                  % 登录类型
        {string, ip},                                       % 登录的ip
        {string, device_id},                                % 登录的device_id
        {string, device_name},                              % 登录的设备名称
        {int, device_model},                                % 登录的设备型号(1:web_windows  2:web_mac  3:web_android 4:web_ios  5:app_android 6:app_ios 7:未知设备
        {stime, login_time}                                 % 登录的时间
      ],
      [req_web_game_login_record_list,
        {int, page},                                        % 页码，也就是客户端传过来的第几页，从第一页开始
        {int, number_per_page}                              % 每页显示的条数
      ],
      [notify_web_game_login_record_list,
        {int, total_pages},                                 % 查询到的总页数
        {array, web_game_login_record, login_record_list},  % 查询到的记录列表
        {int, total_items}                                  % 记录总条数
      ],

    %%%===================================================================================================
    %%% EVO 平台协议
    %%%===================================================================================================
    [proto_push_evodata_6400],
      [category_table,
        {int, category_id},                                  % 分类编号
        {array, string, table_id}                            % 对应桌子ID
      ],

      [req_evo_category_tables],                             % 获取EVO平台游戏分类表请求
      [notify_evo_category_tables,
        {array, int, game_category_index}                    % EVO平台游戏分类表一般是0-9的数字
      ],
      % 通过evo游戏分类索引获取对应的分类子游戏列表
      [req_evo_category_tables_by_index,
        {array, int, index}                                   % 分类索引
      ],
      [notify_evo_category_tables_by_index,
        {array, category_table, category_tables}             % 分类表条目列表
      ],

      % 请求完整分类表
      [req_evo_category_tables_all],
      [notify_evo_category_tables_all,
        {array, category_table, category_tables}             % 分类表条目列表
      ],

      [req_evo_games_history_start_push,                     % 开启推送历史路数据
        {array, string, table_ids}],                         % 分类名称
      [notify_evo_history_start_res,
        {common_judge, start_res}                            % 只有失败的时候客户端才会收到此消息
      ],

      % 关闭推送所有历史路数据
      [req_evo_games_history_stop_push],
      [notify_evo_history_stop_res,
        {common_judge, stop_res}                             % 是否停止推送成功
      ],

      % 多语言游戏标题协议
      [game_title_locale,
        {string, lang},                                        % 语言标识
        {string, title}                                        % 对应语言标题
      ],
      [notify_evo_history,
        {array, string, history_info}                          % 游戏路数数据
      ],

    %%%===================================================================================================
    %%% 分享管理
    %%%===================================================================================================
    [proto_share_manage_6500],
      [req_get_share_settings_info,
        {int, language_id},                                 % 语种id, 1表示中文，2表示英文，3表示越南文
        {int, share_scenes_id}                              % 分享场景id，1应用程序分享, 2赛事分享, 3活动分享, 4代理分享, 5游戏详情页分享
      ],
      [notify_get_share_settings_info,  
        {int, share_scene},                                 % 分享场景
        {string, share_title},                              % 分享标题
        {string, share_content},                            % 分享内容
        {string, share_url},                                % 分享链接url
        {string, share_pic},                                % 分享图片
        {int, fb},                                          % 0表示不设置facebook分享渠道，1表示设置facebook分享渠道
        {int, ins},                                         % 0表示不设置instagram分享渠道，1表示设置instagram分享渠道
        {int, tg},                                          % 0表示不设置telegram分享渠道，1表示设置telegram分享渠道
        {int, twitter}                                      % 0表示不设置twitter分享渠道，1表示设置twitter分享渠道
      ],


    %%%===================================================================================================
    %%% 红包活动
    %%%===================================================================================================
    [proto_red_envelope_6600],
      % 红包入口
      [req_red_envelope_entry],
      % 红包入口响应
      [notify_red_envelope_entry,
        {int, is_open}, % 1红包未开启，2红包已开启 3活动未开始 4所有红包都已领取 5未设置红包奖励
        {int64, money} % 红包金额
      ],

      % 请求开启红包
      [req_open_red_envelope,
        {int, language_id} % 语种id 1英文 2中文 3越南语
      ],
      % 开启红包响应
      [notify_open_red_envelope,  
        {int, is_ok}, % 是否成功 0活动未开始 1成功 2未达到vip等级1 3未达到vip等级2 4未达到vip等级3 5未达到vip等级4
        {int64, money} % 开启红包后显示该红包等级的金币
        % {int, level}, % 红包等级
        % {int, status}, % 红包状态
        % {array, red_task, red_task_list} % 任务列表
      ],
      % 任务
      [red_task,
        {int, task_id}, % 任务id 1期间充值 2期间投注 3期间局数 4绑定银行卡 5有效好友 6有效代理 7开启VIP等级 8领取VIP等级 9分享FB 10关注FB主页 11关注FB小组 12关注TG频道 13关注INS 14关注TWITT
        {int, status}, % 任务状态 0未完成 1已完成
        {int64, task_content}, % 任务内容
        {int64, task_progress} % 任务进度
      ],
      % 请求领取红包
      [req_receive_red_envelope,
        {int, language_id} % 语种id 1英文 2中文 3越南语                                       
      ],
      % 领取红包响应
      [notify_receive_red_envelope,                                     
        {int, is_ok}, % 是否成功
        {int64, money}, % 领取红包后显示的金币
        {int, level}, % 红包等级
        {int, status}, % 红包状态
        {string, rule}, % 规则
        {array, red_task, red_task_list} % 任务列表                                               %打开红包后获得的金币
      ],
      % 完成任务，获取红包
      [req_complete_task_and_get_red_envelope],
      % 完成任务，获取红包响应
      [notify_complete_task_and_get_red_envelope,
        {int, is_ok}, % 是否成功 0活动未开始 1成功 2红包未开启 3任务未完成
        {int64, money}, % 领取红包的金币
        {int, is_next_open} % 下级红包是否开启
      ],
      % 活动领取记录
      [red_envelope_receive_record,
        {int64, receive_time}, % 领取时间
        {string, nickname}, % 玩家昵称
        {int64, money} % 领取红包的金币
      ],
      % 我的领取记录
      [red_my_receive_record,
        {int, level}, % 红包等级
        {int64, money}, % 红包的金币
        {int, status} % 领取状态 0未领取 1已领取
      ],
      % 请求活动领取记录
      [req_red_envelope_activity_receive_record],
      % 活动领取记录响应
      [notify_red_envelope_activity_receive_record,                      %活动领取记录
        {array, red_envelope_receive_record, red_envelope_receive_record_list} %活动领取记录列表
      ],
      % 请求我的领取记录
      [req_red_envelope_my_receive_record],
      % 我的领取记录响应
      [notify_red_envelope_my_receive_record,
        {int64, total_money}, % 累计领取的金币
        {int64, pending_money}, % 待领取的金币
        {array, red_my_receive_record, red_envelope_my_receive_record_list} %我的领取记录列表
      ],

      % % 请求是否有开启红包资格
      % [req_whether_can_open_red_envelope                              
      %   ],
      % % 通知是否能开启红包
      %   [notify_whether_can_open_red_envelope,                         
      %     {int, is_can_open}                                          %是否能开启红包,0不能开,1能开
      %   ],
      % % 请求开启红包
      %   [req_open_red_envelope                                          
      %   ],
      % % 开启红包响应
      %   [notify_open_red_envelope,                                     
      %     {int64, money}                                                %开启红包后显示该红包等级的金币
      %   ],
      % % 请求领取红包
      %   [req_receive_red_envelope                                          
      %   ],
      % % 领取红包响应
      %   [notify_receive_red_envelope,                                     
      %     {int64, money}                                                %打开红包后获得的金币
      %   ],
      % % 开启红包通知（弹窗）
      %   [notify_popup_red_envelope,                                     
      %     {string, username},                                 %玩家用户名
      %     {string, head_photo}                                %头像id
      %   ],
      %   % 点击红包活动按钮获取信息
      %   [req_red_envelope_info],
      %   % 通知红包信息
      %   [notify_red_envelope_info,
      %     {int, is_open},                                     % 活动是否显示
      %     {stime, start_time},                                % 活动开始时间
      %     {stime, end_time},                                  % 活动结束时间
      %     {int, is_follow_fb},                                % 是否关注facebook
      %     {int, is_follow_fb_group},                          % 是否关注facebook群组
      %     {int, is_follow_tg_group},                          % 是否关注tg群组
      %     {int, is_bind_card},                                % 是否绑定银行卡
      %     {int64, amount},                                    % 奖金
      %     {int, status}                                       % 0未参与，1待领奖, 2已参与
      %   ],

    %%%===================================================================================================
    %%% 老虎机比赛相关
    %%%===================================================================================================
    [proto_slots_match_6700],
      [slots_match_reward,                                  %奖励信息
        {int,rank},                                         %排名
        {int,money_reward},                                 %金币
        {int,free_reward}                                   %免费次数
      ],
      [slots_match_item,                                    %各期比赛
        {string,match_name},                                %比赛名称
        {int,round}                                         %期数 20250001
      ],
      [slots_match_rank_item,
        {int,rank},                                         %排名
        {string,account},                                   %账号
        {string,head},                                      %头像
        {uint64,score},                                     %积分
        {int,money_reward},                                 %金币
        {int,free_reward}                                   %免费次数
      ],
      [slots_match_record_item,
        {int,involved_game},                                %游戏房间id
        {int,serial_number},                                %第几局
        {int64,score},                                      %积分
        {string,video}                                      %回放id
      ],
      [req_slots_match_list],                               %查询比赛列表
      [notify_slots_match_list,
        {array,slots_match_item,list}                       %各期的比赛列表
      ],
      [req_slots_match_info,                                %获取比赛信息 两个参数分别传"0",0 就是取最近的一期
        {int,round}                                         %查询哪一期
      ],                               
      [notify_slots_match_info,
        {string,match_name},                                %比赛名称
        {int,round},                                        %期数 20250001
        {int,language_type},                                %语言类型 1英文 2中文 3 越南
        {string,match_icon},                                %赛事LOGO
        {string,h5_banner},                                 %H5活动内页banner
        {string,pc_banner},                                 %PC活动内页banner
        {string,match_blurb},                               %赛事简介
        {string,match_rule},                                %赛事规则
        {int64, start_time},                                %开始时间
        {int64, end_time},                                  %结束时间
        {int,involved_game},                                %游戏配置 游戏房间id
        {int,spin_count},                                   %旋转次数
        {array,slots_match_reward,rank_reward},             %排名奖励[{排名,金币奖励,免费旋转},{排名,金币奖励,免费旋转}]
        {array,slots_match_reward,luck_reward},             %幸运奖励[{排名,金币奖励,免费旋转},{排名,金币奖励,免费旋转}]
        {int,status},                                       %活动状态(0 未开始 1进行中 2暂停 3 结束
        {int,player_num},                                   %参赛人数  
        {int,qualifying}                                    %参赛资格 0还未报名 1已报名 2未登录
      ],
      [req_slots_match_signup,                              %报名参赛
        {int,round}                                         %查询哪一期
      ],
      [notify_slots_match_signup,                           %报名结果返回
        {int,code},                                         %报名结果 0报名成功 1活动暂停报名失败 2活动即将结束报名失败 3活动已经结束报名失败 4其他失败
        {notify_slots_match_info, match_info}               %本场比赛的信息
      ],
      [req_slots_match_rank,                                %查看排行榜
        {int,round}                                         %查询哪一期
      ],
      [notify_req_slots_match_rank,                         %返回排名信息    
        {array,slots_match_rank_item,rank_list},            %排行榜
        {slots_match_rank_item,self_rank}                   %自己排名信息
      ],
      [req_slots_match_record,                              %查看排行榜
        {int,round}                                         %查询哪一期
      ],
      [notify_req_slots_match_record,                       %返回比赛信息    
        {array,slots_match_record_item,record_list},        %回放记录
        {slots_match_rank_item,self_rank},                  %自己排名信息
        {string,game_url},                                  %游戏链接
        {string,server_addr},                               %地址
        {int,game_id},                                      %游戏类型
        {int,room_id}                                       %房间号
      ],
      [req_slots_match_result,                              %查看比赛结果
        {int,round}                                         
      ],
      [notify_slots_match_result,                           % 领取奖励
        {int,status},                                       % 0没有奖励 1待审核 2拒绝 3通过 4已领取
        {int,match_status},                                 % 1比赛中 2比赛结束 
        {slots_match_rank_item,self_rank},                   % 自己排名信息
        {array,slots_match_rank_item,rank_list}            % 排行榜
      ],
      [req_slots_match_reward,                              %领取奖励
        {int,round}                                         %领取哪一期的奖励
      ],
      [notify_slots_match_reward,                           % 领取奖励
        {int,status},                                       % 0没有奖励 1待审核 2拒绝 3通过 4已领取 5领取成功
        {slots_match_reward,reward_info}
      ],
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    %%%    ######      ###    ##     ## ########    ########  ######## ##        #######  ##      ##   %%%
    %%%   ##    ##    ## ##   ###   ### ##          ##     ## ##       ##       ##     ## ##  ##  ##   %%%
    %%%   ##         ##   ##  #### #### ##          ##     ## ##       ##       ##     ## ##  ##  ##   %%%
    %%%   ##   #### ##     ## ## ### ## ######      ########  ######   ##       ##     ## ##  ##  ##   %%%
    %%%   ##    ##  ######### ##     ## ##          ##     ## ##       ##       ##     ## ##  ##  ##   %%%
    %%%   ##    ##  ##     ## ##     ## ##          ##     ## ##       ##       ##     ## ##  ##  ##   %%%
    %%%    ######   ##     ## ##     ## ########    ########  ######## ########  #######   ###  ###    %%%
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    %%%===================================================================================================
    %%% 财神驾到相关协议
    %%%===================================================================================================
    [proto_game_slots_200000],

      [req_slots_info],
      [notify_slots_info,
        {slots_bet, last_bet},                             % 上次投注
        {slots_bet_list, bet_list},                        % 投注列表
        {int, free_spins},                                 % 免费次数
        {array, msg_kv, extra_info},                       % 额外信息
        {array, int, click_index_list}                     % bonus开盒子列表
      ],
      % 请求旋转
      [req_slots_spin, {slots_bet, bet}],
      [notify_slots_spin,
        {slots_bet, last_bet},                              % 上次投注
        {array, int, symbol_list},                          % 符文列表，一般15个
        {array, line_item, lines},                          % 命中的连线
        {int64, money},                                     % 获取的金币
        {int, free_spins},                                 % 当前免费次数
        {int, left_free_spins},                            % 剩余免费次数
        {int, bonus},                                       % 小游戏次数（一般指开宝箱次数）
        {array, msg_kv, extra_info}                         % 额外信息
      ],
      [req_slots_open_box, {int, click_index}],
      [notify_slots_open_box,
        {array, int, box_times_list},                       % 宝箱倍数表
        {array, msg_kv, extra_info},                        % 额外信息
        {array, int, click_index_list}                      % 点击盒子下标
      ],

    %%%===================================================================================================
    %%% 金梅瓶相关协议
    %%%===================================================================================================
    [proto_game_jpm_200100],
      [req_jmp_info],
      [notify_jmp_info,
        {slots_bet, last_bet},                              % 上次投注
        {slots_bet_list, bet_list}
      ],
      % 请求旋转
      [req_jmp_spin, {slots_bet, bet}],
      [notify_jmp_spin_result,
        {slots_bet, last_bet},                              % 上次投注
        {array, int, symbol_list},                          % 符文列表，一般15个
        {int64, money},                                     % 获取的金币
        {int, free_spins},                                  % 当前免费次数
        {int, left_free_spins}                              % 剩余免费次数
      ],
    %%%===================================================================================================
    %%% 新秘鲁传说相关协议
    %%%===================================================================================================
    [proto_game_milu2_200300],
      [req_milu2_info],
      [notify_milu2_info,
        {slots_bet, last_bet},                              % 上次投注
        {slots_bet_list, bet_list},                         % 配置信息
        {int, free_spins}                                   % 免费次数
      ],
      % 请求旋转
      [req_milu2_spin, {slots_bet, bet}],
      [notify_milu2_spin_result,
        {array, int, symbol_list},                          % 符文列表，一般15个
        {slots_bet, last_bet},                              % 上次投注(配置信息中的索引)
        {int64, money},                                     % 获取的金币
        {int, free_spins},                                  % 当前免费次数
        {int, left_free_spins}                              % 剩余免费次数
      ],

    %%%===================================================================================================
    %%% 跳高高相关协议
    %%%===================================================================================================
    [proto_game_jump_200400],
      % 请求线数和下注列表
      [req_jump_info],
      % 通知客户端线数和下注列表
      [notify_jump_info,
        {slots_bet, last_bet},                             % 上次投注
        {slots_bet_list, bet_list},                        % 投注列表
        {int, min_bet},                                    % 最小投注
        {int, game_state}                                  % 0是收费游戏，非0为免费游戏
      ],
      % 请求旋转
      [req_jump_spin, {slots_bet, bet}],
      [notify_jump_spin_result,
        {slots_bet, last_bet},                             % 上次投注
        {array, int, symbol_list},                         % 符文列表，一般20个
        {int64, money},                                    % 获取的金币
        {int, free_time}                                   % 免费次数, 0表示没进入免费游戏，大于0表示进入免费游戏，且代表免费次数
      ],
      % 免费游戏请求旋转
      [req_jump_free_spin],
      [notify_jump_free_spin_result,
        {slots_bet, last_bet},                             % 上次投注
        {array, int, symbol_list},                         % 符文列表，一般20个
        {int, add_mult},                                   % 增加倍率
        {int64, money},                                    % 获取的金币
        {int64, total_money},                              % 当前所有的金币
        {int, free_time}                                   % 剩余次数
      ],
      % 免费游戏信息
      [req_jump_free_detail],
      [notify_jump_free_detail_result,
        {slots_bet, last_bet},                             % 上次投注
        {int, free_time},                                  % 免费次数
        {int64, total_money}                               % 当前免费获得的总金额
      ],

    %%%===================================================================================================
    %%% 赏金船长相关协议
    %%%===================================================================================================
    [proto_game_captain_200500],
      [req_captain_info],
      [notify_captain_info,
        {slots_bet, last_bet},                             % 上次投注
        {slots_bet_list, bet_list}                         % 投注列表
      ],
      % 请求旋转
      [req_captain_spin, {slots_bet, bet}],
      [notify_captain_spin_result,
        {slots_bet, last_bet},                             % 上次投注
        {array, int, symbol_list},                         % 符文列表，一般15个
        {int64, money},                                    % 获取的金币
        {int, free_spins},                                 % 当前免费次数
        {int, left_free_spins}                             % 剩余免费次数
      ],

    %%%===================================================================================================
    %%% 武财神相关协议
    %%%===================================================================================================
    [proto_game_wucaishen_200600],
      % 请求信息
      [req_wucaishen_info],
      % 通知游戏状态
      [notify_wucaishen_info,
        {slots_bet, last_bet},                              % 上次投注(配置信息中的索引)
        {slots_bet_list, bet_list},                         % 配置信息
        {int64, jackpot_money},                             % 奖池奖金
        {int64, last_jackpot},                              % 上次奖池
        {int64, time}                                       % 时间     
      ],

      [notify_wucaishen_jackpot, 
        {int64, jackpot_money},                             %当前奖池
        {int64, last_jackpot},                              %上次奖池
        {int64, time}                                       %时间
      ],
      % 请求旋转
      [req_wucaishen_spin, {slots_bet, bet}],
      [notify_wucaishen_spin_result,
        {slots_bet, last_bet},                              % 上次投注(配置信息中的索引)
        {array, int, symbol_list},                          % 图标列表,3*5个
        {array, line_item, lines},                          % 游戏中奖线
        {int64, money},                                     % 中的分数
        {int, free_spins},                                  % 免费次数
        {int64, jackpot_money}                              % 奖池奖金
      ],
    %%%===================================================================================================
    %%% 麻将胡了2相关协议
    %%%===================================================================================================
    [proto_game_mjhl2_200800],
      [req_mjhl2_info],
      [notify_mjhl2_info,
        {slots_bet, last_bet},                              % 上次投注
        {slots_bet_list, bet_list}
      ],
      % 请求旋转
      [req_mjhl2_spin,{slots_bet, bet}],
      [notify_mjhl2_spin_result,
        {slots_bet, last_bet},                              % 上次投注
        {array, int, symbol_list},                          % 符文列表，一般15个
        {int64, money},                                     % 获取的金币
        {int, free_spins},                                  % 当前免费次数
        {int, left_free_spins}                              % 剩余免费次数
      ],
    %%%===================================================================================================
    %%% 大小竞猜协议
    %%%===================================================================================================
    [proto_game_minigame_200900],
      % 累计分数排行
      [minigame_rank_item,
        {int, rank},
        {string, nickname},
        {int64, money}
      ],
      % 色子的数据
      [dice_item,
        {array, int, dice_num}                              % 色子的点数或颜色
      ],
      % 玩家进入时的游戏信息通知，用来进入游戏时，还原界面上的数据
      [notify_bigsmall_info,
        {int, stageIndex},                                  % 游戏哪个阶段, 1=>下注阶段, 2=>平衡阶段, 3=>展示结果阶段
        {stime, end_time},                                  % 当前阶段的结束时间点(废弃掉，改用end_time2)
        {array, int64, beted_money},                        % 如果是在下注或平衡阶段时，两个位置上已经下注的分数
        {array, int, dice_num},                             % 如果是在展示结果阶段时，三颗色子的点数
        {array, int, beted_playercount},                    % 两个位置上下注的人数
        {array, int64, self_beted_money},                   % 自己下注的分数
        {int64, min_bet},                                   % 一个人最少能下注下限
        {int64, max_bet},                                   % 一个人最多能下注上限
        {array, int, history_result},                       % 历史趋势
        {int64, server_timestamp},                          % 服务器的时间戳
        {int64, end_time2}                                  % 当前阶段的结束时间点，服务器的毫秒级时间戳
      ],
      % 游戏过程变换的通知
      [notify_bigsmall_stage,
        {int, stageIndex},                                  % 游戏哪个阶段, 1=>下注阶段, 2=>平衡阶段, 3=>展示结果阶段
        {stime, end_time},                                  % 当前阶段的结束时间点
        {int, balance_result},                              % 结果出大还是小, 1=>'大', 2=>'小'
        {array, int, dice_num},                             % 三颗色子的点数，要刷新趋势图里面的数据
        {int64, money},                                     % 奖励
        {int64, money2},                                    % 加的分,如果是赢局，包括返还的下注分和奖励的总和，如果是输局，为0
        {int64, cur_money},                                 % 当前玩家携带总分
        {int64, end_time2}                                  % 当前阶段的结束时间点，服务器的毫秒级时间戳
      ],
      % 玩家下注请求
      [req_bigsmall_bet,
        {int, poolIndex},                                   % 下注的位置索引， 1=>下在"大"的位置， 2=>下在"小"的位置
        {int, bet_money}                                    % 下注分
      ],
      % 玩家自己下注通知
      [notify_bigsmall_self_bet,
        {common_result, result},                            % 1=>成功，2=>失败
        {int, poolIndex},                                   % 直接返回下注的索引位置
        {int, bet_money}                                    % 直接返回下注的分数
      ],
      % 玩家下注定时通知
      [notify_bigsmall_bet,
        {array, int64, money},                              % 索引1表示"大"位置的累计下注分，索引2表示"小"位置的累计下注分
        {array, int, bet_player_num}                        % 索引1表示"大"位置的累计下注人数， 索引2表示"小"位置的累计下注人数
      ],
      % 请求昨日排行数据
      [req_bigsmall_rank],
      % 昨日排行数据通知
      [notify_bigsmall_rank,
        {array, minigame_rank_item, rank_item}
      ],
      % 请求玩家的历史记录
      [req_bigsmall_history],
      % 玩家的历史记录通知
      [notify_bigsmall_history,
        {array, game_record_item, record_item}
      ],
      % 请求游戏的趋势图数据
      [req_bigsmall_trendchart],
      % 游戏的趋势图数据通知
      [notify_bigsmall_trendchart,
        {array, int, history_result},                       % 历史趋势数据
        {array, dice_item, dice_list}                       % 色子的历史数据
      ],
      % 全服下注倒计时通知
      [notify_bettime_bigsmall_to_all,
        {stime, end_time},                                  % 下注阶段的结束时间点(废弃掉，改用end_time2)
        {int64, end_time2},                                 % 下注阶段的结束时间点
        {int64, server_timestamp}                           % 服务器的时间戳
      ],

    %%%===================================================================================================
    %%% 龙虎斗协议
    %%%===================================================================================================
    [proto_game_longhu_201000],
      % 玩家进入时的游戏信息通知，用来进入游戏时，还原界面上的数据
      [notify_longhu_info,
        {int, stageIndex},                                  % 游戏哪个阶段, 1=>下注阶段, 3=>展示结果阶段
        {stime, end_time},                                  % 当前阶段的结束时间点(废弃掉，改用end_time2)
        {array, int64, beted_money},                        % 如果是在下注或平衡阶段时，两个位置上已经下注的分数
        {array, int, dice_num},                             % 如果是在展示结果阶段时，两张牌的点数
        {array, int, beted_playercount},                    % 两个位置上下注的人数
        {array, int64, self_beted_money},                   % 自己下注的分数
        {int, min_bet},                                     % 一个人最少能下注下限
        {int64, max_bet},                                   % 一个人最多能下注上限
        {array, int, history_result},                       % 历史趋势 1=>龙，2=>虎
        {int64, server_timestamp},                          % 服务器的时间戳
        {int64, end_time2}                                  % 当前阶段的结束时间点，服务器的毫秒级时间戳
      ],
      % 游戏过程变换的通知
      [notify_longhu_stage,
        {int, stageIndex},                                  % 游戏哪个阶段, 1=>下注阶段, 2=>平衡阶段, 3=>展示结果阶段
        {stime, end_time},                                  % 当前阶段的结束时间点
        {int, balance_result},                              % 结果出龙还是虎, 1=>'龙', 2=>'虎'
        {array, int, dice_num},                             % 两张牌的点数，要刷新趋势图里面的数据
        {int64, money},                                     % 奖励
        {int64, money2},                                    % 加的分,如果是赢局，包括返还的下注分和奖励的总和，如果是输局，为0，如果是平局，为下注分
        {int64, cur_money},                                 % 当前玩家携带总分
        {int64, end_time2}                                  % 当前阶段的结束时间点，服务器的毫秒级时间戳
      ],
      % 玩家下注请求
      [req_longhu_bet,
        {int, poolIndex},                                   % 下注的位置索引， 1=>下在"龙"的位置， 2=>下在"虎"的位置
        {int, bet_money}                                    % 下注分
      ],
      %玩家自己下注通知
      [notify_longhu_self_bet,
        {common_result, result},                            % 1=>成功，2=>失败
        {int, poolIndex},                                   % 直接返回下注的索引位置
        {int, bet_money}                                    % 直接返回下注的分数
      ],
      % 玩家下注定时通知
      [notify_longhu_bet,
        {array, int64, money},                              % 索引1表示"龙"位置的累计下注分，索引2表示"虎"位置的累计下注分
        {array, int, bet_player_num}                        % 索引1表示"龙"位置的累计下注人数， 索引2表示"虎"位置的累计下注人数
      ],
      % 请求昨日排行数据
      [req_longhu_rank],
      % 昨日排行数据通知
      [notify_longhu_rank,
        {array, minigame_rank_item, rank_item}
      ],
      % 请求玩家的历史记录
      [req_longhu_history],
      % 玩家的历史记录通知
      [notify_longhu_history,
        {array, game_record_item, record_item}
      ],
      % 请求游戏的趋势图数据
      [req_longhu_trendchart],
      % 游戏的趋势图数据通知
      [notify_longhu_trendchart,
        {array, int, history_result}                        % 历史趋势数据
      ],

    %%%===================================================================================================
    %%% 猜双单协议
    %%%===================================================================================================
    [proto_game_shuangdan_201100],
      % 玩家进入时的游戏信息通知，用来进入游戏时，还原界面上的数据
      [notify_shuangdan_info,
        {int, stageIndex},                                  % 游戏哪个阶段, 1=>下注阶段, 3=>展示结果阶段
        {stime, end_time},                                  % 当前阶段的结束时间点(废弃掉，改用end_time2)
        {array, int64, beted_money},                        % 如果是在下注或平衡阶段时，两个位置上已经下注的分数
        {int, balance_result},                              % 如果是在展示结果阶段时，1=>一红三白, 2=>二红二白, 3=>三红一白, 4=>四红, 5=>四白
        {array, int, beted_playercount},                    % 6个位置上下注的人数,从1开始，顺序是从界面上的第一行的左到右，然后是第二行的左到右
        {array, int64, self_beted_money},                   % 自己下注的分数
        {int, min_bet},                                     % 一个人最少能下注下限
        {int64, max_bet},                                   % 一个人最多能下注上限
        {array, int, history_result},                       % 历史趋势 1=>一红三白, 2=>二红二白, 3=>三红一白, 4=>四红, 5=>四白
        {int64, server_timestamp},                          % 服务器的时间戳
        {int64, end_time2}                                  % 当前阶段的结束时间点，服务器的毫秒级时间戳
      ],
      % 游戏过程变换的通知
      [notify_shuangdan_stage,
        {int, stageIndex},                                  % 游戏哪个阶段, 1=>下注阶段, 2=>平衡阶段, 3=>展示结果阶段
        {stime, end_time},                                  % 当前阶段的结束时间点
        {int, balance_result},                              % 结算结果 1=>一红三白, 2=>二红二白, 3=>三红一白, 4=>四红, 5=>四白
        {int64, money},                                     % 奖励
        {int64, money2},                                    % 加的分,如果是赢局，包括返还的下注分和奖励的总和，如果是输局，为0
        {int64, cur_money},                                 % 当前玩家携带总分
        {int64, end_time2}                                  % 当前阶段的结束时间点，服务器的毫秒级时间戳
      ],
      % 玩家下注请求
      [req_shuangdan_bet,
        {int, poolIndex},                                   % 下注的位置索引，从1开始，顺序是从界面上的第一行的左到右，然后是第二行的左到右
        {int, bet_money}                                    % 下注分
      ],
      % 玩家自己下注通知
      [notify_shuangdan_self_bet,
        {common_result, result},                            % 1=>成功，2=>失败
        {int, poolIndex},                                   % 直接返回下注的索引位置
        {int, bet_money}                                    % 直接返回下注的分数
      ],
      % 玩家下注定时通知
      [notify_shuangdan_bet,
        {array, int64, money},                              % 累计下注分, 从1开始，顺序是从界面上的第一行的左到右，然后是第二行的左到右
        {array, int, bet_player_num}                        % 累计下注人数, 从1开始，顺序是从界面上的第一行的左到右，然后是第二行的左到右
      ],
      % 请求昨日排行数据
      [req_shuangdan_rank],
      % 昨日排行数据通知
      [notify_shuangdan_rank,
        {array, minigame_rank_item, rank_item}
      ],
      % 请求玩家的历史记录
      [req_shuangdan_history],
      % 玩家的历史记录通知
      [notify_shuangdan_history,
        {array, game_record_item, record_item}
      ],

    %%%===================================================================================================
    %%% 大逃杀协议
    %%%===================================================================================================
    [proto_game_dataosha_201200],
      % 大逃杀历史记录结构(最近100次被杀次数)
      [dataosha_history_100,
        {int, killroom},                                    % 被杀房间
        {int, killcount}                                    % 被杀次数(最近100次被杀次数)
      ],
      % 大逃杀历史记录结构(最近10次被杀房间记录)
      [dataosha_history_10,
        {int, killroom},                                    % 被杀房间
        {string, roundid}                                   % 局号
      ],
      % 下注筹码信息
      [dataosha_betchips,
        {int64, value}                                      % 面值
      ],
      % 玩家下注信息
      [dataosha_bet_info,
        {uint64, role_id},                                  % 玩家角色id
        {string, nickname},                                 % 玩家昵称
        {int, poolIndex},                                   % 下注的位置索引
        {int64, money}                                      % 下注金额
      ],
      % 没下注玩家信息
      [dataosha_no_bet_info,
        {uint64, role_id},                                  % 玩家角色id
        {string, nickname}                                  % 玩家昵称
      ],
      % 区域下注总额
      [dataosha_totalbet_info,
        {int, poolIndex},                                   % 下注的位置索引
        {int64, money}                                      % 下注金额
      ],
      % 开奖区域后，客户端的结束表现时间
      [dataosha_gameover_time,
        {int, poolIndex},                                   % 开奖位置索引
        {int, time}                                         % 对应时间毫秒数
      ],
      % 玩家个人大逃杀具体记录
      [dataosha_self_record_detail,
        {string, roundid},                                  % 局号
        {int64, create_timestamp},                          % 时间
        {int64, bet},                                       % 投入
        {int64, win},                                       % 获奖
        {int, betpool},                                     % 个人下注区域
        {int, winpool}                                      % 杀手去的房间
      ],
      % 玩家个人大逃杀记录
      [dataosha_self_record,
        {int64, totalbet},                                  % 总投入
        {int64, totalwin},                                  % 总获奖
        {array, dataosha_self_record_detail, selfdetail}    % 个人最近10局记录
      ],
      % 请求大逃杀游戏信息
      [req_dataosha_info],
      % 玩家进入时的游戏信息通知，用来进入游戏时，还原界面上的数据
      [notify_dataosha_info,
        {int, stageIndex},                                  % 游戏哪个阶段, 1=>下注阶段, 2=>展示结果阶段
        {stime, end_time},                                  % 当前阶段的结束时间点(废弃掉，改用end_time2)
        {int, killroom},                                    % 如果是在展示结果阶段时，被杀房间
        {int64, killroomtotalbet},                          % 被杀房间总投注了多少金额，客户端显示XX金币被瓜分
        {int64, winamount},                                 % 加的分,如果是赢局，包括返还的下注分和奖励的总和，如果是输局，为0
        {array, dataosha_bet_info, all_betinfo},            % 所有玩家的下注信息
        {array, dataosha_totalbet_info, totalbetAmount},    % 各个下注区域位置上下注的分数
        {array, dataosha_no_bet_info, nobetplayer},         % 没有下注的玩家roleid列表
        {array, dataosha_gameover_time, gameover_time},     % 开奖区域，客户端的结束表现时间
        {int, bet_time},                                    % 每一局下注的时间
        {array, dataosha_betchips, betchips},               % 筹码面值
        {int64, my_chip},                                   % 自定义筹码
        {dataosha_bet_info, self_betinfo},                  % 自己下注的分数
        {int, min_bet},                                     % 一个人最少能下注下限
        {int64, max_bet},                                   % 一个人最多能下注上限
        {int64, server_timestamp},                          % 服务器的时间戳
        {int64, end_time2}                                  % 当前阶段的结束时间点，服务器的毫秒级时间戳
      ],
      % 游戏结果通知
      [notify_dataosha_gameover,
        {int, stageIndex},                                  % 游戏哪个阶段, 1=>下注阶段, 2=>展示结果阶段
        {stime, end_time},                                  % 当前阶段的结束时间点
        {int64, betmoney},                                  % 玩家投入多少
        {int, killroom},                                    % 结果哪个房间被杀
        {int64, killroomtotalbet},                          % 被杀房间总投注了多少金额，客户端显示XX金币被瓜分
        {int64, winamount},                                 % 加的分,如果是赢局，包括返还的下注分和奖励的总和，如果是输局，为0
        {int64, cur_money},                                 % 当前玩家携带总分
        {int64, end_time2},                                 % 当前阶段的结束时间点，服务器的毫秒级时间戳
        {string, server_ciphertext},                        % 服务器的密文
        {string, roundid}                                   % 局号
      ],
      % 游戏过程变换的通知
      [notify_batch_dataosha_stage,
        {int, stageIndex},                                  % 游戏哪个阶段, 1=>下注阶段, 2=>展示结果阶段
        {stime, end_time},                                  % 当前阶段的结束时间点
        {int, killroom},                                    % 结果哪个房间被杀
        {int64, end_time2}                                  % 当前阶段的结束时间点，服务器的毫秒级时间戳
      ],
      %其他玩家进入通知
      [notify_dataosha_others_enter,
        {uint64, role_id},                                  % 玩家角色id
        {string, nickname}                                  % 玩家昵称
      ],
      % 其他玩家离开通知
      [notify_dataosha_others_leave,
        {uint64, role_id}                                   % 玩家角色id
      ],
      % 玩家下注请求
      [req_dataosha_bet,
        {int, poolIndex},                                   % 下注的位置索引， 具体位置示意图见文档
        {int, bet_money}                                    % 下注分
      ],
      % 玩家下注通知
      [rsp_dataosha_bet,
        {common_result, result},                            % 1=>成功，2=>失败
        {int, poolIndex},                                   % 直接返回下注的索引位置
        {int, bet_money},                                   % 直接返回下注的分数
        {int, pre_poolIndex}                                % 玩家下注前的位置索引，出生点默认为0。只有当pre_poolIndex=0，客户端才做动画表现
      ],
      % 其他玩家下注通知
      [notify_dataosha_others_bet,
        {uint64, role_id},                                  % 玩家角色id
        {string, nickname},                                 % 玩家昵称
        {int, poolIndex},                                   % 直接返回下注的索引位置
        {int, bet_money},                                   % 直接返回下注的分数
        {int, pre_poolIndex}                                % 玩家下注前的位置索引，出生点默认为0。只有当pre_poolIndex=0，客户端才做动画表现
      ],
      % 请求昨日排行数据
      [req_dataosha_rank],
      % 请求玩家的历史记录
      [req_dataosha_history],
      % 玩家的历史记录通知
      [rsp_dataosha_history,
        {array, int, killrooms},                            % 最近100场顺序
        {array, dataosha_history_100, history_100},
        {array, dataosha_history_10, history_10},
        {dataosha_self_record, self_record}
      ],
      % 游戏中请求种子信息
      [req_dataosha_seed],
      % s2c返回当局的种子信息
      [rsp_dataosha_seed,
        {string, client_seed},                              % 客户端的种子
        {string, server_ciphertext}                         % 服务器的密文
      ],
      % 请求公平性验证
      [req_dataosha_fair_verify,
        {string, roundid}                                   % 局号
      ],
      % s2c返回公平性验证的各种信息
      [rsp_dataosha_fair_verify,
        {string, client_seed},                              % 客户端的种子
        {string, server_ciphertext},                        % 服务器的密文
        {string, server_plaintext},                         % 服务器的明文
        {string, complete_plaintext},                       % 两者拼接明文
        {string, complete_ciphertext},                      % 两者拼接密文
        {string, prefix5},                                  % 密文前五位
        {string, prefix5_decimal},                          % 密文前五位转十进制
        {string, prefix5_decimal_mod},                      % 两者拼接密文
        {string, killroom}                                  % 两者拼接密文
      ],

      % 设置自定义筹码
      [req_dataosha_set_my_chip,
        {int64, chip}
      ],

      % 设置自定义筹码反馈
      [rsp_dataosha_set_my_chip,
        {int, result}                                       % 0:成功 1:失败
      ],

      % 玩家修改下注位置
      [req_dataosha_set_bet_index,
        {int, poolIndex}                                    % 下注的位置索引， 具体位置示意图见文档
      ],
      % 玩家修改下注位置通知
      [rsp_dataosha_set_bet_index,
        {common_result, result},                            % 1=>成功，2=>失败
        {int, poolIndex},                                   % 直接返回修改的索引位置
        {int, index_money},                                 % 直接返修改后的索引的分数
        {int, pre_poolIndex}                                % 玩家下注前的位置索引，出生点默认为0。只有当pre_poolIndex=0，客户端才做动画表现
      ],
      % 其他玩家修改下注位置通知
      [notify_dataosha_others_set_bet_index,
        {uint64, role_id},                                  % 玩家角色id
        {string, nickname},                                 % 玩家昵称
        {int, poolIndex},                                   % 直接返回修改的索引位置
        {int, index_money},                                   % 直接返回下注的分数
        {int, pre_poolIndex}                                % 玩家修改前的位置索引，出生点默认为0。只有当pre_poolIndex=0，客户端才做动画表现
      ],

    %%%===================================================================================================
    %%% 跑得快协议
    %%%===================================================================================================
    [proto_game_pdk_201300],
      % 玩家信息
      [pdk_user_info,
        {uint64, role_id},                                  % 玩家角色id
        {string, nickname},                                 % 玩家昵称
        {int, role_status},                                 % 玩家状态
        {int, gender},                                      % 玩家性别
        {string, head_photo},                               % 玩家头像
        {int, chairid},                                     % 玩家椅子id
        {int64, current_money},                             % 玩家身上金币
        {int64, score},                                     % 玩家当局输赢分数
        {array, int, leftcarddata},                         % 玩家剩余手牌
        {int, leftcardcount},                               % 玩家剩余手牌张数
        {array, int, turn_card_data},                       % 当前回合出的牌
        {int, tianhutype},                                  % 1.四个二 2.四个三 3.六连对 4.包含三的三连对 首局  5.手牌全顺
        {array, int, tianhu_carddata},                      % 天胡手牌 不是天胡则为空
        {int, trusteeship}                                  % 托管
      ],
      % 请求游戏信息
      [req_pdk_info],
      % 下面三个场景，是当玩家进入房间的时候(不管是第一次进还是中途断线重进),收到的阶段信息。
      % gamescene 1：空闲 2：游戏中 3：结算中
      % 玩家进入时的游戏信息通知，用来进入游戏时，还原界面上的数据
      [notify_pdk_info,
        {int, gamescene},                                   % 当前游戏场景
        {int, game_mode},                                   % 当前游戏模式
        {array, pdk_user_info, userinfo},                   % 玩家信息
        {int, bankchairid},                                 % 庄家椅子id
        {int, outcardchairid},                              % 出牌玩家椅子id
        {int, currentchairid},                              % 当前行动玩家椅子id
        {int, bet_base},                                    % 当前桌子的底注
        {array, int, timeslist},                            % 场景时间 依次为空闲时间 倒计时时间 行动时间 结算时间 新增自动准备时间
        {int64, server_timestamp},                          % 服务器的时间戳
        {int64, end_time2},                                 % 当前阶段的结束时间点，服务器的毫秒级时间戳
        {int, control_card},                                % 是否启用客户端配牌
        {string, game_no},                                  % 游戏局号
        {string, client_key},{string, client_hash}, {string, server_hash}
        ],
      % 准备成功后，满足开局会收到开始倒计时
      [notify_pdk_start_counting,
        {int64, end_time2}                                  % 结束时间
      ],
      % 玩家出牌
      [req_pdk_out_card,
        {array,int, carddata}                               % 出牌数据
      ],
      % 出牌通知
      [notify_s2c_out_card,
        {int, outcardchairid},                              % 出牌玩家的椅子id
        {int, currentchairid},                              % 出牌后轮到的下家
        {array,int, carddata},                              % 出牌数据
        {int, leftcardcount},                               % 玩家剩余手牌数量
        {int, is_realtime_settle},                          % 是否有实时结算 0:没有 1:有
        {int, losechairid},                                 % 输牌的玩家椅子id
        {int, winchairid},                                  % 赢牌的玩家椅子id
        {array, int64, score},                              % 赢得金额
        {array, int64, new_self_score}                      % 1赢家当前金额 2输家当前金额
      ],
      % 玩家过牌不出牌
      [req_pdk_pass_card],
      % 过牌不出通知
      [notify_s2c_pass_card,
        {int, passcardchairid},                             % 过牌玩家的椅子id
        {int, currentchairid},                              % 过牌后轮到的下家
        {int, turnover}                                     % 这一轮是否结果 0:未结束 1:结束
      ],
      % 玩家行动后错误反馈
      [rsp_pdk_error,
        {string, errormsg}                                  % 错误字符串
      ],
      % 游戏开始通知
      [pdk_role_cards, {uint64, role_id}, {array, int, cards},{int, leftcardcount}],
      [notify_s2c_game_start,
        {int, bankchairid},                                 % 庄家椅子id,从庄家开始逆时针发牌
        {array, pdk_role_cards, role_cards},                % 牌局信息
        {int, tianhu_type},                                 % 天胡类型
        {string, game_no},                                  % 游戏局号
        {string, client_key},{string, client_hash}, {string, server_hash}
      ],
      % 游戏结束通知
      [notify_s2c_game_over,
        {array, pdk_user_info, userinfo}                    % 玩家信息
      ],
      % 配牌请求
      [req_pdk_cheat,
        {array, int, carddata}                              % 配牌数据
      ],
      % 配牌反馈
      [rsp_pdk_cheat,
        {int, result}                                       % 玩家信息 0:配牌失败 1:配牌成功
      ],
      [pdk_config,
        {int, betbase},                                     % 空闲时间
        {int, tdle_time},                                   % 空闲时间
        {int, start_counting_time},                         % 开始倒计时的时间
        {int, tianhu_counting_time},                        % 天胡倒计时的时间
        {int, action_counting_time},                        % 玩家行动倒计时的时间
        {int, settlement_time}                              % 结算时间
      ],
      % 通知 本轮不能压牌的状态
      [notify_pdk_role_Cannot_out_cards,
        {int, chair_id}
      ],
      % 开始游戏成功与否
      [notify_pdk_start_game_res, {int, start_game_res}],
      % 请求获取当前桌子的最近10局录像
      [req_pdk_video_record10],
      % 返回当前桌子的最近10局录像局号
      [notify_pdk_video_record10, {array, string, video_list}],
      [notify_pdk_trusteeship,
        {int, role_id},                                     % 玩家ID
        {int, type}                                         % 是否托管 1托管  2没托管
      ],

    %%%===================================================================================================
    %%% 德州扑克
    %%%===================================================================================================
    [proto_game_tx_201400],
      [tx_bet_money, {uint64, role_id}, {uint64, bet_money}],
      [tx_multi_cards, {array, int, cards}],
      [tx_role_cards, {uint64, role_id}, {array, int, cards}],
      [tx_role_outs, {uint64, role_id}, {array, int, outs}, {int, win_ratio}], % 玩家赢的概率，买保险的时候有outs，多次发牌的时候没有outs
      [tx_blind_money, {uint64, role_id}, {uint64, blind_money}],
      [tx_score_info, {array, int, com_cards}, {int, com_type}, {int, score}], % 玩家组合类型，score用于对比手牌之间的大小

      % 通知开始游戏，通知庄家，每个人的牌以及盲注，未下盲注的盲注为0
      [notify_tx_start, {uint64, banker_id}, {array, tx_role_cards, role_cards}, {array, tx_blind_money, blind_moneys}, {string, video}],
      % 通知新一轮开始,桌面的牌<可能存在多轮发牌>,桌面水池,游戏状态,当前边池列表
      [notify_tx_turn, {array, tx_multi_cards, cards_list}, {uint64, pod_money}, {tx_game_status, game_status}, {array, uint64, pot_list}],
      % 通知行牌,玩家id，时间银行剩余时间
      [notify_tx_operator, {uint64, role_id}, {uint64, time_bank}, {uint64, end_time}],
      % 将其他玩家明牌
      [notify_tx_show_cards, {array, tx_role_cards, role_cards}],
      % 通知买保险, 并翻开其他玩家的牌
      [notify_tx_insurance, {array, tx_role_outs, role_outs}, {uint64, odds_role_id}, {uint64, outs_min_pay}, {uint64, outs_max_pay}, {common_judge, insurance_again}, {uint64, end_time}],

      % 下注
      [req_tx_bet, {uint64, bet_money}],
      [notify_tx_bet, {tx_bet_money, bet}, {common_result, result}, {string, err_msg}],
      % 跟注
      [req_tx_call],
      [notify_tx_call, {tx_bet_money, bet}, {common_result, result}, {string, err_msg}],
      % 加注
      [req_tx_raise, {uint64, bet_money}],
      [notify_tx_raise, {tx_bet_money, bet}, {common_result, result}, {string, err_msg}],
      % 过牌
      [req_tx_check],
      [notify_tx_check, {uint64, role_id}, {common_result, result}, {string, err_msg}],
      % 弃牌
      [req_tx_fold],
      [notify_tx_fold, {uint64, role_id}, {common_result, result}, {string, err_msg}],
      % allin
      [req_tx_allin],
      [notify_tx_allin, {tx_bet_money, bet}, {common_result, result}, {string, err_msg}],
      % 增加买保险时间
      [req_tx_add_insurance_time],
      [notify_tx_add_insurance_time, {uint64, end_time}],
      % 买保险
      [req_tx_buy_insurance, {array, int, cards}, {uint64, money}], % 不传牌和钱代表不买保险
      [notify_tx_buy_insurance, {uint64, odds_role_id}, {common_judge, is_bought}, {common_result, result}, {string, err_msg}],
      % 通知玩家可以进行多次发牌请求
      [notify_tx_multi_deals, {array, tx_role_outs, role_outs}, {uint64, role_id}, {uint64, end_time}],
      % 请求发牌次数
      [req_tx_multi_deals, {int, times}],
      % 通知对方请求多次发牌
      [notify_tx_req_multi_deals, {uint64, from_role_id}, {uint64, to_role_id}, {int, times}, {uint64, end_time}],
      % 同意多次发牌请求
      [req_tx_agree_multi_deals, {common_judge, agree}],
      % 通知同意多次发牌请求
      [notify_tx_agree_multi_deals, {uint64, role_id}, {common_judge, agree}, {int, times}],
      % 玩家亮牌
      [req_tx_show_role_cards, {array, int, cards}],
      [notify_tx_show_role_cards, {tx_role_cards, role_cards}],
      % 玩家请求未亮牌的底牌
      [req_tx_show_desktop_cards],
      [notify_tx_show_desktop_cards, {array, int, cards}, {common_result, result}, {string, err_msg}],
      % 玩家请求买入
      [req_tx_take_money, {uint64, money}],
      % 通知玩家买入
      [notify_tx_take_money, {uint64, role_id}, {uint64, money}, {common_result, result}, {string, err_msg}],
      % 时间银行请求延长时间:在收到turn时自动请求延长时间或者操作过程中手动请求延长时间
      [req_tx_use_time_bank],
      % 返回可增加时间
      [notify_tx_use_time_bank, {uint64, role_id}, {uint64, time_bank}, {common_result, result}],
      % 请求获取当前桌子的最近10局录像
      [req_tx_video_record10],
      % 返回当前桌子的最近10局录像局号
      [notify_tx_video_record10, {array, string, video_list}],

      % 通知返还多余的钱，仅在下注操作结束后发送一次
      [notify_tx_refund, {uint64, role_id}, {uint64, money}],

      % 对局信息
      [tx_game_info,
        {int, total},                                       % 参与此游戏的局数
        {int, win},                                         % 胜利局数
        {int, play},                                        % 入局局数
        {int, raise},                                       % 加注局数
        {int, fold}                                         % 弃牌局数
      ],

      % 结算信息
      [tx_pot_role, {uint64, role_id}, {uint64, win}, {uint64, revenue}],
      [tx_pot, {array, tx_pot_role, pot_roles}],
      [tx_settlement_item, {tx_role_cards, role_cards}, {int64, cur_moeny}, {uint64, insurance}, {tx_game_info, game_info}, {array, tx_score_info, score_info}],
      [notify_tx_settlement, {array, tx_settlement_item, settlement_list}, {uint64, pod_money}, {array, tx_pot, pot_list}, {uint64, end_time}],

      % 配置信息
      [tx_config,
        {uint64, min_take},
        {uint64, max_take},
        {tx_bet_type, bet_type},
        {tx_play_type, play_type},
        {tx_blind_type, blind_type},
        {uint64, small_blind},
        {uint64, big_blind},
        {uint64, need_chip},
        {uint64, max_chip},
        {uint64, deal_per_time},
        {uint64, look_at_cards_time},
        {uint64, operate_time},
        {uint64, settlement_time},
        {common_judge, open_insurance},
        {common_judge, open_multi_deal},
        {uint64, insurance_time},
        {uint64, req_multi_deal_time},
        {uint64, agree_multi_deal_time},
        {uint64, insurance_add_time},
        {uint64, insurance_add_time_count},
        {uint64, insurance_pod_blind_times},
        {uint64, multi_deal_pod_blind_times},
        {uint64, max_multi_deal_count},
        {uint64, waitting_start_countdown},
        {uint64, settlement_countdown}
      ],
      % 请求房间信息
      [req_tx_info],
      % 房间信息
      % 玩家游戏内当前信息
      [tx_role_item,
        {int, pos},
        {array, int, chip_link},                            % 本轮下注跟注所下的筹码
        {tx_role_cards, role_cards},
        {tx_role_status, role_status},
        {tx_game_info, game_info},
        {common_judge, fold},
        {common_judge, allin},
        {common_judge, is_online}
      ],
      [tx_game_role_info, {room_role_base, role_base}, {tx_role_item, role_item}],
      [notify_tx_room_info,
        {tx_game_status, game_status},
        {array, tx_game_role_info, roles},
        {uint64, banker_id},
        {tx_game_status, multi_deal_game_status},           % 请求多次发牌的阶段
        {uint64, multi_deals_count},                        % 总共多少次发牌
        {array, tx_multi_cards, cards_list},                % 桌面牌
        {uint64, pod_money},                                % 桌面水池
        {tx_config, config},
        {uint64, odds_role_id},                             % 保险玩家
        {array, tx_role_outs, role_outs},                   % outs
        {uint64, outs_min_pay},                             % outs最低赔付额:当为0是最小投保额度为小盲
        {uint64, outs_max_pay},                             % 最大赔付额度
        {common_judge, current_insurance_add_time_count},   % 当前保险加了几次时间
        {notify_tx_settlement, settlement},
        {uint64, time_bank},                                % 时间银行剩余时间
        {uint64, op_time_bank},                             % 为0代表操作玩家没有使用时间银行：和end_time相等代表正在使用时间银行；比end_time大代表end_time 后会使用时间银行
        {int, raise_count},                                 % 当前加注了几次
        {uint64, end_time}
      ],
      % 获取自己当前剩余时间银行
      [req_tx_time_bank],
      % 返回自己当前剩余时间银行
      [notify_tx_time_bank, {uint64, time_bank}],

    %%%===================================================================================================
    %%% 21点
    %%%===================================================================================================
    [proto_game_bj_201500],

    %%%===================================================================================================
    %%% 十三水
    %%%===================================================================================================
    [proto_game_sss_201600],

    %%%===================================================================================================
    %%% 百家乐
    %%%===================================================================================================
    [proto_game_baijiale_201700],
      % 桌面筹码结构,每个区域的筹码是一个列表，列表中每个值为筹码大小，对应数量
      [baijiale_chip, {int64, chip_size}, {int64, chip_count}],
      [baijiale_area_bet, {baijiale_area, area}, {array, baijiale_chip, chips}, {int64, bet_role_count}],
      [baijiale_desktop_chip, {array, baijiale_area_bet, area_list}],
      % 玩家游戏内当前信息:对于大富豪，神算子，需要total，win，play，max_win，对于庄家，需要total，win，max_win，banker_count，left_banker_count
      [baijiale_game_info,
        {int, total},                                       % 参与此游戏的局数
        {int, win},                                         % 近10局赢钱的局数
        {int, play},                                        % 入局局数
        {int, max_win},                                     % 最大赢分
        {int, banker_count},                                % 连庄局数
        {int, left_banker_count}                            % 剩余当庄局数
      ],
      [baijiale_game_role_info, {room_role_base, role_base}, {baijiale_game_info, game_info}],

      % 通知洗牌，客户端清楚路子数据
      [notify_baijiale_shuffle],
      % 通知开始下注
      [notify_baijiale_start_bet, {string, video}, {uint64, rest_card_count}, {string, client_key}, {string, server_hash}, {uint64, end_time}],

      % 玩家下注
      [req_baijiale_bet, {baijiale_area, area}, {uint64, chip}],
      % 回复下注,可显示玩家下注成功返回
      [notify_baijiale_bet, {uint64, role_id}, {baijiale_area, area}, {uint64, chip}, {int64, bet_role_count}],
      % 下注失败返回
      [notify_baijiale_bet_failed, {string, err_msg}, {uint64, area_remain_money}],
      % 广播下注：每秒同步一次所有区域筹码
      [notify_baijiale_bet_all, {baijiale_desktop_chip, all_chips}, {array, uint64, limit_money_list}],
      % 自定义筹码
      [req_baijiale_customize_chip, {array, uint64, chip_list}, {uint64, customize_chip}],
      % 返回自定义筹码大小
      [notify_baijiale_customize_chip, {common_result, succ}, {array, uint64, chip_list}, {uint64, customize_chip}],
      % 请求上庄<进入上庄队列>
      [req_baijiale_banker_up],
      [notify_baijiale_banker_up, {baijiale_game_role_info, banker}, {array, baijiale_game_role_info, banker_list}, {common_result, result}, {string, err_msg}],
      % 请求下庄<退出上庄队列/如果是庄家，下一局不上庄>
      [req_baijiale_banker_down],
      [notify_baijiale_banker_down, {common_result, result}, {baijiale_game_role_info, banker}, {array, baijiale_game_role_info, banker_list}],
      % 取消下庄<当前在当庄，取消下庄请求，下一局继续当庄,如果是在上庄队列，不能取消>
      [req_baijiale_banker_down_cancel],
      [notify_baijiale_banker_down_cancel, {common_result, result}, {baijiale_game_role_info, banker}, {array, baijiale_game_role_info, banker_list}],
      % 请求获取当前桌子的最近10局记录
      [req_baijiale_video_record10],
      % 返回当前桌子的最近10局记录局号
      [baijiale_record10, {string, video}, {int64, win}],
      [notify_baijiale_video_record10, {array, baijiale_record10, video_list}],

      % 请求房间信息
      [req_baijiale_info],
      % 配置信息
      [baijiale_config,
        {uint64, min_bet},
        {uint64, need_chip},
        {uint64, max_chip},
        {array, int, default_chip_list},                    % 可选择的筹码列表
        {array, int, chip_list},                            % 当前选择的筹码列表
        {int, customize_chip_base},                         % 自定义筹码基础倍数
        {uint64, customize_chip},                           % 自定义筹码大小
        {uint64, banker_need},                              % 申请上庄需要的金额
        {uint64, role_bet_limit},                           % 玩家限红
        {uint64, system_bet_limit},                         % 系统限红
        {uint64, bet_time},
        {uint64, sync_chip_time},
        {uint64, deal_per_time},
        {uint64, settlement_time}
      ],
      % 房间信息：玩家信息这里只同步几个玩家的信息
      [notify_baijiale_room_info,
        {baijiale_game_status, game_status},
        {array, baijiale_game_role_info, roles},            % 第一个是大富豪，第二个是神算子
        {array, baijiale_game_role_info, banker_list},
        {baijiale_game_role_info, banker},                  % 当前庄
        {baijiale_game_role_info, self_role},
        {baijiale_config, config},
        {uint64, rest_card_count},
        {baijiale_desktop_chip, all_chips},
        {baijiale_desktop_chip, self_chips},
        {array, baijiale_desktop_chip, other_chips},        % 第一个是大富豪，第二个是神算子
        {array, int, record_list},
        {string, client_key},
        {string, server_hash},
        {string, video},                                    % 当前局号
        {int64, role_count},                                % 房间玩家数量
        {common_judge, open_player_banker},                 % 是否开启玩家上庄
        {uint64, end_time}
      ],

      % 单独推送玩家列表变化,大富豪，神算子, 庄家，庄家列表，玩家总数
      [notify_baijiale_game_role_update, {array, baijiale_game_role_info, roles}, {baijiale_game_role_info, banker}, {array, baijiale_game_role_info, banker_list}, {int64, role_count}, {string, video}],

      % 结算
      [baijiale_settlement_item, {int64, role_id}, {int64, cur_moeny}, {int64, get_money}],
      [notify_baijiale_settlement, {array, int, banker_cards}, {array, int, player_cards}, {int, banker_point}, {int, player_point}, {array, baijiale_settlement_item, settlement_list}, {int64, others_get_money}, {int, record}, {string, client_key}, {string, server_key}, {string, video}],

    %%%===================================================================================================
    %%% 鱼虾蟹
    %%%===================================================================================================
    [proto_game_yxx_201800],
      % 桌面筹码结构,每个区域的筹码是一个列表，列表中每个值为筹码大小，对应数量
      [yxx_chip, {int64, chip_size}, {int64, chip_count}],
      [yxx_area_bet, {yxx_area, area}, {array, yxx_chip, chips}, {int64, bet_role_count}],
      [yxx_desktop_chip, {array, yxx_area_bet, area_list}],
      % 玩家游戏内当前信息:对于大富豪，神算子，需要total，win，play，max_win，对于庄家，需要total，win，max_win，banker_count，left_banker_count
      [yxx_game_info,
        {int, total},                                       % 参与此游戏的局数
        {int, win},                                         % 近10局赢钱的局数
        {int, play},                                        % 入局局数
        {int, max_win},                                     % 最大赢分
        {int, banker_count},                                % 连庄局数
        {int, left_banker_count}                            % 剩余当庄局数
      ],
      [yxx_game_role_info, {room_role_base, role_base}, {yxx_game_info, game_info}],

      % 通知开始下注
      [notify_yxx_start_bet, {string, client_key}, {string, server_hash}, {uint64, end_time}],

      % 玩家下注
      [req_yxx_bet, {yxx_area, area}, {uint64, chip}],
      % 回复下注,可显示玩家下注成功返回
      [notify_yxx_bet, {uint64, role_id}, {yxx_area, area}, {uint64, chip}, {int64, bet_role_count}],
      % 下注失败返回
      [notify_yxx_bet_failed, {string, err_msg}, {uint64, area_remain_money}],
      % 广播下注：每秒同步一次所有区域筹码
      [notify_yxx_bet_all, {yxx_desktop_chip, all_chips}],
      % 自定义筹码
      [req_yxx_customize_chip, {array, int, chip_list}, {int, customize_chip}],
      % 返回自定义筹码大小
      [notify_yxx_customize_chip, {common_result, succ}, {array, int, chip_list}, {int, customize_chip}],
      % 请求上庄<进入上庄队列>
      [req_yxx_banker_up],
      [notify_yxx_banker_up, {yxx_game_role_info, banker}, {array, yxx_game_role_info, banker_list}, {common_result, result}, {string, err_msg}],
      % 请求下庄<退出上庄队列/如果是庄家，下一局不上庄>
      [req_yxx_banker_down],
      [notify_yxx_banker_down, {common_result, result}, {yxx_game_role_info, banker}, {array, yxx_game_role_info, banker_list}],
      % 取消下庄<当前在当庄，取消下庄请求，下一局继续当庄,如果是在上庄队列，不能取消>
      [req_yxx_banker_down_cancel],
      [notify_yxx_banker_down_cancel, {common_result, result}, {yxx_game_role_info, banker}, {array, yxx_game_role_info, banker_list}],
      % 请求获取当前桌子的最近10局记录
      [req_yxx_video_record10],
      % 返回当前桌子的最近10局记录局号
      [yxx_record10, {string, video}, {int64, win}],
      [notify_yxx_video_record10, {array, yxx_record10, video_list}],

      % 请求房间信息
      [req_yxx_info],
      % 配置信息
      [yxx_config,
        {uint64, min_bet},
        {uint64, need_chip},
        {uint64, max_chip},
        {array, int, default_chip_list},                    % 可选择的筹码列表
        {array, int, chip_list},                            % 当前选择的筹码列表
        {int, customize_chip_base},                         % 自定义筹码基础倍数
        {int, customize_chip},                              % 自定义筹码大小
        {uint64, banker_need},                              % 申请上庄需要的金额
        {uint64, role_bet_limit},                           % 玩家限红
        {uint64, system_bet_limit},                         % 系统限红
        {uint64, bet_time},
        {uint64, sync_chip_time},
        {uint64, dice_time},
        {uint64, settlement_time}
      ],
      % 房间信息：玩家信息这里只同步几个玩家的信息
      [notify_yxx_room_info,
        {yxx_game_status, game_status},
        {array, yxx_game_role_info, roles},                 % 第一个是大富豪，第二个是神算子
        {array, yxx_game_role_info, banker_list},
        {yxx_game_role_info, banker},                       % 当前庄
        {yxx_game_role_info, self_role},
        {yxx_config, config},
        {yxx_desktop_chip, all_chips},
        {yxx_desktop_chip, self_chips},
        {array, yxx_desktop_chip, other_chips},             % 第一个是大富豪，第二个是神算子
        {array, int, record_list},
        {string, client_key},
        {string, server_hash},
        {string, video},                                    % 当前局号
        {int64, role_count},                                % 房间玩家数量
        {common_judge, open_player_banker},                 % 是否开启玩家上庄
        {uint64, end_time}
      ],

      % 单独推送玩家列表变化,大富豪，神算子, 庄家，庄家列表，玩家总数
      [notify_yxx_game_role_update, {array, yxx_game_role_info, roles}, {yxx_game_role_info, banker}, {array, yxx_game_role_info, banker_list}, {int64, role_count}, {string, video}],

      % 结算
      [yxx_settlement_item, {int64, role_id}, {int64, cur_moeny}, {int64, get_money}, {int64, final_add}],
      [notify_yxx_settlement, {array, int, dicees}, {array, yxx_settlement_item, settlement_list}, {int64, others_get_money}, {int64, others_final_add}, {int, record}, {string, client_key}, {string, server_key}, {string, video}],

    %%%===================================================================================================
    %%% 奥马哈
    %%%===================================================================================================
    [proto_game_omh_201900],

    %%%===================================================================================================
    %%% 炸金花
    %%%===================================================================================================
    [proto_game_zhajinhua_202000],

    %%%===================================================================================================
    %%% 色蝶
    %%%===================================================================================================
    [proto_game_sedie_202100],
      % 桌面筹码结构,每个区域的筹码是一个列表，列表中每个值为筹码大小，对应数量
      [sedie_chip, {int64, chip_size}, {int64, chip_count}],
      [sedie_area_bet, {int, area}, {array, sedie_chip, chips}, {int, bet_role_count}],
      [sedie_desktop_chip, {array, sedie_area_bet, area_list}],
      [
        sedie_config,                 % 色碟配置表
        {int64, chip_base},           % 筹码基础值，整数倍可下注
        {array, int64, chip_list},    % 筹码列表
        {int64, bet_limit_min},       % 限红下限
        {int64, bet_limit_max},       % 限红上限
        {int64, zhuang_min_money},    % 庄最小金额
        {int64, zhuang_count},        % 连庄最大次数，0 无限制
        {int64, waiting_time},        % 等待开局时间(毫秒)
        {int64, betting_time},        % 下注时间
        {int64, balancing_time},      % 结算时间
        {int64, bet_info_sync_time}   % 下注阶段同步下注数据时间
      ],
      [
        sedie_role_info,                % 玩家信息
        {int64, role_id},               % 玩家id
        {room_role_base, role_base},    % 玩家基础信息
        {int64, total_count},           % 局数
        {int64, play_rate},             % 入局率，放大100倍
        {int64, max_win_money},         % 单局最大赢分
        {int64, win_rate},              % 近10局胜率，放大100倍
        {int64, zhuang_count}           % 庄家连庄局数
      ],
      [
        sedie_win_role_info,    % 获胜的玩家信息
        {int64, role_id},       % 玩家id
        {int64, win_money},     % 总奖励
        {int64, cur_money}      % 当前总分
      ],
      [
        notify_sedie_stage,	                % 游戏过程变换的通知
        {int, game_status},				          % 游戏状态 1 等待开局 2 下注 3 结算
        {int64, end_time},				          % 当前阶段的结束时间点
        {string, game_no},				          % 牌局编号
        {int64, total_count},			          % 房间总人数
        {string, client_key},               % 客户端原始值
        {string, client_hash},              % 客户端哈希
        {string, server_key},               % 服务器原始值
        {string, server_hash},              % 服务器哈希
        {string, last_key},                 % 最终结果值
        {string, last_hash},                % 最终结果哈希
        {int, balance_result},		          % 结算结果 1=>一红三白, 2=>二红二白, 3=>三红一白, 4=>四红, 5=>四白
        {array, int, balance_result_list},	% 结算结果
        {array, sedie_win_role_info, win_role_list}					  %获胜玩家列表
      ],
      [
        notify_sedie_result,                % 游戏结果
        {array, int, result}                % 结果数组
      ],
      [
        sedie_record10,
        {string, game_no},          % 牌局id，前14位代表时间
        {int64, win}                % 玩家输赢
      ],
      [
        req_sedie_video_record10            % 请求当前房间玩家最近10局输赢信息
      ],
      [
        notify_sedie_video_record10,
        {array, sedie_record10, video_list}
      ],
      [
        req_sedie_info   % 请求游戏信息
      ],
      [
        notify_sedie_info,				                    % 玩家进入时的游戏信息通知，用来进入游戏时，还原界面上的数据
        {sedie_config, config},                       % 配置表
        {int, game_status},				                    % 游戏状态 1 等待开局 2 下注 3 结算
        {int64, end_time},				                    % 当前阶段的结束时间点，服务器的毫秒级时间戳
        {string, game_no},				                    % 牌局编号
        {int64, total_count},			                    % 房间总人数
        {array, room_role_base, position_role_list},  % 在位置上的玩家列表 大富豪 神算子
        {sedie_desktop_chip, all_chips},              % 总下注信息
        {sedie_desktop_chip, self_chips},             % 玩家下注信息
        {array, sedie_desktop_chip, other_chips},     % 大富豪 神算子下注信息
        {array, room_role_base, zhuang_role_list},    % 庄家队列信息
        {int, balance_result},     		                % 结算阶段结果 1=>一红三白, 2=>二红二白, 3=>三红一白, 4=>四红, 5=>四白
        {array, int, balance_result_list},            % 结算阶段结果
        {string, client_key},                         % 客户端原始值
        {string, client_hash},                        % 客户端哈希
        {string, server_key},                         % 服务器原始值
        {string, server_hash},                        % 服务器哈希
        {string, last_key},                           % 最终结果值
        {string, last_hash},                          % 最终结果哈希
        {array, int, chip_list},	                    % 设置的筹码列表
        {int, customize_chip},	                      % 设置的筹码
        {array, notify_sedie_result, result_list},    % 路单结果，最近20局
        {array, int, result_count_list},              % 路单结果，近100局单，双次数 [1, 2]
        {array, sedie_win_role_info, win_role_list} 	% 获胜玩家列表
      ],
      [
        req_sedie_zhuang,		% 请求上下庄
        {int, op_type}	    % 1 上庄 2 下庄
      ],
      [
        notify_sedie_zhuang,      % 玩家上下庄通知
        {common_result, result},  % 结果 1 成功 2 失败
        {int, op_type},           % 1 上庄 2 下庄 3 坐庄
        {room_role_base, role}    % 玩家信息
      ],
      [
        req_sedie_role_info,		% 请求玩家信息
        {int, role_id}	        % 玩家id
      ],
      [
        notify_sedie_role_info,
        {sedie_role_info, role_info}    % 玩家信息
      ],
      [req_sedie_customize_chip,      % 请求设置筹码
        {array, int, chip_list},      % 筹码列表
        {int, customize_chip}         % 基础筹码
      ],
      [notify_sedie_customize_chip,
        {common_result, result},
        {array, int, chip_list},
        {int, customize_chip}
      ],
      [
        req_sedie_bet,		% 请求下注
        {int, pool_id},	  % 下注的位置索引，1 双 2 单 3 四红 4 三红 5 三白 6 四白 7 大 8 小
        {int, bet_money}	% 下注分
      ],
      [
        notify_sedie_bet,	        %玩家自己下注通知
        {string, err_msg},        %结果 错误信息，为空返回成功
        {int, limit_money},       %剩余可下注额(失败时使用)
        {int, role_id},           %玩家id
        {int, pool_id},			      %直接返回下注的索引位置
        {int, bet_money}			    %直接返回下注的分数
      ],
      [
        notify_sedie_bet_all,		    		  % 玩家下注定时通知
        {sedie_desktop_chip, all_chips}	  % 每个位置的总下注
      ],
      [
        notify_sedie_zhuang_result, % 庄家输赢通知
        {int64, role_id},           % 玩家id
        {int64, win_money},         % 总奖励
        {int64, cur_money}          % 当前总分
      ],
      [
        notify_sedie_zhuang_list,
        {int, zhuang_system},                     % 是否系统庄 0 否 1 是
        {array, room_role_base, zhuang_role_list}
      ],
      [
        notify_sedie_position_role_list,              % 在位置上的玩家信息
        {array, room_role_base, role_list}
      ],

    %%%===================================================================================================
    %%% 骰宝
    %%%===================================================================================================
    [proto_game_shaibao_202200],
      [shaibao_chip, {int64, chip_size}, {int64, chip_count}],
      [shaibao_area_bet, {shaibao_area, area}, {array, shaibao_chip, chips}, {int64, bet_role_count}],
      % [shaibao_area_bet, {int, area}, {array, shaibao_chip, chips}],
      [shaibao_desktop_chip, {array, shaibao_area_bet, area_list}],
      % 通知等待开始
      [notify_shaibao_start_idle, {uint64, end_time}],
      % 通知开始下注
      [notify_shaibao_start_bet, {uint64, end_time}],
      % 通知倒计时
      [notify_shaibao_start_count_down, {uint64, end_time}],

      % 玩家游戏内当前信息:对于大富豪，神算子，需要total，win，play，max_win，对于庄家，需要total，win，max_win，banker_count，left_banker_count
      [shaibao_game_info,
        {int, total}, % 参与此游戏的局数
        {int, win}, % 近10局赢钱的局数
        {int, play}, % 入局局数
        {int, max_win}, % 最大赢分
        {int, banker_count}, % 连庄局数
        {int, left_banker_count} % 剩余当庄局数
      ],
      [shaibao_game_role_info, {room_role_base, role_base}, {shaibao_game_info, game_info}],

      % 玩家下注
      [req_shaibao_bet, {shaibao_area, area}, {int64, chip}],
      % 回复下注,可显示玩家下注成功返回
      [notify_shaibao_bet, {uint64, role_id}, {shaibao_area, area}, {int64, chip}],
      % 下注失败返回
      [notify_shaibao_bet_failed, {string, err_msg}, {uint64, area_remain_money}],
      % 广播下注：每秒同步一次所有区域筹码
      [notify_shaibao_bet_all,
        {shaibao_desktop_chip, all_chips}
      ],

      % 请求房间信息
      [req_shaibao_info],
      % 配置信息
      [shaibao_config,
        % 可显示的玩家数量
        {uint64, role_count},
        {uint64, min_bet},
        {uint64, need_chip},
        {uint64, banker_chip},
        {uint64, banker_type},  %是否压满即停 1：正常模式 2：压满即停
        {uint64, max_chip},
        {uint64, role_bet_limit}, % 玩家限红
        {uint64, system_bet_limit}, % 系统限红
        {array, int, chip_list},
        {array, int, default_chip_list},%默认筹码列表
        {uint64, my_chip_base},%自定义筹码乘的系数
        {uint64, bet_time},
        {uint64, sync_chip_time},
        {uint64, dice_time},
        {uint64, settlement_time},
        {uint64, count_down_time} %倒计时时间
      ],
      % 配置庄信息
      [shaibao_banker_config,
        {int, player_banker}, %是否启用玩家庄 1：启用 0：不启用
        {int, robot_banker},  %是否启用机器人庄 1：启用 0：不启用
        {int, system_banker},  %是否启用系统庄 1：启用 0：不启用
        {int, lian_zhuang_num} %连庄数
      ],
      % 每场开奖信息
      [shaibao_shaizi_info,
        {int, first_dice},
        {int, second_dice},
        {int, third_dice},
        {int, zhang_type}   %庄家输赢信息 0平1赢2输
      ],
      % 房间信息：玩家信息这里只同步几个玩家的信息
      % [shaibao_game_role_info,
      %   {int, pos},
      %   {room_role_base, role_base}
      % ],
      % 庄家信息 胜率 单局最大赢分 连庄局数 剩余当庄局数
      % [shaibao_banker_info,
      %   {room_role_base, role_base},
      %   {int, win_rate},
      %   {int64, max_win_score},
      %   {int, lian_zhuang_num},
      %   {int, left_banker_num}
      % ],
      % % 大富豪以及神算子信息 局数 单局最大赢分 胜率 入局率
      % [shaibao_rich_solomon_info,
      %   {room_role_base, role_base},
      %   {int, game_count},
      %   {int64, max_win_score},
      %   {int, win_rate},
      %   {int, enter_rate}
      % ],

      [notify_shaibao_room_info,
        {shaibao_game_status, game_status},
        {array, shaibao_game_role_info, roles}, % 第一个是大富豪，第二个是神算子
        {shaibao_config, config},
        {shaibao_desktop_chip, all_chips},
        {shaibao_desktop_chip, self_chips},
        {array, int64, my_chips},	          % 我设置的筹码信息
        {array, shaibao_shaizi_info, record_list},
        {shaibao_game_role_info, banker_base},              %庄家信息
        {array, room_role_base, banker_base_list},   %上庄列表信息
        {int64, role_count}, % 在线人数
        {uint64, end_time}
      ],

      % 单独推送玩家列表变化
      [notify_shaibao_game_role_update,
        {array, shaibao_game_role_info, roles},
        {shaibao_game_role_info, banker},
        {array, room_role_base, banker_list},
        {int64, role_count}
      ],

      % % 用于房间返回的信息，内容可忽略
      % [notify_shaibao_enter_info],

      % 结算
      [shaibao_settlement_item, {int64, role_id}, {int64, cur_moeny}, {int64, get_money}],
      % 骰子信息
      [shaibao_shaizi_item,
        {int, shaizi_id},                 %骰子序号
        {string, prefix6},            %密文六位
        {int, prefix6_decimal},       %密文转十进制
        {int, prefix6_mod},           %十进制求余
        {int, shaizi_vilue}           %骰子值
      ],
      [notify_shaibao_settlement,
        {array, int, dicees},
        {array, int, win_area},
        {array, int, my_win_area},
        {array, shaibao_settlement_item, settlement_list},
        {int64, others_get_money},
        {string, client_seed},        %客户端的种子
        {string, server_plaintext},   %服务器的明文
        {string, server_ciphertext},  %服务器的密文
        {string, complete_ciphertext}, %两者拼接密文
        {array, shaibao_shaizi_item, shaizi_list}
      ],

      [req_shaibao_seed			        %游戏中请求种子信息
      ],
      [rsp_shaibao_seed,		          %s2c返回当局的种子信息
        {string, client_seed},        %客户端的种子
        {string, server_ciphertext}   %服务器的密文
      ],

      [req_shaibao_up_banker			        %上庄
      ],
      [rsp_shaibao_up_banker,	            %上庄反馈
      {int, result}                       %0:上庄成功 1:积分不够 2:关闭玩家做庄 3:其他原因
      ],

      [req_shaibao_down_banker			        %下庄
      ],
      [rsp_shaibao_down_banker,	            %下庄反馈
      {int, result}                         %0:下庄成功 1:下庄失败
      ],

      [req_shaibao_cancel_down_banker			        %取消下庄
      ],
      [rsp_shaibao_cancel_down_banker,	            %取消下庄反馈
      {int, result}                         %0:取消下庄成功 1:取消下庄失败
      ],

      [notify_shaibao_banker_info,
        {shaibao_game_role_info, banker_base},              %庄家信息
        {array, room_role_base, banker_base_list}   %上庄列表信息
      ],

      % [notify_shaibao_rich_solomon_info,
      %   {shaibao_rich_solomon_info, rich_base},              %大富豪信息
      %   {shaibao_rich_solomon_info, solomon_base}            %神算子信息
      % ],

      % 设置5个筹码
      [req_shaibao_set_5_chips,
        {int64, chip1},
        {int64, chip2},
        {int64, chip3},
        {int64, chip4},
        {int64, chip5},
        {int64, custom_chip}  % 0 5个筹码里没有自定义筹码，value 5个筹码里有自定义筹码，该值为自定义筹码的值
      ],

      [rsp_shaibao_set_5_chips,	            %设置5个筹码反馈
        {int, result}                       %0:成功 1:失败
      ],

      % 设置自定义筹码
      [req_shaibao_set_my_chip,
        {int64, chip}
      ],

      [rsp_shaibao_set_my_chip,	            %设置自定义筹码反馈
        {int, result}                       %0:成功 1:失败
      ],

      % 刷新筹码
      [req_shaibao_refresh_chips],

      [rsp_shaibao_refresh_chips,	            %刷新筹码反馈
      {int, result}                       %0:成功 1:失败
      ],

      % 请求获取当前桌子的最近10局记录
      [req_shaibao_video_record10],
      % 返回当前桌子的最近10局记录局号
      [shaibao_record10, {string, video}, {int64, win}],
      [notify_shaibao_video_record10, {array, shaibao_record10, video_list}],

      % [req_shaibao_fair_verify,	    %请求公平性验证
      %   {string, roundid}             %局号
      % ],
      % [rsp_shaibao_fair_verify,      %s2c返回公平性验证的各种信息
      %   {string, client_seed},        %客户端的种子
      %   {string, server_plaintext},   %服务器的明文
      %   {string, server_ciphertext},  %服务器的密文
      %   {string, complete_ciphertext} %两者拼接密文
      %   % {string, prefix5},            %密文前五位
      %   % {string, prefix5_decimal},    %密文前五位转十进制
      %   % {string, prefix5_decimal_mod}, %两者拼接密文
      %   % {string, killroom} %两者拼接密文
      % ]


    %%%===================================================================================================
    %%% 龙虎斗
    %%%===================================================================================================
    [proto_game_lhd_202300],
      [lhd_banker_info,            	  %庄家信息
        {int64, role_id},
        {string, nickname},           %玩家昵称
        {string, head_photo},         %玩家头像
        {int64, money}                %玩家金币
      ],
      [lhd_shen_suan_zi_info,         %神算子信息
        {int64, role_id},
        {string, nickname},           %玩家昵称
        {string, head_photo},         %玩家头像
        {int64, money}                %玩家金币
      ],
      [lhd_da_fu_hao_info,            %大富豪信息
        {int64, role_id},
        {string, nickname},           %玩家昵称
        {string, head_photo},         %玩家头像
        {int64, money}                %玩家金币
      ],
      % 游戏过程变换的通知
      [notify_lhd_stage,
        {int, stageIndex},        %游戏哪个阶段, 1=>下注阶段, 2=>平衡阶段, 3=>展示结果阶段
        {stime, end_time},        %当前阶段的结束时间点
        {int, balance_result},      %结果出龙还是虎, 1=>'龙', 2=>'虎'，3=>和
        {array, int, dice_num},      %两张牌的点数，要刷新趋势图里面的数据
        {int64, money},          %奖励
        {int64, money2},        %加的分,如果是赢局，包括返还的下注分和奖励的总和，如果是输局，为0，如果是平局，为下注分
        {int64, cur_money},        %当前玩家携带总分
        {int64, end_time2},        %当前阶段的结束时间点，服务器的毫秒级时间戳
        {int, all_user_count},     %房间所有人总数
        {lhd_shen_suan_zi_info, shen_suan_zi},    %神算子信息
        {lhd_da_fu_hao_info, da_fu_hao},          %大富豪信息
        {string, video},                          % 当前局号
        {string, client_key},{string, client_hash}, {string, server_hash}
      ],
      %请求房间信息
      [req_lhd_info],
      [req_lhd_bet,		%玩家下注请求
        {int, poolIndex},	%下注的位置索引， 1=>下在"龙"的位置， 2=>下在"虎"， 3=>下在"和"的位置
        {int, bet_money}		%下注分
      ],
      [notify_lhd_self_bet,	%玩家自己下注通知
        {common_result, result},	%1=>成功，2=>失败
        {int, poolIndex},			%直接返回下注的索引位置
        {int, bet_money}			%直接返回下注的分数
      ],
      [notify_lhd_bet_failed, {string, err_msg}, {uint64, area_remain_money}],%下注失败返回消息
      [notify_lhd_bet,					            %玩家下注定时通知
        {array, int64, money},				      %索引1表示"龙"位置的累计下注分，索引2表示"虎"位置的累计下注分
        {array, int, bet_player_num},		    %索引1表示"龙"位置的累计下注人数， 索引2表示"虎"位置的累计下注人数
        {array, int64, other_user_betmoney},%其他玩家下注金额集合
        {int, dafuhao_bet_money},           %大富豪下注金额
        {int, shensuanzi_bet_money}         %神算子下注金额
      ],
      [req_lhd_trendchart					%请求游戏的趋势图数据
      ],
      [notify_lhd_trendchart,				%游戏的趋势图数据通知
        {array, int, history_result}			%历史趋势数据
      ],
      %% 新增上庄和下庄的请求和通知
      [req_lhd_apply_banker],                         % 请求上庄
      [req_lhd_leave_banker],                         % 请求下庄
      [notify_lhd_banker_queue,  % 通知上庄列表
        {array, int64, role_ids},  % 申请上庄的玩家列表
        {array, string, nicknames},
        {array, string, head_photo},
        {array, int64, moneys}
      ],
      [notify_lhd_apply_banker_result, % 上庄申请结果
        {string, result} % 1为成功，2为失败
      ],
      [notify_lhd_leave_banker_result, % 下庄申请结果
        {string, result} % 1为成功，2为失败
      ],
      % 自定义筹码
      [req_lhd_customize_chip, {array, int, chip_list}, {int, customize_chip}],
      % 返回自定义筹码大小
      [notify_lhd_customize_chip, {common_result, succ}, {array, int, chip_list}, {int, customize_chip}],
      % 桌面筹码结构,每个区域的筹码是一个列表，列表中每个值为筹码大小，对应数量
      [lhd_chip, {int64, chip_size}, {int64, chip_count}],
      [lhd_area_bet, {lhd_area, area}, {array, lhd_chip, chips}],
      [lhd_desktop_chip, {array, lhd_area_bet, area_list}],
      % 广播下注：每秒同步一次所有区域筹码
      [notify_lhd_bet_all,
        {array, int, bet_player_num},		    %索引1表示"龙"位置的累计下注人数， 索引2表示"虎"位置的累计下注人数， 索引2表示"虎"位置的累计下注人数
        {lhd_desktop_chip, all_chips},                %所有玩家下注金额
        {lhd_desktop_chip, dafuhao_chips},            %大富豪下注金额
        {lhd_desktop_chip,shensuanzi_chips}           %神算子下注金额
      ],
      %获取用户信息
      [req_lhd_role_playgame_info,
        {int, role_type}              %1庄家 2大富豪 3神算子
      ],
      [lhd_role_playgame_info,
        {int, total}, % 参与此游戏的局数
        {int, win10}, % 近10局赢钱的局数
        {int, win_count},%当前赢钱总局数
        {int, play}, % 入局局数
        {int, max_win}, % 最大赢分
        {int, banker_count}, % 连庄局数
        {int, left_banker_count} % 剩余当庄局数
      ],
      % 通知神算子和大富豪庄家输赢
      [notify_lhd_lost_or_win_money,
        {array, int64, lost_or_win_money}    % 输赢金币
      ],
      % 请求获取当前桌子的最近10局记录
      [req_lhd_video_record10],
      % 返回当前桌子的最近10局录像局号
      [lhd_record10, {string, video}, {int64, win}],
      [notify_lhd_video_record10, {array, lhd_record10, video_list}],
      [notify_lhd_info,				                    %玩家进入时的游戏信息通知，用来进入游戏时，还原界面上的数据
        {int, stageIndex},				                %游戏哪个阶段, 1=>下注阶段, 3=>展示结果阶段
        {stime, end_time},				                %当前阶段的结束时间点(废弃掉，改用end_time2)
        {array, int64, beted_money},	            %如果是在下注或平衡阶段时，两个位置上已经下注的分数
        {array, int, dice_num},     	            %如果是在展示结果阶段时，两张牌的点数
        {array, int, beted_playercount},          %位置上下注的人数
        {array, int64, self_beted_money},		      %自己下注的分数
        {int, min_bet},					                  %一个人最少能下注下限
        {int64, max_bet},				                  %一个人最多能下注上限
        {array, int, history_result},	            %历史趋势 1=>龙，2=>虎，3=>和
        {int64, server_timestamp},		            %服务器的时间戳
        {int64, end_time2},				                %当前阶段的结束时间点，服务器的毫秒级时间戳
        {int64, banker_queue_money},              %申请上庄最低money
        {string, live_stream_url},                %直播地址
        {lhd_banker_info, banker_info},           %庄家信息
        {notify_lhd_banker_queue, banker_list},    %上庄列表
        {lhd_shen_suan_zi_info, shen_suan_zi},    %神算子信息
        {lhd_da_fu_hao_info, da_fu_hao},          %大富豪信息
        {array, int, timeslist},	                %下注 结算时间 筹码同步
        {array, int, default_chip_list},          % 可选择的筹码列表
        {array, int, chip_list},                  % 当前选择的筹码列表
        {int, customize_chip_base},               % 自定义筹码基础倍数
        {int, customize_chip},                    % 自定义筹码大小
        {string, client_key},
        {string, server_hash},
        {string, video},                          % 当前局号
        {int, all_user_count}                     %房间所有人总数
      ],

    %%%===================================================================================================
    %%% 卡特牌
    %%%===================================================================================================
    [proto_game_kate_202400],
      [req_catte_info],                   % 请求房间信息
      [catte_role_cards,
        {uint64, role_id},    % 玩家id
        {array, int, cards}   % 手牌
      ],
      % 轮次 类型 牌
      [catte_table_itme,
        {uint64, role_id},  % 玩家id
        {int, turn},        % 轮次
        {int, out_type},    % 出牌类型
        {int, card}         % 出牌
      ],
      [catte_talbe_cards,
        {uint64, role_id},                % 玩家id
        {array, catte_table_itme, cards}  % 轮次 类型 牌
      ],

      % 通知开始游戏
      [notify_catte_start,
        {uint64, banker_id},                    % 庄家id
        {int, is_open_win},                      % 是否有开局赢家 0没有 1有
        {array, catte_role_cards, role_cards}   % 玩家手牌
      ],
      % 通知新一轮开始
      [notify_catte_turn,
        {array, catte_table_itme, cards},       % 轮次 类型 牌
        {int, cur_turn},                        % 当前轮次
        {uint64, banker_id},                    % 庄家id
        {catte_game_status, game_status}        % 游戏状态 1,空闲  2,1-4轮  3,5轮  4,6轮  5,结算
      ],
      % 通知出牌
      [notify_catte_operator,
        {uint64, up_role_id},         % 上家id
        {uint64, up_out_type},        % 上家出牌类型
        {uint64, up_out_card},        % 上家出牌
        {array, uint64, role_ids},    % 当前剩余玩家id
        {int, cur_turn},              % 当前轮次
        {int, cur_max_card},          % 当前最大牌
        {uint64, end_time}            % 剩余时间
      ],

      % 房间信息
      [catte_role_item, % 玩家游戏内当前信息
        {int, pos},                           % 位置
        {catte_role_cards, role_cards},       % 玩家手牌
        {catte_role_status, role_status}      % 玩家状态
      ],
      [catte_game_role_info,
        {room_role_base, role_base},          % 玩家基本信息
        {catte_role_item, role_item}          % 玩家游戏内当前信息
      ],
      [req_catte_out_card,
        {int, card},        %出的牌
        {int, out_type}     %出牌类型 1,压过 2,丢牌
      ],    % 出牌 card:出的牌 out_type: 1,压过 2,丢牌

      % 配置信息
      [catte_config,
        {uint64, deal_per_time},      % 每次发牌时间
        {uint64, operate_time},       % 操作时间
        {uint64, settlement_time},    % 结算时间
        {uint64, nooutcard_time},     % 无出牌时间
        {uint64, show_card_time},      % 显示牌局时间
        {uint64, end_card_time},      % 最后出牌等待下一轮的时间
        {uint64, countdown_timer}      % 倒计时时间
      ],

      % 房间信息
      [notify_catte_room_info,
        {catte_game_status, game_status},             % 游戏状态 1,空闲  2,1-4轮  3,5轮  4,6轮  5,结算
        {array, catte_game_role_info, roles},         % 玩家信息
        {int, banker_pos},                            % 庄家位置
        {uint64, banker_id},                          % 庄家id
        {int, min_bet},                                % 底注
        {int, current_round},                         % 当前轮次
        {int, current_max_card},                      % 当前最大牌
        {int, current_round_out_card_num},            % 当前轮次出牌人数
        {uint64, current_operator},                   % 当前操作玩家id
        {array, catte_table_itme, desktop_cards},     % 桌面牌
        {int, countdown_timer},                   % 倒计时时间
        {catte_config, config},                       % 配置信息
        {uint64, end_time},                            % 剩余时间
        {string, video}            % 局号
      ],

      % 结算信息
      [catte_settlement_item,
        {catte_role_cards, role_cards},         % 玩家手牌
        {int64, cur_moeny},                     % 玩家当前金额
        {int64, get_money}                      % 玩家获得金额
      ],
      [notify_catte_settlement,
        {array, catte_settlement_item, settlement_list},
        {string, video},            % 局号
        {string, client_seed},        %客户端的种子
        {string, server_ciphertext}  %服务器的密文
      ],
      % 请求获取当前桌子的最近50局记录
      [req_catte_video_record50],
      % 返回当前桌子的最近10局记录局号
      [catte_record50, 
        {string, video},            % 局号
        {uint64, begin_time},       % 局开始时间
        {int64, win}                % 输赢
        % {string, client_seed},       %客户端的种子
        % {string, server_plaintext},  % 服务器的明文
        % {string, server_ciphertext}  %服务器的密文
      ],
      [notify_catte_video_record50, {array, catte_record50, video_list}],
      % 倒计时
      [notify_catte_countdown,
        {uint64, end_time}            % 倒计时时间
      ],
    %%%===================================================================================================
    %%% 塔拉牌
    %%%===================================================================================================
    [proto_game_tala_202500],

    %%%===================================================================================================
    %%% 三公
    %%%===================================================================================================
    [proto_game_sangong_202600],

    %%%===================================================================================================
    %%% 港式五张
    %%%===================================================================================================
    [proto_game_hkfive_202700],
    
    %%%===================================================================================================
    %%% 赏金女王
    %%%===================================================================================================
    [proto_game_queen_202800],
      [req_queen_info],
      [notify_queen_info,
        {slots_bet, last_bet},                              % 上次投注
        {slots_bet_list, bet_list}                          % 配置信息 
      ],
      [req_queen_free_times,
        {int, times}                                        % 选择的奖金倍数(1, 3, 6)
      ],
      [notify_queen_free_times,
        {int, free_times}                                   % 免费次数
      ],
      % 请求旋转
      [req_queen_spin, {slots_bet, bet}],
      [notify_queen_spin_result,
        {array, int, symbol_list},                          % 符文列表，一般15个
        {slots_bet, last_bet},                              % 上次投注(配置信息中的索引)
        {int, rlt},                                         % 下注结果：正常返回0，如果玩家在未选择免费游戏倍数时开始游戏则返回1
        {int64, money},                                     % 获取的金币
        {int, free_spins},                                  % 当前免费次数
        {int, free_multiple},                               % 免费游戏获得的初始倍数
        {int, left_free_spins},                             % 剩余免费次数
        {int, new_free_spins}                               % 免费触发免费次数
      ],
      % 返回上一次结果
      [notity_queen_last_spin,
        {uint64, last_money},                               % 最后一把的金额，不管是免费还是付费,有其他额外将池也加在里面 <jackpot, bonus, 转盘，红利游戏等>
        {uint64, total_money},                              % 普通加免费所有的钱，如果没有免费，就和last_money相等,有其他额外将池也加在里面 <jackpot, bonus, 转盘，红利游戏等>
        {int, free_spins},                                  % 
        {int, free_multiple},                               % 
        {int, locked_bet},
        {int, locked_beishu},
        {int, choose_count},
        {array, int, icon_list}                             % 最后一屏图标
      ],
    
    %%%===================================================================================================
    %%% 寻宝黄金城
    %%%===================================================================================================
    [proto_game_aztec_202900],
      [req_treasure_aztec_info],
      [notify_treasure_aztec_info,
        {slots_bet, last_bet},                             % 上次投注
        {slots_bet_list, bet_list}                         % 投注列表
      ],
      % 请求旋转
      [req_treasure_aztec_spin, {slots_bet, bet}],
      [az_sym,
        {int, icon},                                        % 图标
        {int, pos},                                         % 列索引
        {int, mole},
        {int, deno}
      ],
      [s2g,
        {int, desticon},                                    % 图标
        {int, pos},                                         % 列索引
        {int, deno}                                         % 有几个连着的图标
      ],
      [notify_treasure_aztec_spin_result,
        {slots_bet, last_bet},                              % 上次投注
        {array, az_sym, symbol_list},                       % 符文列表
        {int64, money},                                     % 获取的金币
        {int, free_spins},                                  % 当前免费次数
        {int, left_free_spins},                             % 剩余免费次数
        {array, s2g, silver2glod_list}                      % 银框需要变为金框的符号列表
      ],
      [req_treasure_aztec_buy_spin,
        {slots_bet, bet},                                   % 投注参数
        {int, money}
      ],
      [notity_last_spin_treasure_aztec,
        {array, az_sym, symbol_list},                       % 符文列表
        {array, s2g, silver2glod_list},                     % 银框需要变为金框的符号列表
        {uint64, last_money},                               % 最后一把的金额，不管是免费还是付费,有其他额外将池也加在里面 <jackpot, bonus, 转盘，红利游戏等>
        {uint64, total_money},                              % 普通加免费所有的钱，如果没有免费，就和last_money相等,有其他额外将池也加在里面 <jackpot, bonus, 转盘，红利游戏等>
        {int, left_free_times},                             % 剩余免费次数, left_free_times 不为0，直接取last_money， 为0 取total_money
        {int, total_free_times}                             % 当前轮总共获取的免费次数
      ],

    %%%===================================================================================================
    %%% 时空淘金者（伽罗宝石2）
    %%%===================================================================================================
    [proto_game_timedigger_203000],

    %%%===================================================================================================
    %%% 农场游乐园（黄金帝国）
    %%%===================================================================================================
    [proto_game_farmpark_203100],

    %%%===================================================================================================
    %%% 拳王
    %%%===================================================================================================
    [proto_game_boxingking_203200],
      [boxingking_line_item,
          {array,line_item,line_item_list}
      ],
      [req_boxingking_info],
      [notify_boxingking_info,
        {slots_bet, last_bet},                              % 上次投注
        {slots_bet_list, bet_list},                         % 配置信息
        {int, free_spins},                                  % 免费次数
        {int, locked_bet}                                   % 免费游戏锁定的下注
      ],
      [req_boxingking_spin,
         {slots_bet, bet}                                   %押注信息
      ],
      [notify_boxingking_spin_result,
        {slots_bet, last_bet},                              % 上次投注(配置信息中的索引)
        {array, int, symbol_list},                          % 符文列表
        {array,boxingking_line_item,lines},
        {int64, money},                                     % 获取的金币
        {int, free_spins},                                  % 当前免费次数
        {int, left_free_spins},                             % 剩余免费次数
        {int, times},                                       % 倍率
        {int, add_round}                                    % 加局
      ],
      [req_boxingking_buy_free,
        {slots_bet, bet},                                   % 押注信息
        {int,count}                                         % 购买次数
      ],
      [notify_boxingking_buy_free_result,
        {int,count}                                         % 0就是购买失败 >0就是购买的次数
      ],
    %%%===================================================================================================
    %%% 疯狂钱来也
    %%%===================================================================================================
    [proto_game_moneycoming_203300],
      [req_moneycoming_info],
      [notify_moneycoming_info,
        {slots_bet, last_bet},                              % 上次投注
        {slots_bet_list, bet_list},                         % 配置信息
        {int, free_spins}                                   % 免费次数
      ],
      [req_moneycoming_spin,
        {slots_bet, bet}
      ],
      [notify_moneycoming_spin_result,
        {slots_bet, last_bet},                              % 上次投注(配置信息中的索引)
        {array, int, symbol_list},                          % 符文列表
        {int64, money},                                     % 获取的金币
        {int, free_spins},                                  % 当前免费次数
        {int, left_free_spins}                              % 剩余免费次数
      ],

    %%%===================================================================================================
    %%% 失落的金字塔（财富连连）
    %%%===================================================================================================
    [proto_game_lostpyramid_203400],

    %%%===================================================================================================
    %%% 大过年2
    %%%===================================================================================================
    [proto_game_newyear2_203500],

    %%%===================================================================================================
    %%% 逛夜市2
    %%%===================================================================================================
    [proto_game_nightmarket2_203600],

    %%%===================================================================================================
    %%% 金龙送宝
    %%%===================================================================================================
    [proto_game_fortunedragon_203700]

    %%%新协议在上面添加
  ].

%% 获得枚举类型的定义
get_enum_def() ->
  [
    {check_version_result, [cvr_yes, cvr_no]},
    {sys_msg_type, [sys_msg_common, sys_msg_shop, sys_msg_explore]},
    {connect_type, [common_connect, re_connect, inner_login]},
    {reconnect_result, [reconnect_success, reconnect_noregister, reconnect_passworderror, reconnect_versionerror]},
    {role_status, [online, offline]},
    {common_judge, [common_yes, common_no]},
    {common_result, [common_success, common_failed, common_error]},
    {buy_state, [can_buy, not_buy]},
    {vip_reward_state, [reward_ready, reward_claimed]},
    {bank_password_state, [is_set, not_set]},
    {game_type,
      [game_type_slots_fotune_god, game_type_jmp, game_type_jump_high, game_type_milu2, game_type_captain,
      game_type_wucaishen, game_type_bigsmall, game_type_longhu, game_type_shuangdan, game_type_mjhlsecond, game_type_dataosha, game_type_pdk, game_type_bj,
      game_type_tx, game_type_sss, game_type_baijiale, game_type_yxx, game_type_omh, game_type_zhajinhua, game_type_lhd, game_type_sedie, game_type_shaibao, game_type_talapai, game_type_catte,
      game_type_sangong, game_type_hkfive, game_type_treasure_aztec, game_type_timedigger, game_type_farmpark, game_type_queen, game_type_boxingking, game_type_moneycoming,
      game_type_lostpyramid, game_type_newyear2, game_type_nightmarket2, game_type_fortunedragon]
    },
    {room_type, [room_primary, room_intermediate, room_senior, room_master, room_regal]},
    {game_status, [game_status_normal, game_status_maintenance]},
    {sex, [man, woman]},
    {common_game_result, [win, lost, tie]},
    {award_type, [day_task, achievements_task, welfare_gift]},
    %大厅
    {transfer_log_type, [transfer_log_type_in, transfer_log_type_out]},
    {language, [lang_chinese, lang_english, lang_vietnamese]},
    {share_scenes, [share_app, share_tournament, share_activity, share_agent, share_landing_page]},

    % 德州扑克
    {tx_game_status, [tx_game_status_idle, tx_game_status_pre_flop, tx_game_status_flop, tx_game_status_turn, tx_game_status_river, tx_game_status_settlement]},% 空闲阶段，翻牌前阶段，翻牌阶段，转牌阶段，河牌阶段，结算阶段
    {tx_role_status, [tx_role_status_idle, tx_role_status_gaming, tx_role_status_operator]}, 
    {tx_play_type, [tx_play_type_classic, tx_play_type_short, tx_play_type_aof]}, % 德州玩法类型：经典，短牌，aof
    {tx_bet_type, [tx_bet_type_limit, tx_bet_type_pod_limit, tx_bet_type_no_limit]}, % 限注，底池限注，不限注
    {tx_blind_type, [tx_blind_type_normal, tx_blind_type_rand, tx_blind_type_all]}, % 普通大小盲注，普通基础加一随机大盲，普通基础上所有人一大盲
    {tx_cards_type,
      [tx_cards_type_high_card, tx_cards_type_one_pair, tx_cards_type_two_pair, tx_cards_type_three_of_a_kind, tx_cards_type_straight, tx_cards_type_flush, tx_cards_type_full_house,
      tx_cards_type_four_of_a_kind, tx_cards_type_straight_flush, tx_cards_type_royal_flush]}, % 德州牌型

    % 跑得快
    {pdk_game_mode, [pdk_game_mode_1v3, pdk_game_mode_blood]},

    % 百家乐
    {baijiale_game_status, [baijiale_game_status_idle, baijiale_game_status_bet, baijiale_game_status_settlement]},
    {baijiale_area, [baijiale_area_banker, baijiale_area_player, baijiale_area_tie, baijiale_area_banker_pair, baijiale_area_player_pair, baijiale_area_luck_six]},

    % 鱼虾蟹
    {yxx_game_status, [yxx_game_status_idle, yxx_game_status_bet, yxx_game_status_settlement]},
    {yxx_area,
      [yxx_area_1, yxx_area_2, yxx_area_3, yxx_area_4, yxx_area_5, yxx_area_6, yxx_area_all, yxx_area_1_2, yxx_area_1_3, yxx_area_1_4, yxx_area_1_5, yxx_area_1_6, yxx_area_2_3, yxx_area_2_4,
      yxx_area_2_5, yxx_area_2_6, yxx_area_3_4, yxx_area_3_5, yxx_area_3_6, yxx_area_4_5, yxx_area_4_6, yxx_area_5_6]},

    % 骰宝
    {shaibao_game_status, [shaibao_game_status_idle, shaibao_game_status_bet, shaibao_game_status_settlement, shaibao_game_status_count_down]},
    {shaibao_area, [shaibao_area_1, shaibao_area_2, shaibao_area_3, shaibao_area_4, shaibao_area_5, shaibao_area_6, shaibao_area_7, shaibao_area_8, shaibao_area_9, shaibao_area_10, shaibao_area_11, shaibao_area_12,shaibao_area_13, shaibao_area_14, shaibao_area_15, shaibao_area_16, shaibao_area_17, shaibao_area_18,shaibao_area_19, shaibao_area_20, shaibao_area_21, shaibao_area_22, shaibao_area_23, shaibao_area_24,shaibao_area_25, shaibao_area_26, shaibao_area_27, shaibao_area_28, shaibao_area_29, shaibao_area_30, shaibao_area_31]},

    %龙虎斗
    {lhd_area, [lhd_area_banker, lhd_area_player, lhd_area_tie, lhd_area_banker_pair, lhd_area_player_pair, lhd_area_luck_six]},
      %卡特牌
    {catte_game_status, [catte_game_status_idle, catte_game_status_1_and_4_round, catte_game_status_5_round, catte_game_status_6_round, catte_game_status_settlement]},
    {catte_role_status, [catte_role_status_idle, catte_role_status_gaming]}
  ].

%% 设置版本信息
get_version() -> 1.
