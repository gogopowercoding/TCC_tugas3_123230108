const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const UserSchema = sequelize.define('users', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nama: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false }
}, {
  timestamps: false
});

const createUserTable = async () => {
  await UserSchema.sync();
  console.log('users table ready');
};

module.exports = { UserSchema, createUserTable };