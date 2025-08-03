import { format_rgb_color_string, lighten, darken, format_rgb_color_string_arr, draw_pattern_edge, draw_pattern_edge_sides} from "./border.js";

let grass_color = [156, 206, 99];

let floor_mat_color = darken([41, 49, 49]);

let maroon = [206, 49, 57];

let pear = [156, 189, 33];

let violet = [148, 90, 165];

let teal = [123, 156, 140];

let arcade_colors = [maroon, pear, violet, teal];

let arcade_ref = undefined;

export function draw_arcade_mat_backing(easel, canvas, wid, hei, size){
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

}

export function draw_grass_box_backing(easel, canvas, wid, hei, size){
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

    while(y < hei){
        easel.drawImage(canvas, 0, 0, wid, step, 0, y, wid, step);
        y += step;
    }

}

function draw_petal_imprint(easel, x, y, color, size){
    easel.fillStyle = format_rgb_color_string_arr(color);
    easel.fillRect(x, y + 2 * size, 2 * size, 2 * size);
    easel.fillRect(x + 1 * size, y + 3 * size, 2 * size, 2 * size);

    easel.fillRect(x + 3 * size, y + 1 * size, 3 * size, 2 * size);
    easel.fillRect(x + 4 * size, y, 1 * size, 4 * size);
    
    easel.fillRect(x + 7 * size, y + 2 * size, 2 * size, 2 * size);
    easel.fillRect(x + 6 * size, y + 3 * size, 2 * size, 2 * size);
}

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