import {generic_shape, build_grid} from "./BorderSupportShapes.js"
import {produce_canvas, draw_pattern_edge, darken, format_rgb_color_string_arr} from "./border.js";

export function christmas_stuff(){
    return {
        "backing" : check_christmas_backings,
        "keyword_back" : keywords_back,
        "borders" : check_christmas_borders,
        "keyword_border" : keywords_border
    }
}

function check_christmas_backings(easel, canvas, wid, hei, size, counter, keyword){
    switch(keyword){
        case "christmas":
            draw_christmas_backing(easel, canvas, wid, hei, size, counter);
            return true;
        default:
            return false;
    }
}

function keywords_back(){
    return ["christmas"];
}

function check_christmas_borders(easel, canvas, wid, hei, size, counter, keyword){
    switch(keyword){
        case "christmas":
            draw_christmas_border(easel, canvas, wid, hei, size, counter);
            return true;
        default:
            return false;
    }
}

function keywords_border(){
    return ["christmas"];
}

//---  Support Data   -------------------------------------------------------------------------

    //-- Greens  ----------------------------------------------

let pine_green = [13, 89, 1];

let stocking_green = [0, 179, 44];

let winter_green = [13, 239, 66];

    //-- Reds  ------------------------------------------------

let mistletoe_red = [220, 61, 42];

let santa_red = [179, 0, 12];

    //-- Blues  -----------------------------------------------

let icicle_blue = [179, 218, 241];

let deep_freeze = [66, 104, 124];

let reindeer_brown = [139, 69, 19];

let black = [0, 0, 0];

    //-- Color Sets  ------------------------------------------

let colors = {"1" : santa_red, "2" : winter_green, "3" : mistletoe_red, "4" : pine_green, "5" : deep_freeze,
              "6" : reindeer_brown, "7" : darken(stocking_green), "a" : black}

let wreath_colors = {"1" : santa_red, "2" : pine_green, "3" : darken(stocking_green), "4" : black, "5" : reindeer_brown};

//---  Backings   -----------------------------------------------------------------------------

/*
    - Christmas present wrapping
    - Winter cabin pine lodge
    - Hearth with christmas stockings
    - 
 */

function draw_christmas_backing(easel, canvas, wid, hei, size, counter){
    let animate = 4;
    if(canvas.offscreenCanvas != undefined){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);

    if(size == null || size == undefined){
        size = 2;
    }

    let color_order = [2, 5, 6, 1, 3];

    for(let i = 0; i < color_order.length; i++){
        easel.fillStyle = format_rgb_color_string_arr(colors[color_order[i]]);
        easel.fillRect(0, i / color_order.length * hei, wid, hei / color_order.length);
    }

    draw_wreath(easel, size * 25, size * 25, size, wreath_colors, true);

    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

function draw_wreath(easel, x, y, size, colors, centered = f4lse){
    let shape = "";
    shape = build_grid(shape, "000000444444000000");
    shape = build_grid(shape, "000044333333440000");
    shape = build_grid(shape, "000433222252334000");
    shape = build_grid(shape, "004322222222223400");
    shape = build_grid(shape, "043252244442222340");
    shape = build_grid(shape, "432222400004222234");
    shape = build_grid(shape, "422224000000422224");
    shape = build_grid(shape, "422240000000042524");
    shape = build_grid(shape, "425240000000042224");
    shape = build_grid(shape, "422340000000043254");
    shape = build_grid(shape, "422340000000043224");
    shape = build_grid(shape, "422234000000432224");
    shape = build_grid(shape, "422223114411322524");
    shape = build_grid(shape, "042521221122122240");
    shape = build_grid(shape, "004222112211222400");
    shape = build_grid(shape, "000422212212224000");
    shape = build_grid(shape, "000044144441440000");
    generic_shape(easel, x, y, size, shape, colors, centered);
}

let border_canvas = undefined

function draw_christmas_border(easel, canvas, wid, hei, size, counter){
    if(border_canvas != undefined){
        easel.drawImage(border_canvas, 0, 0, wid, hei, 0, 0, wid, hei);
        return;
    }
    border_canvas = produce_canvas(wid, hei);

    initialize_christmas_edge();
    initialize_christmas_corner();


    draw_pattern_edge(border_canvas, border_canvas.getContext("2d"), color_block, corner_block, wid, hei, 2, false);
}

function initialize_christmas_edge(){

}

function initialize_christmas_corner(){

}