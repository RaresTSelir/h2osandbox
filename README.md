# Universal JSP Development Environment

Un mediu de dezvoltare universal pentru orice fișier JSP cu live reload în browser.

## 🚀 Quick Start

### Prerequisite
- [Node.js](https://nodejs.org/) (versiunea 14 sau mai nouă)

### Instalare și utilizare

```bash
# 1. Clonează repository-ul
git clone https://github.com/username/universal-jsp-development.git
cd universal-jsp-development

# 2. Instalează dependențele
npm install

# 3. Adaugă fișierul tău JSP
# Drop orice fișier .jsp în folderul JSPUnderConstruction/

# 4. Pornește development mode
npm run dev
```

**Gata!** Browser-ul se va deschide automat și vei putea vedea orice fișier JSP în timp real.

## 📁 Drag & Drop JSP Development

### 🎯 Cum funcționează:
1. **Drop orice fișier JSP** în folderul `JSPUnderConstruction/`
2. **Rulează** `npm run dev`
3. **Editează** fișierul JSP
4. **Vezi modificările** instant în browser!

### 💡 Caracteristici universale:
- ✅ **Orice fișier JSP** - funcționează cu orice nume de fișier `.jsp`
- ✅ **Auto-detection** - detectează automat fișierul JSP din folder
- ✅ **Live reload** - modificările apar instant în browser
- ✅ **SuperCSS inclus** - stiluri H2O aplicabile automat
- ✅ **Legacy HTML Conversion** - convertește automat atributele HTML vechi în CSS modern
- ✅ **Cross-platform** - Windows, macOS, Linux

**Asta e tot!** Această comandă va:
- ⚡ Porni JSP watcher optimizat (sync în ~20ms)
- 🌐 Porni Browser Sync pe http://localhost:3000
- 🔄 Deschide browserul automat
- 👀 Monitoriza modificările JSP în timp real

## 📝 Cum să lucrezi:

1. **Pornește development mode**: `npm run dev`
2. **Editează**: `InserimentoNuovoMassimaleJSP.jsp`
3. **Salvează**: `Ctrl+S`
4. **Vezi modificările**: Instant în browser!

## ⚡ Optimizări pentru viteză:

- **JSP Sync**: ~20ms (ultra-rapid)
- **Browser Reload**: 100ms delay (foarte rapid)
- **Debouncing**: 200ms (fără flickering)
- **Polling**: 100ms interval (detectare rapidă)

## 🎯 Alternative rapide:

- `npm start` - Același lucru ca `npm run dev`
- `dev.bat` - Script batch pentru Windows
- `npm run sync-manual` - Sync manual dacă e nevoie

## 📁 Structura proiectului (curățată):

### 🎯 Fișiere esențiale:
- **`JSPUnderConstruction/`** - Folder pentru fișierele tale JSP
- **`SuperCSS.css`** - Stilurile aplicației (H2O theme)
- **`preview.html`** - Preview HTML sincronizat automat
- **`package.json`** - Configurația proiectului

### ⚙️ Fișiere de configurare:
- **`universal-jsp-watcher.js`** - Watcher universal pentru orice JSP
- **`legacy-html-mapper.js`** - Convertor HTML vechi → CSS modern
- **`optimized-bs-config.json`** - Browser Sync optimizat
- **`README.md`** - Documentația (acest fișier)
- **`LEGACY-HTML-MAPPING.md`** - Documentația sistemului de conversie HTML

### 🚀 Scripturi rapide:
- **`dev.bat`** - Script Windows pentru `npm run dev`
- **`sync-now.js`** - Sync manual de urgență cu conversie HTML

### 📦 Dependențe:
- **`node_modules/`** - Dependențele Node.js
- **`package-lock.json`** - Versiunile exacte ale dependențelor

## 🌐 Adrese:

- **Aplicația**: http://localhost:3002
- **Browser Sync UI**: http://localhost:3003

## 🎨 Sistem de Conversie HTML Vechi

Sistemul include un **convertor automat** care transformă atributele HTML vechi în CSS modern:

- `border="1"` → `border: 1px solid;`
- `cellpadding="5"` → `padding: 5px;`
- `align="center"` → `text-align: center;`
- `width="100%"` → `width: 100%;`

Vezi **[LEGACY-HTML-MAPPING.md](LEGACY-HTML-MAPPING.md)** pentru documentația completă.

## 🔧 Configurație optimizată:

- Detectare modificări: 100ms
- Sync JSP → HTML: ~20ms
- Conversie HTML vechi: ~3ms  
- Browser reload: 100ms
- Total timp modificare → browser: **~220ms**