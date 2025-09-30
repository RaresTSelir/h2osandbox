# Contributing to JSP Development Environment

## 🎯 Cum să contribui

Îți mulțumim pentru interesul de a contribui la acest proiect! Orice contribuție este binevenită.

### Tipuri de contribuții

- 🐛 **Bug reports**: Raportează probleme găsite
- ✨ **Feature requests**: Sugerează funcționalități noi
- 📝 **Documentation**: Îmbunătățiri la documentație
- 🔧 **Code contributions**: Contribuții de cod

### Proces de contribuție

1. **Fork** repository-ul
2. **Creează** un branch pentru modificarea ta:
   ```bash
   git checkout -b feature/numele-feature-ului
   ```
3. **Fă modificările** și testează-le:
   ```bash
   npm run dev
   ```
4. **Commit** modificările:
   ```bash
   git commit -am 'Add: descrierea modificării'
   ```
5. **Push** pe branch:
   ```bash
   git push origin feature/numele-feature-ului
   ```
6. **Deschide** un Pull Request

### Guidelines pentru cod

- Păstrează stilul de cod existent
- Testează modificările cu `npm run dev`
- Adaugă comentarii pentru logica complexă
- Actualizează documentația dacă e necesar

### Testing

Înainte de a face commit, testează:

```bash
# Testează instalarea
npm install

# Testează development mode
npm run dev

# Testează sync-ul manual
npm run sync-manual
```

### Raportarea bug-urilor

Când raportezi un bug, include:

- Versiunea Node.js: `node --version`
- Sistemul de operare
- Pașii pentru a reproduce problema
- Comportamentul așteptat vs cel actual
- Screenshot-uri dacă e relevant

### Feature requests

Pentru cereri de funcționalități noi:

- Explică cazul de utilizare
- Descrie soluția propusă
- Menționează alternative considerate
- Adaugă exemple dacă e posibil

## 📧 Contact

Pentru întrebări despre contribuții, deschide un issue în repository.

Mulțumim pentru contribuția ta! 🎉