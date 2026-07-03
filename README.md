# Barber Shop - Site & système de réservation (Next.js)

Application complète : site vitrine + réservation en ligne + panneau
d'administration, construite avec un vrai framework moderne (Next.js /
React) et un vrai backend (API routes + stockage + envoi d'e-mails).
Aucun plan payant, aucun plafond artificiel de type "250 envois/mois".

## Stack technique

- **Next.js 16 (App Router)** + **React 19** - framework full-stack :
  le même projet sert les pages ET l'API.
- **Route Handlers** (`app/api/**/route.js`) - endpoints REST pour les
  réservations, les messages de contact et l'administration.
- **Base de données MySQL** (`lib/db.js` + `lib/mysql.js`, via `mysql2`) -
  tables créées automatiquement au démarrage, aucune migration manuelle.
  Compatible avec tout hébergeur MySQL (voir section Déploiement).
- **Nodemailer + SMTP Gmail** - notification par e-mail à chaque
  réservation/message, gratuite et pratiquement illimitée (limites
  normales d'envoi Gmail, très largement suffisantes pour un salon).
- **Sessions admin signées (HMAC)** + **bcrypt** pour le mot de passe -
  aucune dépendance de session lourde, cookie httpOnly sécurisé.
- **Sécurité** : en-têtes HTTP (`next.config.mjs`), rate-limiting sur
  les formulaires, piège à robots (honeypot), validation stricte des
  champs, échappement HTML dans les e-mails.
- **next/font** (Playfair Display + Poppins) - polices auto-hébergées
  par Next.js au moment du build (aucune requête vers Google Fonts au
  chargement de page, contrairement à un lien CDN classique).

## Structure

```
app/
  page.js                Accueil
  services/page.js       Services & tarifs
  galerie/page.js         Savoir-faire (avec filtre interactif)
  equipe/page.js          Équipe
  avis/page.js            Avis clients
  reservation/page.js     Formulaire de réservation
  contact/page.js         Formulaire de contact
  admin/page.js           Tableau de bord (protégé)
  admin/login/page.js     Connexion admin
  api/reservations/route.js   Création de réservation (public)
  api/contact/route.js         Envoi de message (public)
  api/admin/login/route.js     Connexion (public, limité en débit)
  api/admin/logout/route.js
  api/admin/reservations/[id]/route.js   Changement de statut (protégé)
  api/admin/messages/[id]/route.js        Marquer comme lu (protégé)
components/       Composants réutilisables (Header, Footer, formulaires...)
lib/               Logique métier (db MySQL, mailer, session, validation, rate-limit)
public/            Fichiers statiques (dont assets/img pour vos photos)
data/              Anciens fichiers JSON (avant migration MySQL, gitignorés)
scripts/hash-password.js             Génère un hash bcrypt pour le mot de passe admin
scripts/migrate-json-to-mysql.js     Importe les anciennes données JSON dans MySQL
```

## Installation & lancement en local

```bash
npm install
cp .env.example .env
# éditez .env avec vos vraies valeurs (voir section suivante)
npm run dev
```

Le site est alors sur http://localhost:3000, l'admin sur
http://localhost:3000/admin (identifiants définis dans `.env`).

### MySQL local

Pour un vrai MySQL en local pendant le développement, lancez le service
fourni dans `docker-compose.yml` :

```bash
docker compose up -d mysql
```

Le projet est déjà configuré pour se connecter à `127.0.0.1:3307` avec
les identifiants `barber` / `barberpass` et la base `barbershop`.
Les tables sont créées automatiquement au premier accès.

## Configuration de la base de données MySQL (obligatoire)

Les réservations et messages sont stockés dans MySQL. Les tables sont
créées automatiquement au premier démarrage : il suffit de renseigner
les identifiants de connexion dans `.env`, aucune commande SQL manuelle
n'est nécessaire.

**Hébergeurs MySQL gratuits (sans carte bancaire), au choix :**
- [Aiven](https://aiven.io/free-tier) - MySQL managé, toujours gratuit
  (pas un essai limité dans le temps).
- [TiDB Serverless](https://www.pingcap.com/blog/beyond-planetscale-a-guide-to-choosing-your-next-free-dbaas/) -
  compatible protocole MySQL, gratuit, jusqu'à 5 bases.
- Ou un MySQL déjà inclus sur votre hébergeur (Render, VPS, etc.).

Une fois la base créée, complétez dans `.env` soit `MYSQL_URL` (si
l'hébergeur fournit une URL de connexion unique), soit les variables
séparées `MYSQL_HOST` / `MYSQL_PORT` / `MYSQL_USER` / `MYSQL_PASSWORD` /
`MYSQL_DATABASE`. Si l'hébergeur exige une connexion chiffrée (fréquent
sur les offres gratuites), passez `MYSQL_SSL=true`.

**Migration des anciennes données JSON** (si vous avez des réservations
enregistrées avant ce changement, dans `data/reservations.json` et
`data/messages.json`) :

```bash
npm run migrate-json
```

## Configuration de l'envoi d'e-mails (obligatoire pour les notifications)

1. Sur le compte Gmail qui doit recevoir les notifications
   (`quickserve76@gmail.com`), activez la validation en 2 étapes.
2. Rendez-vous sur https://myaccount.google.com/apppasswords et créez un
   "mot de passe d'application" (16 caractères).
3. Dans `.env` : `SMTP_USER` = l'adresse Gmail, `SMTP_PASS` = ce mot de
   passe d'application, `NOTIFY_EMAIL` = l'adresse qui doit recevoir les
   notifications (peut être différente de `SMTP_USER`).

Sans configuration SMTP, l'application continue de fonctionner
normalement (les réservations/messages sont bien enregistrés et
visibles dans `/admin`) mais aucun e-mail n'est envoyé - un message
l'indique dans les logs du serveur.

## Panneau d'administration

Accessible sur `/admin` (redirige vers `/admin/login` si non connecté).
Permet de :
- voir toutes les réservations (nom, contact, prestation, date/heure)
  et changer leur statut (en attente / confirmée / annulée) ;
- voir tous les messages de contact et les marquer comme lus.

Pour définir un mot de passe admin sécurisé (recommandé) :

```bash
npm run hash-password -- "VotreMotDePasse"
```

Copiez le résultat dans `.env` sous `ADMIN_PASSWORD_HASH` (à privilégier
plutôt que `ADMIN_PASSWORD` en clair).

## Déploiement

Le site est déployé sur **barbershop.aaweb.fr**, sur le VPS existant
(plusieurs sites déjà hébergés dessus, via nginx + PM2 + MySQL). Le
guide complet, pas à pas, est dans **[DEPLOY_VPS.md](./DEPLOY_VPS.md)**
(GitHub → clonage sur le VPS → base MySQL dédiée → PM2 → nginx → DNS →
HTTPS), avec les fichiers `ecosystem.config.js` (PM2) et
`nginx/barbershop.aaweb.fr.conf` déjà prêts à l'emploi.

### Alternatives gratuites (hébergement externe)

Si vous préférez ne pas utiliser le VPS pour ce site, ces options
fonctionnent aussi sans configuration serveur à gérer :

**Vercel** (créateur de Next.js, offre gratuite
pérenne) :
1. Créez un dépôt Git (GitHub/GitLab) avec ce projet.
2. Sur https://vercel.com, "Add New Project" → importez le dépôt.
3. Renseignez les variables d'environnement du fichier `.env` dans
   l'onglet "Environment Variables" du projet Vercel (notamment
   `SITE_URL=https://barbershop.aaweb.fr`).
4. Déployez : Vercel construit et héberge automatiquement l'app sur une
   URL temporaire (ex. `barber-shop.vercel.app`).
5. Domaine personnalisé : dans "Settings → Domains" du projet, ajoutez
   `barbershop.aaweb.fr`. Vercel indique alors un enregistrement DNS à
   créer (type `CNAME`, nom `barbershop`, valeur `cname.vercel-dns.com`).
   Ajoutez cet enregistrement chez le gestionnaire DNS du domaine
   `aaweb.fr`. Le certificat HTTPS est généré automatiquement une fois le
   DNS propagé (quelques minutes à quelques heures).

**Alternative - Render.com** (offre gratuite "Web Service") :
1. Créez un compte, "New Web Service" → connectez le dépôt.
2. Build command : `npm install && npm run build`
3. Start command : `npm run start`
4. Renseignez les mêmes variables d'environnement (`SITE_URL` inclus).
5. Domaine personnalisé : "Settings → Custom Domains", ajoutez
   `barbershop.aaweb.fr`, puis créez chez le gestionnaire DNS de
   `aaweb.fr` l'enregistrement `CNAME` indiqué par Render pour ce
   sous-domaine.

**Stockage** : les données vivent désormais dans MySQL (voir section
dédiée plus haut), pas sur le disque du serveur - le site fonctionne donc
sans problème sur Vercel (serverless) comme sur Render ou un VPS, tant
que la base MySQL choisie est joignable depuis l'hébergeur.

## Personnalisation

- **Couleurs / design** : variables CSS en haut de `app/globals.css`.
- **Textes, tarifs, équipe, avis** : directement dans les fichiers de
  `app/*/page.js` (données déclarées en haut de chaque fichier).
- **Photos réelles** : voir `public/assets/img/README.txt`.
- **Carte Google Maps** : remplacer le bloc `.map-box` dans
  `app/contact/page.js` par un `<iframe>` Google Maps.

## Contenu actuel

Toutes les informations (adresse, téléphone, horaires, tarifs, avis,
équipe) sont des exemples réalistes à remplacer par les vraies données
du salon avant mise en ligne définitive.
