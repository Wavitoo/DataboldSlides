# DataboldSlides

![MIT License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/react-19.x-blue)
![Vite](https://img.shields.io/badge/vite-7.x-purple)

---

## Table of Contents

1. [Description](#description)
2. [Démarrage rapide](#démarrage-rapide)
3. [Fonctionnalités](#fonctionnalités)
   - [Édition de Slides](#édition-de-slides)
   - [Gestion des Éléments](#gestion-des-éléments)
   - [Export & Import](#export--import)
   - [Thèmes & Accessibilité](#thèmes--accessibilité)
4. [Prérequis](#prérequis)
5. [Installation](#installation)
6. [Structure du projet](#structure-du-projet)
7. [Contribution](#contribution)
8. [Démo en ligne](#démo-en-ligne)
9. [License](#license)
10. [Contributeur](#contributeur)

---

## Description

**DataboldSlides** est un éditeur de présentations moderne et intuitif, développé avec React, Vite, TailwindCSS et Shadcn.  
Il permet de créer, organiser et styliser des slides de façon professionnelle, avec une expérience utilisateur fluide et des fonctionnalités avancées (glisser-déposer, export PDF, thèmes, etc.).

---

## Démarrage rapide

1. **Créer une nouvelle slide** via la barre latérale.
2. **Double-cliquez** sur un texte pour l’éditer.
3. **Collez une image** depuis le presse-papier.
4. **Exportez** votre présentation en PDF ou JSON via le menu du haut.

---

## Fonctionnalités

### Édition de Slides

- **Ajout, suppression, duplication et réorganisation de slides** via la barre latérale.
- **Aperçu miniature** en temps réel de chaque slide.
- **Navigation rapide** entre les slides.

### Gestion des Éléments

- **Insertion et collage d’images** directement depuis le presse-papier ou par glisser-déposer.
- **Déplacement et redimensionnement** des éléments (texte, images) à la souris.
- **Raccourcis clavier** :  
  - `Ctrl+Z` / `Ctrl+Shift+Z` : Annuler/Rétablir  
  - `Ctrl+C` / `Ctrl+V` / `Ctrl+X` : Copier/Coller/Couper un élément  
  - `Ctrl+D` : Dupliquer  
  - Flèches : Déplacer l’élément sélectionné  
  - Suppr/Backspace : Supprimer  
  - Entrée : Éditer  
  - Échap : Désélectionner ou quitter l’édition

### Export & Import

- **Export PDF** : générez un PDF de votre présentation.
- **Export/Import JSON** : sauvegardez ou restaurez vos slides.

### Thèmes & Accessibilité

- **Mode sombre/clair** : basculez instantanément entre les thèmes.
- **Interface responsive** : utilisable sur desktop et mobile.
- **Composants accessibles** grâce à Radix UI.

---

## Prérequis

- Node.js (>= 18)
- npm (>= 9) ou yarn

---

## Installation

```bash
git clone https://github.com/Wavitoo/DataboldSlides
cd DataboldSlides
npm install
npm run dev
```

Ouvrez votre navigateur à l’adresse [http://localhost:5173](http://localhost:5173)

---

## Structure du projet

```
DataboldSlides/
├── public/                # Fichiers statiques
├── src/
│   ├── components/        # Composants React (SlideEditor, SlideContent, Sidebar, Toolbar, etc.)
│   ├── lib/               # Fonctions utilitaires
│   ├── index.css          # CSS principal (Tailwind)
│   └── main.jsx           # Point d’entrée de l’app
├── index.html             # Template HTML
├── package.json           # Dépendances et scripts
├── tailwind.config.js     # Config TailwindCSS
├── vite.config.js         # Config Vite
└── README.md              # Ce fichier
```

---

## Contribution

Les contributions sont les bienvenues !  
Merci de respecter la convention de commit [Conventional Commits](https://www.conventionalcommits.org/).  
Pour toute suggestion ou bug, ouvrez une issue sur [GitHub Issues](https://github.com/Wavitoo/DataboldSlides/issues).

---

## Démo en ligne

Essayez l’application ici : [https://databoldslides.netlify.app/](https://databoldslides.netlify.app/)  

---

## License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus d’informations.

---

## Contributeur

Projet réalisé par **Arslan TETU**.  
Pour toute question ou suggestion, contactez-moi à [arslan.tetu@epitech.eu](mailto:arslan.tetu@epitech.eu).

---