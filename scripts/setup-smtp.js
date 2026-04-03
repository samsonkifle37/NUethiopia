const fs = require('fs');
const envPath = '.env';

const existingEnv = fs.readFileSync(envPath, 'utf8');
const lines = existingEnv.split('\n').filter(line => !line.includes('SMTP_'));

const smtpLines = [
  'SMTP_HOST="smtp.gmail.com"',
  'SMTP_PORT=587',
  'SMTP_USER="nuethiopia2026@gmail.com"',
  'SMTP_PASS="lqnh xynu wfvw prbn"',
  'SMTP_FROM_EMAIL="\\"NU Ethiopia\\" <nuethiopia2026@gmail.com>"'
];

fs.writeFileSync(envPath, lines.join('\n').trim() + '\n\n' + smtpLines.join('\n') + '\n');
console.log('SMTP config updated successfully in .env');
