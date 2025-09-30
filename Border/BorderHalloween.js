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
        case "halloween_collage_one":
            draw_halloween_collage_one_backing(easel, canvas, wid, hei, size == undefined ? 4 : size, counter);
            return true;
        case "halloween_collage_two":
            draw_halloween_collage_two_backing(easel, canvas, wid, hei, size == undefined ? 4 : size, counter);
            return true;
        case "halloween_sky":
            draw_halloween_sky_backing(easel, canvas, wid, hei, size == undefined ? 4 : size, counter);
            return true;
        default:
            return false;
    }
}

function keywords_back(){
    return ["halloween_collage_one", "halloween_collage_two", "halloween_sky"];
}

function check_halloween_borders(easel, canvas, wid, hei, size, counter, keyword){
    switch(keyword){
        case "halloween":
            draw_halloween_style_border(easel, canvas, wid, hei, 2, counter);
            return true;
        case "halloween_pill":
            draw_halloween_pill_border(easel, canvas, wid, hei, 2, counter);
            return true;
        default:
            return false;
    }
}

function keywords_border(){
    return ["halloween", "halloween_pill"];
}

//---  Backings   -----------------------------------------------------------------------------

/**
 * Design ideas:
 *  - Base color with decorative slashes through it (torn wallpaper, bloody claw streak, etc.) of accent color
 *  - Pumpkin patch with spooky purple sky (look at old pixel gravestone you drew for ref.)
 *  - Graveyard similar to pumpkin patch design but with wrought-iron fence across bottom section
 *  - Purple backing with accent shapes drawn onto it (witch hat, broom, pumpkin), maybe have them float across screen too or have accents that shine periodically (pumpkin eyes)
 *  - 
 * 
 *  Megaman health bar pill border pattern with halloween colors inside
 *  Orange halloween night with clouds and bats background type
 */

let pumpkin_orange = [247, 95, 28];

let pumpkin_yellow = [255, 154, 0];

let witch_purple = [136, 30, 228];

let apple_green = [133, 226, 31];

let ghost_grey = [156, 182, 195];

let phantom_black = [3, 12, 22];

let blood_red = [138, 3, 3];

let toggle = false;

function draw_halloween_sky_backing(easel, canvas, wid, hei, size, counter){
    let animate = 4;
    if(canvas.offscreenCanvas != undefined && counter % animate != 0){
        easel.drawImage(canvas.offscreenCanvas, 0, 0);
        return;
    }
    canvas.offscreenCanvas = produce_canvas(wid, hei);

    let display_vert = false;
    let display_horz = false;
    if(wid / hei < .33){
        display_vert = true
    }
    else if (hei / wid < .33){
        display_horz = true
    }

    if(display_horz){
        mottle_layers(easel, wid, hei, size, 
            [darken_prop(pumpkin_orange, .15), darken_prop(pumpkin_orange, .35)],
            [.5],
            [false],
            [[6, 4]], 0);
    } else if(display_vert){
        mottle_layers(easel, wid, hei, size, 
            [darken(witch_purple), witch_purple, lighten_prop(witch_purple, .25), lighten_prop(witch_purple, .45), darken_prop(pumpkin_orange, .05), darken_prop(pumpkin_orange, .15), darken_prop(pumpkin_orange, .35), darken_prop(pumpkin_orange, .55)],
            [.1, .2, .3, .45, .55, .65, .8],
            [false, false, false, false, false, false, false],
            [[6, 4], [6, 4], [6, 4], [6, 4], [6, 4], [6, 4], [6, 4]], 0);
    } else {
        mottle_layers(easel, wid, hei, size, 
            [darken(witch_purple), witch_purple, darken_prop(pumpkin_orange, .05), darken_prop(pumpkin_orange, .15), darken_prop(pumpkin_orange, .35), darken_prop(pumpkin_orange, .55)],
            [.2, .4, .6, .75, .85],
            [false, false, false, false, false],
            [ [6, 4], [6, 4], [6, 4], [6, 4], [6, 4]], 0);
    }

    let posit = counter / animate;

    let posits = [-2, -2, -1, 0, 1, 1, 2, 2, 2, 1, 1, 0, -1, -2, -2, -2];
    let adjust = posits[posit % posits.length];
    let adjust_ot = posits[(posit + 6) % posits.length];

    let y_start = size * 24;
    let y_step = size * 32;
    let x_step = display_vert ? size * 40 : size * 60;
    let loc_counter = 0
    while(y_start < hei - y_step / 2){
        let x_start = loc_counter % 2 == 0 ? (size * 2) : (size * 2 + x_step * 3 / 5);
        x_start += display_vert ? 0 : 12 * size;
        x_start = clean_pos(x_start, size)
        // Around each cloud, have a few bat archetypes (a few scattered in front/behind, swarm in front/behind, use toggle to prompt swarm to fly around it?)
        while(x_start < wid - x_step / 3){
            let loc_y = y_start + (loc_counter % 2 == 0 ? (!display_horz ? adjust : adjust - 2 * size) : (!display_horz ? adjust_ot : adjust_ot + 2 * size));
            let alt_y = y_start + (loc_counter % 2 != 0 ? (!display_horz ? adjust : adjust - 2 * size) : (!display_horz ? adjust_ot : adjust_ot + 2 * size));
            draw_cloud(easel, x_start, loc_y, size, darken_prop(ghost_grey, .1));
            for(let i = 0; i < 3; i++){
                draw_bat(easel, x_start + i * 12 * size, alt_y - 4 * size + (i % 2 == 0 ? -2 : 2) * size, size, i % 2 == 0)
            }
            loc_counter += display_horz ? 1 : 0
            x_start += x_step
        }

        y_start += y_step
        loc_counter++
    }

    //draw_bat(easel, 30 *  size, 30 * size, size, true);
    //draw_bat(easel, 30 *  size, 36 * size, size, false);
    
    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

function draw_bat(easel, x, y, size, large = true){
    easel.fillStyle = format_rgb_color_string_arr(phantom_black)

    if(large){
        easel.fillRect(x - 3 * size, y - size, size, 3 * size);
        easel.fillRect(x + 3 * size, y - size, size, 3 * size);
        easel.fillRect(x - size, y - size, size * 3, size)
        easel.fillRect(x - 2 * size, y, size, size);
        easel.fillRect(x + 2 * size, y, size, size);
        easel.fillRect(x - size, y + size, size, size);
        easel.fillRect(x, y, size, size);
        easel.fillRect(x + size, y + size, size, size);
    }
    else {
        easel.fillRect(x - size, y, 3 * size, size);
        easel.fillRect(x - 2 * size, y + size, size, size);
        easel.fillRect(x, y + size, size, size);
        easel.fillRect(x + 2 * size, y + size, size, size);
    }
}

// Will use the large size bat along with dots to imply more further away
function draw_bat_swarm(easel, x, y, size){

}

function draw_cloud(easel, x, y, size, color){
    // The first set draws the outline
    for(let i = 0; i < 4; i++){
        draw_blocky_circle(easel, x + 4 * size * i, y - 2 * size * i, size, 12, darken(color), false, true)
    }
    for(let i = 0; i < 5; i++){
        draw_blocky_circle(easel, x + 5 * size * i, y + (i % 2 == 0 ? 1 : -1) * size, size, 12, darken(color), false, true)
    }
    draw_blocky_circle(easel, x + 16 * size, y - 4 * size, size, 12, darken(color), false, true)

    // The second set draws the lighter internal color by overlapping the outline's interior
    for(let i = 0; i < 4; i++){
        draw_blocky_circle(easel, x + 4 * size * i, y - 2 * size * i, size, 10, color, false, true)
    }
    for(let i = 0; i < 5; i++){
        draw_blocky_circle(easel, x + 5 * size * i, y + (i % 2 == 0 ? 1 : -1) * size, size, 10, color, false, true)
    }
    draw_blocky_circle(easel, x + 16 * size, y - 4 * size, size, 10, color, false, true)
}

function draw_halloween_collage_one_backing(easel, canvas, wid, hei, size, counter){ 
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

    let meta_counter = 0;

    let y_step = 36 * size;
    let x_step = 30 * size;

    let vert_edge = (hei - Math.floor(hei / y_step) * y_step) / 2;
    let horz_edge = (wid - Math.floor(wid / x_step) * x_step) / 2;

    let y_pos = vert_edge / 2 + y_step / 2;
    y_pos = clean_pos(y_pos, size)

    while(y_pos + (y_step / 2) < hei){
        let counter = 0;
        let x_pos = x_step / 2 + (meta_counter % 2 == 0 ? horz_edge : horz_edge + x_step / 2);
        x_pos = clean_pos(x_pos, size)

        while(x_pos + (x_step / 2) < wid){
            switch(counter % 4){
                case 0:
                    if(meta_counter % 2 == 0){
                        draw_ghost(easel, x_pos, y_pos + adjust * size, size, ghost_grey, eyes, pumpkin_yellow, toggle, toggle);
                    }
                    else{
                        draw_candy_prefab(easel, x_pos, y_pos + adjust_ot * size, size, 1, true);
                    }
                    break;
                case 1:
                    if(meta_counter % 2 == 0){
                        draw_jack_lantern_prefab(easel, x_pos, y_pos + (Math.floor(adjust / 3)), size, 1, adjust, toggle)
                    }
                    else{
                        draw_ghost(easel, x_pos, y_pos + adjust * size, size, ghost_grey, eyes, pumpkin_yellow, !toggle, toggle);
                    }
                    break;
                case 2:
                    if(meta_counter % 2 == 0){
                        draw_candy_prefab(easel, x_pos, y_pos + adjust_ot * size, size, 2, true);
                    }
                    else{
                        draw_jack_lantern_prefab(easel, x_pos, y_pos + (Math.floor(adjust / 3)), size, 2, adjust, toggle)
                    }
                    break;
                case 3:
                    if(meta_counter % 2 == 0){
                        draw_jack_lantern_prefab(easel, x_pos, y_pos + (Math.floor(adjust / 3)), size, 3, adjust, toggle)
                    }
                    else{
                        draw_ghost(easel, x_pos, y_pos + adjust * size, size, ghost_grey, eyes, pumpkin_yellow, toggle, toggle);
                    }
                    break;
                default:
                    break;
            }
            x_pos += x_step;
            counter += 1;
        }


        y_pos += y_step;
        meta_counter += 1;
    }

    //draw_ghost(easel, 18 * size, (16 + adjust) * size, size, ghost_grey, eyes, pumpkin_yellow, toggle, toggle);

    
    //draw_ghost(easel, 18 * size, (50 + adjust_ot) * size, size, ghost_grey, eyes, pumpkin_yellow, !toggle, toggle);

    //candy(easel, 20 * size, (56 + adjust_ot) * size, size, pumpkin_yellow, pumpkin_orange, true);

    //witch_hat(easel, 20 * size, (56) * size, size, phantom_black, blood_red);

    //candy(easel, 20 * size, (113 + adjust_ot) * size, size, apple_green, pumpkin_orange, false);

    //draw_jack_o_lantern(easel, 18 * size, (90 + Math.floor(adjust / 3)) * size, size, pumpkin_orange, pumpkin_yellow, darken(apple_green), phantom_black, true, true, false, false, adjust, toggle);

    //draw_pumpkin(easel, 18 * size, (115 + Math.floor(adjust_ot / 3)) * size, size, pumpkin_orange, pumpkin_yellow, darken(apple_green), adjust_ot, false, toggle);
    
    canvas.offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0, wid, hei, 0, 0, wid, hei);
}

function clean_pos(num, size) {
    return (Math.floor(num / size) * size)
}

function draw_halloween_collage_two_backing(easel, canvas, wid, hei, size, counter){
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


    let posit = counter / animate;

    let posits = [-2, -2, -1, 0, 1, 1, 2, 2, 2, 1, 1, 0, -1, -2, -2, -2];
    let adjust = posits[posit % posits.length];
    let adjust_ot = posits[(posit + 3) % posits.length];

    let x_pos = 52 * size;
    let y_pos = (Math.floor(hei / size)  * size) - 12 * size;

    let counter_alt = 0;
    while(x_pos + 32 * size < wid){
        let smile = counter_alt % 2 == 0;
        let eyes = counter_alt % 3 < 2;
        let creepy = counter_alt % 4 == 0;
        let anim_frame = posits[(posit + counter_alt) % posits.length];
        draw_jack_o_lantern(easel, x_pos, y_pos, size, pumpkin_orange, pumpkin_yellow, darken(apple_green), phantom_black, eyes, smile, creepy, false, anim_frame, Math.floor(counter / 64) % 12 != counter_alt);
        counter_alt += 1;
        x_pos += (counter_alt % 2 == 0 ? 32 : 35) * size;
    }
                 
    candy(easel, 18 * size, 18 * size, size, pumpkin_yellow, darken(apple_green), true);
    candy(easel, Math.floor(wid / size) * size - 17 * size, 17 * size, size, apple_green, pumpkin_orange, false);
    candy(easel, 18 * size, Math.floor(hei / size) * size - 18 * size, size, blood_red, witch_purple, false);
    candy(easel, Math.floor(wid / size) * size - 17 * size, Math.floor(hei / size) * size - 18 * size, size, phantom_black, [222, 222, 222], true);

    let mid_x = Math.floor(wid / 2 / size) * size;
    let mid_y = Math.floor(hei / 2 / size) * size;

    let dist = 52 * size;

    draw_ghost(easel, mid_x - dist, mid_y + adjust, size, ghost_grey, darken(ghost_grey), pumpkin_yellow, true, true);
    draw_ghost(easel, mid_x + dist, mid_y + adjust_ot, size, ghost_grey, darken(ghost_grey), pumpkin_yellow, true, true);
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

function draw_candy_prefab(easel, x_pos, y_pos, size, type, orient){
    switch(type){
        case 1:
            candy(easel, x_pos, y_pos, size, pumpkin_yellow, darken(apple_green), orient);
            break;
        case 2:
            candy(easel, x_pos, y_pos, size, apple_green, pumpkin_orange, orient);
            break;
        case 3:
            candy(easel, x_pos, y_pos, size, phantom_black, [222, 222, 222], orient);
            break;
        default:
            candy(easel, x_pos, y_pos, size, apple_green, pumpkin_orange, orient);
            break;
    }
}

function draw_jack_lantern_prefab(easel, x_pos, y_pos, size, type, anim_frame, toggle){
    switch(type){
        case 1:
            draw_jack_o_lantern(easel, x_pos, y_pos, size, pumpkin_orange, pumpkin_yellow, darken(apple_green), phantom_black, true, false, true, false, anim_frame, toggle);
            break;
        case 2:
            draw_jack_o_lantern(easel, x_pos, y_pos, size, pumpkin_orange, pumpkin_yellow, darken(apple_green), phantom_black, true, true, false, false, anim_frame, toggle);    
            break;
        case 3:
            draw_jack_o_lantern(easel, x_pos, y_pos, size, pumpkin_orange, pumpkin_yellow, darken(apple_green), phantom_black, true, true, false, true, anim_frame, toggle);
            break;
        default:
            draw_jack_o_lantern(easel, x_pos, y_pos, size, pumpkin_orange, pumpkin_yellow, darken(apple_green), phantom_black, true, false, true, false, anim_frame, toggle);
            break;
    }
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
    easel.fillStyle= format_rgb_color_string_arr([0, 0, 0]);

    let scale = 16;

    let half_scale = scale / 2;

    y -= 6 * size;

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
/* */

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

function draw_halloween_pill_border(easel, canvas, wid, hei, size, counter) {
    if(border_canvas != undefined){
        easel.drawImage(border_canvas, 0, 0, wid, hei, 0, 0, wid, hei);
        return;
    }
    border_canvas = produce_canvas(wid, hei);
    if(color_block.length == 0){
        initialize_pill_border();
        initialize_pill_corner();
    }

    
    draw_pattern_edge(border_canvas, border_canvas.getContext("2d"), color_block, corner_block, wid, hei, size, false);
}

function initialize_pill_border(){
    let depth = 7;
    let num_pills = 8;
    let pill_depth = 4;
    for(let i = 0; i < depth * 1; i++){
        let use = [];
        for(let i = 0; i < (pill_depth + 1) * (num_pills); i++){
            use.push(format_rgb_color_string_arr(blood_red));
        }
        color_block.push(use);
    }

    let colors = [witch_purple, pumpkin_yellow, apple_green, pumpkin_orange];

    let x_ind = 1

    for(let i = 0; i < num_pills; i++){

        for(let j = 0; j < 5; j++){
            for(let k = 0; k < pill_depth; k++){
                if(j == 0 && k == 0 || j == 0 && k == pill_depth - 1 || j == 4 && k == 0 || j == 4 && k == pill_depth - 1){
                    continue;
                }
                color_block[j + 1][x_ind + k] = format_rgb_color_string_arr(colors[i % colors.length])
            }
        }

        x_ind += (pill_depth + 1);
    }

}

function initialize_pill_corner(){
    let edge = 7;
    corner_block = [];
    for(let i = 0; i < edge; i++){
        let use = [];
        for(let j = 0; j < edge; j++){
            use.push(format_rgb_color_string_arr(blood_red));
        }
        corner_block.push(use);
    }

    for(let i = 2; i < 5; i++){
        for(let j = 1; j < 6; j++){
            corner_block[i][j] = format_rgb_color_string_arr(ghost_grey)
            corner_block[j][i] = format_rgb_color_string_arr(ghost_grey)
        }
    }

    let eye_color = darken(apple_green)
    corner_block[2][2] = format_rgb_color_string_arr(eye_color)
    corner_block[2][3] = format_rgb_color_string_arr(eye_color)
    corner_block[3][2] = format_rgb_color_string_arr(eye_color)
    corner_block[4][3] = format_rgb_color_string_arr(eye_color)
    corner_block[3][4] = format_rgb_color_string_arr(eye_color)
    corner_block[4][4] = format_rgb_color_string_arr(eye_color)
    corner_block[3][3] = format_rgb_color_string_arr(eye_color)

}

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