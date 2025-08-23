import { produce_canvas, darken_prop, format_rgb_color_string, lighten, darken, format_rgb_color_string_arr, draw_pattern_edge, draw_pattern_edge_sides} from "./border.js";

//---  Backgrounds   --------------------------------------------------------------------------

    //-- Arcade Background  -----------------------------------

let floor_mat_color = darken([41, 49, 49]);

let maroon = [206, 49, 57];

let pear = [156, 189, 33];

let violet = [148, 90, 165];

let teal = [123, 156, 140];

let arcade_colors = [maroon, pear, violet, teal];

let arcade_ref = undefined;


export function draw_arcade_mat_backing(easel, canvas, wid, hei, size){
    if(canvas.offscreenCanvas != undefined){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);
    easel.fillStyle = format_rgb_color_string_arr(floor_mat_color);

    easel.fillRect(0, 0, wid, hei);

    let wid_break = wid > hei ? 4 : 3;

    let hei_break = wid > hei ? 3 : 4;

    if(arcade_ref == undefined){
        arcade_ref = [];
        for(let i = 0; i < wid / wid_break / size; i++){
            let arr = [];
            for(let j = 0; j < hei / hei_break / size; j++){
                arr.push(floor_mat_color);
            }
            arcade_ref.push(arr);
        }
        for(let i = 0; i < arcade_ref.length; i++){
            for(let j = 0; j < arcade_ref[i].length; j++){
                if(Math.random() < .13){
                    let color = arcade_colors[Math.floor(Math.random() * arcade_colors.length)];
                    if(Math.random() < .3 && i > 0 && i < arcade_ref.length - 1 && j > 0 && j < arcade_ref[i].length - 1){
                        arcade_ref[i - 1][j] = color;
                        arcade_ref[i + 1][j] = color;
                        arcade_ref[i][j - 1] = color;
                        arcade_ref[i][j + 1] = color;
                        arcade_ref[i][j] = lighten(lighten(lighten(color)));
                    }
                    else{
                        arcade_ref[i][j] = color;
                    }
                    j += 3;
                }
            }
        }
    }

    for(let i = 0; i < arcade_ref.length; i++){
        let x = i * size;
        for(let j = 0; j < arcade_ref[i].length; j++){
            let y = j * size;
            easel.fillStyle = format_rgb_color_string_arr(arcade_ref[i][j]);
            easel.fillRect(x, y, size, size);
        }
    }

    for(let i = 0; i < wid_break; i++){
        for(let j = 0; j < hei_break; j++){
            let calc_wid = arcade_ref.length * size;
            let calc_hei = arcade_ref[0].length * size;
            easel.drawImage(canvas, 0, 0, calc_wid, calc_hei, calc_wid * i, calc_hei * j, calc_wid, calc_hei);
        }
    }

    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

    //-- Beach Background  ------------------------------------

let sand_color = [224, 208, 120];

let water_color = [152, 192, 184];

let sandy_water = [192, 208, 176];

let surf_color = [232, 224, 192];

let dark_sand = [216, 192, 112];

export function draw_beach_backing(easel, canvas, wid, hei, size){
    if(canvas.offscreenCanvas != undefined){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);

    mottle_layers(easel, wid, hei, size, 
        [sand_color, dark_sand, surf_color, sandy_water, water_color],
         [.66, .76, .78, .85],
         [false, true, true, false],
        [[8, 4], [8, 6], [8, 6], [8, 3]]);

        //TODO: If the browser source is narrow (taller than wide), need to adjust some backgrounds for that context

    cross_screen_vert_mottle(easel, 0, hei * .1, lighten(lighten(sand_color)), surf_color, dark_sand, size, wid, 6, 8, 0);
    cross_screen_vert_mottle(easel, 0, hei * .25, lighten(lighten(sand_color)), surf_color, dark_sand, size, wid, 7, 7, 0);
    cross_screen_vert_mottle(easel, 0, hei * .4, lighten(lighten(sand_color)), surf_color, dark_sand, size, wid, 6, 6, 0);
    cross_screen_vert_mottle(easel, 0, hei * .55, lighten(lighten(sand_color)), surf_color, dark_sand, size, wid, 7, 5, 0);

    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

function mottle_layers(easel, wid, hei, size, color_list, prop_list, smooth_list, sin_list){
    let last_prop = 0;
    easel.fillStyle = format_rgb_color_string_arr(color_list[0]);
    easel.fillRect(0, 0, wid, hei);
    for(let i = 0; i < color_list.length - 1; i++){
        let color_one = color_list[i];
        let color_two = color_list[i + 1];
        let prop = prop_list[i];
        easel.fillStyle = format_rgb_color_string_arr(color_two);
        easel.fillRect(0, hei * prop, wid, hei * (1 - prop));
        let sin_wid = sin_list[i][0];
        let sin_trough = sin_list[i][1];
        if(smooth_list[i]){
            cross_screen_mottle_smooth(easel, 0, hei * prop, color_one, color_two, size, wid, sin_wid, sin_trough);
        }
        else{
            cross_screen_mottle(easel, 0, hei * prop, color_one, color_two, size, wid, sin_wid, sin_trough);
        }
        last_prop = prop;
    }
}

function cross_screen_vert_mottle(easel, start_x, start_y, color_one, color_two, color_three, size, wid, step_width, trough_height){
    let ind = 0;

    while(start_x < wid){
        let val = Math.floor(Math.sin(.5 * Math.PI * (ind / step_width) - 1.25 * Math.PI) * trough_height);
        vert_mottle(easel, start_x, start_y + val * size, color_one, color_two, color_three, size);
        start_x += size * 2;
        ind += 1;
    }
}

function vert_mottle(easel, x, y, color_one, color_two, color_three, size){
    easel.fillStyle = format_rgb_color_string_arr(color_one);
    easel.fillRect(x, y, size, size);
    easel.fillStyle = format_rgb_color_string_arr(color_two);
    easel.fillRect(x, y + size, size, size);
    easel.fillStyle = format_rgb_color_string_arr(color_three);
    easel.fillRect(x, y + 2 * size, size, size);
    easel.fillRect(x, y + 3 * size, size, size);
}

    //-- Water Background  ------------------------------------


let basic_water_blue = [64, 112, 184];

let bubble_blue = [120, 192, 232];

let coral_red = [168, 120, 128];

export function draw_poke_water_backing(easel, canvas, wid, hei, size){
    if(canvas.offscreenCanvas != undefined){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);

    easel.fillStyle = format_rgb_color_string_arr(basic_water_blue);

    easel.fillRect(0, 0, wid, hei);

    easel.fillStyle = format_rgb_color_string_arr(darken(basic_water_blue));
    easel.fillRect(0, hei * .8, wid, hei * .2);

    let mottle_wid = 3;
    let mottle_hei = 5;

    cross_screen_mottle(easel, 0, hei * .8, basic_water_blue, darken(basic_water_blue), size, wid, mottle_wid, mottle_hei);

    let dark_water = darken(darken(basic_water_blue));

    easel.fillStyle = format_rgb_color_string_arr(darken(darken(basic_water_blue)));

    easel.fillRect(0, hei * .9, wid, hei * .1);

    cross_screen_mottle(easel, 0, hei * .9 - size, darken(basic_water_blue), dark_water, size, wid, mottle_wid, mottle_hei);

    let start_x = size * -8;
    let ind = 0;
    while(start_x < wid){
        let wid_gap = size * 10;
        let start_y = ind % 4 == 0 ? size * 0 : ind % 4 == 1 ? size * 2 : ind % 4 == 2 ? size * 4 : size * 2;
        //let start_y = ind % 2 == 0 ? size * 2 : size * 4;
        start_y += 4 * size;
        draw_blot(easel, start_x + wid_gap / 6, start_y, bubble_blue, 7, size);
        start_y += hei / 7;
        draw_blot(easel, start_x + wid_gap, start_y, bubble_blue, 6, size);
        start_y += hei / 7;
        draw_blot(easel, start_x + wid_gap * 3 / 4, start_y, darken_prop(bubble_blue, .15), 5, size);
        start_y += hei / 7;
        draw_blot(easel, start_x + wid_gap / 4, start_y, darken_prop(bubble_blue, .18), 5, size);
        start_y += hei / 7;
        draw_blot(easel, start_x + wid_gap / 3, start_y, darken_prop(bubble_blue, .22), 4, size);
        start_y += hei / 7;
        draw_blot(easel, start_x + wid_gap * 2 / 3, start_y, darken_prop(bubble_blue, .25), 4, size);

        start_y -= size * 6;

        start_y += hei / 7;
        easel.fillStyle = format_rgb_color_string_arr(darken(dark_water));
        easel.fillRect(start_x + wid_gap / 2 - 1 * size, start_y + size * 4, size * 7, size * 3);
        easel.fillRect(start_x + wid_gap / 2 - 0 * size, start_y + size * 6, size * 5, size * 2);
        easel.fillStyle = format_rgb_color_string_arr(darken(coral_red));
        easel.fillRect(start_x + wid_gap / 2 - 1 * size, start_y + size * 2, size * 7, size * 2);
        easel.fillRect(start_x + wid_gap / 2 - 0 * size, start_y + size * 4, size * 5, size * 1);
        easel.fillRect(start_x + wid_gap / 2 + 1 * size, start_y + size * 5, size * 3, size * 1);

        simple_cross(easel, start_x + wid_gap / 2, start_y, coral_red, size);
        simple_cross(easel, start_x + wid_gap / 2 - 2 * size, start_y , coral_red, size);
        simple_cross(easel, start_x + wid_gap / 2 + 2 * size, start_y, coral_red, size);
        simple_cross(easel, start_x + wid_gap / 2 + 4 * size, start_y , coral_red, size);

        start_x += size * mottle_wid * mottle_hei;
        ind += 1;
    }

    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

function simple_cross(easel, x, y, color, size){
    easel.fillStyle = format_rgb_color_string_arr(color);
    easel.fillRect(x, y + size, size, size);
    easel.fillRect(x + size, y, size, size);
    easel.fillRect(x + 2 * size, y + size, size, size);
    easel.fillRect(x + size, y + 2 * size, size, size);
}

    //-- Grass Background  ------------------------------------

let grass_color = [156, 206, 99];

export function draw_grass_box_backing(easel, canvas, wid, hei, size){
    if(canvas.offscreenCanvas != undefined){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);
    easel.fillStyle = format_rgb_color_string_arr(grass_color);

    easel.fillRect(0, 0, wid, hei);

    let light = lighten(grass_color);
    let dark = darken(grass_color);

    let base_wid_a = 12 * size;
    let base_wid_b = 4 * size;
    let symbol_wid = 16 * size;
    let base_hei = size * 4;

    for(let i = 0; base_wid_a + i * symbol_wid < wid; i += 1){
        draw_petal_imprint(easel, base_wid_a + i * symbol_wid, base_hei, i % 2 == 0 ? light : dark, size);
    }

    for(let i = 0; base_wid_b + i * symbol_wid < wid; i += 1){
        draw_petal_imprint(easel, base_wid_b + i * symbol_wid, base_hei * 3, i % 2 == 1 ? light : dark, size);
    }
    

    let step = base_hei * 4.5;

    let y = step;

    let ind = 0;

    base_hei = 3 * size;

    while(y - ind * base_hei < hei){
        easel.drawImage(canvas, 0, base_hei, wid, step - base_hei, 0, y - base_hei * ind, wid, step - base_hei);
        ind += 1;
        y += step;
    }
    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

function draw_petal_imprint(easel, x, y, color, size){
    easel.fillStyle = format_rgb_color_string_arr(color);
    easel.fillRect(x, y + 2 * size, 2 * size, 2 * size);
    easel.fillRect(x + 1 * size, y + 3 * size, 2 * size, 2 * size);

    easel.fillRect(x + 3 * size, y + 1 * size, 3 * size, 2 * size);
    easel.fillRect(x + 4 * size, y, 1 * size, 4 * size);
    
    easel.fillRect(x + 7 * size, y + 2 * size, 2 * size, 2 * size);
    easel.fillRect(x + 6 * size, y + 3 * size, 2 * size, 2 * size);
    
    /*
    easel.fillRect(x + 4 * size, y - 2 * size, size, size);

    easel.fillStyle = format_rgb_color_string_arr(alt_color);

    easel.fillRect(x - size, y, size, size);
    
    easel.fillRect(x + 9 * size, y, size, size);
    */

}

    //-- Snow Background  -------------------------------------

let low_back_color = [231, 239, 255];

let high_back_color = [206, 231, 247];

let snow = [255, 255, 255];

export function draw_snow_box_backing(easel, canvas, wid, hei, size){
    if(canvas.offscreenCanvas != undefined){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);
    easel.fillStyle = format_rgb_color_string_arr(low_back_color);

    easel.fillRect(0, 0, wid, hei);

    easel.fillStyle = format_rgb_color_string_arr(high_back_color);

    let color_break = hei / 3;

    easel.fillRect(0, 0, wid, color_break);

    let across_x = 0;

    let across_y = color_break;

    cross_screen_mottle(easel, across_x, across_y, high_back_color, low_back_color, size, wid, 3, 5);

    let start_x = 30;
    let start_y = 30;

    let step_x = 95;

    while(start_y < hei){

        start_x = 30;

        while(start_x < wid){
            draw_cross(easel, start_x, start_y, snow, size);
            start_x += step_x;
        }

        start_y += 25;

        start_x = 80;

        while(start_x < wid){
            draw_blot(easel, start_x, start_y, snow, 4, size);
            start_x += step_x;
        }

        start_y += 25;

        start_x = 30;

        while(start_x < wid){
            draw_blot(easel, start_x, start_y, snow, 4, size);
            start_x += step_x;
        }

        start_y += 25;
        start_x = 70;

        while(start_x < wid){
            draw_cross(easel, start_x, start_y, snow, size);
            start_x += step_x;
        }
        start_y += 25;
    }

    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

function cross_screen_mottle(easel, start_x, start_y, color_one, color_two, size, wid, step_width, trough_height, clean_height = trough_height){
    let ind = 0;

    while(start_x < wid){
        let val = Math.floor(Math.sin(.5 * Math.PI * (ind / step_width) - 1.25 * Math.PI) * trough_height);
        mottle_block(easel, start_x, start_y + val * size, color_one, color_two, size, clean_height);
        start_x += size * 2;
        ind += 1;
    }
}

function cross_screen_mottle_smooth(easel, start_x, start_y, color_one, color_two, size, wid, step_width, trough_height){
    let cap = step_width * trough_height;

    let ind = 0; //Math.floor(cap / 2);

    while(start_x < wid){
        let val = Math.floor(Math.sin(.5 * Math.PI * (ind / step_width) - 1.25 * Math.PI) * trough_height);
        mottle_smooth(easel, start_x, start_y + val * size, color_one, color_two, size, trough_height);
        start_x += size * 2;
        ind += 1;
    }
}

function mottle_block(easel, x, y, color_one, color_two, size, clean_height = 5){
    easel.fillStyle = format_rgb_color_string_arr(color_one);
    easel.fillRect(x, y, size, size);
    easel.fillRect(x + size, y + size, size, size);
    // This last fill of this color is to fix color discrepencies above/below this spot
    easel.fillRect(x, y - size * clean_height, 2 * size, clean_height * size);
    easel.fillStyle = format_rgb_color_string_arr(color_two);
    easel.fillRect(x + size, y, size, size);
    easel.fillRect(x, y + size, size, size);
    // This last fill of this color is to fix color discrepencies above/below this spot
    easel.fillRect(x, y + 2 * size, 2 * size, clean_height * size);
}

function mottle_smooth(easel, x, y, color_one, color_two, size, clean_height = 5){
    easel.fillStyle = format_rgb_color_string_arr(color_one);
    // This last fill of this color is to fix color discrepencies above/below this spot
    easel.fillRect(x, y - size * clean_height, 2 * size, clean_height * size);
    easel.fillStyle = format_rgb_color_string_arr(color_two);
    // This last fill of this color is to fix color discrepencies above/below this spot
    easel.fillRect(x, y + 2 * size, 2 * size, clean_height * size);
}

function draw_blot(easel, x, y, color, blot_size, block_size){
    easel.fillStyle = format_rgb_color_string_arr(color);
    for(let i = 1; i < blot_size - 1; i++){
        for(let j = 0; j < blot_size; j++){
            easel.fillRect(x + block_size * (i - 1), y + block_size * (j - 1), block_size, block_size);
        }
    }
    for(let i = 0; i < blot_size; i++){
        for(let j = 1; j < blot_size - 1; j++){
            easel.fillRect(x + block_size * (i - 1), y + block_size * (j - 1), block_size, block_size);
        }
    }
}

function draw_cross(easel, x, y, color, size){
    easel.fillStyle = format_rgb_color_string_arr(color);
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(i % 2 != 0 || j % 2 != 0){
                easel.fillRect(x + size * (i - 1), y + size * (j - 1), size, size);
            }
        }
    }
}

    //-- Fossil Foot Background  ------------------------------

let ground_color = [176, 144, 104];

let imprint_color = lighten(ground_color);

let edge_color = [152, 120, 96];

export function draw_footprint_backing(easel, canvas, wid, hei, size){
    if(canvas.offscreenCanvas != undefined){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);
    easel.fillStyle = format_rgb_color_string_arr(ground_color);

    easel.fillRect(0, 0, wid, hei);

    let base_wid_a = -4 * size;
    let base_wid_b = 2 * size;
    let symbol_wid = 14 * size;
    let base_hei = size * 9;

    let accent = edge_color;

    let texture = darken(ground_color);

    for(let i = 0; base_wid_a + i * symbol_wid < wid; i += 1){
        draw_footprint_imprint(easel, base_wid_a + i * symbol_wid, base_hei / 2, imprint_color, accent, texture, size);
    }

    for(let i = 0; base_wid_b + i * symbol_wid < wid; i += 1){
        draw_footprint_imprint(easel, base_wid_b + i * symbol_wid, base_hei * 2, imprint_color, accent, texture, size);
    }
    

    let step = base_hei * 3.25;

    let y = step;

    let ind = 0;

    base_hei = 2.5 * size;

    while(y - ind * base_hei < hei){
        easel.drawImage(canvas, 0, base_hei, wid, step - base_hei, 0, y - base_hei * ind, wid, step - base_hei);
        ind += 1;
        y += step;
    }
    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

function draw_footprint_imprint(easel, x, y, color, accent, texture, size){
    easel.fillStyle = format_rgb_color_string_arr(color);
    easel.fillRect(x + 1 * size, y + 1 * size, 1 * size, 1 * size);
    easel.fillRect(x + 2 * size, y + 2 * size, 2 * size, 2 * size);

    easel.fillRect(x + 0 * size, y + 4 * size, 1 * size, 1 * size);
    easel.fillRect(x + 1 * size, y + 5 * size, 2 * size, 2 * size);

    easel.fillRect(x + 4 * size, y + 0 * size, 1 * size, 1 * size);
    easel.fillRect(x + 5 * size, y + 1 * size, 2 * size, 2 * size);

    easel.fillRect(x + 5 * size, y + 4 * size, 3 * size, 2 * size);
    easel.fillRect(x + 4 * size, y + 5 * size, 2 * size, 3 * size);
    easel.fillRect(x + 6 * size, y + 6 * size, 1 * size, 1 * size);

    easel.fillRect(x + 7 * size, y + 7 * size, 2 * size, 1 * size);
    easel.fillRect(x + 6 * size, y + 8 * size, 2 * size, 1 * size);
    easel.fillRect(x + 8 * size, y + 6 * size, 1 * size, 1 * size);



    easel.fillStyle = format_rgb_color_string_arr(accent);
    easel.fillRect(x + 2 * size, y + 3 * size, 1 * size, 1 * size);
    easel.fillRect(x + 1 * size, y + 6 * size, 1 * size, 1 * size);
    easel.fillRect(x + 5 * size, y + 2 * size, 1 * size, 1 * size);

    easel.fillRect(x + 4 * size, y + 7 * size, 2 * size, 1 * size);
    easel.fillRect(x + 4 * size, y + 6 * size, 1 * size, 1 * size);

    easel.fillRect(x + 6 * size, y + 8 * size, 2 * size, 1 * size);

    easel.fillStyle = format_rgb_color_string_arr(texture);
    easel.fillRect(x + 6 * size, y - 1 * size, 2 * size, 1 * size);
    easel.fillRect(x + 8 * size, y + 0 * size, 1 * size, 1 * size);

    easel.fillRect(x + 10 * size, y + 4 * size, 1 * size, 1 * size);
    easel.fillRect(x + 9 * size, y + 2 * size, 1 * size, 2 * size);

    easel.fillRect(x + 0 * size, y + 1 * size, 1 * size, 1 * size);
    easel.fillRect(x + -1 * size, y + 2 * size, 1 * size, 2 * size);

    easel.fillRect(x + 2 * size, y + 8 * size, 1 * size, 1 * size);
    easel.fillRect(x + 3 * size, y + 9 * size, 2 * size, 1 * size);

    easel.fillRect(x + 10 * size, y + 7 * size, 1 * size, 2 * size);
    easel.fillRect(x + 9 * size, y + 9 * size, 1 * size, 1 * size);

    easel.fillRect(x + 1 * size, y - 1 * size, 1 * size, 1 * size);
    easel.fillRect(x + 2 * size, y + -2 * size, 2 * size, 1 * size);
}

//---  Borders   ------------------------------------------------------------------------------

    //-- Arcade Border  ---------------------------------------

let border_arcade_ref;

let color_block = undefined;

let corner_block = undefined;

let inside_color_yellow = [239, 214, 74];

let outside_color_taupe = [255, 231, 148];

export function draw_arcade_border(easel, canvas, wid, hei, size){
    if(color_block == undefined){
        initialize_arcade_border();
        initialize_arcade_corner();
    }

    draw_pattern_edge(canvas, easel, color_block, corner_block, wid, hei, size);
}

function initialize_arcade_border(){

}

function initialize_arcade_corner(){

}

    //-- Pokeball Border  -------------------------------------

export function draw_pokeball_border(canvas, easel, wid, hei, size){
    if(color_block == undefined){
        initialize_pokeball_border();
        initialize_pokeball_corner();
    }

    draw_pattern_edge(canvas, easel, color_block, corner_block, wid, hei, size, false);
}

let color_edge = [74, 66, 82];
let color_blue = [99, 156, 247];
let color_salmon = [255, 123, 115];
let back_white = [255, 255, 255];
let off_white = darken([222, 214, 222]);

function initialize_pokeball_border(){
    let amount = 8;
    color_block = [];
    push_color(color_block, color_edge, amount);
    let arr = [];
    for(let i = 0; i < amount; i++){
        arr.push(Math.floor((i + 2) / 4) % 2 == 0 ? color_blue : color_salmon);
    }
    color_block.push(arr);
    push_color(color_block, off_white, amount);
    push_color(color_block, back_white, amount);
    arr = [];
    for(let i = 0; i < amount; i++){
        arr.push(Math.floor((i + 2) / 4) % 2 == 0 ? color_blue : color_salmon);
    }
    color_block.push(arr);
    push_color(color_block, off_white, amount);
    push_color(color_block, back_white, amount);

    for(let i = 0; i < color_block.length; i++){
        for(let j = 0; j < color_block[i].length; j++){
            color_block[i][j] = format_rgb_color_string_arr(color_block[i][j]);
        }
    }
}

function push_color(array, color, amount){
    let arr = [];
    for(let i = 0; i < amount; i++){
        arr.push(color);
    }
    array.push(arr);
}

function initialize_pokeball_corner(){
    corner_block = [];
    for(let i = 0; i < 7; i++){
        let arr = [];
        for(let j = 0; j < 7; j++){
            arr.push(undefined);
        }
        corner_block.push(arr);
    }
    set_colors(corner_block, back_white, [3, 3, 2, 5, 3, 5, 4, 5, 5, 4, 6, 6]);
    set_colors(corner_block, color_edge, [4, 3, 3, 4, 5, 1, 6, 2, 6, 3, 6, 4, 5, 5, 4, 6, 3, 6, 2, 6, 6, 0, 5, 0, 0, 5, 0, 6]);
    set_colors(corner_block, color_salmon, [2, 1, 1, 2, 1, 3, 1, 4, 2, 4]);
    set_colors(corner_block, darken(color_salmon), [3, 1, 4, 1, 4, 2]);
    set_colors(corner_block, darken(darken(color_salmon)), [1, 1, 2, 2, 2, 3, 3, 2, 2, 0, 3, 0, 4, 0, 0, 2, 0, 3, 0, 4, 1, 5]);
    set_colors(corner_block, off_white, [4, 4, 5, 3, 5, 2, 5, 6, 6, 5, 1, 6, 6, 1]);

    corner_block = double_array(corner_block);
}

function set_colors(block, color, coord_arr){
    for(let i = 0; i < coord_arr.length; i += 2){
        block[coord_arr[i]][coord_arr[i+1]] = format_rgb_color_string_arr(color);
    }
}

function double_array(source_array){
    let other = [];
    for(let i = 0; i < source_array.length; i++){
        let arr = [];
        for(let j = 0; j < source_array[i].length; j++){
            arr.push(undefined);
            arr.push(undefined);
        }
        other.push(arr);
        other.push(arr);
    }
    for(let i = 0; i < source_array.length; i++){
        for(let j = 0; j < source_array[i].length; j++){
            for(let k = 0; k < 2; k++){
                for(let l = 0; l < 2; l++){
                    other[i * 2 + k][j * 2 + l] = source_array[i][j];
                }
            }
        }
    }
    return other;
}