# LVGL Berry API Reference

[//]: # (**********************************************************************)
[//]: # (* Generated code, don't edit                                         *)
[//]: # (**********************************************************************)


## module `lv`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
anim_count_running|[lv_anim_count_running](https://docs.lvgl.io/9.0/search.html?q=lv_anim_count_running)||i
anim_delete|[lv_anim_delete](https://docs.lvgl.io/9.0/search.html?q=lv_anim_delete)|\<any\>, comptr|b
anim_delete_all|[lv_anim_delete_all](https://docs.lvgl.io/9.0/search.html?q=lv_anim_delete_all)||
anim_get|[lv_anim_get](https://docs.lvgl.io/9.0/search.html?q=lv_anim_get)|\<any\>, comptr|lv.anim
anim_get_timer|[lv_anim_get_timer](https://docs.lvgl.io/9.0/search.html?q=lv_anim_get_timer)||lv.timer
anim_refr_now|[lv_anim_refr_now](https://docs.lvgl.io/9.0/search.html?q=lv_anim_refr_now)||
anim_speed|[lv_anim_speed](https://docs.lvgl.io/9.0/search.html?q=lv_anim_speed)|int|i
anim_speed_clamped|[lv_anim_speed_clamped](https://docs.lvgl.io/9.0/search.html?q=lv_anim_speed_clamped)|int, int, int|i
animimg_create|[lv_animimg_create](https://docs.lvgl.io/9.0/search.html?q=lv_animimg_create)|lv.obj|lv.obj
animimg_get_duration|[lv_animimg_get_duration](https://docs.lvgl.io/9.0/search.html?q=lv_animimg_get_duration)|lv.obj|i
animimg_get_repeat_count|[lv_animimg_get_repeat_count](https://docs.lvgl.io/9.0/search.html?q=lv_animimg_get_repeat_count)|lv.obj|i
animimg_get_src_count|[lv_animimg_get_src_count](https://docs.lvgl.io/9.0/search.html?q=lv_animimg_get_src_count)|lv.obj|i
animimg_set_duration|[lv_animimg_set_duration](https://docs.lvgl.io/9.0/search.html?q=lv_animimg_set_duration)|lv.obj, int|
animimg_set_repeat_count|[lv_animimg_set_repeat_count](https://docs.lvgl.io/9.0/search.html?q=lv_animimg_set_repeat_count)|lv.obj, int|
animimg_set_src|[lv_animimg_set_src](https://docs.lvgl.io/9.0/search.html?q=lv_animimg_set_src)|lv.obj, comptr, int|
animimg_start|[lv_animimg_start](https://docs.lvgl.io/9.0/search.html?q=lv_animimg_start)|lv.obj|
area_align|[lv_area_align](https://docs.lvgl.io/9.0/search.html?q=lv_area_align)|lv.area, lv.area, int, int, int|
area_copy|[lv_area_copy](https://docs.lvgl.io/9.0/search.html?q=lv_area_copy)|lv.area, lv.area|
area_get_height|[lv_area_get_height](https://docs.lvgl.io/9.0/search.html?q=lv_area_get_height)|lv.area|i
area_get_size|[lv_area_get_size](https://docs.lvgl.io/9.0/search.html?q=lv_area_get_size)|lv.area|i
area_get_width|[lv_area_get_width](https://docs.lvgl.io/9.0/search.html?q=lv_area_get_width)|lv.area|i
area_increase|[lv_area_increase](https://docs.lvgl.io/9.0/search.html?q=lv_area_increase)|lv.area, int, int|
area_move|[lv_area_move](https://docs.lvgl.io/9.0/search.html?q=lv_area_move)|lv.area, int, int|
area_set|[lv_area_set](https://docs.lvgl.io/9.0/search.html?q=lv_area_set)|lv.area, int, int, int, int|
area_set_height|[lv_area_set_height](https://docs.lvgl.io/9.0/search.html?q=lv_area_set_height)|lv.area, int|
area_set_width|[lv_area_set_width](https://docs.lvgl.io/9.0/search.html?q=lv_area_set_width)|lv.area, int|
calendar_create|[lv_calendar_create](https://docs.lvgl.io/9.0/search.html?q=lv_calendar_create)|lv.obj|lv.obj
calendar_get_btnmatrix|[lv_calendar_get_btnmatrix](https://docs.lvgl.io/9.0/search.html?q=lv_calendar_get_btnmatrix)|lv.obj|lv.obj
calendar_get_highlighted_dates_num|[lv_calendar_get_highlighted_dates_num](https://docs.lvgl.io/9.0/search.html?q=lv_calendar_get_highlighted_dates_num)|lv.obj|i
calendar_header_arrow_create|[lv_calendar_header_arrow_create](https://docs.lvgl.io/9.0/search.html?q=lv_calendar_header_arrow_create)|lv.obj|lv.obj
calendar_header_dropdown_create|[lv_calendar_header_dropdown_create](https://docs.lvgl.io/9.0/search.html?q=lv_calendar_header_dropdown_create)|lv.obj|lv.obj
calendar_header_dropdown_set_year_list|[lv_calendar_header_dropdown_set_year_list](https://docs.lvgl.io/9.0/search.html?q=lv_calendar_header_dropdown_set_year_list)|lv.obj, string|
calendar_set_day_names|[lv_calendar_set_day_names](https://docs.lvgl.io/9.0/search.html?q=lv_calendar_set_day_names)|lv.obj, comptr|
calendar_set_showed_date|[lv_calendar_set_showed_date](https://docs.lvgl.io/9.0/search.html?q=lv_calendar_set_showed_date)|lv.obj, int, int|
calendar_set_today_date|[lv_calendar_set_today_date](https://docs.lvgl.io/9.0/search.html?q=lv_calendar_set_today_date)|lv.obj, int, int, int|
canvas_buf_size|[lv_canvas_buf_size](https://docs.lvgl.io/9.0/search.html?q=lv_canvas_buf_size)|int, int, int, int|i
clamp_height|[lv_clamp_height](https://docs.lvgl.io/9.0/search.html?q=lv_clamp_height)|int, int, int, int|i
clamp_width|[lv_clamp_width](https://docs.lvgl.io/9.0/search.html?q=lv_clamp_width)|int, int, int, int|i
color32_eq|[lv_color32_eq](https://docs.lvgl.io/9.0/search.html?q=lv_color32_eq)|int, int|b
color32_make|[lv_color32_make](https://docs.lvgl.io/9.0/search.html?q=lv_color32_make)|int, int, int, int|i
color_16_16_mix|[lv_color_16_16_mix](https://docs.lvgl.io/9.0/search.html?q=lv_color_16_16_mix)|int, int, int|i
color_black|[lv_color_black](https://docs.lvgl.io/9.0/search.html?q=lv_color_black)||lv.color
color_brightness|[lv_color_brightness](https://docs.lvgl.io/9.0/search.html?q=lv_color_brightness)|lv.color|i
color_darken|[lv_color_darken](https://docs.lvgl.io/9.0/search.html?q=lv_color_darken)|lv.color, int|lv.color
color_eq|[lv_color_eq](https://docs.lvgl.io/9.0/search.html?q=lv_color_eq)|lv.color, lv.color|b
color_format_get_bpp|[lv_color_format_get_bpp](https://docs.lvgl.io/9.0/search.html?q=lv_color_format_get_bpp)|int|i
color_format_get_size|[lv_color_format_get_size](https://docs.lvgl.io/9.0/search.html?q=lv_color_format_get_size)|int|i
color_format_has_alpha|[lv_color_format_has_alpha](https://docs.lvgl.io/9.0/search.html?q=lv_color_format_has_alpha)|int|b
color_hex|[lv_color_hex](https://docs.lvgl.io/9.0/search.html?q=lv_color_hex)|int|lv.color
color_hex3|[lv_color_hex3](https://docs.lvgl.io/9.0/search.html?q=lv_color_hex3)|int|lv.color
color_hsv_to_rgb|[lv_color_hsv_to_rgb](https://docs.lvgl.io/9.0/search.html?q=lv_color_hsv_to_rgb)|int, int, int|lv.color
color_lighten|[lv_color_lighten](https://docs.lvgl.io/9.0/search.html?q=lv_color_lighten)|lv.color, int|lv.color
color_make|[lv_color_make](https://docs.lvgl.io/9.0/search.html?q=lv_color_make)|int, int, int|lv.color
color_mix|[lv_color_mix](https://docs.lvgl.io/9.0/search.html?q=lv_color_mix)|lv.color, lv.color, int|lv.color
color_mix32|[lv_color_mix32](https://docs.lvgl.io/9.0/search.html?q=lv_color_mix32)|int, int|i
color_rgb_to_hsv|[lv_color_rgb_to_hsv](https://docs.lvgl.io/9.0/search.html?q=lv_color_rgb_to_hsv)|int, int, int|i
color_to_32|[lv_color_to_32](https://docs.lvgl.io/9.0/search.html?q=lv_color_to_32)|lv.color, int|i
color_to_hsv|[lv_color_to_hsv](https://docs.lvgl.io/9.0/search.html?q=lv_color_to_hsv)|lv.color|i
color_to_int|[lv_color_to_int](https://docs.lvgl.io/9.0/search.html?q=lv_color_to_int)|lv.color|i
color_to_u16|[lv_color_to_u16](https://docs.lvgl.io/9.0/search.html?q=lv_color_to_u16)|lv.color|i
color_to_u32|[lv_color_to_u32](https://docs.lvgl.io/9.0/search.html?q=lv_color_to_u32)|lv.color|i
color_white|[lv_color_white](https://docs.lvgl.io/9.0/search.html?q=lv_color_white)||lv.color
display_create|[lv_display_create](https://docs.lvgl.io/9.0/search.html?q=lv_display_create)|int, int|lv.display
display_get_default|[lv_display_get_default](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_default)||lv.display
dpx|[lv_dpx](https://docs.lvgl.io/9.0/search.html?q=lv_dpx)|int|i
draw_arc|[lv_draw_arc](https://docs.lvgl.io/9.0/search.html?q=lv_draw_arc)|comptr, lv.draw_arc_dsc|
draw_arc_dsc_init|[lv_draw_arc_dsc_init](https://docs.lvgl.io/9.0/search.html?q=lv_draw_arc_dsc_init)|lv.draw_arc_dsc|
draw_arc_get_area|[lv_draw_arc_get_area](https://docs.lvgl.io/9.0/search.html?q=lv_draw_arc_get_area)|int, int, int, int, int, int, bool, lv.area|
draw_character|[lv_draw_character](https://docs.lvgl.io/9.0/search.html?q=lv_draw_character)|comptr, lv.draw_label_dsc, comptr, int|
draw_create_unit|[lv_draw_create_unit](https://docs.lvgl.io/9.0/search.html?q=lv_draw_create_unit)|int|c
draw_deinit|[lv_draw_deinit](https://docs.lvgl.io/9.0/search.html?q=lv_draw_deinit)||
draw_dispatch|[lv_draw_dispatch](https://docs.lvgl.io/9.0/search.html?q=lv_draw_dispatch)||
draw_dispatch_layer|[lv_draw_dispatch_layer](https://docs.lvgl.io/9.0/search.html?q=lv_draw_dispatch_layer)|lv.display, comptr|b
draw_dispatch_request|[lv_draw_dispatch_request](https://docs.lvgl.io/9.0/search.html?q=lv_draw_dispatch_request)||
draw_dispatch_wait_for_request|[lv_draw_dispatch_wait_for_request](https://docs.lvgl.io/9.0/search.html?q=lv_draw_dispatch_wait_for_request)||
draw_init|[lv_draw_init](https://docs.lvgl.io/9.0/search.html?q=lv_draw_init)||
draw_label|[lv_draw_label](https://docs.lvgl.io/9.0/search.html?q=lv_draw_label)|comptr, lv.draw_label_dsc, lv.area|
draw_label_dsc_init|[lv_draw_label_dsc_init](https://docs.lvgl.io/9.0/search.html?q=lv_draw_label_dsc_init)|lv.draw_label_dsc|
draw_layer_alloc_buf|[lv_draw_layer_alloc_buf](https://docs.lvgl.io/9.0/search.html?q=lv_draw_layer_alloc_buf)|comptr|c
draw_layer_create|[lv_draw_layer_create](https://docs.lvgl.io/9.0/search.html?q=lv_draw_layer_create)|comptr, int, lv.area|c
draw_layer_go_to_xy|[lv_draw_layer_go_to_xy](https://docs.lvgl.io/9.0/search.html?q=lv_draw_layer_go_to_xy)|comptr, int, int|c
draw_line|[lv_draw_line](https://docs.lvgl.io/9.0/search.html?q=lv_draw_line)|comptr, lv.draw_line_dsc|
draw_line_dsc_init|[lv_draw_line_dsc_init](https://docs.lvgl.io/9.0/search.html?q=lv_draw_line_dsc_init)|lv.draw_line_dsc|
draw_rect|[lv_draw_rect](https://docs.lvgl.io/9.0/search.html?q=lv_draw_rect)|comptr, lv.draw_rect_dsc, lv.area|
draw_rect_dsc_init|[lv_draw_rect_dsc_init](https://docs.lvgl.io/9.0/search.html?q=lv_draw_rect_dsc_init)|lv.draw_rect_dsc|
draw_vector|[lv_draw_vector](https://docs.lvgl.io/9.0/search.html?q=lv_draw_vector)|comptr|
event_register_id|[lv_event_register_id](https://docs.lvgl.io/9.0/search.html?q=lv_event_register_id)||i
font_get_glyph_width|[lv_font_get_glyph_width](https://docs.lvgl.io/9.0/search.html?q=lv_font_get_glyph_width)|lv.font, int, int|i
font_get_line_height|[lv_font_get_line_height](https://docs.lvgl.io/9.0/search.html?q=lv_font_get_line_height)|lv.font|i
font_set_kerning|[lv_font_set_kerning](https://docs.lvgl.io/9.0/search.html?q=lv_font_set_kerning)|lv.font, int|
get_hor_res|[lv_get_hor_res](https://docs.lvgl.io/9.0/search.html?q=lv_get_hor_res)||i
get_ts_calibration|[lv_get_ts_calibration](https://docs.lvgl.io/9.0/search.html?q=lv_get_ts_calibration)||lv.ts_calibration
get_ver_res|[lv_get_ver_res](https://docs.lvgl.io/9.0/search.html?q=lv_get_ver_res)||i
group_by_index|[lv_group_by_index](https://docs.lvgl.io/9.0/search.html?q=lv_group_by_index)|int|lv.group
group_get_count|[lv_group_get_count](https://docs.lvgl.io/9.0/search.html?q=lv_group_get_count)||i
group_get_default|[lv_group_get_default](https://docs.lvgl.io/9.0/search.html?q=lv_group_get_default)||lv.group
layer_bottom|[lv_layer_bottom](https://docs.lvgl.io/9.0/search.html?q=lv_layer_bottom)||lv.obj
layer_sys|[lv_layer_sys](https://docs.lvgl.io/9.0/search.html?q=lv_layer_sys)||lv.obj
layer_top|[lv_layer_top](https://docs.lvgl.io/9.0/search.html?q=lv_layer_top)||lv.obj
menu_back_button_is_root|[lv_menu_back_button_is_root](https://docs.lvgl.io/9.0/search.html?q=lv_menu_back_button_is_root)|lv.obj, lv.obj|b
menu_clear_history|[lv_menu_clear_history](https://docs.lvgl.io/9.0/search.html?q=lv_menu_clear_history)|lv.obj|
menu_cont_create|[lv_menu_cont_create](https://docs.lvgl.io/9.0/search.html?q=lv_menu_cont_create)|lv.obj|lv.obj
menu_create|[lv_menu_create](https://docs.lvgl.io/9.0/search.html?q=lv_menu_create)|lv.obj|lv.obj
menu_get_cur_main_page|[lv_menu_get_cur_main_page](https://docs.lvgl.io/9.0/search.html?q=lv_menu_get_cur_main_page)|lv.obj|lv.obj
menu_get_cur_sidebar_page|[lv_menu_get_cur_sidebar_page](https://docs.lvgl.io/9.0/search.html?q=lv_menu_get_cur_sidebar_page)|lv.obj|lv.obj
menu_get_main_header|[lv_menu_get_main_header](https://docs.lvgl.io/9.0/search.html?q=lv_menu_get_main_header)|lv.obj|lv.obj
menu_get_main_header_back_button|[lv_menu_get_main_header_back_button](https://docs.lvgl.io/9.0/search.html?q=lv_menu_get_main_header_back_button)|lv.obj|lv.obj
menu_get_sidebar_header|[lv_menu_get_sidebar_header](https://docs.lvgl.io/9.0/search.html?q=lv_menu_get_sidebar_header)|lv.obj|lv.obj
menu_get_sidebar_header_back_button|[lv_menu_get_sidebar_header_back_button](https://docs.lvgl.io/9.0/search.html?q=lv_menu_get_sidebar_header_back_button)|lv.obj|lv.obj
menu_page_create|[lv_menu_page_create](https://docs.lvgl.io/9.0/search.html?q=lv_menu_page_create)|lv.obj, comptr|lv.obj
menu_section_create|[lv_menu_section_create](https://docs.lvgl.io/9.0/search.html?q=lv_menu_section_create)|lv.obj|lv.obj
menu_separator_create|[lv_menu_separator_create](https://docs.lvgl.io/9.0/search.html?q=lv_menu_separator_create)|lv.obj|lv.obj
menu_set_load_page_event|[lv_menu_set_load_page_event](https://docs.lvgl.io/9.0/search.html?q=lv_menu_set_load_page_event)|lv.obj, lv.obj, lv.obj|
menu_set_mode_header|[lv_menu_set_mode_header](https://docs.lvgl.io/9.0/search.html?q=lv_menu_set_mode_header)|lv.obj, int|
menu_set_mode_root_back_button|[lv_menu_set_mode_root_back_button](https://docs.lvgl.io/9.0/search.html?q=lv_menu_set_mode_root_back_button)|lv.obj, int|
menu_set_page|[lv_menu_set_page](https://docs.lvgl.io/9.0/search.html?q=lv_menu_set_page)|lv.obj, lv.obj|
menu_set_page_title|[lv_menu_set_page_title](https://docs.lvgl.io/9.0/search.html?q=lv_menu_set_page_title)|lv.obj, comptr|
menu_set_page_title_static|[lv_menu_set_page_title_static](https://docs.lvgl.io/9.0/search.html?q=lv_menu_set_page_title_static)|lv.obj, comptr|
menu_set_sidebar_page|[lv_menu_set_sidebar_page](https://docs.lvgl.io/9.0/search.html?q=lv_menu_set_sidebar_page)|lv.obj, lv.obj|
obj_assign_id|[lv_obj_assign_id](https://docs.lvgl.io/9.0/search.html?q=lv_obj_assign_id)|lv.obj_class, lv.obj|
obj_class_create_obj|[lv_obj_class_create_obj](https://docs.lvgl.io/9.0/search.html?q=lv_obj_class_create_obj)|lv.obj_class, lv.obj|lv.obj
obj_delete_anim_completed_cb|[lv_obj_delete_anim_completed_cb](https://docs.lvgl.io/9.0/search.html?q=lv_obj_delete_anim_completed_cb)|lv.anim|
obj_enable_style_refresh|[lv_obj_enable_style_refresh](https://docs.lvgl.io/9.0/search.html?q=lv_obj_enable_style_refresh)|bool|
obj_event_base|[lv_obj_event_base](https://docs.lvgl.io/9.0/search.html?q=lv_obj_event_base)|lv.obj_class, lv.event|i
obj_redraw|[lv_obj_redraw](https://docs.lvgl.io/9.0/search.html?q=lv_obj_redraw)|comptr, lv.obj|
obj_report_style_change|[lv_obj_report_style_change](https://docs.lvgl.io/9.0/search.html?q=lv_obj_report_style_change)|lv.style|
obj_style_get_selector_part|[lv_obj_style_get_selector_part](https://docs.lvgl.io/9.0/search.html?q=lv_obj_style_get_selector_part)|int|i
obj_style_get_selector_state|[lv_obj_style_get_selector_state](https://docs.lvgl.io/9.0/search.html?q=lv_obj_style_get_selector_state)|int|i
objid_builtin_destroy|[lv_objid_builtin_destroy](https://docs.lvgl.io/9.0/search.html?q=lv_objid_builtin_destroy)||
pct|[lv_pct](https://docs.lvgl.io/9.0/search.html?q=lv_pct)|int|i
pct_to_px|[lv_pct_to_px](https://docs.lvgl.io/9.0/search.html?q=lv_pct_to_px)|int, int|i
point_from_precise|[lv_point_from_precise](https://docs.lvgl.io/9.0/search.html?q=lv_point_from_precise)|lv.point_precise|i
point_precise_set|[lv_point_precise_set](https://docs.lvgl.io/9.0/search.html?q=lv_point_precise_set)|lv.point_precise, int, int|
point_precise_swap|[lv_point_precise_swap](https://docs.lvgl.io/9.0/search.html?q=lv_point_precise_swap)|lv.point_precise, lv.point_precise|
point_set|[lv_point_set](https://docs.lvgl.io/9.0/search.html?q=lv_point_set)|comptr, int, int|
point_swap|[lv_point_swap](https://docs.lvgl.io/9.0/search.html?q=lv_point_swap)|comptr, comptr|
point_transform|[lv_point_transform](https://docs.lvgl.io/9.0/search.html?q=lv_point_transform)|comptr, int, int, int, comptr, bool|
refr_now|[lv_refr_now](https://docs.lvgl.io/9.0/search.html?q=lv_refr_now)|lv.display|
scale_section_set_range|[lv_scale_section_set_range](https://docs.lvgl.io/9.0/search.html?q=lv_scale_section_set_range)|comptr, int, int|
scale_section_set_style|[lv_scale_section_set_style](https://docs.lvgl.io/9.0/search.html?q=lv_scale_section_set_style)|comptr, int, lv.style|
scr_act|[lv_screen_active](https://docs.lvgl.io/9.0/search.html?q=lv_screen_active)||lv.obj
scr_load_anim|[lv_screen_load_anim](https://docs.lvgl.io/9.0/search.html?q=lv_screen_load_anim)|lv.obj, int, int, int, bool|
screen_active|[lv_screen_active](https://docs.lvgl.io/9.0/search.html?q=lv_screen_active)||lv.obj
screen_load|[lv_screen_load](https://docs.lvgl.io/9.0/search.html?q=lv_screen_load)|lv.obj|
screen_load_anim|[lv_screen_load_anim](https://docs.lvgl.io/9.0/search.html?q=lv_screen_load_anim)|lv.obj, int, int, int, bool|
span_set_text|[lv_span_set_text](https://docs.lvgl.io/9.0/search.html?q=lv_span_set_text)|lv.spangroup, string|
span_set_text_static|[lv_span_set_text_static](https://docs.lvgl.io/9.0/search.html?q=lv_span_set_text_static)|lv.spangroup, string|
span_stack_deinit|[lv_span_stack_deinit](https://docs.lvgl.io/9.0/search.html?q=lv_span_stack_deinit)||
span_stack_init|[lv_span_stack_init](https://docs.lvgl.io/9.0/search.html?q=lv_span_stack_init)||
style_get_num_custom_props|[lv_style_get_num_custom_props](https://docs.lvgl.io/9.0/search.html?q=lv_style_get_num_custom_props)||i
style_prop_get_default|[lv_style_prop_get_default](https://docs.lvgl.io/9.0/search.html?q=lv_style_prop_get_default)|int|i
style_prop_has_flag|[lv_style_prop_has_flag](https://docs.lvgl.io/9.0/search.html?q=lv_style_prop_has_flag)|int, int|b
style_register_prop|[lv_style_register_prop](https://docs.lvgl.io/9.0/search.html?q=lv_style_register_prop)|int|i
task_handler|[lv_task_handler](https://docs.lvgl.io/9.0/search.html?q=lv_task_handler)||i
theme_apply|[lv_theme_apply](https://docs.lvgl.io/9.0/search.html?q=lv_theme_apply)|lv.obj|
theme_get_color_primary|[lv_theme_get_color_primary](https://docs.lvgl.io/9.0/search.html?q=lv_theme_get_color_primary)|lv.obj|lv.color
theme_get_color_secondary|[lv_theme_get_color_secondary](https://docs.lvgl.io/9.0/search.html?q=lv_theme_get_color_secondary)|lv.obj|lv.color
theme_get_font_large|[lv_theme_get_font_large](https://docs.lvgl.io/9.0/search.html?q=lv_theme_get_font_large)|lv.obj|lv.font
theme_get_font_normal|[lv_theme_get_font_normal](https://docs.lvgl.io/9.0/search.html?q=lv_theme_get_font_normal)|lv.obj|lv.font
theme_get_font_small|[lv_theme_get_font_small](https://docs.lvgl.io/9.0/search.html?q=lv_theme_get_font_small)|lv.obj|lv.font
theme_get_from_obj|[lv_theme_get_from_obj](https://docs.lvgl.io/9.0/search.html?q=lv_theme_get_from_obj)|lv.obj|lv.theme
theme_haspmota_init|[lv_theme_haspmota_init](https://docs.lvgl.io/9.0/search.html?q=lv_theme_haspmota_init)|lv.display, lv.color, lv.color, bool, lv.font|lv.theme
theme_haspmota_is_inited|[lv_theme_haspmota_is_inited](https://docs.lvgl.io/9.0/search.html?q=lv_theme_haspmota_is_inited)||b
theme_set_parent|[lv_theme_set_parent](https://docs.lvgl.io/9.0/search.html?q=lv_theme_set_parent)|lv.theme, lv.theme|
timer_create|[lv_timer_create](https://docs.lvgl.io/9.0/search.html?q=lv_timer_create)|\<closure\>, int, \<any\>|lv.timer
timer_create_basic|[lv_timer_create_basic](https://docs.lvgl.io/9.0/search.html?q=lv_timer_create_basic)||lv.timer
timer_enable|[lv_timer_enable](https://docs.lvgl.io/9.0/search.html?q=lv_timer_enable)|bool|
timer_get_idle|[lv_timer_get_idle](https://docs.lvgl.io/9.0/search.html?q=lv_timer_get_idle)||i
timer_get_time_until_next|[lv_timer_get_time_until_next](https://docs.lvgl.io/9.0/search.html?q=lv_timer_get_time_until_next)||i
timer_handler|[lv_timer_handler](https://docs.lvgl.io/9.0/search.html?q=lv_timer_handler)||i
timer_handler_run_in_period|[lv_timer_handler_run_in_period](https://docs.lvgl.io/9.0/search.html?q=lv_timer_handler_run_in_period)|int|i
timer_periodic_handler|[lv_timer_periodic_handler](https://docs.lvgl.io/9.0/search.html?q=lv_timer_periodic_handler)||
vector_clear_area|[lv_vector_clear_area](https://docs.lvgl.io/9.0/search.html?q=lv_vector_clear_area)|comptr, lv.area|
vector_dsc_add_path|[lv_vector_dsc_add_path](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_add_path)|comptr, comptr|
vector_dsc_create|[lv_vector_dsc_create](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_create)|comptr|c
vector_dsc_delete|[lv_vector_dsc_delete](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_delete)|comptr|
vector_dsc_identity|[lv_vector_dsc_identity](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_identity)|comptr|
vector_dsc_rotate|[lv_vector_dsc_rotate](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_rotate)|comptr, f|
vector_dsc_scale|[lv_vector_dsc_scale](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_scale)|comptr, f, f|
vector_dsc_set_blend_mode|[lv_vector_dsc_set_blend_mode](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_blend_mode)|comptr, int|
vector_dsc_set_fill_color|[lv_vector_dsc_set_fill_color](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_fill_color)|comptr, lv.color|
vector_dsc_set_fill_color32|[lv_vector_dsc_set_fill_color32](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_fill_color32)|comptr, int|
vector_dsc_set_fill_image|[lv_vector_dsc_set_fill_image](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_fill_image)|comptr, lv.draw_image_dsc|
vector_dsc_set_fill_linear_gradient|[lv_vector_dsc_set_fill_linear_gradient](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_fill_linear_gradient)|comptr, lv.grad_dsc, int|
vector_dsc_set_fill_opa|[lv_vector_dsc_set_fill_opa](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_fill_opa)|comptr, int|
vector_dsc_set_fill_radial_gradient|[lv_vector_dsc_set_fill_radial_gradient](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_fill_radial_gradient)|comptr, lv.grad_dsc, f, f, f, int|
vector_dsc_set_fill_rule|[lv_vector_dsc_set_fill_rule](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_fill_rule)|comptr, int|
vector_dsc_set_stroke_cap|[lv_vector_dsc_set_stroke_cap](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_stroke_cap)|comptr, int|
vector_dsc_set_stroke_color|[lv_vector_dsc_set_stroke_color](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_stroke_color)|comptr, lv.color|
vector_dsc_set_stroke_color32|[lv_vector_dsc_set_stroke_color32](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_stroke_color32)|comptr, int|
vector_dsc_set_stroke_dash|[lv_vector_dsc_set_stroke_dash](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_stroke_dash)|comptr, lv.float_arr, int|
vector_dsc_set_stroke_join|[lv_vector_dsc_set_stroke_join](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_stroke_join)|comptr, int|
vector_dsc_set_stroke_linear_gradient|[lv_vector_dsc_set_stroke_linear_gradient](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_stroke_linear_gradient)|comptr, lv.grad_dsc, int|
vector_dsc_set_stroke_miter_limit|[lv_vector_dsc_set_stroke_miter_limit](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_stroke_miter_limit)|comptr, int|
vector_dsc_set_stroke_opa|[lv_vector_dsc_set_stroke_opa](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_stroke_opa)|comptr, int|
vector_dsc_set_stroke_radial_gradient|[lv_vector_dsc_set_stroke_radial_gradient](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_stroke_radial_gradient)|comptr, lv.grad_dsc, f, f, f, int|
vector_dsc_set_stroke_width|[lv_vector_dsc_set_stroke_width](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_set_stroke_width)|comptr, f|
vector_dsc_skew|[lv_vector_dsc_skew](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_skew)|comptr, f, f|
vector_dsc_translate|[lv_vector_dsc_translate](https://docs.lvgl.io/9.0/search.html?q=lv_vector_dsc_translate)|comptr, f, f|
vector_path_append_path|[lv_vector_path_append_path](https://docs.lvgl.io/9.0/search.html?q=lv_vector_path_append_path)|comptr, comptr|
vector_path_append_rect|[lv_vector_path_append_rect](https://docs.lvgl.io/9.0/search.html?q=lv_vector_path_append_rect)|comptr, lv.area, f, f|
vector_path_clear|[lv_vector_path_clear](https://docs.lvgl.io/9.0/search.html?q=lv_vector_path_clear)|comptr|
vector_path_close|[lv_vector_path_close](https://docs.lvgl.io/9.0/search.html?q=lv_vector_path_close)|comptr|
vector_path_copy|[lv_vector_path_copy](https://docs.lvgl.io/9.0/search.html?q=lv_vector_path_copy)|comptr, comptr|
vector_path_create|[lv_vector_path_create](https://docs.lvgl.io/9.0/search.html?q=lv_vector_path_create)|int|c
vector_path_delete|[lv_vector_path_delete](https://docs.lvgl.io/9.0/search.html?q=lv_vector_path_delete)|comptr|
version_info|[lv_version_info](https://docs.lvgl.io/9.0/search.html?q=lv_version_info)||s
version_major|[lv_version_major](https://docs.lvgl.io/9.0/search.html?q=lv_version_major)||i
version_minor|[lv_version_minor](https://docs.lvgl.io/9.0/search.html?q=lv_version_minor)||i
version_patch|[lv_version_patch](https://docs.lvgl.io/9.0/search.html?q=lv_version_patch)||i
win_add_button|[lv_win_add_button](https://docs.lvgl.io/9.0/search.html?q=lv_win_add_button)|lv.obj, \<any\>, int|lv.obj
win_add_title|[lv_win_add_title](https://docs.lvgl.io/9.0/search.html?q=lv_win_add_title)|lv.obj, string|lv.obj
win_create|[lv_win_create](https://docs.lvgl.io/9.0/search.html?q=lv_win_create)|lv.obj|lv.obj
win_get_content|[lv_win_get_content](https://docs.lvgl.io/9.0/search.html?q=lv_win_get_content)|lv.obj|lv.obj
win_get_header|[lv_win_get_header](https://docs.lvgl.io/9.0/search.html?q=lv_win_get_header)|lv.obj|lv.obj

## Core classes

### class `lv.anim`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
custom_delete|[lv_anim_custom_delete](https://docs.lvgl.io/9.0/search.html?q=lv_anim_custom_delete)|lv.anim, comptr|b
custom_get|[lv_anim_custom_get](https://docs.lvgl.io/9.0/search.html?q=lv_anim_custom_get)|lv.anim, comptr|lv.anim
get_delay|[lv_anim_get_delay](https://docs.lvgl.io/9.0/search.html?q=lv_anim_get_delay)|lv.anim|i
get_playtime|[lv_anim_get_playtime](https://docs.lvgl.io/9.0/search.html?q=lv_anim_get_playtime)|lv.anim|i
get_repeat_count|[lv_anim_get_repeat_count](https://docs.lvgl.io/9.0/search.html?q=lv_anim_get_repeat_count)|lv.anim|i
get_time|[lv_anim_get_time](https://docs.lvgl.io/9.0/search.html?q=lv_anim_get_time)|lv.anim|i
get_user_data|[lv_anim_get_user_data](https://docs.lvgl.io/9.0/search.html?q=lv_anim_get_user_data)|lv.anim|c
init|[lv_anim_init](https://docs.lvgl.io/9.0/search.html?q=lv_anim_init)|lv.anim|
set_bezier3_param|[lv_anim_set_bezier3_param](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_bezier3_param)|lv.anim, int, int, int, int|
set_completed_cb|[lv_anim_set_completed_cb](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_completed_cb)|lv.anim, comptr|
set_custom_exec_cb|[lv_anim_set_custom_exec_cb](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_custom_exec_cb)|lv.anim, comptr|
set_delay|[lv_anim_set_delay](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_delay)|lv.anim, int|
set_duration|[lv_anim_set_duration](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_duration)|lv.anim, int|
set_early_apply|[lv_anim_set_early_apply](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_early_apply)|lv.anim, bool|
set_exec_cb|[lv_anim_set_exec_cb](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_exec_cb)|lv.anim, comptr|
set_get_value_cb|[lv_anim_set_get_value_cb](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_get_value_cb)|lv.anim, comptr|
set_path_cb|[lv_anim_set_path_cb](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_path_cb)|lv.anim, comptr|
set_playback_delay|[lv_anim_set_playback_delay](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_playback_delay)|lv.anim, int|
set_playback_duration|[lv_anim_set_playback_duration](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_playback_duration)|lv.anim, int|
set_playback_time|[lv_anim_set_playback_time](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_playback_time)|lv.anim, int|
set_ready_cb|[lv_anim_set_completed_cb](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_completed_cb)|lv.anim, comptr|
set_repeat_count|[lv_anim_set_repeat_count](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_repeat_count)|lv.anim, int|
set_repeat_delay|[lv_anim_set_repeat_delay](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_repeat_delay)|lv.anim, int|
set_start_cb|[lv_anim_set_start_cb](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_start_cb)|lv.anim, comptr|
set_time|[lv_anim_set_time](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_time)|lv.anim, int|
set_user_data|[lv_anim_set_user_data](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_user_data)|lv.anim, \<any\>|
set_values|[lv_anim_set_values](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_values)|lv.anim, int, int|
set_var|[lv_anim_set_var](https://docs.lvgl.io/9.0/search.html?q=lv_anim_set_var)|lv.anim, \<any\>|
start|[lv_anim_start](https://docs.lvgl.io/9.0/search.html?q=lv_anim_start)|lv.anim|lv.anim

### class `lv.display`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_event_cb|[lv_display_add_event_cb](https://docs.lvgl.io/9.0/search.html?q=lv_display_add_event_cb)|lv.display, \<closure\>, int, \<any\>|
del|[lv_display_delete](https://docs.lvgl.io/9.0/search.html?q=lv_display_delete)|lv.display|
delete|[lv_display_delete](https://docs.lvgl.io/9.0/search.html?q=lv_display_delete)|lv.display|
delete_event|[lv_display_delete_event](https://docs.lvgl.io/9.0/search.html?q=lv_display_delete_event)|lv.display, int|b
delete_refr_timer|[lv_display_delete_refr_timer](https://docs.lvgl.io/9.0/search.html?q=lv_display_delete_refr_timer)|lv.display|
dpx|[lv_display_dpx](https://docs.lvgl.io/9.0/search.html?q=lv_display_dpx)|lv.display, int|i
enable_invalidation|[lv_display_enable_invalidation](https://docs.lvgl.io/9.0/search.html?q=lv_display_enable_invalidation)|lv.display, bool|
enable_invalidation|[lv_display_enable_invalidation](https://docs.lvgl.io/9.0/search.html?q=lv_display_enable_invalidation)|lv.display, bool|
get_angle|[lv_display_get_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_rotation)|lv.display|i
get_antialiasing|[lv_display_get_antialiasing](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_antialiasing)|lv.display|b
get_antialiasing|[lv_display_get_antialiasing](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_antialiasing)|lv.display|b
get_color_format|[lv_display_get_color_format](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_color_format)|lv.display|i
get_dpi|[lv_display_get_dpi](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_dpi)|lv.display|i
get_dpi|[lv_display_get_dpi](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_dpi)|lv.display|i
get_driver_data|[lv_display_get_driver_data](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_driver_data)|lv.display|c
get_event_count|[lv_display_get_event_count](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_event_count)|lv.display|i
get_hor_res|[lv_display_get_horizontal_resolution](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_horizontal_resolution)|lv.display|i
get_horizontal_resolution|[lv_display_get_horizontal_resolution](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_horizontal_resolution)|lv.display|i
get_inactive_time|[lv_display_get_inactive_time](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_inactive_time)|lv.display|i
get_inactive_time|[lv_display_get_inactive_time](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_inactive_time)|lv.display|i
get_layer_bottom|[lv_display_get_layer_bottom](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_layer_bottom)|lv.display|lv.obj
get_layer_sys|[lv_display_get_layer_sys](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_layer_sys)|lv.display|lv.obj
get_layer_sys|[lv_display_get_layer_sys](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_layer_sys)|lv.display|lv.obj
get_layer_top|[lv_display_get_layer_top](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_layer_top)|lv.display|lv.obj
get_layer_top|[lv_display_get_layer_top](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_layer_top)|lv.display|lv.obj
get_next|[lv_display_get_next](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_next)|lv.display|lv.display
get_next|[lv_display_get_next](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_next)|lv.display|lv.display
get_offset_x|[lv_display_get_offset_x](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_offset_x)|lv.display|i
get_offset_x|[lv_display_get_offset_x](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_offset_x)|lv.display|i
get_offset_y|[lv_display_get_offset_y](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_offset_y)|lv.display|i
get_offset_y|[lv_display_get_offset_y](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_offset_y)|lv.display|i
get_physical_hor_res|[lv_display_get_physical_horizontal_resolution](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_physical_horizontal_resolution)|lv.display|i
get_physical_horizontal_resolution|[lv_display_get_physical_horizontal_resolution](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_physical_horizontal_resolution)|lv.display|i
get_physical_ver_res|[lv_display_get_physical_vertical_resolution](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_physical_vertical_resolution)|lv.display|i
get_physical_vertical_resolution|[lv_display_get_physical_vertical_resolution](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_physical_vertical_resolution)|lv.display|i
get_refr_timer|[lv_display_get_refr_timer](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_refr_timer)|lv.display|lv.timer
get_rotation|[lv_display_get_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_rotation)|lv.display|i
get_rotation|[lv_display_get_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_rotation)|lv.display|i
get_scr_act|[lv_display_get_screen_active](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_screen_active)|lv.display|lv.obj
get_scr_prev|[lv_display_get_screen_prev](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_screen_prev)|lv.display|lv.obj
get_screen_active|[lv_display_get_screen_active](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_screen_active)|lv.display|lv.obj
get_screen_prev|[lv_display_get_screen_prev](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_screen_prev)|lv.display|lv.obj
get_theme|[lv_display_get_theme](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_theme)|lv.display|lv.theme
get_theme|[lv_display_get_theme](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_theme)|lv.display|lv.theme
get_user_data|[lv_display_get_user_data](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_user_data)|lv.display|c
get_ver_res|[lv_display_get_vertical_resolution](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_vertical_resolution)|lv.display|i
get_vertical_resolution|[lv_display_get_vertical_resolution](https://docs.lvgl.io/9.0/search.html?q=lv_display_get_vertical_resolution)|lv.display|i
is_double_buffered|[lv_display_is_double_buffered](https://docs.lvgl.io/9.0/search.html?q=lv_display_is_double_buffered)|lv.display|b
is_invalidation_enabled|[lv_display_is_invalidation_enabled](https://docs.lvgl.io/9.0/search.html?q=lv_display_is_invalidation_enabled)|lv.display|b
is_invalidation_enabled|[lv_display_is_invalidation_enabled](https://docs.lvgl.io/9.0/search.html?q=lv_display_is_invalidation_enabled)|lv.display|b
remove|[lv_display_delete](https://docs.lvgl.io/9.0/search.html?q=lv_display_delete)|lv.display|
remove_event_cb_with_user_data|[lv_display_remove_event_cb_with_user_data](https://docs.lvgl.io/9.0/search.html?q=lv_display_remove_event_cb_with_user_data)|lv.display, \<any\>, \<any\>|i
send_event|[lv_display_send_event](https://docs.lvgl.io/9.0/search.html?q=lv_display_send_event)|lv.display, int, \<any\>|i
send_event|[lv_display_send_event](https://docs.lvgl.io/9.0/search.html?q=lv_display_send_event)|lv.display, int, \<any\>|i
set_angle|[lv_display_set_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_rotation)|lv.display, int|
set_antialiasing|[lv_display_set_antialiasing](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_antialiasing)|lv.display, bool|
set_buffers|[lv_display_set_buffers](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_buffers)|lv.display, \<any\>, \<any\>, int, int|
set_color_format|[lv_display_set_color_format](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_color_format)|lv.display, int|
set_default|[lv_display_set_default](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_default)|lv.display|
set_default|[lv_display_set_default](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_default)|lv.display|
set_dpi|[lv_display_set_dpi](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_dpi)|lv.display, int|
set_driver_data|[lv_display_set_driver_data](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_driver_data)|lv.display, \<any\>|
set_offset|[lv_display_set_offset](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_offset)|lv.display, int, int|
set_physical_resolution|[lv_display_set_physical_resolution](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_physical_resolution)|lv.display, int, int|
set_render_mode|[lv_display_set_render_mode](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_render_mode)|lv.display, int|
set_resolution|[lv_display_set_resolution](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_resolution)|lv.display, int, int|
set_rotation|[lv_display_set_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_rotation)|lv.display, int|
set_rotation|[lv_display_set_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_rotation)|lv.display, int|
set_theme|[lv_display_set_theme](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_theme)|lv.display, lv.theme|
set_theme|[lv_display_set_theme](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_theme)|lv.display, lv.theme|
set_user_data|[lv_display_set_user_data](https://docs.lvgl.io/9.0/search.html?q=lv_display_set_user_data)|lv.display, \<any\>|
trig_activity|[lv_display_trigger_activity](https://docs.lvgl.io/9.0/search.html?q=lv_display_trigger_activity)|lv.display|
trigger_activity|[lv_display_trigger_activity](https://docs.lvgl.io/9.0/search.html?q=lv_display_trigger_activity)|lv.display|

### class `lv.event`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_code|[lv_event_get_code](https://docs.lvgl.io/9.0/search.html?q=lv_event_get_code)|lv.event|i
get_cover_area|[lv_event_get_cover_area](https://docs.lvgl.io/9.0/search.html?q=lv_event_get_cover_area)|lv.event|lv.area
get_current_target|[lv_event_get_current_target](https://docs.lvgl.io/9.0/search.html?q=lv_event_get_current_target)|lv.event|c
get_current_target_obj|[lv_event_get_current_target_obj](https://docs.lvgl.io/9.0/search.html?q=lv_event_get_current_target_obj)|lv.event|lv.obj
get_hit_test_info|[lv_event_get_hit_test_info](https://docs.lvgl.io/9.0/search.html?q=lv_event_get_hit_test_info)|lv.event|c
get_indev|[lv_event_get_indev](https://docs.lvgl.io/9.0/search.html?q=lv_event_get_indev)|lv.event|lv.indev
get_key|[lv_event_get_key](https://docs.lvgl.io/9.0/search.html?q=lv_event_get_key)|lv.event|i
get_layer|[lv_event_get_layer](https://docs.lvgl.io/9.0/search.html?q=lv_event_get_layer)|lv.event|c
get_old_size|[lv_event_get_old_size](https://docs.lvgl.io/9.0/search.html?q=lv_event_get_old_size)|lv.event|lv.area
get_param|[lv_event_get_param](https://docs.lvgl.io/9.0/search.html?q=lv_event_get_param)|lv.event|c
get_scroll_anim|[lv_event_get_scroll_anim](https://docs.lvgl.io/9.0/search.html?q=lv_event_get_scroll_anim)|lv.event|lv.anim
get_self_size_info|[lv_event_get_self_size_info](https://docs.lvgl.io/9.0/search.html?q=lv_event_get_self_size_info)|lv.event|c
get_target|[lv_event_get_target](https://docs.lvgl.io/9.0/search.html?q=lv_event_get_target)|lv.event|c
get_target_obj|[lv_event_get_target_obj](https://docs.lvgl.io/9.0/search.html?q=lv_event_get_target_obj)|lv.event|lv.obj
get_user_data|[lv_event_get_user_data](https://docs.lvgl.io/9.0/search.html?q=lv_event_get_user_data)|lv.event|c
set_cover_res|[lv_event_set_cover_res](https://docs.lvgl.io/9.0/search.html?q=lv_event_set_cover_res)|lv.event, int|
set_ext_draw_size|[lv_event_set_ext_draw_size](https://docs.lvgl.io/9.0/search.html?q=lv_event_set_ext_draw_size)|lv.event, int|
stop_bubbling|[lv_event_stop_bubbling](https://docs.lvgl.io/9.0/search.html?q=lv_event_stop_bubbling)|lv.event|
stop_processing|[lv_event_stop_processing](https://docs.lvgl.io/9.0/search.html?q=lv_event_stop_processing)|lv.event|

### class `lv.group`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_obj|[lv_group_add_obj](https://docs.lvgl.io/9.0/search.html?q=lv_group_add_obj)|lv.group, lv.obj|
del|[lv_group_delete](https://docs.lvgl.io/9.0/search.html?q=lv_group_delete)|lv.group|
delete|[lv_group_delete](https://docs.lvgl.io/9.0/search.html?q=lv_group_delete)|lv.group|
focus_freeze|[lv_group_focus_freeze](https://docs.lvgl.io/9.0/search.html?q=lv_group_focus_freeze)|lv.group, bool|
focus_next|[lv_group_focus_next](https://docs.lvgl.io/9.0/search.html?q=lv_group_focus_next)|lv.group|
focus_obj|[lv_group_focus_obj](https://docs.lvgl.io/9.0/search.html?q=lv_group_focus_obj)|lv.obj|
focus_prev|[lv_group_focus_prev](https://docs.lvgl.io/9.0/search.html?q=lv_group_focus_prev)|lv.group|
get_edge_cb|[lv_group_get_edge_cb](https://docs.lvgl.io/9.0/search.html?q=lv_group_get_edge_cb)|lv.group|C
get_editing|[lv_group_get_editing](https://docs.lvgl.io/9.0/search.html?q=lv_group_get_editing)|lv.group|b
get_focus_cb|[lv_group_get_focus_cb](https://docs.lvgl.io/9.0/search.html?q=lv_group_get_focus_cb)|lv.group|lv.group_focus_cb
get_focused|[lv_group_get_focused](https://docs.lvgl.io/9.0/search.html?q=lv_group_get_focused)|lv.group|lv.obj
get_obj_count|[lv_group_get_obj_count](https://docs.lvgl.io/9.0/search.html?q=lv_group_get_obj_count)|lv.group|i
get_wrap|[lv_group_get_wrap](https://docs.lvgl.io/9.0/search.html?q=lv_group_get_wrap)|lv.group|b
remove|[lv_group_delete](https://docs.lvgl.io/9.0/search.html?q=lv_group_delete)|lv.group|
remove_all_objs|[lv_group_remove_all_objs](https://docs.lvgl.io/9.0/search.html?q=lv_group_remove_all_objs)|lv.group|
remove_obj|[lv_group_remove_obj](https://docs.lvgl.io/9.0/search.html?q=lv_group_remove_obj)|lv.obj|
send_data|[lv_group_send_data](https://docs.lvgl.io/9.0/search.html?q=lv_group_send_data)|lv.group, int|i
set_default|[lv_group_set_default](https://docs.lvgl.io/9.0/search.html?q=lv_group_set_default)|lv.group|
set_default|[lv_group_set_default](https://docs.lvgl.io/9.0/search.html?q=lv_group_set_default)|lv.group|
set_editing|[lv_group_set_editing](https://docs.lvgl.io/9.0/search.html?q=lv_group_set_editing)|lv.group, bool|
set_focus_cb|[lv_group_set_focus_cb](https://docs.lvgl.io/9.0/search.html?q=lv_group_set_focus_cb)|lv.group, \<closure\>|
set_refocus_policy|[lv_group_set_refocus_policy](https://docs.lvgl.io/9.0/search.html?q=lv_group_set_refocus_policy)|lv.group, int|
set_wrap|[lv_group_set_wrap](https://docs.lvgl.io/9.0/search.html?q=lv_group_set_wrap)|lv.group, bool|
swap_obj|[lv_group_swap_obj](https://docs.lvgl.io/9.0/search.html?q=lv_group_swap_obj)|lv.obj, lv.obj|

### class `lv.style`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
is_const|[lv_style_is_const](https://docs.lvgl.io/9.0/search.html?q=lv_style_is_const)|lv.style|b
is_empty|[lv_style_is_empty](https://docs.lvgl.io/9.0/search.html?q=lv_style_is_empty)|lv.style|b
remove_prop|[lv_style_remove_prop](https://docs.lvgl.io/9.0/search.html?q=lv_style_remove_prop)|lv.style, int|b
reset|[lv_style_reset](https://docs.lvgl.io/9.0/search.html?q=lv_style_reset)|lv.style|
set_align|[lv_style_set_align](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_align)|lv.style, int|
set_anim|[lv_style_set_anim](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_anim)|lv.style, lv.anim|
set_anim_duration|[lv_style_set_anim_duration](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_anim_duration)|lv.style, int|
set_anim_time|[lv_style_set_anim_duration](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_anim_duration)|lv.style, int|
set_arc_color|[lv_style_set_arc_color](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_arc_color)|lv.style, lv.color|
set_arc_image_src|[lv_style_set_arc_image_src](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_arc_image_src)|lv.style, \<any\>|
set_arc_opa|[lv_style_set_arc_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_arc_opa)|lv.style, int|
set_arc_rounded|[lv_style_set_arc_rounded](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_arc_rounded)|lv.style, bool|
set_arc_width|[lv_style_set_arc_width](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_arc_width)|lv.style, int|
set_base_dir|[lv_style_set_base_dir](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_base_dir)|lv.style, int|
set_bg_color|[lv_style_set_bg_color](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_color)|lv.style, lv.color|
set_bg_grad|[lv_style_set_bg_grad](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_grad)|lv.style, lv.grad_dsc|
set_bg_grad_color|[lv_style_set_bg_grad_color](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_grad_color)|lv.style, lv.color|
set_bg_grad_dir|[lv_style_set_bg_grad_dir](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_grad_dir)|lv.style, int|
set_bg_grad_opa|[lv_style_set_bg_grad_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_grad_opa)|lv.style, int|
set_bg_grad_stop|[lv_style_set_bg_grad_stop](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_grad_stop)|lv.style, int|
set_bg_image_opa|[lv_style_set_bg_image_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_image_opa)|lv.style, int|
set_bg_image_recolor|[lv_style_set_bg_image_recolor](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_image_recolor)|lv.style, lv.color|
set_bg_image_recolor_opa|[lv_style_set_bg_image_recolor_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_image_recolor_opa)|lv.style, int|
set_bg_image_src|[lv_style_set_bg_image_src](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_image_src)|lv.style, \<any\>|
set_bg_image_tiled|[lv_style_set_bg_image_tiled](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_image_tiled)|lv.style, bool|
set_bg_img_opa|[lv_style_set_bg_image_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_image_opa)|lv.style, int|
set_bg_img_recolor|[lv_style_set_bg_image_recolor](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_image_recolor)|lv.style, lv.color|
set_bg_img_recolor_opa|[lv_style_set_bg_image_recolor_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_image_recolor_opa)|lv.style, int|
set_bg_img_src|[lv_style_set_bg_image_src](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_image_src)|lv.style, \<any\>|
set_bg_img_tiled|[lv_style_set_bg_image_tiled](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_image_tiled)|lv.style, bool|
set_bg_main_opa|[lv_style_set_bg_main_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_main_opa)|lv.style, int|
set_bg_main_stop|[lv_style_set_bg_main_stop](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_main_stop)|lv.style, int|
set_bg_opa|[lv_style_set_bg_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_bg_opa)|lv.style, int|
set_blend_mode|[lv_style_set_blend_mode](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_blend_mode)|lv.style, int|
set_border_color|[lv_style_set_border_color](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_border_color)|lv.style, lv.color|
set_border_opa|[lv_style_set_border_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_border_opa)|lv.style, int|
set_border_post|[lv_style_set_border_post](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_border_post)|lv.style, bool|
set_border_side|[lv_style_set_border_side](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_border_side)|lv.style, int|
set_border_width|[lv_style_set_border_width](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_border_width)|lv.style, int|
set_clip_corner|[lv_style_set_clip_corner](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_clip_corner)|lv.style, bool|
set_color_filter_dsc|[lv_style_set_color_filter_dsc](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_color_filter_dsc)|lv.style, lv.color_filter_dsc|
set_color_filter_opa|[lv_style_set_color_filter_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_color_filter_opa)|lv.style, int|
set_flex_cross_place|[lv_style_set_flex_cross_place](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_flex_cross_place)|lv.style, int|
set_flex_flow|[lv_style_set_flex_flow](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_flex_flow)|lv.style, int|
set_flex_grow|[lv_style_set_flex_grow](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_flex_grow)|lv.style, int|
set_flex_main_place|[lv_style_set_flex_main_place](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_flex_main_place)|lv.style, int|
set_flex_track_place|[lv_style_set_flex_track_place](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_flex_track_place)|lv.style, int|
set_grid_cell_column_pos|[lv_style_set_grid_cell_column_pos](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_grid_cell_column_pos)|lv.style, int|
set_grid_cell_column_span|[lv_style_set_grid_cell_column_span](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_grid_cell_column_span)|lv.style, int|
set_grid_cell_row_pos|[lv_style_set_grid_cell_row_pos](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_grid_cell_row_pos)|lv.style, int|
set_grid_cell_row_span|[lv_style_set_grid_cell_row_span](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_grid_cell_row_span)|lv.style, int|
set_grid_cell_x_align|[lv_style_set_grid_cell_x_align](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_grid_cell_x_align)|lv.style, int|
set_grid_cell_y_align|[lv_style_set_grid_cell_y_align](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_grid_cell_y_align)|lv.style, int|
set_grid_column_align|[lv_style_set_grid_column_align](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_grid_column_align)|lv.style, int|
set_grid_column_dsc_array|[lv_style_set_grid_column_dsc_array](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_grid_column_dsc_array)|lv.style, lv.int_arr|
set_grid_row_align|[lv_style_set_grid_row_align](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_grid_row_align)|lv.style, int|
set_grid_row_dsc_array|[lv_style_set_grid_row_dsc_array](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_grid_row_dsc_array)|lv.style, lv.int_arr|
set_height|[lv_style_set_height](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_height)|lv.style, int|
set_image_opa|[lv_style_set_image_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_image_opa)|lv.style, int|
set_image_recolor|[lv_style_set_image_recolor](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_image_recolor)|lv.style, lv.color|
set_image_recolor_opa|[lv_style_set_image_recolor_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_image_recolor_opa)|lv.style, int|
set_img_opa|[lv_style_set_image_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_image_opa)|lv.style, int|
set_img_recolor|[lv_style_set_image_recolor](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_image_recolor)|lv.style, lv.color|
set_img_recolor_opa|[lv_style_set_image_recolor_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_image_recolor_opa)|lv.style, int|
set_layout|[lv_style_set_layout](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_layout)|lv.style, int|
set_length|[lv_style_set_length](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_length)|lv.style, int|
set_line_color|[lv_style_set_line_color](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_line_color)|lv.style, lv.color|
set_line_dash_gap|[lv_style_set_line_dash_gap](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_line_dash_gap)|lv.style, int|
set_line_dash_width|[lv_style_set_line_dash_width](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_line_dash_width)|lv.style, int|
set_line_opa|[lv_style_set_line_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_line_opa)|lv.style, int|
set_line_rounded|[lv_style_set_line_rounded](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_line_rounded)|lv.style, bool|
set_line_width|[lv_style_set_line_width](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_line_width)|lv.style, int|
set_margin_bottom|[lv_style_set_margin_bottom](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_margin_bottom)|lv.style, int|
set_margin_left|[lv_style_set_margin_left](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_margin_left)|lv.style, int|
set_margin_right|[lv_style_set_margin_right](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_margin_right)|lv.style, int|
set_margin_top|[lv_style_set_margin_top](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_margin_top)|lv.style, int|
set_max_height|[lv_style_set_max_height](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_max_height)|lv.style, int|
set_max_width|[lv_style_set_max_width](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_max_width)|lv.style, int|
set_min_height|[lv_style_set_min_height](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_min_height)|lv.style, int|
set_min_width|[lv_style_set_min_width](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_min_width)|lv.style, int|
set_opa|[lv_style_set_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_opa)|lv.style, int|
set_opa_layered|[lv_style_set_opa_layered](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_opa_layered)|lv.style, int|
set_outline_color|[lv_style_set_outline_color](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_outline_color)|lv.style, lv.color|
set_outline_opa|[lv_style_set_outline_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_outline_opa)|lv.style, int|
set_outline_pad|[lv_style_set_outline_pad](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_outline_pad)|lv.style, int|
set_outline_width|[lv_style_set_outline_width](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_outline_width)|lv.style, int|
set_pad_all|[lv_style_set_pad_all](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_pad_all)|lv.style, int|
set_pad_bottom|[lv_style_set_pad_bottom](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_pad_bottom)|lv.style, int|
set_pad_column|[lv_style_set_pad_column](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_pad_column)|lv.style, int|
set_pad_gap|[lv_style_set_pad_gap](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_pad_gap)|lv.style, int|
set_pad_hor|[lv_style_set_pad_hor](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_pad_hor)|lv.style, int|
set_pad_left|[lv_style_set_pad_left](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_pad_left)|lv.style, int|
set_pad_right|[lv_style_set_pad_right](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_pad_right)|lv.style, int|
set_pad_row|[lv_style_set_pad_row](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_pad_row)|lv.style, int|
set_pad_top|[lv_style_set_pad_top](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_pad_top)|lv.style, int|
set_pad_ver|[lv_style_set_pad_ver](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_pad_ver)|lv.style, int|
set_prop|[lv_style_set_prop](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_prop)|lv.style, int, int|
set_radius|[lv_style_set_radius](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_radius)|lv.style, int|
set_shadow_color|[lv_style_set_shadow_color](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_shadow_color)|lv.style, lv.color|
set_shadow_offset_x|[lv_style_set_shadow_offset_x](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_shadow_offset_x)|lv.style, int|
set_shadow_offset_y|[lv_style_set_shadow_offset_y](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_shadow_offset_y)|lv.style, int|
set_shadow_ofs_x|[lv_style_set_shadow_offset_x](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_shadow_offset_x)|lv.style, int|
set_shadow_ofs_y|[lv_style_set_shadow_offset_y](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_shadow_offset_y)|lv.style, int|
set_shadow_opa|[lv_style_set_shadow_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_shadow_opa)|lv.style, int|
set_shadow_spread|[lv_style_set_shadow_spread](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_shadow_spread)|lv.style, int|
set_shadow_width|[lv_style_set_shadow_width](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_shadow_width)|lv.style, int|
set_size|[lv_style_set_size](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_size)|lv.style, int, int|
set_text_align|[lv_style_set_text_align](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_text_align)|lv.style, int|
set_text_color|[lv_style_set_text_color](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_text_color)|lv.style, lv.color|
set_text_decor|[lv_style_set_text_decor](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_text_decor)|lv.style, int|
set_text_font|[lv_style_set_text_font](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_text_font)|lv.style, lv.font|
set_text_letter_space|[lv_style_set_text_letter_space](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_text_letter_space)|lv.style, int|
set_text_line_space|[lv_style_set_text_line_space](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_text_line_space)|lv.style, int|
set_text_opa|[lv_style_set_text_opa](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_text_opa)|lv.style, int|
set_transform_angle|[lv_style_set_transform_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_transform_rotation)|lv.style, int|
set_transform_height|[lv_style_set_transform_height](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_transform_height)|lv.style, int|
set_transform_pivot_x|[lv_style_set_transform_pivot_x](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_transform_pivot_x)|lv.style, int|
set_transform_pivot_y|[lv_style_set_transform_pivot_y](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_transform_pivot_y)|lv.style, int|
set_transform_rotation|[lv_style_set_transform_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_transform_rotation)|lv.style, int|
set_transform_scale|[lv_style_set_transform_scale](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_transform_scale)|lv.style, int|
set_transform_scale_x|[lv_style_set_transform_scale_x](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_transform_scale_x)|lv.style, int|
set_transform_scale_y|[lv_style_set_transform_scale_y](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_transform_scale_y)|lv.style, int|
set_transform_skew_x|[lv_style_set_transform_skew_x](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_transform_skew_x)|lv.style, int|
set_transform_skew_y|[lv_style_set_transform_skew_y](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_transform_skew_y)|lv.style, int|
set_transform_width|[lv_style_set_transform_width](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_transform_width)|lv.style, int|
set_transform_zoom|[lv_style_set_transform_scale](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_transform_scale)|lv.style, int|
set_transition|[lv_style_set_transition](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_transition)|lv.style, lv.style_transition_dsc|
set_translate_x|[lv_style_set_translate_x](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_translate_x)|lv.style, int|
set_translate_y|[lv_style_set_translate_y](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_translate_y)|lv.style, int|
set_width|[lv_style_set_width](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_width)|lv.style, int|
set_x|[lv_style_set_x](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_x)|lv.style, int|
set_y|[lv_style_set_y](https://docs.lvgl.io/9.0/search.html?q=lv_style_set_y)|lv.style, int|

### class `lv.timer`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
del|[lv_timer_delete](https://docs.lvgl.io/9.0/search.html?q=lv_timer_delete)|lv.timer|
delete|[lv_timer_delete](https://docs.lvgl.io/9.0/search.html?q=lv_timer_delete)|lv.timer|
get_next|[lv_timer_get_next](https://docs.lvgl.io/9.0/search.html?q=lv_timer_get_next)|lv.timer|lv.timer
get_next|[lv_timer_get_next](https://docs.lvgl.io/9.0/search.html?q=lv_timer_get_next)|lv.timer|lv.timer
get_paused|[lv_timer_get_paused](https://docs.lvgl.io/9.0/search.html?q=lv_timer_get_paused)|lv.timer|b
get_user_data|[lv_timer_get_user_data](https://docs.lvgl.io/9.0/search.html?q=lv_timer_get_user_data)|lv.timer|c
pause|[lv_timer_pause](https://docs.lvgl.io/9.0/search.html?q=lv_timer_pause)|lv.timer|
ready|[lv_timer_ready](https://docs.lvgl.io/9.0/search.html?q=lv_timer_ready)|lv.timer|
remove|[lv_timer_delete](https://docs.lvgl.io/9.0/search.html?q=lv_timer_delete)|lv.timer|
reset|[lv_timer_reset](https://docs.lvgl.io/9.0/search.html?q=lv_timer_reset)|lv.timer|
resume|[lv_timer_resume](https://docs.lvgl.io/9.0/search.html?q=lv_timer_resume)|lv.timer|
set_auto_delete|[lv_timer_set_auto_delete](https://docs.lvgl.io/9.0/search.html?q=lv_timer_set_auto_delete)|lv.timer, bool|
set_cb|[lv_timer_set_cb](https://docs.lvgl.io/9.0/search.html?q=lv_timer_set_cb)|lv.timer, \<closure\>|
set_period|[lv_timer_set_period](https://docs.lvgl.io/9.0/search.html?q=lv_timer_set_period)|lv.timer, int|
set_repeat_count|[lv_timer_set_repeat_count](https://docs.lvgl.io/9.0/search.html?q=lv_timer_set_repeat_count)|lv.timer, int|
set_user_data|[lv_timer_set_user_data](https://docs.lvgl.io/9.0/search.html?q=lv_timer_set_user_data)|lv.timer, \<any\>|

## Widgets

### widget `lv.obj`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_event_cb|[lv_obj_add_event_cb](https://docs.lvgl.io/9.0/search.html?q=lv_obj_add_event_cb)|lv.obj, \<closure\>, int, \<any\>|
add_flag|[lv_obj_add_flag](https://docs.lvgl.io/9.0/search.html?q=lv_obj_add_flag)|lv.obj, int|
add_state|[lv_obj_add_state](https://docs.lvgl.io/9.0/search.html?q=lv_obj_add_state)|lv.obj, int|
add_style|[lv_obj_add_style](https://docs.lvgl.io/9.0/search.html?q=lv_obj_add_style)|lv.obj, lv.style, int|
align|[lv_obj_align](https://docs.lvgl.io/9.0/search.html?q=lv_obj_align)|lv.obj, int, int, int|
align_to|[lv_obj_align_to](https://docs.lvgl.io/9.0/search.html?q=lv_obj_align_to)|lv.obj, lv.obj, int, int, int|
allocate_spec_attr|[lv_obj_allocate_spec_attr](https://docs.lvgl.io/9.0/search.html?q=lv_obj_allocate_spec_attr)|lv.obj|
area_is_visible|[lv_obj_area_is_visible](https://docs.lvgl.io/9.0/search.html?q=lv_obj_area_is_visible)|lv.obj, lv.area|b
calculate_ext_draw_size|[lv_obj_calculate_ext_draw_size](https://docs.lvgl.io/9.0/search.html?q=lv_obj_calculate_ext_draw_size)|lv.obj, int|i
calculate_style_text_align|[lv_obj_calculate_style_text_align](https://docs.lvgl.io/9.0/search.html?q=lv_obj_calculate_style_text_align)|lv.obj, int, string|i
center|[lv_obj_center](https://docs.lvgl.io/9.0/search.html?q=lv_obj_center)|lv.obj|
check_type|[lv_obj_check_type](https://docs.lvgl.io/9.0/search.html?q=lv_obj_check_type)|lv.obj, lv.obj_class|b
class_init_obj|[lv_obj_class_init_obj](https://docs.lvgl.io/9.0/search.html?q=lv_obj_class_init_obj)|lv.obj|
clean|[lv_obj_clean](https://docs.lvgl.io/9.0/search.html?q=lv_obj_clean)|lv.obj|
clear_flag|[lv_obj_remove_flag](https://docs.lvgl.io/9.0/search.html?q=lv_obj_remove_flag)|lv.obj, int|
clear_state|[lv_obj_remove_state](https://docs.lvgl.io/9.0/search.html?q=lv_obj_remove_state)|lv.obj, int|
del|[lv_obj_delete](https://docs.lvgl.io/9.0/search.html?q=lv_obj_delete)|lv.obj|
del_async|[lv_obj_delete_async](https://docs.lvgl.io/9.0/search.html?q=lv_obj_delete_async)|lv.obj|
delete|[lv_obj_delete](https://docs.lvgl.io/9.0/search.html?q=lv_obj_delete)|lv.obj|
delete_async|[lv_obj_delete_async](https://docs.lvgl.io/9.0/search.html?q=lv_obj_delete_async)|lv.obj|
delete_delayed|[lv_obj_delete_delayed](https://docs.lvgl.io/9.0/search.html?q=lv_obj_delete_delayed)|lv.obj, int|
dump_tree|[lv_obj_dump_tree](https://docs.lvgl.io/9.0/search.html?q=lv_obj_dump_tree)|lv.obj|
fade_in|[lv_obj_fade_in](https://docs.lvgl.io/9.0/search.html?q=lv_obj_fade_in)|lv.obj, int, int|
fade_out|[lv_obj_fade_out](https://docs.lvgl.io/9.0/search.html?q=lv_obj_fade_out)|lv.obj, int, int|
free_id|[lv_obj_free_id](https://docs.lvgl.io/9.0/search.html?q=lv_obj_free_id)|lv.obj|
get_child|[lv_obj_get_child](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_child)|lv.obj, int|lv.obj
get_child_by_type|[lv_obj_get_child_by_type](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_child_by_type)|lv.obj, int, lv.obj_class|lv.obj
get_child_cnt|[lv_obj_get_child_count](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_child_count)|lv.obj|i
get_child_count|[lv_obj_get_child_count](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_child_count)|lv.obj|i
get_child_count_by_type|[lv_obj_get_child_count_by_type](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_child_count_by_type)|lv.obj, lv.obj_class|i
get_class|[lv_obj_get_class](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_class)|lv.obj|lv.obj_class
get_click_area|[lv_obj_get_click_area](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_click_area)|lv.obj, lv.area|
get_content_coords|[lv_obj_get_content_coords](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_content_coords)|lv.obj, lv.area|
get_content_height|[lv_obj_get_content_height](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_content_height)|lv.obj|i
get_content_width|[lv_obj_get_content_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_content_width)|lv.obj|i
get_coords|[lv_obj_get_coords](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_coords)|lv.obj, lv.area|
get_disp|[lv_obj_get_display](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_display)|lv.obj|lv.display
get_display|[lv_obj_get_display](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_display)|lv.obj|lv.display
get_event_count|[lv_obj_get_event_count](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_event_count)|lv.obj|i
get_group|[lv_obj_get_group](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_group)|lv.obj|lv.group
get_height|[lv_obj_get_height](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_height)|lv.obj|i
get_index|[lv_obj_get_index](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_index)|lv.obj|i
get_index_by_type|[lv_obj_get_index_by_type](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_index_by_type)|lv.obj, lv.obj_class|i
get_parent|[lv_obj_get_parent](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_parent)|lv.obj|lv.obj
get_screen|[lv_obj_get_screen](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_screen)|lv.obj|lv.obj
get_scroll_bottom|[lv_obj_get_scroll_bottom](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_scroll_bottom)|lv.obj|i
get_scroll_dir|[lv_obj_get_scroll_dir](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_scroll_dir)|lv.obj|i
get_scroll_end|[lv_obj_get_scroll_end](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_scroll_end)|lv.obj, comptr|
get_scroll_left|[lv_obj_get_scroll_left](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_scroll_left)|lv.obj|i
get_scroll_right|[lv_obj_get_scroll_right](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_scroll_right)|lv.obj|i
get_scroll_snap_x|[lv_obj_get_scroll_snap_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_scroll_snap_x)|lv.obj|i
get_scroll_snap_y|[lv_obj_get_scroll_snap_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_scroll_snap_y)|lv.obj|i
get_scroll_top|[lv_obj_get_scroll_top](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_scroll_top)|lv.obj|i
get_scroll_x|[lv_obj_get_scroll_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_scroll_x)|lv.obj|i
get_scroll_y|[lv_obj_get_scroll_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_scroll_y)|lv.obj|i
get_scrollbar_area|[lv_obj_get_scrollbar_area](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_scrollbar_area)|lv.obj, lv.area, lv.area|
get_scrollbar_mode|[lv_obj_get_scrollbar_mode](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_scrollbar_mode)|lv.obj|i
get_self_height|[lv_obj_get_self_height](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_self_height)|lv.obj|i
get_self_width|[lv_obj_get_self_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_self_width)|lv.obj|i
get_sibling|[lv_obj_get_sibling](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_sibling)|lv.obj, int|lv.obj
get_sibling_by_type|[lv_obj_get_sibling_by_type](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_sibling_by_type)|lv.obj, int, lv.obj_class|lv.obj
get_state|[lv_obj_get_state](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_state)|lv.obj|i
get_style_align|[lv_obj_get_style_align](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_align)|lv.obj, int|i
get_style_anim|[lv_obj_get_style_anim](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_anim)|lv.obj, int|lv.anim
get_style_anim_duration|[lv_obj_get_style_anim_duration](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_anim_duration)|lv.obj, int|i
get_style_anim_time|[lv_obj_get_style_anim_duration](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_anim_duration)|lv.obj, int|i
get_style_arc_color|[lv_obj_get_style_arc_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_arc_color)|lv.obj, int|lv.color
get_style_arc_color_filtered|[lv_obj_get_style_arc_color_filtered](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_arc_color_filtered)|lv.obj, int|lv.color
get_style_arc_image_src|[lv_obj_get_style_arc_image_src](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_arc_image_src)|lv.obj, int|c
get_style_arc_opa|[lv_obj_get_style_arc_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_arc_opa)|lv.obj, int|i
get_style_arc_rounded|[lv_obj_get_style_arc_rounded](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_arc_rounded)|lv.obj, int|b
get_style_arc_width|[lv_obj_get_style_arc_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_arc_width)|lv.obj, int|i
get_style_base_dir|[lv_obj_get_style_base_dir](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_base_dir)|lv.obj, int|i
get_style_bg_color|[lv_obj_get_style_bg_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_color)|lv.obj, int|lv.color
get_style_bg_color_filtered|[lv_obj_get_style_bg_color_filtered](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_color_filtered)|lv.obj, int|lv.color
get_style_bg_grad|[lv_obj_get_style_bg_grad](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_grad)|lv.obj, int|lv.grad_dsc
get_style_bg_grad_color|[lv_obj_get_style_bg_grad_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_grad_color)|lv.obj, int|lv.color
get_style_bg_grad_color_filtered|[lv_obj_get_style_bg_grad_color_filtered](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_grad_color_filtered)|lv.obj, int|lv.color
get_style_bg_grad_dir|[lv_obj_get_style_bg_grad_dir](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_grad_dir)|lv.obj, int|i
get_style_bg_grad_opa|[lv_obj_get_style_bg_grad_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_grad_opa)|lv.obj, int|i
get_style_bg_grad_stop|[lv_obj_get_style_bg_grad_stop](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_grad_stop)|lv.obj, int|i
get_style_bg_image_opa|[lv_obj_get_style_bg_image_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_image_opa)|lv.obj, int|i
get_style_bg_image_recolor|[lv_obj_get_style_bg_image_recolor](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_image_recolor)|lv.obj, int|lv.color
get_style_bg_image_recolor_filtered|[lv_obj_get_style_bg_image_recolor_filtered](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_image_recolor_filtered)|lv.obj, int|lv.color
get_style_bg_image_recolor_opa|[lv_obj_get_style_bg_image_recolor_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_image_recolor_opa)|lv.obj, int|i
get_style_bg_image_src|[lv_obj_get_style_bg_image_src](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_image_src)|lv.obj, int|c
get_style_bg_image_tiled|[lv_obj_get_style_bg_image_tiled](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_image_tiled)|lv.obj, int|b
get_style_bg_main_opa|[lv_obj_get_style_bg_main_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_main_opa)|lv.obj, int|i
get_style_bg_main_stop|[lv_obj_get_style_bg_main_stop](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_main_stop)|lv.obj, int|i
get_style_bg_opa|[lv_obj_get_style_bg_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_bg_opa)|lv.obj, int|i
get_style_blend_mode|[lv_obj_get_style_blend_mode](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_blend_mode)|lv.obj, int|i
get_style_border_color|[lv_obj_get_style_border_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_border_color)|lv.obj, int|lv.color
get_style_border_color_filtered|[lv_obj_get_style_border_color_filtered](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_border_color_filtered)|lv.obj, int|lv.color
get_style_border_opa|[lv_obj_get_style_border_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_border_opa)|lv.obj, int|i
get_style_border_post|[lv_obj_get_style_border_post](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_border_post)|lv.obj, int|b
get_style_border_side|[lv_obj_get_style_border_side](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_border_side)|lv.obj, int|i
get_style_border_width|[lv_obj_get_style_border_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_border_width)|lv.obj, int|i
get_style_clip_corner|[lv_obj_get_style_clip_corner](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_clip_corner)|lv.obj, int|b
get_style_color_filter_dsc|[lv_obj_get_style_color_filter_dsc](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_color_filter_dsc)|lv.obj, int|lv.color_filter_dsc
get_style_color_filter_opa|[lv_obj_get_style_color_filter_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_color_filter_opa)|lv.obj, int|i
get_style_flex_cross_place|[lv_obj_get_style_flex_cross_place](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_flex_cross_place)|lv.obj, int|i
get_style_flex_flow|[lv_obj_get_style_flex_flow](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_flex_flow)|lv.obj, int|i
get_style_flex_grow|[lv_obj_get_style_flex_grow](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_flex_grow)|lv.obj, int|i
get_style_flex_main_place|[lv_obj_get_style_flex_main_place](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_flex_main_place)|lv.obj, int|i
get_style_flex_track_place|[lv_obj_get_style_flex_track_place](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_flex_track_place)|lv.obj, int|i
get_style_grid_cell_column_pos|[lv_obj_get_style_grid_cell_column_pos](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_grid_cell_column_pos)|lv.obj, int|i
get_style_grid_cell_column_span|[lv_obj_get_style_grid_cell_column_span](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_grid_cell_column_span)|lv.obj, int|i
get_style_grid_cell_row_pos|[lv_obj_get_style_grid_cell_row_pos](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_grid_cell_row_pos)|lv.obj, int|i
get_style_grid_cell_row_span|[lv_obj_get_style_grid_cell_row_span](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_grid_cell_row_span)|lv.obj, int|i
get_style_grid_cell_x_align|[lv_obj_get_style_grid_cell_x_align](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_grid_cell_x_align)|lv.obj, int|i
get_style_grid_cell_y_align|[lv_obj_get_style_grid_cell_y_align](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_grid_cell_y_align)|lv.obj, int|i
get_style_grid_column_align|[lv_obj_get_style_grid_column_align](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_grid_column_align)|lv.obj, int|i
get_style_grid_column_dsc_array|[lv_obj_get_style_grid_column_dsc_array](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_grid_column_dsc_array)|lv.obj, int|lv.int_arr
get_style_grid_row_align|[lv_obj_get_style_grid_row_align](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_grid_row_align)|lv.obj, int|i
get_style_grid_row_dsc_array|[lv_obj_get_style_grid_row_dsc_array](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_grid_row_dsc_array)|lv.obj, int|lv.int_arr
get_style_height|[lv_obj_get_style_height](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_height)|lv.obj, int|i
get_style_image_opa|[lv_obj_get_style_image_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_image_opa)|lv.obj, int|i
get_style_image_recolor|[lv_obj_get_style_image_recolor](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_image_recolor)|lv.obj, int|lv.color
get_style_image_recolor_filtered|[lv_obj_get_style_image_recolor_filtered](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_image_recolor_filtered)|lv.obj, int|lv.color
get_style_image_recolor_opa|[lv_obj_get_style_image_recolor_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_image_recolor_opa)|lv.obj, int|i
get_style_img_opa|[lv_obj_get_style_image_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_image_opa)|lv.obj, int|i
get_style_img_recolor|[lv_obj_get_style_image_recolor](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_image_recolor)|lv.obj, int|lv.color
get_style_img_recolor_filtered|[lv_obj_get_style_image_recolor_filtered](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_image_recolor_filtered)|lv.obj, int|lv.color
get_style_img_recolor_opa|[lv_obj_get_style_image_recolor_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_image_recolor_opa)|lv.obj, int|i
get_style_layout|[lv_obj_get_style_layout](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_layout)|lv.obj, int|i
get_style_length|[lv_obj_get_style_length](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_length)|lv.obj, int|i
get_style_line_color|[lv_obj_get_style_line_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_line_color)|lv.obj, int|lv.color
get_style_line_color_filtered|[lv_obj_get_style_line_color_filtered](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_line_color_filtered)|lv.obj, int|lv.color
get_style_line_dash_gap|[lv_obj_get_style_line_dash_gap](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_line_dash_gap)|lv.obj, int|i
get_style_line_dash_width|[lv_obj_get_style_line_dash_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_line_dash_width)|lv.obj, int|i
get_style_line_opa|[lv_obj_get_style_line_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_line_opa)|lv.obj, int|i
get_style_line_rounded|[lv_obj_get_style_line_rounded](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_line_rounded)|lv.obj, int|b
get_style_line_width|[lv_obj_get_style_line_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_line_width)|lv.obj, int|i
get_style_margin_bottom|[lv_obj_get_style_margin_bottom](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_margin_bottom)|lv.obj, int|i
get_style_margin_left|[lv_obj_get_style_margin_left](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_margin_left)|lv.obj, int|i
get_style_margin_right|[lv_obj_get_style_margin_right](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_margin_right)|lv.obj, int|i
get_style_margin_top|[lv_obj_get_style_margin_top](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_margin_top)|lv.obj, int|i
get_style_max_height|[lv_obj_get_style_max_height](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_max_height)|lv.obj, int|i
get_style_max_width|[lv_obj_get_style_max_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_max_width)|lv.obj, int|i
get_style_min_height|[lv_obj_get_style_min_height](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_min_height)|lv.obj, int|i
get_style_min_width|[lv_obj_get_style_min_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_min_width)|lv.obj, int|i
get_style_opa|[lv_obj_get_style_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_opa)|lv.obj, int|i
get_style_opa_layered|[lv_obj_get_style_opa_layered](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_opa_layered)|lv.obj, int|i
get_style_opa_recursive|[lv_obj_get_style_opa_recursive](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_opa_recursive)|lv.obj, int|i
get_style_outline_color|[lv_obj_get_style_outline_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_outline_color)|lv.obj, int|lv.color
get_style_outline_color_filtered|[lv_obj_get_style_outline_color_filtered](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_outline_color_filtered)|lv.obj, int|lv.color
get_style_outline_opa|[lv_obj_get_style_outline_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_outline_opa)|lv.obj, int|i
get_style_outline_pad|[lv_obj_get_style_outline_pad](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_outline_pad)|lv.obj, int|i
get_style_outline_width|[lv_obj_get_style_outline_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_outline_width)|lv.obj, int|i
get_style_pad_bottom|[lv_obj_get_style_pad_bottom](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_pad_bottom)|lv.obj, int|i
get_style_pad_column|[lv_obj_get_style_pad_column](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_pad_column)|lv.obj, int|i
get_style_pad_left|[lv_obj_get_style_pad_left](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_pad_left)|lv.obj, int|i
get_style_pad_right|[lv_obj_get_style_pad_right](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_pad_right)|lv.obj, int|i
get_style_pad_row|[lv_obj_get_style_pad_row](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_pad_row)|lv.obj, int|i
get_style_pad_top|[lv_obj_get_style_pad_top](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_pad_top)|lv.obj, int|i
get_style_prop|[lv_obj_get_style_prop](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_prop)|lv.obj, int, int|i
get_style_radius|[lv_obj_get_style_radius](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_radius)|lv.obj, int|i
get_style_shadow_color|[lv_obj_get_style_shadow_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_shadow_color)|lv.obj, int|lv.color
get_style_shadow_color_filtered|[lv_obj_get_style_shadow_color_filtered](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_shadow_color_filtered)|lv.obj, int|lv.color
get_style_shadow_offset_x|[lv_obj_get_style_shadow_offset_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_shadow_offset_x)|lv.obj, int|i
get_style_shadow_offset_y|[lv_obj_get_style_shadow_offset_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_shadow_offset_y)|lv.obj, int|i
get_style_shadow_ofs_x|[lv_obj_get_style_shadow_offset_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_shadow_offset_x)|lv.obj, int|i
get_style_shadow_ofs_y|[lv_obj_get_style_shadow_offset_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_shadow_offset_y)|lv.obj, int|i
get_style_shadow_opa|[lv_obj_get_style_shadow_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_shadow_opa)|lv.obj, int|i
get_style_shadow_spread|[lv_obj_get_style_shadow_spread](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_shadow_spread)|lv.obj, int|i
get_style_shadow_width|[lv_obj_get_style_shadow_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_shadow_width)|lv.obj, int|i
get_style_space_bottom|[lv_obj_get_style_space_bottom](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_space_bottom)|lv.obj, int|i
get_style_space_left|[lv_obj_get_style_space_left](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_space_left)|lv.obj, int|i
get_style_space_right|[lv_obj_get_style_space_right](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_space_right)|lv.obj, int|i
get_style_space_top|[lv_obj_get_style_space_top](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_space_top)|lv.obj, int|i
get_style_text_align|[lv_obj_get_style_text_align](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_text_align)|lv.obj, int|i
get_style_text_color|[lv_obj_get_style_text_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_text_color)|lv.obj, int|lv.color
get_style_text_color_filtered|[lv_obj_get_style_text_color_filtered](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_text_color_filtered)|lv.obj, int|lv.color
get_style_text_decor|[lv_obj_get_style_text_decor](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_text_decor)|lv.obj, int|i
get_style_text_font|[lv_obj_get_style_text_font](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_text_font)|lv.obj, int|lv.font
get_style_text_letter_space|[lv_obj_get_style_text_letter_space](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_text_letter_space)|lv.obj, int|i
get_style_text_line_space|[lv_obj_get_style_text_line_space](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_text_line_space)|lv.obj, int|i
get_style_text_opa|[lv_obj_get_style_text_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_text_opa)|lv.obj, int|i
get_style_transform_angle|[lv_obj_get_style_transform_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_transform_rotation)|lv.obj, int|i
get_style_transform_height|[lv_obj_get_style_transform_height](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_transform_height)|lv.obj, int|i
get_style_transform_pivot_x|[lv_obj_get_style_transform_pivot_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_transform_pivot_x)|lv.obj, int|i
get_style_transform_pivot_y|[lv_obj_get_style_transform_pivot_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_transform_pivot_y)|lv.obj, int|i
get_style_transform_rotation|[lv_obj_get_style_transform_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_transform_rotation)|lv.obj, int|i
get_style_transform_scale_x|[lv_obj_get_style_transform_scale_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_transform_scale_x)|lv.obj, int|i
get_style_transform_scale_x_safe|[lv_obj_get_style_transform_scale_x_safe](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_transform_scale_x_safe)|lv.obj, int|i
get_style_transform_scale_y|[lv_obj_get_style_transform_scale_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_transform_scale_y)|lv.obj, int|i
get_style_transform_scale_y_safe|[lv_obj_get_style_transform_scale_y_safe](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_transform_scale_y_safe)|lv.obj, int|i
get_style_transform_skew_x|[lv_obj_get_style_transform_skew_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_transform_skew_x)|lv.obj, int|i
get_style_transform_skew_y|[lv_obj_get_style_transform_skew_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_transform_skew_y)|lv.obj, int|i
get_style_transform_width|[lv_obj_get_style_transform_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_transform_width)|lv.obj, int|i
get_style_transition|[lv_obj_get_style_transition](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_transition)|lv.obj, int|lv.style_transition_dsc
get_style_translate_x|[lv_obj_get_style_translate_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_translate_x)|lv.obj, int|i
get_style_translate_y|[lv_obj_get_style_translate_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_translate_y)|lv.obj, int|i
get_style_width|[lv_obj_get_style_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_width)|lv.obj, int|i
get_style_x|[lv_obj_get_style_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_x)|lv.obj, int|i
get_style_y|[lv_obj_get_style_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_style_y)|lv.obj, int|i
get_transformed_area|[lv_obj_get_transformed_area](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_transformed_area)|lv.obj, lv.area, bool, bool|
get_user_data|[lv_obj_get_user_data](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_user_data)|lv.obj|c
get_width|[lv_obj_get_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_width)|lv.obj|i
get_width|[lv_obj_get_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_width)|lv.obj|i
get_x|[lv_obj_get_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_x)|lv.obj|i
get_x2|[lv_obj_get_x2](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_x2)|lv.obj|i
get_x_aligned|[lv_obj_get_x_aligned](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_x_aligned)|lv.obj|i
get_y|[lv_obj_get_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_y)|lv.obj|i
get_y2|[lv_obj_get_y2](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_y2)|lv.obj|i
get_y_aligned|[lv_obj_get_y_aligned](https://docs.lvgl.io/9.0/search.html?q=lv_obj_get_y_aligned)|lv.obj|i
has_class|[lv_obj_has_class](https://docs.lvgl.io/9.0/search.html?q=lv_obj_has_class)|lv.obj, lv.obj_class|b
has_flag|[lv_obj_has_flag](https://docs.lvgl.io/9.0/search.html?q=lv_obj_has_flag)|lv.obj, int|b
has_flag_any|[lv_obj_has_flag_any](https://docs.lvgl.io/9.0/search.html?q=lv_obj_has_flag_any)|lv.obj, int|b
has_state|[lv_obj_has_state](https://docs.lvgl.io/9.0/search.html?q=lv_obj_has_state)|lv.obj, int|b
has_style_prop|[lv_obj_has_style_prop](https://docs.lvgl.io/9.0/search.html?q=lv_obj_has_style_prop)|lv.obj, int, int|b
hit_test|[lv_obj_hit_test](https://docs.lvgl.io/9.0/search.html?q=lv_obj_hit_test)|lv.obj, comptr|b
init_draw_arc_dsc|[lv_obj_init_draw_arc_dsc](https://docs.lvgl.io/9.0/search.html?q=lv_obj_init_draw_arc_dsc)|lv.obj, int, lv.draw_arc_dsc|
init_draw_image_dsc|[lv_obj_init_draw_image_dsc](https://docs.lvgl.io/9.0/search.html?q=lv_obj_init_draw_image_dsc)|lv.obj, int, lv.draw_image_dsc|
init_draw_label_dsc|[lv_obj_init_draw_label_dsc](https://docs.lvgl.io/9.0/search.html?q=lv_obj_init_draw_label_dsc)|lv.obj, int, lv.draw_label_dsc|
init_draw_line_dsc|[lv_obj_init_draw_line_dsc](https://docs.lvgl.io/9.0/search.html?q=lv_obj_init_draw_line_dsc)|lv.obj, int, lv.draw_line_dsc|
init_draw_rect_dsc|[lv_obj_init_draw_rect_dsc](https://docs.lvgl.io/9.0/search.html?q=lv_obj_init_draw_rect_dsc)|lv.obj, int, lv.draw_rect_dsc|
invalidate|[lv_obj_invalidate](https://docs.lvgl.io/9.0/search.html?q=lv_obj_invalidate)|lv.obj|
invalidate_area|[lv_obj_invalidate_area](https://docs.lvgl.io/9.0/search.html?q=lv_obj_invalidate_area)|lv.obj, lv.area|
is_editable|[lv_obj_is_editable](https://docs.lvgl.io/9.0/search.html?q=lv_obj_is_editable)|lv.obj|b
is_group_def|[lv_obj_is_group_def](https://docs.lvgl.io/9.0/search.html?q=lv_obj_is_group_def)|lv.obj|b
is_layout_positioned|[lv_obj_is_layout_positioned](https://docs.lvgl.io/9.0/search.html?q=lv_obj_is_layout_positioned)|lv.obj|b
is_scrolling|[lv_obj_is_scrolling](https://docs.lvgl.io/9.0/search.html?q=lv_obj_is_scrolling)|lv.obj|b
is_valid|[lv_obj_is_valid](https://docs.lvgl.io/9.0/search.html?q=lv_obj_is_valid)|lv.obj|b
is_visible|[lv_obj_is_visible](https://docs.lvgl.io/9.0/search.html?q=lv_obj_is_visible)|lv.obj|b
mark_layout_as_dirty|[lv_obj_mark_layout_as_dirty](https://docs.lvgl.io/9.0/search.html?q=lv_obj_mark_layout_as_dirty)|lv.obj|
move_background|[lv_obj_move_background](https://docs.lvgl.io/9.0/search.html?q=lv_obj_move_background)|lv.obj|
move_children_by|[lv_obj_move_children_by](https://docs.lvgl.io/9.0/search.html?q=lv_obj_move_children_by)|lv.obj, int, int, bool|
move_foreground|[lv_obj_move_foreground](https://docs.lvgl.io/9.0/search.html?q=lv_obj_move_foreground)|lv.obj|
move_to|[lv_obj_move_to](https://docs.lvgl.io/9.0/search.html?q=lv_obj_move_to)|lv.obj, int, int|
move_to_index|[lv_obj_move_to_index](https://docs.lvgl.io/9.0/search.html?q=lv_obj_move_to_index)|lv.obj, int|
readjust_scroll|[lv_obj_readjust_scroll](https://docs.lvgl.io/9.0/search.html?q=lv_obj_readjust_scroll)|lv.obj, int|
refr_pos|[lv_obj_refr_pos](https://docs.lvgl.io/9.0/search.html?q=lv_obj_refr_pos)|lv.obj|
refr_size|[lv_obj_refr_size](https://docs.lvgl.io/9.0/search.html?q=lv_obj_refr_size)|lv.obj|b
refresh_ext_draw_size|[lv_obj_refresh_ext_draw_size](https://docs.lvgl.io/9.0/search.html?q=lv_obj_refresh_ext_draw_size)|lv.obj|
refresh_self_size|[lv_obj_refresh_self_size](https://docs.lvgl.io/9.0/search.html?q=lv_obj_refresh_self_size)|lv.obj|b
refresh_style|[lv_obj_refresh_style](https://docs.lvgl.io/9.0/search.html?q=lv_obj_refresh_style)|lv.obj, int, int|
remove|[lv_obj_delete](https://docs.lvgl.io/9.0/search.html?q=lv_obj_delete)|lv.obj|
remove_event|[lv_obj_remove_event](https://docs.lvgl.io/9.0/search.html?q=lv_obj_remove_event)|lv.obj, int|b
remove_event_cb|[lv_obj_remove_event_cb](https://docs.lvgl.io/9.0/search.html?q=lv_obj_remove_event_cb)|lv.obj, \<any\>|b
remove_event_cb_with_user_data|[lv_obj_remove_event_cb_with_user_data](https://docs.lvgl.io/9.0/search.html?q=lv_obj_remove_event_cb_with_user_data)|lv.obj, \<any\>, \<any\>|i
remove_flag|[lv_obj_remove_flag](https://docs.lvgl.io/9.0/search.html?q=lv_obj_remove_flag)|lv.obj, int|
remove_local_style_prop|[lv_obj_remove_local_style_prop](https://docs.lvgl.io/9.0/search.html?q=lv_obj_remove_local_style_prop)|lv.obj, int, int|b
remove_state|[lv_obj_remove_state](https://docs.lvgl.io/9.0/search.html?q=lv_obj_remove_state)|lv.obj, int|
remove_style|[lv_obj_remove_style](https://docs.lvgl.io/9.0/search.html?q=lv_obj_remove_style)|lv.obj, lv.style, int|
remove_style_all|[lv_obj_remove_style_all](https://docs.lvgl.io/9.0/search.html?q=lv_obj_remove_style_all)|lv.obj|
replace_style|[lv_obj_replace_style](https://docs.lvgl.io/9.0/search.html?q=lv_obj_replace_style)|lv.obj, lv.style, lv.style, int|b
scroll_by|[lv_obj_scroll_by](https://docs.lvgl.io/9.0/search.html?q=lv_obj_scroll_by)|lv.obj, int, int, int|
scroll_by_bounded|[lv_obj_scroll_by_bounded](https://docs.lvgl.io/9.0/search.html?q=lv_obj_scroll_by_bounded)|lv.obj, int, int, int|
scroll_to|[lv_obj_scroll_to](https://docs.lvgl.io/9.0/search.html?q=lv_obj_scroll_to)|lv.obj, int, int, int|
scroll_to_view|[lv_obj_scroll_to_view](https://docs.lvgl.io/9.0/search.html?q=lv_obj_scroll_to_view)|lv.obj, int|
scroll_to_view_recursive|[lv_obj_scroll_to_view_recursive](https://docs.lvgl.io/9.0/search.html?q=lv_obj_scroll_to_view_recursive)|lv.obj, int|
scroll_to_x|[lv_obj_scroll_to_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_scroll_to_x)|lv.obj, int, int|
scroll_to_y|[lv_obj_scroll_to_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_scroll_to_y)|lv.obj, int, int|
scrollbar_invalidate|[lv_obj_scrollbar_invalidate](https://docs.lvgl.io/9.0/search.html?q=lv_obj_scrollbar_invalidate)|lv.obj|
send_event|[lv_obj_send_event](https://docs.lvgl.io/9.0/search.html?q=lv_obj_send_event)|lv.obj, int, \<any\>|i
send_event|[lv_obj_send_event](https://docs.lvgl.io/9.0/search.html?q=lv_obj_send_event)|lv.obj, int, \<any\>|i
set_align|[lv_obj_set_align](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_align)|lv.obj, int|
set_content_height|[lv_obj_set_content_height](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_content_height)|lv.obj, int|
set_content_width|[lv_obj_set_content_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_content_width)|lv.obj, int|
set_ext_click_area|[lv_obj_set_ext_click_area](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_ext_click_area)|lv.obj, int|
set_height|[lv_obj_set_height](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_height)|lv.obj, int|
set_layout|[lv_obj_set_layout](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_layout)|lv.obj, int|
set_local_style_prop|[lv_obj_set_local_style_prop](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_local_style_prop)|lv.obj, int, int, int|
set_parent|[lv_obj_set_parent](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_parent)|lv.obj, lv.obj|
set_pos|[lv_obj_set_pos](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_pos)|lv.obj, int, int|
set_scroll_dir|[lv_obj_set_scroll_dir](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_scroll_dir)|lv.obj, int|
set_scroll_snap_x|[lv_obj_set_scroll_snap_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_scroll_snap_x)|lv.obj, int|
set_scroll_snap_y|[lv_obj_set_scroll_snap_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_scroll_snap_y)|lv.obj, int|
set_scrollbar_mode|[lv_obj_set_scrollbar_mode](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_scrollbar_mode)|lv.obj, int|
set_size|[lv_obj_set_size](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_size)|lv.obj, int, int|
set_state|[lv_obj_set_state](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_state)|lv.obj, int, bool|
set_style_align|[lv_obj_set_style_align](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_align)|lv.obj, int, int|
set_style_anim|[lv_obj_set_style_anim](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_anim)|lv.obj, lv.anim, int|
set_style_anim_duration|[lv_obj_set_style_anim_duration](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_anim_duration)|lv.obj, int, int|
set_style_anim_time|[lv_obj_set_style_anim_duration](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_anim_duration)|lv.obj, int, int|
set_style_arc_color|[lv_obj_set_style_arc_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_arc_color)|lv.obj, lv.color, int|
set_style_arc_image_src|[lv_obj_set_style_arc_image_src](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_arc_image_src)|lv.obj, \<any\>, int|
set_style_arc_opa|[lv_obj_set_style_arc_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_arc_opa)|lv.obj, int, int|
set_style_arc_rounded|[lv_obj_set_style_arc_rounded](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_arc_rounded)|lv.obj, bool, int|
set_style_arc_width|[lv_obj_set_style_arc_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_arc_width)|lv.obj, int, int|
set_style_base_dir|[lv_obj_set_style_base_dir](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_base_dir)|lv.obj, int, int|
set_style_bg_color|[lv_obj_set_style_bg_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_bg_color)|lv.obj, lv.color, int|
set_style_bg_grad|[lv_obj_set_style_bg_grad](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_bg_grad)|lv.obj, lv.grad_dsc, int|
set_style_bg_grad_color|[lv_obj_set_style_bg_grad_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_bg_grad_color)|lv.obj, lv.color, int|
set_style_bg_grad_dir|[lv_obj_set_style_bg_grad_dir](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_bg_grad_dir)|lv.obj, int, int|
set_style_bg_grad_opa|[lv_obj_set_style_bg_grad_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_bg_grad_opa)|lv.obj, int, int|
set_style_bg_grad_stop|[lv_obj_set_style_bg_grad_stop](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_bg_grad_stop)|lv.obj, int, int|
set_style_bg_image_opa|[lv_obj_set_style_bg_image_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_bg_image_opa)|lv.obj, int, int|
set_style_bg_image_recolor|[lv_obj_set_style_bg_image_recolor](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_bg_image_recolor)|lv.obj, lv.color, int|
set_style_bg_image_recolor_opa|[lv_obj_set_style_bg_image_recolor_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_bg_image_recolor_opa)|lv.obj, int, int|
set_style_bg_image_src|[lv_obj_set_style_bg_image_src](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_bg_image_src)|lv.obj, \<any\>, int|
set_style_bg_image_tiled|[lv_obj_set_style_bg_image_tiled](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_bg_image_tiled)|lv.obj, bool, int|
set_style_bg_main_opa|[lv_obj_set_style_bg_main_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_bg_main_opa)|lv.obj, int, int|
set_style_bg_main_stop|[lv_obj_set_style_bg_main_stop](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_bg_main_stop)|lv.obj, int, int|
set_style_bg_opa|[lv_obj_set_style_bg_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_bg_opa)|lv.obj, int, int|
set_style_blend_mode|[lv_obj_set_style_blend_mode](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_blend_mode)|lv.obj, int, int|
set_style_border_color|[lv_obj_set_style_border_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_border_color)|lv.obj, lv.color, int|
set_style_border_opa|[lv_obj_set_style_border_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_border_opa)|lv.obj, int, int|
set_style_border_post|[lv_obj_set_style_border_post](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_border_post)|lv.obj, bool, int|
set_style_border_side|[lv_obj_set_style_border_side](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_border_side)|lv.obj, int, int|
set_style_border_width|[lv_obj_set_style_border_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_border_width)|lv.obj, int, int|
set_style_clip_corner|[lv_obj_set_style_clip_corner](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_clip_corner)|lv.obj, bool, int|
set_style_color_filter_dsc|[lv_obj_set_style_color_filter_dsc](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_color_filter_dsc)|lv.obj, lv.color_filter_dsc, int|
set_style_color_filter_opa|[lv_obj_set_style_color_filter_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_color_filter_opa)|lv.obj, int, int|
set_style_flex_cross_place|[lv_obj_set_style_flex_cross_place](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_flex_cross_place)|lv.obj, int, int|
set_style_flex_flow|[lv_obj_set_style_flex_flow](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_flex_flow)|lv.obj, int, int|
set_style_flex_grow|[lv_obj_set_style_flex_grow](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_flex_grow)|lv.obj, int, int|
set_style_flex_main_place|[lv_obj_set_style_flex_main_place](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_flex_main_place)|lv.obj, int, int|
set_style_flex_track_place|[lv_obj_set_style_flex_track_place](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_flex_track_place)|lv.obj, int, int|
set_style_grid_cell_column_pos|[lv_obj_set_style_grid_cell_column_pos](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_grid_cell_column_pos)|lv.obj, int, int|
set_style_grid_cell_column_span|[lv_obj_set_style_grid_cell_column_span](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_grid_cell_column_span)|lv.obj, int, int|
set_style_grid_cell_row_pos|[lv_obj_set_style_grid_cell_row_pos](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_grid_cell_row_pos)|lv.obj, int, int|
set_style_grid_cell_row_span|[lv_obj_set_style_grid_cell_row_span](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_grid_cell_row_span)|lv.obj, int, int|
set_style_grid_cell_x_align|[lv_obj_set_style_grid_cell_x_align](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_grid_cell_x_align)|lv.obj, int, int|
set_style_grid_cell_y_align|[lv_obj_set_style_grid_cell_y_align](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_grid_cell_y_align)|lv.obj, int, int|
set_style_grid_column_align|[lv_obj_set_style_grid_column_align](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_grid_column_align)|lv.obj, int, int|
set_style_grid_column_dsc_array|[lv_obj_set_style_grid_column_dsc_array](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_grid_column_dsc_array)|lv.obj, lv.int_arr, int|
set_style_grid_row_align|[lv_obj_set_style_grid_row_align](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_grid_row_align)|lv.obj, int, int|
set_style_grid_row_dsc_array|[lv_obj_set_style_grid_row_dsc_array](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_grid_row_dsc_array)|lv.obj, lv.int_arr, int|
set_style_height|[lv_obj_set_style_height](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_height)|lv.obj, int, int|
set_style_image_opa|[lv_obj_set_style_image_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_image_opa)|lv.obj, int, int|
set_style_image_recolor|[lv_obj_set_style_image_recolor](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_image_recolor)|lv.obj, lv.color, int|
set_style_image_recolor_opa|[lv_obj_set_style_image_recolor_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_image_recolor_opa)|lv.obj, int, int|
set_style_img_opa|[lv_obj_set_style_image_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_image_opa)|lv.obj, int, int|
set_style_img_recolor|[lv_obj_set_style_image_recolor](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_image_recolor)|lv.obj, lv.color, int|
set_style_img_recolor_opa|[lv_obj_set_style_image_recolor_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_image_recolor_opa)|lv.obj, int, int|
set_style_layout|[lv_obj_set_style_layout](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_layout)|lv.obj, int, int|
set_style_length|[lv_obj_set_style_length](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_length)|lv.obj, int, int|
set_style_line_color|[lv_obj_set_style_line_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_line_color)|lv.obj, lv.color, int|
set_style_line_dash_gap|[lv_obj_set_style_line_dash_gap](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_line_dash_gap)|lv.obj, int, int|
set_style_line_dash_width|[lv_obj_set_style_line_dash_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_line_dash_width)|lv.obj, int, int|
set_style_line_opa|[lv_obj_set_style_line_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_line_opa)|lv.obj, int, int|
set_style_line_rounded|[lv_obj_set_style_line_rounded](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_line_rounded)|lv.obj, bool, int|
set_style_line_width|[lv_obj_set_style_line_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_line_width)|lv.obj, int, int|
set_style_margin_all|[lv_obj_set_style_margin_all](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_margin_all)|lv.obj, int, int|
set_style_margin_bottom|[lv_obj_set_style_margin_bottom](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_margin_bottom)|lv.obj, int, int|
set_style_margin_hor|[lv_obj_set_style_margin_hor](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_margin_hor)|lv.obj, int, int|
set_style_margin_left|[lv_obj_set_style_margin_left](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_margin_left)|lv.obj, int, int|
set_style_margin_right|[lv_obj_set_style_margin_right](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_margin_right)|lv.obj, int, int|
set_style_margin_top|[lv_obj_set_style_margin_top](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_margin_top)|lv.obj, int, int|
set_style_margin_ver|[lv_obj_set_style_margin_ver](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_margin_ver)|lv.obj, int, int|
set_style_max_height|[lv_obj_set_style_max_height](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_max_height)|lv.obj, int, int|
set_style_max_width|[lv_obj_set_style_max_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_max_width)|lv.obj, int, int|
set_style_min_height|[lv_obj_set_style_min_height](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_min_height)|lv.obj, int, int|
set_style_min_width|[lv_obj_set_style_min_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_min_width)|lv.obj, int, int|
set_style_opa|[lv_obj_set_style_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_opa)|lv.obj, int, int|
set_style_opa_layered|[lv_obj_set_style_opa_layered](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_opa_layered)|lv.obj, int, int|
set_style_outline_color|[lv_obj_set_style_outline_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_outline_color)|lv.obj, lv.color, int|
set_style_outline_opa|[lv_obj_set_style_outline_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_outline_opa)|lv.obj, int, int|
set_style_outline_pad|[lv_obj_set_style_outline_pad](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_outline_pad)|lv.obj, int, int|
set_style_outline_width|[lv_obj_set_style_outline_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_outline_width)|lv.obj, int, int|
set_style_pad_all|[lv_obj_set_style_pad_all](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_pad_all)|lv.obj, int, int|
set_style_pad_bottom|[lv_obj_set_style_pad_bottom](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_pad_bottom)|lv.obj, int, int|
set_style_pad_column|[lv_obj_set_style_pad_column](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_pad_column)|lv.obj, int, int|
set_style_pad_gap|[lv_obj_set_style_pad_gap](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_pad_gap)|lv.obj, int, int|
set_style_pad_hor|[lv_obj_set_style_pad_hor](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_pad_hor)|lv.obj, int, int|
set_style_pad_left|[lv_obj_set_style_pad_left](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_pad_left)|lv.obj, int, int|
set_style_pad_right|[lv_obj_set_style_pad_right](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_pad_right)|lv.obj, int, int|
set_style_pad_row|[lv_obj_set_style_pad_row](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_pad_row)|lv.obj, int, int|
set_style_pad_top|[lv_obj_set_style_pad_top](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_pad_top)|lv.obj, int, int|
set_style_pad_ver|[lv_obj_set_style_pad_ver](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_pad_ver)|lv.obj, int, int|
set_style_radius|[lv_obj_set_style_radius](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_radius)|lv.obj, int, int|
set_style_shadow_color|[lv_obj_set_style_shadow_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_shadow_color)|lv.obj, lv.color, int|
set_style_shadow_offset_x|[lv_obj_set_style_shadow_offset_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_shadow_offset_x)|lv.obj, int, int|
set_style_shadow_offset_y|[lv_obj_set_style_shadow_offset_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_shadow_offset_y)|lv.obj, int, int|
set_style_shadow_ofs_x|[lv_obj_set_style_shadow_offset_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_shadow_offset_x)|lv.obj, int, int|
set_style_shadow_ofs_y|[lv_obj_set_style_shadow_offset_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_shadow_offset_y)|lv.obj, int, int|
set_style_shadow_opa|[lv_obj_set_style_shadow_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_shadow_opa)|lv.obj, int, int|
set_style_shadow_spread|[lv_obj_set_style_shadow_spread](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_shadow_spread)|lv.obj, int, int|
set_style_shadow_width|[lv_obj_set_style_shadow_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_shadow_width)|lv.obj, int, int|
set_style_size|[lv_obj_set_style_size](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_size)|lv.obj, int, int, int|
set_style_text_align|[lv_obj_set_style_text_align](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_text_align)|lv.obj, int, int|
set_style_text_color|[lv_obj_set_style_text_color](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_text_color)|lv.obj, lv.color, int|
set_style_text_decor|[lv_obj_set_style_text_decor](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_text_decor)|lv.obj, int, int|
set_style_text_font|[lv_obj_set_style_text_font](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_text_font)|lv.obj, lv.font, int|
set_style_text_letter_space|[lv_obj_set_style_text_letter_space](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_text_letter_space)|lv.obj, int, int|
set_style_text_line_space|[lv_obj_set_style_text_line_space](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_text_line_space)|lv.obj, int, int|
set_style_text_opa|[lv_obj_set_style_text_opa](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_text_opa)|lv.obj, int, int|
set_style_transform_angle|[lv_obj_set_style_transform_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_transform_rotation)|lv.obj, int, int|
set_style_transform_height|[lv_obj_set_style_transform_height](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_transform_height)|lv.obj, int, int|
set_style_transform_pivot_x|[lv_obj_set_style_transform_pivot_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_transform_pivot_x)|lv.obj, int, int|
set_style_transform_pivot_y|[lv_obj_set_style_transform_pivot_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_transform_pivot_y)|lv.obj, int, int|
set_style_transform_rotation|[lv_obj_set_style_transform_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_transform_rotation)|lv.obj, int, int|
set_style_transform_scale|[lv_obj_set_style_transform_scale](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_transform_scale)|lv.obj, int, int|
set_style_transform_scale_x|[lv_obj_set_style_transform_scale_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_transform_scale_x)|lv.obj, int, int|
set_style_transform_scale_y|[lv_obj_set_style_transform_scale_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_transform_scale_y)|lv.obj, int, int|
set_style_transform_skew_x|[lv_obj_set_style_transform_skew_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_transform_skew_x)|lv.obj, int, int|
set_style_transform_skew_y|[lv_obj_set_style_transform_skew_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_transform_skew_y)|lv.obj, int, int|
set_style_transform_width|[lv_obj_set_style_transform_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_transform_width)|lv.obj, int, int|
set_style_transform_zoom|[lv_obj_set_style_transform_scale](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_transform_scale)|lv.obj, int, int|
set_style_transition|[lv_obj_set_style_transition](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_transition)|lv.obj, lv.style_transition_dsc, int|
set_style_translate_x|[lv_obj_set_style_translate_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_translate_x)|lv.obj, int, int|
set_style_translate_y|[lv_obj_set_style_translate_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_translate_y)|lv.obj, int, int|
set_style_width|[lv_obj_set_style_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_width)|lv.obj, int, int|
set_style_x|[lv_obj_set_style_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_x)|lv.obj, int, int|
set_style_y|[lv_obj_set_style_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_style_y)|lv.obj, int, int|
set_user_data|[lv_obj_set_user_data](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_user_data)|lv.obj, \<any\>|
set_width|[lv_obj_set_width](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_width)|lv.obj, int|
set_x|[lv_obj_set_x](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_x)|lv.obj, int|
set_y|[lv_obj_set_y](https://docs.lvgl.io/9.0/search.html?q=lv_obj_set_y)|lv.obj, int|
stringify_id|[lv_obj_stringify_id](https://docs.lvgl.io/9.0/search.html?q=lv_obj_stringify_id)|lv.obj, comptr, int|s
swap|[lv_obj_swap](https://docs.lvgl.io/9.0/search.html?q=lv_obj_swap)|lv.obj, lv.obj|
transform_point|[lv_obj_transform_point](https://docs.lvgl.io/9.0/search.html?q=lv_obj_transform_point)|lv.obj, comptr, bool, bool|
update_flag|[lv_obj_update_flag](https://docs.lvgl.io/9.0/search.html?q=lv_obj_update_flag)|lv.obj, int, bool|
update_layout|[lv_obj_update_layout](https://docs.lvgl.io/9.0/search.html?q=lv_obj_update_layout)|lv.obj|
update_snap|[lv_obj_update_snap](https://docs.lvgl.io/9.0/search.html?q=lv_obj_update_snap)|lv.obj, int|

### widget `lv.arc`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
align_obj_to_angle|[lv_arc_align_obj_to_angle](https://docs.lvgl.io/9.0/search.html?q=lv_arc_align_obj_to_angle)|lv.obj, lv.obj, int|
get_angle|[lv_arc_get_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_arc_get_rotation)|lv.obj|i
get_angle_end|[lv_arc_get_angle_end](https://docs.lvgl.io/9.0/search.html?q=lv_arc_get_angle_end)|lv.obj|i
get_angle_start|[lv_arc_get_angle_start](https://docs.lvgl.io/9.0/search.html?q=lv_arc_get_angle_start)|lv.obj|i
get_bg_angle_end|[lv_arc_get_bg_angle_end](https://docs.lvgl.io/9.0/search.html?q=lv_arc_get_bg_angle_end)|lv.obj|i
get_bg_angle_start|[lv_arc_get_bg_angle_start](https://docs.lvgl.io/9.0/search.html?q=lv_arc_get_bg_angle_start)|lv.obj|i
get_knob_offset|[lv_arc_get_knob_offset](https://docs.lvgl.io/9.0/search.html?q=lv_arc_get_knob_offset)|lv.obj|i
get_max_value|[lv_arc_get_max_value](https://docs.lvgl.io/9.0/search.html?q=lv_arc_get_max_value)|lv.obj|i
get_min_value|[lv_arc_get_min_value](https://docs.lvgl.io/9.0/search.html?q=lv_arc_get_min_value)|lv.obj|i
get_mode|[lv_arc_get_mode](https://docs.lvgl.io/9.0/search.html?q=lv_arc_get_mode)|lv.obj|i
get_rotation|[lv_arc_get_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_arc_get_rotation)|lv.obj|i
get_rotation|[lv_arc_get_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_arc_get_rotation)|lv.obj|i
get_value|[lv_arc_get_value](https://docs.lvgl.io/9.0/search.html?q=lv_arc_get_value)|lv.obj|i
rotate_obj_to_angle|[lv_arc_rotate_obj_to_angle](https://docs.lvgl.io/9.0/search.html?q=lv_arc_rotate_obj_to_angle)|lv.obj, lv.obj, int|
set_angle|[lv_arc_set_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_arc_set_rotation)|lv.obj, int|
set_angles|[lv_arc_set_angles](https://docs.lvgl.io/9.0/search.html?q=lv_arc_set_angles)|lv.obj, int, int|
set_bg_angles|[lv_arc_set_bg_angles](https://docs.lvgl.io/9.0/search.html?q=lv_arc_set_bg_angles)|lv.obj, int, int|
set_bg_end_angle|[lv_arc_set_bg_end_angle](https://docs.lvgl.io/9.0/search.html?q=lv_arc_set_bg_end_angle)|lv.obj, int|
set_bg_start_angle|[lv_arc_set_bg_start_angle](https://docs.lvgl.io/9.0/search.html?q=lv_arc_set_bg_start_angle)|lv.obj, int|
set_change_rate|[lv_arc_set_change_rate](https://docs.lvgl.io/9.0/search.html?q=lv_arc_set_change_rate)|lv.obj, int|
set_end_angle|[lv_arc_set_end_angle](https://docs.lvgl.io/9.0/search.html?q=lv_arc_set_end_angle)|lv.obj, int|
set_knob_offset|[lv_arc_set_knob_offset](https://docs.lvgl.io/9.0/search.html?q=lv_arc_set_knob_offset)|lv.obj, int|
set_mode|[lv_arc_set_mode](https://docs.lvgl.io/9.0/search.html?q=lv_arc_set_mode)|lv.obj, int|
set_range|[lv_arc_set_range](https://docs.lvgl.io/9.0/search.html?q=lv_arc_set_range)|lv.obj, int, int|
set_rotation|[lv_arc_set_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_arc_set_rotation)|lv.obj, int|
set_rotation|[lv_arc_set_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_arc_set_rotation)|lv.obj, int|
set_start_angle|[lv_arc_set_start_angle](https://docs.lvgl.io/9.0/search.html?q=lv_arc_set_start_angle)|lv.obj, int|
set_value|[lv_arc_set_value](https://docs.lvgl.io/9.0/search.html?q=lv_arc_set_value)|lv.obj, int|

### widget `lv.bar`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_max_value|[lv_bar_get_max_value](https://docs.lvgl.io/9.0/search.html?q=lv_bar_get_max_value)|lv.obj|i
get_min_value|[lv_bar_get_min_value](https://docs.lvgl.io/9.0/search.html?q=lv_bar_get_min_value)|lv.obj|i
get_mode|[lv_bar_get_mode](https://docs.lvgl.io/9.0/search.html?q=lv_bar_get_mode)|lv.obj|i
get_start_value|[lv_bar_get_start_value](https://docs.lvgl.io/9.0/search.html?q=lv_bar_get_start_value)|lv.obj|i
get_value|[lv_bar_get_value](https://docs.lvgl.io/9.0/search.html?q=lv_bar_get_value)|lv.obj|i
is_symmetrical|[lv_bar_is_symmetrical](https://docs.lvgl.io/9.0/search.html?q=lv_bar_is_symmetrical)|lv.obj|b
set_mode|[lv_bar_set_mode](https://docs.lvgl.io/9.0/search.html?q=lv_bar_set_mode)|lv.obj, int|
set_range|[lv_bar_set_range](https://docs.lvgl.io/9.0/search.html?q=lv_bar_set_range)|lv.obj, int, int|
set_start_value|[lv_bar_set_start_value](https://docs.lvgl.io/9.0/search.html?q=lv_bar_set_start_value)|lv.obj, int, int|
set_value|[lv_bar_set_value](https://docs.lvgl.io/9.0/search.html?q=lv_bar_set_value)|lv.obj, int, int|

### widget `lv.button`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---

### widget `lv.buttonmatrix`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
_btn_text|[lv_buttonmatrix_get_button_text](https://docs.lvgl.io/9.0/search.html?q=lv_buttonmatrix_get_button_text)|lv.obj, int|s
clear_button_ctrl|[lv_buttonmatrix_clear_button_ctrl](https://docs.lvgl.io/9.0/search.html?q=lv_buttonmatrix_clear_button_ctrl)|lv.obj, int, int|
clear_button_ctrl_all|[lv_buttonmatrix_clear_button_ctrl_all](https://docs.lvgl.io/9.0/search.html?q=lv_buttonmatrix_clear_button_ctrl_all)|lv.obj, int|
get_button_text|[lv_buttonmatrix_get_button_text](https://docs.lvgl.io/9.0/search.html?q=lv_buttonmatrix_get_button_text)|lv.obj, int|s
get_map|[lv_buttonmatrix_get_map](https://docs.lvgl.io/9.0/search.html?q=lv_buttonmatrix_get_map)|lv.obj|c
get_one_checked|[lv_buttonmatrix_get_one_checked](https://docs.lvgl.io/9.0/search.html?q=lv_buttonmatrix_get_one_checked)|lv.obj|b
get_popovers|[lv_buttonmatrix_get_popovers](https://docs.lvgl.io/9.0/search.html?q=lv_buttonmatrix_get_popovers)|lv.obj|b
get_selected_button|[lv_buttonmatrix_get_selected_button](https://docs.lvgl.io/9.0/search.html?q=lv_buttonmatrix_get_selected_button)|lv.obj|i
has_button_ctrl|[lv_buttonmatrix_has_button_ctrl](https://docs.lvgl.io/9.0/search.html?q=lv_buttonmatrix_has_button_ctrl)|lv.obj, int, int|b
set_button_ctrl|[lv_buttonmatrix_set_button_ctrl](https://docs.lvgl.io/9.0/search.html?q=lv_buttonmatrix_set_button_ctrl)|lv.obj, int, int|
set_button_ctrl_all|[lv_buttonmatrix_set_button_ctrl_all](https://docs.lvgl.io/9.0/search.html?q=lv_buttonmatrix_set_button_ctrl_all)|lv.obj, int|
set_button_width|[lv_buttonmatrix_set_button_width](https://docs.lvgl.io/9.0/search.html?q=lv_buttonmatrix_set_button_width)|lv.obj, int, int|
set_map|[lv_buttonmatrix_set_map](https://docs.lvgl.io/9.0/search.html?q=lv_buttonmatrix_set_map)|lv.obj, lv.str_arr|
set_one_checked|[lv_buttonmatrix_set_one_checked](https://docs.lvgl.io/9.0/search.html?q=lv_buttonmatrix_set_one_checked)|lv.obj, bool|
set_selected_button|[lv_buttonmatrix_set_selected_button](https://docs.lvgl.io/9.0/search.html?q=lv_buttonmatrix_set_selected_button)|lv.obj, int|

### widget `lv.canvas`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
fill_bg|[lv_canvas_fill_bg](https://docs.lvgl.io/9.0/search.html?q=lv_canvas_fill_bg)|lv.obj, lv.color, int|
finish_layer|[lv_canvas_finish_layer](https://docs.lvgl.io/9.0/search.html?q=lv_canvas_finish_layer)|lv.obj, comptr|
get_buf|[lv_canvas_get_buf](https://docs.lvgl.io/9.0/search.html?q=lv_canvas_get_buf)|lv.obj|c
get_image|[lv_canvas_get_image](https://docs.lvgl.io/9.0/search.html?q=lv_canvas_get_image)|lv.obj|lv.image_dsc
get_px|[lv_canvas_get_px](https://docs.lvgl.io/9.0/search.html?q=lv_canvas_get_px)|lv.obj, int, int|i
init_layer|[lv_canvas_init_layer](https://docs.lvgl.io/9.0/search.html?q=lv_canvas_init_layer)|lv.obj, comptr|
set_buffer|[lv_canvas_set_buffer](https://docs.lvgl.io/9.0/search.html?q=lv_canvas_set_buffer)|lv.obj, \<any\>, int, int, int|
set_palette|[lv_canvas_set_palette](https://docs.lvgl.io/9.0/search.html?q=lv_canvas_set_palette)|lv.obj, int, int|
set_px|[lv_canvas_set_px](https://docs.lvgl.io/9.0/search.html?q=lv_canvas_set_px)|lv.obj, int, int, lv.color, int|

### widget `lv.checkbox`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_text|[lv_checkbox_get_text](https://docs.lvgl.io/9.0/search.html?q=lv_checkbox_get_text)|lv.obj|s
set_text|[lv_checkbox_set_text](https://docs.lvgl.io/9.0/search.html?q=lv_checkbox_set_text)|lv.obj, string|
set_text_static|[lv_checkbox_set_text_static](https://docs.lvgl.io/9.0/search.html?q=lv_checkbox_set_text_static)|lv.obj, string|

### widget `lv.dropdown`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_option|[lv_dropdown_add_option](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_add_option)|lv.obj, string, int|
clear_options|[lv_dropdown_clear_options](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_clear_options)|lv.obj|
close|[lv_dropdown_close](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_close)|lv.obj|
get_dir|[lv_dropdown_get_dir](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_get_dir)|lv.obj|i
get_list|[lv_dropdown_get_list](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_get_list)|lv.obj|lv.obj
get_option_cnt|[lv_dropdown_get_option_count](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_get_option_count)|lv.obj|i
get_option_count|[lv_dropdown_get_option_count](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_get_option_count)|lv.obj|i
get_option_index|[lv_dropdown_get_option_index](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_get_option_index)|lv.obj, string|i
get_options|[lv_dropdown_get_options](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_get_options)|lv.obj|s
get_selected|[lv_dropdown_get_selected](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_get_selected)|lv.obj|i
get_selected_highlight|[lv_dropdown_get_selected_highlight](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_get_selected_highlight)|lv.obj|b
get_selected_str|[lv_dropdown_get_selected_str](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_get_selected_str)|lv.obj, comptr, int|
get_symbol|[lv_dropdown_get_symbol](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_get_symbol)|lv.obj|s
get_text|[lv_dropdown_get_text](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_get_text)|lv.obj|s
is_open|[lv_dropdown_is_open](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_is_open)|lv.obj|b
open|[lv_dropdown_open](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_open)|lv.obj|
set_dir|[lv_dropdown_set_dir](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_set_dir)|lv.obj, int|
set_options|[lv_dropdown_set_options](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_set_options)|lv.obj, string|
set_options_static|[lv_dropdown_set_options_static](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_set_options_static)|lv.obj, string|
set_selected|[lv_dropdown_set_selected](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_set_selected)|lv.obj, int|
set_selected_highlight|[lv_dropdown_set_selected_highlight](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_set_selected_highlight)|lv.obj, bool|
set_symbol|[lv_dropdown_set_symbol](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_set_symbol)|lv.obj, \<any\>|
set_text|[lv_dropdown_set_text](https://docs.lvgl.io/9.0/search.html?q=lv_dropdown_set_text)|lv.obj, string|

### widget `lv.image`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_angle|[lv_image_get_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_rotation)|lv.obj|i
get_antialias|[lv_image_get_antialias](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_antialias)|lv.obj|b
get_blend_mode|[lv_image_get_blend_mode](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_blend_mode)|lv.obj|i
get_inner_align|[lv_image_get_inner_align](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_inner_align)|lv.obj|i
get_offset_x|[lv_image_get_offset_x](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_offset_x)|lv.obj|i
get_offset_x|[lv_image_get_offset_x](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_offset_x)|lv.obj|i
get_offset_y|[lv_image_get_offset_y](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_offset_y)|lv.obj|i
get_offset_y|[lv_image_get_offset_y](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_offset_y)|lv.obj|i
get_pivot|[lv_image_get_pivot](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_pivot)|lv.obj, comptr|
get_rotation|[lv_image_get_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_rotation)|lv.obj|i
get_rotation|[lv_image_get_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_rotation)|lv.obj|i
get_scale|[lv_image_get_scale](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_scale)|lv.obj|i
get_scale_x|[lv_image_get_scale_x](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_scale_x)|lv.obj|i
get_scale_y|[lv_image_get_scale_y](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_scale_y)|lv.obj|i
get_src|[lv_image_get_src](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_src)|lv.obj|c
get_zoom|[lv_image_get_scale](https://docs.lvgl.io/9.0/search.html?q=lv_image_get_scale)|lv.obj|i
set_angle|[lv_image_set_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_image_set_rotation)|lv.obj, int|
set_antialias|[lv_image_set_antialias](https://docs.lvgl.io/9.0/search.html?q=lv_image_set_antialias)|lv.obj, bool|
set_blend_mode|[lv_image_set_blend_mode](https://docs.lvgl.io/9.0/search.html?q=lv_image_set_blend_mode)|lv.obj, int|
set_inner_align|[lv_image_set_inner_align](https://docs.lvgl.io/9.0/search.html?q=lv_image_set_inner_align)|lv.obj, int|
set_offset_x|[lv_image_set_offset_x](https://docs.lvgl.io/9.0/search.html?q=lv_image_set_offset_x)|lv.obj, int|
set_offset_y|[lv_image_set_offset_y](https://docs.lvgl.io/9.0/search.html?q=lv_image_set_offset_y)|lv.obj, int|
set_pivot|[lv_image_set_pivot](https://docs.lvgl.io/9.0/search.html?q=lv_image_set_pivot)|lv.obj, int, int|
set_rotation|[lv_image_set_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_image_set_rotation)|lv.obj, int|
set_rotation|[lv_image_set_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_image_set_rotation)|lv.obj, int|
set_scale|[lv_image_set_scale](https://docs.lvgl.io/9.0/search.html?q=lv_image_set_scale)|lv.obj, int|
set_scale_x|[lv_image_set_scale_x](https://docs.lvgl.io/9.0/search.html?q=lv_image_set_scale_x)|lv.obj, int|
set_scale_y|[lv_image_set_scale_y](https://docs.lvgl.io/9.0/search.html?q=lv_image_set_scale_y)|lv.obj, int|
set_src|[lv_image_set_src](https://docs.lvgl.io/9.0/search.html?q=lv_image_set_src)|lv.obj, \<any\>|
set_tasmota_logo|[lv_image_set_tasmota_logo](https://docs.lvgl.io/9.0/search.html?q=lv_image_set_tasmota_logo)|lv.obj|
set_zoom|[lv_image_set_scale](https://docs.lvgl.io/9.0/search.html?q=lv_image_set_scale)|lv.obj, int|

### widget `lv.label`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
cut_text|[lv_label_cut_text](https://docs.lvgl.io/9.0/search.html?q=lv_label_cut_text)|lv.obj, int, int|
get_letter_on|[lv_label_get_letter_on](https://docs.lvgl.io/9.0/search.html?q=lv_label_get_letter_on)|lv.obj, comptr, bool|i
get_letter_pos|[lv_label_get_letter_pos](https://docs.lvgl.io/9.0/search.html?q=lv_label_get_letter_pos)|lv.obj, int, comptr|
get_long_mode|[lv_label_get_long_mode](https://docs.lvgl.io/9.0/search.html?q=lv_label_get_long_mode)|lv.obj|i
get_text|[lv_label_get_text](https://docs.lvgl.io/9.0/search.html?q=lv_label_get_text)|lv.obj|s
get_text_selection_end|[lv_label_get_text_selection_end](https://docs.lvgl.io/9.0/search.html?q=lv_label_get_text_selection_end)|lv.obj|i
get_text_selection_start|[lv_label_get_text_selection_start](https://docs.lvgl.io/9.0/search.html?q=lv_label_get_text_selection_start)|lv.obj|i
ins_text|[lv_label_ins_text](https://docs.lvgl.io/9.0/search.html?q=lv_label_ins_text)|lv.obj, int, string|
is_char_under_pos|[lv_label_is_char_under_pos](https://docs.lvgl.io/9.0/search.html?q=lv_label_is_char_under_pos)|lv.obj, comptr|b
set_long_mode|[lv_label_set_long_mode](https://docs.lvgl.io/9.0/search.html?q=lv_label_set_long_mode)|lv.obj, int|
set_text|[lv_label_set_text](https://docs.lvgl.io/9.0/search.html?q=lv_label_set_text)|lv.obj, string|
set_text_fmt|[lv_label_set_text_fmt](https://docs.lvgl.io/9.0/search.html?q=lv_label_set_text_fmt)|lv.obj, string, [\<any\>]|
set_text_selection_end|[lv_label_set_text_selection_end](https://docs.lvgl.io/9.0/search.html?q=lv_label_set_text_selection_end)|lv.obj, int|
set_text_selection_start|[lv_label_set_text_selection_start](https://docs.lvgl.io/9.0/search.html?q=lv_label_set_text_selection_start)|lv.obj, int|
set_text_static|[lv_label_set_text_static](https://docs.lvgl.io/9.0/search.html?q=lv_label_set_text_static)|lv.obj, string|

### widget `lv.line`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_y_invert|[lv_line_get_y_invert](https://docs.lvgl.io/9.0/search.html?q=lv_line_get_y_invert)|lv.obj|b
set_points|[lv_line_set_points](https://docs.lvgl.io/9.0/search.html?q=lv_line_set_points)|lv.obj, lv.point_arr, int|
set_y_invert|[lv_line_set_y_invert](https://docs.lvgl.io/9.0/search.html?q=lv_line_set_y_invert)|lv.obj, bool|

### widget `lv.roller`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_option_cnt|[lv_roller_get_option_count](https://docs.lvgl.io/9.0/search.html?q=lv_roller_get_option_count)|lv.obj|i
get_option_count|[lv_roller_get_option_count](https://docs.lvgl.io/9.0/search.html?q=lv_roller_get_option_count)|lv.obj|i
get_options|[lv_roller_get_options](https://docs.lvgl.io/9.0/search.html?q=lv_roller_get_options)|lv.obj|s
get_selected|[lv_roller_get_selected](https://docs.lvgl.io/9.0/search.html?q=lv_roller_get_selected)|lv.obj|i
get_selected_str|[lv_roller_get_selected_str](https://docs.lvgl.io/9.0/search.html?q=lv_roller_get_selected_str)|lv.obj, comptr, int|
set_options|[lv_roller_set_options](https://docs.lvgl.io/9.0/search.html?q=lv_roller_set_options)|lv.obj, string, int|
set_selected|[lv_roller_set_selected](https://docs.lvgl.io/9.0/search.html?q=lv_roller_set_selected)|lv.obj, int, int|
set_visible_row_cnt|[lv_roller_set_visible_row_count](https://docs.lvgl.io/9.0/search.html?q=lv_roller_set_visible_row_count)|lv.obj, int|
set_visible_row_count|[lv_roller_set_visible_row_count](https://docs.lvgl.io/9.0/search.html?q=lv_roller_set_visible_row_count)|lv.obj, int|

### widget `lv.slider`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_left_value|[lv_slider_get_left_value](https://docs.lvgl.io/9.0/search.html?q=lv_slider_get_left_value)|lv.obj|i
get_max_value|[lv_slider_get_max_value](https://docs.lvgl.io/9.0/search.html?q=lv_slider_get_max_value)|lv.obj|i
get_min_value|[lv_slider_get_min_value](https://docs.lvgl.io/9.0/search.html?q=lv_slider_get_min_value)|lv.obj|i
get_mode|[lv_slider_get_mode](https://docs.lvgl.io/9.0/search.html?q=lv_slider_get_mode)|lv.obj|i
get_value|[lv_slider_get_value](https://docs.lvgl.io/9.0/search.html?q=lv_slider_get_value)|lv.obj|i
is_dragged|[lv_slider_is_dragged](https://docs.lvgl.io/9.0/search.html?q=lv_slider_is_dragged)|lv.obj|b
is_symmetrical|[lv_slider_is_symmetrical](https://docs.lvgl.io/9.0/search.html?q=lv_slider_is_symmetrical)|lv.obj|b
set_left_value|[lv_slider_set_left_value](https://docs.lvgl.io/9.0/search.html?q=lv_slider_set_left_value)|lv.obj, int, int|
set_mode|[lv_slider_set_mode](https://docs.lvgl.io/9.0/search.html?q=lv_slider_set_mode)|lv.obj, int|
set_range|[lv_slider_set_range](https://docs.lvgl.io/9.0/search.html?q=lv_slider_set_range)|lv.obj, int, int|
set_value|[lv_slider_set_value](https://docs.lvgl.io/9.0/search.html?q=lv_slider_set_value)|lv.obj, int, int|

### widget `lv.switch`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---

### widget `lv.table`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_cell_ctrl|[lv_table_add_cell_ctrl](https://docs.lvgl.io/9.0/search.html?q=lv_table_add_cell_ctrl)|lv.obj, int, int, int|
clear_cell_ctrl|[lv_table_clear_cell_ctrl](https://docs.lvgl.io/9.0/search.html?q=lv_table_clear_cell_ctrl)|lv.obj, int, int, int|
get_cell_user_data|[lv_table_get_cell_user_data](https://docs.lvgl.io/9.0/search.html?q=lv_table_get_cell_user_data)|lv.obj, int, int|c
get_cell_value|[lv_table_get_cell_value](https://docs.lvgl.io/9.0/search.html?q=lv_table_get_cell_value)|lv.obj, int, int|s
get_col_cnt|[lv_table_get_column_count](https://docs.lvgl.io/9.0/search.html?q=lv_table_get_column_count)|lv.obj|i
get_col_width|[lv_table_get_column_width](https://docs.lvgl.io/9.0/search.html?q=lv_table_get_column_width)|lv.obj, int|i
get_column_count|[lv_table_get_column_count](https://docs.lvgl.io/9.0/search.html?q=lv_table_get_column_count)|lv.obj|i
get_column_width|[lv_table_get_column_width](https://docs.lvgl.io/9.0/search.html?q=lv_table_get_column_width)|lv.obj, int|i
get_row_cnt|[lv_table_get_row_count](https://docs.lvgl.io/9.0/search.html?q=lv_table_get_row_count)|lv.obj|i
get_row_count|[lv_table_get_row_count](https://docs.lvgl.io/9.0/search.html?q=lv_table_get_row_count)|lv.obj|i
get_selected_cell|[lv_table_get_selected_cell](https://docs.lvgl.io/9.0/search.html?q=lv_table_get_selected_cell)|lv.obj, lv.int_arr, lv.int_arr|
has_cell_ctrl|[lv_table_has_cell_ctrl](https://docs.lvgl.io/9.0/search.html?q=lv_table_has_cell_ctrl)|lv.obj, int, int, int|b
set_cell_user_data|[lv_table_set_cell_user_data](https://docs.lvgl.io/9.0/search.html?q=lv_table_set_cell_user_data)|lv.obj, int, int, \<any\>|
set_cell_value|[lv_table_set_cell_value](https://docs.lvgl.io/9.0/search.html?q=lv_table_set_cell_value)|lv.obj, int, int, string|
set_cell_value_fmt|[lv_table_set_cell_value_fmt](https://docs.lvgl.io/9.0/search.html?q=lv_table_set_cell_value_fmt)|lv.obj, int, int, string, [\<any\>]|
set_col_cnt|[lv_table_set_column_count](https://docs.lvgl.io/9.0/search.html?q=lv_table_set_column_count)|lv.obj, int|
set_col_width|[lv_table_set_column_width](https://docs.lvgl.io/9.0/search.html?q=lv_table_set_column_width)|lv.obj, int, int|
set_column_count|[lv_table_set_column_count](https://docs.lvgl.io/9.0/search.html?q=lv_table_set_column_count)|lv.obj, int|
set_column_width|[lv_table_set_column_width](https://docs.lvgl.io/9.0/search.html?q=lv_table_set_column_width)|lv.obj, int, int|
set_row_cnt|[lv_table_set_row_count](https://docs.lvgl.io/9.0/search.html?q=lv_table_set_row_count)|lv.obj, int|
set_row_count|[lv_table_set_row_count](https://docs.lvgl.io/9.0/search.html?q=lv_table_set_row_count)|lv.obj, int|

### widget `lv.textarea`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_char|[lv_textarea_add_char](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_add_char)|lv.obj, int|
add_text|[lv_textarea_add_text](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_add_text)|lv.obj, string|
clear_selection|[lv_textarea_clear_selection](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_clear_selection)|lv.obj|
cursor_down|[lv_textarea_cursor_down](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_cursor_down)|lv.obj|
cursor_left|[lv_textarea_cursor_left](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_cursor_left)|lv.obj|
cursor_right|[lv_textarea_cursor_right](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_cursor_right)|lv.obj|
cursor_up|[lv_textarea_cursor_up](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_cursor_up)|lv.obj|
delete_char|[lv_textarea_delete_char](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_delete_char)|lv.obj|
delete_char_forward|[lv_textarea_delete_char_forward](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_delete_char_forward)|lv.obj|
get_accepted_chars|[lv_textarea_get_accepted_chars](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_get_accepted_chars)|lv.obj|s
get_current_char|[lv_textarea_get_current_char](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_get_current_char)|lv.obj|i
get_cursor_click_pos|[lv_textarea_get_cursor_click_pos](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_get_cursor_click_pos)|lv.obj|b
get_cursor_pos|[lv_textarea_get_cursor_pos](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_get_cursor_pos)|lv.obj|i
get_label|[lv_textarea_get_label](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_get_label)|lv.obj|lv.obj
get_max_length|[lv_textarea_get_max_length](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_get_max_length)|lv.obj|i
get_one_line|[lv_textarea_get_one_line](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_get_one_line)|lv.obj|b
get_password_bullet|[lv_textarea_get_password_bullet](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_get_password_bullet)|lv.obj|s
get_password_mode|[lv_textarea_get_password_mode](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_get_password_mode)|lv.obj|b
get_password_show_time|[lv_textarea_get_password_show_time](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_get_password_show_time)|lv.obj|i
get_placeholder_text|[lv_textarea_get_placeholder_text](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_get_placeholder_text)|lv.obj|s
get_text|[lv_textarea_get_text](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_get_text)|lv.obj|s
get_text_selection|[lv_textarea_get_text_selection](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_get_text_selection)|lv.obj|b
set_accepted_chars|[lv_textarea_set_accepted_chars](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_set_accepted_chars)|lv.obj, string|
set_align|[lv_textarea_set_align](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_set_align)|lv.obj, int|
set_cursor_click_pos|[lv_textarea_set_cursor_click_pos](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_set_cursor_click_pos)|lv.obj, bool|
set_cursor_pos|[lv_textarea_set_cursor_pos](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_set_cursor_pos)|lv.obj, int|
set_insert_replace|[lv_textarea_set_insert_replace](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_set_insert_replace)|lv.obj, string|
set_max_length|[lv_textarea_set_max_length](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_set_max_length)|lv.obj, int|
set_one_line|[lv_textarea_set_one_line](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_set_one_line)|lv.obj, bool|
set_password_bullet|[lv_textarea_set_password_bullet](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_set_password_bullet)|lv.obj, string|
set_password_mode|[lv_textarea_set_password_mode](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_set_password_mode)|lv.obj, bool|
set_password_show_time|[lv_textarea_set_password_show_time](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_set_password_show_time)|lv.obj, int|
set_placeholder_text|[lv_textarea_set_placeholder_text](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_set_placeholder_text)|lv.obj, string|
set_text|[lv_textarea_set_text](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_set_text)|lv.obj, string|
set_text_selection|[lv_textarea_set_text_selection](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_set_text_selection)|lv.obj, bool|
text_is_selected|[lv_textarea_text_is_selected](https://docs.lvgl.io/9.0/search.html?q=lv_textarea_text_is_selected)|lv.obj|b

### widget `lv.spangroup`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
delete_span|[lv_spangroup_delete_span](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_delete_span)|lv.obj, lv.spangroup|
get_align|[lv_spangroup_get_align](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_get_align)|lv.obj|i
get_child|[lv_spangroup_get_child](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_get_child)|lv.obj, int|lv.spangroup
get_expand_height|[lv_spangroup_get_expand_height](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_get_expand_height)|lv.obj, int|i
get_expand_width|[lv_spangroup_get_expand_width](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_get_expand_width)|lv.obj, int|i
get_indent|[lv_spangroup_get_indent](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_get_indent)|lv.obj|i
get_max_line_height|[lv_spangroup_get_max_line_height](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_get_max_line_height)|lv.obj|i
get_max_lines|[lv_spangroup_get_max_lines](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_get_max_lines)|lv.obj|i
get_mode|[lv_spangroup_get_mode](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_get_mode)|lv.obj|i
get_overflow|[lv_spangroup_get_overflow](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_get_overflow)|lv.obj|i
get_span_count|[lv_spangroup_get_span_count](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_get_span_count)|lv.obj|i
new_span|[lv_spangroup_new_span](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_new_span)|lv.obj|lv.spangroup
refr_mode|[lv_spangroup_refr_mode](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_refr_mode)|lv.obj|
set_align|[lv_spangroup_set_align](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_set_align)|lv.obj, int|
set_indent|[lv_spangroup_set_indent](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_set_indent)|lv.obj, int|
set_max_lines|[lv_spangroup_set_max_lines](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_set_max_lines)|lv.obj, int|
set_mode|[lv_spangroup_set_mode](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_set_mode)|lv.obj, int|
set_overflow|[lv_spangroup_set_overflow](https://docs.lvgl.io/9.0/search.html?q=lv_spangroup_set_overflow)|lv.obj, int|

### widget `lv.scale`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_section|[lv_scale_add_section](https://docs.lvgl.io/9.0/search.html?q=lv_scale_add_section)|lv.obj|c
get_angle_range|[lv_scale_get_angle_range](https://docs.lvgl.io/9.0/search.html?q=lv_scale_get_angle_range)|lv.obj|i
get_label_show|[lv_scale_get_label_show](https://docs.lvgl.io/9.0/search.html?q=lv_scale_get_label_show)|lv.obj|b
get_major_tick_every|[lv_scale_get_major_tick_every](https://docs.lvgl.io/9.0/search.html?q=lv_scale_get_major_tick_every)|lv.obj|i
get_mode|[lv_scale_get_mode](https://docs.lvgl.io/9.0/search.html?q=lv_scale_get_mode)|lv.obj|i
get_range_max_value|[lv_scale_get_range_max_value](https://docs.lvgl.io/9.0/search.html?q=lv_scale_get_range_max_value)|lv.obj|i
get_range_min_value|[lv_scale_get_range_min_value](https://docs.lvgl.io/9.0/search.html?q=lv_scale_get_range_min_value)|lv.obj|i
get_total_tick_count|[lv_scale_get_total_tick_count](https://docs.lvgl.io/9.0/search.html?q=lv_scale_get_total_tick_count)|lv.obj|i
set_angle|[lv_scale_set_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_scale_set_rotation)|lv.obj, int|
set_angle_range|[lv_scale_set_angle_range](https://docs.lvgl.io/9.0/search.html?q=lv_scale_set_angle_range)|lv.obj, int|
set_image_needle_value|[lv_scale_set_image_needle_value](https://docs.lvgl.io/9.0/search.html?q=lv_scale_set_image_needle_value)|lv.obj, lv.obj, int|
set_label_show|[lv_scale_set_label_show](https://docs.lvgl.io/9.0/search.html?q=lv_scale_set_label_show)|lv.obj, bool|
set_line_needle_value|[lv_scale_set_line_needle_value](https://docs.lvgl.io/9.0/search.html?q=lv_scale_set_line_needle_value)|lv.obj, lv.obj, int, int|
set_major_tick_every|[lv_scale_set_major_tick_every](https://docs.lvgl.io/9.0/search.html?q=lv_scale_set_major_tick_every)|lv.obj, int|
set_mode|[lv_scale_set_mode](https://docs.lvgl.io/9.0/search.html?q=lv_scale_set_mode)|lv.obj, int|
set_post_draw|[lv_scale_set_post_draw](https://docs.lvgl.io/9.0/search.html?q=lv_scale_set_post_draw)|lv.obj, bool|
set_range|[lv_scale_set_range](https://docs.lvgl.io/9.0/search.html?q=lv_scale_set_range)|lv.obj, int, int|
set_rotation|[lv_scale_set_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_scale_set_rotation)|lv.obj, int|
set_rotation|[lv_scale_set_rotation](https://docs.lvgl.io/9.0/search.html?q=lv_scale_set_rotation)|lv.obj, int|
set_text_src|[lv_scale_set_text_src](https://docs.lvgl.io/9.0/search.html?q=lv_scale_set_text_src)|lv.obj, lv.str_arr|
set_total_tick_count|[lv_scale_set_total_tick_count](https://docs.lvgl.io/9.0/search.html?q=lv_scale_set_total_tick_count)|lv.obj, int|

### widget `lv.chart`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_cursor|[lv_chart_add_cursor](https://docs.lvgl.io/9.0/search.html?q=lv_chart_add_cursor)|lv.obj, lv.color, int|lv.chart_cursor
add_series|[lv_chart_add_series](https://docs.lvgl.io/9.0/search.html?q=lv_chart_add_series)|lv.obj, lv.color, int|lv.chart_series
get_cursor_point|[lv_chart_get_cursor_point](https://docs.lvgl.io/9.0/search.html?q=lv_chart_get_cursor_point)|lv.obj, lv.chart_cursor|i
get_first_point_center_offset|[lv_chart_get_first_point_center_offset](https://docs.lvgl.io/9.0/search.html?q=lv_chart_get_first_point_center_offset)|lv.obj|i
get_point_count|[lv_chart_get_point_count](https://docs.lvgl.io/9.0/search.html?q=lv_chart_get_point_count)|lv.obj|i
get_point_pos_by_id|[lv_chart_get_point_pos_by_id](https://docs.lvgl.io/9.0/search.html?q=lv_chart_get_point_pos_by_id)|lv.obj, lv.chart_series, int, comptr|
get_pressed_point|[lv_chart_get_pressed_point](https://docs.lvgl.io/9.0/search.html?q=lv_chart_get_pressed_point)|lv.obj|i
get_series_next|[lv_chart_get_series_next](https://docs.lvgl.io/9.0/search.html?q=lv_chart_get_series_next)|lv.obj, lv.chart_series|lv.chart_series
get_type|[lv_chart_get_type](https://docs.lvgl.io/9.0/search.html?q=lv_chart_get_type)|lv.obj|i
get_x_array|[lv_chart_get_x_array](https://docs.lvgl.io/9.0/search.html?q=lv_chart_get_x_array)|lv.obj, lv.chart_series|lv.int_arr
get_x_start_point|[lv_chart_get_x_start_point](https://docs.lvgl.io/9.0/search.html?q=lv_chart_get_x_start_point)|lv.obj, lv.chart_series|i
get_y_array|[lv_chart_get_y_array](https://docs.lvgl.io/9.0/search.html?q=lv_chart_get_y_array)|lv.obj, lv.chart_series|lv.int_arr
hide_series|[lv_chart_hide_series](https://docs.lvgl.io/9.0/search.html?q=lv_chart_hide_series)|lv.obj, lv.chart_series, bool|
refresh|[lv_chart_refresh](https://docs.lvgl.io/9.0/search.html?q=lv_chart_refresh)|lv.obj|
remove_series|[lv_chart_remove_series](https://docs.lvgl.io/9.0/search.html?q=lv_chart_remove_series)|lv.obj, lv.chart_series|
set_all_value|[lv_chart_set_all_value](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_all_value)|lv.obj, lv.chart_series, int|
set_cursor_point|[lv_chart_set_cursor_point](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_cursor_point)|lv.obj, lv.chart_cursor, lv.chart_series, int|
set_cursor_pos|[lv_chart_set_cursor_pos](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_cursor_pos)|lv.obj, lv.chart_cursor, comptr|
set_div_line_count|[lv_chart_set_div_line_count](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_div_line_count)|lv.obj, int, int|
set_ext_x_array|[lv_chart_set_ext_x_array](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_ext_x_array)|lv.obj, lv.chart_series, lv.int_arr|
set_ext_y_array|[lv_chart_set_ext_y_array](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_ext_y_array)|lv.obj, lv.chart_series, lv.int_arr|
set_next_value|[lv_chart_set_next_value](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_next_value)|lv.obj, lv.chart_series, int|
set_next_value2|[lv_chart_set_next_value2](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_next_value2)|lv.obj, lv.chart_series, int, int|
set_point_count|[lv_chart_set_point_count](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_point_count)|lv.obj, int|
set_range|[lv_chart_set_range](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_range)|lv.obj, int, int, int|
set_series_color|[lv_chart_set_series_color](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_series_color)|lv.obj, lv.chart_series, lv.color|
set_type|[lv_chart_set_type](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_type)|lv.obj, int|
set_update_mode|[lv_chart_set_update_mode](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_update_mode)|lv.obj, int|
set_value_by_id|[lv_chart_set_value_by_id](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_value_by_id)|lv.obj, lv.chart_series, int, int|
set_value_by_id2|[lv_chart_set_value_by_id2](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_value_by_id2)|lv.obj, lv.chart_series, int, int, int|
set_x_start_point|[lv_chart_set_x_start_point](https://docs.lvgl.io/9.0/search.html?q=lv_chart_set_x_start_point)|lv.obj, lv.chart_series, int|

### widget `lv.imagebutton`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
set_src|[lv_imagebutton_set_src](https://docs.lvgl.io/9.0/search.html?q=lv_imagebutton_set_src)|lv.obj, int, \<any\>, \<any\>, \<any\>|
set_state|[lv_imagebutton_set_state](https://docs.lvgl.io/9.0/search.html?q=lv_imagebutton_set_state)|lv.obj, int|

### widget `lv.led`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_brightness|[lv_led_get_brightness](https://docs.lvgl.io/9.0/search.html?q=lv_led_get_brightness)|lv.obj|i
off|[lv_led_off](https://docs.lvgl.io/9.0/search.html?q=lv_led_off)|lv.obj|
on|[lv_led_on](https://docs.lvgl.io/9.0/search.html?q=lv_led_on)|lv.obj|
set_brightness|[lv_led_set_brightness](https://docs.lvgl.io/9.0/search.html?q=lv_led_set_brightness)|lv.obj, int|
set_color|[lv_led_set_color](https://docs.lvgl.io/9.0/search.html?q=lv_led_set_color)|lv.obj, lv.color|
toggle|[lv_led_toggle](https://docs.lvgl.io/9.0/search.html?q=lv_led_toggle)|lv.obj|

### widget `lv.msgbox`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_close_button|[lv_msgbox_add_close_button](https://docs.lvgl.io/9.0/search.html?q=lv_msgbox_add_close_button)|lv.obj|lv.obj
add_footer_button|[lv_msgbox_add_footer_button](https://docs.lvgl.io/9.0/search.html?q=lv_msgbox_add_footer_button)|lv.obj, string|lv.obj
add_header_button|[lv_msgbox_add_header_button](https://docs.lvgl.io/9.0/search.html?q=lv_msgbox_add_header_button)|lv.obj, \<any\>|lv.obj
add_text|[lv_msgbox_add_text](https://docs.lvgl.io/9.0/search.html?q=lv_msgbox_add_text)|lv.obj, string|lv.obj
add_title|[lv_msgbox_add_title](https://docs.lvgl.io/9.0/search.html?q=lv_msgbox_add_title)|lv.obj, string|lv.obj
close|[lv_msgbox_close](https://docs.lvgl.io/9.0/search.html?q=lv_msgbox_close)|lv.obj|
close_async|[lv_msgbox_close_async](https://docs.lvgl.io/9.0/search.html?q=lv_msgbox_close_async)|lv.obj|
get_content|[lv_msgbox_get_content](https://docs.lvgl.io/9.0/search.html?q=lv_msgbox_get_content)|lv.obj|lv.obj
get_footer|[lv_msgbox_get_footer](https://docs.lvgl.io/9.0/search.html?q=lv_msgbox_get_footer)|lv.obj|lv.obj
get_header|[lv_msgbox_get_header](https://docs.lvgl.io/9.0/search.html?q=lv_msgbox_get_header)|lv.obj|lv.obj
get_title|[lv_msgbox_get_title](https://docs.lvgl.io/9.0/search.html?q=lv_msgbox_get_title)|lv.obj|lv.obj

### widget `lv.spinbox`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
decrement|[lv_spinbox_decrement](https://docs.lvgl.io/9.0/search.html?q=lv_spinbox_decrement)|lv.obj|
get_rollover|[lv_spinbox_get_rollover](https://docs.lvgl.io/9.0/search.html?q=lv_spinbox_get_rollover)|lv.obj|b
get_step|[lv_spinbox_get_step](https://docs.lvgl.io/9.0/search.html?q=lv_spinbox_get_step)|lv.obj|i
get_value|[lv_spinbox_get_value](https://docs.lvgl.io/9.0/search.html?q=lv_spinbox_get_value)|lv.obj|i
increment|[lv_spinbox_increment](https://docs.lvgl.io/9.0/search.html?q=lv_spinbox_increment)|lv.obj|
set_cursor_pos|[lv_spinbox_set_cursor_pos](https://docs.lvgl.io/9.0/search.html?q=lv_spinbox_set_cursor_pos)|lv.obj, int|
set_digit_format|[lv_spinbox_set_digit_format](https://docs.lvgl.io/9.0/search.html?q=lv_spinbox_set_digit_format)|lv.obj, int, int|
set_digit_step_direction|[lv_spinbox_set_digit_step_direction](https://docs.lvgl.io/9.0/search.html?q=lv_spinbox_set_digit_step_direction)|lv.obj, int|
set_range|[lv_spinbox_set_range](https://docs.lvgl.io/9.0/search.html?q=lv_spinbox_set_range)|lv.obj, int, int|
set_rollover|[lv_spinbox_set_rollover](https://docs.lvgl.io/9.0/search.html?q=lv_spinbox_set_rollover)|lv.obj, bool|
set_step|[lv_spinbox_set_step](https://docs.lvgl.io/9.0/search.html?q=lv_spinbox_set_step)|lv.obj, int|
set_value|[lv_spinbox_set_value](https://docs.lvgl.io/9.0/search.html?q=lv_spinbox_set_value)|lv.obj, int|
step_next|[lv_spinbox_step_next](https://docs.lvgl.io/9.0/search.html?q=lv_spinbox_step_next)|lv.obj|
step_prev|[lv_spinbox_step_prev](https://docs.lvgl.io/9.0/search.html?q=lv_spinbox_step_prev)|lv.obj|

### widget `lv.spinner`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
set_anim_params|[lv_spinner_set_anim_params](https://docs.lvgl.io/9.0/search.html?q=lv_spinner_set_anim_params)|lv.obj, int, int|

### widget `lv.keyboard`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
_btn_text|[lv_keyboard_get_button_text](https://docs.lvgl.io/9.0/search.html?q=lv_keyboard_get_button_text)|lv.obj, int|s
get_button_text|[lv_keyboard_get_button_text](https://docs.lvgl.io/9.0/search.html?q=lv_keyboard_get_button_text)|lv.obj, int|s
get_map_array|[lv_keyboard_get_map_array](https://docs.lvgl.io/9.0/search.html?q=lv_keyboard_get_map_array)|lv.obj|c
get_mode|[lv_keyboard_get_mode](https://docs.lvgl.io/9.0/search.html?q=lv_keyboard_get_mode)|lv.obj|i
get_selected_button|[lv_keyboard_get_selected_button](https://docs.lvgl.io/9.0/search.html?q=lv_keyboard_get_selected_button)|lv.obj|i
get_textarea|[lv_keyboard_get_textarea](https://docs.lvgl.io/9.0/search.html?q=lv_keyboard_get_textarea)|lv.obj|lv.obj
set_mode|[lv_keyboard_set_mode](https://docs.lvgl.io/9.0/search.html?q=lv_keyboard_set_mode)|lv.obj, int|
set_popovers|[lv_keyboard_set_popovers](https://docs.lvgl.io/9.0/search.html?q=lv_keyboard_set_popovers)|lv.obj, bool|
set_textarea|[lv_keyboard_set_textarea](https://docs.lvgl.io/9.0/search.html?q=lv_keyboard_set_textarea)|lv.obj, lv.obj|

### widget `lv.tabview`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_tab|[lv_tabview_add_tab](https://docs.lvgl.io/9.0/search.html?q=lv_tabview_add_tab)|lv.obj, string|lv.obj
get_content|[lv_tabview_get_content](https://docs.lvgl.io/9.0/search.html?q=lv_tabview_get_content)|lv.obj|lv.obj
get_tab_act|[lv_tabview_get_tab_active](https://docs.lvgl.io/9.0/search.html?q=lv_tabview_get_tab_active)|lv.obj|i
get_tab_active|[lv_tabview_get_tab_active](https://docs.lvgl.io/9.0/search.html?q=lv_tabview_get_tab_active)|lv.obj|i
get_tab_bar|[lv_tabview_get_tab_bar](https://docs.lvgl.io/9.0/search.html?q=lv_tabview_get_tab_bar)|lv.obj|lv.obj
get_tab_btns|[lv_tabview_get_tab_bar](https://docs.lvgl.io/9.0/search.html?q=lv_tabview_get_tab_bar)|lv.obj|lv.obj
get_tab_count|[lv_tabview_get_tab_count](https://docs.lvgl.io/9.0/search.html?q=lv_tabview_get_tab_count)|lv.obj|i
rename_tab|[lv_tabview_rename_tab](https://docs.lvgl.io/9.0/search.html?q=lv_tabview_rename_tab)|lv.obj, int, string|
set_act|[lv_tabview_set_active](https://docs.lvgl.io/9.0/search.html?q=lv_tabview_set_active)|lv.obj, int, int|
set_active|[lv_tabview_set_active](https://docs.lvgl.io/9.0/search.html?q=lv_tabview_set_active)|lv.obj, int, int|
set_tab_bar_position|[lv_tabview_set_tab_bar_position](https://docs.lvgl.io/9.0/search.html?q=lv_tabview_set_tab_bar_position)|lv.obj, int|
set_tab_bar_size|[lv_tabview_set_tab_bar_size](https://docs.lvgl.io/9.0/search.html?q=lv_tabview_set_tab_bar_size)|lv.obj, int|

### widget `lv.tileview`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_tile|[lv_tileview_add_tile](https://docs.lvgl.io/9.0/search.html?q=lv_tileview_add_tile)|lv.obj, int, int, int|lv.obj
get_tile_act|[lv_tileview_get_tile_active](https://docs.lvgl.io/9.0/search.html?q=lv_tileview_get_tile_active)|lv.obj|lv.obj
get_tile_active|[lv_tileview_get_tile_active](https://docs.lvgl.io/9.0/search.html?q=lv_tileview_get_tile_active)|lv.obj|lv.obj
set_tile|[lv_tileview_set_tile](https://docs.lvgl.io/9.0/search.html?q=lv_tileview_set_tile)|lv.obj, lv.obj, int|
set_tile_by_index|[lv_tileview_set_tile_by_index](https://docs.lvgl.io/9.0/search.html?q=lv_tileview_set_tile_by_index)|lv.obj, int, int, int|
set_tile_id|[lv_tileview_set_tile_by_index](https://docs.lvgl.io/9.0/search.html?q=lv_tileview_set_tile_by_index)|lv.obj, int, int, int|

### widget `lv.list`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
_btn_text|[lv_list_get_button_text](https://docs.lvgl.io/9.0/search.html?q=lv_list_get_button_text)|lv.obj, lv.obj|s
add_btn|[lv_list_add_button](https://docs.lvgl.io/9.0/search.html?q=lv_list_add_button)|lv.obj, \<any\>, string|lv.obj
add_button|[lv_list_add_button](https://docs.lvgl.io/9.0/search.html?q=lv_list_add_button)|lv.obj, \<any\>, string|lv.obj
add_text|[lv_list_add_text](https://docs.lvgl.io/9.0/search.html?q=lv_list_add_text)|lv.obj, string|lv.obj
get_button_text|[lv_list_get_button_text](https://docs.lvgl.io/9.0/search.html?q=lv_list_get_button_text)|lv.obj, lv.obj|s
set_btn_text|[lv_list_set_button_text](https://docs.lvgl.io/9.0/search.html?q=lv_list_set_button_text)|lv.obj, lv.obj, string|
set_button_text|[lv_list_set_button_text](https://docs.lvgl.io/9.0/search.html?q=lv_list_set_button_text)|lv.obj, lv.obj, string|

### widget `lv.qrcode`

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
set_dark_color|[lv_qrcode_set_dark_color](https://docs.lvgl.io/9.0/search.html?q=lv_qrcode_set_dark_color)|lv.obj, lv.color|
set_light_color|[lv_qrcode_set_light_color](https://docs.lvgl.io/9.0/search.html?q=lv_qrcode_set_light_color)|lv.obj, lv.color|
set_size|[lv_qrcode_set_size](https://docs.lvgl.io/9.0/search.html?q=lv_qrcode_set_size)|lv.obj, int|
update|[lv_qrcode_update](https://docs.lvgl.io/9.0/search.html?q=lv_qrcode_update)|lv.obj, \<any\>, int|i

