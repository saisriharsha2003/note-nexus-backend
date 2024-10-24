const mongoose = require('mongoose');

// Create the Note schema
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model
    required: true,
  }
}, { timestamps: true });

// Create the Note model
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
