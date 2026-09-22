import { Router } from 'express';
import { getTransporter } from '../lib/mailer.js';

export const contactRouter = Router();

interface ContactPayload {
  fullName: string;
  phone: string;
  email?: string;
  agency: string;
  destination: string;
  message: string;
}

function isValidPayload(body: unknown): body is ContactPayload {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.fullName === 'string' && b.fullName.trim().length > 1 &&
    typeof b.phone === 'string' && b.phone.trim().length > 5 &&
    typeof b.agency === 'string' && b.agency.trim().length > 0 &&
    typeof b.destination === 'string' && b.destination.trim().length > 0 &&
    typeof b.message === 'string' && b.message.trim().length > 3 &&
    (b.email === undefined || typeof b.email === 'string')
  );
}

/**
 * POST /api/contact
 * Envoie la demande par email via SMTP (Nodemailer). N'invente et ne
 * journalise jamais d'identifiants ; répond 503 explicitement si le
 * serveur n'est pas encore configuré (SMTP_* / CONTACT_RECIPIENT_EMAIL).
 */
contactRouter.post('/', async (req, res) => {
  if (!isValidPayload(req.body)) {
    return res.status(400).json({ error: 'Formulaire incomplet ou invalide.' });
  }

  const { fullName, phone, email, agency, destination, message } = req.body as ContactPayload;

  const transporter = getTransporter();
  if (!transporter) {
    console.error(
      '[contact] SMTP non configuré : renseignez SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS dans server/.env.'
    );
    return res.status(503).json({
      error: "L'envoi d'email n'est pas encore configuré côté serveur.",
    });
  }

  const to = process.env.CONTACT_RECIPIENT_EMAIL;
  if (!to) {
    console.error('[contact] CONTACT_RECIPIENT_EMAIL manquant dans server/.env.');
    return res.status(503).json({
      error: "L'adresse de réception des demandes n'est pas configurée côté serveur.",
    });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      replyTo: email && email.trim() ? email : undefined,
      subject: `Nouvelle demande d'expédition — ${fullName}`,
      text: [
        `Nom : ${fullName}`,
        `Téléphone : ${phone}`,
        email ? `Email : ${email}` : null,
        `Agence de dépôt : ${agency}`,
        `Destination : ${destination}`,
        '',
        'Message :',
        message,
      ]
        .filter((line): line is string => line !== null)
        .join('\n'),
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('[contact] Échec envoi email :', err);
    res.status(502).json({ error: "Échec de l'envoi de l'email. Merci de réessayer." });
  }
});
