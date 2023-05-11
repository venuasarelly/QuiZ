const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const Quiz = require('./model')

mongoose.connect('mongodb+srv://venu:VENU@cluster0.dt57vkn.mongodb.net/?retryWrites=true&w=majority').then(
    ()=>console.log('db connected..')
).catch(err=>console.log(err))

app.post('/quizzes', async (req, res) => {
    try {
      const quiz = new Quiz(req.body);
      const result = await quiz.save();
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Get the active quiz
  app.get('/quizzes/active', async (req, res) => {
    try {
      const now = new Date();
      const quiz = await Quiz.findOne({ startDate: { $lte: now }, endDate: { $gte: now } });
      if (!quiz) {
        return res.status(404).json({ message: 'No active quiz found.' });
      }
      res.json(quiz);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get a quiz result
  app.get('/quizzes/:id/result', async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found.' });
      }
      const now = new Date();
      if (now < quiz.endDate) {
        return res.status(400).json({ message: 'Quiz has not ended yet.' });
      }
      res.json({ rightAnswer: quiz.rightAnswer });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get all quizzes
  app.get('/quizzes/all', async (req, res) => {
    try {
      const quizzes = await Quiz.find();
      res.json(quizzes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Start the server
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server started on port ${port}...`));