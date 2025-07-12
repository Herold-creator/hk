const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // 🔐 Pour utiliser les variables .env si besoin

// 🔐 Middleware de vérification de session
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.redirect('/admin/login');
  }
}

// 🟢 Page de connexion admin
router.get('/login', (req, res) => {
  res.render('admin/login', { error: null });
});

// 🔐 Traitement login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Exemple de vérification simple (à remplacer par bcrypt + base de données)
  const validUser = process.env.ADMIN_USER || 'admin';
  const validPass = process.env.ADMIN_PASS || '1234';

  if (username === validUser && password === validPass) {
    req.session.user = username;
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin/login', { error: "Identifiants invalides." });
  }
});

// 🔒 Déconnexion
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/admin/login');
  });
});

// 🧠 Tableau de bord
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('admin/dashboard', { user: req.session.user });
});

// 📝 Formulaire de nouvelle actualité
router.get('/new-post', isAuthenticated, (req, res) => {
  res.render('admin/new-post');
});

// ✅ Traitement et enregistrement du post
router.post('/new-post', isAuthenticated, (req, res) => {
  const { title, date, content } = req.body;
  const filePath = path.join(__dirname, '..', 'data', 'posts.json');

  // Lire les anciens articles
  let posts = [];
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath);
      posts = JSON.parse(raw);
    } catch (err) {
      console.error('❌ Erreur lecture posts.json :', err.message);
    }
  }

  // Ajouter le nouveau
  posts.unshift({ title, date, content });

  // Sauvegarder
  try {
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
    res.redirect('/confirmation');
  } catch (err) {
    console.error('❌ Erreur écriture posts.json :', err.message);
    res.status(500).render('404');
  }
});

module.exports = router;
