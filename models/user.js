const constants = require('../utils/constants')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      balance: { type: DataTypes.FLOAT, defaultValue: 0.0 },
    },
    {
      tableName: constants.USERS_TABLE,
      timestamps: true,
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Transaction, {
      as: "transactions",
      foreignKey: "userId",
    });
  };

  return User;
};
