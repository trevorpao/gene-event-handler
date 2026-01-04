import './bootstrap';
import './validatr';
import './base';

// Set API URI and enable debugging
gee.apiUri = 'http://demo.aiocms.sense-info.co' + '/api';
gee.debug = 1;

// Set the subfolder for plugins
gee.subFolder = '../../app/scripts/plugins';

// Example: register a custom element via gee.customElem / hookTag
// This will replace <gee-hello></gee-hello> with a span greeting.
gee.customElem.register('gee-hello', () => '<span class="text-success">Hello from customElem!</span>');
// Equivalent legacy API: gee.hookTag('gee-hello', fn);

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Log the initialization process for debugging
        console.log('Initializing application...');

        // Perform initialization
        await gee.init();

        console.log('Application initialized successfully.');
    } catch (error) {
        // Handle initialization errors gracefully
        console.error('Error during initialization:', error);
        alert('An error occurred while initializing the application. Please try again later.');
    }
});
