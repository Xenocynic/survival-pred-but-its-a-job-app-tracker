const {supabase} = require("../config/database");

exports.postApplication = async (req, res) => {
 try {
    const { company, position, status, date_applied, notes } = req.body;

    const { data, error } = await supabase
      .from("applications")
      .insert([{ company, position, status, date_applied, notes }]);

    if (error) throw error;
    res.status(201).json({ message: "Application added", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

