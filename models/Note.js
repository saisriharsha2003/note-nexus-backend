const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the note'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content for the note'],
  },
  owner: {
    type: String, 
    required: [true, 'Please provide the owner of the note'],
  }
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
