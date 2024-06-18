const client = require("../Database/db");

module.exports.addMessage = async (req, res) => {
  try {
    console.log(req.params);
    client
      .query(
        `INSERT INTO messages (adminemail, agentemail, messagefrom, content, timestamp) VALUES ('${
          req.params.adminMail
        }', '${req.params.agentMail}', '${req.body.from}', '${
          req.body.message
        }', '${new Date()}') RETURNING *`
      )
      .then((results) => {
        console.log(results.rows);
        console.log("Message added successfully");
        res.status(200).json({
          message: "Message added Successfully!",
          data: results.rows[0],
        });
      })
      .catch((err) => {
        console.log("Error in query of adding message");
        console.log(err);
      });
  } catch (error) {}
};

module.exports.getMessages = async (req, res) => {
  try {
    console.log("getting Messages");
    const messages = await client.query(`
        SELECT 
          messages.id,
          messages.content,
          messages.messagefrom AS from,
          messages.timestamp,
          jsonb_build_object(
            'id', admin_user.id,
            'name', admin_user.firstname,
            'email', admin_user.email,
            'role', admin_user.userrole
          ) AS admin,
          jsonb_build_object(
            'id', agent_user.id,
            'name', agent_user.firstname,
            'email', agent_user.email,
            'role', agent_user.userrole
          ) AS agent
        FROM 
          messages
          LEFT JOIN 
          users AS admin_user ON messages.adminemail = admin_user.email
        LEFT JOIN 
          users AS agent_user ON messages.agentemail = agent_user.email
        WHERE 
         messages.adminemail = '${req.params.adminMail}' AND messages.agentemail = '${req.params.agentMail}'`);
    res
      .status(200)
      .json({ message: "These are the messages", data: messages.rows });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in getting messages" });
  }
};

module.exports.getAdminAgents = async (req, res) => {
  try {
    console.log("getting Messages");
    const messages = await client.query(`
        SELECT 
          messages.id,
          messages.content,
          messages.messagefrom AS from,
          messages.timestamp,
          jsonb_build_object(
            'id', admin_user.id,
            'name', admin_user.firstname,
            'email', admin_user.email,
            'role', admin_user.userrole
          ) AS admin,
          jsonb_build_object(
            'id', agent_user.id,
            'firstname', agent_user.firstname,
            'name', agent_user.firstname,
            'lastname', agent_user.lastname,
            'email', agent_user.email,
            'role', agent_user.userrole
          ) AS agent
        FROM 
          messages
          LEFT JOIN 
          users AS admin_user ON messages.adminemail = admin_user.email
        LEFT JOIN 
          users AS agent_user ON messages.agentemail = agent_user.email
        WHERE 
         messages.adminemail = '${req.params.adminMail}'`);
         console.log(messages.rows);

    const agents = messages.rows.reduce((uniqueAgents, message) => {
      const existingAgent = uniqueAgents.find((item) => item.id === message.agent.id); // Assuming 'id' is a unique identifier
      if (!existingAgent) {
        uniqueAgents.push(message.agent);
      }
      return uniqueAgents;
    }, []);
    res.status(200).json({ message: "These are the messages", data: agents });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in getting messages" });
  }
};
