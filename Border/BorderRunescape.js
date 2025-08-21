import { format_rgb_color_string, draw_pattern_edge} from "./border.js";

//--  Backing   -----------------------------------------------

let shadow_values = [];

export function draw_runescape_backing(easel, wid, hei, size){
    if(canvas.offscreenCanvas != undefined){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);
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
    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

//--  Border   ------------------------------------------------


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

let color_block = [];

let corner_block = [];

export function draw_runescape_border(canvas, easel, wid, hei, size){

    if(color_block.length == 0){
        // Initialize the color_block 2d array with the base runescape pattern for the main edges
        initialize_runescape_border();
    }

    // Initiali,ze the corner_block 2d array with the base runescape pattern for the corner parts
    initialize_runescape_corner();

    draw_pattern_edge(canvas, easel, color_block, corner_block, wid, hei, size);
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
            let use = i == 0 ? format_rgb_color_string(174, 169, 147) : format_rgb_color_string(147, 137, 114);
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

//--  Support Functions   -------------------------------------

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
