const noteModel = require('../models/noteModels');


exports.getNotesByUser = async (req, res) => {
  const data = await noteModel.getNotesByUser(req.params.user_id);
  res.json(data);
};

exports.createNote = async (req, res) => {
  await noteModel.createNote(req.body);
  res.json({ message: 'Note added' });
};

exports.updateNote = async (req, res) => {
  await noteModel.updateNote(req.params.id, req.body);
  res.json({ message: 'Updated' });
};

exports.deleteNote = async (req, res) => {
  await noteModel.deleteNote(req.params.id);
  res.json({ message: 'Deleted' });
};