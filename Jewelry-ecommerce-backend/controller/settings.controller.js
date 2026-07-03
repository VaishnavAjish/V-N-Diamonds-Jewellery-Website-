const prisma = require('../prisma/client');

exports.getStorefrontSettings = async (req, res, next) => {
  try {
    let settings = await prisma.setting.findUnique({
      where: { key: 'storefront' }
    });
    
    if (!settings) {
      settings = { value: {} };
    }
    
    res.status(200).json({
      success: true,
      data: settings.value,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStorefrontSettings = async (req, res, next) => {
  try {
    const value = req.body;
    
    const settings = await prisma.setting.upsert({
      where: { key: 'storefront' },
      update: { value },
      create: { key: 'storefront', value }
    });
    
    res.status(200).json({
      success: true,
      message: 'Storefront settings updated successfully!',
      data: settings.value,
    });
  } catch (error) {
    next(error);
  }
};
