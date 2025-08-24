import {check_lego_backings, check_lego_borders} from "./BorderLego.js";
import {check_flag_backings} from "./BorderFlag.js";
import {check_runescape_backings, check_runescape_borders} from "./BorderRunescape.js";
import {check_votv_borders, check_votv_backings} from "./BorderVotV.js";
import {check_color_shift_borders} from "./BorderColorShift.js";
import {check_dark_backings, check_dark_borders} from "./BorderDarkSouls.js";
import {check_pokemon_backings, check_pokemon_borders} from "./BorderPokemon.js";

let counter = 0

let backings = [check_pokemon_backings, check_dark_backings, check_lego_backings,
                check_runescape_backings, check_flag_backings, check_votv_backings];

let borders = [check_pokemon_borders, check_dark_borders, check_lego_borders,
                check_runescape_borders, check_votv_borders, check_color_shift_borders];

//-- Variables for Flag Background  ---------------------------

setInterval(stream_border_draw, 1000 / 30);

function stream_border_draw(){
    let canvas = document.getElementById("canvas")

    let type = document.styleSheets[0].cssRules[0].style.getPropertyValue("font-family")
    let back_type = document.styleSheets[0].cssRules[0].style.getPropertyValue("content")
    back_type = back_type.slice(1, back_type.length - 1);

    let wid = window.innerWidth
    let hei = window.innerHeight

    if(canvas.width != wid || canvas.height != hei){
        canvas.width = wid
        canvas.height = hei
    }
    draw_border(canvas, back_type, type);
}

export function draw_border(canvas, backing_type, border_type){
    let easel = canvas.getContext("2d")
    let SIZE = 8

    easel.lineWidth = 1

    let wid = canvas.width;
    let hei = canvas.height;
    
    // Switch case structure for deciding which backdrop to draw for a border box (uses term in the 'content' attribute)
    // Note: for a static, unchanging background, make sure you write the final image to the offscreenCanvas so you can copy it over
    //  without doing the entire draw operation every time.

    for(let i = 0; i < backings.length; i++){
        if(backings[i](easel, canvas, wid, hei, SIZE, counter, backing_type)){
            break;
        }
    }

    for(let i = 0; i < borders.length; i++){
        if(borders[i](easel, canvas, wid, hei, SIZE, counter, border_type)){
            break;
        }
    }
    // Switch case structure for deciding which border type to draw for a border box (uses term in the 'font-family' attribute)

    counter += 1;
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

export function lighten_prop(color_arr, amount){
    let out = [color_arr[0], color_arr[1], color_arr[2]];
    for(let i = 0; i < out.length; i++){
        let add = out[i] * amount;
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
export function darken_prop(color_arr, amount){
    let out = [color_arr[0], color_arr[1], color_arr[2]];
    for(let i = 0; i < out.length; i++){
        let add = out[i] * amount;
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