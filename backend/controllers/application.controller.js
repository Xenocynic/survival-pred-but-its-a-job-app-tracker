const supabase = require("../config/database");

exports.postApplication = async (req, res) => {
  try {
    const { company, position, status, date_applied, notes } = req.body;

    const { data, error } = await supabase
      .from("applications")
      .insert([{ company, position, status, date_applied, notes }])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Application posted successfully",
      application: data[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server Error: Failed to post application",
    });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const { data, error } = await supabase.from("applications").select("*");

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "All applications retrieved!",
      applications: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server Error: Failed to get all applications",
    });
  }
};

exports.getApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Application retrieved!",
      application: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server Error: Failed to get all applications",
    });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = req.body;

    const { data, error } = await supabase
      .from("applications")
      .update(updates) // apply updates
      .eq("id", id) // match by id
      .select();

    if (error) throw err;
    res.json({
      success: true,
      message: "Application updated successfully",
      application: data[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error: Failed to update application",
    });
  }
};

exports.moveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { to } = req.body;

    const {data, error} = await supabase.from("applications").update(to).eq("id", id).select();

    if (error) throw err;

    res.json({
      success: true,
      message: "Application status updated successfully",
      application: data[0],
    });

  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error: Failed to update status of application",
      });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params; // /api/applications/:id

    const { error } = await supabase.from("applications").delete().eq("id", id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: `Application with id ${id} deleted successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error: Failed to delete application",
    });
  }
};
