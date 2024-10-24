const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const Note = require('../models/Note')
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

module.exports = { signup, signin, add_note, view_notes };
