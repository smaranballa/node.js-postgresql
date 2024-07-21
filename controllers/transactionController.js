const { User, Transaction } = require('../models');

exports.createTransaction = async (req, res) => {
  const transaction = await Transaction.sequelize.transaction();
  try {
    const user = await User.findByPk(req.body.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newTransaction = await Transaction.create(req.body, { transaction });

    if (newTransaction.type === 'credit') {
      user.balance = parseFloat(user.balance) + parseFloat(newTransaction.amount);
    } else if (newTransaction.type === 'debit') {
      user.balance = parseFloat(user.balance) - parseFloat(newTransaction.amount);
    }

    await user.save({ transaction });
    await transaction.commit();
    res.status(201).json(newTransaction);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }]
    });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  const transaction = await Transaction.sequelize.transaction();
  try {
    const existingTransaction = await Transaction.findByPk(req.params.id);
    if (!existingTransaction) return res.status(404).json({ error: 'Transaction not found' });

    const user = await User.findByPk(existingTransaction.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (existingTransaction.type === 'credit') {
      user.balance = parseFloat(user.balance) - parseFloat(existingTransaction.amount);
    } else if (existingTransaction.type === 'debit') {
      user.balance = parseFloat(user.balance) + parseFloat(existingTransaction.amount);
    }

    await existingTransaction.update(req.body, { transaction });

    if (req.body.type === 'credit') {
      user.balance = parseFloat(user.balance) + parseFloat(req.body.amount);
    } else if (req.body.type === 'debit') {
      user.balance = parseFloat(user.balance) - parseFloat(req.body.amount);
    }

    await user.save({ transaction });
    await transaction.commit();
    res.status(200).json(existingTransaction);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  const transaction = await Transaction.sequelize.transaction();
  try {
    const existingTransaction = await Transaction.findByPk(req.params.id);
    if (!existingTransaction) return res.status(404).json({ error: 'Transaction not found' });

    const user = await User.findByPk(existingTransaction.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (existingTransaction.type === 'credit') {
      user.balance = parseFloat(user.balance) - parseFloat(existingTransaction.amount);
    } else if (existingTransaction.type === 'debit') {
      user.balance = parseFloat(user.balance) + parseFloat(existingTransaction.amount);
    }

    await user.save({ transaction });
    await existingTransaction.destroy({ transaction });
    await transaction.commit();
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};
