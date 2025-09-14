// backend/db.js
const { createClient } = require("@supabase/supabase-js");
const SUPABASE_URL = require("../config/env").supabase_url;
const SUPABASE_KEY = require("../config/env").supabase_key;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

(async () => {
  const { data, error } = await supabase.from("applications").select("*").limit(1);
  if (error) {
    console.error("❌ Supabase connection failed:", error.message);
  } else {
    console.log("✅ Supabase connection successful!");
  }
})();

module.exports = supabase;
