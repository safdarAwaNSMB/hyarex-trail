const client = require('../Database/db');

const CreateWishListsTable = async ()=>{
    try {
        const createTableQuery = "CREATE TABLE IF NOT EXISTS wishlists (id SERIAL PRIMARY KEY, productid TEXT NOT NULL, userid BIGINT NOT NULL, FOREIGN KEY (userid) REFERENCES users(id))"

        await client.query(createTableQuery).then(()=>{
            console.log('wishes');
        }).catch(err => console.log(err));

        // client.query('ALTER TABLE users DROP COLUMN isVerified').then(console.log('success 2'))
        
    } catch (error) {
        console.log(error);
    }
} 

module.exports = { CreateWishListsTable};