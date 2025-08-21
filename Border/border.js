import {draw_lego_backing, draw_lego_border} from "./BorderLego.js";
import {draw_flag_backing} from "./BorderFlag.js";
import {draw_runescape_backing, draw_runescape_border} from "./BorderRunescape.js";
import {draw_votv_border, draw_votv_backing} from "./BorderVotV.js";
import {draw_edge_tour_point, draw_edges_all_shift} from "./BorderColorShift.js";
import {draw_dark_souls_border, draw_dark_backing} from "./BorderDarkSouls.js";
import {draw_arcade_mat_backing, draw_grass_box_backing, draw_footprint_backing, draw_pokeball_border, draw_snow_box_backing} from "./BorderPokemon.js";

let counter = 0

//-- Variables for Flag Background  ---------------------------

let rainbow = ["red", "orange", "yellow", "green", "blue", "purple"];

let trans = ["cyan", "pink", "white", "pink", "cyan"];

setInterval(draw_border, 1000 / 30);

function draw_border(){
    let canvas = document.getElementById("canvas")

    let body = document.getElementById("body")

    let type = document.styleSheets[0].cssRules[0].style.getPropertyValue("font-family")
    let back_type = document.styleSheets[0].cssRules[0].style.getPropertyValue("content")

    back_type = back_type.slice(1, back_type.length - 1)

    let wid = window.innerWidth
    let hei = window.innerHeight

    if(canvas.width != wid || canvas.height != hei){
        canvas.width = wid
        canvas.height = hei
    }

    let easel = canvas.getContext("2d")

    let SIZE = 8

    easel.lineWidth = 1
    
    // Switch case structure for deciding which backdrop to draw for a border box (uses term in the 'content' attribute)
    // Note: for a static, unchanging background, make sure you write the final image to the offscreenCanvas so you can copy it over
    //  without doing the entire draw operation every time.

    switch(back_type){
        case 'runescape':
            draw_runescape_backing(easel, wid, hei, 2);
            break;
        case 'rainbow':
            draw_flag_backing(easel, wid, hei, 12, rainbow, counter);
            break;
        case 'trans':
            draw_flag_backing(easel, wid, hei, 12, trans, counter);
            break;
        case 'transbian':
            draw_flag_backing(easel, wid, hei, 12, mix_arrays(rainbow, trans), counter);
            break;
        case 'lego':
            draw_lego_backing(canvas, easel, wid, hei, 5, undefined);
            break;
        case 'lego_g':
            draw_lego_backing(canvas, easel, wid, hei, 5, [34, 121, 64]);
            break;
        case 'lego_r':
            draw_lego_backing(canvas, easel, wid, hei, 5, [201, 26, 10]);
            break;
        case 'lego_c':
            draw_lego_backing(canvas, easel, wid, hei, 5, [54, 174, 190]);
            break;
        case 'lego_b':
            draw_lego_backing(canvas, easel, wid, hei, 5, [0, 86, 191]);
            break;
        case 'lego_br':
            draw_lego_backing(canvas, easel, wid, hei, 5, [53, 33, 0]);
            break;
        case 'votv':
            draw_votv_backing(canvas, easel, wid, hei, SIZE);
            break;
        case 'dark':
            draw_dark_backing(easel, wid, hei, SIZE);
            break;
        case 'poke_grass':
            draw_grass_box_backing(easel, canvas, wid, hei, 6);
            break;
        case 'poke_arcade':
            draw_arcade_mat_backing(easel, canvas, wid, hei, 12);
            break;
        case 'poke_snow':
            draw_snow_box_backing(easel, canvas, wid, hei, 6);
            break;
        case 'poke_foot':
            draw_footprint_backing(easel, canvas, wid, hei, 6);
            break;
        default:
            break;
    }

    // Switch case structure for deciding which border type to draw for a border box (uses term in the 'font-family' attribute)

    switch(type){
        case 'rainbow-tour':
            draw_edge_tour_point(easel, wid, hei, SIZE, counter)
            break;
        case 'rainbow-pulse':
            draw_edges_all_shift(easel, wid, hei, SIZE)
            break;
        case 'runescape':
            draw_runescape_border(canvas, easel, wid, hei, 2)
            break;
        case 'lego':
            draw_lego_border(canvas, easel, wid, hei, 3, counter);
            break;
        case 'votv':
            draw_votv_border(canvas, easel, wid, hei, 3);
            break;
        case 'dark':
            draw_dark_souls_border(canvas, easel, wid, hei, 1);
            break;
        case 'pokeball':
            draw_pokeball_border(canvas, easel, wid, hei, 2);
            break;
        default:
            break;
    }

    counter += 1;
}

function mix_arrays(arr_one, arr_two){
    let arr_out = [];
    for(let i = 0; i < arr_one.length; i++){
        arr_out.push(arr_one[i]);
    }
    for(let i = 0; i < arr_two.length; i++){
        arr_out.push(arr_two[i]);
    }
    return arr_out;
}

export function produce_canvas(wid, hei){
    let canvas = document.createElement("canvas");
    canvas.width = wid;
    canvas.height = hei;
    return canvas;
}

//---  Border Draw Types   --------------------------------------------------------------------

    //-- Draw Manual Style Pattern Repeated  ------------------

/**
 * 
 * Given the color_block and corner_block 2D arrays, draws a repeating pattern along the border of the specified space
 * and uses corner_block to draw a special corner embellishment if corner_block has contents (should not be undefined, we
 * check for length = 0)
 * 
 * This function is expected to be imported to relevant sub-files that want to draw a repeating pattern along the border.
 * 
 * @param {*} canvas 
 * @param {*} easel 
 * @param {*} color_block 
 * @param {*} corner_block 
 * @param {*} wid 
 * @param {*} hei 
 * @param {*} size 
 * @param {*} asymm 
 * @returns 
 */


export function draw_pattern_edge(canvas, easel, color_block, corner_block, wid, hei, size, asymm = true){

    if(color_block.length == 0){
        console.log("Attempt to call draw_pattern_edge without any color_block pattern defined (the 2d array of the pattern copied to draw the edge)");
        return;
    }

    let corner_displacement = size * color_block.length;
    if(corner_block.length == 0){
        corner_displacement = 0;
    }
    
    let block_hei = color_block.length * size
    let block_wid = (color_block[0].length) * size
    // Draws the initial segment of the edge pattern for each edge of the enclosed space
    // If I could just rotate a referenced segment of the canvas, I wouldn't have to do this four times, but it's not costly so oh well

    let horiz_edge_buffer = block_wid * 2 < (wid - corner_displacement * 2) ? block_wid : 0;
    let vert_edge_buffer = block_wid * 2 < (hei - corner_displacement * 2) ? block_wid : 0;

    for(let i = 0; i < color_block.length; i++){
        for(let j = 0; j < color_block[i].length; j++){
            easel.fillStyle = color_block[i][j]
            // Top Row
            easel.fillRect(horiz_edge_buffer + corner_displacement + j * size, i * size, size, size)
            // Left Column
            easel.fillRect(i * size, hei - (j + 1) * size - vert_edge_buffer - corner_displacement, size, size)
            
            // This was originally set to skip the last index for a lighting effect; if you want that back, draw a highlight pixel there not nothing (captures background and repeats that pattern)
            // For the outer-edge of the pattern to be the visual separation for the border, we draw it backwards for the right and bottom sides
            easel.fillStyle = asymm ? color_block[color_block.length - 1 - i][j] : color_block[i][j];
            // Right Column
            easel.fillRect(wid - i * size - size, vert_edge_buffer + corner_displacement + j * size, size, size)
            // Bottom Row
            easel.fillRect(wid - (j + 1) * size - horiz_edge_buffer - corner_displacement, hei - i * size - size, size, size)
        
        }
    }
    // Draws the top and bottom horizontal sections by copying the template image drawn in by the above code
    for(let i = 0; i < (wid - 2 * corner_displacement) / block_wid + 1; i += 1){
        // References its own canvas to copy the template pattern along the row
        // Top Row
        let x_ref = corner_displacement + horiz_edge_buffer;
        let y_ref = 0;
        let x_tar = i * block_wid + corner_displacement;
        let y_tar = 0;
        easel.drawImage(canvas, x_ref, y_ref, block_wid, block_hei, x_tar, y_tar, block_wid, block_hei)
        // Bottom Row
        x_ref =  wid - corner_displacement - block_wid - horiz_edge_buffer;
        y_ref = hei - block_hei;
        x_tar = wid - (i) * block_wid - corner_displacement;
        y_tar = hei - block_hei;
        easel.drawImage(canvas, x_ref, y_ref, block_wid, block_hei, x_tar, y_tar, block_wid, block_hei)
    }
    // Draws the left and right vertical sections by copying the template image drawn in by the above above code
    for(let i = 0; i < (hei - 2 * corner_displacement) / block_wid + 1; i += 1){
        // References its own canvas to copy the template pattern along the row
        // Right Column
        let x_ref = wid - block_hei;
        let y_ref = corner_displacement + vert_edge_buffer;
        let x_tar = wid - block_hei;
        let y_tar = i * block_wid + corner_displacement;
        easel.drawImage(canvas, x_ref, y_ref, block_hei, block_wid, x_tar,y_tar, block_hei, block_wid)
        // Left Column
        x_ref = 0;
        y_ref = hei - corner_displacement - block_wid - vert_edge_buffer;
        x_tar = 0;
        y_tar = hei - (i + 1) * block_wid - corner_displacement
        easel.drawImage(canvas, x_ref, y_ref, block_hei, block_wid, x_tar, y_tar, block_hei, block_wid)
    }

    size = block_hei % corner_block.length == 0 ? Math.floor(block_hei / corner_block.length) : size;

    draw_pattern_corners(canvas, easel, corner_block, wid, hei, size);
}

export function draw_pattern_edge_sides(canvas, easel, color_block, corner_block, wid, hei, size, asymm = true){
    if(color_block.length == 0){
        console.log("Attempt to call draw_pattern_edge without any color_block pattern defined (the 2d array of the pattern copied to draw the edge)");
        return;
    }

    let corner_displacement = size * color_block.length;
    if(corner_block.length == 0){
        corner_displacement = 0;
    }
    
    let block_hei = color_block.length * size
    let block_wid = (color_block[0].length) * size
    // Draws the initial segment of the edge pattern for each edge of the enclosed space
    // If I could just rotate a referenced segment of the canvas, I wouldn't have to do this four times, but it's not costly so oh well

    let horiz_edge_buffer = block_wid * 2 < (wid - corner_displacement * 2) ? block_wid : 0;
    let vert_edge_buffer = block_wid * 2 < (hei - corner_displacement * 2) ? block_wid : 0;

    for(let i = 0; i < color_block.length; i++){
        for(let j = 0; j < color_block[i].length; j++){
            easel.fillStyle = color_block[i][j]
            // Left Column
            easel.fillRect(i * size, hei - (j + 1) * size - vert_edge_buffer - corner_displacement, size, size)
            
            // This was originally set to skip the last index for a lighting effect; if you want that back, draw a highlight pixel there not nothing (captures background and repeats that pattern)
            // For the outer-edge of the pattern to be the visual separation for the border, we draw it backwards for the right and bottom sides
            easel.fillStyle = asymm ? color_block[color_block.length - 1 - i][j] : color_block[i][j];
            // Right Column
            easel.fillRect(wid - i * size - size, vert_edge_buffer + corner_displacement + j * size, size, size)
        
        }
    }
    // Draws the left and right vertical sections by copying the template image drawn in by the above above code
    for(let i = 0; i < (hei - 2 * corner_displacement) / block_wid + 1; i += 1){
        // References its own canvas to copy the template pattern along the row
        // Right Column
        let x_ref = wid - block_hei;
        let y_ref = corner_displacement + vert_edge_buffer;
        let x_tar = wid - block_hei;
        let y_tar = i * block_wid + corner_displacement;
        easel.drawImage(canvas, x_ref, y_ref, block_hei, block_wid, x_tar,y_tar, block_hei, block_wid)
        // Left Column
        x_ref = 0;
        y_ref = hei - corner_displacement - block_wid - vert_edge_buffer;
        x_tar = 0;
        y_tar = hei - (i + 1) * block_wid - corner_displacement
        easel.drawImage(canvas, x_ref, y_ref, block_hei, block_wid, x_tar, y_tar, block_hei, block_wid)
    }
}

export function draw_pattern_edge_top_bottom(canvas, easel, color_block, corner_block, wid, hei, size, asymm = true){
    if(color_block.length == 0){
        console.log("Attempt to call draw_pattern_edge without any color_block pattern defined (the 2d array of the pattern copied to draw the edge)");
        return;
    }

    let corner_displacement = size * color_block.length;
    if(corner_block.length == 0){
        corner_displacement = 0;
    }
    
    let block_hei = color_block.length * size
    let block_wid = (color_block[0].length) * size
    // Draws the initial segment of the edge pattern for each edge of the enclosed space
    // If I could just rotate a referenced segment of the canvas, I wouldn't have to do this four times, but it's not costly so oh well

    let horiz_edge_buffer = block_wid * 2 < (wid - corner_displacement * 2) ? block_wid : 0;
    let vert_edge_buffer = block_wid * 2 < (hei - corner_displacement * 2) ? block_wid : 0;

    for(let i = 0; i < color_block.length; i++){
        for(let j = 0; j < color_block[i].length; j++){
            easel.fillStyle = color_block[i][j]
            // Top Row
            easel.fillRect(horiz_edge_buffer + corner_displacement + j * size, i * size, size, size)

            // This was originally set to skip the last index for a lighting effect; if you want that back, draw a highlight pixel there not nothing (captures background and repeats that pattern)
            // For the outer-edge of the pattern to be the visual separation for the border, we draw it backwards for the right and bottom sides
            easel.fillStyle = asymm ? color_block[color_block.length - 1 - i][j] : color_block[i][j];
            // Bottom Row
            easel.fillRect(wid - (j + 1) * size - horiz_edge_buffer - corner_displacement, hei - i * size - size, size, size)
        
        }
    }
    // Draws the top and bottom horizontal sections by copying the template image drawn in by the above code
    for(let i = 0; i < (wid - 2 * corner_displacement) / block_wid + 1; i += 1){
        // References its own canvas to copy the template pattern along the row
        // Top Row
        let x_ref = corner_displacement + horiz_edge_buffer;
        let y_ref = 0;
        let x_tar = i * block_wid + corner_displacement;
        let y_tar = 0;
        easel.drawImage(canvas, x_ref, y_ref, block_wid, block_hei, x_tar, y_tar, block_wid, block_hei)
        // Bottom Row
        x_ref =  wid - corner_displacement - block_wid - horiz_edge_buffer;
        y_ref = hei - block_hei;
        x_tar = wid - (i) * block_wid - corner_displacement;
        y_tar = hei - block_hei;
        easel.drawImage(canvas, x_ref, y_ref, block_wid, block_hei, x_tar, y_tar, block_wid, block_hei)
    }
}

export function draw_pattern_corners(canvas, easel, corner_block, wid, hei, size){
    if(corner_block.length != 0){
        // Draws the contents of corner_block to each of the four corners of the border, appropriately rotated for each
        for(let i = 0; i < corner_block.length; i++){
            for(let j = 0; j < corner_block[i].length; j++){
                easel.fillStyle = corner_block[i][j];
                if(corner_block[i][j] == undefined){
                    // Top Left
                    easel.clearRect(j * size, i * size, size, size);
                    // Top Right
                    easel.clearRect(wid - i * size - size, j * size, size, size);
                    // Bottom Right
                    easel.clearRect(wid - j * size - size, hei - i * size - size, size, size)
                    // Bottom Left
                    easel.clearRect(i * size, hei - j * size - size, size, size)
                }
                else{
                    // Top Left
                    easel.fillRect(j * size, i * size, size, size);
                    // Top Right
                    easel.fillRect(wid - i * size - size, j * size, size, size);
                    // Bottom Right
                    easel.fillRect(wid - j * size - size, hei - i * size - size, size, size)
                    // Bottom Left
                    easel.fillRect(i * size, hei - j * size - size, size, size)
                }
            }
            
        }
    }
}

//---  Support Methods   ----------------------------------------------------------------------


export function lighten(color_arr){
    let out = [color_arr[0], color_arr[1], color_arr[2]];
    for(let i = 0; i < out.length; i++){
        let add = out[i] * .25;
        out[i] = out[i] + ((add == 0) ? 30 : add);
    }
    return out;
}

export function darken(color_arr){
    let out = [color_arr[0], color_arr[1], color_arr[2]];
    for(let i = 0; i < out.length; i++){
        let add = out[i] * .25;
        out[i] = out[i] - ((add == 0) ? 0 : add);
    }
    return out;
}


function bounds(col){
    return col < 0 ? 0 : col > 255 ? 255 : col;
}
 
export function format_rgb_color_string(col_r, col_g, col_b, alpha="1"){
    return "rgb(" + bounds(col_r) + ", " + bounds(col_g) + ", " + bounds(col_b) + ", " +  bounds(alpha) + ")"
}
 
export function format_rgb_color_string_arr(color_array){
    return format_rgb_color_string(color_array[0], color_array[1], color_array[2], color_array.length == 4 ? color_array[3] : 1);
}