const express = require('express');
const knex = require('knex');

// database access using knex
/* const db = require('../data/db-config.js'); */

const dbConnection = knex({
  //db Connection Object knows how to connnect with the db
  client: 'sqlite3',
  connection: {
    filename: './data/posts.db3',
  },
  useNullAsDefault: true,
});

const router = express.Router();

router.get('/', (req, res) => {
  dbConnection('posts')
    .where({ id: req.params.id })
    .first()
    .then(post => {
      if (post) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: 'not found' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/:id', (req, res) => {});

router.post('/', (req, res) => {
  // insert into posts () values ()
  // SQLite returns an Array of the last inserted ID
  const post = req.body;
  dbConnection('posts')
    .insert(post, 'id')
    .then(arrayOfIds => {
      const idOfLastRecordInserted = arrayOfIds[0];
      res.status(201).json(idOfLastRecordInserted);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.put('/:id', (req, res) => {
  dbConnection('posts')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: `${count} records(s) updated` });
      } else {
        res.status(404).json({ message: 'Post was not found' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.delete('/:id', (req, res) => {
  // DELETE FROM Posts WHERE PostID=13
  dbConnection('posts')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      res.status(200).json({ message: `${count} records(s) deleted` });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
