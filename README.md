# Portfolio — Nazim Mellouk

## Structure des fichiers

```
portfolio/
├── index.html          → Page principale
├── style.css           → Design system complet
├── script.js           → Interactivité + accessibilité
├── README.md           → Ce fichier
└── assets/
    ├── images/         → Mettre vos images ici (voir ci-dessous)
    └── icons/          → Favicon
```

## Images à fournir (toutes au format PNG)

Placer les fichiers suivants dans `assets/images/` :

| Fichier | Contenu | Dimensions recommandées |
|---|---|---|
| `photo-nazim.png` | **Votre photo professionnelle** (carrée, fond uni clair, sourire, tenue correcte) | 480×480 px minimum |
| `projet-cbf.png` | Capture de la page d'accueil du site CBF | 1280×720 px (ratio 16:9) |
| `projet-rse.png` | Capture de l'interface de la plateforme RSE | 1280×720 px (ratio 16:9) |
| `projet-managepass.png` | Capture/mockup de l'écran ManagePass | 1280×720 px (ratio 16:9, encadrer la capture mobile dans le cadre) |
| `projet-unispourelle.png` | Capture de la maquette Unis Pour Elle | 1280×720 px (ratio 16:9) |
| `og-image.png` | Image affichée lors du partage du lien (LinkedIn, etc.) | 1200×630 px |

> Si une image est manquante, le portfolio affiche un fallback élégant automatiquement.

## Favicon

Placer dans `assets/icons/` :
- `favicon.png` — 512×512 px, carré, fond plein (pas de transparence nécessaire)

Le lien est déjà présent dans le `<head>` de `index.html` :
```html
<link rel="icon" type="image/png" href="assets/icons/favicon.png" />
<link rel="apple-touch-icon" href="assets/icons/favicon.png" />
```

## CV PDF

Le CV est actuellement lié en externe (lien direct vers le serveur Paris 8). Si l'URL change,
mettre à jour les liens correspondants dans `index.html`.

## Déploiement

**Serveur universitaire Paris 8 :**
Uploader tout le dossier dans `~/portfolio-nazimmellouk/`

**GitHub Pages :**
```bash
git init
git add .
git commit -m "Portfolio initial"
git branch -M main
git remote add origin https://github.com/Nazim-M999/portfolio.git
git push -u origin main
# Activer GitHub Pages dans Settings > Pages > main branch
```

**Netlify / Vercel :**
Drag & drop le dossier dans l'interface, c'est tout.

## Accessibilité

Ce portfolio est conçu pour respecter :
- RGAA 4.1
- WCAG 2.2 niveau AA
- WAI-ARIA

Vérifier avec WAVE ou Axe DevTools après déploiement.

## Personnalisation

Modifier les variables CSS dans `:root` dans `style.css` pour changer couleurs et typographie.
