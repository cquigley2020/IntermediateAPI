const express = require('express');
const app = express();
const nodemon = require('nodemon');
app.use(express.json());

//mongoDB Package
const mongoose = require('mongoose');

const PORT = 1200;

const dbUrl = 'mongodb+srv://admin:Password1@cluster0.2qr3o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(dbUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

//Mongo DB Connection

const db = mongoose.connection;

//handle DB Error, display connection

db.on('error', ()=>{
    console.error.bind(console,'connection error: ');
});

db.once('open', () => {
    console.log('MongoDB Connected');
});

//Schema/Model Declaration
require('./Models/studentObject');
require('./Models/courseObject');

const Student = mongoose.model('Student');
const Course = mongoose.model('Course');

app.get('/',(req,res) => {
    return res.status(200).json("(message: OK)");
});

app.post('/addCourse', async (req,res) => {
    try{
        let course = {
            courseInstructor: req.body.courseInstructor,
            courseCredits: req.body.courseCredits,
            courseID: req.body.courseID,
            courseName: req.body.courseName
        }
        await Course(course).save().then(c => {
            return res.status(201).json("Course Added");
        });
    }
    catch{
        return res.status(400).json("(message: Failed to Add Course - Bad Data)");
    }
});

app.get('/getAllCourses', async (req,res) => {
    try{
        let courses = await Course.find({}).lean();
        return res.status(200).json({"courses": courses});
    }
    catch{
        return res.status(400).json("(message: Failed to Access Course Data)")
    }
});

app.get('/findCourse', async (req,res) => {
    try{
        let query = req.body.courseID;
        let courses = await Course.find({"courseID" : query});
        return res.status(200).json(courses);
    }
    catch{
        return res.status(400).json("(message: Failed to Access Course Data)")
    }
});

app.post('/addStudent', async (req,res) => {
    try{
        let student = {
            fname: req.body.fname,
            lname: req.body.lname,
            studentID: req.body.studentID
        }
        await Student(student).save().then(s => {
            return res.status(201).json("Student Added");
        });
    }
    catch {
        return res.status(400).json("(message: Failed to Add Student - Bad Data)");
    }
});

app.get('/getAllStudents', async (req,res) => {
    try{
        let students = await Student.find({}).lean();
        return res.status(200).json(students);
    }
    catch{
        return res.status(400).json("(message: Failed to Access Student Data)")
    }
});

app.get('/findStudent', async (req,res) => {
    try{
        let query = req.body.fname;
        let courses = await Student.find({"fname" : query});
        return res.status(200).json(courses);
    }
    catch{
        return res.status(400).json("(message: Failed to Access Student Data)")
    }
});

app.post('/editStudentById', async (req,res)=>{
    try{
        let student = await Student.updateOne({id: req.body.id},
            {fname: req.body.fname})
        

        if(student)
        {
            res.status(200).json("(message: Student Updated)");
        }
        else{
            res.status(200).json("(message: No Student Changed)");
        }
    }
    catch{
        return res.status(500).json("(message: Failed to Edit Student Data)");
    }
});

app.post('/editStudentByFname', async (req,res)=>{
    try{
           
        let student = await Student.updateOne({fname: req.body.queryFname},{

            queryFname: req.body.queryFname,
            fname: req.body.fname,
            lname: req.body.lname
        },
            {upsert: true});

        if(student)
        {
            res.status(200).json("(message: Student Updated)");
        }
        else{
            res.status(200).json("(message: No Student Changed)");
        }
    }
    catch{
        return res.status(500).json("(message: Failed to Edit Student Data)");
    }
});

app.post('/deleteStudentById', async (req,res)=>{
    try{
        let student = await Student.deleteOne({_id: req.body.id})
       
        if(student)
        {
            
            res.status(200).json("(message: Student Deleted)");
        }
        else{
            res.status(200).json("(message: No Student Deleted - query null)");
        }
    }
    catch{
        return res.status(500).json("(message: Failed to Delete Student)");
    }
    
});

app.post('/editCourseByCourseName', async (req,res)=>{
    try{
        let course = await Course.updateOne({courseName: req.body.courseName},
        
            {courseInstructor: req.body.courseInstructor},
            {upsert: true});

        if(course)
        {
            res.status(200).json("(message: Instructor's name updated )");
        }
        else{
            res.status(200).json("(message: No Course found - query null)");
        }
    }
    catch{
        return res.status(500).json("(message: Failed to update Instructor's name)");
    }
    
});

app.post('/deleteCourseById', async (req,res)=>{
    try{
        let course = await Course.deleteOne({_id: req.body.id})
       
        if(course)
        {
            //await Course.deleteOne({_id: req.body.id});
            res.status(200).json("(message: Course Deleted)");
        }
        else{
            res.status(200).json("(message: No Course Deleted - query null)");
        }
    }
    catch{
        return res.status(500).json("(message: Failed to Delete Course)");
    }
    
});

app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
});
