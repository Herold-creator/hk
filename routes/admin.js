const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // 🔐 Pour charger les variables d’environnement

// 🔐 Middleware de vérification de session
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/admin/login');
}

// 🟢 Page de connexion admin
router.get('/login', (req, res) => {
  res.render('admin/login', { error: null });
});

// 🔐 Traitement du login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const validUser = process.env.ADMIN_USER || 'admin';
  const validPass = process.env.ADMIN_PASS || '1234';

  if (username.trim() === validUser && password.trim() === validPass) {
    req.session.user = username;
    res.redirect('/admin/dashboard');
  } else {
    res.status(401).render('admin/login', { error: "Identifiants invalides." });
  }
});

// 🔒 Déconnexion admin
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('❌ Erreur session destroy :', err.message);
    }
    res.redirect('/admin/login');
  });
});

// 🧠 Affichage du tableau de bord
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('admin/dashboard', { user: req.session.user });
});

// 📝 Formulaire de nouvelle actualité
router.get('/new-post', isAuthenticated, (req, res) => {
  res.render('admin/new-post');
});

// ✅ Enregistrement de la nouvelle actualité
router.post('/new-post', isAuthenticated, (req, res) => {
  const { title, date, content } = req.body;
  const filePath = path.join(__dirname, '..', 'data', 'posts.json');

  // Lecture des articles existants
  let posts = [];
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      posts = JSON.parse(raw);
    } catch (err) {
      console.error('❌ Erreur lecture posts.json :', err.message);
    }
  }

  // Ajout du nouvel article
  const newPost = {
    id: Date.now(),
    title: title.trim(),
    date: date,
    content: content.trim()
  };

  posts.unshift(newPost);

  // Sauvegarde du fichier
  try {
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
    res.redirect('/confirmation');
  } catch (err) {
    console.error('❌ Erreur écriture posts.json :', err.message);
    res.status(500).render('404');
  }
});

module.exports = router;
