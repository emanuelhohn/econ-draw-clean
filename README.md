# econ-draw

Excalidraw-basierte Zeichenfläche für den Wirtschaftsunterricht.
Lädt ein Angebot/Nachfrage-Diagramm als Template – Schüler können direkt darauf zeichnen.

## Lokal starten

```bash
npm install
npm run dev
```

## Auf GitHub Pages hosten

1. Repo auf GitHub erstellen, Code pushen
2. Settings → Pages → Source: **GitHub Actions**
3. Datei `.github/workflows/deploy.yml` anlegen (siehe unten), pushen
4. App läuft auf `https://DEIN-USERNAME.github.io/econ-draw/`

### .github/workflows/deploy.yml

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
        id: deployment
```
