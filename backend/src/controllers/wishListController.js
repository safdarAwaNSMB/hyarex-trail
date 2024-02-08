const { default: axios } = require('axios');
const client = require('../Database/db');

const toggleToList = async (req, res) => {
    try {
        console.log(req.body);
        const productEsixt = await client.query(`SELECT * FROM wishlists WHERE userId = '${req.body.userid}' AND productId = '${req.body.productid}'`);
        if (productEsixt.rows?.length === 0) {
            await client.query(`INSERT INTO wishlists (userid, productid) VALUES ('${req.body.userid}', '${req.body.productid}') RETURNING *`).then((results) => {
                console.log('added');
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
        const productEsixt = await client.query(`SELECT * FROM wishlists WHERE userid = '${req.body.userid}' AND productid = '${req.body.productid}'`);
        if (productEsixt.rows?.length > 0) {
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
        const productEsixt = await client.query(`DELETE FROM wishlists WHERE userid = '${req.body.userid}' AND productid = '${req.body.productid}'`);

        res.status(200).json({ message: 'Removed from favorite!' })

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Sorry' })
    }
}
const getFavorites = async (req, res) => {
    try {
        const productExistt = await client.query(`SELECT * FROM wishlists WHERE userId = '${req.params.userid}'`);
        if (productExistt.rows?.length > 0) {
            const productsPromises = productExistt.rows.map(async (obj) => {
                const options = {
                    method: 'GET',
                    url: 'https://alibaba-1688-data-service.p.rapidapi.com/item/itemFullInfo',
                    params: {
                        itemId: obj.productid
                    },
                    headers: {
                        'X-RapidAPI-Key': '1013c5ec66msh372a762a07eeb8fp1803b5jsna65e28c27f18',
                        'X-RapidAPI-Host': 'alibaba-1688-data-service.p.rapidapi.com'
                    }
                };

                const response = await axios.request(options);
                return response.data;
            });
            const products = await Promise.all(productsPromises);
            console.log(products);
            res.status(200).json({ wishlistProducts: products });
        } else {
            res.status(200).json({ wishlistProducts: [] })
        }
    } catch (error) {
        res.status(400).json({ message: 'Sorry' })
    }
}

module.exports = { toggleToList, checkFavorite, getFavorites, removeFavorite }