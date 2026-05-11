require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());


const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

const { createUserTable } = require('./schemas/user');
const { createNoteTable } = require('./schemas/note');

(async () => {
  await createUserTable();
  await createNoteTable();

  app.get('/', (req, res) => {
    res.send('API Notes Backend berjalan');
  });

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
