const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const Note = require('../models/Note');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  const { name, email, mobile, uname, password } = req.body;

  try {

    const existingUser = await User.findOne({ uname });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      uname,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const signin = async (req, res) => {
  const { uname, password } = req.body;

  try {
    const user = await User.findOne({ uname });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ Error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); 
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ Error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(StatusCodes.OK).json({ token, name: user.name,  message: "Login Successfull!!"  }); 
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: 'Error signing in', error });
  }
};

const add_note = async (req, res) => {
  try {
    const { title, content } = req.body;

    const noteid = Math.floor(10000 + Math.random() * 90000).toString();

    const newNote = new Note({
      noteid,
      title,
      content
    });

    const savedNote = await newNote.save();

    res.status(201).json({
      message: 'Note added successfully',
      note: savedNote,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error adding note',
      error: error.message,
      
    });
  }
};

const view_notes = async (req, res) => {
  try {
    const notes = await Note.find();
    console.log(notes);
    res.status(200).json({ notes, message: "Fetched All Notes!" });
  } catch (error) {
    res.status(500).json({ error: "Error fetching notes" });
  }

};

const view_note_by_id = async (req, res) => {
  const { noteid } = req.params;

  try {
    const note = await Note.findOne({ _id: noteid });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ note, message: 'Note fetched successfully' });
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const edit_note = async (req, res) => {
  
  const {id, title, content } = req.body; 
  console.log("Id   "+id+"  "+title+"   "+content);

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id,  
      { title, content },
      { new: true, runValidators: true } 
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    console.log(`Updated note: ${updatedNote.title}`);
    return res.status(200).json({ message: 'Note updated successfully.', note: updatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ message: 'Error updating note.', error: error.message });
  }
};


module.exports = { signup, signin, add_note, view_notes, view_note_by_id, edit_note};
