const client = require('../Database/db');

const CreateUsersTable = async ()=>{
    try {
        const createTableQuery = "CREATE TABLE IF NOT EXISTS users (id  SERIAL PRIMARY KEY, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255), email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, userplan VARCHAR(255),signupdate TEXT, userrole VARCHAR(255))"

        await client.query(createTableQuery).then(()=>{
            console.log('success');
        }).catch(err => console.log(err));

        // client.query('ALTER TABLE users DROP COLUMN isVerified').then(console.log('success 2'))
        
    } catch (error) {
        console.log(error);
    }
} 

module.exports = CreateUsersTable;