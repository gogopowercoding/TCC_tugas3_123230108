const userModel = require('../models/userModels');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  const { nama, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await userModel.createUser({
    nama,
    password: hashed
  });

  res.json({ message: 'User created' });
};

exports.getUsers = async (req, res) => {
  const users = await userModel.getAllUsers();
  res.json(users);
};

exports.login = async (req, res) => {
  const { nama, password } = req.body;

  const user = await userModel.findUserByNama(nama);

  if (!user) {
    return res.status(404).json({ message: 'User tidak ditemukan' });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: 'Password salah' });
  }

  res.json({
    message: 'Login berhasil',
    user: {
      id: user.id,
      nama: user.nama
    }
  });
};
