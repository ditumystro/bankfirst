const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {pool} = require('./config')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())


//--route to get all bank accounts

app.get("/api/v1/accounts", (request, response) => {
    pool.query('SELECT * FROM bank_account', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
});

//-- route to get the solde of an account

app.get("/api/v1/solde",(request, response) => {
    const {accountnumber} = request.body
    pool.query('SELECT solde FROM bank_account where accountnumber = $1 ',
        [accountnumber],
        (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
});

/*
 *
route to create bank account
 */
app.post("/api/v1/account",(request, response) => {
    const {accountnumber, code_user, solde, type} = request.body
    pool.query(
        'INSERT INTO bank_account (accountnumber, code_user, solde, type) VALUES ($1, $2, $3, $4)',
        [accountnumber, code_user, solde, type],
        (error) => {
            if (error) {
                throw error
            }
            response.status(201).json({status: 'success', message: 'Bank account added.'})
        },
    )
});


/*
 * route to create a user or client
 *
 */
app.post("/api/v1/users",(request, response) => {
    const {full_name, email, password, phone,address} = request.body
    pool.query(
        'INSERT INTO users (full_name, email, password, phone, address) VALUES ($1, $2, $3, $4, $5)',
        [full_name, email, password, phone, address],
        (error) => {
            if (error) {
                throw error
            }
            response.status(201).json({status: 'success', message: 'user added.'})
        },
    )
});


/*app.use('/', (request,response) => {
    response.status(200).send('votre banque first est accessible.....');
});*/


/*
 * route for funds sending
 *
 */
app.post("/api/v1/send",(request, response) => {

    const {amount, accountsender, accountreceiver} = request.body
    const date = new Date()
    const type = "transfer"

    ;(async () => {
        console.log('starting async query')
        const result = await pool.query(
            'INSERT INTO transaction (type, amount, date, accountsender,accountreceiver) VALUES ($1, $2, $3, $4, $5)',
            [type, amount, date, accountsender, accountreceiver],
            (error) => {
                if (error) {
                    throw error
                }

            },
        )

        pool.query(
            'UPDATE bank_account SET solde = solde - $1 WHERE accountnumber = $2', [amount, accountsender],
            (error) => {
                if (error) {
                    throw error
                }
                response.status(201).json({status: 'success', message: 'transaction done!'})
            },
        )
        
        pool.query(
            'UPDATE bank_account SET solde = solde + $1 WHERE accountnumber = $2', [amount, accountreceiver],
            (error) => {
                if (error) {
                    throw error
                }
                response.status(201).json({status: 'success', message: 'transaction done!'})
            },
        )
    })()

})

/*
* route for funds receiving
*
*/
app.post("/api/v1/receive",(request, response) => {

    const {amount, accountsender, accountreceiver} = request.body
    const date = new Date()
    const type = "transfer"

    ;(async () => {
        console.log('starting async query')
        const result = await pool.query(
            'INSERT INTO transaction (type, amount, date, accountsender,accountreceiver) VALUES ($1, $2, $3, $4, $5)',
            [type, amount, date, accountsender, accountreceiver],
            (error) => {
                if (error) {
                    throw error
                }

            },
        )

        pool.query(
            'UPDATE bank_account SET solde = solde + $1 WHERE accountnumber = $2', [amount, accountreceiver],
            (error) => {
                if (error) {
                    throw error
                }
                response.status(201).json({status: 'success', message: 'transaction done!'})
            },
        )
    })()
})

// Start server
app.listen(process.env.PORT || 3002, () => {
    console.log(`Server listening on port 3302`)
})
