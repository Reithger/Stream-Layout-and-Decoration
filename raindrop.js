
//Instance variables relied on by the code below
let counter = 0;        //Current iteration we're on for counting out how long to wait to do things
let wid                 //Canvas width
let hei                 //Canvas height
let size                //Size of each block that gets drawn (usually set to 1)
let easel               //2dContext object that lets us draw to the canvas
let queue = {           //Object containing queues that, by index, synchronize to the same instruction
  color_r : [],         //  Store the rgb of the color to draw for this instruction
  color_g : [],         
  color_b : [],
  iteration : [],       //  Current iteration count (how far from origin drop we are in drawing)
  iteration_cap: [],    //  Maximum iterations to draw this instruction for before stopping
  x : [],               //  Origin x, y position to spread from in drawing
  y : []
}

//Constant values I define to control specific behaviors of the art effect
let iteration_limit = 96.0      //  Base value of circle size that gets drawn
let iteration_variance = 64;    //  Degree of variance from base value
let speed = 75                 //  In ms, how quickly new iterations get called
let new_color_rate = 23;        //  Number of iteration calls to make before adding a new color drop
let darken_rate = 11;            //  Number of iteration calls to make before darkening the screen a lil
let darken_amount = .1;        //  On scale 0-1, alpha value of black color to overlay in darkening
let block_size = 2            //  Not used, was for calculating size based on canvas wid/hei



// Sets up the initial canvas background and some default values we need for later
function setCanvas(name, doc){
  canvas = doc.getElementById(name);
  easel = canvas.getContext("2d");

  wid = canvas.width
  hei = canvas.height
  easel.fillStyle = "black"
  easel.lineWidth=4
  easel.fillRect(0, 0, wid, hei)
  smaller = wid
  if(hei < wid){
    smaller = hei
  }
  size = block_size //Sets the width/height of each block that gets drawn. If 1, then just each pixel.
}

// The function that is called each 'tick' this is processed
// Calls on the queue of drawing instructions to draw each, push the new version for next cycle,
//  and delete the instruction once completed. (No new version if at the end of that instruction's lifespan)
// Calls setCanvas on first iteration, adds new initial drawing instructions ('color drops') every
//  'new_color_rate' iterations for a new color droplet spread
// Basically just change the 'name' parameter to the id of the canvas object you want to draw this
function iterateProcessing(name, doc){
  //First time we run, initialize canvas
  if(counter == 0){
    setCanvas(name, doc)
  }
  //Every new_color_rate iterations, add a new color drop to the instructions
  if(counter % new_color_rate == 0){
    addColorDrop(name, doc);
  }
  //Apply a slight darkening effect on the entire canvas every darken_rate iterations
  //  This helps the colors continue to fade over time
  if(counter % darken_rate == 0){
    easel.fillStyle = "rgb(0, 0, 0, " + darken_amount + ")"
    easel.fillRect(0, 0, wid, hei)
  }
  counter += 1;
  
  instructions_length = queue.x.length
  
  //For each instruction in our queue currently:
  for(let i = 0; i < instructions_length; i++){
    //  Pull relevant data from the queue values
    loc_iteration = queue.iteration[i]
    loc_iteration_cap = queue.iteration_cap[i]
    root_x = queue.x[i]
    root_y = queue.y[i]
    
    //  Lists to hold the coordinates we are going to draw in this round
    local_queue_x = []
    local_queue_y = []
    
    //  Trivial case of just drawing the origin point; hard-coded solution instead of being clever
    if(loc_iteration == 1){
      local_queue_x.push(root_x)
      local_queue_y.push(root_y)
    }
    
    //  Lists to hold the coordinates we are going to retroactively darken in this round
    darken_queue_x = []
    darken_queue_y = []

    //  Calculates the coordinates of a large square around our origin point
    //  Then does the quadratic formula for distance to decide which points are at the outer ring of circle
    //  Also decides which points are inside the circle for darkening
    for(let k = -1 * (loc_iteration + 1); k <= loc_iteration + 1; k++){
      for(let m = -1 * (loc_iteration + 1); m <= loc_iteration + 1; m++){
        new_x = root_x + k
        new_y = root_y + m
        dist = Math.sqrt(Math.pow(k, 2) + Math.pow(m, 2))
        //  Just ensures that the distance is within the appropriate range to be the outside ring squares
        if(dist <= loc_iteration + 1 && dist >= loc_iteration){
            local_queue_x.push(new_x)
            local_queue_y.push(new_y)
        }
        if(dist < loc_iteration){
          darken_queue_x.push(new_x)
          darken_queue_y.push(new_y)
        }
      }
    }
    r = queue.color_r[i]
    g = queue.color_g[i]
    b = queue.color_b[i]
    
    //  Using the string format for rgb as needed by html/css
    //  The alpha value is to slowly fade the color out over time so the drawing stopping isn't jarring
    easel.fillStyle = format_rgb_color_string(r, g, b, (1.0 - (loc_iteration / (loc_iteration_cap - 1))))

    //  Draws the outer ring of squares we calculated earlier
    for(let j = 0; j < local_queue_x.length; j++){
      draw_x = local_queue_x[j]
      draw_y = local_queue_y[j]
      easel.fillRect(draw_x * size - size / 2, draw_y * size - size / 2, size + 1, size + 1)
    }
    
    //  Sets the color for internal darkening by black with an alpha value, then draws inner squares
    easel.fillStyle = "rgb(0, 0, 0, " + (1.0 / (loc_iteration_cap - iteration_limit)) + ")"
    for(let j = 0; j < darken_queue_x.length; j++){
      draw_x = darken_queue_x[j]
      draw_y = darken_queue_y[j]
      easel.fillRect(draw_x * size - size / 2, draw_y * size - size / 2, size + 1, size + 1)
    }
    
    //Pushes new instructions (old instructions with iterated iteration value)
    if(loc_iteration < loc_iteration_cap){
      push_to_queue(r, g, b, loc_iteration + 1.0, loc_iteration_cap, root_x, root_y)
    }
  }
  
  //Deletes old instructions that were processed this round
  if(instructions_length > 0){
    delete_queue_head(instructions_length)
  }
}

function format_rgb_color_string(color_r, color_g, color_b, alpha="1"){
  return "rgb(" + color_r + ", " + color_g + ", " + color_b + ", " +  alpha + ")"
}

//Uses supplied arguments to push a new drawing instruction to the queue
function push_to_queue(color_r, color_g, color_b, curr_iteration, iteration_max, x_coord, y_coord){
      queue.color_r.push(color_r)
      queue.color_g.push(color_g)
      queue.color_b.push(color_b)
      queue.iteration.push(curr_iteration + 1.0)
      queue.iteration_cap.push(iteration_max)
      queue.x.push(x_coord)
      queue.y.push(y_coord)
}

//Removes the first 'delete_length' items from each list in our queue of instructions
function delete_queue_head(delete_length){
    queue.color_r = queue.color_r.slice(delete_length)
    queue.color_g = queue.color_g.slice(delete_length)
    queue.color_b = queue.color_b.slice(delete_length)
    queue.iteration = queue.iteration.slice(delete_length)
    queue.x = queue.x.slice(delete_length)
    queue.y = queue.y.slice(delete_length)
    queue.iteration_cap = queue.iteration_cap.slice(delete_length)
}

//Creates data for the initial instruction of drawing a color drop ring
//  Organized randomness
function addColorDrop(name, doc){
  if(counter == 0){
    return;
  }
  
  // If size is non-0, discerns how many squares we have vertically and horizontally
  blocks_across = wid / size
  blocks_up = hei / size
  
  block_x = Math.floor(Math.random() * blocks_across)
  block_y = Math.floor(Math.random() * blocks_up)
  
  queue.color_r.push(Math.floor(Math.random() * 255))
  queue.color_g.push(Math.floor(Math.random() * 255))
  queue.color_b.push(Math.floor(Math.random() * 255))
  
  queue.x.push(block_x)
  queue.y.push(block_y)
  queue.iteration.push(1.0)
  queue.iteration_cap.push(Math.random() * iteration_variance + iteration_limit)
}

//This sets up our iterateProcessing function to be called every 'speed' milliseconds
//  Can add an argument after speed that is the id of your canvas object to specify where to draw on
window.setInterval(iterateProcessing, speed, "canvas", document)

//window.onload = adjustCanvas()
