import {retrieve_backing_keywords, retrieve_border_keywords} from "./border.js";

/**
 * Run this file in the terminal to get a list
 * 
 */

console.log("\n--- Valid Background Keywords ---\n");
console.log(retrieve_backing_keywords());

console.log("\n--- Valid Border Keywords ---\n");
console.log(retrieve_border_keywords());

process.exit()