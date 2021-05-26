const Pool = require('pg').Pool
const axios =require('axios')
const pool = new Pool({
    user: 'q2d',
    host: '83.212.109.114',
    database: 'q2d',
    password: 'q2d',
    port: 5432,
})

// ----- app.get('/quizzes', db.getQuizzes) -----
const getQuizzes = (request, response) => {
    const query_obj = {
        name: 'get-all-quizzes',
        text: 'SELECT * FROM quiz ORDER BY id ASC',
        values: [],
    }
    pool.query(query_obj, (error, results) => {
        let msg;
        if (error) {
            msg = 'error: ' + error.message
            console.log(msg)
            response.status(210).send(msg)
        } else {
            msg = 'success: ' + query_obj.name
            console.log(msg)
            response.status(200).json(results.rows)
        }
    })
}


// ----- app.get('/quiz/:id', db.getQuizById) -----
const getQuizById = (request, response) => {
    const id = parseInt(request.params.id)
    const query_obj = {
        name: 'get-quiz-by-id',
        text: 'SELECT * FROM quiz WHERE id = $1',
        values: [id],
    }
    pool.query(query_obj, (error, results) => {
        let msg;
        if (error) {
            msg = 'error: ' + error.message
            console.log(msg)
            response.status(210).send(msg)
        } else {
            msg = 'success: ' + query_obj.name
            console.log(msg)
            response.status(200).json(results.rows)
        }
    })
}


// ----- app.post('/newquiz', db.createQuiz) -----
const createQuiz = (request, response) => {
    const { title } = request.body
    const query_obj = {
        name: 'create-quiz',
        text: 'INSERT INTO quiz (id, title) VALUES (DEFAULT, $1)',
        values: [title],
    }
    pool.query(query_obj, (error, results) => {
        let msg;
        if (error) {
            msg = 'error: ' + error.message
            console.log(msg)
            response.status(211).send(msg)
        } else {
            msg = 'success: ' + query_obj.name
            console.log(msg)
            response.status(201).send(msg)
            axios.post('http://localhost:4200/bus',{"title":title}).then(resp =>{})
        }
    })
}


// ----- app.put('/quizupd/:id', db.updateQuiz) -----
const updateQuiz = (request, response) => {
    const id = parseInt(request.params.id)
    const { title } = request.body
    const query_obj = {
        name: 'update-quiz',
        text: 'UPDATE quiz SET title = $2 WHERE id = $1',
        values: [id, title],
    }
    pool.query(query_obj, (error, results) => {
        let msg;
        if (error) {
            msg = 'error: ' + error.message
            console.log(msg)
            response.status(212).send(msg)
        } else {
            msg = 'success: ' + query_obj.name
            console.log(msg)
            response.status(200).send(msg)
        }
    })
}


// ----- app.delete('/quizdelete/:id', db.deleteQuiz) -----
const deleteQuiz = (request, response) => {
    const id = parseInt(request.params.id)
    const query_obj = {
        name: 'delete-quiz',
        text: 'DELETE FROM quiz WHERE id = $1',
        values: [id],
    }
    pool.query(query_obj, (error, results) => {
        let msg;
        if (error) {
            msg = 'error: ' + error.message
            console.log(msg)
            response.status(213).send(msg)
        } else {
            msg = 'success: ' + query_obj.name + ' for quiz with id= ' + id
            console.log(msg)
            response.status(200).send(msg)
        }
    })
}


module.exports = {
    getQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz
}

