require('dotenv').config({ path: require('find-config')('.env') })
const { Client } = require('pg');
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');

async function getInvoices() {
    try {
        const client = new Client({
            port: process.env.PORT,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB, 
            host: 'postgres'
        }
        )
        await client.connect();
        console.log("Connection to DB established...")
        const text ="SELECT * FROM invoices"

        const res = await client.query(text);
        console.log(res.rows)
        return res.rows

    } catch (err) {
        console.log(err.stack);
    }
}

async function insertInvoice(){
    try{
        const client = new Client({
            port: process.env.PORT,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB, 
            host: 'postgres'
        }
        )
        await client.connect();
        console.log("Connection to DB");

        const text = "INSERT INTO invoices(id, number, date,type, amount,client_name) VALUES ($1, $2, $3, $4, $5, $6)"
        const values = []

        await client.query(text, values);
        console.log("Insert successfull");

    }catch(err){
        console.log(err.stack)
    }
}

async function updateInvoice(date,id){
    try{
        const client = new Client({
            port: process.env.PORT,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB, 
            host: 'postgres'
        }
        )
        await client.connect();
        console.log("Connection to DB");

        const text = "UPDATE invoices SET next_due_date=$1 WHERE id=$2"
        const values = [date, id ]

        await client.query(text, values);
        console.log("Update successfull");

    }catch(err){
        console.log(err.stack)
    }
}

async function insertUser(username, password){
    try{
        const client = new Client({
            port: process.env.PORT,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB, 
            host: 'postgres'
        }
        )
        await client.connect();
        console.log("Connection to DB");
        const salt = await bcrypt.genSalt(parseInt(process.env.PASSWORD_SALT_ROUNDS))
        const  hashedPassword = await bcrypt.hash(password, salt)

        const text = "INSERT INTO users(id, username, password) VALUES ($1, $2, $3)"
        const values = [uuidv4(), username, hashedPassword]

        await client.query(text, values);
        console.log("Insert successfull");

    }catch(err){
        console.log(err.stack)
    }
}



async function checkUserExistence(username) {
    try{
        const client = new Client({
            port: process.env.PORT,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB, 
            host: 'postgres'
        }
        )
        await client.connect();
        console.log("Connection to DB");
        const text = "SELECT username, password FROM users WHERE username = $1"
        const values = [username]
        let user = await client.query(text, values);
        console.log(user)
        if (user.rowCount == 0){
            return true 
        }
        return false

    }catch(err){
        console.log(err.stack)
    }
}


async function CreadentialsCheck(username, password){
    try{
        const client = new Client({
            port: process.env.PORT,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB, 
            host: 'postgres'
        }
        )
        await client.connect();
        console.log("Connection to DB");

        const text = "SELECT username, password FROM users WHERE username = $1"
        const values = [username]

        let user = await client.query(text, values);
        const  match = await bcrypt.compare(password, user.rows[0].password);
        console.log(match)
        return match

    }catch(err){
        console.log(err.stack)
    }
}

module.exports = {
    getInvoices,
    updateInvoice,
    CreadentialsCheck,
    checkUserExistence,
    insertUser,
}