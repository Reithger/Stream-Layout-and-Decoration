# Stream-Layout-Decorations
 Repository of the code I've written for stream effects, either decorative or for visual formatting purposes

 These are intended to be run via the local-file Browser Source option in OBS (point it at the HTML file with the .js file in the same repo) and will infer their own size from the OBS element to format appropriately.

 Just download the Borders folder from this repository and point an OB Browser Source at the border.html file, then configure the Custom CSS field as shown in the screenshot in **Border/Backing Types and their Keywords for Border.html**.

 'border.js' also exports a function 'draw_border' that takes any HTML Canvas and two keyword strings, so you can import the behavior of this project into other contexts than just OBS Browser Sources.

 The Raindrop program would just require downloading the raindrop.html and raindrop.js files, put them in the same place, point a browser source at raindrop.html, and then watch the color droplets spread!

## Border/Backing Types and their Keywords for Border.html

 You can hot-swap between the borders and backgrounds for each border by hijacking the 'font-family' and 'content' fields in the Custom CSS entry in the Properties of the Browser Source element.
 
<img width="713" height="299" alt="image" src="https://github.com/user-attachments/assets/be0170ef-4b54-4061-a6c1-8acbfbda4de8" />

 Your options for borders (font-family) are:
 - rainbow-tour
 - rainbow-pulse
 - runescape
 - lego
 - votv
 - dark
 - pokeball

 Your options for backings (content) are:
 - runescape
 - rainbow (flag)
 - trans (flag)
 - transbian (flag, mislabeled)
 - lego
 - lego_g
 - lego_r
 - lego_c
 - lego_b
 - lego_br
 - votv (voices of the void)
 - dark (dark souls 2)
 - poke_grass (pokemon grass pokebox decal)
 - poke_arcade
 - poke_snow
 - poke_foot
 - poke_seafloor
 - poke_beach
 - poke_lava

 The specific implementations of these are in a variety of JS files that are linked to in border.js, which border.html references. You need to have all of those in the same place for it to work.

 Run the file "ListBorderTypes.js" in the terminal to see an internally managed and (ideally) up to date list of available keywords.

 More are likely to be added as time goes on and I get more ideas!

## Examples

 Example of border.html being used to design a video thumbnail

 <img width="1920" height="1080" alt="Screenshot 2025-08-23 12-08-37" src="https://github.com/user-attachments/assets/ffcf0558-0d20-451f-9840-f708b87deb41" />

 Example of border.html being used to do a display in OBS with newer themed backgrounds and my cat

 <img width="1920" height="1080" alt="Screenshot 2025-08-24 09-09-44" src="https://github.com/user-attachments/assets/d6980775-c762-49e7-a7db-59191d170859" />

 Example of Border.html being used to do a display in OBS around the space a GBA emulator would go, with Pokemon themed borders.

 <img width="1105" height="627" alt="image" src="https://github.com/user-attachments/assets/adfd80de-8b8a-4610-a1cd-4bb4c76af8cc" />

 Example of Border.html being used to make a test formatting of a stream layout in the slow color update (a single point moves around the perimeter and updates the color of its current spot for a rainbow shifting vibe)

 ![image](https://github.com/user-attachments/assets/eb969fde-082e-44d9-bb9c-7c241e0d5a22)
