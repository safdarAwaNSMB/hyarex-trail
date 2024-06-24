const { Pool, Client } = require('pg');

const client = new Client({
    host: 'dpg-cpspvlqj1k6c738ss200-a.oregon-postgres.render.com',
    port: 5432,
    database: 'hyarex_db_ck7o',
    user: 'hyarex_db_ck7o_user',
    password: 'X351SGs19yLqLtSNWm6EHRZw9hXVLONU',
    ssl: {
        rejectUnauthorized: false
    }
})

// const client = new Client({
//     host: 'localhost',
//     port: 5432,
//     database: 'Hyarex',
//     user: 'Safdar',
//     password: 'abc123ABC',
// })



client.connect().then(() => {
    console.log('Great! Postgresql is connected, Boost now!')
}).catch((err)=>{
    console.log('Error in connecting to postgresql :', err);
});
// client.query('DELETE FROM users');

module.exports = client;