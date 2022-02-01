// Global constants for all requires 
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

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
        id: uuid(),
        title: req.body.title,
        text: req.body.text,
    };

    notes.push(newNote);
    const notesString = JSON.stringify(notes);
    res.json(notes);

    fs.writeFile('db/db.json', notesString, (err, data) => {
        if (err) throw err;
    })
})

// DELETE function to get rid of notes 

app.delete('/api/notes/:id', (req, res) => {
    let noteID = (req.params.id).toString();
    let notesSaved = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));

    notesSaved = notesSaved.filter(checked => {
        return checked.id != noteID;
    })

    fs.writeFileSync('db/db.json', JSON.stringify(notesSaved))
    res.json(notesSaved);
})

// GET function for index.html 

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
})

// LISTEN function to gather information into page 

app.listen(PORT, () => {
    console.log(`Listening on localhost:${PORT}`);
})