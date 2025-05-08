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
//Define a rule for generating each segment of the border in 16x16 blocks that we can resize
function draw_runescape_edge(easel, wid, hei, size){

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
  