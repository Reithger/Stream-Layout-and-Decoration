import { format_rgb_color_string_arr } from "./border.js";

//---  Styled Pattern Drawing   ---------------------------------------------------------------

/** 
 * mottle_layers is a high-level accessor for doing the mottled wave pattern drawing; you can provide:
 *  a list of colors (length n),
 *  a list of proportions (length n-1) denoting vertical positioning of that wave pattern (provide values
 *      in range [0, 1] for percentage progress down the page),
 *  a list of booleans (length n-1) denoting whether that wave pattern should be smooth or rough (true for
 *      smooth, false for rough),
 *  a sin_list (length n-1) containing 2-item arrays controlling the sin-wave (first argument makes the
 *      sin wave short or long, second controls the height),
 *  and an offset value (range [0, 2]) that adjusts where in the sin-wave it starts drawing
 * 
 * This argument list lets you define a series of sin wave patterns separating color changes to build visuals quickly.
 * 
 * An 'easel' is a 2D context object associated with an HTML Canvas.
 */

export function mottle_layers(easel, wid, hei, size, color_list, prop_list, smooth_list, sin_list, offset = 0){
    let last_prop = 0;
    easel.fillStyle = format_rgb_color_string_arr(color_list[0]);
    easel.fillRect(0, 0, wid, hei);
    for(let i = 0; i < color_list.length - 1; i++){
        let color_one = color_list[i];
        let color_two = color_list[i + 1];
        let prop = prop_list[i];
        easel.fillStyle = format_rgb_color_string_arr(color_two);
        easel.fillRect(0, hei * prop, wid, hei * (1 - prop));
        let sin_wid = sin_list[i][0];
        let sin_trough = sin_list[i][1];
        let y = Math.floor(hei * prop / size) * size;
        if(smooth_list[i]){
            cross_screen_mottle_smooth(easel, 0, y, color_one, color_two, size, wid, sin_wid, sin_trough, offset);
        }
        else{
            cross_screen_mottle(easel, 0, y, color_one, color_two, size, wid, sin_wid, sin_trough, sin_trough,offset);
        }
        last_prop = prop;
    }
}

/**
 * Here, 'mottling' refers to a checkerboard drawing style. In sequential blocks of 2x2 regions, it fills in the lower left
 *  and upper right quadrants; this makes for nice visual transitions between colors.
 * 
 * This function draws this mottling in a wave across the screen between two defined colors (color_one, color_two), with
 * notable arguments:
 *  - size, which controls how many pixels make up a sidelength of a quadrant in the aforementioned 2x2 mottled regions (basically,
 *      how chunky and obvious will the block of color be)
 *  - step_width, which controls how wide/narrow the sin wave will be (should be an int value around 3-10, typically)
 *  - trough_height, which controls how tall and low the sin wave will be (should be an int value around 3-10, typically)
 *  - clean_height (default set to trough_height), which informs how far vertically each color will be drawn to cover any gaps in that
 *      color (a tall sin wave could dip far enough that the secondary color appears above the first color); use of this depends on how
 *      you are drawing around the mottling.
 *  - offset (value in range [0-2]) that modifies the starting position of the sin wave pattern (at 0, it starts at the bottom of the trough;
 *      at 1, it would start at the peak). Default set to 0.
 */

export function cross_screen_mottle(easel, start_x, start_y, color_one, color_two, size, wid, step_width, trough_height, clean_height = trough_height, offset = 0){
    let ind = 0;

    while(start_x < wid){
        let val = Math.floor(Math.sin(.5 * Math.PI * (ind / step_width) - (1.25 - offset) * Math.PI) * trough_height);
        mottle_block(easel, start_x, start_y + val * size, color_one, color_two, size, clean_height);
        start_x += size * 2;
        ind += 1;
    }
}

/**
 * Variation of cross_screen_mottle that doesn't do the mottling, it's just a sin wave where color_one is above the wave and color_two
 *  is below the wave. Notably does not have a clean_height argument because it's irrelevant.
 */

export function cross_screen_mottle_smooth(easel, start_x, start_y, color_one, color_two, size, wid, step_width, trough_height, offset = 0){
    let ind = 0; //Math.floor(cap / 2);

    while(start_x < wid){
        let val = Math.floor(Math.sin(.5 * Math.PI * (ind / step_width) - (1.25 - offset) * Math.PI) * trough_height);
        mottle_smooth(easel, start_x, start_y + val * size, color_one, color_two, size, trough_height);
        start_x += size * 2;
        ind += 1;
    }
}

/**
 * Variation of cross_screen_mottle that takes 3 colors for doing a sin wave of vertical stripes with greater gaps between each stripe.
 * 
 */

export function cross_screen_vert_mottle(easel, start_x, start_y, color_one, color_two, color_three, size, wid, step_width, trough_height, offset = 0){
    let ind = 0;

    while(start_x < wid){
        let val = Math.floor(Math.sin(.5 * Math.PI * (ind / step_width) - (1.25 - offset) * Math.PI) * trough_height);
        vert_mottle(easel, start_x, start_y + val * size, color_one, color_two, color_three, size);
        start_x += size * 2;
        ind += 1;
    }
}

/**
 * 
 * Here, 'mottling' refers to a checkerboard drawing style. In sequential blocks of 2x2 regions, it fills in the lower left
 *  and upper right quadrants; this makes for nice visual transitions between colors.
 * 
 * This function draws a single mottle block (2x2) and fills in a certain number of 'blocks' above and below this mottle block
 * to tidy up any gaps in an intended solid-color space.
 * 
 */

function mottle_block(easel, x, y, color_one, color_two, size, clean_height = 5){
    easel.fillStyle = format_rgb_color_string_arr(color_one);
    easel.fillRect(x, y, size, size);
    easel.fillRect(x + size, y + size, size, size);
    // This last fill of this color is to fix color discrepencies above/below this spot
    easel.fillRect(x, y - size * clean_height, 2 * size, clean_height * size);
    easel.fillStyle = format_rgb_color_string_arr(color_two);
    easel.fillRect(x + size, y, size, size);
    easel.fillRect(x, y + size, size, size);
    // This last fill of this color is to fix color discrepencies above/below this spot
    easel.fillRect(x, y + 2 * size, 2 * size, clean_height * size);
}

function mottle_smooth(easel, x, y, color_one, color_two, size, clean_height = 5){
    easel.fillStyle = format_rgb_color_string_arr(color_one);
    // This last fill of this color is to fix color discrepencies above/below this spot
    easel.fillRect(x, y - size * clean_height, 2 * size, clean_height * size);
    easel.fillStyle = format_rgb_color_string_arr(color_two);
    // This last fill of this color is to fix color discrepencies above/below this spot
    easel.fillRect(x, y, 2 * size, clean_height * size);
}

function vert_mottle(easel, x, y, color_one, color_two, color_three, size){
    easel.fillStyle = format_rgb_color_string_arr(color_one);
    easel.fillRect(x, y, size, size);
    easel.fillStyle = format_rgb_color_string_arr(color_two);
    easel.fillRect(x, y + size, size, size);
    easel.fillStyle = format_rgb_color_string_arr(color_three);
    easel.fillRect(x, y + 2 * size, size, size);
    easel.fillRect(x, y + 3 * size, size, size);
}
