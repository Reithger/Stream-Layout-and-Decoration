import { produce_canvas, lighten, format_rgb_color_string_arr, draw_pattern_edge } from "./border.js";

//--  Backing   -----------------------------------------------

/**
 * 
 * Backing style inspired by the aesthetics in the base of Voices of the Void
 * 
 * @param {*} canvas 
 * @param {*} easel 
 * @param {*} wid 
 * @param {*} hei 
 * @param {*} size 
 */

export function draw_votv_backing(canvas, easel, wid, hei, size){
    if(canvas.offscreenCanvas != undefined){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);
    // Colors are deep blue, red, orange, yellow
    let cols_bright = [[21, 31, 45], [150, 57, 26], [146, 89, 17], [150, 124, 13]];

    let cols_dark = [[21, 31, 45], [79, 30, 23], [116, 80, 47], [133, 131, 98]];

    let div = 12;
    let y_start = hei * 1 / div;
    
    // Top-portion of the drawing area, cement wall vibe
    let cement_light = [101, 103, 102];
    easel.fillStyle = format_rgb_color_string_arr(lighten(cement_light));
    easel.fillRect(0, 0, wid, hei);

    // Bottom-portion of the drawing area, mahogany coloring
    let chestnut_lighter = [81, 42, 19];
    let chestnut_darker = [36, 12, 0];
    let gradient = easel.createLinearGradient(wid / 2, y_start + 2 * hei / div, wid / 2, hei);
    gradient.addColorStop(0, format_rgb_color_string_arr(chestnut_lighter));
    gradient.addColorStop(.4, format_rgb_color_string_arr(chestnut_darker));
    gradient.addColorStop(.6, format_rgb_color_string_arr(chestnut_darker));
    gradient.addColorStop(1, format_rgb_color_string_arr(chestnut_lighter));
    easel.fillStyle = gradient;
    easel.fillRect(0, y_start, wid, hei);

    // Middle Portion of the drawing area using the key color accent aesthetic
    for(let i = 0; i < cols_dark.length; i++){
        easel.fillStyle = format_rgb_color_string_arr(cols_bright[i]);
        easel.fillRect(0, y_start + (i * hei / div), wid, hei / div);
    }
    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}


//--  Borders   -----------------------------------------------

let color_block = [];

let corner_block = [];

export function draw_votv_border(canvas, easel, wid, hei, size){
    if(color_block.length == 0){
        initialize_votv_edge_style();
    }

    if(corner_block.length == 0){
        initialize_votv_corner_style();
    }

    draw_pattern_edge(canvas, easel, color_block, corner_block, wid, hei, size, false);
}

function initialize_votv_edge_style(){
    let cols_bright = [[21, 31, 45], [150, 57, 26], [146, 89, 17], [150, 124, 13]];

    color_block = [[], [], [], [], []];

    for(let i = 0; i < 15; i++){
        color_block[0].push(format_rgb_color_string_arr(cols_bright[1]));
        color_block[1].push(format_rgb_color_string_arr(cols_bright[0]));
        color_block[2].push(format_rgb_color_string_arr(cols_bright[2]));
        color_block[3].push(format_rgb_color_string_arr(cols_bright[0]));
        color_block[4].push(format_rgb_color_string_arr(cols_bright[3]));
    }
}

function initialize_votv_corner_style(){
    let cols_bright = [[21, 31, 45], [150, 57, 26], [146, 89, 17], [150, 124, 13]];

    corner_block = [[], [], [], [], []];

    for(let i = 0; i < corner_block.length; i++){
        for(let j = 0; j < corner_block.length; j++){
            corner_block[i].push(format_rgb_color_string_arr(cols_bright[0]));
        }
    }

    for(let i = 0; i < corner_block.length; i++){
        for(let j = 0; j < corner_block[i].length; j++){
            if(i == 0 || j == 0){
                corner_block[i][j] = format_rgb_color_string_arr(cols_bright[1]);
            }
            if((i == 2 || j == 2) && (i > 1 && j > 1)){
                corner_block[i][j] = format_rgb_color_string_arr(cols_bright[2]);
            }
            if((i == 4 || j == 4) && (i > 3 && j > 3)){
                corner_block[i][j] = format_rgb_color_string_arr(cols_bright[3]);
            }
        }
    }

    let replace = [];
    let size = corner_block.length;
    for(let i = 0; i < corner_block.length; i++){
        let pos = (i + size * 2 - 1) % size;
        replace.push(corner_block[pos][pos]);
    }
    for(let i = 0; i < size; i++){
       corner_block[i][i] = replace[i];
    }

    corner_block[0][0] = undefined; //format_rgb_color_string_arr(cols_bright[0]);
}
