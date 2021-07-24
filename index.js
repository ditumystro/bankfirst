const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {pool} = require('./config')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

const getAllAccounts = (request, response) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const addBankAccount = (request, response) => {
    const {number, code_user, solde, type} = request.body
    pool.query(
        'INSERT INTO bank_account (number, code_user, solde, type) VALUES ($1, $2, $3, $4)',
        [number, code_user, solde, type],
        (error) => {
            if (error) {
                throw error
            }
            response.status(201).json({status: 'success', message: 'Bank account added.'})
        },
    )
}

app
    .route('/accounts')
    // GET endpoint
    .get(getAllAccounts)
    // POST endpoint
    .post(addBankAccount)

// Start server
app.listen(process.env.PORT || 3002, () => {
    console.log(`Server listening on port 3302`)
})