module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      amount: { type: DataTypes.FLOAT, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
      },
    },
    {
      tableName: "Transactions",
      timestamps: true,
    }
  );


  Transaction.associate = function (models) {
    Transaction.belongsTo(models.User, { as: "user", foreignKey: "userId" });
  };

  return Transaction;
};
