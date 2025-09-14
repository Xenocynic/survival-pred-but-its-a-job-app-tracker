require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

exports.node_env = process.env.NODE_ENV;
exports.supabase_url = process.env.supabase_url;
exports.supabase_key = process.env.supabase_key;
