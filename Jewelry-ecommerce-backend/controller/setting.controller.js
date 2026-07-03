const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get setting by key
exports.getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await prisma.setting.findUnique({
      where: { key }
    });

    if (!setting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }

    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update or create setting by key
exports.upsertSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({ success: false, message: 'Value is required' });
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });

    res.status(200).json({ success: true, message: 'Setting updated successfully', data: setting });
  } catch (error) {
    console.error('Error upserting setting:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
