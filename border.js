let counter = 0

let max_period = 80

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

let color_block = []

setInterval(draw_border, 60);

function draw_border(){
    let canvas = document.getElementById("canvas")

    let body = document.getElementById("body")

    let type = document.styleSheets[0].cssRules[0].style.getPropertyValue("font-family")

    let wid = window.innerWidth
    let hei = window.innerHeight

    if(canvas.wid != wid){
        canvas.width = wid
        canvas.height = hei
    }

    let easel = canvas.getContext("2d")

    let SIZE = 8

    easel.lineWidth = 1

    let vert_offset = 0

    switch(type){
        case 'rainbow-tour':
            draw_edge_tour_point(easel, wid, hei, SIZE, vert_offset)
            break;
        case 'rainbow-pulse':
            draw_edges_all_shift(easel, wid, hei, SIZE, vert_offset, COLOR_PACE)
            break;
        case 'runescape':
            draw_runescape_edge(canvas, easel, wid, hei, SIZE)
            break;
        default:
            draw_edge_tour_point(easel, wid, hei, SIZE, vert_offset)
            break;
    }

    //
    //draw_edge_tour_point(easel, wid, hei, SIZE, vert_offset)

    counter += 1;
}

function initialize(easel, wid, hei, size, vert_offset){
    easel.fillRect(0, vert_offset, wid, size)
    easel.fillRect(0, vert_offset, size, hei)
    easel.fillRect(wid - size, vert_offset, size, hei)
    easel.fillRect(0, hei - size, wid, size)
}

//---  Border Draw Types   --------------------------------------------------------------------

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
function draw_runescape_edge(canvas, easel, wid, hei, size){
    size = 3
    if(color_block.length < 5){
        initialize_runescape_border();
    }
    let corner_displacement = size * color_block.length;

    // Draws the initial segment of the edge pattern for each edge of the enclosed space
    // If I could just rotate a referenced segment of the canvas, I wouldn't have to do this four times, but it's not costly so oh well
    for(let i = 0; i < 7; i++){
        for(let j = 0; j < 32; j++){
            easel.fillStyle = color_block[i][j]
            easel.fillRect(corner_displacement + j * size, i * size, size, size)
            easel.fillRect(wid - i * size, corner_displacement + j * size, size, size)
            easel.fillRect(wid - j * size - corner_displacement, hei - i * size, size, size)
            easel.fillRect(i * size, hei - j * size - corner_displacement, size, size)
        }
    }
    
    let block_hei = color_block.length * size
    let block_wid = (color_block[0].length - 1) * size
    // Draws the top and bottom horizontal sections by copying the template image drawn in by the above code
    for(let i = 0; i < (wid - 2 * corner_displacement) / block_wid; i += 1){
        // References its own canvas to copy the template pattern along the row
        easel.drawImage(canvas, corner_displacement, 0, block_wid, block_hei, i * block_wid + corner_displacement, 0, block_wid, block_hei)
        easel.drawImage(canvas, wid - corner_displacement - block_wid, hei - block_hei, block_wid, block_hei, wid - (i + 1) * block_wid - corner_displacement, hei - block_hei, block_wid, block_hei)
    }
    // Draws the left and right vertical sections by copying the template image drawn in by the above above code
    for(let i = 0; i < (hei - 2 * corner_displacement) / block_wid; i += 1){
        // References its own canvas to copy the template pattern along the row
        easel.drawImage(canvas, wid - corner_displacement, corner_displacement, block_hei, block_wid, wid - block_hei, i * block_wid + corner_displacement, block_hei, block_wid)
        easel.drawImage(canvas, 0, hei - corner_displacement - block_wid, block_hei, block_wid, 0, hei - (i + 1) * block_wid - corner_displacement, block_hei, block_wid)
    }

    // Draw the corner embellishments over the corner spaces
}

function initialize_runescape_border(){
    color_block = [[], [], [], [], [], [], []]
    draw_soft_gradient(color_block, 0, [51, 38, 25], [51, 38, 25])
    draw_soft_gradient(color_block, 1, [96, 90, 74], [147, 137, 114])
    draw_soft_gradient(color_block, 6, [49, 41, 27], [42, 36, 21])

    // Replace the below code with the spatter pattern function
    for(let i = 2; i < 6; i++){
        for(let j = 0; j < 32; j++){
            color_block[i][j] = format_rgb_color_string(79 + i * 5, 72 + i * 5, 53 + i * 5)
        }
    }
}

function draw_spatter_pattern(colors){

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

    //-- Perimeter Tour  --------------------------------------

function draw_edge_tour_point(easel, wid, hei, size, vert_offset){
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
    draw_edges_all_shift(easel, wid, hei, size, vert_offset, -1);

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
 * @param {*} vert_offset 
 */

function draw_edges_all_shift(easel, wid, hei, size, vert_offset, color_pace){
    let draw_index = 0
    // -->
    draw_index = draw_edge_all_shift(0, vert_offset, wid, size, easel, color_pace, draw_index)

    // vvv
    draw_index = draw_edge_all_shift(wid - size, vert_offset, size, hei, easel, color_pace, draw_index)

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

    for(let i = 0; i < Math.abs(bound); i += block){
        if(i % color_pace == 0 && color_pace > 0){
            iterate_colors()
            easel.fillStyle = format_rgb_color_string(color_r, color_g, color_b)
        }
        let x = x_start + (across ? i * (negative ? -1 : 1) : 0)
        let y = y_start + (across ? 0 : i * (negative ? -1 : 1))

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
    return "rgb(" + col_r + ", " + col_g + ", " + col_b + ", " +  alpha + ")"
  }
  