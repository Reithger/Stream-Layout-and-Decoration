import { produce_canvas, darken_prop, lighten, darken, format_rgb_color_string_arr, draw_pattern_edge} from "./border.js";
import {draw_coral, draw_petal_imprint, draw_blot, draw_footprint_imprint, draw_cross} from "./BorderSupportShapes.js";
import {cross_screen_vert_mottle, mottle_layers, cross_screen_mottle} from "./BorderSupportPattern.js";

//---  Backgrounds   --------------------------------------------------------------------------

export function check_pokemon_backings(easel, canvas, wid, hei, size, counter, keyword){
    switch(keyword){
        case 'poke_grass':
            draw_grass_box_backing(easel, canvas, wid, hei, 6);
            return true;
        case 'poke_arcade':
            draw_arcade_mat_backing(easel, canvas, wid, hei, 12);
            return true;
        case 'poke_snow':
            draw_snow_box_backing(easel, canvas, wid, hei, 6);
            return true;
        case 'poke_foot':
            draw_footprint_backing(easel, canvas, wid, hei, 6);
            return true;
        case 'poke_seafloor':
            draw_poke_water_backing(easel, canvas, wid, hei, 6);
            return true;
        case 'poke_beach':
            draw_beach_backing(easel, canvas, wid, hei, 3);
            return true;
        case 'poke_lava':
            draw_lava_backing(easel, canvas, wid, hei, 6);
            return true;
        default:
            return false;
    }
}

export function check_pokemon_borders(easel, canvas, wid, hei, size, counter, keyword){
    switch(keyword){
        case "pokeball":
            draw_pokeball_border(canvas, easel, wid, hei, 2);
            return true;
        default:
            return false;
    }
}

    //-- Arcade Background  -----------------------------------

let floor_mat_color = darken([41, 49, 49]);

let maroon = [206, 49, 57];

let pear = [156, 189, 33];

let violet = [148, 90, 165];

let teal = [123, 156, 140];

let arcade_colors = [maroon, pear, violet, teal];

let arcade_ref = undefined;


function draw_arcade_mat_backing(easel, canvas, wid, hei, size){
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

    //-- Lava Background  -------------------------------------

let lava_color = [216, 127, 71];

function draw_lava_backing(easel, canvas, wid, hei, size){
    if(canvas.offscreenCanvas != undefined){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);

    //TODO: accent with lava bubbles popping and sizzling

    mottle_layers(easel, wid, hei, size, 
        [lighten(lava_color), lava_color, darken(lava_color), darken(darken(lava_color))],
        [.15, .55, .85],
        [false, false, false],
        [[4, 4], [6, 4], [12, 3]], 0);

    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

    //-- Beach Background  ------------------------------------

let sand_color = [224, 208, 120];

let water_color = [152, 192, 184];

let sandy_water = [192, 208, 176];

let surf_color = [232, 224, 192];

let dark_sand = [216, 192, 112];

function draw_beach_backing(easel, canvas, wid, hei, size){
    if(canvas.offscreenCanvas != undefined){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);

    if(hei > wid){
        size *= 3 / 2;
    }

    let cycle = 4 * 8 * size;
    let target = wid / 2;
    let layers_offset = 0; //1.5;
    while(cycle < target){
        cycle += 4 * size;
        layers_offset += .25;
    }

    //layers_offset = 0;

    mottle_layers(easel, wid, hei, size, 
        [sand_color, dark_sand, surf_color, sandy_water, water_color],
         [.66, .76, .78, .85],
         [false, true, true, false],
        [[8, 4], [8, 6], [8, 6], [8, 3]], wid < hei ? layers_offset : 0);

        //TODO: If the browser source is narrow (taller than wide), need to adjust some backgrounds for that context
    
    if(wid > hei && (hei > wid / 4)){
        cross_screen_vert_mottle(easel, 0, hei * .1, lighten(lighten(sand_color)), surf_color, dark_sand, size, wid, 6, 8, 0);
        cross_screen_vert_mottle(easel, 0, hei * .25, lighten(lighten(sand_color)), surf_color, dark_sand, size, wid, 7, 7, 0);
        cross_screen_vert_mottle(easel, 0, hei * .4, lighten(lighten(sand_color)), surf_color, dark_sand, size, wid, 6, 6, 0);
        cross_screen_vert_mottle(easel, 0, hei * .55, lighten(lighten(sand_color)), surf_color, dark_sand, size, wid, 7, 5, 0);
    }
    else if(hei > wid / 4){
        cross_screen_vert_mottle(easel, 0, hei * .1, lighten(lighten(sand_color)), surf_color, dark_sand, size, wid, 8, 6, layers_offset);
        cross_screen_vert_mottle(easel, 0, hei * .25, lighten(lighten(sand_color)), surf_color, dark_sand, size, wid, 8, 6, layers_offset + .25);
        cross_screen_vert_mottle(easel, 0, hei * .4, lighten(lighten(sand_color)), surf_color, dark_sand, size, wid, 8, 6, layers_offset + .5);
        cross_screen_vert_mottle(easel, 0, hei * .55, lighten(lighten(sand_color)), surf_color, dark_sand, size, wid, 8, 6, layers_offset + .75);
    }
    else{
        cross_screen_vert_mottle(easel, 0, hei * .3, lighten(lighten(sand_color)), surf_color, dark_sand, size, wid, 8, 4, layers_offset - 1.5);
    }

    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

    //-- Water Background  ------------------------------------

let basic_water_blue = [64, 112, 184];

let bubble_blue = [120, 192, 232];

let coral_red = [168, 120, 128];

function draw_poke_water_backing(easel, canvas, wid, hei, size){
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
    let mottle_hei = 2;

    let dark_water = darken(darken(basic_water_blue));

    if(hei > wid){
        size *= 1;
    }

    // A sin wave cycle is 4 * mottle_wid * size
    // By default, we hit the low trough at 3 * mottle_wid * size
    // Need to modify layers_offset (value in range 0-2 for a full cycle) to make the low trough in the center

    let cycle = 3 * mottle_wid * size;
    let target = wid / 2;
    let layers_offset = 0; //1.5;
    while(cycle < target){
        cycle += mottle_wid * size;
        layers_offset += .5;
    }

    let screen_divide = hei < wid / 4 ? Math.floor(hei / (size * 12)) : 7;

    mottle_layers(easel, wid, hei, size, 
        [basic_water_blue, darken(basic_water_blue), dark_water],
        hei < wid / 4 ? [.4, .6] : [.8, .9],
        [false, false],
        [[mottle_wid, mottle_hei], [mottle_wid, mottle_hei]], wid > hei ? 0 : (layers_offset % 2));

    let start_x = size * 4 + (layers_offset % 2) * mottle_wid * size;
    let ind = 0;
    
    while(start_x < wid){
        let wid_gap = 4 * mottle_wid * size;
        let start_y = 0;
        start_y += 4 * size;
        
        if(hei < wid / 4){
            let dark_prop = .0;
            let ind = 0;
            let x_mod = Math.floor(Math.sin(.5 * Math.PI * ((ind * 6 - 3) / screen_divide)) * (6 - Math.floor(ind / 1)));
            while(start_y < hei * 9 / 10){
                draw_blot(easel, start_x + wid_gap / 2 + x_mod * size, start_y - ind * size, darken_prop(bubble_blue, dark_prop), 5 - (Math.floor(ind * 2 / 3)), size);
                start_y += hei / screen_divide;
                dark_prop += (.05 + screen_divide * .01);
                ind += 1;
                x_mod = Math.floor(Math.sin(.5 * Math.PI * ((ind * 6 - 3) / screen_divide)) * (6 - Math.floor(ind / 1)));
            }
        }
        else{
            start_y = 0;
            start_y += 5 * size;
            draw_blot(easel, start_x + wid_gap / 6, start_y, bubble_blue, 7, size);
            start_y += hei / screen_divide;
            draw_blot(easel, start_x + wid_gap, start_y, bubble_blue, 6, size);
            start_y += hei / screen_divide;
            draw_blot(easel, start_x + wid_gap * 3 / 4, start_y, darken_prop(bubble_blue, .15), 5, size);
            start_y += hei / screen_divide;
            draw_blot(easel, start_x + wid_gap / 4, start_y, darken_prop(bubble_blue, .18), 5, size);
            start_y += hei / screen_divide;
            draw_blot(easel, start_x + wid_gap / 2, start_y, darken_prop(bubble_blue, .22), 4, size);
            start_y += hei / screen_divide;
            draw_blot(easel, start_x + wid_gap * 4 / 5 , start_y - size * 2, darken_prop(bubble_blue, .25), 4, size);
        }
        //start_y -= size * 5;
        /* */
        start_y = hei * 9 / 10;

        draw_coral(easel, start_x + wid_gap / 2 - size, start_y - size * 2, coral_red, darken(dark_water), size, 4);
        start_x += size * mottle_wid * 8;
        ind += 1;
    }

    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

    //-- Grass Background  ------------------------------------

let grass_color = [156, 206, 99];

function draw_grass_box_backing(easel, canvas, wid, hei, size){
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

    //-- Snow Background  -------------------------------------

let low_back_color = [231, 239, 255];

let high_back_color = [206, 231, 247];

let snow = [255, 255, 255];

function draw_snow_box_backing(easel, canvas, wid, hei, size){
    if(canvas.offscreenCanvas != undefined){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);
    easel.fillStyle = format_rgb_color_string_arr(low_back_color);

    easel.fillRect(0, 0, wid, hei);

    easel.fillStyle = format_rgb_color_string_arr(high_back_color);

    let color_break = wid / 4 > hei ? hei / 2 : hei / 3;

    easel.fillRect(0, 0, wid, color_break);

    let across_x = 0;

    let across_y = color_break;

    cross_screen_mottle(easel, across_x, across_y, high_back_color, low_back_color, size, wid, 5, 2);

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

    //-- Fossil Foot Background  ------------------------------

let ground_color = [176, 144, 104];

let imprint_color = lighten(ground_color);

let edge_color = [152, 120, 96];

function draw_footprint_backing(easel, canvas, wid, hei, size){
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

function draw_pokeball_border(canvas, easel, wid, hei, size){
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