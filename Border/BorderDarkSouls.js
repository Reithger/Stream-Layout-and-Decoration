import { format_rgb_color_string, lighten, darken, format_rgb_color_string_arr, draw_pattern_edge, draw_pattern_edge_sides} from "./border.js";

let color_block = [];

let corner_block = [];

let shine_color = [155, 140, 121];

let leather_color = darken([45, 38, 32]);

let leather_stress_color = [45, 38, 32, .45];

let accent_color = lighten([60, 50, 41]);

let transp_color = [0, 0, 0, 0];

export function draw_dark_backing(easel, wid, hei, size){
    easel.fillStyle = format_rgb_color_string_arr(darken(leather_color));

    easel.fillRect(12, 0, wid - 24, hei);
    easel.fillRect(0, 12, wid, hei - 24);
    
    //easel.font = "italic 55px Brush Script MT";
    easel.font = "italic 54px Luminari"
    easel.fillStyle = format_rgb_color_string_arr(leather_stress_color);

    // For thematic appropriateness, I am using the DS2 intro transcript for the text that gets mangled
    let text = ["Perhaps you've seen it, maybe in a dream. A murky, forgotten land.",
                "A place where souls may mend your ailing mind.",
                "You will lose everything... once Branded. The symbol of the curse.",
                "An augur of darkness. Your past. Your future. Your very light.",
                "None will have meaning, and you won't even care. By then, you'll be something other than human.",
                "A thing that feeds on souls. A Hollow. Long ago, in a walled off land, far to the north, a great king built a great kingdom.",
                "I believe they called it Drangleic. Perhaps you're familiar. No, how could you be.",
                "But one day, you will stand before its decrepit gate. Without really knowing why... Like a moth drawn to a flame.",
                "Your wings will burn in anguish. Time after time. For that is your fate. The fate of the cursed.",
                ];
    
    
    easel.rotate((90 * Math.PI) / 180);
    let i = 0;

    while(i * 10 < wid){
        let use = text[i % text.length] + (hei > wid ? text[i % text.length] : "");
        easel.fillText(use, i % 2 == 0 ? (i % 7) * 5 : (i % 7) * -5, 0 - i * 10, hei);
        i += 1;
    }

    easel.setTransform(1, 0, 0, 1, 0, 0);
}

export function draw_dark_souls_border(canvas, easel, wid, hei, size){
    if(color_block.length == 0){
        initialize_dark_edge_side();
        initialize_dark_corner();
    }

    draw_pattern_edge(canvas, easel, color_block, corner_block, wid, hei, size, false);
}

function initialize_dark_corner(){
    corner_block = [];
    for(let i = 0; i < 15; i++){
        let arr = [];
        for(let j = 0; j < 15; j++){
            arr.push(format_rgb_color_string_arr(accent_color));
        }
        corner_block.push(arr);
    }

    fill_section(corner_block, leather_color, 10, 0, 5, 5);
    fill_section(corner_block, leather_color, 0, 10, 5, 5);

    fill_block(corner_block, 13, leather_color);
    fill_block(corner_block, 11, shine_color);
    fill_block(corner_block, 8, leather_color);


    fill_section(corner_block, shine_color, 0, 11, 3, 4);
    fill_section(corner_block, shine_color, 11, 0, 4, 3);

    fill_section(corner_block, leather_color, 8, 0, 2, 2);
    corner_block[9][1] = format_rgb_color_string_arr(shine_color);
    corner_block[11][3] = format_rgb_color_string_arr(shine_color);

    fill_section(corner_block, leather_color, 0, 8, 2, 2);
    corner_block[1][9] = format_rgb_color_string_arr(shine_color);
    corner_block[3][11] = format_rgb_color_string_arr(shine_color);

    fill_section(corner_block, leather_color, 9, 9, 2, 2);
    corner_block[9][9] = format_rgb_color_string_arr(shine_color);
    corner_block[7][7] = format_rgb_color_string_arr(shine_color);

    fill_section(corner_block, accent_color, 11, 11, 3, 3);
    fill_section(corner_block, lighten(lighten(accent_color)), 14, 14, 3, 3);
    
    clear_section(corner_block, 0, 0, 4, 4);
    fill_section(corner_block, leather_color, 1, 1, 3, 3);
    corner_block[1][1] = undefined;
}

function fill_block(arr, size, color){
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            arr[i][j] = format_rgb_color_string_arr(color);
        }
    }
}

function fill_section(arr, color, x, y, wid, hei){
    for(let i = x; (i < x + wid) && (i < arr.length); i++){
        for(let j = y; (j < y + hei) && (j < arr[i].length); j++){
            arr[i][j] = format_rgb_color_string_arr(color);
        }
    }
}

function clear_section(arr, x, y, wid, hei){
    for(let i = x; (i < x + wid) && (i < arr.length); i++){
        for(let j = y; (j < y + hei) && (j < arr[i].length); j++){
            arr[i][j] = undefined;
        }
    }
}

/*
 * Basic edge for sides is shine_color 2x thickness, transparent break, 1x accent_color, transparent break x8, 1x accent_color
 * 
 * Half way down the sides is an arc in, lose the first accent_color and gradual curve the shine_color to only a transparent break x2
 *   before the inside accent_color; at the center, do a spike of brighter shine_color towards the outside from the innermost part.
 * 
 * Bottom is 2x shine_color, transparent break, 2x accent_color (mottled), transparent break x8, 1x accent color
 * 
 * Bottom and Top have weird embellishments that will be hard to recreate.
 * 
 * Corners are a hard 90 degree turn in that is slightly rounded/beveled, outside curve is shine_color (brighter) with inner accent.
 * 
 */

let block_size = 40;

// This is a divisor, so smaller gets a larger impact
let col_shift = 12;

function initialize_dark_edge_side(){
    color_block = [];
    let arr = [];
    for(let i = 0; i < 3; i++){
        mottle(color_block, shine_color, block_size, col_shift);
    }
    for(let i = 0; i < 2; i++){
        mottle(color_block, leather_color, block_size, col_shift);
    }
    for(let i = 0; i < 2; i++){
        mottle(color_block, accent_color, block_size, 25);
    }
    for(let i = 0; i < 6; i++){
        mottle(color_block, leather_color, block_size, col_shift);
    }
    for(let i = 0; i < 2; i++){
        mottle(color_block, lighten(lighten(accent_color)), block_size, col_shift);
    }
}

function mottle(color_arr, color, length, variance){
    let arr = [];

    for(let i = 0; i < length; i++){
        arr.push(format_rgb_color_string_arr(adjust(color, variance)));
    }

    color_arr.push(arr);

}

function clear(color_arr, length){
    let arr = [];

    for(let i = 0; i < length; i++){
        arr.push(undefined);
    }

    color_arr.push(arr);
}

function adjust(color_vals, variance){
    let out = [];
    let col_var = (Math.random() * 2 - 1) / variance;
    out.push(color_vals[0] + Math.floor(col_var * color_vals[0]));
    out.push(color_vals[1] + Math.floor(col_var * color_vals[1]));
    out.push(color_vals[2] + Math.floor(col_var * color_vals[2]));
    return out;
}