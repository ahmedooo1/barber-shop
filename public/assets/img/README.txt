DOSSIER IMAGES - Barber Shop
=============================

Le site est actuellement 100% autonome : il n'utilise aucune photo externe.
Tous les visuels (icônes, textures, dégradés) sont générés en CSS/SVG afin
que le site reste rapide, fiable, et ne dépende d'aucun lien externe cassable.

Pour ajouter de vraies photos du salon (recommandé pour la mise en ligne finale) :

1. Déposez vos fichiers ici, par exemple :
   - hero-salon.jpg, portrait-karim.jpg, galerie-01.jpg ... galerie-08.jpg

2. Formats conseillés : .jpg/.webp compressés (< 300 Ko/photo).

3. Utilisez le composant <Image> de Next.js (import Image from "next/image")
   pour bénéficier de l'optimisation automatique, du lazy-loading et du
   redimensionnement responsive :

     import Image from "next/image";
     <Image src="/assets/img/hero-salon.jpg" alt="Salon Barber Shop" width={800} height={1000} />

4. Remplacez les blocs .hero-visual, .avatar et .tile dans les pages
   correspondantes (app/page.js, app/equipe/page.js, app/galerie/page.js).

Aucune de ces étapes n'est obligatoire pour que le site fonctionne.
