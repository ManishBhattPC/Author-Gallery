import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  announcementText: { type: String, default: "System maintenance & server optimization in progress." },
  allowRegistration: { type: Boolean, default: true },
  autoModeration: { type: Boolean, default: true },
  stripeLiveMode: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

const SystemSettings = mongoose.model("SystemSettings", systemSettingsSchema);
export default SystemSettings;
