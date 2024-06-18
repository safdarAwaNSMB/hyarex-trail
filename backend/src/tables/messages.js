const client = require('../Database/db');

const CreateMessagesTable = async ()=>{
    try {
        const createTableQuery = "CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, adminemail TEXT NOT NULL, agentemail TEXT NOT NULL ,content TEXT NOT NULL,timestamp TEXT NOT NULL, messagefrom TEXT NOT NULL)"

        await client.query(createTableQuery).then(()=>{
            console.log('messages');
        }).catch(err => console.log(err));

        // client.query('ALTER TABLE users DROP COLUMN isVerified').then(console.log('success 2'))
        
    } catch (error) {
        console.log(error);
    }
} 

module.exports = { CreateMessagesTable};