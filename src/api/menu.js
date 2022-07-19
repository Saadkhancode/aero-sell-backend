import express from 'express';
import menu from '../models/menu.js';

const router = express.Router();

router.get('/user/menus', async (req, res) => {
    let data = await menu.find(req.data);
    if(!data){
        res.send({message:"no data found"})
    }
    res.send(data);
})

router.post('/user/menus', async (req, res) => {
    const { id, header, icon, links, titles, sublinks, target, external, description, translationKey, color } = req.body;
    let data = await new menu({ id, header, icon, links, titles, sublinks, target, external, description, translationKey, color });
    await data.save().then(result => {
        console.log(result, "Menu data save to database")
        res.send("Menu data saved to database");
    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
})
router.put('/user/menus:_id', async (req, res) => {
    let data = await menu.updateOne(
        req.params,
        {
            $set: req.body
        });
    // res.status(data, 'data updated').send('data updated')
    if (data) {
        res.send({ message: "menu data updated successfully" });
    }
    else {
        res.send({ message: "menu data cannot be updated successfully" })
    }
})

router.delete('user/menu/:_id', async (req, res) => {
    console.log(req.params)
    let data = await menu.deleteOne(req.params)
    // res.send(data)
    if (data) {
        res.send({ message: "menu data delete successfully" });
    }
    else {
        res.send({ message: "menu data cannot delete successfully" })
    }
})
export default router;