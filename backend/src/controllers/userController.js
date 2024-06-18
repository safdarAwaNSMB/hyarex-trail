const nodemailer = require("nodemailer");
const client = require("../Database/db");

// Curretly, this one is under use.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "safdarstudent@gmail.com",
    pass: "dtha oqfz ryjc tmwj",
  },
});

const sendVerificationEmail = async (req, res) => {
  try {
    console.log(req.body);
    const data = req.body;
    const mailOptions = {
      from: "safdarstudent@gmail.com", //this will be replaced with "info@yourway-carhire.com"
      to: data.email,
      subject: "Verify Your Account",
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
                h1 {
                    color: #007bff;
                }
                p {
                    line-height: 1.6;
                }
                .verification-code {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    margin-top: 10px;
                }
                .cta-button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
    <div class="container">
        <h1>Account Verification</h1>
        <p>Dear ${req.body.firstname},</p>
        <p>We hope this email finds you well. You have initiated the account verification process.</p>
        <p>Your verification code:</p>
        <div class="verification-code">${req.body.verificationcode}</div>
        <p>If you did not initiate this request, please disregard this email.</p>
        <p>Thank you for choosing us!</p>
    </div>
</body>
        </html>
        `,
    };

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);
        res
          .status(500)
          .send({ status: false, message: "Internal server error" });
      } else {
        console.log("Verification Email sent!");
        res.status(200).json({
          status: true,
          message: "The Verification Email sended!",
          data: data,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const sendResetEmail = async (req, res) => {
  try {
    console.log(req.body);
    const data = req.body;
    const mailOptions = {
      from: "safdarstudent@gmail.com", //this will be replaced with "info@yourway-carhire.com"
      to: data.email,
      subject: "Verify Your Account",
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
                h1 {
                    color: #007bff;
                }
                p {
                    line-height: 1.6;
                }
                .verification-code {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    margin-top: 10px;
                }
                .cta-button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
    <div class="container">
        <h1>Account Verification</h1>
        <p>Dear ${req.body.firstname},</p>
        <p>We hope this email finds you well. You have initiated the Reset Password process.</p>
        <p>Your verification code:</p>
        <div class="verification-code">${req.body.verificationcode}</div>
        <p>If you did not initiate this request, please disregard this email.</p>
        <p>Thank you for choosing us!</p>
       
    </div>
</body>
        </html>
        `,
    };

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);
        res
          .status(500)
          .send({ status: false, message: "Internal server error" });
      } else {
        console.log("Verification Email sent!");
        res.status(200).json({
          status: true,
          message: "The Verification Email sended!",
          data: data,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const createBuyer = async (req, res) => {
  try {
    // console.log(req.body);
    client
      .query(
        `INSERT INTO users (firstname, lastname, email, password, userrole) VALUES ('${req.body.firstname}', '${req.body.lastname}', '${req.body.email}', '${req.body.password}', 'buyer') RETURNING *`
      )
      .then((results) => {
        console.log(results.rows);
        console.log("Buyer created successfully");
        res
          .status(200)
          .json({ message: "Signed Up Successfully!", data: results.rows[0] });
      })
      .catch((err) => {
        console.log("Error in query of creating buyer");
        console.log(err);
      });
  } catch (error) {}
};
const createUser = async (req, res) => {
  try {
    // console.log(req.body);
    client
      .query(
        `INSERT INTO users (firstname, lastname, email, password, userrole) VALUES ('${req.body.firstname}', '${req.body.lastname}', '${req.body.email}', '${req.body.password}', '${req.body.userrole}') RETURNING *`
      )
      .then((results) => {
        console.log(results.rows);
        console.log("Buyer created successfully");
        res
          .status(200)
          .json({ message: "Signed Up Successfully!", data: results.rows[0] });
      })
      .catch((err) => {
        console.log("Error in query of creating buyer");
        console.log(err);
      });
  } catch (error) {}
};

const signInUser = async (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.body);
    const user = await client
      .query(`SELECT * FROM users WHERE email = '${req.body.email}'`)
      .catch((err) => console.log(err));

    console.log(user);
    if (user.rows?.length === 0) {
      console.log("user not exists");
      res.status(400).json({ message: "User not Exists" });
      return;
    } else {
      if (user.rows[0]?.password !== req.body.password) {
        console.log("wrong password");
        res.status(400).json({ message: "Wrong Password" });
        return;
      } else {
        console.log("corect password");
        res
          .status(200)
          .json({ message: "Signed In Successfully", user: user.rows[0] });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const assignPlan = async (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.body);
    const results = await client
      .query(`UPDATE users SET userplan = $1 WHERE email = $2 RETURNING *`, [
        req.body.userplan,
        req.body.email,
      ])
      .catch((err) => {
        res.status(400).json({ message: "Server Error" });
        return;
      });
    console.log(results.rows);
    res
      .status(200)
      .json({ message: "Plan has been Choosed", user: results.rows[0] });
  } catch (error) {
    console.log(error);
  }
};
const userExist = async (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.body);
    const user = await client
      .query(`SELECT * FROM users WHERE email = '${req.body.email}'`)
      .catch((err) => console.log(err));

    console.log(user);
    if (user.rows?.length === 0) {
      console.log("user not exists");
      res.status(201).json({ message: "User not Exists" });
      return;
    } else {
      res
        .status(200)
        .json({
          message: "User with this email exists already",
          user: user.rows[0],
        });
    }
  } catch (error) {
    console.log(error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.body);
    const users = await client
      .query(`SELECT * FROM users`)
      .catch((err) => console.log(err));

    console.log("all");
    console.log(users.rows);
    res.status(200).json({ message: "User lis is", user: users.rows });
  } catch (error) {
    console.log(error);
  }
};

const getAllAdmins = async (req, res) => {
  try {
    // console.log(req.body);
    const admins = await client
      .query(`SELECT * FROM users WHERE userrole = 'admin'`)
      .catch((err) => console.log(err));

    console.log("all");
    console.log(admins.rows);
    res.status(200).json({ message: "Admins list  is", admins: admins.rows });
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.body);
    const user = await client
      .query(
        `UPDATE users SET avator = '${req.body.avatar?.url}', email = '${req.body.email}', firstname = '${req.body.first_name}', lastname = '${req.body.last_name}' WHERE email = '${req.body.email}' RETURNING *`
      )
      .catch((err) => console.log(err));

    res
      .status(200)
      .json({ message: "Details Updated Successfuly", user: user?.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Server Error" });
  }
};
const editUser = async (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.body);
    const user = await client
      .query(
        `UPDATE users SET firstname = '${req.body.firstname}', lastname = '${req.body.lastname}', password = '${req.body.password}', userrole = '${req.body.userrole}' WHERE email = '${req.body.email}' RETURNING *`
      )
      .catch((err) => console.log(err));

    res
      .status(200)
      .json({ message: "Details Updated Successfuly", user: user?.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Server Error" });
  }
};
const resetPassword = async (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.body);
    const user = await client
      .query(
        `UPDATE users SET password = '${req.body.password}' WHERE email = '${req.body.email}' RETURNING *`
      )
      .catch((err) => console.log(err));
    res
      .status(200)
      .json({ message: "Password Updated Successfuly", user: user?.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Server Error" });
  }
};
const deleteUser = async (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.body);
    const user = await client
      .query(
        `DELETE FROM users WHERE email = '${req.body.userEmail}' RETURNING *`
      )
      .catch((err) => console.log(err));
    res.status(200).json({ message: "User Deleted Successfuly" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Server Error" });
  }
};

module.exports = {
  sendVerificationEmail,
  deleteUser,
  editUser,
  getAllUsers,
  createUser,
  sendResetEmail,
  createBuyer,
  signInUser,
  userExist,
  assignPlan,
  updateUser,
  resetPassword,
  getAllAdmins
};
