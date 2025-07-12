const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // 🔐 Chargement des variables .env

// 📁 Emplacement du JSON des actualités
const postsPath = path.join(__dirname, '..', 'data', 'posts.json');

// 🏠 Page d’accueil
router.get('/', (req, res) => {
  res.render('index'); // views/index.ejs
});

// 📞 Page contact
router.get('/contact', (req, res) => {
  res.render('contact'); // views/contact.ejs
});

// 📬 Traitement du formulaire
router.post('/contact', async (req, res) => {
  const { name, mail, sujet, message } = req.body;

  try {
    const sendMail = require('../mailer');
    await sendMail({ name, mail, sujet, message });
    res.redirect('/confirmation');
  } catch (error) {
    console.error('❌ Erreur SMTP :', error.message);
    res.status(500).render('404');
  }
});

// ✅ Page de confirmation
router.get('/confirmation', (req, res) => {
  res.render('confirmation'); // views/confirmation.ejs
});

// 📰 Actualités
router.get('/actualites', (req, res) => {
  fs.readFile(postsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Fichier posts.json introuvable :', err.message);
      return res.render('news', { posts: [] });
    }

    try {
      const posts = JSON.parse(data);
      res.render('news', { posts });
    } catch (jsonError) {
      console.error('❌ posts.json mal formé :', jsonError.message);
      res.render('news', { posts: [] });
    }
  });
});

// 🔍 Pages institutionnelles
router.get('/apropos', (req, res) => {
  res.render('about'); // views/about.ejs
});

router.get('/projets', (req, res) => {
  res.render('projects'); // views/projects.ejs
});

router.get('/activites', (req, res) => {
  res.render('activities'); // views/activities.ejs
});

router.get('/carriere', (req, res) => {
  res.render('career'); // views/career.ejs
});

router.get('/legal', (req, res) => {
  res.render('legal'); // views/legal.ejs
});

module.exports = router;
