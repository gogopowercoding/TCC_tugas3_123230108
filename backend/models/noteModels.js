const { NoteSchema } = require('../schemas/note');
const { UserSchema } = require('../schemas/user');

const getNotesByUser = async (user_id) => {
  return await NoteSchema.findAll({
    where: { user_id },
    order: [['id', 'DESC']]
  });
};

const createNote = async (data) => {
  return await NoteSchema.create(data);
};

const updateNote = async (id, data) => {
  return await NoteSchema.update(data, {
    where: { id }
  });
};

const deleteNote = async (id) => {
  return await NoteSchema.destroy({
    where: { id }
  });
};

module.exports = {
  getNotesByUser,
  createNote,
  updateNote,
  deleteNote
};