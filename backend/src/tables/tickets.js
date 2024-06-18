const client = require('../Database/db');

const CreateTicketsTable = async ()=>{
    try {
        const createTableQuery = "CREATE TABLE IF NOT EXISTS tickets (id SERIAL PRIMARY KEY, buyeremail TEXT NOT NULL REFERENCES users(email), closed BOOLEAN, name TEXT NOT NULL, messages JSONB[])"
        // const trailcheck = await client.query('SELECT * FROM tickets')
        // console.log(trailcheck.rows[0]?.messages);

        await client.query(createTableQuery).then(()=>{
            console.log('tickets');
        }).catch(err => console.log(err));

        // client.query('ALTER TABLE users DROP COLUMN isVerified').then(console.log('success 2'))
        
    } catch (error) {
        console.log(error);
    }
} 

module.exports = { CreateTicketsTable};