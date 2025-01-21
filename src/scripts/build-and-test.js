const { exec } = require('child_process');
const path = require('path');

// First, compile the TypeScript files
exec('npx tsc', { cwd: path.resolve(__dirname, '../..') }, (error, stdout, stderr) => {
    if (error) {
        console.error('Error compiling TypeScript files:', error);
        console.error(stderr);
        return;
    }

    console.log('TypeScript compilation successful');
    console.log(stdout);

    // Now run our test script
    const testScript = path.resolve(__dirname, 'test-blog-categorization.js');
    exec(`node ${testScript}`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error running tests:', error);
            console.error(stderr);
            return;
        }

        console.log(stdout);
    });
});
