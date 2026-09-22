# Photos des agences

Ce dossier accueille les vraies photos des agences, publiées sur la page
Facebook Thiaguil Multi-services, une fois téléchargées et optimisées.

## 1. Récupérer une photo depuis Facebook

- Sur ordinateur : ouvrez la photo en grand sur la page Facebook, cliquez sur
  les trois points `···` en haut à droite de la photo, puis **Télécharger**.
- Sur mobile : appuyez longuement sur la photo dans l'app, ou ouvrez-la et
  utilisez le menu `···` > **Enregistrer la photo**.
- Utilisez uniquement des photos publiées par la page officielle de
  l'entreprise (jamais une photo trouvée ailleurs sur internet).

## 2. Optimiser la photo avant de l'ajouter

- Format recommandé : `.jpg` ou `.webp`.
- Dimensions recommandées : environ 1200 × 800 px (format paysage).
- Poids recommandé : moins de 300 Ko — utilisez un outil gratuit comme
  [Squoosh](https://squoosh.app) ou [TinyPNG](https://tinypng.com) pour
  compresser l'image sans perte visible de qualité.

## 3. Nommer et placer le fichier

Chaque agence a un identifiant fixe dans le code du site. Le fichier doit
être nommé exactement `<identifiant>.jpg` (ou `.webp`) et placé dans ce
dossier :

| Agence                          | Nom de fichier attendu            |
|----------------------------------|------------------------------------|
| Agence Centrale Hamdallaye       | `ag-hamdallaye.jpg`                |
| Agence Kipé Centre                | `ag-kipe.jpg`                      |
| Agence Bentouraya                 | `ag-bentouraya.jpg`                |
| Point Relais Kountia CBA          | `ag-kountia.jpg`                   |
| Agence Régionale Kindia           | `ag-kindia.jpg`                    |
| Agence Coyah Ville                | `ag-coyah.jpg`                     |
| Bureau International New York     | `ag-newyork.jpg`                   |
| Bureau International Montréal     | `ag-montreal.jpg`                  |

La photo de l'agence Hamdallaye (agence principale) sert aussi de photo pour
le bloc « Siège / Contact » de la section Contact du site.

## 4. Activer la photo dans le code

Déposer le fichier ici ne suffit pas encore : il faut indiquer son chemin
dans `src/data/initialData.ts`, sur l'agence correspondante, via le champ
optionnel `photoUrl`. Exemple pour l'agence Hamdallaye :

```ts
{
  id: 'ag-hamdallaye',
  name: 'Agence Centrale Hamdallaye',
  // ...
  photoUrl: '/photos/agences/ag-hamdallaye.jpg',
},
```

Tant que `photoUrl` n'est pas renseigné, ou si le fichier référencé est
introuvable, le site affiche automatiquement un emplacement réservé
clairement identifié (« Photo à venir ») à la place — jamais d'icône
d'image cassée pour les visiteurs.

Si vous préférez, envoyez-moi directement les photos téléchargées et je me
charge de l'optimisation, du nommage et de l'ajout des `photoUrl`
correspondants dans le code.
