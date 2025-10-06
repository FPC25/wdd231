// The DateManager class is responsible for managing and displaying date-related information on a webpage.
export class DateManager {
    constructor() {
        // Get references to the HTML elements where the current year and last modified date will be displayed.
        this.currentYearElement = document.getElementById('currentYear');
        this.lastModifiedElement = document.getElementById('lastModified');
        
        // Initialize the class by updating the current year and last modified date.
        this.init();
    }

    // Initializes the DateManager by calling methods to update the current year and last modified date.
    init() {
        this.updateCurrentYear();
        this.updateLastModified();
    }

    // Updates the text content of the currentYearElement with the current year.
    updateCurrentYear() {
        if (this.currentYearElement) {
            this.currentYearElement.textContent = new Date().getFullYear();
        }
    }

    // Updates the text content of the lastModifiedElement with the formatted last modified date of the document.
    updateLastModified() {
        if (this.lastModifiedElement) {
            // Get the last modified date of the document.
            const lastModified = new Date(document.lastModified);
            // Format the last modified date into a readable string.
            const formattedDate = this.formatDate(lastModified);
            // Update the element's text content with the formatted date.
            this.lastModifiedElement.textContent = `Last Updated: ${formattedDate}`;
        }
    }

    // Formats a given date object into a readable string with specific options.
    formatDate(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    }

    // Static method to get the current timestamp in milliseconds since the Unix epoch.
    static getCurrentTimestamp() {
        return Date.now();
    }

    // Static method to format a given timestamp into a readable date string.
    static formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleDateString('en-US');
    }
}