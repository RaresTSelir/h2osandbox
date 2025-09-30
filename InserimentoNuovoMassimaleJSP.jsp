<%@ taglib uri="/statemachine.tld" prefix="sm"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>

<%@ page import="java.util.*"%>
<%@ page import="java.math.BigDecimal"%>
<%@ page import="it.sella.statemachine.*"%>
<%@ page import="it.sella.CaeEsercente.common.bean.LimiteBimestraleGlobale"%>
<%@ page import="it.sella.CaeEsercente.common.bean.EsercenteMoto"%>
<%@ page import="it.sella.CaeEsercente.common.helpers.Utils"%>
<%@ page import="it.sella.CaeEsercente.limiteBimestraleGlobale.AjaxService"%>

<!DOCTYPE html>
<html>
<head>
    <title>Inserimento Nuovo Massimale</title>
    <link rel="stylesheet" type="text/css" href="SuperCSS.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1 class="TitoloH2O">Inserimento Nuovo Massimale 1 - MODIFICARE RARES</h1>
    
    <div class="OrizTitoloH2O">Dettagli Massimale</div>
    
    <table>
        <tr>
            <td class="VertSxAlta">Nome:</td>
            <td class="VertDxBassa"><input type="text" class="testocombo" placeholder="Inserisci nome" /></td>
        </tr>
        <tr>
            <td class="VertSxAlta">Valore:</td>
            <td class="VertDxBassa"><input type="number" class="testocombo" placeholder="0.00" /></td>
        </tr>
        <tr>
            <td class="VertSxAlta">Valore nuova:</td>
            <td class="VertDxBassa"><input type="number" class="testocombo" placeholder="0.00" /></td>
        </tr>
        <tr>
            <td class="VertSxAlta">Valore nuova2:</td>
            <td class="VertDxBassa"><input type="number" class="testocombo" placeholder="0.00" /></td>
        </tr>
        <tr>
            <td class="VertSxAlta">Valore nuova3:</td>
            <td class="VertDxBassa"><input type="number" class="testocombo" placeholder="0.00" /></td>
        </tr>
        <tr>
            <td class="VertSxAlta">Valore nuova4:</td>
            <td class="VertDxBassa"><input type="number" class="testocombo" placeholder="0.00" /></td>
        </tr>
    </table>
    
    <br>
    <button class="Bottone">Salva Massimale</button>
    <button class="btn">Annulla</button>
    
</body>
</html>