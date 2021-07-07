const express = require('express');
const app = express()

let http = require('http').createServer(app)
const port = 3001

const Pool = require('pg').Pool
const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:'TezCazDB',
    password:'148DD65665ea*',
    port: 5432,
})

app.use(express.json())

app.use(function (req, res, next) {
    // Autoriser les requêtes
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next()
});

app.post('/register', (req, res) => {
    const {login, password} = req.body

    pool.query("INSERT INTO users (login, password) VALUES ('"+ login +"',crypt('"+ password +"', gen_salt('bf')))", [], (error, results) => {
        if (error) {
            res.status(200).send(error)
        }
        res.status(200).send("ok")
    });
})

app.post('/login', (req, res) => {
    const { login, password } = req.body

    pool.query("SELECT * FROM users WHERE login = '" + login + "' AND password = crypt('"+password+"', password)", [], (error, results) => {
      if (error) {
        throw error
      }
      if (results.rows.length > 0) {
        res.status(200).json(results.rows)
      } else {
        res.status(200).send(null)
      }
    })
})

http.listen(port, () => {
    console.log("listening port : " + port);
})