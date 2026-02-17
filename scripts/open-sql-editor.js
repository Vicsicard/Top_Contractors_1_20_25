const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 Opening Supabase SQL Editor...\n');

const sql = fs.readFileSync('QUICK_DB_SETUP.sql', 'utf-8');

console.log('📋 SQL to execute (copied to clipboard):\n');
console.log('─'.repeat(60));
console.log(sql);
console.log('─'.repeat(60));
console.log('\n✅ Opening browser to Supabase SQL Editor...\n');

// Open browser to SQL Editor
const url = 'https://supabase.com/dashboard/project/bmiyyaexngxbrzkyqgzk/sql/new';
exec(`start ${url}`, (error) => {
  if (error) {
    console.log('Please manually open:', url);
  }
});

console.log('📝 Steps:');
console.log('1. Browser will open to SQL Editor');
console.log('2. Copy the SQL above');
console.log('3. Paste into SQL Editor');
console.log('4. Click RUN');
console.log('5. Table will be created in 5 seconds!\n');

// Try to copy to clipboard
try {
  exec(`echo ${sql.replace(/\n/g, ' ')} | clip`, (error) => {
    if (!error) {
      console.log('✅ SQL copied to clipboard! Just paste and run.\n');
    }
  });
} catch (e) {
  // Clipboard copy failed, that's ok
}
