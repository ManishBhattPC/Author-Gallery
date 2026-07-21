import SystemSettings from "../models/SystemSettings.js";

let cachedSettings = null;
let cacheTime = 0;

export const getCachedSettings = async () => {
  const now = Date.now();
  if (!cachedSettings || now - cacheTime > 5000) { // 5-second cache
    try {
      let settings = await SystemSettings.findOne();
      if (!settings) {
        settings = await SystemSettings.create({
          maintenanceMode: false,
          announcementText: "System maintenance & server optimization in progress.",
          allowRegistration: true,
          autoModeration: true,
          stripeLiveMode: false
        });
      }
      cachedSettings = settings;
      cacheTime = now;
    } catch (err) {
      console.error("Error fetching system settings:", err);
      // Fallback default
      return { maintenanceMode: false, announcementText: "", allowRegistration: true };
    }
  }
  return cachedSettings;
};

export const clearSettingsCache = () => {
  cachedSettings = null;
  cacheTime = 0;
};

export const checkMaintenance = async (req, res, next) => {
  try {
    const settings = await getCachedSettings();

    if (settings && settings.maintenanceMode) {
      // Admin users bypass maintenance mode
      if (req.user && req.user.role === "admin") {
        return next();
      }

      return res.status(503).json({
        message: "Maintenance Shield Active: File uploads & content publishing are temporarily paused for storage maintenance. Site browsing remains open.",
        isMaintenance: true
      });
    }

    next();
  } catch (error) {
    console.error("Maintenance middleware error:", error);
    next();
  }
};
