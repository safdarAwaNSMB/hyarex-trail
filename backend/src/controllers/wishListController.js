const { default: axios } = require('axios');
const client = require('../Database/db');
require('dotenv').config()

const toggleToList = async (req, res) => {
    try {
        console.log(req.body);
        const productExist = await client.query(`SELECT * FROM wishlists WHERE userid = '${req.body.userid}' AND productid = '${req.body.productid}'`);
        if (productExist.rows?.length === 0) {
           await client.query(`INSERT INTO wishlists (userid, productid) VALUES ('${req.body.userid}', '${req.body.productid}') RETURNING *`).then((results) => {
                console.log('added');
                console.log(results.rows);
                res.status(200).json({ added: true, message: 'Added To Wishlist!', data: results.rows[0] })
            }).catch(err => {
                console.log(err);
                res.status(400).json({ message: 'sorry' })
            })
            
        } else {
            await client.query(`DELETE FROM wishlists WHERE userid = '${req.body.userid}' AND productid = '${req.body.productid}'`).then((results) => {
                console.log('removed');
                res.status(200).json({ added: false, message: 'Removed from Wishlist!', data: results.rows[0] })
            }).catch(err => {
                console.log(err);
                res.status(400).json({ message: 'sorry' })
            })
        }
    } catch (error) {
        res.status(400).json({ message: 'Sorry' })
    }
}
const checkFavorite = async (req, res) => {
    try {
        const productExist = await client.query(`SELECT * FROM wishlists WHERE userid = '${req.body.userid}' AND productid = '${req.body.productid}'`);
        if (productExist.rows?.length > 0) {
            console.log(true);
            res.status(200).json({ favorite: true, message: 'Product is favorite!' })
        } else {
            res.status(200).json({ favorite: false, message: 'Product is not favorite' })
        }
    } catch (error) {
        res.status(400).json({ message: 'Sorry' })
    }
}
const removeFavorite = async (req, res) => {
    try {
        const productExist = await client.query(`DELETE FROM wishlists WHERE userid = '${req.body.userid}' AND productid = '${req.body.productid}'`);

        res.status(200).json({ message: 'Removed from favorite!' })

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Sorry' })
    }
}
const getFavorites = async (req, res) => {
    try {
        const productExist = await client.query(`SELECT * FROM wishlists WHERE userId = '${req.params.userid}'`);
        if (productExist.rows?.length > 0) {
            console.log(productExist.rows);
            const productsPromises = productExist.rows.map(async (obj) => {
                console.log(obj.productid);
                const options = {
                    method: 'GET',
                    url: `https://www.lovbuy.com/1688api/getproductinfo2.php?key=2c040d02c288e446a1d1709c90bb781a&item_id=${obj.productid}&lang=en`,
                };
                const response = await axios.request(options).catch(err => console.log(err));
                console.log(response.data);
                return response?.data?.result?.result;
            });
            const products = await Promise.all(productsPromises);
            console.log(products);
            res.status(200).json({ wishlistProducts: products });
        } else {
            res.status(200).json({ wishlistProducts: [] })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Sorry' })
    }
}

module.exports = { toggleToList, checkFavorite, getFavorites, removeFavorite }