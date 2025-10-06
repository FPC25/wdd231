// Import the DateManager module from the specified file
import { DateManager } from "./modules/DateManager.mjs";

// Import the MenuManager module from the specified file
import { MenuManager } from "./modules/MenuManager.mjs";

// Add an event listener to the document that triggers when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create a new instance of MenuManager to manage menu-related functionality
    new MenuManager();
    
    // Create a new instance of DateManager to manage date-related functionality
    new DateManager();
});