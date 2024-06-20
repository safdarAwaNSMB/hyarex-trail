const { default: axios } = require("axios");
const client = require("../Database/db");
require("dotenv").config();

const createQuotation = async (req, res) => {
  try {
    console.log(req.body);
    const quotationExist = await client.query(
      `SELECT * FROM quotations WHERE useremail = '${
        req.body.userEmail
      }' AND increation = '${true}' AND sendedfromcustomer = '${false}'`
    );
    if (quotationExist.rows?.length === 0) {
      const query = {
        text: `INSERT INTO quotations (useremail, products, increation, sendedfromcustomer) VALUES ($1, $2, $3, $4) RETURNING *`,
        values: [
          req.body.userEmail,
          [
            {
              productId: req.body.productId,
              quantity: req.body.quantity,
              requirements: req.body.requirements,
            },
          ],
          true,
          false,
        ],
      };
      await client
        .query(query)
        .then((results) => {
          console.log("New Quotation Created!");
          res.status(200).json({
            added: true,
            message: "New Quotation Created!",
            data: results.rows[0],
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ message: "Error in creating quotation" });
        });
    } else {
      const query = {
        text: `UPDATE quotations SET products = array_append(products, $1) WHERE useremail = $2 AND increation = $3`,
        values: [
          {
            productId: req.body.productId,
            quantity: req.body.quantity,
            requirements: req.body.requirements,
          },
          req.body.userEmail,
          true,
        ],
      };
      await client
        .query(query)
        .then((results) => {
          console.log("updated in quotation");
          res.status(200).json({
            added: false,
            message: "Updated in Quotation!",
            data: results.rows[0],
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ message: "Error in updating quotation" });
        });
    }
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
};

const removeFromCurrentQuotation = async (req, res) => {
  try {
    console.log("from removing request");
    console.log(req.body);
    const quotationExist = await client.query(`
    SELECT 
      quotations.id,
      quotations.type,
      quotations.increation,
      quotations.sendedfromcustomer,
      quotations.quotationdate,
      jsonb_build_object(
        'id', users.id,
        'name', users.firstname,
        'email', users.email,
        'role', users.userrole
      ) AS customer,
      quotations.products
    FROM 
      quotations
    JOIN 
      users ON quotations.useremail = users.email
    WHERE 
     useremail = '${
       req.body.userEmail
     }' AND increation = '${true}' AND sendedfromcustomer = '${false}'`);
    if (quotationExist.rows?.length > 0) {
      const updatedProducts = quotationExist?.rows[0]?.products?.filter(
        (product) => product.productId !== req.body.productId
      );
      console.log(updatedProducts);
      const query = {
        text: `UPDATE quotations SET products = $1  WHERE useremail = $2 AND increation = $3`,
        values: [updatedProducts, req.body.userEmail, true],
      };
      await client
        .query(query)
        .then((results) => {
          console.log("updated in quotation");
          res.status(200).json({
            added: false,
            message: "Updated in Quotation!",
            data: results.rows[0],
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ message: "Error in updating quotation" });
        });
      console.log("after removing");
      console.log(updatedProducts);
    }
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
};

const closeTicket = async (req, res) => {
  try {
    const query = {
      text: `UPDATE tickets
                SET closed = $1
                WHERE id = $2`,
      values: [true, req.params.ticketId],
    };

    await client.query(query);

    res.status(200).json({ updated: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in closing ticket" });
  }
};
const sendQuotation = async (req, res) => {
  try {
    const query = {
      text: `UPDATE quotations
                SET increation = $1, sendedfromcustomer = $2, type = $3, quotationdate = $5, status = $6
                WHERE useremail = $4`,
      values: [
        false,
        true,
        req.body.quotationType,
        req.body.userEmail,
        new Date(),
        "Requested",
      ],
    };

    await client.query(query);

    res.status(200).json({ sended: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in sending quotation" });
  }
};

const approveQuotation = async (req, res) => {
  try {
    const query = {
      text: `UPDATE quotations
                SET status = $1, selectedagent = $2, agentnotes = $3
                WHERE id = $4`,
      values: [
        "Approved",
        req.body.selectedAgent.value,
        req.body.agentNotes,
        req.params.quotationId,
      ],
    };

    await client.query(query);

    res.status(200).json({ sended: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in approving quotation" });
  }
};

const offerQuotation = async (req, res) => {
  try {
    const offeredProducts = req.body.products.map((product) => {
      const { productData, ...simpleProduct } = product;
      return simpleProduct;
    });
    const query = {
      text: `UPDATE quotations
                SET status = $1, products = $2
                WHERE id = $3`,
      values: ["Quoted", offeredProducts, req.params.quotationId],
    };

    await client.query(query);

    res.status(200).json({ sended: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in offering quotation" });
  }
};

const applyCommision = async (req, res) => {
  try {
    const commisionedProducts = req.body.products.map((product) => {
      const { productData, ...simpleProduct } = product;
      return simpleProduct;
    });
    const query = {
      text: `UPDATE quotations
                SET  products = $1, commisionApplied = $2
                WHERE id = $3`,
      values: [commisionedProducts, true, req.params.quotationId],
    };

    await client.query(query);

    res.status(200).json({ sended: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in applying commision quotation" });
  }
};

const rejectQuotation = async (req, res) => {
  try {
    const query = {
      text: `UPDATE quotations
                SET status = $1, selectedagent = $2, agentnotes = $3
                WHERE id = $4`,
      values: ["Rejected", null, null, req.params.quotationId],
    };

    await client.query(query);

    res.status(200).json({ sended: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in approving quotation" });
  }
};

const getCustomerQuotations = async (req, res) => {
  try {
    const quotations = await client.query(`
        SELECT 
        quotations.id,
        quotations.type,
        quotations.increation,
        quotations.sendedfromcustomer,
        quotations.quotationdate,
        quotations.status,
          jsonb_build_object(
            'id', users.id,
            'name', users.firstname,
            'email', users.email,
            'role', users.userrole
          ) AS customer,
          quotations.products
        FROM 
          quotations
          JOIN 
          users ON quotations.useremail = users.email
        WHERE quotations.useremail = '${
          req.params.userEmail
        }' AND increation = '${false}' AND sendedfromcustomer = '${true}'`);

    if (quotations?.rows?.length > 0) {
      const updatedQuotationsPromises = quotations.rows.map(
        async (quotation, rowIndex) => {
          const updatedProductsPromises = quotation.products?.map(
            async (product, index) => {
              console.log("product Id :" + product.productId);
              const options = {
                method: "GET",
                url: `https://www.lovbuy.com/1688api/getproductinfo2.php?key=2c040d02c288e446a1d1709c90bb781a&item_id=${product.productId}&lang=en`,
              };
              const response = await axios
                .request(options)
                .catch((err) => console.log(err));
              console.log(response.data);
              return {
                ...product,
                productData: response?.data?.result?.result,
              };
            }
          );
          const updatedProducts = await Promise.all(updatedProductsPromises);
          return { ...quotation, products: updatedProducts };
        }
      );
      const updatedQuotations = await Promise.all(updatedQuotationsPromises);
      console.log("after");
      console.log(updatedQuotations);
      res.status(200).json(updatedQuotations);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in getting quotations" });
  }
};

const getAgentQuotations = async (req, res) => {
  try {
    const quotations = await client.query(`
        SELECT 
        quotations.id,
        quotations.type,
        quotations.increation,
        quotations.sendedfromcustomer,
        quotations.quotationdate,
        quotations.agentnotes,
        quotations.status,
          jsonb_build_object(
            'id', users.id,
            'name', users.firstname,
            'email', users.email,
            'role', users.userrole
          ) AS customer,
          quotations.products
        FROM 
          quotations
          JOIN 
          users ON quotations.useremail = users.email
        WHERE selectedagent = '${
          req.params.userEmail
        }' AND increation = '${false}' AND sendedfromcustomer = '${true}' `);

    if (quotations?.rows?.length > 0) {
      const updatedQuotationsPromises = quotations.rows.map(
        async (quotation, rowIndex) => {
          const updatedProductsPromises = quotation.products?.map(
            async (product, index) => {
              console.log("product Id :" + product.productId);
              const options = {
                method: "GET",
                url: `https://www.lovbuy.com/1688api/getproductinfo2.php?key=2c040d02c288e446a1d1709c90bb781a&item_id=${product.productId}&lang=en`,
              };
              const response = await axios
                .request(options)
                .catch((err) => console.log(err));
              console.log(response.data);
              return {
                ...product,
                productData: response?.data?.result?.result,
              };
            }
          );
          const updatedProducts = await Promise.all(updatedProductsPromises);
          return { ...quotation, products: updatedProducts };
        }
      );
      const updatedQuotations = await Promise.all(updatedQuotationsPromises);
      console.log("after");
      console.log(updatedQuotations);
      res.status(200).json(updatedQuotations);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in getting quotations" });
  }
};

const getAllQuotations = async (req, res) => {
  try {
    const quotations = await client.query(`
        SELECT 
        quotations.id,
        quotations.type,
        quotations.increation,
        quotations.sendedfromcustomer,
        quotations.quotationdate,
        quotations.status,
          jsonb_build_object(
            'id', users.id,
            'name', users.firstname,
            'email', users.email,
            'role', users.userrole
          ) AS customer,
          quotations.products
        FROM 
          quotations
          JOIN 
          users ON quotations.useremail = users.email
        WHERE increation = '${false}' AND sendedfromcustomer = '${true}'`);

    if (quotations?.rows?.length > 0) {
      const updatedQuotationsPromises = quotations.rows.map(
        async (quotation, rowIndex) => {
          const updatedProductsPromises = quotation.products?.map(
            async (product, index) => {
              console.log("product Id :" + product.productId);
              const options = {
                method: "GET",
                url: `https://www.lovbuy.com/1688api/getproductinfo2.php?key=2c040d02c288e446a1d1709c90bb781a&item_id=${product.productId}&lang=en`,
              };
              const response = await axios
                .request(options)
                .catch((err) => console.log(err));
              console.log(response.data);
              return {
                ...product,
                productData: response?.data?.result?.result,
              };
            }
          );
          const updatedProducts = await Promise.all(updatedProductsPromises);
          return { ...quotation, products: updatedProducts };
        }
      );
      const updatedQuotations = await Promise.all(updatedQuotationsPromises);
      console.log("after");
      console.log(updatedQuotations);
      res.status(200).json(updatedQuotations);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in getting quotations" });
  }
};
const getAllAgents = async (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.body);
    const agents = await client
      .query(`SELECT * FROM users WHERE userrole = 'agent'`)
      .catch((err) => console.log(err));

    console.log("all agents");
    console.log(agents.rows);
    res.status(200).json(agents.rows);
  } catch (error) {
    console.log(error);
  }
};
const getUserCurrentQuotation = async (req, res) => {
  try {
    const currentQuotation = await client.query(`
        SELECT 
          quotations.id,
          quotations.type,
          quotations.increation,
          quotations.sendedfromcustomer,
          quotations.quotationdate,
          jsonb_build_object(
            'id', users.id,
            'name', users.firstname,
            'email', users.email,
            'role', users.userrole
          ) AS customer,
          quotations.products
        FROM 
          quotations
        JOIN 
          users ON quotations.useremail = users.email
        WHERE 
         quotations.useremail = '${
           req.params.userEmail
         }' AND increation = '${true}' AND sendedfromcustomer = '${false}'`);

    if (currentQuotation?.rows?.length > 0) {
      const productsPromises = currentQuotation.rows[0].products.map(
        async (obj) => {
          console.log("product id from map");
          console.log(obj.productId);
          const options = {
            method: "GET",
            url: `https://www.lovbuy.com/1688api/getproductinfo2.php?key=2c040d02c288e446a1d1709c90bb781a&item_id=${obj.productId}&lang=en`,
          };
          const response = await axios
            .request(options)
            .catch((err) => console.log(err));
          console.log(response.data);
          return { ...obj, productData: response?.data?.result?.result };
        }
      );
      const products = await Promise.all(productsPromises);
      currentQuotation.rows[0].products = products;

      res.status(200).json(currentQuotation.rows[0]);
    } else {
      res.status(200).json({});
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in getting current quotation" });
  }
};
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
    res
      .status(200)
      .json({ message: "Ticket retrieved successfully", data: tickets.rows });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in getting ticket" });
  }
};

module.exports = {
  createQuotation,
  closeTicket,
  getCustomerQuotations,
  getTicket,
  getUserCurrentQuotation,
  removeFromCurrentQuotation,
  sendQuotation,
  getAllQuotations,
  getAllAgents,
  approveQuotation,
  rejectQuotation,
  getAgentQuotations,
  offerQuotation,
  applyCommision
};
