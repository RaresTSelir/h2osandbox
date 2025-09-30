# 🎨 Legacy HTML to Modern CSS Mapping System

Acest sistem automat convertește atributele HTML vechi în stiluri CSS moderne pentru ca JSP-urile să se afișeze corect în browserele moderne.

## 🚀 Funcționalitatea principală

Sistemul detectează și convertește automat următoarele atribute HTML vechi:

### 📋 Atribute suportate

#### Atribute de tabel
- `border="1"` → `border: 1px solid;`
- `cellspacing="0"` → `border-collapse: collapse; border-spacing: 0px;`
- `cellpadding="5"` → `padding: 5px;` (aplicat automat la `<td>` și `<th>`)
- `bordercolor="#CCCCCC"` → `border-color: #CCCCCC;`

#### Dimensiuni și poziționare
- `width="100%"` → `width: 100%;`
- `width="25"` → `width: 25px;`
- `height="35"` → `height: 35px;`

#### Aliniere
- `align="center"` → `text-align: center;`
- `align="left"` → `text-align: left;`
- `align="right"` → `text-align: right;`
- `align="absmiddle"` → `vertical-align: middle;`
- `valign="top"` → `vertical-align: top;`
- `valign="middle"` → `vertical-align: middle;`

#### Spațiere pentru imagini
- `hspace="10"` → `margin-left: 10px; margin-right: 10px;`
- `vspace="5"` → `margin-top: 5px; margin-bottom: 5px;`

#### Culori și fundal
- `bgcolor="#FFFFFF"` → `background-color: #FFFFFF;`
- `background="image.jpg"` → `background-image: url(image.jpg);`
- `color="#000000"` → `color: #000000;`

#### Fonturi
- `face="Arial"` → `font-family: Arial;`
- `size="3"` → `font-size: 16px;` (conversie HTML size la CSS)

### 🔧 Exemplu de conversie

**Înainte:**
```html
<table border="1" cellspacing="0" cellpadding="5" bordercolor="#CCCCCC" width="100%" align="center">
    <td class="titolotab" height="35" align="center">
        <img src="image.gif" width="25" height="22" hspace="10" align="absmiddle">
    </td>
</table>
```

**După conversie:**
```html
<table style="border: 1px solid; border-collapse: collapse; border-spacing: 0px; padding: 5px; border-color: #CCCCCC; width: 100%; text-align: center;">
    <td style="height: 35px; text-align: center; padding: 5px;" class="titolotab">
        <img style="width: 25px; height: 22px; margin-left: 10px; margin-right: 10px; vertical-align: middle;" src="image.gif">
    </td>
</table>
```

## ⚡ Integrare automată

Sistemul este integrat automat în:

1. **Universal JSP Watcher** (`universal-jsp-watcher.js`)
2. **Manual Sync** (`sync-now.js`)

### 📝 Utilizare

Sistemul funcționează automat - nu este nevoie de configurare suplimentară:

```bash
# Pornire sistem complet
npm run dev

# Sincronizare manuală
node sync-now.js
```

## 🎯 Caracteristici avansate

### Moștenirea `cellpadding`
Când un `<table>` are `cellpadding="5"`, toate celulele `<td>` și `<th>` din interiorul acestuia primesc automat `padding: 5px;`

### Păstrarea stilurilor existente
Dacă un element are deja un atribut `style`, sistemul îl păstrează și adaugă noile stiluri:

```html
<!-- Înainte -->
<td style="color: red;" align="center">

<!-- După -->
<td style="color: red; text-align: center;">
```

### Atribute păstrate
Anumite atribute cum ar fi `colspan` și `rowspan` sunt păstrate intact, deoarece nu au echivalent direct în CSS.

## 🔍 Testare

Pentru a testa sistemul:

```bash
# Test simplu
node test-mapper.js

# Test complex
node test-complex-mapper.js

# Test pentru bug-uri specifice
node test-css-fix.js
```

## 🎨 Rezultat

Pagina JSP va arăta exact cum ar arăta după deploy, cu toate stilurile HTML vechi convertite corect în CSS modern, asigurând compatibilitatea cu browserele moderne și renderarea corectă a layout-ului.

---

### 💡 Notă importantă

Acest sistem NU modifică fișierul JSP original - doar convertește output-ul pentru preview în browser. Fișierul JSP rămâne neschimbat și compatibil cu serverul Java/JSP.