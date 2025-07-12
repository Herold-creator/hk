const nodemailer = require('nodemailer');
require('dotenv').config();

// 🔐 Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false, // STARTTLS automatique
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: { rejectUnauthorized: false } // Pour O2Switch si nécessaire
});

// 🧪 Vérification du transporteur (dev uniquement)
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur SMTP :', error);
  } else {
    console.log('✅ SMTP prêt à envoyer des emails');
  }
});

// ✉️ Fonction d’envoi d’e-mail
function sendMail({ name, mail, sujet, message }) {
  return transporter.sendMail({
    from: `"${name}" <${mail}>`,
    to: process.env.SMTP_USER,
    subject: `[Formulaire] ${sujet}`,
    text: `Nom : ${name}\nEmail : ${mail}\n\nMessage :\n${message}`,
    html: `
      <h2>📬 Nouveau message reçu</h2>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${mail}</p>
      <p><strong>Sujet :</strong> ${sujet}</p>
      <p><strong>Message :</strong><br>${message.replace(/\n/g, '<br>')}</p>
    `
  });
}

module.exports = sendMail;
