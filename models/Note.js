const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  noteid:{
    type: String,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title for the note'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content for the note'],
  }
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
