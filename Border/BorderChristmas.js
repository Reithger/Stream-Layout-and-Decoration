import {generic_border, generic_shape, build_grid} from "./BorderSupportShapes.js"
import {produce_canvas, draw_pattern_edge, darken, darken_prop, lighten, lighten_prop, format_rgb_color_string_arr} from "./border.js";
import {cross_screen_mottle_smooth, cross_screen_mottle} from "./BorderSupportPattern.js";

export function christmas_stuff(){
    return {
        "backing" : check_christmas_backings,
        "keyword_back" : keywords_back,
        "borders" : check_christmas_borders,
        "keyword_border" : keywords_border
    }
}

function check_christmas_backings(easel, canvas, wid, hei, size, counter, keyword){
    switch(keyword){
        case "christmas":
            draw_winterlodge_backing(easel, canvas, wid, hei, size, counter);
            return true;
        default:
            return false;
    }
}

function keywords_back(){
    return ["christmas"];
}

function check_christmas_borders(easel, canvas, wid, hei, size, counter, keyword){
    switch(keyword){
        case "christmas":
            draw_christmas_sweater_border(easel, canvas, wid, hei, size, counter);
            return true;
        default:
            return false;
    }
}

function keywords_border(){
    return ["christmas"];
}

//---  Support Data   -------------------------------------------------------------------------

    //-- Greens  ----------------------------------------------

let pine_green = [13, 89, 1];

let stocking_green = [0, 179, 44];

let winter_green = [13, 239, 66];

    //-- Reds  ------------------------------------------------

let mistletoe_red = [220, 61, 42];

let santa_red = [179, 0, 12];

    //-- Blues  -----------------------------------------------

let icicle_blue = [179, 218, 241];

let deep_freeze = [66, 104, 124];

let reindeer_brown = [139, 69, 19];

let black = [0, 0, 0];

let white = [255, 255, 255];

    //-- Color Sets  ------------------------------------------

let colors = {"1" : santa_red, "2" : winter_green, "3" : mistletoe_red, "4" : pine_green, "5" : deep_freeze,
              "6" : reindeer_brown, "7" : darken(stocking_green), "a" : black}

let wreath_colors = {"1" : santa_red, "2" : pine_green, "3" : darken(stocking_green), "4" : black, "5" : reindeer_brown};

let stripe_colors = {"1" : white, "2" : santa_red, "3" : stocking_green};

let panelling_color = {"1" : darken_prop(reindeer_brown, .2), "2" : lighten(reindeer_brown), "3" : darken_prop(reindeer_brown, .3)}

let panelling_alt_color_grn = {"1" : darken_prop(pine_green, .2), "2" : lighten(pine_green), "3" : darken_prop(pine_green, .3)}

let panelling_alt_color_red = {"1" : darken_prop(santa_red, .2), "2" : lighten(santa_red), "3" : darken_prop(santa_red, .3)}

let panelling_alt_color_blu = {"1" : darken_prop(icicle_blue, .2), "2" : lighten(icicle_blue), "3" : darken_prop(icicle_blue, .3)}

let roughend_color = {"1" : darken_prop(reindeer_brown, .4), "2" : lighten_prop(reindeer_brown, .4), "3" : lighten_prop(reindeer_brown, .3),
                      "4" : lighten_prop(reindeer_brown, .45)}

let stocking_color = {"1" : black, "2" : white, "3" : santa_red, "4" : stocking_green, "5" : deep_freeze};

let stocking_color_two = {"1" : black, "2" : white, "3" : pine_green, "4" : mistletoe_red, "5" : icicle_blue};

let window_colors = {"1" : icicle_blue, "2" : black};

//---  Backings   -----------------------------------------------------------------------------

/*
    - Christmas present wrapping
    - Winter cabin pine lodge
    - Hearth with christmas stockings
    - 
 */

    //--  Winter Lodge  ---------------------------------------

function draw_winterlodge_backing(easel, canvas, wid, hei, size, counter){
    let animate = 4;
    
    let mode = "normal";

    if(wid < hei / 3){
        mode = "tall";
    }
    else if (hei < wid / 3){
        mode = "wide";
    }

    if(canvas.offscreenCanvas != undefined){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        if(mode == "normal" || mode == "tall"){
            if(counter % animate == 0){
                draw_snow_move(easel, wid, hei, size * 2, counter);
            }
            else{
                draw_snow(easel, size * 2);
            }
        }
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);

    if(size == null || size == undefined){
        size = 2;
    }

    easel.fillStyle = format_rgb_color_string_arr(white);
    easel.fillRect(0, 0, wid, hei);

    if(mode == "normal"){
        let panel_height = 10;
        let panel_size = size * 1;
        let num_panels = Math.floor(hei / (panel_size * panel_height));
        draw_woodlog_panelling(easel, 0, 0, wid, hei, panel_height, num_panels, panel_size, panelling_color, true);

        let door_height = size * (Math.floor(hei / size * 5 / 12));
        let door_wid = Math.floor(door_height * 2 / 3);
        let door_x = size * (Math.floor(wid / size / 18));
        let door_y = panel_height * num_panels * panel_size - door_height - panel_size;
        draw_door(easel, door_x, door_y, door_wid, door_height, size, panelling_alt_color_red, panelling_alt_color_grn, roughend_color);
        draw_wreath(easel, door_x + door_wid / 2, door_y + door_height * 1 / 3, size * 2, wreath_colors, true);

        let window_x = size * Math.floor(wid / size / 4);
        let window_y = size * Math.floor(hei / size / 5);
        let window_wid = size * Math.floor(wid / size * 2 / 3);
        let window_hei = size * Math.floor(hei / size * 2 / 3);
        panel_size = size / 2;
        num_panels = Math.floor(window_hei / (panel_size * panel_height));

        draw_woodlog_panelling(easel, window_x, window_y, window_wid, window_hei, panel_height, num_panels, panel_size, panelling_alt_color_blu, false);

        //-- Chimney  -----------------------------------------

        let chimney_wid = window_wid / 4;
        let chimney_hei = window_hei * 4 / 9;
        let chimney_x = window_x + Math.floor(window_wid / size / 12) * size;
        let chimney_y = window_y + window_hei - Math.floor(chimney_hei / size) * size;
        chimney_y = Math.floor(chimney_y / size) * size;
        let brick_wid = 10;
        let brick_hei = 5;

        draw_brick_square(easel, chimney_x + 2 * brick_wid * size, window_y, chimney_wid - 4 * brick_wid * size, (chimney_y - window_y) / 2 + brick_hei * size, size, brick_wid, brick_hei);
        draw_brick_square(easel, chimney_x + brick_wid * size, window_y + ((chimney_y - window_y) / 2), chimney_wid - 2 * brick_wid * size, (chimney_y - window_y) / 2, size, brick_wid, brick_hei);
        
        draw_brick_square(easel, chimney_x, chimney_y, chimney_wid, chimney_hei, size, brick_wid, brick_hei);
        draw_brick_square(easel, chimney_x - brick_wid * size, chimney_y - brick_hei * size, chimney_wid + 2 * brick_wid * size, (brick_hei * 2 - 1) * size, size, brick_wid, brick_hei);
        
        draw_brick_square(easel, chimney_x + brick_wid * 1 * size, chimney_y + brick_hei * 5 * size, chimney_wid - 2 * brick_wid * size, brick_hei * 1 * size, size, brick_wid, brick_hei);
        
        draw_brick_square(easel, chimney_x + brick_wid * 2 * size - brick_hei * size, chimney_y + brick_hei * 5 * size + brick_hei * size, brick_hei * size, brick_wid * 4 * size, size, brick_hei, brick_wid);
        draw_brick_square(easel, chimney_x + brick_wid * 2 * size + chimney_wid - 4 * brick_wid * size, chimney_y + brick_hei * 5 * size + brick_hei * size, brick_hei * size, brick_wid * 4 * size, size, brick_hei, brick_wid);

        draw_brick_square(easel, chimney_x + brick_wid * 2 * size, chimney_y + brick_hei * 6 * size, chimney_wid - 4 * brick_wid * size, chimney_hei - brick_hei * 6 * size, size, 6, 3);

        //-- Stockings  ---------------------------------------

        chimney_y += brick_hei * size * 2;

        draw_stocking(easel, chimney_x + chimney_wid * 2 / 9, chimney_y, size * 1, stocking_color, true);
        draw_stocking(easel, chimney_x + chimney_wid * 5 / 9, chimney_y, size * 1, stocking_color_two, true);
        draw_stocking(easel, chimney_x + chimney_wid * 8 / 9, chimney_y, size * 1, stocking_color, true);

        //-- Window Outline  ----------------------------------

        draw_window_back(easel, window_x, window_y, window_wid, window_hei, size*2, panelling_alt_color_grn);
        
        draw_window_pane_overlay(easel, window_x + size * 8, window_y + size * 7, window_wid - size * 12, window_hei - size * 12, size, panelling_alt_color_grn);
        
        cross_screen_mottle(easel, 0, Math.floor(hei / size * 19 / 20) * size, white, icicle_blue, size, wid, 4, 2);
        cross_screen_mottle(easel, 0, Math.floor(hei / size * 19 / 20 + 4) * size, white, icicle_blue, size, wid, 4, 2);
        cross_screen_mottle(easel, 0, Math.floor(hei / size * 19 / 20 + 8) * size, white, icicle_blue, size, wid, 4, 2);
        cross_screen_mottle(easel, Math.floor(wid / size * 6 / 20) * size, Math.floor(hei / size * 19 / 20 + 8) * size, white, icicle_blue, size, wid, 20, 16, 8);
        cross_screen_mottle(easel, Math.floor(wid / size * 7 / 20) * size, Math.floor(hei / size * 19 / 20 + 10) * size, white, icicle_blue, size, wid, 36, 24, 12);
        cross_screen_mottle(easel, Math.floor(wid / size * 12 / 20) * size, Math.floor(hei / size * 19 / 20 + 10) * size, white, icicle_blue, size, wid, 32, 24, 12);
        cross_screen_mottle(easel, Math.floor(wid / size * 4 / 20) * size, Math.floor(hei / size * 19 / 20 + 6) * size, white, icicle_blue, size, wid, 16, 10, 12);

    }
    else if(mode == "tall"){
        let panel_height = 10;
        let panel_size = size * 1;
        let num_panels = Math.floor(hei / (panel_size * panel_height)) + 1;
        draw_woodlog_panelling(easel, 0, 0, wid, hei, panel_height, num_panels, panel_size, panelling_color, true);
        draw_wreath(easel, wid / 2, size * 24, size * 2, wreath_colors, true);

        
        cross_screen_mottle(easel, 0, Math.floor(hei / size * 19 / 20) * size, white, icicle_blue, size, wid, 4, 2);
        cross_screen_mottle(easel, 0, Math.floor(hei / size * 19 / 20 + 4) * size, white, icicle_blue, size, wid, 4, 2);
        cross_screen_mottle(easel, 0, Math.floor(hei / size * 19 / 20 + 8) * size, white, icicle_blue, size, wid, 4, 2);
    }
    else if(mode == "wide"){
        let panel_height = 6;
        let panel_size = size * 1;
        let num_panels = Math.floor(hei / (panel_size * panel_height));
        draw_woodlog_panelling(easel, 0, 0, wid, hei, panel_height, num_panels, panel_size, panelling_color, false);
        
        let door_height = size * (Math.floor(hei / size * 7 / 12));
        let door_wid = Math.floor(door_height * 2 / 3);
        let door_x = size * (Math.floor(wid / size / 18));
        let door_y = panel_height * num_panels * panel_size - door_height - panel_size;
        draw_door(easel, door_x, door_y, door_wid, door_height, size / 2, panelling_alt_color_red, panelling_alt_color_grn, roughend_color);
        
        draw_wreath(easel, door_x + door_wid / 2, door_y + door_height / 3, size, wreath_colors, true);

        cross_screen_mottle(easel, 0, Math.floor(hei / size * 17 / 20) * size, white, icicle_blue, size, wid, 4, 2);
        cross_screen_mottle(easel, 0, Math.floor(hei / size * 17 / 20 + 4) * size, white, icicle_blue, size, wid, 4, 2);
        cross_screen_mottle(easel, 0, Math.floor(hei / size * 17 / 20 + 8) * size, white, icicle_blue, size, wid, 4, 2);
    }

    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

    //-- Animation Snow Fall  ---------------------------------

let snow_count = 0;
let positions = [];

let snow_max = -1;

let snow_fall_color = [255, 255, 255, .8];

function draw_snow_move(easel, wid, hei, size, counter){
    snow_max = wid * hei / 90 + (wid * hei / 100) * Math.cos(2 * Math.PI * (counter % 500) / 500);
    while(snow_count < snow_max){
        positions.push([Math.floor(Math.random() * wid), Math.floor(Math.random() * hei * -1)]);
        snow_count++;
    }
    while(snow_count > snow_max){
        positions.pop();
        snow_count--;
    }
    easel.fillStyle = format_rgb_color_string_arr(snow_fall_color);
    for(let i = 0; i < positions.length; i++){
        positions[i][1] += Math.floor(Math.random() * 3) + 1;
        if(positions[i][1] > hei){
            positions[i] = [Math.floor(Math.random() * wid), 0];
        }
        let ran = Math.random();
        if(ran > .8){
            positions[i][0] += 1;
        }
        else if(ran < .2){
            positions[i][0] -= 1;
        }
        easel.fillRect(positions[i][0] * size, positions[i][1] * size, size, size);
    }
}

function draw_snow(easel, size){
    easel.fillStyle = format_rgb_color_string_arr(snow_fall_color);
    for(let i = 0; i < positions.length; i++){
        easel.fillRect(positions[i][0] * size, positions[i][1] * size, size, size);
    }
}

    //-- Windows  ---------------------------------------------

function draw_window_back(easel, x, y, wid, hei, size, frame_colors){
    let effective_wid = Math.floor(wid / size);
    let effective_hei = Math.floor(hei / size);

    draw_woodlog_panel(easel, x, y, wid + size * 2, size * 4, size, frame_colors);
    draw_woodlog_panel(easel, x, y + (effective_hei - 2) * size, wid + size * 2, size * 4, size, frame_colors);
    draw_woodlog_panel(easel, x, y + size, size * 4, hei, size, frame_colors, true);
    draw_woodlog_panel(easel, x + (effective_wid - 2) * size, y + size, size * 4, hei, size, frame_colors, true);
}

function draw_window_pane_overlay(easel, x, y, wid, hei, size, frame_colors){
    let effective_wid = Math.floor(wid / size);
    let effective_hei = Math.floor(hei / size);

    draw_woodlog_panel(easel, x, y + (effective_hei / 2) * size, wid + size * 2, size * 4, size, frame_colors);
    draw_woodlog_panel(easel, x + (effective_wid / 3) * size, y + size, size * 4, hei, size, frame_colors, true);
    draw_woodlog_panel(easel, x + (effective_wid * 2 / 3) * size, y + size, size * 4, hei, size, frame_colors, true);
}

function draw_door(easel, x, y, wid, hei, size, colors_door, colors_outline, colors_roughend){
    let gap = size * 6;

    // Door back
    draw_woodlog_panelling(easel, x, y + gap, wid, hei - 1 * gap, 10, (wid - gap) / size / 10, size, colors_door, false, true);

    // Door Frame
    draw_woodlog_panel(easel, x, y - 1 * size, wid + size * 2, size * 8, size, colors_outline);
    draw_woodlog_panel(easel, x, y, size * 8, hei, size, colors_outline, true);
    draw_woodlog_panel(easel, x + wid - 6 * size, y, size * 8, hei, size, colors_outline, true);

    // Knob and/or Bell End
    easel.fillStyle = format_rgb_color_string_arr(colors_door["3"]);
    easel.fillRect(x + (Math.floor(wid / size) - 11) * size, y + (Math.floor(hei / size) * 7 / 12) * size, size * 4, size * 4);
}

    //-- Wood Panelling  --------------------------------------

function draw_roughend_wood_eight(easel, x, y, size, colors, centered = false){
    let shape = "";
    shape = build_grid(shape, "00111100");
    shape = build_grid(shape, "01222210");
    shape = build_grid(shape, "12233221");
    shape = build_grid(shape, "12322321");
    shape = build_grid(shape, "12322321");
    shape = build_grid(shape, "12233221");
    shape = build_grid(shape, "01222210");
    shape = build_grid(shape, "00111100");
    generic_shape(easel, x, y, size, shape, colors, centered);
}

function draw_roughend_wood_ten(easel, x, y, size, colors, centered = false){
    let shape = "";
    shape = build_grid(shape, "0001111000");
    shape = build_grid(shape, "0012222100");
    shape = build_grid(shape, "0122332210");
    shape = build_grid(shape, "1223443221");
    shape = build_grid(shape, "1234334321");
    shape = build_grid(shape, "1234334321");
    shape = build_grid(shape, "1223443221");
    shape = build_grid(shape, "0122332210");
    shape = build_grid(shape, "0012222100");
    shape = build_grid(shape, "0001111000");
    generic_shape(easel, x, y, size, shape, colors, centered);
}

function draw_woodlog_panelling(easel, x, y, wid, hei, section_height, sections, size, colors, roughends = false, vert = false){
    let add = section_height * size;
    for(let i = 0; i < sections; i++){
        draw_woodlog_panel(easel, x + (vert ? add * i : 0), y + (vert ? 0 : add * i), vert ? add : wid, vert ? hei : add, size, colors, vert);
        if(roughends){
            draw_roughend_wood_ten(easel, x, y + add * i, size, roughend_color);
            draw_roughend_wood_ten(easel, x + wid - section_height * size, y + add * i, size, roughend_color);
        }
    }
}

function draw_woodlog_panel(easel, x, y, wid, hei, size, colors, vert = false){
    let effective_height = Math.floor(vert ? (wid / size) : (hei / size));
    let rows = [colors["1"], colors["2"], colors["3"]];
    for(let i = 0; i < effective_height; i++){
        let color = rows[i == 0 ? 0 : i == effective_height - 1 ? 2 : 1];
        easel.fillStyle = format_rgb_color_string_arr(color);
        if(vert){
            easel.fillRect(x + i * size, y, size, hei);
        }
        else{
            easel.fillRect(x, y + i * size, wid, size);
        }

        for(let j = 0; j < Math.floor(vert ? (hei / size) : (wid / size)); j++){
            let dist = Math.floor(Math.random() * 6) + 2;
            while((j + dist) * size > (vert ? hei : wid)){
                dist -= 1;
            }
            if(Math.random() < .1){
                easel.fillStyle = format_rgb_color_string_arr(darken_prop(color, .1));
                easel.fillRect(x + (vert ? i : j) * size, y + (vert ? j : i) * size, size * (vert ? 1 : dist), size * (vert ? dist : 1));
                j += dist - 1;
                continue;
            }
            if(Math.random() > .9){
                easel.fillStyle = format_rgb_color_string_arr(lighten_prop(color, .1));
                easel.fillRect(x + (vert ? i : j) * size, y + (vert ? j : i) * size, size * (vert ? 1 : dist), size * (vert ? dist : 1));
                j += dist - 1;
                continue;
            }
        }
    }
}

    //-- Brick  -----------------------------------------------

function draw_brick_square(easel, x, y, wid, hei, size, brick_size, brick_height, brick_color = santa_red){
    let curr_y = y;
    let i = 0;
    while(curr_y - y  + brick_height * size <= hei){
        let curr_x = x;
        while(curr_x < x + wid){
            let use_wid = (curr_x == x && i % 2 == 0 && wid > 2 * brick_size * size) ? Math.floor(brick_size / 2) : brick_size;

            if(curr_x + use_wid * size > x + wid){
                use_wid = Math.floor((x + wid - curr_x) / size) + 1;
                use_wid = use_wid < 1 ? 1 : use_wid;
            }

            for(let j = 0; j < use_wid; j++){
                for(let k = 0; k < brick_height; k++){
                    let color = santa_red;
                    if(k == 0 || j == 0 || j == use_wid - 1 || k == brick_height - 1){
                        color = [66, 66, 66];
                    }
                    let ran = Math.random();
                    let ot = Math.random() / 10;
                    if(ran > .5){
                        color = lighten_prop(color, ot);
                    }
                    else{
                        color = darken_prop(color, ot);
                    }

                    easel.fillStyle = format_rgb_color_string_arr(color);
                    easel.fillRect(curr_x + j * size, curr_y + k * size, size, size);
                }
            }
            curr_x += (use_wid - 1) * size;
        }
        curr_y += (brick_height - 1) * size;
        i += 1;
    }
    easel.fillStyle = format_rgb_color_string_arr(black);
    easel.fillRect(x, y, wid, size);
    easel.fillRect(x, y, size, hei);
    easel.fillRect(x + wid, y, size, hei);
    easel.fillRect(x, y + hei - size, wid, size);
}

    //-- Festive Symbols  -------------------------------------

function draw_wreath(easel, x, y, size, colors, centered = false){
    x = Math.floor(x / size) * size;
    y = Math.floor(y / size) * size;
    let shape = "";
    shape = build_grid(shape, "000000444444000000");
    shape = build_grid(shape, "000044333333440000");
    shape = build_grid(shape, "000433222252334000");
    shape = build_grid(shape, "004322222222223400");
    shape = build_grid(shape, "043252244442222340");
    shape = build_grid(shape, "432222400004222234");
    shape = build_grid(shape, "422224000000422224");
    shape = build_grid(shape, "422240000000042524");
    shape = build_grid(shape, "425240000000042224");
    shape = build_grid(shape, "422340000000043254");
    shape = build_grid(shape, "422340000000043224");
    shape = build_grid(shape, "422234000000432224");
    shape = build_grid(shape, "422223114411322524");
    shape = build_grid(shape, "042521221122122240");
    shape = build_grid(shape, "004222112211222400");
    shape = build_grid(shape, "000422212212224000");
    shape = build_grid(shape, "000044144441440000");
    generic_shape(easel, x, y, size, shape, colors, centered);
}

function draw_stocking(easel, x, y, size, colors, centered = false){
    x = Math.floor(x / size) * size;
    y = Math.floor(y / size) * size;
    let shape = "";
    shape = build_grid(shape, "000000011110111101111000");
    shape = build_grid(shape, "000000122221222212222100");
    shape = build_grid(shape, "000000122222222222222100");
    shape = build_grid(shape, "000000012221222212221000");
    shape = build_grid(shape, "000000122221222212222100");
    shape = build_grid(shape, "000000122222222222222100");
    shape = build_grid(shape, "000000012211222211221000");
    shape = build_grid(shape, "000000001133111133110000");

    shape = build_grid(shape, "000000013333333333331000");
    shape = build_grid(shape, "000000013553355335531000");
    shape = build_grid(shape, "000000015335533553351000");
    shape = build_grid(shape, "000000013553355335531000");

    shape = build_grid(shape, "000000013333333333331000");
    shape = build_grid(shape, "000000013333333333321000");
    shape = build_grid(shape, "000000013333333333141000");
    shape = build_grid(shape, "000000133333333332441000");
    shape = build_grid(shape, "000001333333333324441000");
    shape = build_grid(shape, "000013333333333144441000");
    shape = build_grid(shape, "000133333333333244410000");
    shape = build_grid(shape, "001333333333333144100000");
    shape = build_grid(shape, "015333333333333321000000");
    shape = build_grid(shape, "015333333333333310000000");
    shape = build_grid(shape, "153333333333333100000000");
    shape = build_grid(shape, "153333333333331000000000");
    shape = build_grid(shape, "153333333333310000000000");
    shape = build_grid(shape, "015333333333100000000000");
    shape = build_grid(shape, "015333333331000000000000");
    shape = build_grid(shape, "001553355110000000000000");
    shape = build_grid(shape, "000115511000000000000000");
    shape = build_grid(shape, "000001100000000000000000");
    generic_shape(easel, x, y, size, shape, colors, centered);
}

//---  Borders   ------------------------------------------------------------------------------

let border_canvas = undefined

let color_block = [];

let corner_block = [];

function draw_christmas_sweater_border(easel, canvas, wid, hei, size, counter){
    if(border_canvas != undefined){
        easel.drawImage(border_canvas, 0, 0, wid, hei, 0, 0, wid, hei);
        return;
    }
    border_canvas = produce_canvas(wid, hei);

    initialize_christmas_edge();
    initialize_christmas_corner();


    draw_pattern_edge(border_canvas, border_canvas.getContext("2d"), color_block, corner_block, wid, hei, 3, false);
}

function initialize_christmas_edge(){
    let shape = "";
    shape = build_grid(shape, "11111111111111");
    shape = build_grid(shape, "31222222222213");
    shape = build_grid(shape, "33122222222133");
    shape = build_grid(shape, "33311212211333");
    shape = build_grid(shape, "33311221211333");
    shape = build_grid(shape, "33122222222133");
    shape = build_grid(shape, "31222222222213");  
    shape = build_grid(shape, "11111111111111");
    color_block = generic_border(shape, stripe_colors);

}

function initialize_christmas_corner(){
    let shape = "";
    shape = build_grid(shape, "11111111");
    shape = build_grid(shape, "12133121");
    shape = build_grid(shape, "11333311");
    shape = build_grid(shape, "13322331");
    shape = build_grid(shape, "13322331");
    shape = build_grid(shape, "11333311");
    shape = build_grid(shape, "12133121");
    shape = build_grid(shape, "11111111");
    corner_block = generic_border(shape, stripe_colors);
}