const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const async = require('hbs/lib/async');
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.register = (req, res) => {

    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) =>{
        if(error){
            console.log(error)
        } 
        else if (results.length > 0){
            return res.render('register', {
                message: 'This email is already in use!'
            })
        } else if (password !== passwordConfirm){
            return res.render('register', {
                message: 'Passwords do not match!'
            });
        } else if (name.length == 0){
            return res.render('register', {
                message: `Name field can't be empty!`
            });
        }  else if (email.length == 0){
            return res.render('register', {
                message: `Email field can't be empty!`
            });
        } else if (password.length == 0){
            return res.render('register', {
                message: `Password field can't be empty!`
            });
        } 
        


        let hashedPassword = await bcrypt.hash(password, 8)
        console.log(hashedPassword)


        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) =>{
            if (error){
                console.log(error)
            } else {
                console.log(results)
                return res.render('register', {
                    message: 'User registered'
                })
            }
        })

    });

}