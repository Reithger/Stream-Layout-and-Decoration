import {lego_stuff} from "./BorderLego.js";
import {flag_stuff} from "./BorderFlag.js";
import {runescape_stuff} from "./BorderRunescape.js";
import {votv_stuff} from "./BorderVotV.js";
import {color_shift_stuff} from "./BorderColorShift.js";
import {dark_stuff} from "./BorderDarkSouls.js";
import {pokemon_stuff} from "./BorderPokemon.js";
import {halloween_stuff} from "./BorderHalloween.js";
import {astral_stuff} from "./BorderAstral.js";
import {christmas_stuff} from "./BorderChristmas.js";

/* counter tracks how many times the draw command has been called, used for animating*/
let counter = 0

/* Each is a function returning an object containing key values "backing", "borders", "keyword_back", "keyword_border"*/
//let border_designs = [pokemon_stuff];
let border_designs = [christmas_stuff, astral_stuff, lego_stuff, flag_stuff, runescape_stuff, votv_stuff, color_shift_stuff, dark_stuff, pokemon_stuff, halloween_stuff];

/* Calls the stream_border_draw function 30 times a second*/
try{
    setInterval(stream_border_draw, 1000 / 30);
}
catch(err){
    console.log(err);
}

/**
 * Function called periodically to display a variety of borders and backings
 * drawn onto an HTML canvas for decorative purposes.
 * 
 * Retrieves the canvas object (assumed to have the id value "canvas") from
 * the HTML document, retrieves keywords associated to the otherwise unused
 * attributes 'font-family' and 'content' in the main css style sheet which
 * denote which backing and border designs to use.
 * 
 * Note: this has been designed in the context of the OBS Browser Source tool
 * pointed at a local .html file that refers to this folder of .js files. That
 * tool provides a simple accessor to the CSS sheet for modifying the two
 * relevant attributes to 'hot-swap' designs easily.
 * 
 * This code was separated so that there is an interpretation function which takes
 * a canvas HTML object and the two relevant keywords. That function is exported
 * so you can import it into any context so long as you have that HTML canvas.
 * 
 * stream_border_draw is used in the context of OBS Browser Sources and calls on
 * the draw_border function.
 * 
 * Note: To add new designs to this project:
 *  - Make a new .js file
 *  - Export a function that returns an object with four 'key : value' pairs with
 *      the keys "borders", "backing", "keyword_back", "keyword_border"; each of
 *      these should map to a function.
 *      - The "borders" function should take the arguments: 
 *              (easel, canvas, wid, hei, size, counter, keyword)
 *              (2D Context, HTML Canvas, int, int, int, int, String) in which:
 *          The 'keyword' string should denote which drawing operation to perform
 *          The 'counter' int denotes how many drawing operations have occured for animating
 *              something over time
 *          The 'size' int indicates how large things should be drawn (a scaling factor for
 *              what is drawn that still needs to fit into the same width/height)
 *      - The "backing" function should take the same arguments as the "borders" function,
 *          in which it uses the 'keyword' string to decide which drawing operation to
 *          perform for a visual backdrop using the provided arguments.
 *      - The 'keyword_back' function should return a list of Strings, these being the keywords
 *          that your "backing" function can match to
 *      - The "keyword_border" function should return a list of Strings, these being the keywords
 *          that your "borders" function can match to
 *  - Import that function to this file, and add it to the 'border_designs' list so that it can
 *      be integrated automatically into the workings of this file
 * 
 * TODO: Way to automatically check files in the same folder for exported functions that
 *  take the desired arguments so it's fully dynamic?
 * 
 */

function stream_border_draw(){
    let canvas = undefined;
    let type = undefined;
    try{
        canvas = document.getElementById("canvas")
        type = document.styleSheets[0].cssRules[0].style.getPropertyValue("font-family")
    }
    catch(err){
        //If a canvas is not found, or we can't access the CSS Sheet yet, just bail
        return;
    }

    let back_type = document.styleSheets[0].cssRules[0].style.getPropertyValue("content")
    back_type = back_type.slice(1, back_type.length - 1);
    let custom_size = undefined;

    try{
        let size = document.styleSheets[0].cssRules[0].style.getPropertyValue("font-size");
        if(size.length > 2){
            custom_size = parseInt(size.substring(0, size.length - 2), 10);
        }
    }
    catch(err){
        custom_size = undefined;
    }

    let wid = window.innerWidth
    let hei = window.innerHeight

    if(canvas.width != wid || canvas.height != hei){
        canvas.width = wid
        canvas.height = hei
    }
    draw_border(canvas, back_type, type, custom_size);

}

/**
 * This function takes an HTML canvas object and two strings; from this, it will
 * draw the corresponding border outline and background that match the provided
 * backing_type and border_type strings.
 * 
 * Just provide an HTML canvas and two valid strings, and this does the rest.
 * 
 * An example combo of valid strings would be "votv" or "dark" for both outline
 * and background, or "pokeball" for outline and "poke_beach" for background.
 * 
 * You can retrieve a list of valid keywords by calling the functions
 * 'retrieve_backing_keywords' and 'retrieve_border_keywords', or run the
 * file 'ListBorderTypes.js' in the terminal.
 * 
 * TODO: Fourth argument for denoting the SIZE value? May not always be stable.
 * 
 * @param {*} canvas an HTML canvas object you want to draw a border onto
 * @param {*} backing_type a String denoting the background design type
 * @param {*} border_type a String denoting the outline design type
 */

export function draw_border(canvas, backing_type, border_type, size){
    let easel = canvas.getContext("2d")

    easel.lineWidth = 1

    let wid = canvas.width;
    let hei = canvas.height;
    
    for(let i = 0; i < border_designs.length; i++){
        let backing = border_designs[i]()["backing"];
        if(backing != null && backing(easel, canvas, wid, hei, size, counter, backing_type)){
            break;
        }
    }

    for(let i = 0; i < border_designs.length; i++){
        let border = border_designs[i]()["borders"];
        if(border != null && border(easel, canvas, wid, hei, 2, counter, border_type)){
            break;
        }
    }

    counter += 1;
}

/**
 * Retrieval function to obtain an array containing arrays of valid keywords which
 * correspond to drawing designs of backgrounds.
 * 
 * Any of these keywords returned by this function will cause a full background to
 * be drawn in the canvas provided to 'draw_border'.
 * 
 * This relies on proper inclusion of new keywords into the internal system for
 * tracking these.
 * 
 * --- HOW TO INCLUDE NEW KEYWORDS INTO THIS SYSTEM ---
 * 
 * Each themed design file ('BorderLego.js' for example) should export a 'keywords_back'
 * and 'keywords_border' function (if relevant) that contains all valid keywords for
 * backgrounds and borders.
 * 
 * Import those functions to 'border.js' (relabel via 'as ___') and include them in the
 * keywords_back_list and keywords_border_list lists.
 * 
 * @returns 
 * 
 */

export function retrieve_backing_keywords(){
    let out = [];
    for(let i = 0; i < border_designs.length; i++){
        let loc = border_designs[i]()["keyword_back"];
        if(loc != null && loc != undefined){
            out = out.concat([loc()]);
        }
    }
    return out;
}

/** 
 * Retrieval function to obtain an array containing arrays of valid keywords which
 * correspond to drawing designs of borders.
 * 
 * This relies on proper inclusion of new keywords into the internal system for
 * tracking these.
 * 
 * Any of these keywords returned by this function will cause a border to
 * be drawn in the canvas provided to 'draw_border'.
 * 
 * @returns 
 */

export function retrieve_border_keywords(){
    let out = [];
    for(let i = 0; i < border_designs.length; i++){        
        let loc = border_designs[i]()["keyword_border"];
        if(loc != null && loc != undefined){
            out = out.concat([loc()]);
        }
    }
    return out;
}

/**
 * Support function that uses the local access to the document to create a secondary canvas object
 * that is not added to the DOM; it is used for getting an offscreen canvas that backgrounds can
 * copy themselves onto so that on subsequent redraws it can just copy from this offscreen canvas.
 * 
 * Returns an HTML canvas object with the specified width and height
 * 
 * @param {*} wid 
 * @param {*} hei 
 * @returns 
 */

export function produce_canvas(wid, hei){
    let canvas = document.createElement("canvas");
    canvas.width = wid;
    canvas.height = hei;
    return canvas;
}

//---  Border Draw Types   --------------------------------------------------------------------

    //-- Draw Manual Style Pattern Repeated  ------------------

/**
 * 
 * Given the color_block and corner_block 2D arrays, draws a repeating pattern along the border of the specified space
 * and uses corner_block to draw a special corner embellishment if corner_block has contents (should not be undefined, we
 * check for length = 0)
 * 
 * This function is expected to be imported to relevant sub-files that want to draw a repeating pattern along the border.
 * 
 * @param {*} canvas 
 * @param {*} easel 
 * @param {*} color_block 
 * @param {*} corner_block 
 * @param {*} wid 
 * @param {*} hei 
 * @param {*} size 
 * @param {*} asymm 
 * @returns 
 */


export function draw_pattern_edge(canvas, easel, color_block, corner_block, wid, hei, size, asymm = true){

    if(color_block.length == 0){
        console.err("Attempt to call draw_pattern_edge without any color_block pattern defined (the 2d array of the pattern copied to draw the edge)");
        return;
    }

    let corner_displacement = size * color_block.length;
    if(corner_block.length == 0){
        corner_displacement = 0;
    }
    
    let block_hei = color_block.length * size
    let block_wid = (color_block[0].length) * size
    block_wid = block_wid < 1 ? 1 : block_wid;
    // Draws the initial segment of the edge pattern for each edge of the enclosed space
    // If I could just rotate a referenced segment of the canvas, I wouldn't have to do this four times, but it's not costly so oh well

    let horiz_edge_buffer = block_wid * 2 < (wid - corner_displacement * 2) ? block_wid : 0;
    let vert_edge_buffer = block_wid * 2 < (hei - corner_displacement * 2) ? block_wid : 0;

    for(let i = 0; i < color_block.length; i++){
        for(let j = 0; j < color_block[i].length; j++){
            if(color_block[i][j] == undefined){
                continue;
            }
            easel.fillStyle = color_block[i][j]
            // Top Row
            easel.fillRect(horiz_edge_buffer + corner_displacement + j * size, i * size, size, size)
            // Left Column
            easel.fillRect(i * size, hei - (j + 1) * size - vert_edge_buffer - corner_displacement, size, size)
            
            // This was originally set to skip the last index for a lighting effect; if you want that back, draw a highlight pixel there not nothing (captures background and repeats that pattern)
            // For the outer-edge of the pattern to be the visual separation for the border, we draw it backwards for the right and bottom sides
            easel.fillStyle = asymm ? color_block[color_block.length - 1 - i][j] : color_block[i][j];
            // Right Column
            easel.fillRect(wid - i * size - size, vert_edge_buffer + corner_displacement + j * size, size, size)
            // Bottom Row
            easel.fillRect(wid - (j + 1) * size - horiz_edge_buffer - corner_displacement, hei - i * size - size, size, size)
        
        }
    }
    // Draws the top and bottom horizontal sections by copying the template image drawn in by the above code
    for(let i = 0; i < (wid - 2 * corner_displacement) / block_wid + 1; i += 1){
        // References its own canvas to copy the template pattern along the row
        // Top Row
        
        let x_ref = corner_displacement + horiz_edge_buffer;
        let y_ref = 0;
        let x_tar = i * block_wid + corner_displacement;
        let y_tar = 0;
        easel.drawImage(canvas, x_ref, y_ref, block_wid, block_hei, x_tar, y_tar, block_wid, block_hei)
        // Bottom Row
        x_ref =  wid - corner_displacement - block_wid - horiz_edge_buffer;
        y_ref = hei - block_hei;
        x_tar = wid - i * block_wid - corner_displacement;
        y_tar = hei - block_hei;
        easel.drawImage(canvas, x_ref, y_ref, block_wid, block_hei, x_tar, y_tar, block_wid, block_hei)
    }
    // Draws the left and right vertical sections by copying the template image drawn in by the above above code
    for(let i = 0; i < (hei - 2 * corner_displacement) / block_wid + 1; i += 1){
        // References its own canvas to copy the template pattern along the row
        // Right Column
        let x_ref = wid - block_hei;
        let y_ref = corner_displacement + vert_edge_buffer;
        let x_tar = wid - block_hei;
        let y_tar = i * block_wid + corner_displacement;
        easel.drawImage(canvas, x_ref, y_ref, block_hei, block_wid, x_tar,y_tar, block_hei, block_wid)
        // Left Column
        x_ref = 0;
        y_ref = hei - corner_displacement - block_wid - vert_edge_buffer;
        x_tar = 0;
        y_tar = hei - (i + 1) * block_wid - corner_displacement
        easel.drawImage(canvas, x_ref, y_ref, block_hei, block_wid, x_tar, y_tar, block_hei, block_wid)
    }

    size = (block_hei % corner_block.length == 0 && corner_block.length != 0) ? Math.floor(block_hei / corner_block.length) : size;

    draw_pattern_corners(canvas, easel, corner_block, wid, hei, size);
}

export function draw_pattern_edge_sides(canvas, easel, color_block, corner_block, wid, hei, size, asymm = true){
    if(color_block.length == 0){
        console.log("Attempt to call draw_pattern_edge without any color_block pattern defined (the 2d array of the pattern copied to draw the edge)");
        return;
    }

    let corner_displacement = size * color_block.length;
    if(corner_block.length == 0){
        corner_displacement = 0;
    }
    
    let block_hei = color_block.length * size
    let block_wid = (color_block[0].length) * size
    // Draws the initial segment of the edge pattern for each edge of the enclosed space
    // If I could just rotate a referenced segment of the canvas, I wouldn't have to do this four times, but it's not costly so oh well

    let horiz_edge_buffer = block_wid * 2 < (wid - corner_displacement * 2) ? block_wid : 0;
    let vert_edge_buffer = block_wid * 2 < (hei - corner_displacement * 2) ? block_wid : 0;

    for(let i = 0; i < color_block.length; i++){
        for(let j = 0; j < color_block[i].length; j++){
            easel.fillStyle = color_block[i][j]
            // Left Column
            easel.fillRect(i * size, hei - (j + 1) * size - vert_edge_buffer - corner_displacement, size, size)
            
            // This was originally set to skip the last index for a lighting effect; if you want that back, draw a highlight pixel there not nothing (captures background and repeats that pattern)
            // For the outer-edge of the pattern to be the visual separation for the border, we draw it backwards for the right and bottom sides
            easel.fillStyle = asymm ? color_block[color_block.length - 1 - i][j] : color_block[i][j];
            // Right Column
            easel.fillRect(wid - i * size - size, vert_edge_buffer + corner_displacement + j * size, size, size)
        
        }
    }
    // Draws the left and right vertical sections by copying the template image drawn in by the above above code
    for(let i = 0; i < (hei - 2 * corner_displacement) / block_wid + 1; i += 1){
        // References its own canvas to copy the template pattern along the row
        // Right Column
        let x_ref = wid - block_hei;
        let y_ref = corner_displacement + vert_edge_buffer;
        let x_tar = wid - block_hei;
        let y_tar = i * block_wid + corner_displacement;
        easel.drawImage(canvas, x_ref, y_ref, block_hei, block_wid, x_tar,y_tar, block_hei, block_wid)
        // Left Column
        x_ref = 0;
        y_ref = hei - corner_displacement - block_wid - vert_edge_buffer;
        x_tar = 0;
        y_tar = hei - (i + 1) * block_wid - corner_displacement
        easel.drawImage(canvas, x_ref, y_ref, block_hei, block_wid, x_tar, y_tar, block_hei, block_wid)
    }
}

export function draw_pattern_edge_top_bottom(canvas, easel, color_block, corner_block, wid, hei, size, asymm = true){
    if(color_block.length == 0){
        console.log("Attempt to call draw_pattern_edge without any color_block pattern defined (the 2d array of the pattern copied to draw the edge)");
        return;
    }

    let corner_displacement = size * color_block.length;
    if(corner_block.length == 0){
        corner_displacement = 0;
    }
    
    let block_hei = color_block.length * size
    let block_wid = (color_block[0].length) * size
    // Draws the initial segment of the edge pattern for each edge of the enclosed space
    // If I could just rotate a referenced segment of the canvas, I wouldn't have to do this four times, but it's not costly so oh well

    let horiz_edge_buffer = block_wid * 2 < (wid - corner_displacement * 2) ? block_wid : 0;
    let vert_edge_buffer = block_wid * 2 < (hei - corner_displacement * 2) ? block_wid : 0;

    for(let i = 0; i < color_block.length; i++){
        for(let j = 0; j < color_block[i].length; j++){
            easel.fillStyle = color_block[i][j]
            // Top Row
            easel.fillRect(horiz_edge_buffer + corner_displacement + j * size, i * size, size, size)

            // This was originally set to skip the last index for a lighting effect; if you want that back, draw a highlight pixel there not nothing (captures background and repeats that pattern)
            // For the outer-edge of the pattern to be the visual separation for the border, we draw it backwards for the right and bottom sides
            easel.fillStyle = asymm ? color_block[color_block.length - 1 - i][j] : color_block[i][j];
            // Bottom Row
            easel.fillRect(wid - (j + 1) * size - horiz_edge_buffer - corner_displacement, hei - i * size - size, size, size)
        
        }
    }
    // Draws the top and bottom horizontal sections by copying the template image drawn in by the above code
    for(let i = 0; i < (wid - 2 * corner_displacement) / block_wid + 1; i += 1){
        // References its own canvas to copy the template pattern along the row
        // Top Row
        let x_ref = corner_displacement + horiz_edge_buffer;
        let y_ref = 0;
        let x_tar = i * block_wid + corner_displacement;
        let y_tar = 0;
        easel.drawImage(canvas, x_ref, y_ref, block_wid, block_hei, x_tar, y_tar, block_wid, block_hei)
        // Bottom Row
        x_ref =  wid - corner_displacement - block_wid - horiz_edge_buffer;
        y_ref = hei - block_hei;
        x_tar = wid - (i) * block_wid - corner_displacement;
        y_tar = hei - block_hei;
        easel.drawImage(canvas, x_ref, y_ref, block_wid, block_hei, x_tar, y_tar, block_wid, block_hei)
    }
}

export function draw_pattern_corners(canvas, easel, corner_block, wid, hei, size){
    if(corner_block.length != 0){
        // Draws the contents of corner_block to each of the four corners of the border, appropriately rotated for each
        for(let i = 0; i < corner_block.length; i++){
            for(let j = 0; j < corner_block[i].length; j++){
                easel.fillStyle = corner_block[i][j];
                if(corner_block[i][j] == undefined){
                    // Top Left
                    easel.clearRect(j * size, i * size, size, size);
                    // Top Right
                    easel.clearRect(wid - i * size - size, j * size, size, size);
                    // Bottom Right
                    easel.clearRect(wid - j * size - size, hei - i * size - size, size, size)
                    // Bottom Left
                    easel.clearRect(i * size, hei - j * size - size, size, size)
                }
                else{
                    // Top Left
                    easel.fillRect(j * size, i * size, size, size);
                    // Top Right
                    easel.fillRect(wid - i * size - size, j * size, size, size);
                    // Bottom Right
                    easel.fillRect(wid - j * size - size, hei - i * size - size, size, size)
                    // Bottom Left
                    easel.fillRect(i * size, hei - j * size - size, size, size)
                }
            }
            
        }
    }
}

//---  Support Methods   ----------------------------------------------------------------------


export function lighten(color_arr){
    let out = [color_arr[0], color_arr[1], color_arr[2]];
    for(let i = 0; i < out.length; i++){
        let add = out[i] * .25;
        out[i] = out[i] + ((add == 0) ? 30 : add);
    }
    return out;
}

export function lighten_prop(color_arr, amount){
    let out = [color_arr[0], color_arr[1], color_arr[2]];
    for(let i = 0; i < out.length; i++){
        let add = out[i] * amount;
        out[i] = out[i] + ((add == 0) ? 30 : add);
    }
    return out;
}

export function darken(color_arr){
    let out = [color_arr[0], color_arr[1], color_arr[2]];
    for(let i = 0; i < out.length; i++){
        let add = out[i] * .25;
        out[i] = out[i] - ((add == 0) ? 0 : add);
    }
    return out;
}
export function darken_prop(color_arr, amount){
    let out = [color_arr[0], color_arr[1], color_arr[2]];
    for(let i = 0; i < out.length; i++){
        let add = out[i] * amount;
        out[i] = out[i] - ((add == 0) ? 0 : add);
    }
    return out;
}

export function fade_prop(color_arr, amount){  
    let transp = color_arr.length == 3 ? 0 : color_arr[3];
    let out = [color_arr[0], color_arr[1], color_arr[2], transp * amount + 1 * (1 - amount)];
    return out;
}

function bounds(col){
    return col < 0 ? 0 : col > 255 ? 255 : col;
}
 
export function format_rgb_color_string(col_r, col_g, col_b, alpha="1"){
    return "rgb(" + bounds(col_r) + ", " + bounds(col_g) + ", " + bounds(col_b) + ", " +  bounds(alpha) + ")"
}
 
export function format_rgb_color_string_arr(color_array){
    return format_rgb_color_string(color_array[0], color_array[1], color_array[2], color_array.length == 4 ? color_array[3] : 1);
}
