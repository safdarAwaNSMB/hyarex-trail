const stripe = require("stripe")(process.env.STRIPE_SECRET);

const createPayment = async (req, res) => {
  try {
    const quotation = req.body.quotation;
    const lineItems = quotation?.products?.map((product) => {
      const unitAmount =
        ((Number(product?.quotedPrice) +
          Number(product?.quotedPrice / 100) * Number(product?.adminCommision)) /
          Number(product?.quantity)) *
        100;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product?.productData
              ? product.productData.subjectTrans
              : "Product Name",
          },
          unit_amount: Math.round(unitAmount),
        },
        quantity: product.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/quotations",
      cancel_url: "http://localhost:3000/",
    });

    res.json({ id: session.id });

    console.log("quotation from payment");
    console.log(quotation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPayment,
};
