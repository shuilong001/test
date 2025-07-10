export module NetSysMsg
{
    export const sys_msg={ 

        //login
        100 : "sg_login_version_error",
        101 : "sg_login_repeat_login",
        102 : "sg_login_norole",
        103 : "sg_login_create_role_nologin",
        104 : "sg_login_create_role_failed",
        105 : "sg_login_create_role_account_has_mask",
        106 : "sg_login_create_role_nameexisted",
        107 : "sg_login_user_lock",
        108 : "sg_login_create_role_noname",
        109 : "sg_login_no_set_game_start_time",


        //connect
        200 : "sg_connect_cannot_connect_server",
        201 : "sg_connect_server_not_running",
        202 : "sg_connect_token_err",


        //common
        300 : "sg_common_kick_for_server_close",
        301 : "sg_common_server_error",
        302 : "sg_common_server_is_starting",
        303 : "sg_common_debug_info",


        //mail
        400 : "sg_mail_del_succeed",
        401 : "sg_mail_get_attachment_succeed",
        402 : "sg_mail_attachment_already_got",
        403 : "sg_mail_not_find",
        404 : "sg_mail_not_get_attachment",


        //online_player
        500 : "sg_online_player_full",


        //achievements
        600 : "sg_achievements_condition_not_achieved",
        601 : "sg_achievements_award_is_received",


        //day_task
        700 : "sg_day_task_point_err_get_gift",
        701 : "sg_day_task_gift_get_err",


        //function_isopen
        800 : "sg_function_isopen_function_not_open",


        //broadcast
        900 : "sg_broadcast_urgent_notice",
        901 : "sg_broadcast_fake_game_get_big_lottery_notice",
        902 : "sg_broadcast_get_language_package",
        903 : "sg_broadcast_system_notice",
        904 : "sg_broadcast_third_game_updated",
        905 : "sg_broadcast_solts_match_about_start",


        //game_common
        1000 : "sg_game_common_action_fail",
        1001 : "sg_game_common_game_lock",
        1002 : "sg_game_common_bet_not_enough_money",
        1003 : "sg_game_common_agent_can_not_play",
        1004 : "sg_game_common_temporary_stop",
        1005 : "sg_game_common_not_match_room_money_condition",
        1006 : "sg_game_common_no_action_for_long_time",
        1007 : "sg_game_common_already_unlock_bet_limit",
        1008 : "sg_game_common_all_desk_full",


        //role
        1100 : "sg_role_money_overflow",
        1101 : "sg_role_set_mobile_too_often",
        1102 : "sg_role_set_mobile_always_used",
        1103 : "sg_role_can_not_find",
        1104 : "sg_role_banker_password_out_dated",
        1105 : "sg_role_account_update_already",
        1106 : "sg_role_account_update_verify_code_error",
        1107 : "sg_role_account_update_already_bind",
        1108 : "sg_role_account_update_succ",
        1109 : "sg_role_account_update_get_verify_code_too_offen",
        1110 : "sg_role_account_update_get_verify_code_succ",
        1111 : "sg_role_account_update_get_verify_code_fail",
        1112 : "sg_role_sg_role_banker_is_in_game",
        1113 : "sg_role_sg_role_banker_save_locked",
        1114 : "sg_role_banker_min_transfer",
        1115 : "sg_role_money_not_enough",
        1116 : "sg_role_already_get_reward",
        1117 : "sg_role_already_modified_before",
        1118 : "sg_role_non_mobile_email_account",
        1119 : "sg_role_account_can_be_modified",


        //temp


        //game_minigame
        1300 : "sg_game_minigame_already_beted_in_other_position",
        1301 : "sg_game_minigame_max_bet_full",


        //game_dataosha
        1400 : "sg_game_dataosha_bet_illegal",
        1401 : "sg_game_dataosha_change_bet_position_illegal"
    }
}
