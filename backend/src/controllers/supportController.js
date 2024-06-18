const { default: axios } = require('axios');
const client = require('../Database/db');
require('dotenv').config()
const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "safdarstudent@gmail.com",
        pass: "dtha oqfz ryjc tmwj"
    },
});

const sendMail = async (req, res) => {
    try {
        console.log(req.body);
        const data = req.body;
        const mailOptions = {
            from: 'safdarstudent@gmail.com', //this will be replaced with "info@yourway-carhire.com"
            to: 'safdarstudent@gmail.com',
            subject: data.name,
            html: `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                
                p {
                    line-height: 1.6;
                }
               
            </style>
        </head>
        <body>
    <div class="container">
        <p><b>Message from "${data.senderMail}"</b></p>
        <p>${data.content}</p>
    </div>
</body>
        </html>
        `
        };

        transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).send({ status: false, message: 'Internal server error' });
            } else {
                console.log('Verification Email sent!');
                res.status(200).json({
                    status: true, message: "The Verification Email sended!", data: data
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const createTicket = async (req, res) => {
    try {
        const query = {
            text: 'INSERT INTO tickets (name, buyeremail, messages, closed) VALUES ($1, $2, $3, $4) RETURNING *',
            values: [req.body.name, req.body.buyer.email, [{ sender: req.body.buyer, timestamp: new Date(), message: req.body.content }], false]
        };
        await client.query(query).then((results) => {
            res.status(200).json({ added: true, message: 'Ticket Created', data: results.rows[0] })
        }).catch((err) => {
            console.log(err);
            res.status(400).json({ message: 'Error in creating ticket' })
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error in creating Ticket' })
    }
}
const sendMessage = async (req, res) => {
    try {
        const query = {
            text: `UPDATE tickets
                SET messages = array_append(messages, $1)
                WHERE id = $2`,
            values: [
                {
                    sender: req.body.sender,
                    message: req.body.message,
                    timestamp: new Date().toISOString() // Use ISO format for timestamp
                },
                req.params.ticketId
            ]
        };

        await client.query(query);

        res.status(200).json({ added: true });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error in adding message' });
    }
};
const closeTicket = async (req, res) => {
    try {
        const query = {
            text: `UPDATE tickets
                SET closed = $1
                WHERE id = $2`,
            values: [
                true,
                req.params.ticketId
            ]
        };

        await client.query(query);

        res.status(200).json({ updated: true });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error in closing ticket' });
    }
};

const getAllTickets = async (req, res) => {
    try {
        const tickets = await client.query(`
        SELECT 
          tickets.id,
          tickets.name,
          tickets.closed,
          jsonb_build_object(
            'id', users.id,
            'name', users.firstname,
            'email', users.email,
            'role', users.userrole
          ) AS buyer,
          tickets.messages
        FROM 
          tickets
        JOIN 
          users ON tickets.buyeremail = users.email`);
        res.status(200).json({ message: 'These are all the tickets', data: tickets.rows })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error in getting tickets' })
    }
}
const getUserTickets = async (req, res) => {
    try {
        const tickets = await client.query(`
        SELECT 
          tickets.id,
          tickets.name,
          tickets.closed,
          jsonb_build_object(
            'id', users.id,
            'name', users.firstname,
            'email', users.email,
            'role', users.userrole
          ) AS buyer,
          tickets.messages
        FROM 
          tickets
        JOIN 
          users ON tickets.buyeremail = users.email
        WHERE 
         tickets.buyeremail = '${req.params.userEmail}'`);

        res.status(200).json({ message: 'These are the user tickets', data: tickets.rows })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error in getting tickets' })
    }
}
const getTicket = async (req, res) => {
    try {
        const tickets = await client.query(`
        SELECT 
            tickets.id,
            tickets.name,
            tickets.closed,
            jsonb_build_object(
                'id', users.id,
                'name', users.firstname,
                'email', users.email,
                'role', users.userrole
            ) AS buyer,
            tickets.messages
        FROM 
            tickets
        JOIN 
            users ON tickets.buyeremail = users.email
        WHERE 
            tickets.id = ${req.params.ticketId}`);
        res.status(200).json({ message: 'Ticket retrieved successfully', data: tickets.rows });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error in getting ticket' });
    }
};


module.exports = { sendMail, createTicket, closeTicket, getAllTickets, sendMessage, getTicket, getUserTickets }