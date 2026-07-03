/**
 * Configuration PM2 pour le Barber Shop.
 *
 * Le nom "barbershop" et le port 3005 sont choisis pour ne pas entrer en
 * conflit avec vos autres sites sur le même VPS. Si le port 3005 est déjà
 * pris (vérifiez avec `sudo ss -tlnp | grep 3005`), changez la valeur ici
 * ET dans le fichier nginx correspondant (nginx/barbershop.aaweb.fr.conf).
 */
module.exports = {
  apps: [
    {
      name: "barbershop",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3005",
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
