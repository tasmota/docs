# LVGL API Reference

[//]: # (**********************************************************************)
[//]: # (* Generated code, don't edit                                         *)
[//]: # (**********************************************************************)


## Core classes

### `lv_anim` class

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
custom_delete|lv_anim_custom_delete|"(lv.lv_anim)c"|b
custom_get|lv_anim_custom_get|"(lv.lv_anim)c"|lv.lv_anim
get_delay|lv_anim_get_delay|"(lv.lv_anim)"|i
get_playtime|lv_anim_get_playtime|"(lv.lv_anim)"|i
get_repeat_count|lv_anim_get_repeat_count|"(lv.lv_anim)"|i
get_time|lv_anim_get_time|"(lv.lv_anim)"|i
get_user_data|lv_anim_get_user_data|"(lv.lv_anim)"|.
init|lv_anim_init|"(lv.lv_anim)"|
set_bezier3_param|lv_anim_set_bezier3_param|"(lv.lv_anim)iiii"|
set_completed_cb|lv_anim_set_completed_cb|"(lv.lv_anim)c"|
set_custom_exec_cb|lv_anim_set_custom_exec_cb|"(lv.lv_anim)c"|
set_delay|lv_anim_set_delay|"(lv.lv_anim)i"|
set_deleted_cb|lv_anim_set_deleted_cb|"(lv.lv_anim)^lv_anim_deleted_cb^"|
set_duration|lv_anim_set_duration|"(lv.lv_anim)i"|
set_early_apply|lv_anim_set_early_apply|"(lv.lv_anim)b"|
set_exec_cb|lv_anim_set_exec_cb|"(lv.lv_anim)c"|
set_get_value_cb|lv_anim_set_get_value_cb|"(lv.lv_anim)c"|
set_path_cb|lv_anim_set_path_cb|"(lv.lv_anim)c"|
set_playback_delay|lv_anim_set_playback_delay|"(lv.lv_anim)i"|
set_playback_duration|lv_anim_set_playback_duration|"(lv.lv_anim)i"|
set_playback_time|lv_anim_set_playback_time|"(lv.lv_anim)i"|
set_ready_cb|lv_anim_set_completed_cb|"(lv.lv_anim)c"|
set_repeat_count|lv_anim_set_repeat_count|"(lv.lv_anim)i"|
set_repeat_delay|lv_anim_set_repeat_delay|"(lv.lv_anim)i"|
set_start_cb|lv_anim_set_start_cb|"(lv.lv_anim)c"|
set_time|lv_anim_set_time|"(lv.lv_anim)i"|
set_user_data|lv_anim_set_user_data|"(lv.lv_anim)."|
set_values|lv_anim_set_values|"(lv.lv_anim)ii"|
set_var|lv_anim_set_var|"(lv.lv_anim)."|
start|lv_anim_start|"(lv.lv_anim)"|lv.lv_anim

## `lv_display` class

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_event_cb|lv_display_add_event_cb|"(lv.lv_display)^lv_event_cb^i."|
del|lv_display_delete|"(lv.lv_display)"|
delete|lv_display_delete|"(lv.lv_display)"|
delete_event|lv_display_delete_event|"(lv.lv_display)i"|b
delete_refr_timer|lv_display_delete_refr_timer|"(lv.lv_display)"|
dpx|lv_display_dpx|"(lv.lv_display)i"|i
enable_invalidation|lv_display_enable_invalidation|"(lv.lv_display)b"|
enable_invalidation|lv_display_enable_invalidation|"(lv.lv_display)b"|
get_angle|lv_display_get_rotation|"(lv.lv_display)"|i
get_antialiasing|lv_display_get_antialiasing|"(lv.lv_display)"|b
get_antialiasing|lv_display_get_antialiasing|"(lv.lv_display)"|b
get_color_format|lv_display_get_color_format|"(lv.lv_display)"|i
get_dpi|lv_display_get_dpi|"(lv.lv_display)"|i
get_dpi|lv_display_get_dpi|"(lv.lv_display)"|i
get_driver_data|lv_display_get_driver_data|"(lv.lv_display)"|.
get_event_count|lv_display_get_event_count|"(lv.lv_display)"|i
get_hor_res|lv_display_get_horizontal_resolution|"(lv.lv_display)"|i
get_horizontal_resolution|lv_display_get_horizontal_resolution|"(lv.lv_display)"|i
get_inactive_time|lv_display_get_inactive_time|"(lv.lv_display)"|i
get_inactive_time|lv_display_get_inactive_time|"(lv.lv_display)"|i
get_layer_bottom|lv_display_get_layer_bottom|"(lv.lv_display)"|lv.lv_obj
get_layer_sys|lv_display_get_layer_sys|"(lv.lv_display)"|lv.lv_obj
get_layer_sys|lv_display_get_layer_sys|"(lv.lv_display)"|lv.lv_obj
get_layer_top|lv_display_get_layer_top|"(lv.lv_display)"|lv.lv_obj
get_layer_top|lv_display_get_layer_top|"(lv.lv_display)"|lv.lv_obj
get_next|lv_display_get_next|"(lv.lv_display)"|lv.lv_display
get_next|lv_display_get_next|"(lv.lv_display)"|lv.lv_display
get_offset_x|lv_display_get_offset_x|"(lv.lv_display)"|i
get_offset_x|lv_display_get_offset_x|"(lv.lv_display)"|i
get_offset_y|lv_display_get_offset_y|"(lv.lv_display)"|i
get_offset_y|lv_display_get_offset_y|"(lv.lv_display)"|i
get_physical_hor_res|lv_display_get_physical_horizontal_resolution|"(lv.lv_display)"|i
get_physical_horizontal_resolution|lv_display_get_physical_horizontal_resolution|"(lv.lv_display)"|i
get_physical_ver_res|lv_display_get_physical_vertical_resolution|"(lv.lv_display)"|i
get_physical_vertical_resolution|lv_display_get_physical_vertical_resolution|"(lv.lv_display)"|i
get_refr_timer|lv_display_get_refr_timer|"(lv.lv_display)"|lv.lv_timer
get_rotation|lv_display_get_rotation|"(lv.lv_display)"|i
get_rotation|lv_display_get_rotation|"(lv.lv_display)"|i
get_scr_act|lv_display_get_screen_active|"(lv.lv_display)"|lv.lv_obj
get_scr_prev|lv_display_get_screen_prev|"(lv.lv_display)"|lv.lv_obj
get_screen_active|lv_display_get_screen_active|"(lv.lv_display)"|lv.lv_obj
get_screen_prev|lv_display_get_screen_prev|"(lv.lv_display)"|lv.lv_obj
get_theme|lv_display_get_theme|"(lv.lv_display)"|lv.lv_theme
get_theme|lv_display_get_theme|"(lv.lv_display)"|lv.lv_theme
get_user_data|lv_display_get_user_data|"(lv.lv_display)"|.
get_ver_res|lv_display_get_vertical_resolution|"(lv.lv_display)"|i
get_vertical_resolution|lv_display_get_vertical_resolution|"(lv.lv_display)"|i
is_double_buffered|lv_display_is_double_buffered|"(lv.lv_display)"|b
is_invalidation_enabled|lv_display_is_invalidation_enabled|"(lv.lv_display)"|b
is_invalidation_enabled|lv_display_is_invalidation_enabled|"(lv.lv_display)"|b
remove|lv_display_delete|"(lv.lv_display)"|
remove_event_cb_with_user_data|lv_display_remove_event_cb_with_user_data|"(lv.lv_display).."|i
send_event|lv_display_send_event|"(lv.lv_display)i."|i
send_event|lv_display_send_event|"(lv.lv_display)i."|i
set_angle|lv_display_set_rotation|"(lv.lv_display)i"|
set_antialiasing|lv_display_set_antialiasing|"(lv.lv_display)b"|
set_buffers|lv_display_set_buffers|"(lv.lv_display)..i(lv.lv_display_render_mode)"|
set_color_format|lv_display_set_color_format|"(lv.lv_display)i"|
set_default|lv_display_set_default|"(lv.lv_display)"|
set_default|lv_display_set_default|"(lv.lv_display)"|
set_dpi|lv_display_set_dpi|"(lv.lv_display)i"|
set_draw_buffers|lv_display_set_draw_buffers|"(lv.lv_display)(lv.lv_draw_buf)(lv.lv_draw_buf)"|
set_driver_data|lv_display_set_driver_data|"(lv.lv_display)."|
set_flush_cb|lv_display_set_flush_cb|"(lv.lv_display)^lv_display_flush_cb^"|
set_flush_wait_cb|lv_display_set_flush_wait_cb|"(lv.lv_display)^lv_display_flush_wait_cb^"|
set_offset|lv_display_set_offset|"(lv.lv_display)ii"|
set_physical_resolution|lv_display_set_physical_resolution|"(lv.lv_display)ii"|
set_render_mode|lv_display_set_render_mode|"(lv.lv_display)(lv.lv_display_render_mode)"|
set_resolution|lv_display_set_resolution|"(lv.lv_display)ii"|
set_rotation|lv_display_set_rotation|"(lv.lv_display)i"|
set_rotation|lv_display_set_rotation|"(lv.lv_display)i"|
set_theme|lv_display_set_theme|"(lv.lv_display)(lv.lv_theme)"|
set_theme|lv_display_set_theme|"(lv.lv_display)(lv.lv_theme)"|
set_user_data|lv_display_set_user_data|"(lv.lv_display)."|
trig_activity|lv_display_trigger_activity|"(lv.lv_display)"|
trigger_activity|lv_display_trigger_activity|"(lv.lv_display)"|

## `lv_group` class

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_obj|lv_group_add_obj|"(lv.lv_group)(lv.lv_obj)"|
del|lv_group_delete|"(lv.lv_group)"|
delete|lv_group_delete|"(lv.lv_group)"|
focus_freeze|lv_group_focus_freeze|"(lv.lv_group)b"|
focus_next|lv_group_focus_next|"(lv.lv_group)"|
focus_obj|lv_group_focus_obj|"(lv.lv_obj)"|
focus_prev|lv_group_focus_prev|"(lv.lv_group)"|
get_edge_cb|lv_group_get_edge_cb|"(lv.lv_group)"|C
get_editing|lv_group_get_editing|"(lv.lv_group)"|b
get_focus_cb|lv_group_get_focus_cb|"(lv.lv_group)"|lv.lv_group_focus_cb
get_focused|lv_group_get_focused|"(lv.lv_group)"|lv.lv_obj
get_obj_count|lv_group_get_obj_count|"(lv.lv_group)"|i
get_wrap|lv_group_get_wrap|"(lv.lv_group)"|b
remove|lv_group_delete|"(lv.lv_group)"|
remove_all_objs|lv_group_remove_all_objs|"(lv.lv_group)"|
remove_obj|lv_group_remove_obj|"(lv.lv_obj)"|
send_data|lv_group_send_data|"(lv.lv_group)i"|i
set_default|lv_group_set_default|"(lv.lv_group)"|
set_default|lv_group_set_default|"(lv.lv_group)"|
set_edge_cb|lv_group_set_edge_cb|"(lv.lv_group)^lv_group_edge_cb^"|
set_editing|lv_group_set_editing|"(lv.lv_group)b"|
set_focus_cb|lv_group_set_focus_cb|"(lv.lv_group)^lv_group_focus_cb^"|
set_refocus_policy|lv_group_set_refocus_policy|"(lv.lv_group)i"|
set_wrap|lv_group_set_wrap|"(lv.lv_group)b"|
swap_obj|lv_group_swap_obj|"(lv.lv_obj)(lv.lv_obj)"|

## `lv_obj` class

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_event_cb|lv_obj_add_event_cb|"(lv.lv_obj)^lv_event_cb^i."|
add_flag|lv_obj_add_flag|"(lv.lv_obj)i"|
add_state|lv_obj_add_state|"(lv.lv_obj)i"|
add_style|lv_obj_add_style|"(lv.lv_obj)(lv.lv_style)i"|
align|lv_obj_align|"(lv.lv_obj)iii"|
align_to|lv_obj_align_to|"(lv.lv_obj)(lv.lv_obj)iii"|
allocate_spec_attr|lv_obj_allocate_spec_attr|"(lv.lv_obj)"|
area_is_visible|lv_obj_area_is_visible|"(lv.lv_obj)(lv.lv_area)"|b
calculate_ext_draw_size|lv_obj_calculate_ext_draw_size|"(lv.lv_obj)i"|i
calculate_style_text_align|lv_obj_calculate_style_text_align|"(lv.lv_obj)is"|i
center|lv_obj_center|"(lv.lv_obj)"|
check_type|lv_obj_check_type|"(lv.lv_obj)(lv.lv_obj_class)"|b
class_init_obj|lv_obj_class_init_obj|"(lv.lv_obj)"|
clean|lv_obj_clean|"(lv.lv_obj)"|
clear_flag|lv_obj_remove_flag|"(lv.lv_obj)i"|
clear_state|lv_obj_remove_state|"(lv.lv_obj)i"|
del|lv_obj_delete|"(lv.lv_obj)"|
del_async|lv_obj_delete_async|"(lv.lv_obj)"|
delete|lv_obj_delete|"(lv.lv_obj)"|
delete_async|lv_obj_delete_async|"(lv.lv_obj)"|
delete_delayed|lv_obj_delete_delayed|"(lv.lv_obj)i"|
dump_tree|lv_obj_dump_tree|"(lv.lv_obj)"|
fade_in|lv_obj_fade_in|"(lv.lv_obj)ii"|
fade_out|lv_obj_fade_out|"(lv.lv_obj)ii"|
free_id|lv_obj_free_id|"(lv.lv_obj)"|
get_child|lv_obj_get_child|"(lv.lv_obj)i"|lv.lv_obj
get_child_by_type|lv_obj_get_child_by_type|"(lv.lv_obj)i(lv.lv_obj_class)"|lv.lv_obj
get_child_cnt|lv_obj_get_child_count|"(lv.lv_obj)"|i
get_child_count|lv_obj_get_child_count|"(lv.lv_obj)"|i
get_child_count_by_type|lv_obj_get_child_count_by_type|"(lv.lv_obj)(lv.lv_obj_class)"|i
get_class|lv_obj_get_class|"(lv.lv_obj)"|lv.lv_obj_class
get_click_area|lv_obj_get_click_area|"(lv.lv_obj)(lv.lv_area)"|
get_content_coords|lv_obj_get_content_coords|"(lv.lv_obj)(lv.lv_area)"|
get_content_height|lv_obj_get_content_height|"(lv.lv_obj)"|i
get_content_width|lv_obj_get_content_width|"(lv.lv_obj)"|i
get_coords|lv_obj_get_coords|"(lv.lv_obj)(lv.lv_area)"|
get_disp|lv_obj_get_display|"(lv.lv_obj)"|lv.lv_display
get_display|lv_obj_get_display|"(lv.lv_obj)"|lv.lv_display
get_event_count|lv_obj_get_event_count|"(lv.lv_obj)"|i
get_group|lv_obj_get_group|"(lv.lv_obj)"|lv.lv_group
get_height|lv_obj_get_height|"(lv.lv_obj)"|i
get_index|lv_obj_get_index|"(lv.lv_obj)"|i
get_index_by_type|lv_obj_get_index_by_type|"(lv.lv_obj)(lv.lv_obj_class)"|i
get_local_style_prop|lv_obj_get_local_style_prop|"(lv.lv_obj)i(lv.lv_style_value)i"|i
get_parent|lv_obj_get_parent|"(lv.lv_obj)"|lv.lv_obj
get_screen|lv_obj_get_screen|"(lv.lv_obj)"|lv.lv_obj
get_scroll_bottom|lv_obj_get_scroll_bottom|"(lv.lv_obj)"|i
get_scroll_dir|lv_obj_get_scroll_dir|"(lv.lv_obj)"|i
get_scroll_end|lv_obj_get_scroll_end|"(lv.lv_obj)(lv.lv_point)"|
get_scroll_left|lv_obj_get_scroll_left|"(lv.lv_obj)"|i
get_scroll_right|lv_obj_get_scroll_right|"(lv.lv_obj)"|i
get_scroll_snap_x|lv_obj_get_scroll_snap_x|"(lv.lv_obj)"|i
get_scroll_snap_y|lv_obj_get_scroll_snap_y|"(lv.lv_obj)"|i
get_scroll_top|lv_obj_get_scroll_top|"(lv.lv_obj)"|i
get_scroll_x|lv_obj_get_scroll_x|"(lv.lv_obj)"|i
get_scroll_y|lv_obj_get_scroll_y|"(lv.lv_obj)"|i
get_scrollbar_area|lv_obj_get_scrollbar_area|"(lv.lv_obj)(lv.lv_area)(lv.lv_area)"|
get_scrollbar_mode|lv_obj_get_scrollbar_mode|"(lv.lv_obj)"|i
get_self_height|lv_obj_get_self_height|"(lv.lv_obj)"|i
get_self_width|lv_obj_get_self_width|"(lv.lv_obj)"|i
get_sibling|lv_obj_get_sibling|"(lv.lv_obj)i"|lv.lv_obj
get_sibling_by_type|lv_obj_get_sibling_by_type|"(lv.lv_obj)i(lv.lv_obj_class)"|lv.lv_obj
get_state|lv_obj_get_state|"(lv.lv_obj)"|i
get_style_align|lv_obj_get_style_align|"(lv.lv_obj)i"|i
get_style_anim|lv_obj_get_style_anim|"(lv.lv_obj)i"|lv.lv_anim
get_style_anim_duration|lv_obj_get_style_anim_duration|"(lv.lv_obj)i"|i
get_style_anim_time|lv_obj_get_style_anim_duration|"(lv.lv_obj)i"|i
get_style_arc_color|lv_obj_get_style_arc_color|"(lv.lv_obj)i"|lv.lv_color
get_style_arc_color_filtered|lv_obj_get_style_arc_color_filtered|"(lv.lv_obj)i"|lv.lv_color
get_style_arc_image_src|lv_obj_get_style_arc_image_src|"(lv.lv_obj)i"|.
get_style_arc_opa|lv_obj_get_style_arc_opa|"(lv.lv_obj)i"|i
get_style_arc_rounded|lv_obj_get_style_arc_rounded|"(lv.lv_obj)i"|b
get_style_arc_width|lv_obj_get_style_arc_width|"(lv.lv_obj)i"|i
get_style_base_dir|lv_obj_get_style_base_dir|"(lv.lv_obj)i"|i
get_style_bg_color|lv_obj_get_style_bg_color|"(lv.lv_obj)i"|lv.lv_color
get_style_bg_color_filtered|lv_obj_get_style_bg_color_filtered|"(lv.lv_obj)i"|lv.lv_color
get_style_bg_grad|lv_obj_get_style_bg_grad|"(lv.lv_obj)i"|lv.lv_grad_dsc
get_style_bg_grad_color|lv_obj_get_style_bg_grad_color|"(lv.lv_obj)i"|lv.lv_color
get_style_bg_grad_color_filtered|lv_obj_get_style_bg_grad_color_filtered|"(lv.lv_obj)i"|lv.lv_color
get_style_bg_grad_dir|lv_obj_get_style_bg_grad_dir|"(lv.lv_obj)i"|i
get_style_bg_grad_opa|lv_obj_get_style_bg_grad_opa|"(lv.lv_obj)i"|i
get_style_bg_grad_stop|lv_obj_get_style_bg_grad_stop|"(lv.lv_obj)i"|i
get_style_bg_image_opa|lv_obj_get_style_bg_image_opa|"(lv.lv_obj)i"|i
get_style_bg_image_recolor|lv_obj_get_style_bg_image_recolor|"(lv.lv_obj)i"|lv.lv_color
get_style_bg_image_recolor_filtered|lv_obj_get_style_bg_image_recolor_filtered|"(lv.lv_obj)i"|lv.lv_color
get_style_bg_image_recolor_opa|lv_obj_get_style_bg_image_recolor_opa|"(lv.lv_obj)i"|i
get_style_bg_image_src|lv_obj_get_style_bg_image_src|"(lv.lv_obj)i"|.
get_style_bg_image_tiled|lv_obj_get_style_bg_image_tiled|"(lv.lv_obj)i"|b
get_style_bg_main_opa|lv_obj_get_style_bg_main_opa|"(lv.lv_obj)i"|i
get_style_bg_main_stop|lv_obj_get_style_bg_main_stop|"(lv.lv_obj)i"|i
get_style_bg_opa|lv_obj_get_style_bg_opa|"(lv.lv_obj)i"|i
get_style_blend_mode|lv_obj_get_style_blend_mode|"(lv.lv_obj)i"|i
get_style_border_color|lv_obj_get_style_border_color|"(lv.lv_obj)i"|lv.lv_color
get_style_border_color_filtered|lv_obj_get_style_border_color_filtered|"(lv.lv_obj)i"|lv.lv_color
get_style_border_opa|lv_obj_get_style_border_opa|"(lv.lv_obj)i"|i
get_style_border_post|lv_obj_get_style_border_post|"(lv.lv_obj)i"|b
get_style_border_side|lv_obj_get_style_border_side|"(lv.lv_obj)i"|i
get_style_border_width|lv_obj_get_style_border_width|"(lv.lv_obj)i"|i
get_style_clip_corner|lv_obj_get_style_clip_corner|"(lv.lv_obj)i"|b
get_style_color_filter_dsc|lv_obj_get_style_color_filter_dsc|"(lv.lv_obj)i"|lv.lv_color_filter_dsc
get_style_color_filter_opa|lv_obj_get_style_color_filter_opa|"(lv.lv_obj)i"|i
get_style_flex_cross_place|lv_obj_get_style_flex_cross_place|"(lv.lv_obj)i"|i
get_style_flex_flow|lv_obj_get_style_flex_flow|"(lv.lv_obj)i"|i
get_style_flex_grow|lv_obj_get_style_flex_grow|"(lv.lv_obj)i"|i
get_style_flex_main_place|lv_obj_get_style_flex_main_place|"(lv.lv_obj)i"|i
get_style_flex_track_place|lv_obj_get_style_flex_track_place|"(lv.lv_obj)i"|i
get_style_grid_cell_column_pos|lv_obj_get_style_grid_cell_column_pos|"(lv.lv_obj)i"|i
get_style_grid_cell_column_span|lv_obj_get_style_grid_cell_column_span|"(lv.lv_obj)i"|i
get_style_grid_cell_row_pos|lv_obj_get_style_grid_cell_row_pos|"(lv.lv_obj)i"|i
get_style_grid_cell_row_span|lv_obj_get_style_grid_cell_row_span|"(lv.lv_obj)i"|i
get_style_grid_cell_x_align|lv_obj_get_style_grid_cell_x_align|"(lv.lv_obj)i"|i
get_style_grid_cell_y_align|lv_obj_get_style_grid_cell_y_align|"(lv.lv_obj)i"|i
get_style_grid_column_align|lv_obj_get_style_grid_column_align|"(lv.lv_obj)i"|i
get_style_grid_column_dsc_array|lv_obj_get_style_grid_column_dsc_array|"(lv.lv_obj)i"|lv.lv_int_arr
get_style_grid_row_align|lv_obj_get_style_grid_row_align|"(lv.lv_obj)i"|i
get_style_grid_row_dsc_array|lv_obj_get_style_grid_row_dsc_array|"(lv.lv_obj)i"|lv.lv_int_arr
get_style_height|lv_obj_get_style_height|"(lv.lv_obj)i"|i
get_style_image_opa|lv_obj_get_style_image_opa|"(lv.lv_obj)i"|i
get_style_image_recolor|lv_obj_get_style_image_recolor|"(lv.lv_obj)i"|lv.lv_color
get_style_image_recolor_filtered|lv_obj_get_style_image_recolor_filtered|"(lv.lv_obj)i"|lv.lv_color
get_style_image_recolor_opa|lv_obj_get_style_image_recolor_opa|"(lv.lv_obj)i"|i
get_style_img_opa|lv_obj_get_style_image_opa|"(lv.lv_obj)i"|i
get_style_img_recolor|lv_obj_get_style_image_recolor|"(lv.lv_obj)i"|lv.lv_color
get_style_img_recolor_filtered|lv_obj_get_style_image_recolor_filtered|"(lv.lv_obj)i"|lv.lv_color
get_style_img_recolor_opa|lv_obj_get_style_image_recolor_opa|"(lv.lv_obj)i"|i
get_style_layout|lv_obj_get_style_layout|"(lv.lv_obj)i"|i
get_style_length|lv_obj_get_style_length|"(lv.lv_obj)i"|i
get_style_line_color|lv_obj_get_style_line_color|"(lv.lv_obj)i"|lv.lv_color
get_style_line_color_filtered|lv_obj_get_style_line_color_filtered|"(lv.lv_obj)i"|lv.lv_color
get_style_line_dash_gap|lv_obj_get_style_line_dash_gap|"(lv.lv_obj)i"|i
get_style_line_dash_width|lv_obj_get_style_line_dash_width|"(lv.lv_obj)i"|i
get_style_line_opa|lv_obj_get_style_line_opa|"(lv.lv_obj)i"|i
get_style_line_rounded|lv_obj_get_style_line_rounded|"(lv.lv_obj)i"|b
get_style_line_width|lv_obj_get_style_line_width|"(lv.lv_obj)i"|i
get_style_margin_bottom|lv_obj_get_style_margin_bottom|"(lv.lv_obj)i"|i
get_style_margin_left|lv_obj_get_style_margin_left|"(lv.lv_obj)i"|i
get_style_margin_right|lv_obj_get_style_margin_right|"(lv.lv_obj)i"|i
get_style_margin_top|lv_obj_get_style_margin_top|"(lv.lv_obj)i"|i
get_style_max_height|lv_obj_get_style_max_height|"(lv.lv_obj)i"|i
get_style_max_width|lv_obj_get_style_max_width|"(lv.lv_obj)i"|i
get_style_min_height|lv_obj_get_style_min_height|"(lv.lv_obj)i"|i
get_style_min_width|lv_obj_get_style_min_width|"(lv.lv_obj)i"|i
get_style_opa|lv_obj_get_style_opa|"(lv.lv_obj)i"|i
get_style_opa_layered|lv_obj_get_style_opa_layered|"(lv.lv_obj)i"|i
get_style_opa_recursive|lv_obj_get_style_opa_recursive|"(lv.lv_obj)i"|i
get_style_outline_color|lv_obj_get_style_outline_color|"(lv.lv_obj)i"|lv.lv_color
get_style_outline_color_filtered|lv_obj_get_style_outline_color_filtered|"(lv.lv_obj)i"|lv.lv_color
get_style_outline_opa|lv_obj_get_style_outline_opa|"(lv.lv_obj)i"|i
get_style_outline_pad|lv_obj_get_style_outline_pad|"(lv.lv_obj)i"|i
get_style_outline_width|lv_obj_get_style_outline_width|"(lv.lv_obj)i"|i
get_style_pad_bottom|lv_obj_get_style_pad_bottom|"(lv.lv_obj)i"|i
get_style_pad_column|lv_obj_get_style_pad_column|"(lv.lv_obj)i"|i
get_style_pad_left|lv_obj_get_style_pad_left|"(lv.lv_obj)i"|i
get_style_pad_right|lv_obj_get_style_pad_right|"(lv.lv_obj)i"|i
get_style_pad_row|lv_obj_get_style_pad_row|"(lv.lv_obj)i"|i
get_style_pad_top|lv_obj_get_style_pad_top|"(lv.lv_obj)i"|i
get_style_prop|lv_obj_get_style_prop|"(lv.lv_obj)ii"|i
get_style_radius|lv_obj_get_style_radius|"(lv.lv_obj)i"|i
get_style_shadow_color|lv_obj_get_style_shadow_color|"(lv.lv_obj)i"|lv.lv_color
get_style_shadow_color_filtered|lv_obj_get_style_shadow_color_filtered|"(lv.lv_obj)i"|lv.lv_color
get_style_shadow_offset_x|lv_obj_get_style_shadow_offset_x|"(lv.lv_obj)i"|i
get_style_shadow_offset_y|lv_obj_get_style_shadow_offset_y|"(lv.lv_obj)i"|i
get_style_shadow_ofs_x|lv_obj_get_style_shadow_offset_x|"(lv.lv_obj)i"|i
get_style_shadow_ofs_y|lv_obj_get_style_shadow_offset_y|"(lv.lv_obj)i"|i
get_style_shadow_opa|lv_obj_get_style_shadow_opa|"(lv.lv_obj)i"|i
get_style_shadow_spread|lv_obj_get_style_shadow_spread|"(lv.lv_obj)i"|i
get_style_shadow_width|lv_obj_get_style_shadow_width|"(lv.lv_obj)i"|i
get_style_space_bottom|lv_obj_get_style_space_bottom|"(lv.lv_obj)i"|i
get_style_space_left|lv_obj_get_style_space_left|"(lv.lv_obj)i"|i
get_style_space_right|lv_obj_get_style_space_right|"(lv.lv_obj)i"|i
get_style_space_top|lv_obj_get_style_space_top|"(lv.lv_obj)i"|i
get_style_text_align|lv_obj_get_style_text_align|"(lv.lv_obj)i"|i
get_style_text_color|lv_obj_get_style_text_color|"(lv.lv_obj)i"|lv.lv_color
get_style_text_color_filtered|lv_obj_get_style_text_color_filtered|"(lv.lv_obj)i"|lv.lv_color
get_style_text_decor|lv_obj_get_style_text_decor|"(lv.lv_obj)i"|i
get_style_text_font|lv_obj_get_style_text_font|"(lv.lv_obj)i"|lv.lv_font
get_style_text_letter_space|lv_obj_get_style_text_letter_space|"(lv.lv_obj)i"|i
get_style_text_line_space|lv_obj_get_style_text_line_space|"(lv.lv_obj)i"|i
get_style_text_opa|lv_obj_get_style_text_opa|"(lv.lv_obj)i"|i
get_style_transform_angle|lv_obj_get_style_transform_rotation|"(lv.lv_obj)i"|i
get_style_transform_height|lv_obj_get_style_transform_height|"(lv.lv_obj)i"|i
get_style_transform_pivot_x|lv_obj_get_style_transform_pivot_x|"(lv.lv_obj)i"|i
get_style_transform_pivot_y|lv_obj_get_style_transform_pivot_y|"(lv.lv_obj)i"|i
get_style_transform_rotation|lv_obj_get_style_transform_rotation|"(lv.lv_obj)i"|i
get_style_transform_scale_x|lv_obj_get_style_transform_scale_x|"(lv.lv_obj)i"|i
get_style_transform_scale_x_safe|lv_obj_get_style_transform_scale_x_safe|"(lv.lv_obj)i"|i
get_style_transform_scale_y|lv_obj_get_style_transform_scale_y|"(lv.lv_obj)i"|i
get_style_transform_scale_y_safe|lv_obj_get_style_transform_scale_y_safe|"(lv.lv_obj)i"|i
get_style_transform_skew_x|lv_obj_get_style_transform_skew_x|"(lv.lv_obj)i"|i
get_style_transform_skew_y|lv_obj_get_style_transform_skew_y|"(lv.lv_obj)i"|i
get_style_transform_width|lv_obj_get_style_transform_width|"(lv.lv_obj)i"|i
get_style_transition|lv_obj_get_style_transition|"(lv.lv_obj)i"|lv.lv_style_transition_dsc
get_style_translate_x|lv_obj_get_style_translate_x|"(lv.lv_obj)i"|i
get_style_translate_y|lv_obj_get_style_translate_y|"(lv.lv_obj)i"|i
get_style_width|lv_obj_get_style_width|"(lv.lv_obj)i"|i
get_style_x|lv_obj_get_style_x|"(lv.lv_obj)i"|i
get_style_y|lv_obj_get_style_y|"(lv.lv_obj)i"|i
get_transformed_area|lv_obj_get_transformed_area|"(lv.lv_obj)(lv.lv_area)bb"|
get_user_data|lv_obj_get_user_data|"(lv.lv_obj)"|.
get_width|lv_obj_get_width|"(lv.lv_obj)"|i
get_width|lv_obj_get_width|"(lv.lv_obj)"|i
get_x|lv_obj_get_x|"(lv.lv_obj)"|i
get_x2|lv_obj_get_x2|"(lv.lv_obj)"|i
get_x_aligned|lv_obj_get_x_aligned|"(lv.lv_obj)"|i
get_y|lv_obj_get_y|"(lv.lv_obj)"|i
get_y2|lv_obj_get_y2|"(lv.lv_obj)"|i
get_y_aligned|lv_obj_get_y_aligned|"(lv.lv_obj)"|i
has_class|lv_obj_has_class|"(lv.lv_obj)(lv.lv_obj_class)"|b
has_flag|lv_obj_has_flag|"(lv.lv_obj)i"|b
has_flag_any|lv_obj_has_flag_any|"(lv.lv_obj)i"|b
has_state|lv_obj_has_state|"(lv.lv_obj)i"|b
has_style_prop|lv_obj_has_style_prop|"(lv.lv_obj)ii"|b
hit_test|lv_obj_hit_test|"(lv.lv_obj)(lv.lv_point)"|b
init_draw_arc_dsc|lv_obj_init_draw_arc_dsc|"(lv.lv_obj)i(lv.lv_draw_arc_dsc)"|
init_draw_image_dsc|lv_obj_init_draw_image_dsc|"(lv.lv_obj)i(lv.lv_draw_image_dsc)"|
init_draw_label_dsc|lv_obj_init_draw_label_dsc|"(lv.lv_obj)i(lv.lv_draw_label_dsc)"|
init_draw_line_dsc|lv_obj_init_draw_line_dsc|"(lv.lv_obj)i(lv.lv_draw_line_dsc)"|
init_draw_rect_dsc|lv_obj_init_draw_rect_dsc|"(lv.lv_obj)i(lv.lv_draw_rect_dsc)"|
invalidate|lv_obj_invalidate|"(lv.lv_obj)"|
invalidate_area|lv_obj_invalidate_area|"(lv.lv_obj)(lv.lv_area)"|
is_editable|lv_obj_is_editable|"(lv.lv_obj)"|b
is_group_def|lv_obj_is_group_def|"(lv.lv_obj)"|b
is_layout_positioned|lv_obj_is_layout_positioned|"(lv.lv_obj)"|b
is_scrolling|lv_obj_is_scrolling|"(lv.lv_obj)"|b
is_valid|lv_obj_is_valid|"(lv.lv_obj)"|b
is_visible|lv_obj_is_visible|"(lv.lv_obj)"|b
mark_layout_as_dirty|lv_obj_mark_layout_as_dirty|"(lv.lv_obj)"|
move_background|lv_obj_move_background|"(lv.lv_obj)"|
move_children_by|lv_obj_move_children_by|"(lv.lv_obj)iib"|
move_foreground|lv_obj_move_foreground|"(lv.lv_obj)"|
move_to|lv_obj_move_to|"(lv.lv_obj)ii"|
move_to_index|lv_obj_move_to_index|"(lv.lv_obj)i"|
readjust_scroll|lv_obj_readjust_scroll|"(lv.lv_obj)i"|
refr_pos|lv_obj_refr_pos|"(lv.lv_obj)"|
refr_size|lv_obj_refr_size|"(lv.lv_obj)"|b
refresh_ext_draw_size|lv_obj_refresh_ext_draw_size|"(lv.lv_obj)"|
refresh_self_size|lv_obj_refresh_self_size|"(lv.lv_obj)"|b
refresh_style|lv_obj_refresh_style|"(lv.lv_obj)ii"|
remove|lv_obj_delete|"(lv.lv_obj)"|
remove_event|lv_obj_remove_event|"(lv.lv_obj)i"|b
remove_event_cb|lv_obj_remove_event_cb|"(lv.lv_obj)."|b
remove_event_cb_with_user_data|lv_obj_remove_event_cb_with_user_data|"(lv.lv_obj).."|i
remove_flag|lv_obj_remove_flag|"(lv.lv_obj)i"|
remove_local_style_prop|lv_obj_remove_local_style_prop|"(lv.lv_obj)ii"|b
remove_state|lv_obj_remove_state|"(lv.lv_obj)i"|
remove_style|lv_obj_remove_style|"(lv.lv_obj)(lv.lv_style)i"|
remove_style_all|lv_obj_remove_style_all|"(lv.lv_obj)"|
replace_style|lv_obj_replace_style|"(lv.lv_obj)(lv.lv_style)(lv.lv_style)i"|b
scroll_by|lv_obj_scroll_by|"(lv.lv_obj)iii"|
scroll_by_bounded|lv_obj_scroll_by_bounded|"(lv.lv_obj)iii"|
scroll_to|lv_obj_scroll_to|"(lv.lv_obj)iii"|
scroll_to_view|lv_obj_scroll_to_view|"(lv.lv_obj)i"|
scroll_to_view_recursive|lv_obj_scroll_to_view_recursive|"(lv.lv_obj)i"|
scroll_to_x|lv_obj_scroll_to_x|"(lv.lv_obj)ii"|
scroll_to_y|lv_obj_scroll_to_y|"(lv.lv_obj)ii"|
scrollbar_invalidate|lv_obj_scrollbar_invalidate|"(lv.lv_obj)"|
send_event|lv_obj_send_event|"(lv.lv_obj)i."|i
send_event|lv_obj_send_event|"(lv.lv_obj)i."|i
set_align|lv_obj_set_align|"(lv.lv_obj)i"|
set_content_height|lv_obj_set_content_height|"(lv.lv_obj)i"|
set_content_width|lv_obj_set_content_width|"(lv.lv_obj)i"|
set_ext_click_area|lv_obj_set_ext_click_area|"(lv.lv_obj)i"|
set_height|lv_obj_set_height|"(lv.lv_obj)i"|
set_layout|lv_obj_set_layout|"(lv.lv_obj)i"|
set_local_style_prop|lv_obj_set_local_style_prop|"(lv.lv_obj)iii"|
set_parent|lv_obj_set_parent|"(lv.lv_obj)(lv.lv_obj)"|
set_pos|lv_obj_set_pos|"(lv.lv_obj)ii"|
set_scroll_dir|lv_obj_set_scroll_dir|"(lv.lv_obj)i"|
set_scroll_snap_x|lv_obj_set_scroll_snap_x|"(lv.lv_obj)i"|
set_scroll_snap_y|lv_obj_set_scroll_snap_y|"(lv.lv_obj)i"|
set_scrollbar_mode|lv_obj_set_scrollbar_mode|"(lv.lv_obj)i"|
set_size|lv_obj_set_size|"(lv.lv_obj)ii"|
set_state|lv_obj_set_state|"(lv.lv_obj)ib"|
set_style_align|lv_obj_set_style_align|"(lv.lv_obj)ii"|
set_style_anim|lv_obj_set_style_anim|"(lv.lv_obj)(lv.lv_anim)i"|
set_style_anim_duration|lv_obj_set_style_anim_duration|"(lv.lv_obj)ii"|
set_style_anim_time|lv_obj_set_style_anim_duration|"(lv.lv_obj)ii"|
set_style_arc_color|lv_obj_set_style_arc_color|"(lv.lv_obj)(lv.lv_color)i"|
set_style_arc_image_src|lv_obj_set_style_arc_image_src|"(lv.lv_obj).i"|
set_style_arc_opa|lv_obj_set_style_arc_opa|"(lv.lv_obj)ii"|
set_style_arc_rounded|lv_obj_set_style_arc_rounded|"(lv.lv_obj)bi"|
set_style_arc_width|lv_obj_set_style_arc_width|"(lv.lv_obj)ii"|
set_style_base_dir|lv_obj_set_style_base_dir|"(lv.lv_obj)ii"|
set_style_bg_color|lv_obj_set_style_bg_color|"(lv.lv_obj)(lv.lv_color)i"|
set_style_bg_grad|lv_obj_set_style_bg_grad|"(lv.lv_obj)(lv.lv_grad_dsc)i"|
set_style_bg_grad_color|lv_obj_set_style_bg_grad_color|"(lv.lv_obj)(lv.lv_color)i"|
set_style_bg_grad_dir|lv_obj_set_style_bg_grad_dir|"(lv.lv_obj)ii"|
set_style_bg_grad_opa|lv_obj_set_style_bg_grad_opa|"(lv.lv_obj)ii"|
set_style_bg_grad_stop|lv_obj_set_style_bg_grad_stop|"(lv.lv_obj)ii"|
set_style_bg_image_opa|lv_obj_set_style_bg_image_opa|"(lv.lv_obj)ii"|
set_style_bg_image_recolor|lv_obj_set_style_bg_image_recolor|"(lv.lv_obj)(lv.lv_color)i"|
set_style_bg_image_recolor_opa|lv_obj_set_style_bg_image_recolor_opa|"(lv.lv_obj)ii"|
set_style_bg_image_src|lv_obj_set_style_bg_image_src|"(lv.lv_obj).i"|
set_style_bg_image_tiled|lv_obj_set_style_bg_image_tiled|"(lv.lv_obj)bi"|
set_style_bg_main_opa|lv_obj_set_style_bg_main_opa|"(lv.lv_obj)ii"|
set_style_bg_main_stop|lv_obj_set_style_bg_main_stop|"(lv.lv_obj)ii"|
set_style_bg_opa|lv_obj_set_style_bg_opa|"(lv.lv_obj)ii"|
set_style_blend_mode|lv_obj_set_style_blend_mode|"(lv.lv_obj)ii"|
set_style_border_color|lv_obj_set_style_border_color|"(lv.lv_obj)(lv.lv_color)i"|
set_style_border_opa|lv_obj_set_style_border_opa|"(lv.lv_obj)ii"|
set_style_border_post|lv_obj_set_style_border_post|"(lv.lv_obj)bi"|
set_style_border_side|lv_obj_set_style_border_side|"(lv.lv_obj)ii"|
set_style_border_width|lv_obj_set_style_border_width|"(lv.lv_obj)ii"|
set_style_clip_corner|lv_obj_set_style_clip_corner|"(lv.lv_obj)bi"|
set_style_color_filter_dsc|lv_obj_set_style_color_filter_dsc|"(lv.lv_obj)(lv.lv_color_filter_dsc)i"|
set_style_color_filter_opa|lv_obj_set_style_color_filter_opa|"(lv.lv_obj)ii"|
set_style_flex_cross_place|lv_obj_set_style_flex_cross_place|"(lv.lv_obj)ii"|
set_style_flex_flow|lv_obj_set_style_flex_flow|"(lv.lv_obj)ii"|
set_style_flex_grow|lv_obj_set_style_flex_grow|"(lv.lv_obj)ii"|
set_style_flex_main_place|lv_obj_set_style_flex_main_place|"(lv.lv_obj)ii"|
set_style_flex_track_place|lv_obj_set_style_flex_track_place|"(lv.lv_obj)ii"|
set_style_grid_cell_column_pos|lv_obj_set_style_grid_cell_column_pos|"(lv.lv_obj)ii"|
set_style_grid_cell_column_span|lv_obj_set_style_grid_cell_column_span|"(lv.lv_obj)ii"|
set_style_grid_cell_row_pos|lv_obj_set_style_grid_cell_row_pos|"(lv.lv_obj)ii"|
set_style_grid_cell_row_span|lv_obj_set_style_grid_cell_row_span|"(lv.lv_obj)ii"|
set_style_grid_cell_x_align|lv_obj_set_style_grid_cell_x_align|"(lv.lv_obj)ii"|
set_style_grid_cell_y_align|lv_obj_set_style_grid_cell_y_align|"(lv.lv_obj)ii"|
set_style_grid_column_align|lv_obj_set_style_grid_column_align|"(lv.lv_obj)ii"|
set_style_grid_column_dsc_array|lv_obj_set_style_grid_column_dsc_array|"(lv.lv_obj)(lv.lv_int_arr)i"|
set_style_grid_row_align|lv_obj_set_style_grid_row_align|"(lv.lv_obj)ii"|
set_style_grid_row_dsc_array|lv_obj_set_style_grid_row_dsc_array|"(lv.lv_obj)(lv.lv_int_arr)i"|
set_style_height|lv_obj_set_style_height|"(lv.lv_obj)ii"|
set_style_image_opa|lv_obj_set_style_image_opa|"(lv.lv_obj)ii"|
set_style_image_recolor|lv_obj_set_style_image_recolor|"(lv.lv_obj)(lv.lv_color)i"|
set_style_image_recolor_opa|lv_obj_set_style_image_recolor_opa|"(lv.lv_obj)ii"|
set_style_img_opa|lv_obj_set_style_image_opa|"(lv.lv_obj)ii"|
set_style_img_recolor|lv_obj_set_style_image_recolor|"(lv.lv_obj)(lv.lv_color)i"|
set_style_img_recolor_opa|lv_obj_set_style_image_recolor_opa|"(lv.lv_obj)ii"|
set_style_layout|lv_obj_set_style_layout|"(lv.lv_obj)ii"|
set_style_length|lv_obj_set_style_length|"(lv.lv_obj)ii"|
set_style_line_color|lv_obj_set_style_line_color|"(lv.lv_obj)(lv.lv_color)i"|
set_style_line_dash_gap|lv_obj_set_style_line_dash_gap|"(lv.lv_obj)ii"|
set_style_line_dash_width|lv_obj_set_style_line_dash_width|"(lv.lv_obj)ii"|
set_style_line_opa|lv_obj_set_style_line_opa|"(lv.lv_obj)ii"|
set_style_line_rounded|lv_obj_set_style_line_rounded|"(lv.lv_obj)bi"|
set_style_line_width|lv_obj_set_style_line_width|"(lv.lv_obj)ii"|
set_style_margin_all|lv_obj_set_style_margin_all|"(lv.lv_obj)ii"|
set_style_margin_bottom|lv_obj_set_style_margin_bottom|"(lv.lv_obj)ii"|
set_style_margin_hor|lv_obj_set_style_margin_hor|"(lv.lv_obj)ii"|
set_style_margin_left|lv_obj_set_style_margin_left|"(lv.lv_obj)ii"|
set_style_margin_right|lv_obj_set_style_margin_right|"(lv.lv_obj)ii"|
set_style_margin_top|lv_obj_set_style_margin_top|"(lv.lv_obj)ii"|
set_style_margin_ver|lv_obj_set_style_margin_ver|"(lv.lv_obj)ii"|
set_style_max_height|lv_obj_set_style_max_height|"(lv.lv_obj)ii"|
set_style_max_width|lv_obj_set_style_max_width|"(lv.lv_obj)ii"|
set_style_min_height|lv_obj_set_style_min_height|"(lv.lv_obj)ii"|
set_style_min_width|lv_obj_set_style_min_width|"(lv.lv_obj)ii"|
set_style_opa|lv_obj_set_style_opa|"(lv.lv_obj)ii"|
set_style_opa_layered|lv_obj_set_style_opa_layered|"(lv.lv_obj)ii"|
set_style_outline_color|lv_obj_set_style_outline_color|"(lv.lv_obj)(lv.lv_color)i"|
set_style_outline_opa|lv_obj_set_style_outline_opa|"(lv.lv_obj)ii"|
set_style_outline_pad|lv_obj_set_style_outline_pad|"(lv.lv_obj)ii"|
set_style_outline_width|lv_obj_set_style_outline_width|"(lv.lv_obj)ii"|
set_style_pad_all|lv_obj_set_style_pad_all|"(lv.lv_obj)ii"|
set_style_pad_bottom|lv_obj_set_style_pad_bottom|"(lv.lv_obj)ii"|
set_style_pad_column|lv_obj_set_style_pad_column|"(lv.lv_obj)ii"|
set_style_pad_gap|lv_obj_set_style_pad_gap|"(lv.lv_obj)ii"|
set_style_pad_hor|lv_obj_set_style_pad_hor|"(lv.lv_obj)ii"|
set_style_pad_left|lv_obj_set_style_pad_left|"(lv.lv_obj)ii"|
set_style_pad_right|lv_obj_set_style_pad_right|"(lv.lv_obj)ii"|
set_style_pad_row|lv_obj_set_style_pad_row|"(lv.lv_obj)ii"|
set_style_pad_top|lv_obj_set_style_pad_top|"(lv.lv_obj)ii"|
set_style_pad_ver|lv_obj_set_style_pad_ver|"(lv.lv_obj)ii"|
set_style_radius|lv_obj_set_style_radius|"(lv.lv_obj)ii"|
set_style_shadow_color|lv_obj_set_style_shadow_color|"(lv.lv_obj)(lv.lv_color)i"|
set_style_shadow_offset_x|lv_obj_set_style_shadow_offset_x|"(lv.lv_obj)ii"|
set_style_shadow_offset_y|lv_obj_set_style_shadow_offset_y|"(lv.lv_obj)ii"|
set_style_shadow_ofs_x|lv_obj_set_style_shadow_offset_x|"(lv.lv_obj)ii"|
set_style_shadow_ofs_y|lv_obj_set_style_shadow_offset_y|"(lv.lv_obj)ii"|
set_style_shadow_opa|lv_obj_set_style_shadow_opa|"(lv.lv_obj)ii"|
set_style_shadow_spread|lv_obj_set_style_shadow_spread|"(lv.lv_obj)ii"|
set_style_shadow_width|lv_obj_set_style_shadow_width|"(lv.lv_obj)ii"|
set_style_size|lv_obj_set_style_size|"(lv.lv_obj)iii"|
set_style_text_align|lv_obj_set_style_text_align|"(lv.lv_obj)ii"|
set_style_text_color|lv_obj_set_style_text_color|"(lv.lv_obj)(lv.lv_color)i"|
set_style_text_decor|lv_obj_set_style_text_decor|"(lv.lv_obj)ii"|
set_style_text_font|lv_obj_set_style_text_font|"(lv.lv_obj)(lv.lv_font)i"|
set_style_text_letter_space|lv_obj_set_style_text_letter_space|"(lv.lv_obj)ii"|
set_style_text_line_space|lv_obj_set_style_text_line_space|"(lv.lv_obj)ii"|
set_style_text_opa|lv_obj_set_style_text_opa|"(lv.lv_obj)ii"|
set_style_transform_angle|lv_obj_set_style_transform_rotation|"(lv.lv_obj)ii"|
set_style_transform_height|lv_obj_set_style_transform_height|"(lv.lv_obj)ii"|
set_style_transform_pivot_x|lv_obj_set_style_transform_pivot_x|"(lv.lv_obj)ii"|
set_style_transform_pivot_y|lv_obj_set_style_transform_pivot_y|"(lv.lv_obj)ii"|
set_style_transform_rotation|lv_obj_set_style_transform_rotation|"(lv.lv_obj)ii"|
set_style_transform_scale|lv_obj_set_style_transform_scale|"(lv.lv_obj)ii"|
set_style_transform_scale_x|lv_obj_set_style_transform_scale_x|"(lv.lv_obj)ii"|
set_style_transform_scale_y|lv_obj_set_style_transform_scale_y|"(lv.lv_obj)ii"|
set_style_transform_skew_x|lv_obj_set_style_transform_skew_x|"(lv.lv_obj)ii"|
set_style_transform_skew_y|lv_obj_set_style_transform_skew_y|"(lv.lv_obj)ii"|
set_style_transform_width|lv_obj_set_style_transform_width|"(lv.lv_obj)ii"|
set_style_transform_zoom|lv_obj_set_style_transform_scale|"(lv.lv_obj)ii"|
set_style_transition|lv_obj_set_style_transition|"(lv.lv_obj)(lv.lv_style_transition_dsc)i"|
set_style_translate_x|lv_obj_set_style_translate_x|"(lv.lv_obj)ii"|
set_style_translate_y|lv_obj_set_style_translate_y|"(lv.lv_obj)ii"|
set_style_width|lv_obj_set_style_width|"(lv.lv_obj)ii"|
set_style_x|lv_obj_set_style_x|"(lv.lv_obj)ii"|
set_style_y|lv_obj_set_style_y|"(lv.lv_obj)ii"|
set_user_data|lv_obj_set_user_data|"(lv.lv_obj)."|
set_width|lv_obj_set_width|"(lv.lv_obj)i"|
set_x|lv_obj_set_x|"(lv.lv_obj)i"|
set_y|lv_obj_set_y|"(lv.lv_obj)i"|
stringify_id|lv_obj_stringify_id|"(lv.lv_obj)ci"|s
swap|lv_obj_swap|"(lv.lv_obj)(lv.lv_obj)"|
transform_point|lv_obj_transform_point|"(lv.lv_obj)(lv.lv_point)bb"|
tree_walk|lv_obj_tree_walk|"(lv.lv_obj)^lv_obj_tree_walk_cb^."|
update_flag|lv_obj_update_flag|"(lv.lv_obj)ib"|
update_layout|lv_obj_update_layout|"(lv.lv_obj)"|
update_snap|lv_obj_update_snap|"(lv.lv_obj)i"|

## `lv_style` class

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_prop|lv_style_get_prop|"(lv.lv_style)i(lv.lv_style_value)"|i
get_prop_inlined|lv_style_get_prop_inlined|"(lv.lv_style)i(lv.lv_style_value)"|i
is_const|lv_style_is_const|"(lv.lv_style)"|b
is_empty|lv_style_is_empty|"(lv.lv_style)"|b
remove_prop|lv_style_remove_prop|"(lv.lv_style)i"|b
reset|lv_style_reset|"(lv.lv_style)"|
set_align|lv_style_set_align|"(lv.lv_style)i"|
set_anim|lv_style_set_anim|"(lv.lv_style)(lv.lv_anim)"|
set_anim_duration|lv_style_set_anim_duration|"(lv.lv_style)i"|
set_anim_time|lv_style_set_anim_duration|"(lv.lv_style)i"|
set_arc_color|lv_style_set_arc_color|"(lv.lv_style)(lv.lv_color)"|
set_arc_image_src|lv_style_set_arc_image_src|"(lv.lv_style)."|
set_arc_opa|lv_style_set_arc_opa|"(lv.lv_style)i"|
set_arc_rounded|lv_style_set_arc_rounded|"(lv.lv_style)b"|
set_arc_width|lv_style_set_arc_width|"(lv.lv_style)i"|
set_base_dir|lv_style_set_base_dir|"(lv.lv_style)i"|
set_bg_color|lv_style_set_bg_color|"(lv.lv_style)(lv.lv_color)"|
set_bg_grad|lv_style_set_bg_grad|"(lv.lv_style)(lv.lv_grad_dsc)"|
set_bg_grad_color|lv_style_set_bg_grad_color|"(lv.lv_style)(lv.lv_color)"|
set_bg_grad_dir|lv_style_set_bg_grad_dir|"(lv.lv_style)i"|
set_bg_grad_opa|lv_style_set_bg_grad_opa|"(lv.lv_style)i"|
set_bg_grad_stop|lv_style_set_bg_grad_stop|"(lv.lv_style)i"|
set_bg_image_opa|lv_style_set_bg_image_opa|"(lv.lv_style)i"|
set_bg_image_recolor|lv_style_set_bg_image_recolor|"(lv.lv_style)(lv.lv_color)"|
set_bg_image_recolor_opa|lv_style_set_bg_image_recolor_opa|"(lv.lv_style)i"|
set_bg_image_src|lv_style_set_bg_image_src|"(lv.lv_style)."|
set_bg_image_tiled|lv_style_set_bg_image_tiled|"(lv.lv_style)b"|
set_bg_img_opa|lv_style_set_bg_image_opa|"(lv.lv_style)i"|
set_bg_img_recolor|lv_style_set_bg_image_recolor|"(lv.lv_style)(lv.lv_color)"|
set_bg_img_recolor_opa|lv_style_set_bg_image_recolor_opa|"(lv.lv_style)i"|
set_bg_img_src|lv_style_set_bg_image_src|"(lv.lv_style)."|
set_bg_img_tiled|lv_style_set_bg_image_tiled|"(lv.lv_style)b"|
set_bg_main_opa|lv_style_set_bg_main_opa|"(lv.lv_style)i"|
set_bg_main_stop|lv_style_set_bg_main_stop|"(lv.lv_style)i"|
set_bg_opa|lv_style_set_bg_opa|"(lv.lv_style)i"|
set_blend_mode|lv_style_set_blend_mode|"(lv.lv_style)i"|
set_border_color|lv_style_set_border_color|"(lv.lv_style)(lv.lv_color)"|
set_border_opa|lv_style_set_border_opa|"(lv.lv_style)i"|
set_border_post|lv_style_set_border_post|"(lv.lv_style)b"|
set_border_side|lv_style_set_border_side|"(lv.lv_style)i"|
set_border_width|lv_style_set_border_width|"(lv.lv_style)i"|
set_clip_corner|lv_style_set_clip_corner|"(lv.lv_style)b"|
set_color_filter_dsc|lv_style_set_color_filter_dsc|"(lv.lv_style)(lv.lv_color_filter_dsc)"|
set_color_filter_opa|lv_style_set_color_filter_opa|"(lv.lv_style)i"|
set_flex_cross_place|lv_style_set_flex_cross_place|"(lv.lv_style)i"|
set_flex_flow|lv_style_set_flex_flow|"(lv.lv_style)i"|
set_flex_grow|lv_style_set_flex_grow|"(lv.lv_style)i"|
set_flex_main_place|lv_style_set_flex_main_place|"(lv.lv_style)i"|
set_flex_track_place|lv_style_set_flex_track_place|"(lv.lv_style)i"|
set_grid_cell_column_pos|lv_style_set_grid_cell_column_pos|"(lv.lv_style)i"|
set_grid_cell_column_span|lv_style_set_grid_cell_column_span|"(lv.lv_style)i"|
set_grid_cell_row_pos|lv_style_set_grid_cell_row_pos|"(lv.lv_style)i"|
set_grid_cell_row_span|lv_style_set_grid_cell_row_span|"(lv.lv_style)i"|
set_grid_cell_x_align|lv_style_set_grid_cell_x_align|"(lv.lv_style)i"|
set_grid_cell_y_align|lv_style_set_grid_cell_y_align|"(lv.lv_style)i"|
set_grid_column_align|lv_style_set_grid_column_align|"(lv.lv_style)i"|
set_grid_column_dsc_array|lv_style_set_grid_column_dsc_array|"(lv.lv_style)(lv.lv_int_arr)"|
set_grid_row_align|lv_style_set_grid_row_align|"(lv.lv_style)i"|
set_grid_row_dsc_array|lv_style_set_grid_row_dsc_array|"(lv.lv_style)(lv.lv_int_arr)"|
set_height|lv_style_set_height|"(lv.lv_style)i"|
set_image_opa|lv_style_set_image_opa|"(lv.lv_style)i"|
set_image_recolor|lv_style_set_image_recolor|"(lv.lv_style)(lv.lv_color)"|
set_image_recolor_opa|lv_style_set_image_recolor_opa|"(lv.lv_style)i"|
set_img_opa|lv_style_set_image_opa|"(lv.lv_style)i"|
set_img_recolor|lv_style_set_image_recolor|"(lv.lv_style)(lv.lv_color)"|
set_img_recolor_opa|lv_style_set_image_recolor_opa|"(lv.lv_style)i"|
set_layout|lv_style_set_layout|"(lv.lv_style)i"|
set_length|lv_style_set_length|"(lv.lv_style)i"|
set_line_color|lv_style_set_line_color|"(lv.lv_style)(lv.lv_color)"|
set_line_dash_gap|lv_style_set_line_dash_gap|"(lv.lv_style)i"|
set_line_dash_width|lv_style_set_line_dash_width|"(lv.lv_style)i"|
set_line_opa|lv_style_set_line_opa|"(lv.lv_style)i"|
set_line_rounded|lv_style_set_line_rounded|"(lv.lv_style)b"|
set_line_width|lv_style_set_line_width|"(lv.lv_style)i"|
set_margin_bottom|lv_style_set_margin_bottom|"(lv.lv_style)i"|
set_margin_left|lv_style_set_margin_left|"(lv.lv_style)i"|
set_margin_right|lv_style_set_margin_right|"(lv.lv_style)i"|
set_margin_top|lv_style_set_margin_top|"(lv.lv_style)i"|
set_max_height|lv_style_set_max_height|"(lv.lv_style)i"|
set_max_width|lv_style_set_max_width|"(lv.lv_style)i"|
set_min_height|lv_style_set_min_height|"(lv.lv_style)i"|
set_min_width|lv_style_set_min_width|"(lv.lv_style)i"|
set_opa|lv_style_set_opa|"(lv.lv_style)i"|
set_opa_layered|lv_style_set_opa_layered|"(lv.lv_style)i"|
set_outline_color|lv_style_set_outline_color|"(lv.lv_style)(lv.lv_color)"|
set_outline_opa|lv_style_set_outline_opa|"(lv.lv_style)i"|
set_outline_pad|lv_style_set_outline_pad|"(lv.lv_style)i"|
set_outline_width|lv_style_set_outline_width|"(lv.lv_style)i"|
set_pad_all|lv_style_set_pad_all|"(lv.lv_style)i"|
set_pad_bottom|lv_style_set_pad_bottom|"(lv.lv_style)i"|
set_pad_column|lv_style_set_pad_column|"(lv.lv_style)i"|
set_pad_gap|lv_style_set_pad_gap|"(lv.lv_style)i"|
set_pad_hor|lv_style_set_pad_hor|"(lv.lv_style)i"|
set_pad_left|lv_style_set_pad_left|"(lv.lv_style)i"|
set_pad_right|lv_style_set_pad_right|"(lv.lv_style)i"|
set_pad_row|lv_style_set_pad_row|"(lv.lv_style)i"|
set_pad_top|lv_style_set_pad_top|"(lv.lv_style)i"|
set_pad_ver|lv_style_set_pad_ver|"(lv.lv_style)i"|
set_prop|lv_style_set_prop|"(lv.lv_style)ii"|
set_radius|lv_style_set_radius|"(lv.lv_style)i"|
set_shadow_color|lv_style_set_shadow_color|"(lv.lv_style)(lv.lv_color)"|
set_shadow_offset_x|lv_style_set_shadow_offset_x|"(lv.lv_style)i"|
set_shadow_offset_y|lv_style_set_shadow_offset_y|"(lv.lv_style)i"|
set_shadow_ofs_x|lv_style_set_shadow_offset_x|"(lv.lv_style)i"|
set_shadow_ofs_y|lv_style_set_shadow_offset_y|"(lv.lv_style)i"|
set_shadow_opa|lv_style_set_shadow_opa|"(lv.lv_style)i"|
set_shadow_spread|lv_style_set_shadow_spread|"(lv.lv_style)i"|
set_shadow_width|lv_style_set_shadow_width|"(lv.lv_style)i"|
set_size|lv_style_set_size|"(lv.lv_style)ii"|
set_text_align|lv_style_set_text_align|"(lv.lv_style)i"|
set_text_color|lv_style_set_text_color|"(lv.lv_style)(lv.lv_color)"|
set_text_decor|lv_style_set_text_decor|"(lv.lv_style)i"|
set_text_font|lv_style_set_text_font|"(lv.lv_style)(lv.lv_font)"|
set_text_letter_space|lv_style_set_text_letter_space|"(lv.lv_style)i"|
set_text_line_space|lv_style_set_text_line_space|"(lv.lv_style)i"|
set_text_opa|lv_style_set_text_opa|"(lv.lv_style)i"|
set_transform_angle|lv_style_set_transform_rotation|"(lv.lv_style)i"|
set_transform_height|lv_style_set_transform_height|"(lv.lv_style)i"|
set_transform_pivot_x|lv_style_set_transform_pivot_x|"(lv.lv_style)i"|
set_transform_pivot_y|lv_style_set_transform_pivot_y|"(lv.lv_style)i"|
set_transform_rotation|lv_style_set_transform_rotation|"(lv.lv_style)i"|
set_transform_scale|lv_style_set_transform_scale|"(lv.lv_style)i"|
set_transform_scale_x|lv_style_set_transform_scale_x|"(lv.lv_style)i"|
set_transform_scale_y|lv_style_set_transform_scale_y|"(lv.lv_style)i"|
set_transform_skew_x|lv_style_set_transform_skew_x|"(lv.lv_style)i"|
set_transform_skew_y|lv_style_set_transform_skew_y|"(lv.lv_style)i"|
set_transform_width|lv_style_set_transform_width|"(lv.lv_style)i"|
set_transform_zoom|lv_style_set_transform_scale|"(lv.lv_style)i"|
set_transition|lv_style_set_transition|"(lv.lv_style)(lv.lv_style_transition_dsc)"|
set_translate_x|lv_style_set_translate_x|"(lv.lv_style)i"|
set_translate_y|lv_style_set_translate_y|"(lv.lv_style)i"|
set_width|lv_style_set_width|"(lv.lv_style)i"|
set_x|lv_style_set_x|"(lv.lv_style)i"|
set_y|lv_style_set_y|"(lv.lv_style)i"|

## `lv_timer` class

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
del|lv_timer_delete|"(lv.lv_timer)"|
delete|lv_timer_delete|"(lv.lv_timer)"|
get_next|lv_timer_get_next|"(lv.lv_timer)"|lv.lv_timer
get_next|lv_timer_get_next|"(lv.lv_timer)"|lv.lv_timer
get_paused|lv_timer_get_paused|"(lv.lv_timer)"|b
get_user_data|lv_timer_get_user_data|"(lv.lv_timer)"|.
pause|lv_timer_pause|"(lv.lv_timer)"|
ready|lv_timer_ready|"(lv.lv_timer)"|
remove|lv_timer_delete|"(lv.lv_timer)"|
reset|lv_timer_reset|"(lv.lv_timer)"|
resume|lv_timer_resume|"(lv.lv_timer)"|
set_auto_delete|lv_timer_set_auto_delete|"(lv.lv_timer)b"|
set_cb|lv_timer_set_cb|"(lv.lv_timer)^lv_timer_cb^"|
set_period|lv_timer_set_period|"(lv.lv_timer)i"|
set_repeat_count|lv_timer_set_repeat_count|"(lv.lv_timer)i"|
set_user_data|lv_timer_set_user_data|"(lv.lv_timer)."|

# Widgets

## `lv_image` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_align|lv_image_get_align|"(lv.lv_obj)"|i
get_angle|lv_image_get_rotation|"(lv.lv_obj)"|i
get_antialias|lv_image_get_antialias|"(lv.lv_obj)"|b
get_blend_mode|lv_image_get_blend_mode|"(lv.lv_obj)"|i
get_offset_x|lv_image_get_offset_x|"(lv.lv_obj)"|i
get_offset_x|lv_image_get_offset_x|"(lv.lv_obj)"|i
get_offset_y|lv_image_get_offset_y|"(lv.lv_obj)"|i
get_offset_y|lv_image_get_offset_y|"(lv.lv_obj)"|i
get_pivot|lv_image_get_pivot|"(lv.lv_obj)(lv.lv_point)"|
get_rotation|lv_image_get_rotation|"(lv.lv_obj)"|i
get_rotation|lv_image_get_rotation|"(lv.lv_obj)"|i
get_scale|lv_image_get_scale|"(lv.lv_obj)"|i
get_scale_x|lv_image_get_scale_x|"(lv.lv_obj)"|i
get_scale_y|lv_image_get_scale_y|"(lv.lv_obj)"|i
get_src|lv_image_get_src|"(lv.lv_obj)"|.
get_zoom|lv_image_get_scale|"(lv.lv_obj)"|i
set_align|lv_image_set_align|"(lv.lv_obj)i"|
set_angle|lv_image_set_rotation|"(lv.lv_obj)i"|
set_antialias|lv_image_set_antialias|"(lv.lv_obj)b"|
set_blend_mode|lv_image_set_blend_mode|"(lv.lv_obj)i"|
set_offset_x|lv_image_set_offset_x|"(lv.lv_obj)i"|
set_offset_y|lv_image_set_offset_y|"(lv.lv_obj)i"|
set_pivot|lv_image_set_pivot|"(lv.lv_obj)ii"|
set_rotation|lv_image_set_rotation|"(lv.lv_obj)i"|
set_rotation|lv_image_set_rotation|"(lv.lv_obj)i"|
set_scale|lv_image_set_scale|"(lv.lv_obj)i"|
set_scale_x|lv_image_set_scale_x|"(lv.lv_obj)i"|
set_scale_y|lv_image_set_scale_y|"(lv.lv_obj)i"|
set_src|lv_image_set_src|"(lv.lv_obj)."|
set_tasmota_logo|lv_image_set_tasmota_logo|"(lv.lv_obj)"|
set_zoom|lv_image_set_scale|"(lv.lv_obj)i"|

## `lv_qrcode` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
set_dark_color|lv_qrcode_set_dark_color|"(lv.lv_obj)(lv.lv_color)"|
set_light_color|lv_qrcode_set_light_color|"(lv.lv_obj)(lv.lv_color)"|
set_size|lv_qrcode_set_size|"(lv.lv_obj)i"|
update|lv_qrcode_update|"(lv.lv_obj).i"|i

## `lv_arc` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
align_obj_to_angle|lv_arc_align_obj_to_angle|"(lv.lv_obj)(lv.lv_obj)i"|
get_angle|lv_arc_get_rotation|"(lv.lv_obj)"|i
get_angle_end|lv_arc_get_angle_end|"(lv.lv_obj)"|i
get_angle_start|lv_arc_get_angle_start|"(lv.lv_obj)"|i
get_bg_angle_end|lv_arc_get_bg_angle_end|"(lv.lv_obj)"|i
get_bg_angle_start|lv_arc_get_bg_angle_start|"(lv.lv_obj)"|i
get_knob_offset|lv_arc_get_knob_offset|"(lv.lv_obj)"|i
get_max_value|lv_arc_get_max_value|"(lv.lv_obj)"|i
get_min_value|lv_arc_get_min_value|"(lv.lv_obj)"|i
get_mode|lv_arc_get_mode|"(lv.lv_obj)"|i
get_rotation|lv_arc_get_rotation|"(lv.lv_obj)"|i
get_rotation|lv_arc_get_rotation|"(lv.lv_obj)"|i
get_value|lv_arc_get_value|"(lv.lv_obj)"|i
rotate_obj_to_angle|lv_arc_rotate_obj_to_angle|"(lv.lv_obj)(lv.lv_obj)i"|
set_angle|lv_arc_set_rotation|"(lv.lv_obj)i"|
set_angles|lv_arc_set_angles|"(lv.lv_obj)ii"|
set_bg_angles|lv_arc_set_bg_angles|"(lv.lv_obj)ii"|
set_bg_end_angle|lv_arc_set_bg_end_angle|"(lv.lv_obj)i"|
set_bg_start_angle|lv_arc_set_bg_start_angle|"(lv.lv_obj)i"|
set_change_rate|lv_arc_set_change_rate|"(lv.lv_obj)i"|
set_end_angle|lv_arc_set_end_angle|"(lv.lv_obj)i"|
set_knob_offset|lv_arc_set_knob_offset|"(lv.lv_obj)i"|
set_mode|lv_arc_set_mode|"(lv.lv_obj)i"|
set_range|lv_arc_set_range|"(lv.lv_obj)ii"|
set_rotation|lv_arc_set_rotation|"(lv.lv_obj)i"|
set_rotation|lv_arc_set_rotation|"(lv.lv_obj)i"|
set_start_angle|lv_arc_set_start_angle|"(lv.lv_obj)i"|
set_value|lv_arc_set_value|"(lv.lv_obj)i"|

## `lv_bar` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_max_value|lv_bar_get_max_value|"(lv.lv_obj)"|i
get_min_value|lv_bar_get_min_value|"(lv.lv_obj)"|i
get_mode|lv_bar_get_mode|"(lv.lv_obj)"|i
get_start_value|lv_bar_get_start_value|"(lv.lv_obj)"|i
get_value|lv_bar_get_value|"(lv.lv_obj)"|i
is_symmetrical|lv_bar_is_symmetrical|"(lv.lv_obj)"|b
set_mode|lv_bar_set_mode|"(lv.lv_obj)i"|
set_range|lv_bar_set_range|"(lv.lv_obj)ii"|
set_start_value|lv_bar_set_start_value|"(lv.lv_obj)ii"|
set_value|lv_bar_set_value|"(lv.lv_obj)ii"|

## `lv_button` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---

## `lv_buttonmatrix` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
_btn_text|lv_buttonmatrix_get_button_text|"(lv.lv_obj)i"|s
clear_button_ctrl|lv_buttonmatrix_clear_button_ctrl|"(lv.lv_obj)ii"|
clear_button_ctrl_all|lv_buttonmatrix_clear_button_ctrl_all|"(lv.lv_obj)i"|
get_button_text|lv_buttonmatrix_get_button_text|"(lv.lv_obj)i"|s
get_map|lv_buttonmatrix_get_map|"(lv.lv_obj)"|c
get_one_checked|lv_buttonmatrix_get_one_checked|"(lv.lv_obj)"|b
get_popovers|lv_buttonmatrix_get_popovers|"(lv.lv_obj)"|b
get_selected_button|lv_buttonmatrix_get_selected_button|"(lv.lv_obj)"|i
has_button_ctrl|lv_buttonmatrix_has_button_ctrl|"(lv.lv_obj)ii"|b
set_button_ctrl|lv_buttonmatrix_set_button_ctrl|"(lv.lv_obj)ii"|
set_button_ctrl_all|lv_buttonmatrix_set_button_ctrl_all|"(lv.lv_obj)i"|
set_button_width|lv_buttonmatrix_set_button_width|"(lv.lv_obj)ii"|
set_ctrl_map|lv_buttonmatrix_set_ctrl_map|"(lv.lv_obj)(lv.lv_buttonmatrix_ctrl)"|
set_map|lv_buttonmatrix_set_map|"(lv.lv_obj)(lv.str_arr)"|
set_one_checked|lv_buttonmatrix_set_one_checked|"(lv.lv_obj)b"|
set_selected_button|lv_buttonmatrix_set_selected_button|"(lv.lv_obj)i"|

## `lv_canvas` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
copy_buf|lv_canvas_copy_buf|"(lv.lv_obj)(lv.lv_area)(lv.lv_draw_buf)(lv.lv_area)"|
fill_bg|lv_canvas_fill_bg|"(lv.lv_obj)(lv.lv_color)i"|
finish_layer|lv_canvas_finish_layer|"(lv.lv_obj)(lv.lv_layer)"|
get_buf|lv_canvas_get_buf|"(lv.lv_obj)"|.
get_image|lv_canvas_get_image|"(lv.lv_obj)"|lv.lv_image_dsc
get_px|lv_canvas_get_px|"(lv.lv_obj)ii"|i
init_layer|lv_canvas_init_layer|"(lv.lv_obj)(lv.lv_layer)"|
set_buffer|lv_canvas_set_buffer|"(lv.lv_obj).iii"|
set_draw_buf|lv_canvas_set_draw_buf|"(lv.lv_obj)(lv.lv_draw_buf)"|
set_palette|lv_canvas_set_palette|"(lv.lv_obj)ii"|
set_px|lv_canvas_set_px|"(lv.lv_obj)ii(lv.lv_color)i"|

## `lv_chart` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_cursor|lv_chart_add_cursor|"(lv.lv_obj)(lv.lv_color)i"|lv.lv_chart_cursor
add_series|lv_chart_add_series|"(lv.lv_obj)(lv.lv_color)i"|lv.lv_chart_series
get_cursor_point|lv_chart_get_cursor_point|"(lv.lv_obj)(lv.lv_chart_cursor)"|i
get_first_point_center_offset|lv_chart_get_first_point_center_offset|"(lv.lv_obj)"|i
get_point_count|lv_chart_get_point_count|"(lv.lv_obj)"|i
get_point_pos_by_id|lv_chart_get_point_pos_by_id|"(lv.lv_obj)(lv.lv_chart_series)i(lv.lv_point)"|
get_pressed_point|lv_chart_get_pressed_point|"(lv.lv_obj)"|i
get_series_next|lv_chart_get_series_next|"(lv.lv_obj)(lv.lv_chart_series)"|lv.lv_chart_series
get_type|lv_chart_get_type|"(lv.lv_obj)"|i
get_x_array|lv_chart_get_x_array|"(lv.lv_obj)(lv.lv_chart_series)"|lv.lv_int_arr
get_x_start_point|lv_chart_get_x_start_point|"(lv.lv_obj)(lv.lv_chart_series)"|i
get_y_array|lv_chart_get_y_array|"(lv.lv_obj)(lv.lv_chart_series)"|lv.lv_int_arr
hide_series|lv_chart_hide_series|"(lv.lv_obj)(lv.lv_chart_series)b"|
refresh|lv_chart_refresh|"(lv.lv_obj)"|
remove_series|lv_chart_remove_series|"(lv.lv_obj)(lv.lv_chart_series)"|
set_all_value|lv_chart_set_all_value|"(lv.lv_obj)(lv.lv_chart_series)i"|
set_cursor_point|lv_chart_set_cursor_point|"(lv.lv_obj)(lv.lv_chart_cursor)(lv.lv_chart_series)i"|
set_cursor_pos|lv_chart_set_cursor_pos|"(lv.lv_obj)(lv.lv_chart_cursor)(lv.lv_point)"|
set_div_line_count|lv_chart_set_div_line_count|"(lv.lv_obj)ii"|
set_ext_x_array|lv_chart_set_ext_x_array|"(lv.lv_obj)(lv.lv_chart_series)(lv.int32)"|
set_ext_y_array|lv_chart_set_ext_y_array|"(lv.lv_obj)(lv.lv_chart_series)(lv.int32)"|
set_next_value|lv_chart_set_next_value|"(lv.lv_obj)(lv.lv_chart_series)i"|
set_next_value2|lv_chart_set_next_value2|"(lv.lv_obj)(lv.lv_chart_series)ii"|
set_point_count|lv_chart_set_point_count|"(lv.lv_obj)i"|
set_range|lv_chart_set_range|"(lv.lv_obj)iii"|
set_series_color|lv_chart_set_series_color|"(lv.lv_obj)(lv.lv_chart_series)(lv.lv_color)"|
set_type|lv_chart_set_type|"(lv.lv_obj)i"|
set_update_mode|lv_chart_set_update_mode|"(lv.lv_obj)i"|
set_value_by_id|lv_chart_set_value_by_id|"(lv.lv_obj)(lv.lv_chart_series)ii"|
set_value_by_id2|lv_chart_set_value_by_id2|"(lv.lv_obj)(lv.lv_chart_series)iii"|
set_x_start_point|lv_chart_set_x_start_point|"(lv.lv_obj)(lv.lv_chart_series)i"|

## `lv_checkbox` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_text|lv_checkbox_get_text|"(lv.lv_obj)"|s
set_text|lv_checkbox_set_text|"(lv.lv_obj)s"|
set_text_static|lv_checkbox_set_text_static|"(lv.lv_obj)s"|

## `lv_dropdown` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_option|lv_dropdown_add_option|"(lv.lv_obj)si"|
clear_options|lv_dropdown_clear_options|"(lv.lv_obj)"|
close|lv_dropdown_close|"(lv.lv_obj)"|
get_dir|lv_dropdown_get_dir|"(lv.lv_obj)"|i
get_list|lv_dropdown_get_list|"(lv.lv_obj)"|lv.lv_obj
get_option_cnt|lv_dropdown_get_option_count|"(lv.lv_obj)"|i
get_option_count|lv_dropdown_get_option_count|"(lv.lv_obj)"|i
get_option_index|lv_dropdown_get_option_index|"(lv.lv_obj)s"|i
get_options|lv_dropdown_get_options|"(lv.lv_obj)"|s
get_selected|lv_dropdown_get_selected|"(lv.lv_obj)"|i
get_selected_highlight|lv_dropdown_get_selected_highlight|"(lv.lv_obj)"|b
get_selected_str|lv_dropdown_get_selected_str|"(lv.lv_obj)ci"|
get_symbol|lv_dropdown_get_symbol|"(lv.lv_obj)"|s
get_text|lv_dropdown_get_text|"(lv.lv_obj)"|s
is_open|lv_dropdown_is_open|"(lv.lv_obj)"|b
open|lv_dropdown_open|"(lv.lv_obj)"|
set_dir|lv_dropdown_set_dir|"(lv.lv_obj)i"|
set_options|lv_dropdown_set_options|"(lv.lv_obj)s"|
set_options_static|lv_dropdown_set_options_static|"(lv.lv_obj)s"|
set_selected|lv_dropdown_set_selected|"(lv.lv_obj)i"|
set_selected_highlight|lv_dropdown_set_selected_highlight|"(lv.lv_obj)b"|
set_symbol|lv_dropdown_set_symbol|"(lv.lv_obj)."|
set_text|lv_dropdown_set_text|"(lv.lv_obj)s"|

## `lv_imagebutton` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
set_src|lv_imagebutton_set_src|"(lv.lv_obj)i..."|
set_state|lv_imagebutton_set_state|"(lv.lv_obj)i"|

## `lv_keyboard` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
_btn_text|lv_keyboard_get_button_text|"(lv.lv_obj)i"|s
get_button_text|lv_keyboard_get_button_text|"(lv.lv_obj)i"|s
get_map_array|lv_keyboard_get_map_array|"(lv.lv_obj)"|c
get_mode|lv_keyboard_get_mode|"(lv.lv_obj)"|i
get_selected_button|lv_keyboard_get_selected_button|"(lv.lv_obj)"|i
get_textarea|lv_keyboard_get_textarea|"(lv.lv_obj)"|lv.lv_obj
set_map|lv_keyboard_set_map|"(lv.lv_obj)i(lv.str_arr)(lv.lv_buttonmatrix_ctrl)"|
set_mode|lv_keyboard_set_mode|"(lv.lv_obj)i"|
set_popovers|lv_keyboard_set_popovers|"(lv.lv_obj)b"|
set_textarea|lv_keyboard_set_textarea|"(lv.lv_obj)(lv.lv_obj)"|

## `lv_label` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
cut_text|lv_label_cut_text|"(lv.lv_obj)ii"|
get_letter_on|lv_label_get_letter_on|"(lv.lv_obj)(lv.lv_point)b"|i
get_letter_pos|lv_label_get_letter_pos|"(lv.lv_obj)i(lv.lv_point)"|
get_long_mode|lv_label_get_long_mode|"(lv.lv_obj)"|i
get_text|lv_label_get_text|"(lv.lv_obj)"|s
get_text_selection_end|lv_label_get_text_selection_end|"(lv.lv_obj)"|i
get_text_selection_start|lv_label_get_text_selection_start|"(lv.lv_obj)"|i
ins_text|lv_label_ins_text|"(lv.lv_obj)is"|
is_char_under_pos|lv_label_is_char_under_pos|"(lv.lv_obj)(lv.lv_point)"|b
set_long_mode|lv_label_set_long_mode|"(lv.lv_obj)i"|
set_text|lv_label_set_text|"(lv.lv_obj)s"|
set_text_fmt|lv_label_set_text_fmt|"(lv.lv_obj)s[......]"|
set_text_selection_end|lv_label_set_text_selection_end|"(lv.lv_obj)i"|
set_text_selection_start|lv_label_set_text_selection_start|"(lv.lv_obj)i"|
set_text_static|lv_label_set_text_static|"(lv.lv_obj)s"|

## `lv_led` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_brightness|lv_led_get_brightness|"(lv.lv_obj)"|i
off|lv_led_off|"(lv.lv_obj)"|
on|lv_led_on|"(lv.lv_obj)"|
set_brightness|lv_led_set_brightness|"(lv.lv_obj)i"|
set_color|lv_led_set_color|"(lv.lv_obj)(lv.lv_color)"|
toggle|lv_led_toggle|"(lv.lv_obj)"|

## `lv_line` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_y_invert|lv_line_get_y_invert|"(lv.lv_obj)"|b
set_points|lv_line_set_points|"(lv.lv_obj)(lv.lv_point_precise)i"|
set_y_invert|lv_line_set_y_invert|"(lv.lv_obj)b"|

## `lv_list` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
_btn_text|lv_list_get_button_text|"(lv.lv_obj)(lv.lv_obj)"|s
add_btn|lv_list_add_button|"(lv.lv_obj).s"|lv.lv_obj
add_button|lv_list_add_button|"(lv.lv_obj).s"|lv.lv_obj
add_text|lv_list_add_text|"(lv.lv_obj)s"|lv.lv_obj
get_button_text|lv_list_get_button_text|"(lv.lv_obj)(lv.lv_obj)"|s
set_btn_text|lv_list_set_button_text|"(lv.lv_obj)(lv.lv_obj)s"|
set_button_text|lv_list_set_button_text|"(lv.lv_obj)(lv.lv_obj)s"|

## `lv_msgbox` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_close_button|lv_msgbox_add_close_button|"(lv.lv_obj)"|lv.lv_obj
add_footer_button|lv_msgbox_add_footer_button|"(lv.lv_obj)s"|lv.lv_obj
add_header_button|lv_msgbox_add_header_button|"(lv.lv_obj)."|lv.lv_obj
add_text|lv_msgbox_add_text|"(lv.lv_obj)s"|lv.lv_obj
add_title|lv_msgbox_add_title|"(lv.lv_obj)s"|lv.lv_obj
close|lv_msgbox_close|"(lv.lv_obj)"|
close_async|lv_msgbox_close_async|"(lv.lv_obj)"|
get_content|lv_msgbox_get_content|"(lv.lv_obj)"|lv.lv_obj
get_footer|lv_msgbox_get_footer|"(lv.lv_obj)"|lv.lv_obj
get_header|lv_msgbox_get_header|"(lv.lv_obj)"|lv.lv_obj
get_title|lv_msgbox_get_title|"(lv.lv_obj)"|lv.lv_obj

## `lv_roller` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_option_cnt|lv_roller_get_option_count|"(lv.lv_obj)"|i
get_option_count|lv_roller_get_option_count|"(lv.lv_obj)"|i
get_options|lv_roller_get_options|"(lv.lv_obj)"|s
get_selected|lv_roller_get_selected|"(lv.lv_obj)"|i
get_selected_str|lv_roller_get_selected_str|"(lv.lv_obj)ci"|
set_options|lv_roller_set_options|"(lv.lv_obj)si"|
set_selected|lv_roller_set_selected|"(lv.lv_obj)ii"|
set_visible_row_cnt|lv_roller_set_visible_row_count|"(lv.lv_obj)i"|
set_visible_row_count|lv_roller_set_visible_row_count|"(lv.lv_obj)i"|

## `lv_scale` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_section|lv_scale_add_section|"(lv.lv_obj)"|c
get_angle_range|lv_scale_get_angle_range|"(lv.lv_obj)"|i
get_label_show|lv_scale_get_label_show|"(lv.lv_obj)"|b
get_major_tick_every|lv_scale_get_major_tick_every|"(lv.lv_obj)"|i
get_mode|lv_scale_get_mode|"(lv.lv_obj)"|i
get_range_max_value|lv_scale_get_range_max_value|"(lv.lv_obj)"|i
get_range_min_value|lv_scale_get_range_min_value|"(lv.lv_obj)"|i
get_total_tick_count|lv_scale_get_total_tick_count|"(lv.lv_obj)"|i
set_angle|lv_scale_set_rotation|"(lv.lv_obj)i"|
set_angle_range|lv_scale_set_angle_range|"(lv.lv_obj)i"|
set_image_needle_value|lv_scale_set_image_needle_value|"(lv.lv_obj)(lv.lv_obj)i"|
set_label_show|lv_scale_set_label_show|"(lv.lv_obj)b"|
set_line_needle_value|lv_scale_set_line_needle_value|"(lv.lv_obj)(lv.lv_obj)ii"|
set_major_tick_every|lv_scale_set_major_tick_every|"(lv.lv_obj)i"|
set_mode|lv_scale_set_mode|"(lv.lv_obj)i"|
set_post_draw|lv_scale_set_post_draw|"(lv.lv_obj)b"|
set_range|lv_scale_set_range|"(lv.lv_obj)ii"|
set_rotation|lv_scale_set_rotation|"(lv.lv_obj)i"|
set_rotation|lv_scale_set_rotation|"(lv.lv_obj)i"|
set_text_src|lv_scale_set_text_src|"(lv.lv_obj)(lv.str_arr)"|
set_total_tick_count|lv_scale_set_total_tick_count|"(lv.lv_obj)i"|

## `lv_slider` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
get_left_value|lv_slider_get_left_value|"(lv.lv_obj)"|i
get_max_value|lv_slider_get_max_value|"(lv.lv_obj)"|i
get_min_value|lv_slider_get_min_value|"(lv.lv_obj)"|i
get_mode|lv_slider_get_mode|"(lv.lv_obj)"|i
get_value|lv_slider_get_value|"(lv.lv_obj)"|i
is_dragged|lv_slider_is_dragged|"(lv.lv_obj)"|b
is_symmetrical|lv_slider_is_symmetrical|"(lv.lv_obj)"|b
set_left_value|lv_slider_set_left_value|"(lv.lv_obj)ii"|
set_mode|lv_slider_set_mode|"(lv.lv_obj)i"|
set_range|lv_slider_set_range|"(lv.lv_obj)ii"|
set_value|lv_slider_set_value|"(lv.lv_obj)ii"|

## `lv_spangroup` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
delete_span|lv_spangroup_delete_span|"(lv.lv_obj)(lv.lv_spangroup)"|
get_align|lv_spangroup_get_align|"(lv.lv_obj)"|i
get_child|lv_spangroup_get_child|"(lv.lv_obj)i"|lv.lv_spangroup
get_expand_height|lv_spangroup_get_expand_height|"(lv.lv_obj)i"|i
get_expand_width|lv_spangroup_get_expand_width|"(lv.lv_obj)i"|i
get_indent|lv_spangroup_get_indent|"(lv.lv_obj)"|i
get_max_line_height|lv_spangroup_get_max_line_height|"(lv.lv_obj)"|i
get_max_lines|lv_spangroup_get_max_lines|"(lv.lv_obj)"|i
get_mode|lv_spangroup_get_mode|"(lv.lv_obj)"|i
get_overflow|lv_spangroup_get_overflow|"(lv.lv_obj)"|i
get_span_count|lv_spangroup_get_span_count|"(lv.lv_obj)"|i
new_span|lv_spangroup_new_span|"(lv.lv_obj)"|lv.lv_spangroup
refr_mode|lv_spangroup_refr_mode|"(lv.lv_obj)"|
set_align|lv_spangroup_set_align|"(lv.lv_obj)i"|
set_indent|lv_spangroup_set_indent|"(lv.lv_obj)i"|
set_max_lines|lv_spangroup_set_max_lines|"(lv.lv_obj)i"|
set_mode|lv_spangroup_set_mode|"(lv.lv_obj)i"|
set_overflow|lv_spangroup_set_overflow|"(lv.lv_obj)i"|

## `lv_spinbox` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
decrement|lv_spinbox_decrement|"(lv.lv_obj)"|
get_rollover|lv_spinbox_get_rollover|"(lv.lv_obj)"|b
get_step|lv_spinbox_get_step|"(lv.lv_obj)"|i
get_value|lv_spinbox_get_value|"(lv.lv_obj)"|i
increment|lv_spinbox_increment|"(lv.lv_obj)"|
set_cursor_pos|lv_spinbox_set_cursor_pos|"(lv.lv_obj)i"|
set_digit_format|lv_spinbox_set_digit_format|"(lv.lv_obj)ii"|
set_digit_step_direction|lv_spinbox_set_digit_step_direction|"(lv.lv_obj)i"|
set_range|lv_spinbox_set_range|"(lv.lv_obj)ii"|
set_rollover|lv_spinbox_set_rollover|"(lv.lv_obj)b"|
set_step|lv_spinbox_set_step|"(lv.lv_obj)i"|
set_value|lv_spinbox_set_value|"(lv.lv_obj)i"|
step_next|lv_spinbox_step_next|"(lv.lv_obj)"|
step_prev|lv_spinbox_step_prev|"(lv.lv_obj)"|

## `lv_spinner` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
set_anim_params|lv_spinner_set_anim_params|"(lv.lv_obj)ii"|

## `lv_switch` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---

## `lv_table` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_cell_ctrl|lv_table_add_cell_ctrl|"(lv.lv_obj)iii"|
clear_cell_ctrl|lv_table_clear_cell_ctrl|"(lv.lv_obj)iii"|
get_cell_user_data|lv_table_get_cell_user_data|"(lv.lv_obj)ii"|.
get_cell_value|lv_table_get_cell_value|"(lv.lv_obj)ii"|s
get_col_cnt|lv_table_get_column_count|"(lv.lv_obj)"|i
get_col_width|lv_table_get_column_width|"(lv.lv_obj)i"|i
get_column_count|lv_table_get_column_count|"(lv.lv_obj)"|i
get_column_width|lv_table_get_column_width|"(lv.lv_obj)i"|i
get_row_cnt|lv_table_get_row_count|"(lv.lv_obj)"|i
get_row_count|lv_table_get_row_count|"(lv.lv_obj)"|i
get_selected_cell|lv_table_get_selected_cell|"(lv.lv_obj)(lv.uint32)(lv.uint32)"|
has_cell_ctrl|lv_table_has_cell_ctrl|"(lv.lv_obj)iii"|b
set_cell_user_data|lv_table_set_cell_user_data|"(lv.lv_obj)ii."|
set_cell_value|lv_table_set_cell_value|"(lv.lv_obj)iis"|
set_cell_value_fmt|lv_table_set_cell_value_fmt|"(lv.lv_obj)iis[......]"|
set_col_cnt|lv_table_set_column_count|"(lv.lv_obj)i"|
set_col_width|lv_table_set_column_width|"(lv.lv_obj)ii"|
set_column_count|lv_table_set_column_count|"(lv.lv_obj)i"|
set_column_width|lv_table_set_column_width|"(lv.lv_obj)ii"|
set_row_cnt|lv_table_set_row_count|"(lv.lv_obj)i"|
set_row_count|lv_table_set_row_count|"(lv.lv_obj)i"|

## `lv_tabview` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_tab|lv_tabview_add_tab|"(lv.lv_obj)s"|lv.lv_obj
get_content|lv_tabview_get_content|"(lv.lv_obj)"|lv.lv_obj
get_tab_act|lv_tabview_get_tab_active|"(lv.lv_obj)"|i
get_tab_active|lv_tabview_get_tab_active|"(lv.lv_obj)"|i
get_tab_bar|lv_tabview_get_tab_bar|"(lv.lv_obj)"|lv.lv_obj
get_tab_btns|lv_tabview_get_tab_bar|"(lv.lv_obj)"|lv.lv_obj
get_tab_count|lv_tabview_get_tab_count|"(lv.lv_obj)"|i
rename_tab|lv_tabview_rename_tab|"(lv.lv_obj)is"|
set_act|lv_tabview_set_active|"(lv.lv_obj)ii"|
set_active|lv_tabview_set_active|"(lv.lv_obj)ii"|
set_tab_bar_position|lv_tabview_set_tab_bar_position|"(lv.lv_obj)i"|
set_tab_bar_size|lv_tabview_set_tab_bar_size|"(lv.lv_obj)i"|

## `lv_textarea` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_char|lv_textarea_add_char|"(lv.lv_obj)i"|
add_text|lv_textarea_add_text|"(lv.lv_obj)s"|
clear_selection|lv_textarea_clear_selection|"(lv.lv_obj)"|
cursor_down|lv_textarea_cursor_down|"(lv.lv_obj)"|
cursor_left|lv_textarea_cursor_left|"(lv.lv_obj)"|
cursor_right|lv_textarea_cursor_right|"(lv.lv_obj)"|
cursor_up|lv_textarea_cursor_up|"(lv.lv_obj)"|
delete_char|lv_textarea_delete_char|"(lv.lv_obj)"|
delete_char_forward|lv_textarea_delete_char_forward|"(lv.lv_obj)"|
get_accepted_chars|lv_textarea_get_accepted_chars|"(lv.lv_obj)"|s
get_current_char|lv_textarea_get_current_char|"(lv.lv_obj)"|i
get_cursor_click_pos|lv_textarea_get_cursor_click_pos|"(lv.lv_obj)"|b
get_cursor_pos|lv_textarea_get_cursor_pos|"(lv.lv_obj)"|i
get_label|lv_textarea_get_label|"(lv.lv_obj)"|lv.lv_obj
get_max_length|lv_textarea_get_max_length|"(lv.lv_obj)"|i
get_one_line|lv_textarea_get_one_line|"(lv.lv_obj)"|b
get_password_bullet|lv_textarea_get_password_bullet|"(lv.lv_obj)"|s
get_password_mode|lv_textarea_get_password_mode|"(lv.lv_obj)"|b
get_password_show_time|lv_textarea_get_password_show_time|"(lv.lv_obj)"|i
get_placeholder_text|lv_textarea_get_placeholder_text|"(lv.lv_obj)"|s
get_text|lv_textarea_get_text|"(lv.lv_obj)"|s
get_text_selection|lv_textarea_get_text_selection|"(lv.lv_obj)"|b
set_accepted_chars|lv_textarea_set_accepted_chars|"(lv.lv_obj)s"|
set_align|lv_textarea_set_align|"(lv.lv_obj)i"|
set_cursor_click_pos|lv_textarea_set_cursor_click_pos|"(lv.lv_obj)b"|
set_cursor_pos|lv_textarea_set_cursor_pos|"(lv.lv_obj)i"|
set_insert_replace|lv_textarea_set_insert_replace|"(lv.lv_obj)s"|
set_max_length|lv_textarea_set_max_length|"(lv.lv_obj)i"|
set_one_line|lv_textarea_set_one_line|"(lv.lv_obj)b"|
set_password_bullet|lv_textarea_set_password_bullet|"(lv.lv_obj)s"|
set_password_mode|lv_textarea_set_password_mode|"(lv.lv_obj)b"|
set_password_show_time|lv_textarea_set_password_show_time|"(lv.lv_obj)i"|
set_placeholder_text|lv_textarea_set_placeholder_text|"(lv.lv_obj)s"|
set_text|lv_textarea_set_text|"(lv.lv_obj)s"|
set_text_selection|lv_textarea_set_text_selection|"(lv.lv_obj)b"|
text_is_selected|lv_textarea_text_is_selected|"(lv.lv_obj)"|b

## `lv_tileview` widget

Method|LVGL equivalent|Arguments|Return type
:---|:---|:---|:---
add_tile|lv_tileview_add_tile|"(lv.lv_obj)iii"|lv.lv_obj
get_tile_act|lv_tileview_get_tile_active|"(lv.lv_obj)"|lv.lv_obj
get_tile_active|lv_tileview_get_tile_active|"(lv.lv_obj)"|lv.lv_obj
set_tile|lv_tileview_set_tile|"(lv.lv_obj)(lv.lv_obj)i"|
set_tile_by_index|lv_tileview_set_tile_by_index|"(lv.lv_obj)iii"|
set_tile_id|lv_tileview_set_tile_by_index|"(lv.lv_obj)iii"|

