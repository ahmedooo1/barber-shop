# Déploiement - GitHub + VPS (plusieurs sites sur la même machine)

Ce guide part du principe que votre VPS héberge déjà d'autres sites, avec
**nginx** (reverse proxy), **PM2** (gestion des process Node.js) et un
**serveur MySQL existant**. Chaque étape est conçue pour ne toucher à
aucun de vos sites/bases existants.

## 1. Mettre le code sur GitHub

À exécuter **sur votre PC**, dans le dossier du projet (pas besoin de
passer par un outil externe - c'est votre compte GitHub, vous devez vous
authentifier vous-même) :

```bash
cd "chemin/vers/Barber Shop"
git init
git add -A
git commit -m "Barber Shop - site complet Next.js"
```

Puis sur https://github.com/new, créez un dépôt vide (ex. `barber-shop`),
**sans** cocher "Add a README" (pour éviter un conflit avec le commit
déjà fait). Ensuite :

```bash
git remote add origin https://github.com/VOTRE-USER/barber-shop.git
git branch -M main
git push -u origin main
```

Le fichier `.gitignore` du projet exclut déjà `node_modules`, `.env`
(vos vrais secrets) et `data/` (anciennes données JSON avec infos
clients) - seul `.env.example` (le modèle, sans secrets) est committé.

## 2. Sur le VPS : cloner et configurer

```bash
cd /var/www   # ou l'emplacement où vivent vos autres sites
git clone https://github.com/VOTRE-USER/barber-shop.git
cd barber-shop
cp .env.example .env
nano .env   # renseignez les vraies valeurs (voir étape 3 pour MySQL)
npm install
```

## 3. Base de données : créer une base MySQL dédiée (sans toucher aux autres)

Connectez-vous à votre MySQL existant et créez une base et un
utilisateur **uniquement** pour le Barber Shop :

```sql
mysql -u root -p
```

```sql
CREATE DATABASE barbershop;
CREATE USER 'barbershop'@'localhost' IDENTIFIED BY 'CHOISISSEZ_UN_MOT_DE_PASSE_FORT';
GRANT ALL PRIVILEGES ON barbershop.* TO 'barbershop'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Dans `.env` :

```
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=barbershop
MYSQL_PASSWORD=CHOISISSEZ_UN_MOT_DE_PASSE_FORT
MYSQL_DATABASE=barbershop
MYSQL_SSL=false
```

Les tables sont créées automatiquement au premier démarrage - rien
d'autre à faire. Si vous avez d'anciennes données de test en JSON à
reprendre : `npm run migrate-json`.

Complétez aussi dans `.env` : `SITE_URL=https://barbershop.aaweb.fr`,
les identifiants SMTP (voir README), `ADMIN_USERNAME`/`ADMIN_PASSWORD` (ou
`ADMIN_PASSWORD_HASH` via `npm run hash-password -- "VotreMotDePasse"`),
et un `SESSION_SECRET` unique (`openssl rand -hex 32`).

## 4. Build et démarrage avec PM2

Le port choisi est **3005** (dans `ecosystem.config.js`) pour éviter tout
conflit avec vos autres sites. Vérifiez d'abord qu'il est libre :

```bash
sudo ss -tlnp | grep 3005
```

Si ce port est déjà utilisé par un autre site, changez la valeur dans
`ecosystem.config.js` (`args: "start -p XXXX"`) **et** dans
`nginx/barbershop.aaweb.fr.conf` (`proxy_pass http://127.0.0.1:XXXX`)
avant de continuer, avec le même nouveau numéro.

```bash
npm run build
pm2 start ecosystem.config.js
pm2 save
```

`pm2 save` met à jour la liste des process qui redémarrent
automatiquement avec le serveur - vos autres sites gérés par PM2 ne sont
pas affectés, seul le nouveau process "barbershop" est ajouté.

Vérifiez : `pm2 status` doit afficher "barbershop" à côté de vos autres
apps, chacune indépendante.

## 5. nginx : nouveau site, sans toucher aux autres

```bash
sudo cp nginx/barbershop.aaweb.fr.conf /etc/nginx/sites-available/barbershop.aaweb.fr.conf
sudo ln -s /etc/nginx/sites-available/barbershop.aaweb.fr.conf /etc/nginx/sites-enabled/
sudo nginx -t
```

`nginx -t` doit afficher "syntax is ok" / "test is successful" en
testant TOUTE la config nginx, y compris vos sites existants - si un
autre site avait déjà un souci, il apparaîtrait ici (mais votre nouveau
fichier n'y change rien). Puis :

```bash
sudo systemctl reload nginx
```

## 6. DNS

Chez votre gestionnaire DNS du domaine `aaweb.fr`, ajoutez un
enregistrement :

```
Type : A
Nom  : barbershop
Valeur : ADRESSE_IP_DE_VOTRE_VPS
```

(Le même VPS que vos autres sites : nginx redirige ensuite en interne
selon le nom de domaine demandé, `server_name`.)

## 7. HTTPS avec certbot (uniquement pour ce sous-domaine)

```bash
sudo certbot --nginx -d barbershop.aaweb.fr
```

Certbot ne modifie que le fichier nginx de `barbershop.aaweb.fr` (ajoute
le bloc `listen 443 ssl` et le renouvellement automatique) - il ne touche
pas aux certificats ni configs de vos autres domaines.

## 8. Vérification finale

- `pm2 status` → "barbershop" en ligne ("online"), à côté des autres.
- `pm2 logs barbershop` → pas d'erreur au démarrage.
- https://barbershop.aaweb.fr doit afficher le site en HTTPS.
- Testez une réservation + connexion admin (`/admin`) pour confirmer que
  MySQL fonctionne bien en production.

## Mises à jour futures

```bash
cd /var/www/barber-shop
git pull
npm install
npm run build
pm2 restart barbershop
```
