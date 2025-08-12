// controllers/courseSettingsController.js
import { createSetting, getSettingsByType } from "../models/courseSettingsModel.js";

export const addCourseSetting = async (req, res) => {
  try {
    let { setting_type, name } = req.body;

    setting_type = setting_type?.trim();
    name = name?.trim();

    if (!['location', 'category', 'type'].includes(setting_type)) {
      return res.status(400).json({ success: false, message: "Invalid setting type" });
    }

    if (!name) {
      return res.status(400).json({ success: false, message: "Name cannot be empty" });
    }

    const result = await createSetting(setting_type, name);

    res.status(201).json({
      success: true,
      message: "Setting added successfully",
      id: result.insertId
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const fetchCourseSettings = async (req, res) => {
  try {
    const type = req.params.type?.trim();

    if (!['location', 'category', 'type'].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid setting type" });
    }

    const results = await getSettingsByType(type);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};