const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const db = require('./pgqueries')


app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres REST API' })
})

app.get('/quizzes', db.getQuizzes)
app.get('/quiz/:id', db.getQuizById)
app.post('/newquiz', db.createQuiz)
app.put('/quizupd/:id', db.updateQuiz)
app.delete('/quizdelete/:id', db.deleteQuiz)

app.listen(port, () => {
    console.log(`Q2A basic data access running on port ${port}.`)
})
