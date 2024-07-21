const { User, Transaction } = require('../models');

exports.createUser = async (req, res) => {
  const transaction = await User.sequelize.transaction();
  try {
    const user = await User.create(req.body, { transaction });
    await transaction.commit();
    res.status(201).json(user);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Transaction, as: 'transactions' }]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const transaction = await User.sequelize.transaction();
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.update(req.body, { transaction });
    await transaction.commit();
    res.status(200).json(user);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const transaction = await User.sequelize.transaction();
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy({ transaction });
    await transaction.commit();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};
