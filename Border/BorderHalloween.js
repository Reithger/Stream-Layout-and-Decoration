import {draw_pattern_edge, format_rgb_color_string_arr, produce_canvas, lighten, darken, darken_prop, lighten_prop} from "./border.js";
import {mottle_layers} from "./BorderSupportPattern.js";

export function halloween_stuff(){
    return {
        "backing" : check_halloween_backings,
        "keyword_back" : keywords_back,
        "borders" : check_halloween_borders,
        "keyword_border" : keywords_border
    }
}

function check_halloween_backings(easel, canvas, wid, hei, size, counter, keyword){
    switch(keyword){
        case "halloween":
            draw_halloween_style_backing(easel, canvas, wid, hei, size, counter);
            return true;
        default:
            return false;
    }
}

function keywords_back(){
    return ["halloween"];
}

function check_halloween_borders(easel, canvas, wid, hei, size, counter, keyword){
    switch(keyword){
        case "halloween":
            draw_halloween_style_border(easel, canvas, wid, hei, 2, counter);
            return true;
        default:
            return false;
    }
}

function keywords_border(){
    return ["halloween"];
}

//---  Backings   -----------------------------------------------------------------------------

/**
 * Design ideas:
 *  - Base color with decorative slashes through it (torn wallpaper, bloody claw streak, etc.) of accent color
 *  - Pumpkin patch with spooky purple sky (look at old pixel gravestone you drew for ref.)
 *  - Graveyard similar to pumpkin patch design but with wrought-iron fence across bottom section
 *  - Purple backing with accent shapes drawn onto it (witch hat, broom, pumpkin), maybe have them float across screen too or have accents that shine periodically (pumpkin eyes)
 *  - 
 */

let pumpkin_orange = [247, 95, 28];

let pumpkin_yellow = [255, 154, 0];

let witch_purple = [136, 30, 228];

let apple_green = [133, 226, 31];

let ghost_grey = [156, 182, 195];

let phantom_black = [0, 0, 0];

let blood_red = [138, 3, 3];

let toggle = false;

function draw_halloween_style_backing(easel, canvas, wid, hei, size, counter){
    let animate = 4;
    if(canvas.offscreenCanvas != undefined && counter % animate != 0){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);

    if(toggle){
        toggle = counter % (animate * 64) == 0 ? !toggle : toggle;
    }
    else{
        toggle = counter % (animate * 16) == 0 ? !toggle : toggle;
    }

    mottle_layers(easel, wid, hei, size, 
        [witch_purple, darken_prop(witch_purple, .15), darken_prop(witch_purple, .35), darken_prop(witch_purple, .55)],
        [.2, .5, .8],
        [false, false, false],
        [[6, 4], [6, 4], [6, 4]], 0);

    let eyes = darken(ghost_grey);

    let posit = counter / animate;

    let posits = [-2, -2, -1, 0, 1, 1, 2, 2, 2, 1, 1, 0, -1, -2, -2, -2];
    let adjust = posits[posit % posits.length];
    let adjust_ot = posits[(posit + 3) % posits.length];

    draw_ghost(easel, 18 * size, (16 + adjust) * size, size, ghost_grey, eyes, pumpkin_yellow, toggle, toggle);

    
    //draw_ghost(easel, 18 * size, (50 + adjust_ot) * size, size, ghost_grey, eyes, pumpkin_yellow, !toggle, toggle);

    //candy(easel, 20 * size, (56 + adjust_ot) * size, size, pumpkin_yellow, pumpkin_orange, true);

    witch_hat(easel, 20 * size, (56) * size, size, phantom_black, blood_red);

    candy(easel, 20 * size, (113 + adjust_ot) * size, size, apple_green, pumpkin_orange, false);

    draw_jack_o_lantern(easel, 18 * size, (90 + Math.floor(adjust / 3)) * size, size, pumpkin_orange, pumpkin_yellow, darken(apple_green), phantom_black, true, true, false, false, adjust, toggle);

    //draw_pumpkin(easel, 18 * size, (115 + Math.floor(adjust_ot / 3)) * size, size, pumpkin_orange, pumpkin_yellow, darken(apple_green), adjust_ot, false, toggle);
    
    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

function witch_hat(easel, x, y, size, outline_color, fill_color){

    draw_blocky_circle(easel, x, y, size, 12, outline_color, false, false);
    draw_blocky_circle(easel, x + 5 * size, y - 2 * size, size, 10, outline_color, false, false);
    draw_blocky_circle(easel, x - 5 * size, y + 1 * size, size, 10, outline_color, false, false);

    draw_blocky_circle(easel, x, y, size, 10, fill_color, false, true);
    draw_blocky_circle(easel, x + 5 * size, y - 2 * size, size, 8, fill_color, false, true);
    draw_blocky_circle(easel, x - 5 * size, y + 1 * size, size, 8, fill_color, false, true);

}

function candy(easel, x, y, size, main_color, accent_color, forward = true){
    let border_color = darken_prop(main_color, .2);

    let backing_color = main_color;

    let trim_color = lighten_prop(accent_color, .1);
    
    diagonal_oval(easel, x, y, size, 12, backing_color, border_color, forward);

    candy_twist_upper(easel, x, y, size, border_color, backing_color, trim_color, forward);
    candy_twist_lower(easel, x, y, size, border_color, backing_color, trim_color, forward);

    easel.fillStyle = format_rgb_color_string_arr(accent_color);
/*
    for(let i = 0; i < 10; i+= 2){
        //easel.fillRect(x - (2 - i) * size, y - (6 - i / 2) * size, (i == 8 ? 1 : 2) * size, 3 * size);
    }

    for(let i = 0; i < 12; i+= 2){
        easel.fillRect(x - (5 - i) * size, y - (3 - i / 2) * size, (i == 10 ? 1 : 2) * size, (i == 10 ? 2 : 3) * size);
    }

    for(let i = 0; i < 10; i+= 2){
        //easel.fillRect(x - (6 - i) * size, y + (1 + i / 2) * size, (i == 8 ? 1 : 2) * size, (i == 8 ? 2 : 3) * size);
    }
*/

    diagonal_oval(easel, x - 0 * size, y + 0 * size, size, 8, trim_color, accent_color, !forward);

    easel.fillStyle = format_rgb_color_string_arr(backing_color);

    for(let i = 0; i < 3; i++){
        let x_off = i * 3;
        let y_off = i * 3;
        easel.fillRect(x - (forward ? (5 - x_off) : (5 - x_off)) * size, y - (forward ? (3 - y_off) : (-3 + y_off)) * size, 2 * size, size);
        easel.fillRect(x - (forward ? (3 - x_off) : (3 - x_off)) * size, y - (forward ? (2 - y_off) : (-1 + y_off)) * size, size, 2 * size);
    }

    for(let i = 0; i < 4; i++){
        if(forward){
            easel.fillRect(x + (4 - i * 2) * size, y + (2 - i * 2) * size, size, size);
        }
        else{
            easel.fillRect(x - (2 - i * 2) * size, y + (4 - i * 2) * size, size, size);
        }
    }
    /*
    easel.fillRect(x - 5 * size, y - 3 * size, 2 * size, 1 * size);
    easel.fillRect(x - 3 * size, y - 2 * size, 1 * size, 2 * size);
    easel.fillRect(x - 2 * size, y - 0 * size, 2 * size, 1 * size);
    easel.fillRect(x - 0 * size, y + 1 * size, 1 * size, 2 * size);
    easel.fillRect(x + 1 * size, y + 3 * size, 2 * size, 1 * size);
    easel.fillRect(x + 3 * size, y + 4 * size, 1 * size, 2 * size);

    easel.fillRect(x + 2 * size, y + 0 * size, 1 * size, 1 * size);
    easel.fillRect(x - 0 * size, y - 2 * size, 1 * size, 1 * size);

    easel.fillRect(x - 2 * size, y - 4 * size, 1 * size, 1 * size);
    easel.fillRect(x + 4 * size, y + 2 * size, 1 * size, 1 * size);


    //diagonal_oval(easel, x - 0 * size, y + 0 * size, size, 2, backing_color, backing_color, false);
/*
    diagonal_oval(easel, x - 3 * size, y + 3 * size, size, 4, accent_color, darken(trim_color), false);
    diagonal_oval(easel, x - 3 * size, y + 3 * size, size, 2, trim_color, darken_prop(trim_color, .15), false);

    diagonal_oval(easel, x + 2 * size, y - 2 * size, size, 6, accent_color, darken(trim_color), false);
    diagonal_oval(easel, x + 2 * size, y - 2 * size, size, 4, trim_color, darken_prop(trim_color, .15), false);
*/
    //diagonal_oval(easel, x + 4 * size, y - 4 * size, size, 2, accent_color, darken(trim_color), false);
    //diagonal_oval(easel, x - 4 * size, y + 4 * size, size, 2, accent_color, darken(trim_color), false);


}

function candy_twist_lower(easel, x, y, size, border_color, back_color, alt_color, forward = true){
    easel.fillStyle = format_rgb_color_string_arr(back_color);

    if(forward){
        easel.fillRect(x - 8 * size, y + 7 * size, 3 * size, 6 * size);
        easel.fillRect(x - 12 * size, y + 6 * size, 4 * size, 3 * size);
        easel.fillRect(x - 9 * size, y + 9 * size, 1 * size, 1 * size);
    }
    else{
        easel.fillRect(x + 6 * size, y + 7 * size, 3 * size, 6 * size);
        easel.fillRect(x + 9 * size, y + 6 * size, 4 * size, 3 * size);
        easel.fillRect(x + 9 * size, y + 9 * size, 1 * size, 1 * size);
    }

    easel.fillStyle = format_rgb_color_string_arr(border_color);

    if(forward){
        easel.fillRect(x - 6 * size, y + 7 * size, 1 * size, 3 * size);
        easel.fillRect(x - 5 * size, y + 10 * size, 1 * size, 3 * size);
        easel.fillRect(x - 9 * size, y + 6 * size, 3 * size, 1 * size);
        easel.fillRect(x - 13 * size, y + 5 * size, 4 * size, 1 * size);
    }
    else{
        easel.fillRect(x + 6 * size, y + 7 * size, 1 * size, 3 * size);
        easel.fillRect(x + 5 * size, y + 10 * size, 1 * size, 4 * size);
        easel.fillRect(x + 7 * size, y + 6 * size, 3 * size, 1 * size);
        easel.fillRect(x + 10 * size, y + 5 * size, 3 * size, 1 * size);
    }

    for(let i = 0; i < 8; i++){
        easel.fillStyle = format_rgb_color_string_arr(border_color);
        if(forward){
            easel.fillRect(x - (14 - i) * size, y + (6 + i) * size, 1 * size, 1 * size);
        }
        else{
            easel.fillRect(x + (6 + i) * size, y + (14 - i - (i == 7 ? 1 : 0)) * size, 1 * size, (i == 7 ? 2 : 1) * size);
        }
        easel.fillStyle = format_rgb_color_string_arr(i == 7 && forward ? border_color : alt_color);
        if(forward){
            easel.fillRect(x - (13 - i) * size, y + (6 + i) * size, (i == 7 ? 1 : 2) * size, 1 * size);
        }
        else{
            easel.fillRect(x + (5 + i + (i == 0 ? 1 : 0)) * size, y + (13 - i) * size, (i == 0 || i == 7 ? 1 : 2) * size, 1 * size);
        }
    }
}

function candy_twist_upper(easel, x, y, size, border_color, back_color, alt_color, forward = true){
    easel.fillStyle = format_rgb_color_string_arr(back_color);

    if(forward){
        easel.fillRect(x + 6 * size, y - 12 * size, 3 * size, 6 * size);
        easel.fillRect(x + 9 * size, y - 8 * size, 4 * size, 3 * size);
        easel.fillRect(x + 9 * size, y - 9 * size, 1 * size, 1 * size);
    }
    else{
        easel.fillRect(x - 8 * size, y - 12 * size, 3 * size, 6 * size);
        easel.fillRect(x - 12 * size, y - 8 * size, 4 * size, 3 * size);
        easel.fillRect(x - 9 * size, y - 9 * size, 1 * size, 1 * size);
    }

    easel.fillStyle = format_rgb_color_string_arr(border_color);
    if(forward){
        easel.fillRect(x + 7 * size, y - 6 * size, 3 * size, size);
        easel.fillRect(x + 10 * size, y - 5 * size, 3 * size, size);
        easel.fillRect(x + 6 * size, y - 9 * size, 1 * size, 3 * size);
        easel.fillRect(x + 5 * size, y - 13 * size, 1 * size, 4 * size);
    }
    else{
        easel.fillRect(x - 9 * size, y - 6 * size, 3 * size, size);
        easel.fillRect(x - 13 * size, y - 5 * size, 4 * size, size);
        easel.fillRect(x - 6 * size, y - 9 * size, 1 * size, 3 * size);
        easel.fillRect(x - 5 * size, y - 12 * size, 1 * size, 3 * size);
    }

    for(let i = 0; i < 8; i++){
        easel.fillStyle = format_rgb_color_string_arr(border_color);
        if(forward){
            easel.fillRect(x + (6 + i) * size, y - (14 - i) * size, 1 * size, 1 * size);
        }
        else{
            easel.fillRect(x - (7 + i) * size, y - (13 - i) * size, 1 * size, 1 * size);
        }
        easel.fillStyle = format_rgb_color_string_arr((forward && i == 7) || (!forward && i == 0) ? border_color : alt_color);
        if(forward){
            easel.fillRect(x + (6 + i) * size, y - (13 - i) * size, 1 * size, (i == 7 ? 1 : 2) * size);
        }
        else{
            easel.fillRect(x - (6 + i) * size, y - (13 - i) * size, (i == 0 ? 1 : 2) * size,  size);
        }
    }

}

function diagonal_oval(easel, x, y, size, scale, main_color, border_color, forward = true){
    let mod = forward ? 2 : -2;
    
    draw_blocky_circle(easel, x, y, size, scale, border_color, false, false);
    draw_blocky_circle(easel, x + mod * size, y - 2 * size, size, scale - 2, border_color, false, false);
    draw_blocky_circle(easel, x - mod * size, y + 2 * size, size, scale - 2, border_color, false, false);

    draw_blocky_circle(easel, x, y, size, scale - 2, main_color, false, true);
    draw_blocky_circle(easel, x + mod * size, y - 2 * size, size, scale - 4, main_color, false, true);
    draw_blocky_circle(easel, x - mod * size, y + 2 * size, size, scale - 4, main_color, false, true);
}

function draw_jack_o_lantern(easel, x, y, size, outline_color, fill_color, stem_color, cut_out_color, happy_eye = true, smile = true, creepy = false, pumpkin_change = false, wiggle_animation = 0, effect_toggle = false){
    draw_pumpkin(easel, x, y, size, outline_color, fill_color, stem_color, wiggle_animation, true, pumpkin_change ? effect_toggle : true);

    let inside_color = cut_out_color;
    if(!effect_toggle){
        inside_color = lighten(fill_color);
    }

    if(happy_eye){
        up_eye(easel, x - 4 * size, y - 2 * size, size, inside_color);
        up_eye(easel, x + 5 * size, y - 2 * size, size, inside_color);
    }
    else{
        down_eye(easel, x - 4 * size, y - 2 * size, size, inside_color);
        down_eye(easel, x + 5 * size, y - 2 * size, size, inside_color);
    }

    //nose(easel, x, y - size, size, inside_color);

    if(smile){
        if(creepy){
            jack_smile_creepy(easel, x, y + 2 * size, size, inside_color, darken(outline_color));
        }
        else{
            jack_smile(easel, x, y + 2 * size, size, inside_color, darken(outline_color));
        }
    }
    else{
        if(creepy){
            jack_frown_creepy(easel, x, y + 2 * size, size, inside_color, darken(outline_color));
        }  
        else{
            jack_frown(easel, x, y + 2 * size, size, inside_color, darken(outline_color));
        }
    }
}

function nose(easel, x, y, size, color){
    easel.fillStyle = format_rgb_color_string_arr(color);
    easel.fillRect(x - size, y, size * 3, 1 * size);
    easel.fillRect(x, y + size, size * 1, size);
}

function up_eye(easel, x, y, size, color){
    easel.fillStyle = format_rgb_color_string_arr(color);
    easel.fillRect(x - 2 * size, y, 4 * size, 2 * size);
    easel.fillRect(x - size, y - size, 2 * size, size);
}

function down_eye(easel, x, y, size, color){
    easel.fillStyle = format_rgb_color_string_arr(color);
    easel.fillRect(x - 2 * size, y - size, 4 * size, 2 * size);
    easel.fillRect(x - size, y + 1 * size, 2 * size, size);
}

function jack_smile(easel, x, y, size, color, accent_color){
    easel.fillStyle = format_rgb_color_string_arr(color);

    easel.fillRect(x - 6 * size, y - size, 4 * size, 2 * size);
    easel.fillRect(x - 4 * size, y, 9 * size, 2 * size);
    easel.fillRect(x - 2 * size, y + size, 5 * size, 2 * size);
    easel.fillRect(x + 3 * size, y - size, 4 * size, 2 * size);

    easel.fillStyle = format_rgb_color_string_arr(accent_color);
    easel.fillRect(x - 1 * size, y + 0 * size, 3 * size, 1 * size);
    easel.fillRect(x - 0 * size, y + 1 * size, 1 * size, 1 * size);

    easel.fillRect(x - 5 * size, y + -1 * size, 2 * size, 1 * size);
    easel.fillRect(x - 4 * size, y + 0 * size, 1 * size, 1 * size);

    easel.fillRect(x + 4 * size, y + -1 * size, 2 * size, 1 * size);
    easel.fillRect(x + 4 * size, y + 0 * size, 1 * size, 1 * size);
    
    easel.fillRect(x + 2 * size, y + 2 * size, 2 * size, 1 * size);
    easel.fillRect(x + 2 * size, y + 1 * size, 1 * size, 1 * size);

    easel.fillRect(x - 3 * size, y + 2 * size, 2 * size, 1 * size);
    easel.fillRect(x - 2 * size, y + 1 * size, 1 * size, 1 * size);
}

function jack_frown(easel, x, y, size, color, accent_color){
    easel.fillStyle = format_rgb_color_string_arr(color);

    easel.fillRect(x - 6 * size, y + 1 * size, 4 * size, 2 * size);
    easel.fillRect(x - 4 * size, y, 9 * size, 2 * size);
    easel.fillRect(x - 2 * size, y - size, 5 * size, 2 * size);
    easel.fillRect(x + 3 * size, y + 1 * size, 4 * size, 2 * size);

    easel.fillStyle = format_rgb_color_string_arr(accent_color);
    
    easel.fillRect(x - 1 * size, y - 1 * size, 3 * size, 1 * size);
    easel.fillRect(x - 0 * size, y - 0 * size, 1 * size, 1 * size);

    easel.fillRect(x - 4 * size, y + 0 * size, 2 * size, 1 * size);
    easel.fillRect(x - 3 * size, y + 1 * size, 1 * size, 1 * size);

    easel.fillRect(x + 3 * size, y + 0 * size, 2 * size, 1 * size);
    easel.fillRect(x + 3 * size, y + 1 * size, 1 * size, 1 * size);
    
    easel.fillRect(x + 5 * size, y + 2 * size, 2 * size, 1 * size);
    easel.fillRect(x + 5 * size, y + 1 * size, 1 * size, 1 * size);

    easel.fillRect(x - 6 * size, y + 2 * size, 2 * size, 1 * size);
    easel.fillRect(x - 5 * size, y + 1 * size, 1 * size, 1 * size);
    
}

function jack_frown_creepy(easel, x, y, size, color, accent_color){
    easel.fillStyle = format_rgb_color_string_arr(color);

    easel.fillRect(x - 6 * size, y + 1 * size, 4 * size, 2 * size);
    easel.fillRect(x - 4 * size, y, 9 * size, 2 * size);
    easel.fillRect(x - 2 * size, y - size, 5 * size, 2 * size);
    easel.fillRect(x + 3 * size, y + 1 * size, 4 * size, 2 * size);

    easel.fillStyle = format_rgb_color_string_arr(accent_color);
    easel.fillRect(x - 1 * size, y - size, 1 * size, 1 * size);
    easel.fillRect(x + 1 * size, y - size, 1 * size, 1 * size);

    easel.fillRect(x + 2 * size, y + 1 * size, 1 * size, 1 * size);
    easel.fillRect(x + 0 * size, y + 1 * size, 1 * size, 1 * size);
    easel.fillRect(x - 2 * size, y + 1 * size, 1 * size, 1 * size);

    easel.fillRect(x + 4 * size, y + 2 * size, 2 * size, 1 * size);
    //easel.fillRect(x + 6 * size, y + 2 * size, 1 * size, 1 * size);

    easel.fillRect(x - 5 * size, y + 2 * size, 2 * size, 1 * size);
    //easel.fillRect(x - 6 * size, y + 2 * size, 1 * size, 1 * size);

    easel.fillRect(x - 3 * size, y + 0 * size, 1 * size, 1 * size);
    easel.fillRect(x + 3 * size, y + 0 * size, 1 * size, 1 * size);


}

function jack_smile_creepy(easel, x, y, size, color, accent_color){
    easel.fillStyle = format_rgb_color_string_arr(color);

    easel.fillRect(x - 6 * size, y - size, 4 * size, 2 * size);
    easel.fillRect(x - 4 * size, y, 9 * size, 2 * size);
    easel.fillRect(x - 2 * size, y + size, 5 * size, 2 * size);
    easel.fillRect(x + 3 * size, y - size, 4 * size, 2 * size);

    easel.fillStyle = format_rgb_color_string_arr(accent_color);
    easel.fillRect(x - 5 * size, y - size, 2 * size, 1 * size);
    easel.fillRect(x + 4 * size, y - size, 2 * size, 1 * size);

    easel.fillRect(x + 3 * size, y + 1 * size, 1 * size, 1 * size);
    easel.fillRect(x - 3 * size, y + 1 * size, 1 * size, 1 * size);

    easel.fillRect(x - 1 * size, y + 2 * size, 1 * size, 1 * size);
    easel.fillRect(x + 1 * size, y + 2 * size, 1 * size, 1 * size);

    easel.fillRect(x + 2 * size, y + 0 * size, 1 * size, 1 * size);
    easel.fillRect(x + 0 * size, y + 0 * size, 1 * size, 1 * size);
    easel.fillRect(x - 2 * size, y + 0 * size, 1 * size, 1 * size);
}

function draw_pumpkin(easel, x, y, size, outline_color, fill_color, stem_color, wiggle_animation = 0, fill = true, effect_toggle = false){

    let use = fill_color;
    if(!effect_toggle){
        use = darken(stem_color);
    }

    if(fill){
        draw_blocky_circle(easel, x - 5 * size, y, size, 14, use, false, true);
        draw_blocky_circle(easel, x - 2 * size, y, size, 14, use, false, true);
        draw_blocky_circle(easel, x + 2 * size, y, size, 14, use, false, true);
        draw_blocky_circle(easel, x + 5 * size, y, size, 14, use, false, true);
    }

    use = outline_color;
    if(!effect_toggle){
        use = darken_prop(stem_color, .4);
    }

    if(!fill){
        use = darken_prop(use, .5);
    }

    draw_blocky_circle(easel, x - 5 * size, y, size, 14, use, false, false);
    draw_blocky_circle(easel, x - 2 * size, y, size, 14, use, false, false);
    draw_blocky_circle(easel, x + 2 * size, y, size, 14, use, false, false);
    draw_blocky_circle(easel, x + 5 * size, y, size, 14, use, false, false);

    easel.fillStyle = format_rgb_color_string_arr(darken_prop(outline_color, .4));
    easel.fillRect(x - size, y + 7 * size, 3 * size, 1 * size);
    easel.fillRect(x - 0 * size, y + 6 * size, 1 * size, 1 * size);
    easel.fillRect(x - 2 * size, y - 7 * size, 5 * size, 2 * size);
    easel.fillRect(x - 1 * size, y - 5 * size, 3 * size, 1 * size);

    use = stem_color;
    if(!effect_toggle){
        use = fill_color;
    }

    easel.fillStyle = format_rgb_color_string_arr(use);
    easel.strokeStyle = format_rgb_color_string_arr(use);
    if(fill){
        easel.fillRect(x - size, y - 10 * size, 3 * size, 5 * size);
        easel.fillRect(x - 0 * size, y - 11 * size, 3 * size, 3 * size);
    }
    else{
        easel.fillRect(x - size, y - 10 * size, 2 * size, 1 * size);
        easel.fillRect(x - size, y - 10 * size, 1 * size, 5 * size);
        easel.fillRect(x + 1 * size, y - 9 * size, 1 * size, 4 * size);
        easel.fillRect(x - size, y - 6 * size, 2 * size, 1 * size);

        easel.fillRect(x - 0 * size, y - 12 * size, 2 * size, 1 * size);
        easel.fillRect(x - 0 * size, y - 12 * size, 1 * size, 2 * size);
        easel.fillRect(x + 2 * size, y - 12 * size, 1 * size, 4 * size);
    }

    easel.fillStyle = format_rgb_color_string_arr(darken(use));
    switch(wiggle_animation){
        case -2:
            easel.fillRect(x - 5 * size, y - 10 * size, 3 * size, 2 * size);
            easel.fillRect(x - 3 * size, y - 9 * size, 2 * size, 2 * size);
            easel.fillRect(x - 7 * size, y - 9 * size, 5 * size, 2 * size);
            easel.fillRect(x - 8 * size, y - 8 * size, 3 * size, 2 * size);
            easel.fillRect(x - 9 * size, y - 7 * size, 2 * size, 2 * size);
            break;
        case -1:
            easel.fillRect(x - 3 * size, y - 9 * size, 2 * size, 2 * size);
            easel.fillRect(x - 5 * size, y - 10 * size, 3 * size, 3 * size);
            easel.fillRect(x - 7 * size, y - 10 * size, 3 * size, 2 * size);
            easel.fillRect(x - 8 * size, y - 9 * size, 3 * size, 2 * size);
            easel.fillRect(x - 9 * size, y - 8 * size, 3 * size, 2 * size);
            break;
        case 0:
            easel.fillRect(x - 3 * size, y - 9 * size, 2 * size, 2 * size);
            easel.fillRect(x - 5 * size, y - 11 * size, 3 * size, 3 * size);
            easel.fillRect(x - 7 * size, y - 11 * size, 3 * size, 2 * size);
            easel.fillRect(x - 8 * size, y - 10 * size, 3 * size, 2 * size);
            easel.fillRect(x - 9 * size, y - 9 * size, 2 * size, 2 * size);
            break;
        case 1:
            easel.fillRect(x - 3 * size, y - 9 * size, 2 * size, 2 * size);
            easel.fillRect(x - 5 * size, y - 11 * size, 3 * size, 3 * size);
            easel.fillRect(x - 7 * size, y - 12 * size, 3 * size, 2 * size);
            easel.fillRect(x - 8 * size, y - 11 * size, 3 * size, 2 * size);
            easel.fillRect(x - 9 * size, y - 10 * size, 2 * size, 2 * size);
            break;
        case 2:
            easel.fillRect(x - 3 * size, y - 9 * size, 2 * size, 2 * size);
            easel.fillRect(x - 5 * size, y - 11 * size, 3 * size, 3 * size);
            //easel.fillRect(x - 7 * size, y - 13 * size, 3 * size, 2 * size);
            easel.fillRect(x - 8 * size, y - 12 * size, 4 * size, 2 * size);
            easel.fillRect(x - 10 * size, y - 11 * size, 3 * size, 2 * size);
            break;
        default:
            break;
    }


}

function draw_ghost(easel, x, y, size, color_one, color_two, effect_color, fill = true, effect_toggle = false){
    easel.fillStyle= format_rgb_color_string_arr(color_one);

    let scale = 16;

    let half_scale = scale / 2;

    if(fill){
        draw_blocky_circle(easel, x, y, size, scale, darken(color_one), true, false);
        draw_blocky_circle(easel, x, y, size, scale - 2, color_one, true, true);
    }
    else{
        draw_blocky_circle(easel, x, y, size, scale, darken(color_one), true, fill);
    }


    easel.fillRect(x + half_scale * size, y, 1 * size, scale * size);
    if(fill){
        easel.fillStyle= format_rgb_color_string_arr(darken(color_one));
        easel.fillRect(x + half_scale * size, y, 1 * size, scale * size);
        easel.fillRect(x - half_scale * size, y, 1 * size, scale * size);
        easel.fillStyle= format_rgb_color_string_arr(color_one);
        easel.fillRect(x - (half_scale - 1) * size, y, (scale - 1) * size, scale * size);
    }
    else {
        easel.fillStyle= format_rgb_color_string_arr(darken(color_one));
        easel.fillRect(x + half_scale * size, y, 1 * size, scale * size);
        easel.fillRect(x - half_scale * size, y, 1 * size, scale * size);
    }


    easel.fillStyle= format_rgb_color_string_arr(color_two);

    let eye_color = effect_toggle ? color_two : effect_color;
    
    draw_vertical_blot(easel, x + (half_scale / 4) * size, y - (half_scale / 4) * size, eye_color, size);
    draw_vertical_blot(easel, x - (half_scale / 2) * size, y - (half_scale / 4) * size, eye_color, size);

    x = x - half_scale * size;
    y = y + scale * size;

    easel.fillStyle= format_rgb_color_string_arr(color_two);

    for(let i = 1; i <= scale; i++){
        let vert = Math.floor(Math.sin(.35 * Math.PI * i)) * 1;
        easel.fillRect(x + i * size, y + vert * size, size, size);
    }

    easel.fillStyle= format_rgb_color_string_arr(eye_color);
    y += half_scale / 4 * size;

    for(let i = 1; i <= scale; i += 3){
        let vert = Math.floor(Math.sin(.35 * Math.PI * i + .5 * Math.PI)) * 1;
        easel.fillRect(x + i * size, y + vert * size, size, size);
        //easel.fillRect(x + (i - 1) * size, y + (1 + vert) * size, size, size);
        easel.fillRect(x + (i + 1) * size, y + (2 + vert) * size, size, size);
    }

}

function draw_vertical_blot(easel, x, y, color, size){
    easel.fillStyle = format_rgb_color_string_arr(color);

    easel.fillRect(x + size, y, size * 2, size * 5);
    easel.fillRect(x, y + size, size * 4, size * 3);
}

function draw_blocky_circle(easel, x, y, size, diameter, color, half = false, fill = true){
    easel.fillStyle = format_rgb_color_string_arr(color);

    x /= size;
    y /= size;

    let radius = Math.floor(diameter / 2);
    for(let i = 0; i <= diameter; i++){
        for(let j = 0; j <= (half ? radius : diameter); j++){
            let pos_x = (x + (-1 * Math.floor(radius) + i));
            let pos_y = (y + (-1 * Math.floor(radius) + j));
            let dist = Math.sqrt(Math.pow(pos_x - x, 2) + Math.pow(pos_y - y, 2));
            if(fill ? Math.floor(dist) <= radius : Math.floor(dist) == radius){
                easel.fillRect(pos_x * size, pos_y * size, size, size);
            }
        }
    }
}

//---  Borders   ------------------------------------------------------------------------------

let color_block = [];

let corner_block = [];

let border_canvas = undefined;

function draw_halloween_style_border(easel, canvas, wid, hei, size, counter){
    if(border_canvas != undefined){
        easel.drawImage(border_canvas, 0, 0, wid, hei, 0, 0, wid, hei);
        return;
    }
    border_canvas = produce_canvas(wid, hei);
    if(color_block.length == 0){
        initialize_halloween_border();
        initialize_halloween_corner();
    }

    
    draw_pattern_edge(border_canvas, border_canvas.getContext("2d"), color_block, corner_block, wid, hei, size, false);
}

function initialize_halloween_border(){
    let depth = 7;
    for(let i = 0; i < depth * 1; i++){
        let use = [];
        for(let i = 0; i < depth * 2 + 1; i++){
            use.push(format_rgb_color_string_arr([255, 255, 255]));
        }
        color_block.push(use);
    }

    let colors = [witch_purple, apple_green, pumpkin_orange];

    for(let i = 0; i < color_block.length; i++){
        color_diagonal(color_block, colors[i % colors.length], 0, i, i % 2 == 0 ? 1 : 2);
    }

    for(let i = 0; i < color_block[0].length; i++){
        color_diagonal(color_block, colors[(depth + i) % colors.length], 1 + i, depth - 1, i % 2 == 0 ? 1 : 2);
    }

    for(let i = 0; i < color_block[0].length; i++){
        color_block[0][i] = format_rgb_color_string_arr(blood_red);
        color_block[color_block.length - 1][i] = format_rgb_color_string_arr(blood_red);
    }

}

function color_diagonal(block, color, x, y, size){
    while(y >= size - 1 && x < block[0].length){
        for(let i = 0; i < size; i++){
            block[y - i][x] = format_rgb_color_string_arr(color);
        }
        y -= 1;
        x += 1;
    }
}

function initialize_halloween_corner(){
    let edge = 7;
    corner_block = [];
    for(let i = 0; i < edge; i++){
        let use = [];
        for(let j = 0; j < edge; j++){
            use.push(undefined);
        }
        corner_block.push(use);
    }

    for(let i = 0; i < 3; i++){
        let color = [blood_red, witch_purple, apple_green][i];
        for(let j = i; j < edge - i; j++){
            corner_block[j][i] = format_rgb_color_string_arr(color);
            corner_block[i][j] = format_rgb_color_string_arr(color);
            corner_block[edge - i - 1][j] = format_rgb_color_string_arr(color);
            corner_block[j][edge - i - 1] = format_rgb_color_string_arr(color);
        }
    }

    corner_block[3][3] = format_rgb_color_string_arr(pumpkin_orange);
}