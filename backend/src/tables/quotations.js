const client = require('../Database/db');

const CreateQuotationsTable = async ()=>{
    try {
        const createTableQuery = "CREATE TABLE IF NOT EXISTS quotations (id SERIAL PRIMARY KEY, products JSONB[], useremail TEXT NOT NULL, type TEXT, increation BOOLEAN NOT NULL, sendedfromcustomer BOOLEAN NOT NULL, quotationdate TEXT, status TEXT, selectedagent TEXT, agentnotes TEXT, commisionApplied BOOLEAN)"

        await client.query(createTableQuery).then(()=>{
            console.log('quotations');
        }).catch(err => console.log(err));

        // client.query('ALTER TABLE users DROP COLUMN isVerified').then(console.log('success 2'))
        
    } catch (error) {
        console.log(error);
    }
} 

module.exports = { CreateQuotationsTable};