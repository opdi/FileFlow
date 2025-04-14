// // // const fs = require('fs');
// // // fs.appendFile("hello.txt","\n mai badhiya hu ", function(err){
// // //     if(err) console.error(err);
// // //     else console.log("done");
// // // })
// // // fs.rename("hello.txt","hey.txt" ,function(err){
// // // if(err) console.error(err);
// // //  else console.log("done");
// // // })
// // // fs.copyFile("hey.txt","./copy/heyo.txt",function(err){
// // //     if(err) console.error(err);
// // //     else console.log("done");
// // // })
// // // fs.unlink("hey.txt",function(err){
// // //     if(err) console.error(err);
// // //     else console.log("done");
// // // })
// // // fs.rm("./copy",{recursive:true},function(err){
// // //     if(err) console.error(err);
// // //     else console.log("removed");
// // // })
// // const http= require('http');

// // const server= http.createServer(function(req, res){
// //     res.end("hello server!");
// // })
// // server.listen(4000);
// // import express from 'express'
// const express=require('express')
// const app = express()

// app.get('/', function (req, res)  {
//   res.send('Hello World')
// })

// app.listen(3000)
const path = require('path');
const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

// Home route - list files
app.get('/', function(req, res) {
    fs.readdir('./files', function(err, files) {
        if (err) {
            console.error(err);
            return res.status(500).send("Error reading files");
        }
        res.render("index", { files: files });
    });
});

// Create a new file
app.post('/create', function(req, res) {
    const filename = req.body.title.split(' ').join('') + ".txt";
    fs.writeFile(path.join(__dirname, 'files', filename), req.body.description, function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send("Error creating file");
        }
        res.redirect("/");
    });
});

app.post('/edit', function(req, res) {
   fs.rename(`./files${req.body.previous}`,`./files${req.body.new}` ,function(err){
    res.redirect("/");
   })
});

// View a specific file
app.get('/file/:filename', function(req, res) {
    fs.readFile(path.join(__dirname, 'files', req.params.filename), "utf-8", function(err, filedata) {
        if (err) {
            console.error(err);
            return res.status(500).send("Error reading the file");
        }
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

app.get('/edit/:filename', function(req, res) {
    res.render('edit',{filename: req.params.filename});
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
