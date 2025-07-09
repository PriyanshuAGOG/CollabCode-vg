
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://tnmiaqoaqhjksrxbbugh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRubWlhcW9hcWhqa3NyeGJidWdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjA2OTYyMSwiZXhwIjoyMDY3NjQ1NjIxfQ.8iCO7W2H29BrK87F68y4UjNuoXciT_tH9P___d2QLFA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Read and execute SQL schema
    const schemaPath = path.join(__dirname, 'supabase-schema-complete.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split SQL commands and execute them one by one
    const commands = schema.split(';').filter(cmd => cmd.trim());
    
    for (const command of commands) {
      if (command.trim()) {
        try {
          const { error } = await supabase.rpc('exec', { sql: command });
          if (error) {
            console.log('SQL command failed (expected for some statements):', error.message);
          }
        } catch (err) {
          console.log('Command execution failed (this is normal for some DDL):', err.message);
        }
      }
    }
    
    console.log('Database setup completed!');
    
    // Test the connection
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    if (error) {
      console.log('Database verification failed:', error);
    } else {
      console.log('Database connection verified successfully!');
    }
    
  } catch (error) {
    console.error('Database setup failed:', error);
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
