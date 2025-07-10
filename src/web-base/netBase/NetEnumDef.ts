export module NetEnumDef {
    export enum check_version_result
    {
        cvr_yes = 1,
        cvr_no = 2
    };
    export enum sys_msg_type
    {
        sys_msg_common = 1,
        sys_msg_shop = 2,
        sys_msg_explore = 3
    };
    export enum connect_type
    {
        common_connect = 1,
        re_connect = 2,
        inner_login = 3
    };
    export enum reconnect_result
    {
        reconnect_success = 1,
        reconnect_noregister = 2,
        reconnect_passworderror = 3,
        reconnect_versionerror = 4
    };
    export enum role_status
    {
        online = 1,
        offline = 2
    };
    export enum common_judge
    {
        common_yes = 1,
        common_no = 2
    };
    export enum common_result
    {
        common_success = 1,
        common_failed = 2,
        common_error = 3
    };
    export enum buy_state
    {
        can_buy = 1,
        not_buy = 2
    };
    export enum vip_reward_state
    {
        reward_ready = 1,
        reward_claimed = 2
    };
    export enum bank_password_state
    {
        is_set = 1,
        not_set = 2
    };
    export enum game_type
    {
        game_type_slots_fotune_god = 1,
        game_type_jmp = 2,
        game_type_jump_high = 3,
        game_type_milu2 = 4,
        game_type_captain = 5,
        game_type_wucaishen = 6,
        game_type_bigsmall = 7,
        game_type_longhu = 8,
        game_type_shuangdan = 9,
        game_type_mjhlsecond = 10,
        game_type_dataosha = 11,
        game_type_pdk = 12,
        game_type_bj = 13,
        game_type_tx = 14,
        game_type_sss = 15,
        game_type_baijiale = 16,
        game_type_yxx = 17,
        game_type_omh = 18,
        game_type_zhajinhua = 19,
        game_type_lhd = 20,
        game_type_sedie = 21,
        game_type_shaibao = 22,
        game_type_talapai = 23,
        game_type_catte = 24,
        game_type_sangong = 25,
        game_type_hkfive = 26,
        game_type_treasure_aztec = 27,
        game_type_timedigger = 28,
        game_type_farmpark = 29,
        game_type_queen = 30,
        game_type_boxingking = 31,
        game_type_moneycoming = 32,
        game_type_lostpyramid = 33,
        game_type_newyear2 = 34,
        game_type_nightmarket2 = 35,
        game_type_fortunedragon = 36
    };
    export enum room_type
    {
        room_primary = 1,
        room_intermediate = 2,
        room_senior = 3,
        room_master = 4,
        room_regal = 5
    };
    export enum game_status
    {
        game_status_normal = 1,
        game_status_maintenance = 2
    };
    export enum sex
    {
        man = 1,
        woman = 2
    };
    export enum common_game_result
    {
        win = 1,
        lost = 2,
        tie = 3
    };
    export enum award_type
    {
        day_task = 1,
        achievements_task = 2,
        welfare_gift = 3
    };
    export enum transfer_log_type
    {
        transfer_log_type_in = 1,
        transfer_log_type_out = 2
    };
    export enum language
    {
        lang_chinese = 1,
        lang_english = 2,
        lang_vietnamese = 3
    };
    export enum share_scenes
    {
        share_app = 1,
        share_tournament = 2,
        share_activity = 3,
        share_agent = 4,
        share_landing_page = 5
    };
    export enum tx_game_status
    {
        tx_game_status_idle = 1,
        tx_game_status_pre_flop = 2,
        tx_game_status_flop = 3,
        tx_game_status_turn = 4,
        tx_game_status_river = 5,
        tx_game_status_settlement = 6
    };
    export enum tx_role_status
    {
        tx_role_status_idle = 1,
        tx_role_status_gaming = 2,
        tx_role_status_operator = 3
    };
    export enum tx_play_type
    {
        tx_play_type_classic = 1,
        tx_play_type_short = 2,
        tx_play_type_aof = 3
    };
    export enum tx_bet_type
    {
        tx_bet_type_limit = 1,
        tx_bet_type_pod_limit = 2,
        tx_bet_type_no_limit = 3
    };
    export enum tx_blind_type
    {
        tx_blind_type_normal = 1,
        tx_blind_type_rand = 2,
        tx_blind_type_all = 3
    };
    export enum tx_cards_type
    {
        tx_cards_type_high_card = 1,
        tx_cards_type_one_pair = 2,
        tx_cards_type_two_pair = 3,
        tx_cards_type_three_of_a_kind = 4,
        tx_cards_type_straight = 5,
        tx_cards_type_flush = 6,
        tx_cards_type_full_house = 7,
        tx_cards_type_four_of_a_kind = 8,
        tx_cards_type_straight_flush = 9,
        tx_cards_type_royal_flush = 10
    };
    export enum pdk_game_mode
    {
        pdk_game_mode_1v3 = 1,
        pdk_game_mode_blood = 2
    };
    export enum baijiale_game_status
    {
        baijiale_game_status_idle = 1,
        baijiale_game_status_bet = 2,
        baijiale_game_status_settlement = 3
    };
    export enum baijiale_area
    {
        baijiale_area_banker = 1,
        baijiale_area_player = 2,
        baijiale_area_tie = 3,
        baijiale_area_banker_pair = 4,
        baijiale_area_player_pair = 5,
        baijiale_area_luck_six = 6
    };
    export enum yxx_game_status
    {
        yxx_game_status_idle = 1,
        yxx_game_status_bet = 2,
        yxx_game_status_settlement = 3
    };
    export enum yxx_area
    {
        yxx_area_1 = 1,
        yxx_area_2 = 2,
        yxx_area_3 = 3,
        yxx_area_4 = 4,
        yxx_area_5 = 5,
        yxx_area_6 = 6,
        yxx_area_all = 7,
        yxx_area_1_2 = 8,
        yxx_area_1_3 = 9,
        yxx_area_1_4 = 10,
        yxx_area_1_5 = 11,
        yxx_area_1_6 = 12,
        yxx_area_2_3 = 13,
        yxx_area_2_4 = 14,
        yxx_area_2_5 = 15,
        yxx_area_2_6 = 16,
        yxx_area_3_4 = 17,
        yxx_area_3_5 = 18,
        yxx_area_3_6 = 19,
        yxx_area_4_5 = 20,
        yxx_area_4_6 = 21,
        yxx_area_5_6 = 22
    };
    export enum shaibao_game_status
    {
        shaibao_game_status_idle = 1,
        shaibao_game_status_bet = 2,
        shaibao_game_status_settlement = 3,
        shaibao_game_status_count_down = 4
    };
    export enum shaibao_area
    {
        shaibao_area_1 = 1,
        shaibao_area_2 = 2,
        shaibao_area_3 = 3,
        shaibao_area_4 = 4,
        shaibao_area_5 = 5,
        shaibao_area_6 = 6,
        shaibao_area_7 = 7,
        shaibao_area_8 = 8,
        shaibao_area_9 = 9,
        shaibao_area_10 = 10,
        shaibao_area_11 = 11,
        shaibao_area_12 = 12,
        shaibao_area_13 = 13,
        shaibao_area_14 = 14,
        shaibao_area_15 = 15,
        shaibao_area_16 = 16,
        shaibao_area_17 = 17,
        shaibao_area_18 = 18,
        shaibao_area_19 = 19,
        shaibao_area_20 = 20,
        shaibao_area_21 = 21,
        shaibao_area_22 = 22,
        shaibao_area_23 = 23,
        shaibao_area_24 = 24,
        shaibao_area_25 = 25,
        shaibao_area_26 = 26,
        shaibao_area_27 = 27,
        shaibao_area_28 = 28,
        shaibao_area_29 = 29,
        shaibao_area_30 = 30,
        shaibao_area_31 = 31
    };
    export enum lhd_area
    {
        lhd_area_banker = 1,
        lhd_area_player = 2,
        lhd_area_tie = 3,
        lhd_area_banker_pair = 4,
        lhd_area_player_pair = 5,
        lhd_area_luck_six = 6
    };
    export enum catte_game_status
    {
        catte_game_status_idle = 1,
        catte_game_status_1_and_4_round = 2,
        catte_game_status_5_round = 3,
        catte_game_status_6_round = 4,
        catte_game_status_settlement = 5
    };
    export enum catte_role_status
    {
        catte_role_status_idle = 1,
        catte_role_status_gaming = 2
    };

    export function get_proto_version()
    {

        return 1;
    }

}