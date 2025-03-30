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

    if(counter == 0){    
        let COLOR = format_rgb_color_string(color_r, color_g, color_b)
        easel.fillStyle = COLOR
        initialize(easel, wid, hei, SIZE, vert_offset)
    }


    //draw_edges_all_shift(easel, wid, hei, SIZE, vert_offset, COLOR_PACE)
    draw_edge_tour_point(easel, wid, hei, SIZE, vert_offset)

    counter += 1;
}

function initialize(easel, wid, hei, size, vert_offset){
    easel.fillRect(0, vert_offset, wid, size)
    easel.fillRect(0, vert_offset, size, hei)
    easel.fillRect(wid - size, vert_offset, size, hei)
    easel.fillRect(0, hei - size, wid, size)
}

//---  Border Draw Types   --------------------------------------------------------------------

    //-- Perimeter Tour  --------------------------------------

function draw_edge_tour_point(easel, wid, hei, size, vert_offset){
    max_period = 2 * (wid + hei) / size

    if(under_colors.length < max_period){
        easel.fillStyle = format_rgb_color_string(color_r, color_g, color_b)
        for(let i = 0; i < max_period; i++){
            under_colors.push(easel.fillStyle)
        }
    }

    let prop = (counter % max_period) / max_period;

    easel.fillStyle = under_colors[max_period - 1]
    
    draw_edges_all_shift(easel, wid, hei, size, vert_offset, -1);

    iterate_colors()
    easel.fillStyle = format_rgb_color_string(color_r, color_g, color_b)

    under_colors[counter % max_period] = easel.fillStyle

    let first_half = prop <= .50
    prop -= first_half ? 0 : .5
    let horizontal = (prop / .5) <= (wid / (wid + hei))

    if(horizontal){
        let x = prop * (wid + hei) * 2
        let y = first_half ? vert_offset : (hei - size);
        easel.fillRect(first_half ? x : (wid - x - size), y, size, size)
    }
    else{
        let x = first_half ? wid - size : 0;
        let y = prop * 2 * (wid + hei) - wid
        easel.fillRect(x, first_half ? y + vert_offset : (hei - y), size, size)
    }

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

        if(draw_index < under_colors.length){
            easel.fillStyle = under_colors[draw_index]
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
  