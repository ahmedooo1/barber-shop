/**
 * Configuration PM2 pour le Barber Shop.
 *
 * Le nom "barbershop" et le port 3005 sont choisis pour ne pas entrer en
 * conflit avec vos autres sites sur le même VPS. Si le port 3005 est déjà
 * pris (vérifiez avec `sudo ss -tlnp | grep 3005`), changez la valeur ici
 * ET dans le fichier nginx correspondant (nginx/barbershop.aaweb.fr.conf).
 *
 * Next.js 16 exige Node >= 20.9. Si le Node système du VPS est plus
 * ancien (utilisé par d'autres sites), on pointe explicitement vers un
 * Node 20+ installé via nvm, sans toucher au Node système ni aux autres
 * apps PM2. Adaptez le chemin ci-dessous à la version réellement
 * installée (voir `nvm which 20`).
 */
module.exports = {
  apps: [
    {
      name: "barbershop",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3005",
      interpreter: "/home/debian/.nvm/versions/node/v20.20.2/bin/node",
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
