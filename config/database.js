const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tillrohfkuxhpokqevbu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpbGxyb2hma3V4aHBva3FldmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4ODYxNzksImV4cCI6MjA3MDQ2MjE3OX0.qoP68kdIIYc5XLpC0m3EUXmHi2Q6aoXlZGagXeFw3oo';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;