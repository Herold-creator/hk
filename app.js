const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const adminRoutes = require('./routes/admin');
const routes = require('./routes/index');

const app = express(); // ✅ Position corrigée

// 🔐 Sessions
app.use(session({
  secret: 'vaz-management-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// 🛡️ Sécurité HTTP
app.use(helmet());

// 📋 Logger des requêtes
app.use(morgan('dev'));

// 🔧 Parsing des données
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🖼️ Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// 🎨 Vue EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 📦 Routes
app.use('/admin', adminRoutes);
app.use('/', routes);

// 🚫 404
app.use((req, res) => {
  res.status(404).render('404');
});

// 🚀 Lancement
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Vaz Management Mineral est en ligne sur http://localhost:${PORT}`);
});
