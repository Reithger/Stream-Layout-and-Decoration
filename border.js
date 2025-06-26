let counter = 0

let max_period = 80

//-- Variables for Color Shift Border  ------------------------

let color_r = 50
let color_g = 75
let color_b = 130

let r_change = 2;
let g_change = 4;
let b_change = 3;

let r_up = true
let g_up = true
let b_up = true

let under_colors = []

let COLOR_PACE = 300;

//-- Variables for Pattern Edge Border  -----------------------

let lego_colors = [[201, 26, 10], [0, 86, 191], [242, 205, 56], [34, 121, 64], [254, 138, 24], [54, 174, 190]];
// The number of lego bricks along the narrower side
let block_width = 1;    
// The pixel size of each lego block (so, 3x3 square or 5x5 square)
let block_size = 5;

let lego_block_alt = [];

let lego_corner_refresh = 120;

let lego_size = 3;

let color_block = [];
let corner_block = [];
let shadow_values = [];

//-- Variables for Flag Background  ---------------------------

let rainbow = ["red", "orange", "yellow", "green", "blue", "purple"];

let trans = ["cyan", "pink", "white", "pink", "cyan"];

let lesbian = [];

setInterval(draw_border, 30);

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

    switch(back_type){
        case 'runescape':
            draw_runescape_backing(easel, wid, hei, 2);
            break;
        case 'rainbow':
            draw_flag_backing(easel, wid, hei, 12, rainbow);
            break;
        case 'trans':
            draw_flag_backing(easel, wid, hei, 12, trans);
            break;
        case 'transbian':
            draw_flag_backing(easel, wid, hei, 12, mix_arrays(rainbow, trans));
            break;
        default:
            break;
    }

    // Switch case structure for deciding which border type to draw for a border box (uses term in the 'font-family' attribute)

    switch(type){
        case 'rainbow-tour':
            draw_edge_tour_point(easel, wid, hei, SIZE)
            break;
        case 'rainbow-pulse':
            draw_edges_all_shift(easel, wid, hei, SIZE, COLOR_PACE)
            break;
        case 'runescape':
            draw_runescape_border(canvas, easel, wid, hei, 2)
            break;
        case 'lego':
            draw_lego_border(canvas, easel, wid, hei, lego_size);
            break;
        default:
            draw_edge_tour_point(easel, wid, hei, SIZE)
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

//---  Background Draw Types   ----------------------------------------------------------------

function draw_flag_backing(easel, wid, hei, size, colors){
    let use_wid = size * 5;

    easel.rotate((45 * Math.PI) / 180);

    let lesser = wid < hei ? wid : hei;
    let time_on_screen = Math.sqrt(Math.pow(lesser, 2) * 2) + use_wid;

    let cap_add = Math.floor(time_on_screen / use_wid) + 1;

    time_on_screen = cap_add * use_wid;

    let cap = Math.floor(wid < hei ? hei / use_wid : wid / use_wid) + 1;

    //cap = cap * 2;

    let num_bars = Math.floor((cap + cap_add) / colors.length) + 2;
    num_bars *= colors.length;
    

    for(let i = 0; i < num_bars; i++){
        easel.fillStyle = colors[i % colors.length];
        let x = i * use_wid + ((counter) % (colors.length * use_wid)) - time_on_screen * 3 / 2;
        let y = -x - use_wid;
        easel.fillRect(x, y, use_wid, hei + use_wid * 2 + i * use_wid);
    }


    easel.setTransform(1, 0, 0, 1, 0, 0);
}

function draw_runescape_backing(easel, wid, hei, size){
    //easel.fillStyle = format_rgb_color_string(210, 193, 156);
    // Setup; put down baseline papyrus color and setup top/left shadow lines
    let color_choice = format_rgb_color_string(216, 196, 157);
    //let color_choice = format_rgb_color_string(255, 255, 255);
    //let color_choice = format_rgb_color_string(178, 163, 132);
    easel.fillStyle = color_choice;
    easel.fillRect(0, 0, wid, hei);

    if(shadow_values.length == 0){
        for(let i = 0; i < 7; i++){
            shadow_values.push(Math.random() / 20 + .05);
        }
    }

    //let gradient = easel.createConicGradient(0, wid/2, hei/2);

    let x_scale = wid > hei ? wid / hei : 1;
    let y_scale = wid > hei ? 1 : hei / wid;

    let center_x = Math.floor(wid / (2 * x_scale)) + (wid > hei ? wid / (3 * x_scale) : 0);
    let center_y = Math.floor(hei / (2 * y_scale)) - (wid >= hei ? 0 : hei / (3 * y_scale));
    let gradient = easel.createRadialGradient(center_x, center_y, 5, center_x, center_y, wid > hei ? hei : wid);

    gradient.addColorStop(0, color_choice);
    //gradient.addColorStop(.6, format_rgb_color_string(172, 157, 129));
    //gradient.addColorStop(.8, format_rgb_color_string(172, 157, 129));
    gradient.addColorStop(1, format_rgb_color_string(172, 157, 129));
    //gradient.addColorStop(1, format_rgb_color_string(178, 163, 132));
    //gradient.addColorStop(1, format_rgb_color_string(255, 255, 255));
    //gradient.addColorStop(1, color_choice);

    easel.fillStyle = gradient;

    easel.scale(x_scale, y_scale);

    easel.fillRect(0, 0, wid, hei);

    easel.setTransform(1, 0, 0, 1, 0, 0);

    for(let i = 0; i < shadow_values.length; i++){
        easel.fillStyle = format_rgb_color_string(0, 0, 0, shadow_values[i]);
        let move = i * size;
        let amount = size * 7 + move;
        easel.fillRect(0, 0, wid, amount);
        easel.fillRect(0, amount, amount, hei - amount);
        easel.fillRect(wid - amount * 3 / 4, amount, amount, hei);
        easel.fillRect(amount, hei - amount * 3 / 4, wid - amount * 7 / 4, amount);
    }
}

//---  Border Draw Types   --------------------------------------------------------------------

    //-- Draw Manual Style Pattern Repeated  ------------------

function draw_pattern_edge(canvas, easel, wid, hei, size){

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
            easel.fillStyle = color_block[color_block.length - 1 - i][j];
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

    if(corner_block.length != 0){
        // Draws the contents of corner_block to each of the four corners of the border, appropriately rotated for each
        for(let i = 0; i < corner_block.length; i++){
            for(let j = 0; j < corner_block[i].length; j++){
                if(corner_block[i][j] != undefined){
                    easel.fillStyle = corner_block[i][j];
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

// Pick out 4-5 x,y spots in the space to have a starter color
// Progressively select adjacent, uncolored spots next to a set color to have that same color
// Slightly favor horizontal movement over vertical for rough-banding
// Start colors can be brightened/darkened versions of base color?
//  Or another 'define highest/lowest' and then blend in-betweens
// 87, 80, 64
// 79, 72, 53
// 82, 75, 59
// 96, 90, 74

function draw_spatter_pattern(colors, pallette = derive_brightness_colors([82, 75, 59], 5), start_row, end_row){

    for(let i = 0; i < pallette.length; i++){
        let x = Math.floor(Math.random() * (end_row - start_row + 1)) + start_row;
        let y = Math.floor(Math.random() * colors[start_row].length);
        for(let j = 0; j < 3; j++){
            while(colors[x][y] != undefined){
                x = Math.floor(Math.random() * (end_row - start_row) + 1) + start_row;
                y = Math.floor(Math.random() * colors[start_row].length);
            }
            colors[x][y] = pallette[i];
        }
    }

    while(check_undefined(colors, start_row, end_row)){
        let color_change = start_colors[Math.floor(Math.random() * start_colors.length)];
        let position = find_color_pick_random(colors, color_change, start_row, end_row);
        let x = position[0];
        let y = position[1];
        if(Math.random() < .8){
            if(y-1 >= 0 && colors[x][y-1] == undefined){
                colors[x][y-1] = color_change;
            }
            else if(y + 1 < colors[start_row].length && colors[x][y+1] == undefined){
                colors[x][y+1] = color_change;
            }
            else if(x - 1 >= start_row && colors[x-1][y] == undefined){
                colors[x-1][y] = color_change
            }
            else if(x + 1 <= end_row && colors[x + 1][y] == undefined){
                colors[x + 1][y] = color_change
            }
        }
        else{
            if(x - 1 >= start_row && colors[x-1][y] == undefined){
                colors[x-1][y] = color_change
            }
            else if(x + 1 <= end_row && colors[x + 1][y] == undefined){
                colors[x + 1][y] = color_change
            }
            else if(y-1 >= 0 && colors[x][y-1] == undefined){
                colors[x][y-1] = color_change;
            }
            else if(y + 1 < colors[start_row].length && colors[x][y+1] == undefined){
                colors[x][y+1] = color_change;
            }
        }
    }

    for(let i = start_row; i <= end_row; i++){
        for(let j = 0; j < colors[i].length; j++){
            let col = colors[i][j];
            colors[i][j] = format_rgb_color_string(col[0], col[1], col[2]);
        }
    }

}

function find_color_pick_random(colors, key_color, start_row, end_row){
    let positions = [];
    for(let i = start_row; i <= end_row; i++){
        for(let j = 0; j < colors[i].length; j++){
            if(colors[i][j] != undefined && compare_lists(colors[i][j], key_color)){
                positions.push([i, j]);
            }
        }
    }
    return positions[Math.floor(Math.random() * positions.length)];
}

function compare_lists(list_one, list_two){
    if(list_one.length != list_two.length){
        return false;
    }
    for(let i = 0; i < list_one.length; i++){
        if(list_one[i] != list_two[i]){
            return false;
        }
    }
    return true;
}

function check_undefined(colors,start_row, end_row){
    for(let i = start_row; i <= end_row; i++){
        for(let j = 0; j < colors[i].length; j++){
            if(colors[i][j] == undefined){
                return true;
            }
        }
    }
    return false;
}

function derive_brightness_colors(start_color, num_colors){
    let out_colors = [start_color];
    for(let i = 0; i < num_colors; i++){
        let new_color = [start_color[0], start_color[1], start_color[2]];
        for(let j = 0; j < 3; j++){
            let adj = .02 * ((i / 2) + 1);
            new_color[j] = new_color[j] * (i % 2 == 0 ? 1 + adj : 1 - adj);
        }
        out_colors.push(new_color);
    }
    return out_colors;
}

function draw_soft_gradient(colors, row, start_color, end_color){
    let r1 = start_color[0]
    let r2 = end_color[0]
    let g1 = start_color[1]
    let g2 = end_color[1]
    let b1 = start_color[2]
    let b2 = end_color[2]
    colors[row][0] = format_rgb_color_string(r1, g1, b1)
    colors[row][31] = format_rgb_color_string(r2, g2, b2)
    for(let i = 1; i < 31; i++){
        let perc = i / 32.0
        perc += Math.random() - .5
        if(perc < 0){
            perc = 0.0
        }
        if(perc > 1){
            perc = 1.0
        }
        let r3 = (r1 * (1.0 - perc) + r2 * perc);
        let g3 = (g1 * (1.0 - perc) + g2 * perc);
        let b3 = (b1 * (1.0 - perc) + b2 * perc);
        colors[row][i] = format_rgb_color_string(r3, g3, b3, 1)
    }
}

    //-- Lego Brick Border  -----------------------------------

// Suppose each lego brick is a 3x3 of a color with an accent brighter color in the center for the little peg
// With ~15 pixel width in space, we have a 5-wide area of bricks to decorate with and as long as we like for continuing patterns
// Select 4-5 brick colors and fill out a space with them arbitrarily; random? Spatter pattern style? Try either
// Draw the sub-grid into the 3x3 style into color_block

function draw_lego_border(canvas, easel, wid, hei, size){
    if(color_block.length == 0){
        initialize_lego_edge_style();
        lego_block_alt = color_block;
        color_block = [];
        initialize_lego_edge_style();
    }

    if(lego_corner_refresh > 0 && counter % lego_corner_refresh == 0){
        //initialize_lego_corner_style();
        let hold = color_block;
        color_block = lego_block_alt;
        lego_block_alt = hold;
    }

    draw_pattern_edge(canvas, easel, wid, hei, size);
}

function initialize_lego_edge_style(){
    // The number of lego blocks in a pattern block
    let block_height = block_width * 6;

    // Holds the small version of the pattern which is expanded based on block_size into color_block
    let mini_block = [];
    color_block = [];

    lego_pattern_random(mini_block, block_height);

    for(let i = 0; i < mini_block.length; i++){
        for(let j = 0; j < mini_block[i].length; j++){
            let color = mini_block[i][j];
            for(let k = 0; k < block_size; k++){
                for(let l = 0; l < block_size; l++){
                    let choice = (k % 2 == 1 && l % 2 == 1);
                    color_block[i * block_size + k][j * block_size + l] = choice ? format_rgb_color_string_arr(lighten(color)) : format_rgb_color_string_arr(color);
                }
            }
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

function lighten(color_arr){
    let out = [color_arr[0], color_arr[1], color_arr[2]];
    for(let i = 0; i < out.length; i++){
        let add = out[i] * .25;
        out[i] = out[i] + ((add == 0) ? 30 : add);
    }
    return out;
}

function darken(color_arr){
    let out = [color_arr[0], color_arr[1], color_arr[2]];
    for(let i = 0; i < out.length; i++){
        let add = out[i] * .25;
        out[i] = out[i] - ((add == 0) ? 0 : add);
    }
    return out;
}

    //-- Runescape Chat Border  -------------------------------

//emulating the chat box style seen here: https://oldschool.runescape.wiki/images/Chat_Interface.png?cef8d
//Edges are a repeating pattern approximately eight times as long as the edges are thick
//Corners have faux-metal plating
//Inside edge is varying strength dark, outer edge is varying strength light highlight (for top and left)
//Outer edge approximately increases in brightness along each pattern (for top and left)
//Border segment is 7x32, darker brown pixels on either end and 5 softer metal-gray-brown pixels inside
//Second to most outer line of pixels is brighter than the rest and increases in brightness along the 32 length
//Base color of border is 79, 72, 53
//Manually draw first instance of the pattern and then reference it for copying over for subsequent

//Function that fills a row of an array given a start and end color that are hard-set and then fills in the between
//  with a gradual gradient and some random variance within
//Function that paint splats within a 2d array region (4x32) and spreads each paint splat out in a crawl with a random
//  to blend if it meets another color (blend, overwrite, go another direction, or just end) with random fill-in from
//  base colors if any spots are missing after initial color managing
//Once our 7x32 is constructed thusly, draw it to canvas and use that reference point for copying the pattern elsewhere

//Corner embellishments are 9x9 squares with faux-metal clamp with 45 degree line drawn 3 pixels out from edges
//Complete the hard outline around the outside, ensure the inside corner is drawn properly, mirror the pixels on the
//  inside-side that doesn't have the hard brown line drawn through it, lighten the pixels on the inside of the embellishment area
//Use a slightly brighter version of the perimeter color for the 45 degree line


//Interior region is papyrus-scroll texture with rapid gradient from dark border to lighter taupe center
function draw_runescape_border(canvas, easel, wid, hei, size){

    if(color_block.length == 0){
        // Initialize the color_block 2d array with the base runescape pattern for the main edges
        initialize_runescape_border();
    }

    // Initiali,ze the corner_block 2d array with the base runescape pattern for the corner parts
    initialize_runescape_corner();

    draw_pattern_edge(canvas, easel, wid, hei, size);
}

function initialize_runescape_corner(){
    corner_block = [[], [], [], [], [], [], [], [], []];

    // Initiate it to a square 2d array
    for(let i = 0; i < corner_block.length; i++){
        for(let j = 0; j < corner_block.length; j++){
            corner_block[i][j] = undefined;
        }
    }

    // Draw top and left lines of solid colors (top is dark brown, left is bright reflective)
    for(let i = 0; i < corner_block.length; i++){
        corner_block[i][0] = format_rgb_color_string(147, 137, 144);
        corner_block[0][i] = format_rgb_color_string(51, 38, 25);
    }

    // Draws the interior of the corner embellishment and some of the brown outlining
    for(let i = 0; i < 2; i++){
        for(let j = 1; j < corner_block.length - 1; j++){
            use = i == 0 ? format_rgb_color_string(174, 169, 147) : format_rgb_color_string(147, 137, 114);
            corner_block[j][i] = use;
            corner_block[i + 1][j] = use;
        }
        corner_block[corner_block.length - 1][i] = format_rgb_color_string(72, 58, 39);
        corner_block[i + 1][corner_block.length - 2] = format_rgb_color_string(72, 58, 39);
    }

    let center = Math.floor(corner_block.length / 2) - 1;

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 4; j++){
            corner_block[center + i][center + j - 1] = format_rgb_color_string(119, 112, 94);
            corner_block[center + j][center + i - 1] = format_rgb_color_string(119, 112, 94);
        }
    }

    // Draws the diagonal portion of the brown outlining
    for(let i = 0; i < 6; i++){
        corner_block[3 + i][6 - i] = format_rgb_color_string(72, 58, 39);
    }

    // Top left of inside embellishment bolt
    corner_block[center][center-1] = format_rgb_color_string(179, 176, 168);
    // Bottom left
    corner_block[center+1][center-1] = format_rgb_color_string(96, 90, 74);
    // Top right
    corner_block[center][center] = format_rgb_color_string(179, 176, 168);
    // Bottom right
    corner_block[center+1][center] = format_rgb_color_string(72, 58, 39);

    corner_block[center + 3][center + 2] = format_rgb_color_string(42, 36, 21);

    return corner_block;
}

function initialize_runescape_border(){
    color_block = [[], [], [], [], [], [], []]
    draw_soft_gradient(color_block, 0, [51, 38, 25], [51, 38, 25])
    draw_soft_gradient(color_block, 1, [96, 90, 74], [147, 137, 114])
    draw_soft_gradient(color_block, 6, [65, 56, 39], [42, 36, 21])

    for(let i = 2; i < 6; i++){
        for(let j = 0; j < 32; j++){
            color_block[i][j] = undefined; //format_rgb_color_string(79 + i * 5, 72 + i * 5, 53 + i * 5)
        }
    }
    
    draw_spatter_pattern(color_block, 2, 5);
}

    //-- Perimeter Tour  --------------------------------------

function draw_edge_tour_point(easel, wid, hei, size){
    max_period = (2 * (wid + hei) / size) + 1

    // Initializes the entire border to be a base color we're going to draw over by replacing
    // the elements at particular indices
    if(under_colors.length < max_period){
        easel.fillStyle = format_rgb_color_string(color_r, color_g, color_b)
        for(let i = 0; i < max_period; i++){
            under_colors.push(easel.fillStyle)
        }
    }

    // Iterate the color change to get the next one and assign it to the current head of the color train
    iterate_colors();
    under_colors[counter % max_period] = format_rgb_color_string(color_r, color_g, color_b);

    // Draw the under-layer using the colors stored in under_colors previously (if you don't, it
    // gets wiped on the next call to draw so you have to redraw what has been drawn)
    draw_edges_all_shift(easel, wid, hei, size, -1);
}

    //-- All Shift  -------------------------------------------

/**
 * 
 * The idea here is that, using the COLOR_PACE variable and draw_edge function, you effectively
 * get a color shift of the entire border that is synchronized
 * 
 * COLOR_PACE needs to be at least 300 to avoid bad flashing
 * 
 * @param {*} easel 
 * @param {*} wid 
 * @param {*} hei 
 * @param {*} size 
 */

function draw_edges_all_shift(easel, wid, hei, size, color_pace){
    let draw_index = 0
    // -->
    draw_index = draw_edge_all_shift(0, 0, wid, size, easel, color_pace, draw_index)

    // vvv
    draw_index = draw_edge_all_shift(wid - size, 0, size, hei, easel, color_pace, draw_index)

    // <--
    draw_index = draw_edge_all_shift(wid - size, hei - size, -1 * wid, size, easel, color_pace, draw_index)

    // ^^^
    draw_index = draw_edge_all_shift(0, hei - size, size, -1 * hei, easel, color_pace, draw_index)
}

function draw_edge_all_shift(x_start, y_start, width, height, easel, color_pace, draw_index){
    let across = Math.abs(width) > Math.abs(height);
    let block = across ? height : width;

    let bound = across ? width : height;

    let negative = bound < 0;

    for(let i = 0; i < Math.abs(bound) / block; i += 1){
        if(i % color_pace == 0 && color_pace > 0){
            iterate_colors()
            easel.fillStyle = format_rgb_color_string(color_r, color_g, color_b)
        }
        let val = i * block;
        let x = x_start + (across ? val * (negative ? -1 : 1) : 0)
        let y = y_start + (across ? 0 : val * (negative ? -1 : 1))

        let col = easel.fillStyle

        // This is used to contextually draw from under_colors if we have assigned values to that array
        if(draw_index < under_colors.length){
            easel.fillStyle = under_colors[draw_index % under_colors.length]
        }

        easel.fillRect(x, y, block, block)
        easel.fillStyle = col
        draw_index += 1
    }
    return draw_index
}

//---  Support Methods   ----------------------------------------------------------------------

function initialize(easel, wid, hei, size){
    easel.fillRect(0, 0, wid, size)
    easel.fillRect(0, 0, size, hei)
    easel.fillRect(wid - size, 0, size, hei)
    easel.fillRect(0, hei - size, wid, size)
}

function iterate_colors(){
    color_r += r_change * (r_up ? 1 : -1)
    color_g += g_change * (g_up ? 1 : -1)
    color_b += b_change * (b_up ? 1 : -1)
    if(color_r > 255){
        color_r = 255
        r_up = false
    }
    if(color_r < 0){
        color_r = 0
        r_up = true
    }
    if(color_g > 255){
        color_g = 255
        g_up = false
    }
    if(color_g < 0){
        color_g = 0
        g_up = true
    }
    if(color_b > 255){
        color_b = 255
        b_up = false
    }
    if(color_b < 0){
        color_b = 0
        b_up = true
    }
}

function format_rgb_color_string(col_r, col_g, col_b, alpha="1"){
    return "rgb(" + bounds(col_r) + ", " + bounds(col_g) + ", " + bounds(col_b) + ", " +  bounds(alpha) + ")"
}

function bounds(col){
    return col < 0 ? 0 : col > 255 ? 255 : col;
}
  
function format_rgb_color_string_arr(color_array){
    return format_rgb_color_string(color_array[0], color_array[1], color_array[2], color_array.length == 4 ? color_array[3] : 1);
}