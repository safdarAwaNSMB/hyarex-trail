const { Pool, Client } = require('pg');

const client = new Client({
    host: 'dpg-cqac40iju9rs73bgpjcg-a.oregon-postgres.render.com',
    port: 5432,
    database: 'final_db_b617',
    user: 'hyarex_db_ck7o_user',
    password: 'iwwyinAbpdZOmGy67NhPBqc9lz1wORHj',
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