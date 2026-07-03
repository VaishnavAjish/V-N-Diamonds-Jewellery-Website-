const prisma = require('../prisma/client');

exports.createClient = async (req, res, next) => {
  try {
    const client = await prisma.client.create({ data: req.body });
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

exports.getAllClients = async (req, res, next) => {
  try {
    const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    next(error);
  }
};
