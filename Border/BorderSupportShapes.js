import { format_rgb_color_string_arr, darken} from "./border.js";

/**
 * 
 * Generic shape drawer; takes the usual easel/x/y to know on what and
 * where to draw, and then takes a String grid that should represent the
 * individual pixels of a 2D image, where each character in the String
 * maps to a color in the color_map mapping object.
 * 
 * An example may be:
 * 
 * "111\n121\n111" or (if you use the build_grid function)
 * "111
 *  121
 *  111"
 * 
 * as your grid, and you would have a map of:
 * 
 * {"1" : [122, 22, 156], "2" : [67, 22, 200]}
 * 
 * so that this function can fill in those colors.
 * 
 * We assume the shape described by 'grid' is a proper rectangle/square
 * and is not representative of a jagged 2d structure.
 * 
 * @param {*} easel 
 * @param {*} x 
 * @param {*} y 
 * @param {*} size
 * @param {*} grid 
 * @param {*} color_map 
 * @param {*} centered 
 */

export function generic_shape(easel, x, y, size, grid, color_map, centered = false){
    let rows = grid.split("\n");
    let start_x = x - (centered ? Math.floor(rows[0].length / 2) * size : 0);
    let start_y = y - (centered ? Math.floor(rows.length / 2) * size : 0);
    for(let i = 0; i < rows.length; i++){
        for(let j = 0; j < rows[i].length; j++){
            let color = color_map[rows[i][j]];
            if(color == undefined){
                continue;
            }
            easel.fillStyle = format_rgb_color_string_arr(color)
            easel.fillRect(start_x + j * size, start_y + i * size, size, size);
        }
    }
}

/**
 * Function to use the string input styling of 'generic_shape' for
 * defining the 2D array used for edges and corners used by
 * 'draw_pattern_edge'
 * 
 * @param {*} grid 
 * @param {*} color_map 
 */

export function generic_border(grid, color_map){
    let out = [];
    let rows = grid.split("\n");
    for(let i = 0; i < rows.length; i++){
        let use = [];
        for(let j = 0; j < rows[i].length; j++){
            let color = color_map[rows[i][j]];
            if(color == undefined){
                use.push(undefined);
            }
            else{
                use.push(format_rgb_color_string_arr(color));
            }
        }
        out.push(use);
    }
    return out;
}

/**
 * 
 * Support function that is just a simple string-appender, but it's meant
 * to be used in a way that formats your input to be in-line so you can easily
 * visualize the 2D shape you are describing with multiple lines of \n separated
 * strings.
 * 
 * Basically, let's you:
 * 
 * let string = ""
 * string = build_grid(string, "111")
 * string = build_grid(string, "121")
 * string = build_grid(string, "111")
 * 
 * So that you can see the 2D representation easily.
 * 
 * This is just to make it easier as the programmer to input shape information in
 * a way that is easy to debug and deal with.
 * 
 * @param {
 * } grid 
 * @param {*} next_line 
 * @returns 
 */

export function build_grid(grid, next_line){
    return grid + (grid == "" ? "" : "\n") + next_line;
}
 
//---  Complex Specific Shapes   --------------------------------------------------------------

/**
 * Draws a coral shape in which color_one is the 'fronds' of the coral that is darkened for an accent,
 * color_contrast is the color at the base of the coral, size is how large each 'block' should be in pixels,
 * and num_fronds is how wide the coral should be in a repeating pattern of simple crosses.
 * 
 * Generally, just set num_fronds to 3 or 4 for ideal effect.
 * 
 */

export function draw_coral(easel, x, y, color_one, color_contrast, size, num_fronds){        
    easel.fillStyle = format_rgb_color_string_arr(color_contrast);
    easel.fillRect(x - (1 + Math.floor(num_fronds / 6)) * size, y , size * (2 * num_fronds - 1), size * 2);
    easel.fillRect(x - (Math.floor(num_fronds / 6)) * size, y + size * 2, size * (2 * num_fronds - 3), size * 1);

    easel.fillStyle = format_rgb_color_string_arr(darken(color_one));
    easel.fillRect(x - (1 + Math.floor(num_fronds / 6)) * size, y - size * 2, size * (2 * num_fronds - 1), size * 2);
    easel.fillRect(x - Math.floor(num_fronds / 6) * size, y + size * 0, size * (2 * num_fronds - 3), size * 1);
    easel.fillRect(x - (Math.floor(num_fronds / 6) - 1) * size, y + size * 1, size * (2 * num_fronds - 5), size * 1);

    for(let i = 0; i < num_fronds; i++){
        let mod = Math.floor((i + 1) / 2) * size * (i % 2 == 0 ? 1 : -1) * 2 + (Math.floor(num_fronds / 2) * size);
        simple_cross(easel, x + mod, y - size * 4, color_one, size);
    }
}

export function draw_petal_imprint(easel, x, y, color, size){
    easel.fillStyle = format_rgb_color_string_arr(color);
    easel.fillRect(x, y + 2 * size, 2 * size, 2 * size);
    easel.fillRect(x + 1 * size, y + 3 * size, 2 * size, 2 * size);

    easel.fillRect(x + 3 * size, y + 1 * size, 3 * size, 2 * size);
    easel.fillRect(x + 4 * size, y, 1 * size, 4 * size);
    
    easel.fillRect(x + 7 * size, y + 2 * size, 2 * size, 2 * size);
    easel.fillRect(x + 6 * size, y + 3 * size, 2 * size, 2 * size);
}

/**
 * Function that draws a fossilized footprint design; color is the main imprint color,
 * accent is used for adding texture/depth to the appearance, and texture is for general
 * decorating to add visual appeal.
 * 
 */

export function draw_footprint_imprint(easel, x, y, color, accent, texture, size){
    easel.fillStyle = format_rgb_color_string_arr(color);
    easel.fillRect(x + 1 * size, y + 1 * size, 1 * size, 1 * size);
    easel.fillRect(x + 2 * size, y + 2 * size, 2 * size, 2 * size);

    easel.fillRect(x + 0 * size, y + 4 * size, 1 * size, 1 * size);
    easel.fillRect(x + 1 * size, y + 5 * size, 2 * size, 2 * size);

    easel.fillRect(x + 4 * size, y + 0 * size, 1 * size, 1 * size);
    easel.fillRect(x + 5 * size, y + 1 * size, 2 * size, 2 * size);

    easel.fillRect(x + 5 * size, y + 4 * size, 3 * size, 2 * size);
    easel.fillRect(x + 4 * size, y + 5 * size, 2 * size, 3 * size);
    easel.fillRect(x + 6 * size, y + 6 * size, 1 * size, 1 * size);

    easel.fillRect(x + 7 * size, y + 7 * size, 2 * size, 1 * size);
    easel.fillRect(x + 6 * size, y + 8 * size, 2 * size, 1 * size);
    easel.fillRect(x + 8 * size, y + 6 * size, 1 * size, 1 * size);



    easel.fillStyle = format_rgb_color_string_arr(accent);
    easel.fillRect(x + 2 * size, y + 3 * size, 1 * size, 1 * size);
    easel.fillRect(x + 1 * size, y + 6 * size, 1 * size, 1 * size);
    easel.fillRect(x + 5 * size, y + 2 * size, 1 * size, 1 * size);

    easel.fillRect(x + 4 * size, y + 7 * size, 2 * size, 1 * size);
    easel.fillRect(x + 4 * size, y + 6 * size, 1 * size, 1 * size);

    easel.fillRect(x + 6 * size, y + 8 * size, 2 * size, 1 * size);

    easel.fillStyle = format_rgb_color_string_arr(texture);
    easel.fillRect(x + 6 * size, y - 1 * size, 2 * size, 1 * size);
    easel.fillRect(x + 8 * size, y + 0 * size, 1 * size, 1 * size);

    easel.fillRect(x + 10 * size, y + 4 * size, 1 * size, 1 * size);
    easel.fillRect(x + 9 * size, y + 2 * size, 1 * size, 2 * size);

    easel.fillRect(x + 0 * size, y + 1 * size, 1 * size, 1 * size);
    easel.fillRect(x + -1 * size, y + 2 * size, 1 * size, 2 * size);

    easel.fillRect(x + 2 * size, y + 8 * size, 1 * size, 1 * size);
    easel.fillRect(x + 3 * size, y + 9 * size, 2 * size, 1 * size);

    easel.fillRect(x + 10 * size, y + 7 * size, 1 * size, 2 * size);
    easel.fillRect(x + 9 * size, y + 9 * size, 1 * size, 1 * size);

    easel.fillRect(x + 1 * size, y - 1 * size, 1 * size, 1 * size);
    easel.fillRect(x + 2 * size, y + -2 * size, 2 * size, 1 * size);
}

//---  Simple General Shapes   ----------------------------------------------------------------

export function draw_blot(easel, x, y, color, blot_size, block_size){
    easel.fillStyle = format_rgb_color_string_arr(color);
    for(let i = 1; i < blot_size - 1; i++){
        for(let j = 0; j < blot_size; j++){
            easel.fillRect(x + block_size * (i - 1), y + block_size * (j - 1), block_size, block_size);
        }
    }
    for(let i = 0; i < blot_size; i++){
        for(let j = 1; j < blot_size - 1; j++){
            easel.fillRect(x + block_size * (i - 1), y + block_size * (j - 1), block_size, block_size);
        }
    }
}

export function draw_cross(easel, x, y, color, size){
    easel.fillStyle = format_rgb_color_string_arr(color);
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(i % 2 != 0 || j % 2 != 0){
                easel.fillRect(x + size * (i - 1), y + size * (j - 1), size, size);
            }
        }
    }
}

export function simple_cross(easel, x, y, color, size){
    easel.fillStyle = format_rgb_color_string_arr(color);
    easel.fillRect(x, y + size, size, size);
    easel.fillRect(x + size, y, size, size);
    easel.fillRect(x + 2 * size, y + size, size, size);
    easel.fillRect(x + size, y + 2 * size, size, size);
}
