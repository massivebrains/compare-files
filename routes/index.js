const express = require('express');
const compare = require('../controllers/compare');

let router = express.Router();

router.get('/', async (req, res, next) => {

    return res.json({ status: true, type: 'docs', data: { docs: 'https://documenter.getpostman.com/view/1050902/S1M2TmSx?version=latest' } });
});

router.post('/', async (req, res, next) => {

    try {

        let response = await compare(req.body);

        if (response.status == true)
            return res.json(response);

        if (response.status == false && response.type == 'validation')
            return res.status(422).json(response);

        return res.status(400).json(response);

    } catch (ex) {

        next(ex);
    }
});

module.exports = router;