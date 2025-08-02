import SUPABASE_CONFIG from '../config.js';

// Initialize Supabase client
const supabase = window.supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.publicKey
);

// Get project ID from subdomain or use default for testing
function getProjectId() {
    // Parse from subdomain (e.g., client-x.domain.com -> client-x)
    const subdomain = window.location.hostname.split('.')[0];
    
    // For local testing, return a default project ID
    return subdomain === 'localhost' ? 'client-x' : subdomain;
}

// Inject dynamic theme styles
function injectBrandColors(brandColors) {
    // Remove existing dynamic theme if present
    const existingTheme = document.getElementById('dynamic-theme');
    if (existingTheme) {
        existingTheme.remove();
    }

    // Create and inject new style tag
    const style = document.createElement('style');
    style.id = 'dynamic-theme';
    style.textContent = brandColors;
    document.head.appendChild(style);
}

// Main function to inject dynamic content
async function injectDynamicContent() {
    const projectId = getProjectId();
    
    try {
        // Fetch all content for this project from Supabase
        const { data, error } = await supabase
            .from('dynamic_content')
            .select('key, value')
            .eq('project_id', projectId);

        if (error) throw error;

        // Process each content item
        data.forEach(item => {
            // Handle brand colors separately
            if (item.key === 'brand-colors') {
                injectBrandColors(item.value);
                return;
            }

            // Find and update elements with matching data-key
            const elements = document.querySelectorAll(`[data-key="${item.key}"]`);
            elements.forEach(element => {
                element.innerHTML = item.value;
            });
        });

    } catch (error) {
        console.error('Error fetching dynamic content:', error);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', injectDynamicContent);
