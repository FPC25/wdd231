import { DateManager } from "./modules/DateManager.mjs";
import { MenuManager } from "./modules/MenuManager.mjs";

document.addEventListener('DOMContentLoaded', function() {
    new MenuManager();
    new DateManager();
});