const { Pool, Client } = require('pg');

// const client = new Client({
//     host: 'dpg-cpq0a1uehbks73ca3f2g-a.oregon-postgres.render.com',
//     port: 5432,
//     database: 'hyarex_db',
//     user: 'safdardev',
//     password: 'G7na9tjTcxrTIfMg2Syz7eNK8BuUqVtj',
//     ssl: {
//         rejectUnauthorized: false
//     }
// })

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'Hyarex',
    user: 'Safdar',
    password: 'abc123ABC',
})



client.connect().then(() => {
    console.log('Great! Postgresql is connected, Boost now!')
}).catch((err)=>{
    console.log('Error in connecting to postgresql :', err);
});
// client.query('DELETE FROM users');

module.exports = client;