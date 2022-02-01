// Global constants for all requires 
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

// Global constants for express 
const app = express();
const PORT = process.env.PORT || 3001; 

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
let notes = require('./db/db.json');

// GET function for notes.html 

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// GET function to start displaying notes 

app.get('/api/notes', (req, res) => {
    fs.readFile( 'db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        res.json(notes);
    })
});

// POST function for /api/notes 

app.post('/api/notes', (req, res) => {
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuid
    };

    notes.push(newNote);
    const notesString = JSON.stringify(notes);
    res.json(notes);

    fs.writeFile('db/db.json', notesString, (err, data) => {
        if (err) throw err;
    })
})

// GET function for index.html 

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
})

// LISTEN function to gather information into page 

app.listen(PORT, () => {
    console.log(`Listening on localhost:${PORT}`);
})
