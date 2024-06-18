const { Pool, Client } = require('pg');

const client = new Client({
    host: 'dpg-cpoj2reehbks73ek34jg-a.oregon-postgres.render.com',
    port: 5432,
    database: 'trailhyarex',
    user: 'safdardev',
    password: 'h9LtW83miTBidbmL7nmkO1kp1xNc9PI9',
    ssl: {
        rejectUnauthorized: false
    }
})

client.connect().then(() => {
    console.log('Great! Postgresql is connected, Boost now!')
}).catch((err)=>{
    console.log('Error in connecting to postgresql :', err);
});
// client.query('DELETE FROM users');

module.exports = client;