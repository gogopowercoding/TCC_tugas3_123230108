const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const NoteSchema = sequelize.define('notes', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  judul: DataTypes.STRING,
  isi: DataTypes.TEXT,
  tanggal_dibuat: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  user_id: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: false
});

const { UserSchema } = require('./user');

UserSchema.hasMany(NoteSchema, { foreignKey: 'user_id' });
NoteSchema.belongsTo(UserSchema, { foreignKey: 'user_id' });

const createNoteTable = async () => {
  await NoteSchema.sync();
  console.log('notes table ready');
};

module.exports = { NoteSchema, createNoteTable };