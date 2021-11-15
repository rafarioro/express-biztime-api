const express = require('express');
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({ invoices: results.rows })
      } catch (e) {
        return next(e);
      }
  });

router.get('/:id', async (req, res, next)=> {
    try {
        const { id } = req.params;
        const results = await db.query('SELECT * FROM invoices WHERE id = $1', [id])
        if (results.rows.length === 0) {
          throw new ExpressError(`Company "${id}" cannot be found `, 404)
        }
        return res.send({ id: results.rows[0] })
      } catch (e) {
        return next(e)
      }
});

router.post('/', async (req, res, next) => {
    try {
      const { comp_code, amt, paid } = req.body;
      const results = await db.query('INSERT INTO invoices (comp_code, amt, paid) VALUES ($1, $2, $3) RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt, paid]);
      return res.status(201).json({ invoce: results.rows[0] })
    } catch (e) {
      return next(e)
    }
  })

  module.exports = router;