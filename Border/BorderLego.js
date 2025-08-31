import {produce_canvas, lighten, draw_pattern_edge, format_rgb_color_string_arr} from "./border.js";

let lego_colors = [[201, 26, 10], [0, 86, 191], [242, 205, 56], [34, 121, 64], [254, 138, 24], [54, 174, 190]];
// The number of lego bricks along the narrower side
let block_width = 1;    
// The pixel size of each lego block (so, 3x3 square or 5x5 square)
let block_size = 5;

export function lego_stuff(){
    return {
        "backing" : check_lego_backings,
        "keyword_back" : keywords_back,
        "borders" : check_lego_borders,
        "keyword_border" : keywords_border
    }
}

function check_lego_backings(easel, canvas, wid, hei, size, counter, keyword){
    switch(keyword){
        case 'lego':
            draw_lego_backing(canvas, easel, wid, hei, 5, undefined);
            return true;
        case 'lego_g':
            draw_lego_backing(canvas, easel, wid, hei, 5, [34, 121, 64]);
            return true;
        case 'lego_r':
            draw_lego_backing(canvas, easel, wid, hei, 5, [201, 26, 10]);
            return true;
        case 'lego_c':
            draw_lego_backing(canvas, easel, wid, hei, 5, [54, 174, 190]);
            return true;
        case 'lego_b':
            draw_lego_backing(canvas, easel, wid, hei, 5, [0, 86, 191]);
            return true;
        case 'lego_br':
            draw_lego_backing(canvas, easel, wid, hei, 5, [53, 33, 0]);
            return true;
        default:
            return false;
    }
}

function keywords_back(){
    return ["lego", "lego_g", "lego_r", "lego_c", "lego_b", "lego_br"];
}

function check_lego_borders(easel, canvas, wid, hei, size, counter, keyword){
    switch(keyword){
        case "lego":
            draw_lego_border(canvas, easel, wid, hei, 3, counter);
            return true;
        default:
            return false;
    }
}

function keywords_border(){
    return ["lego"];
}

//--  Backing   -----------------------------------------------

let set_lego_col = undefined;

let lego_color_refresh = 80;

let next_lego_col = undefined;

let bool_lego_shift = false;

function draw_lego_backing(canvas, easel, wid, hei, size, col = undefined){
    if(canvas.offscreenCanvas != undefined){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);
    let brick_size = 3;

    let base_pattern_size = 5;

    if(col == undefined && set_lego_col == undefined){
        set_lego_col = lego_colors[Math.floor(Math.random() * lego_colors.length)];
        bool_lego_shift = false;
    }

    // Pick the color we're using; if color is not hard-set in the arguments, use the random pick from set_lego_col above
    let color_use = (col == undefined) ? set_lego_col : col;

    draw_lego_base_backing(canvas, easel, wid, hei, size, color_use, brick_size, base_pattern_size);

    // -- All of the below is for the color shifting, not used if we have a manually set color
    
    // -- For some reason this isn't working, it does it once and then never resets for the next instance of color changing
    // -- -- Gotta figure this out but also the current tile change effect looks kinda ass so it's not a big deal

    let time_take = 4;

    if(col == undefined){
        if((counter % (lego_color_refresh * time_take)) == 0){
            if(!bool_lego_shift){
                next_lego_col = lego_colors[Math.floor(Math.random() * lego_colors.length)];
                bool_lego_shift = true;
            }
            else{
                bool_lego_shift = false;
                set_lego_col = next_lego_col;
                next_lego_col = [];
            }
        }

        if(bool_lego_shift){
            draw_lego_tile_fill(canvas, easel, wid, hei, size, next_lego_col, brick_size, 3, time_take);
        }
    }
    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

function draw_lego_base_backing(canvas, easel, wid, hei, size, col, brick_size, base_pattern_size){
    // Set the basic color
    easel.fillStyle = format_rgb_color_string_arr(col);
    // Calculates how large a single 'tile' will be that we copy and repaste for efficiency
    let brick_total_size = size * brick_size * base_pattern_size;
    // Draws the backdrop for the 'tile' of a solid color in the bottom right corner; we draw the lighter pips next
    easel.fillRect(0, 0, brick_total_size, brick_total_size);

    // Note: we draw in the bottom right corner so that if we do the color shifting bricks later, it can draw in the top-left easily
    // The brick-placement starts in the top-left so it should be more convenient doing that eventually

    // Note: Nevermind, was a weird offset when it was in the bottom right, it's back in the top left again

    // Set the lightened highlight color
    easel.fillStyle = format_rgb_color_string_arr(lighten(col));

    // Draw the pips in the center of each individual 3x3 lego brick
    for(let i = 0; i < base_pattern_size; i++){
        for(let j = 0; j < base_pattern_size; j++){
            easel.fillRect(size + i * size * brick_size, size + j * size * brick_size, size, size);
        }
    }

    // For convenience we adjust the brick_size to now refer to the 'tile' size
    brick_size *= base_pattern_size;

    // Copy the 'tile' in the bottom right corner to cover the entire border background space
    for(let i = 0; i < (wid / brick_total_size) + 1; i++){
        for(let j = 0; j < (hei / brick_total_size) + 1; j++){
            easel.drawImage(canvas, 0, 0, brick_size * size, brick_size * size, i * size * brick_size, j * size * brick_size, size * brick_size, size * brick_size);
        }
    }
}

function draw_lego_tile_fill(canvas, easel, wid, hei, size, col, brick_size, base_pattern_size, transition_duration_mult){
    // Assigns the easel color to the next lego tile color given as argument
    easel.fillStyle = format_rgb_color_string_arr(col);

    // Calculates how large a single 'tile' will be that we copy and repaste for efficiency
    let brick_total_size = size * brick_size * base_pattern_size;

    // Fills the base 'tile' with this lego's color
    easel.fillRect(0, 0, brick_total_size, brick_total_size);

    // Draws the lighter 'pips' for this lego tile
    for(let i = 0; i < base_pattern_size; i++){
        for(let j = 0; j < base_pattern_size; j++){
            easel.fillStyle = format_rgb_color_string_arr(lighten(col));
            easel.fillRect(size + i * size * brick_size, size + j * size * brick_size, size, size);
        }
    }

    // For convenience we adjust the brick_size to now refer to the 'tile' size
    brick_size *= base_pattern_size;

    // Calculate how far along the transition period we are to know how much we should be drawing the new lego tile color
    let prop = (counter % (lego_color_refresh * transition_duration_mult)) / (lego_color_refresh * transition_duration_mult);

    // Calculates how many tile bricks we can draw horizontally and vertically
    let wid_max = wid / size;
    let hei_max = hei / size;

    let wid_prop = prop * wid;

    let hei_prop = prop * hei;

    // Based on proportion of progress to drawing all, draws from the top left in an out-spiral to the bottom-right
    for(let i = 0; i < wid_max; i++){
        for(let j = 0; j < hei_max; j++){
            let dist = Math.sqrt(Math.pow(i, 2) + Math.pow(j, 2));
            if(dist < Math.sqrt(Math.pow(wid_prop, 2) + Math.pow(hei_prop, 2))){
                easel.drawImage(canvas, 0, 0, brick_size * size, brick_size * size, i * size * brick_size, j * size * brick_size, size * brick_size, size * brick_size);
            }
        }
    }
}

//--  Border   ------------------------------------------------

let color_block = [];

let corner_block = [];

let lego_block_alt = [];

let lego_corner_refresh = 120;

// Suppose each lego brick is a 3x3 of a color with an accent brighter color in the center for the little peg
// With ~15 pixel width in space, we have a 5-wide area of bricks to decorate with and as long as we like for continuing patterns
// Select 4-5 brick colors and fill out a space with them arbitrarily; random? Spatter pattern style? Try either
// Draw the sub-grid into the 3x3 style into color_block

function draw_lego_border(canvas, easel, wid, hei, size, counter){
    if(color_block.length == 0){
        initialize_lego_edge_style();
        lego_block_alt = color_block;
        color_block = [];
        initialize_lego_edge_style();
    }

    if(lego_corner_refresh > 0 && counter % lego_corner_refresh == 0){
        //initialize_lego_corner_style(color_block);
        let hold = color_block;
        color_block = lego_block_alt;
        lego_block_alt = hold;
    }

    draw_pattern_edge(canvas, easel, color_block, corner_block, wid, hei, size);
}

function initialize_lego_edge_style(){
    // The number of lego blocks in a pattern block
    let block_height = block_width * 6;

    // Holds the small version of the pattern which is expanded based on block_size into color_block
    let mini_block = [];
    color_block = [];

    lego_pattern_random(mini_block, block_height, color_block);

    for(let i = 0; i < mini_block.length; i++){
        for(let j = 0; j < mini_block[i].length; j++){
            let color = mini_block[i][j];
            draw_sized_lego_piece(color_block, color, block_size, i, j);
        }
    }

}

function draw_sized_lego_piece(target_block, use_color, block_size, i_pos, j_pos){
    for(let k = 0; k < block_size; k++){
        for(let l = 0; l < block_size; l++){
            let choice = (k % 2 == 1 && l % 2 == 1);
            target_block[i_pos * block_size + k][j_pos * block_size + l] = choice ? format_rgb_color_string_arr(lighten(use_color)) : format_rgb_color_string_arr(use_color);
        }
    }
}

function lego_pattern_random(mini_block, block_height){
    for(let i = 0; i < block_width; i++){
        let length = [];
        for(let j = 0; j < block_height; j++){
            length.push(lego_colors[Math.floor(Math.random() * lego_colors.length)]);
        }
        mini_block.push(length);
        for(let j = 0; j < block_size; j++){
            let block_length = [];
            for(let k = 0; k < block_height; k++){
                for(let l = 0; l < block_size; l++){
                    block_length.push(undefined);
                }
            }
            color_block.push(block_length);
        }
    }
}

function initialize_lego_corner_style(){
    let edge_height = block_width * block_size * lego_size;
    corner_block = [];
    let color = lego_colors[Math.floor(Math.random() * lego_colors.length)];
    for(let i = 0; i < edge_height; i++){
        let arr = [];
        for(let j = 0; j < edge_height; j++){
            arr.push(format_rgb_color_string_arr(color));
        }
        corner_block.push(arr);
    }

    let gap = edge_height / 5;
    let inner_size = edge_height / 5;

    for(let i = gap; i < edge_height - gap; i += gap + inner_size){
        for(let j = gap; j < edge_height - gap; j += gap + inner_size){
            for(let k = 0; k < inner_size; k++){
                for(let l = 0; l < inner_size; l++){
                    corner_block[i + k][j + l] = format_rgb_color_string_arr(lighten(color));
                }
            }
        }
    }

    for(let i = 0; i < edge_height; i++){
        for(let j = 0; j < edge_height; j++){
            if(i == 0 || j == 0 || i == edge_height - 1 || j == edge_height - 1){
                corner_block[i][j] = format_rgb_color_string_arr(darken(color));
            }
        }
    }

}
