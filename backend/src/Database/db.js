const { Pool, Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 8080,
    database: 'Hyarex',
    user: 'hyarexowner',
    password: 'abc123ABC',
})

client.connect().then(() => {
    console.log('Great! Postgresql is connected, Boost now!')
}).catch((err)=>{
    console.log('Error in connecting to postgresql :', err);
});
// client.query('DELETE FROM users');

module.exports = client;