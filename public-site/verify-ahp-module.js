/**
 * AHP Module Installation Verification Script
 * 
 * This script verifies that the AHP Module is properly installed on the page.
 * Copy and paste this entire script into your browser console to run the verification.
 */

(function verifyAHPModuleInstallation() {
    console.log('🔍 Starting AHP Module verification...');
    
    // Check 1: Verify script tag exists with correct attributes
    function checkScriptTag() {
        const scriptTags = document.querySelectorAll('script[src*="ahp-email-scheduler.vicsicard.workers.dev/module.js"]');
        
        if (scriptTags.length === 0) {
            console.error('❌ AHP Module script tag not found on the page');
            return false;
        }
        
        const scriptTag = scriptTags[0];
        console.log('✅ AHP Module script tag found');
        
        // Check data attributes
        const apiBase = scriptTag.getAttribute('data-api-base');
        if (!apiBase || !apiBase.includes('ahp-email-scheduler.vicsicard.workers.dev')) {
            console.warn('⚠️ data-api-base attribute is missing or incorrect');
        } else {
            console.log('✅ data-api-base attribute is correct');
        }
        
        return true;
    }
    
    // Check 2: Verify AHP global object exists
    function checkGlobalObject() {
        if (typeof window.AHPModule === 'undefined') {
            console.error('❌ AHP Module global object not found. Script may have failed to load or initialize');
            return false;
        }
        
        console.log('✅ AHP Module global object found');
        
        // Check essential methods
        const requiredMethods = ['isRegistered', 'showRegistrationModal', 'hideRegistrationModal', 'markAsRegistered'];
        const missingMethods = requiredMethods.filter(method => typeof window.AHPModule[method] !== 'function');
        
        if (missingMethods.length > 0) {
            console.warn(`⚠️ Some AHP Module methods are missing: ${missingMethods.join(', ')}`);
        } else {
            console.log('✅ All required AHP Module methods are present');
        }
        
        return true;
    }
    
    // Check 3: Verify registration status
    function checkRegistrationStatus() {
        if (typeof window.AHPModule === 'undefined' || typeof window.AHPModule.isRegistered !== 'function') {
            console.error('❌ Cannot check registration status - AHP Module not properly initialized');
            return false;
        }
        
        const isRegistered = window.AHPModule.isRegistered();
        if (isRegistered) {
            console.log('ℹ️ User is already registered according to AHP Module');
        } else {
            console.log('ℹ️ User is not registered according to AHP Module');
        }
        
        // Check localStorage
        try {
            const storedData = localStorage.getItem('ahp_registration');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                console.log('ℹ️ Registration data in localStorage:', parsedData);
            } else {
                console.log('ℹ️ No registration data found in localStorage');
            }
        } catch (e) {
            console.warn('⚠️ Error checking localStorage:', e);
        }
        
        // Check cookie
        const cookies = document.cookie.split(';');
        const regCookie = cookies.find(c => c.trim().startsWith('ahp_registered='));
        if (regCookie) {
            console.log('ℹ️ Registration cookie found:', regCookie.trim());
        } else {
            console.log('ℹ️ No registration cookie found');
        }
        
        return true;
    }
    
    // Run all checks
    const scriptTagPresent = checkScriptTag();
    const globalObjectPresent = checkGlobalObject();
    const registrationStatusChecked = checkRegistrationStatus();
    
    // Overall assessment
    console.log('\n📋 AHP Module Verification Summary:');
    if (scriptTagPresent && globalObjectPresent) {
        console.log('✅ AHP Module appears to be correctly installed and initialized');
        console.log('✅ Registration modal should appear for new users');
        console.log('✅ Bot tracking should be operational');
    } else if (scriptTagPresent && !globalObjectPresent) {
        console.log('⚠️ AHP Module script tag is present but the module failed to initialize properly');
        console.log('⚠️ Check browser console for JavaScript errors that might be preventing initialization');
    } else {
        console.log('❌ AHP Module is not properly installed on this page');
        console.log('❌ Please verify the script tag is correctly added to the page head');
    }
    
    console.log('\n📝 Next steps:');
    console.log('1. If verification failed, ensure the script tag is properly added to the <head> section');
    console.log('2. Test registration by clearing cookies/localStorage and refreshing the page');
    console.log('3. Check browser console for any JavaScript errors related to the AHP Module');
})();
