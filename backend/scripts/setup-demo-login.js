/**
 * LOCAL DEVELOPMENT ONLY – run with:  npm run setup-demo-login
 *
 * 1. Creates the extra login tables from src/features/auth/authentication.sql
 *    (auth_security, driver_applications). Safe to run again.
 * 2. Asks you for a password and gives it to every demo user whose password in
 *    transithub_ju.sql is a fake placeholder ("$2b$10$DEMOHASH..."),
 *    so you can log in as e.g. nusrat@juniv.edu.
 *
 * Only your local database is changed – the team's SQL file is not touched.
 */
import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import readline from 'node:readline';
import bcrypt from 'bcryptjs';
import { db } from '../src/config/database.js';
import { validatePassword } from '../src/features/auth/authentication.service.js';

const AUTH_SQL = new URL('../src/features/auth/authentication.sql', import.meta.url);

/**
 * Asks a question in the terminal without showing what the user types.
 *
 * @param {string} question - Text shown before the input.
 * @returns {Promise<string>} What the user typed.
 */
function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (text) => {
      // Show the question, hide the typed characters.
      if (text.includes(question)) rl.output.write(text);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });
}

// 1. Create the login tables (each CREATE TABLE runs separately).
const sql = await readFile(AUTH_SQL, 'utf8');
const statements = sql
  .split(';')
  .map((part) => part.replace(/^\s*--.*$/gm, '').trim())
  .filter(Boolean);

for (const statement of statements) {
  await db.query(statement);
}
console.log('✔ Login tables are ready (auth_security, driver_applications).');

// 2. Find demo users that still have a fake password.
const [demoUsers] = await db.query(
  "SELECT user_id, email, role FROM users WHERE password_hash LIKE '$2b$10$DEMOHASH%'",
);

if (demoUsers.length === 0) {
  console.log('✔ No demo users with fake passwords left. Nothing to change.');
} else {
  console.log(`Demo users without a real password: ${demoUsers.map((u) => `${u.email} (${u.role})`).join(', ')}`);
  console.log('Password rule: 8–72 characters, with an uppercase letter, a lowercase letter and a number.');

  let password;
  for (;;) {
    password = await askHidden('Choose a password for these demo users: ');
    try {
      validatePassword(password);
      const again = await askHidden('Type it again: ');
      if (again === password) break;
      console.log('✘ The two passwords were different. Try again.');
    } catch (error) {
      console.log(`✘ ${error.message}`);
    }
  }

  const hash = await bcrypt.hash(password, 12);
  const ids = demoUsers.map((u) => u.user_id);
  await db.query('UPDATE users SET password_hash = ? WHERE user_id IN (?)', [hash, ids]);
  console.log(`✔ Password set for ${ids.length} demo users.`);
  console.log('  Passengers/Admin can now log in with their email (e.g. nusrat@juniv.edu) and this password.');
  console.log('  (Drivers log in with an email code instead, which needs SMTP settings.)');
}

await db.end();
