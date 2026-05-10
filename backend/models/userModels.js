const { UserSchema } = require('../schemas/user');

const getAllUsers = async () => {
  return await UserSchema.findAll();
};

const createUser = async (data) => {
  return await UserSchema.create(data);
};

const findUserByNama = async (nama) => {
  return await UserSchema.findOne({ where: { nama } });
};

module.exports = {
  getAllUsers,
  createUser,
  findUserByNama
};