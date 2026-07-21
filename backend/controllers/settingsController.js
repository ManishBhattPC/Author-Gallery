import SystemSettings from "../models/SystemSettings.js";
import { clearSettingsCache, getCachedSettings } from "../middleware/maintenanceMiddleware.js";

// @desc    Get public system settings (maintenance state, announcement, registration status)
// @route   GET /api/settings/public
// @access  Public
export const getPublicSettings = async (req, res) => {
  try {
    const settings = await getCachedSettings();
    res.status(200).json({
      maintenanceMode: !!settings.maintenanceMode,
      announcementText: settings.announcementText || "",
      allowRegistration: settings.allowRegistration !== false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get full settings config for Admin portal
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getAdminSettings = async (req, res) => {
  try {
    const settings = await getCachedSettings();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update system settings config from Admin portal
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateAdminSettings = async (req, res) => {
  try {
    const { maintenanceMode, announcementText, allowRegistration, autoModeration, stripeLiveMode } = req.body;

    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings({});
    }

    if (typeof maintenanceMode === "boolean") settings.maintenanceMode = maintenanceMode;
    if (typeof announcementText === "string") settings.announcementText = announcementText;
    if (typeof allowRegistration === "boolean") settings.allowRegistration = allowRegistration;
    if (typeof autoModeration === "boolean") settings.autoModeration = autoModeration;
    if (typeof stripeLiveMode === "boolean") settings.stripeLiveMode = stripeLiveMode;
    settings.updatedAt = new Date();

    await settings.save();
    clearSettingsCache();

    res.status(200).json({
      message: "System settings updated successfully",
      settings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
