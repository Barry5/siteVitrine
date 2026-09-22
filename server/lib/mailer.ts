import nodemailer, { Transporter } from 'nodemailer';

let cachedTransporter: Transporter | null | undefined;

/**
 * Retourne un transporteur SMTP configuré depuis les variables
 * d'environnement, ou null si elles ne sont pas renseignées.
 * Aucun identifiant n'est codé en dur ici : tout vient de server/.env,
 * qui doit être rempli par l'exploitant du site au déploiement.
 */
export function getTransporter(): Transporter | null {
  if (cachedTransporter !== undefined) return cachedTransporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    cachedTransporter = null;
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return cachedTransporter;
}
