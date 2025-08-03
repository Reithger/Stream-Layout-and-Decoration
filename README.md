# Stream-Layout-Decorations
 Repository of the code I've written for stream effects, either decorative or for visual formatting purposes

 These are intended to be run via the local-file Browser Source option in OBS (point it at the HTML file with the .js file in the same repo) and will infer their own size from the OBS element to format appropriately.

<img width="709" height="639" alt="image" src="https://github.com/user-attachments/assets/d87652cb-86dd-4b62-8dab-b02f30f3ee5c" />

 You can hot-swap between the borders and backgrounds for each border by hijacking the 'font-family' and 'content' fields in the Custom CSS entry in the Properties of the Browser Source element.

 Your options for borders (font-family) are:
 - rainbow-tour
 - rainbow-pulse
 - runescape
 - lego
 - votv (voices of the void)
 - dark (dark souls 2)
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

 The specific implementations of these are in a variety of JS files that are linked to in border.js, which border.html references. You need to have all of those in the same place for it to work.

 More are likely to be added as time goes on and I get more ideas!

 Example of Border.html being used to do a display in OBS around the space a GBA emulator would go, with Pokemon themed borders.

 <img width="1105" height="627" alt="image" src="https://github.com/user-attachments/assets/adfd80de-8b8a-4610-a1cd-4bb4c76af8cc" />

 Example of Border.html being used to make a test formatting of a stream layout in the slow color update (a single point moves around the perimeter and updates the color of its current spot for a rainbow shifting vibe)

 ![image](https://github.com/user-attachments/assets/eb969fde-082e-44d9-bb9c-7c241e0d5a22)
