/**
 * Génère un hash bcrypt à partir d'un mot de passe en clair, à coller
 * dans .env sous ADMIN_PASSWORD_HASH.
 *
 * Usage : node scripts/hash-password.js "MonMotDePasse123!"
 */
const bcrypt = require("bcryptjs");

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.js \"MonMotDePasse\"");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\nAjoutez cette ligne dans votre fichier .env :\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
