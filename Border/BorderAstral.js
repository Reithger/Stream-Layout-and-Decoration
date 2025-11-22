import { format_rgb_color_string_arr, produce_canvas, darken_prop, draw_pattern_edge, fade_prop } from "./border.js";


export function astral_stuff(){
    return {
        "backing" : check_astral_backings,
        "keyword_back" : keywords_back,
        "borders" : check_astral_borders,
        "keyword_border" : keywords_border
    }
}

function check_astral_backings(easel, canvas, wid, hei, size, counter, keyword){
    switch(keyword){
        case "astral":
            draw_astral_galaxy_backing(easel, canvas, wid, hei, size, counter);
            return true;
        default:
            return false;
    }
}

function keywords_back(){
    return ["astral"];
}

function check_astral_borders(easel, canvas, wid, hei, size, counter, keyword){
    switch(keyword){
        case "astral":
            draw_astral_galaxy_border(easel, canvas, wid, hei, size, counter);
            return true;
        default:
            return false;
    }
}

function keywords_border(){
    return ["astral"];
}

//---  Backings   -----------------------------------------------------------------------------

/*


*/

let space_black = [2, 4, 35];
let deep_blue = [18, 23, 68];
let deep_purple = [115, 3, 140];

let star_colors = [[255, 255, 255], [255, 43, 43], [255, 124, 73], [67, 42, 255], [3, 2, 255]];

function draw_astral_galaxy_backing(easel, canvas, wid, hei, size, counter){
    let animate = 4;
    if(canvas.offscreenCanvas != undefined){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);

    if(size == null || size == undefined){
        size = 2;
    }

    let magenta = [198, 124, 185];
    let bright_purple = [203, 149, 237];
    let space_blue = [149, 166, 254];

    let gradient = easel.createLinearGradient(0, 0, wid, hei);

    /*
    gradient.addColorStop(0, format_rgb_color_string_arr(deep_blue));
    gradient.addColorStop(.1, format_rgb_color_string_arr(deep_purple));
    gradient.addColorStop(.5, format_rgb_color_string_arr(space_blue));
    gradient.addColorStop(.85, format_rgb_color_string_arr(bright_purple));
    gradient.addColorStop(1, format_rgb_color_string_arr(magenta));
    */

    gradient.addColorStop(0, format_rgb_color_string_arr(space_black));
    gradient.addColorStop(.35, format_rgb_color_string_arr(deep_blue));
    //gradient.addColorStop(.45, format_rgb_color_string_arr(deep_blue));
    gradient.addColorStop(.65, format_rgb_color_string_arr(deep_purple));
    //gradient.addColorStop(.6, format_rgb_color_string_arr(deep_purple));
    gradient.addColorStop(1, format_rgb_color_string_arr(deep_purple));

    easel.fillStyle = gradient;
    easel.fillRect(0, 0, wid, hei);

    let numStars = wid * hei / size / size / 144;

    for(let i = 0; i < numStars; i++){
        let x = random_int(wid / size);
        let y = random_int(hei / size);
        let color = star_colors[random_int(star_colors.length) % star_colors.length];
        draw_star(easel, x * size, y * size, size, random_int(4), color);
    }

    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

let border_canvas = undefined;

let color_block = [];

let corner_block = [];

let silver = [192, 192, 192];

let brass = [89, 65, 26];

let bright_brass = [205, 194, 98];

let lens_color = [244, 211, 231];

function draw_astral_galaxy_border(easel, canvas, wid, hei, size, counter){
    if(border_canvas != undefined){
        easel.drawImage(border_canvas, 0, 0, wid, hei, 0, 0, wid, hei);
        return;
    }
    border_canvas = produce_canvas(wid, hei);
    initialize_astral_edge();
    initialize_astral_corner();


    draw_pattern_edge(border_canvas, border_canvas.getContext("2d"), color_block, corner_block, wid, hei, 2, false);
}

function initialize_astral_edge(){
    let depth = 14;
    let length = 16;
    let default_color = format_rgb_color_string_arr(bright_brass);      //format_rgb_color_string_arr if real color
    for(let i = 0; i < depth; i++){
        let arr = [];
        for(let j = 0; j < length; j++){
            arr.push(default_color);
        }
        color_block.push(arr);
    }
    fill_array(color_block, 3, 4, 7, 9, silver);
    fill_array(color_block, 2, 5, 9, 7, silver);

    fill_array(color_block, 4, 5, 5, 7, lens_color);
    fill_array(color_block, 3, 6, 7, 5, lens_color);
}

function fill_array(arr, x, y, wid, hei, color){
    for(let i = x; i < x + wid; i++){
        for(let j = y; j < y + hei; j++){
            arr[i][j] = format_rgb_color_string_arr(color);
        }
    }
}

function initialize_astral_corner(){
    let edge = 7;
    corner_block = [];
    let default_color = undefined;
    for(let i = 0; i < edge; i++){
        let use = [];
        for(let j = 0; j < edge; j++){
            use.push(default_color);
        }
        corner_block.push(use);
    }

}

function random_int(range){
    return Math.floor(Math.random() * range);
}

function draw_star(easel, x, y, size, scale, color){
    let gradient = easel.createRadialGradient(x + size / 2, y + size / 2, size / 2, x + size / 2, y + size / 2, size * scale);
    gradient.addColorStop(0, format_rgb_color_string_arr(color));
    gradient.addColorStop(1, format_rgb_color_string_arr(fade_prop(color, .75)));
    easel.fillStyle = gradient;
    switch(scale){
        case 1:
            easel.fillRect(x, y, size, size);
            break;
        case 2:
            easel.fillRect(x - size, y, size * 3, size);
            easel.fillRect(x, y - size, size, 3 * size);
            break;
        case 3:
            easel.fillRect(x - size, y - size, size * 3, size * 3);
            easel.fillRect(x - size * 3, y, size * 7, size);
            easel.fillRect(x, y - size * 3, size, size * 7);
            break;
        case 4:
            easel.fillRect(x - size, y - size * 2, size * 3, size * 5);
            easel.fillRect(x - size * 2, y - size, size * 5, size * 3);
            easel.fillRect(x - size * 6, y, size * 13, size);
            easel.fillRect(x, y - size * 6, size, size * 13);
            break;
        default:
            break;
    }
}