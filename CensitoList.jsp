<%@page import="it.sella.CaeEsercente.common.bean.Appartenenza"%>
<%@ taglib uri="/statemachine.tld" prefix="sm"%>
<%@ page import="it.sella.statemachine.*"%>
<%@ page import="java.util.*"%>
<%@page import="it.sella.CaeEsercente.common.helpers.Utils"%>
<%@page import="it.sella.CaeEsercente.censimento.bean.CensitoFilter"%>
<%@page import="it.sella.CaeEsercente.censimento.bean.CensitoSessionItem"%>
<%@page import="it.sella.CaeEsercente.censimento.bean.CensitoItemList"%>
<%@page import="it.sella.CaeEsercente.approvazioneEsercente.bean.AppEseAdeguataVerifica"%>
<%@page import="it.sella.acccl.IParere"%>
<%@page import="it.sella.CaeEsercente.common.helpers.HelperAcccl"%>
<html>
<head>
<title>H2O - Sella.it</title>
<link rel="stylesheet" href="/css/LayoutH2O.css" type="text/css">
<script language="JavaScript" src="/script/CaeEsercente/Utils.js"></script>
<script src="/Autenticazione/script/js_jspSupport1.js"></script>
<script language="JavaScript">
function ValidateForm(mainUrl, eventParamName, param1)
{
	var strDate = document.CensitoList.txtDataCensDaD.value + '/' +
		document.CensitoList.txtDataCensDaM.value + '/' +
		document.CensitoList.txtDataCensDaY.value;
	if (strDate.length != 2) {
		if (strDate.length != 10) {
			alert("Formato data censimento non valido");
			return false;
		}
		
		if (isDate(strDate) == false) {
			return false;
		}
	}
	strDate = document.CensitoList.txtDataCensAD.value + '/' +
		document.CensitoList.txtDataCensAM.value + '/' +
		document.CensitoList.txtDataCensAY.value;
	if (strDate.length != 2) {		
		if (strDate.length != 10) {
			alert("Formato data censimento non valido");
			return false;
		}
		if (isDate(strDate) == false) {
			return false;
		}
	}
	
	var strNumber = trim(document.CensitoList.txtPartitaIva.value);		
	if ((strNumber != "") && (isInteger(strNumber) == false)) {
		alert("Inserire un valore numerico per il campo Partita Iva");
		return false;
	}
	
	CallAddress(mainUrl, eventParamName, param1);
}

function CallAddress(mainUrl, eventParamName, param1) {
 	var separator = mainUrl.indexOf('?') > -1 ? '' : '?';
 	document.CensitoList.action = mainUrl + separator + escape(eventParamName) + param1;
 	document.CensitoList.submit();
}
</script>
</head>
<%
Exception exception = (Exception)request.getAttribute("sm.exception");
CensitoSessionItem censitoSessionItem = (CensitoSessionItem)request.getAttribute("censitoSessionItem");
List<CensitoItemList> lstCensitoItemList = (List<CensitoItemList>)request.getAttribute("lstCensitoItemList");
List<Appartenenza> lstAppartenenza = censitoSessionItem.getLstAppartenenza(); 
if (censitoSessionItem == null)
	censitoSessionItem = new CensitoSessionItem();
String errorMessage = censitoSessionItem.getErrorMessage();
CensitoFilter censitoFilter = censitoSessionItem.getCensitoFilter();
if (lstCensitoItemList == null)
	lstCensitoItemList = new ArrayList<CensitoItemList>();
if (censitoFilter == null)
	censitoFilter = new CensitoFilter();
if (lstAppartenenza == null)
	lstAppartenenza = new ArrayList<Appartenenza>();
%>
<body>
<form method="post" action="<sm:getMainURL/>" name="CensitoList" >
<table width="100%" align="center">
    <tr>
        <td class="OrizTitoloH2O" align="center">Censimento esercente</td>
    </tr>
    <tr>
        <td colspan="4"><br/></td>
    </tr>
</table>
<%
	if (exception != null) {
%>
<table border="1" cellspacing="0" cellpadding="5" bordercolor="#CCCCCC" align="center">
	<tr>
		<td class="titolotab" height="35" align="center"><img
			src="/img/h2o/triangolo.gif" width="25" height="22" hspace="10"
			align="absmiddle"><br/> <%=exception.getMessage()%>
		</td>
	</tr>
	<tr>
		<td colspan="2"><br/>
		</td>
	</tr>
    <tr>
		<td  align="center" class="VertDxBassa">
			<sm:includeIfEventAllowed eventName="Indietro" eventDescription="Indietro">
				<input type="Button" name="<sm:getEventParamName/>" value="<sm:getEventParamValue/>" 
					style="cursor:hand" class="Bottone" onClick="JavaScript:CallAddress('<sm:getMainURL/>', '<sm:getEventParamName/>', '')">
			</sm:includeIfEventAllowed>
		</td>
	</tr>	
</table>
<%
	} else {
%>
<table width="100%" align="center">
	<tr>
		<td colspan="2" class="TitoloH2O">Ricerca esercenti censiti</td>
    </tr>
   	<tr>
		<td class="VertSxBassa">Ragione sociale</td>
		<td class="VertDxBassa">
			<input type="text" size="50" maxlength="50" name="txtRagioneSociale" value="<%= (censitoFilter.getRagioneSociale() == null) ? "" : censitoFilter.getRagioneSociale() %>">
		</td>
	</tr>
   	<tr>
		<td class="VertSxBassa">Partita IVA</td>
		<td class="VertDxBassa">
			<input type="text" size="11" maxlength="11" name="txtPartitaIva" value="<%= (censitoFilter.getPartitaIva() == null) ? "" : censitoFilter.getPartitaIva() %>">
		</td>
	</tr>      		
    <tr>
      	<td class="VertSxBassa">Data censimento tra il</td>
      	<td class="VertDxBassa">
      		<table>
      			<tr>
      				<td>
       					<input type="text" onBlur="controlDay(this);" onKeyUp="changeFocusOffset (this, 2, 1);" size="2" maxlength="2" name="txtDataCensDaD" value="<%= (censitoFilter.getDataCensimentoDa() == null) ? "" : Utils.SubstringNoExceedStringLenght(censitoFilter.getDataCensimentoDa(), 6, 8) %>">
        			</td>
     				<td>/</td>
					<td>
       					<input type="text" onBlur="controlMonth(this);" onKeyUp="changeFocusOffset (this, 2, 1);" size="2" maxlength="2" name="txtDataCensDaM" value="<%= (censitoFilter.getDataCensimentoDa() == null) ? "" : Utils.SubstringNoExceedStringLenght(censitoFilter.getDataCensimentoDa(), 4, 6) %>">
        			</td>
      				<td>/</td>
      				<td>
       					<input type="text" onBlur="controlYear(this);" onKeyUp="changeFocusOffset (this, 4, 1);" size="4" maxlength="4" name="txtDataCensDaY" value="<%= (censitoFilter.getDataCensimentoDa() == null) ? "" : Utils.SubstringNoExceedStringLenght(censitoFilter.getDataCensimentoDa(), 0, 4) %>">
        			</td>
        			<td class="VertSxBassa">&nbsp;&nbsp; e il &nbsp;&nbsp;</td>
        			<td>
       					<input type="text" onBlur="controlDay(this);" onKeyUp="changeFocusOffset (this, 2, 1);" size="2" maxlength="2" name="txtDataCensAD" value="<%= (censitoFilter.getDataCensimentoA() == null) ? "" : Utils.SubstringNoExceedStringLenght(censitoFilter.getDataCensimentoA(), 6, 8) %>">
        			</td>
     				<td>/</td>
					<td>
       					<input type="text" onBlur="controlMonth(this);" onKeyUp="changeFocusOffset (this, 2, 1);" size="2" maxlength="2" name="txtDataCensAM" value="<%= (censitoFilter.getDataCensimentoA() == null) ? "" : Utils.SubstringNoExceedStringLenght(censitoFilter.getDataCensimentoA(), 4, 6) %>">
        			</td>
      				<td>/</td>
      				<td>
       					<input type="text" onBlur="controlYear(this);" onKeyUp="changeFocusOffset (this, 4, 1);" size="4" maxlength="4" name="txtDataCensAY" value="<%= (censitoFilter.getDataCensimentoA() == null) ? "" : Utils.SubstringNoExceedStringLenght(censitoFilter.getDataCensimentoA(), 0, 4) %>">
        			</td>	
        		</tr>
        	</table>
      	</td>
    </tr>
    <tr>
      	<td class="VertSxBassa">Gruppo Commerciale</td>
      	<td class="VertDxBassa">
        	<select name="cmbIdGruppo">
        		<option value="" <%= (censitoFilter.getIdGruppo() == null) ? "selected" : "" %>>Qualsiasi</option>
				<% for (int i=0; i<lstAppartenenza.size(); i++ ) { %>
					<option value=<%=lstAppartenenza.get(i).getIdgruppo() %> <%= ((censitoFilter.getIdGruppo() != null) && (censitoFilter.getIdGruppo().equals(lstAppartenenza.get(i).getIdgruppo()))) ? "selected" : "" %>><%=lstAppartenenza.get(i).getDescrizione() %></option>
				<%} %>        		
        	</select>
      	</td>			    
    </tr>
   	<tr>
		<td class="VertSxBassa">Stato</td>
		<td class="VertDxBassa">
			<select name="cmbIsLavoratoSccQa">
        		<option value="" <%= (censitoFilter.getIsLavoratoSccQa() == null) ? "selected" : "" %>>Qualsiasi</option>
				<option value="0" <%= ((censitoFilter.getIsLavoratoSccQa() != null) && (censitoFilter.getIsLavoratoSccQa().equals(new Long("0")))) ? "selected" : "" %>>Da lavorare</option>
      			<option value="1" <%= ((censitoFilter.getIsLavoratoSccQa() != null) && (censitoFilter.getIsLavoratoSccQa().equals(new Long("1")))) ? "selected" : "" %>>Lavorato</option>
			</select>
		</td>
	</tr>	
</table>
<sm:includeIfEventAllowed eventName="Filter" eventDescription="Ricerca">
<table width="100%" align="center">
     <tr>
		<td align="center" class="VertDxBassa">
			<input type="Button" name="<sm:getEventParamName/>" value="<sm:getEventParamValue/>" 
				style="cursor:hand" class="Bottone" onClick="JavaScript:ValidateForm('<sm:getMainURL/>', '<sm:getEventParamName/>', '')">
		</td>        		
     </tr>
</table>
</sm:includeIfEventAllowed>
<table align="center">
    <tr>
        <td colspan="31" >
            <br/>
        </td>
    </tr>
	<tr>
      	<td colspan="31" class="TitoloH2O">Elenco esercenti censiti</td>
    </tr>
	<%if (Utils.getEmptyString(errorMessage).equals("")) {%>    
		<tr align="center">
			<td class="VertSxAlta"><b>Operativit&agrave;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></td>
			<td class="VertSxAlta"><b>Lavorato</b></td>
			<td class="VertSxAlta"><b>AV PG</b></td>
			<td class="VertSxAlta"><b>CAC PG</b></td>
			<td class="VertSxAlta"><b>Rifiutato da CAC</b></td>
			<td class="VertSxAlta"><b>AV Legale</b></td>
			<td class="VertSxAlta"><b>CAC Legale</b></td>
			<td class="VertSxAlta"><b>Acc. Socio</b></td>
			<td class="VertSxAlta"><b>Urgente</b></td>			
			<td class="VertSxAlta"><b>Esid</b></td>
			<td class="VertSxAlta"><b>Ragione sociale</b></td>
			<td class="VertSxAlta"><b>Partita iva</b></td>
			<td class="VertSxAlta"><b>Codice agente</b></td>
			<td class="VertSxAlta"><b>B&B</b></td>
			<td class="VertSxAlta"><b>Id soggetto</b></td>
			<td class="VertSxAlta"><b>8 cifre</b></td>
			<td class="VertSxAlta"><b>Id soggetto legale</b></td>
			<td class="VertSxAlta"><b>8 cifre legale</b></td>	
			<td class="VertSxAlta"><b>Legale gi&agrave; collegato</b></td>
			<td class="VertSxAlta"><b>Id Doc Legale</b></td>
			<td class="VertSxAlta"><b>Data censimento</b></td>
			<td class="VertSxAlta"><b>Data stipula</b></td>			
			<td class="VertSxAlta"><b>Barcode contratto</b></td>
			<td class="VertSxAlta"><b>Barcode qa</b></td>
			<td class="VertSxAlta"><b>Barcode easynolo</b></td>
			<td class="VertSxAlta"><b>Barcode cartellino firma</b></td>
			<td class="VertSxAlta"><b>Est. p.v.</b></td>
			<td class="VertSxAlta"><b>Manual Entry</b></td>
			<td class="VertSxAlta"><b>Qa Errato</b></td>
			<td class="VertSxAlta"><b>Gruppo Commerciale</b></td>
		</tr>
		<% for (int i=0; i<lstCensitoItemList.size(); i++) {
				CensitoItemList c = lstCensitoItemList.get(i); 
				AppEseAdeguataVerifica av = c.getAppEseAdeguataVerifica();
				%>
				
			<%if (c.getIsLavoratoSccQa().equals(new Long("0"))) {%>
				<tr>
			<%} else { %>
				<tr style="color: gray;">
			<%} %>
				<td class="VertDxBassa">
					
					<%if ((! Utils.getEmptyString(c.getEsidQa()).equals("")) && (c.getIsQaAgenteErrato().equals(new Long("0")))) {%>
						<sm:includeIfEventAllowed eventName="CensimentoQaCae">
							<a href="<sm:getEventMainURL/>&esidQuestAr=<%= c.getEsidQa() %>&eventNameIndietro=Indietro">Quest AR Cae</a><br/>
						</sm:includeIfEventAllowed>
					<% } else if (c.isNewQuestionario()) {%>
						<sm:includeIfEventAllowed eventName="QuestionarioAr">
							<a href="<sm:getEventMainURL/>&esid=<%= c.getEsid() %>&questionarioType=<%=c.getQuestionarioType() %>">Quest AR Cae</a><br/>
						</sm:includeIfEventAllowed>
					<%} else {%>
						Quest AR Cae<br/>
					<%} %>
		           
					<sm:includeIfEventAllowed eventName="CensimentoSccCae">
						<%if (! Utils.getEmptyString(c.getEsidScc()).equals("")) {%>
							<a href="<sm:getEventMainURL/>&esidScc=<%= c.getEsidScc() %>">Scheda Cliente Cae</a><br/>
						<%} else {%>
							Scheda Cliente Cae<br/>
						<%} %>					
		            </sm:includeIfEventAllowed>
					<sm:includeIfEventAllowed eventName="CRMAntiriciclaggio">
						<%if (c.getIdSoggetto() != null) {%>
							<a href="<sm:getEventMainURL/>&idSoggCRMAntiric=<%= c.getIdSoggetto() %>">Quest AR H2O</a><br/>
						<%} else {%>
							Quest AR H2O<br/>
						<%} %>					
		            </sm:includeIfEventAllowed>
					<sm:includeIfEventAllowed eventName="CRMQuestionario">
						<%if (c.getIdSoggetto() != null) {%>
							<a href="<sm:getEventMainURL/>&idSoggCRMQuest=<%= c.getIdSoggetto() %>">Scheda Cliente H2O</a><br/>
						<%} else {%>
							Scheda Cliente H2O<br/>
						<%} %>					
		            </sm:includeIfEventAllowed>
		            <%if (c.getIsLavoratoSccQa().equals(new Long("0"))) {%>		       
			            <%if (av.getIsAdeguataVerificaAzDaAbilitare()) {%>	            
							<sm:includeIfEventAllowed eventName="AdeguataVerificaAz">
					        	<a href="<sm:getEventMainURL/>&idCensitoListAdVeAz=<%= c.getId() %>">Accettazione Az</a><br>
					        </sm:includeIfEventAllowed>
					    <%} %>
						<sm:includeIfEventAllowed eventName="AdeguataVerificaPf">
							<a href="<sm:getEventMainURL/>&idCensitoListAdVePf=<%= c.getId() %>">Accettazione Pf</a><br>
				        </sm:includeIfEventAllowed>
						<%for (int j=0; j<av.getLstQaSocioAbilitato().size(); j++) {%>
							<sm:includeIfEventAllowed eventName="AdeguataVerificaPfSocio">
								<a href="<sm:getEventMainURL/>&idAdegVerPfSocio=<%= av.getLstQaSocioAbilitato().get(j).getId_soci_dett() %>&esidPosition=<%= c.getEsid() %>">Accettazione Socio <%=av.getLstQaSocioAbilitato().get(j).getCodice_fiscale() %></a><br>
					        </sm:includeIfEventAllowed>
						<%}%>
					<%} %>		
		            <%if ((Utils.getEmptyString(c.getIdGruppo()).equals("02") == false) 
		            		&& (Utils.getEmptyString(c.getIdGruppo()).equals("08") == false)) { %>
			            <a href="#" onclick="window.open('/H2O/CaeCensimento/CensimentoPrintPdf.jsp?esid=<%= c.getEsid() %>&tipoContratto=POS','','')">Visualizza Contr Pos</a><br>
			            <a href="#" onclick="window.open('/H2O/CaeCensimento/CensimentoPrintPdf.jsp?esid=<%= c.getEsid() %>&tipoContratto=QAR','','')">Visualizza Qar</a><br>
			            <a href="#" onclick="window.open('/H2O/CaeCensimento/CensimentoPrintPdf.jsp?esid=<%= c.getEsid() %>&tipoContratto=EASYNOLO','','')">Visualizza Contr EN</a><br>
					<%} %>					
		        </td>
				<%if (c.getIsLavoratoSccQa().equals(new Long("0"))) {%>
					<td class="VertDxBassa">
						<sm:includeIfEventAllowed eventName="CensitoListEditLavorato">
							<input type="checkbox" name="<%="chkLavoratoSccQa" + c.getId()%>" onclick="CallAddress('<sm:getMainURL/>', '<sm:getEventParamName/>', '&idCensitoList=<%= c.getId() %>')">
						</sm:includeIfEventAllowed>
					</td>
				<%} else { %>
					<td class="VertDxBassa">
						<sm:includeIfEventAllowed eventName="CensitoListEditLavorato">
							<input type="checkbox" name="<%="chkLavoratoSccQa" + c.getId()%>" checked="checked" disabled="disabled" onclick="CallAddress('<sm:getMainURL/>', '<sm:getEventParamName/>', '&idCensitoList=<%= c.getId() %>')">
						</sm:includeIfEventAllowed>
					</td>
				<%} %>
	           	<%if (av.getPraticaAccclAz() != null) {%>
	           		<td class="VertDxBassa"><%=av.getPraticaAccclAz().getStatoPratica()%></td>
				<%} else { %>
					<td class="VertDxBassa">&nbsp;</td>
	           	<%} %>
	           	<td class="VertDxBassa">
	           		<% List<IParere> lstIParereAz = HelperAcccl.getParereByPratica(av.getPraticaAccclAz()); 
					%>
	           		<%for (int j=0; j<lstIParereAz.size(); j++) { %>
	           			<%= lstIParereAz.get(j).getLivelloParere() %>:&nbsp;
	           			<%if (lstIParereAz.get(j).isAccettato()) {%>
	           				accettato
	           			<%} %>
	           			<br>
	           		<% } %>
	           	</td>
				<%if (av.getIsProdottoPosRifiutato()) {%>
					<td class="VertDxBassa">Si</td>
				<%} else { %>
					<td class="VertDxBassa">No</td>
				<%} %>			
	           	<%if (av.getPraticaAccclPf() != null) {%>
	           		<td class="VertDxBassa"><%=av.getPraticaAccclPf().getStatoPratica()%></td>
				<%} else { %>
					<td class="VertDxBassa">&nbsp;</td>
	           	<%} %>
	           	<td class="VertDxBassa">
	           		<% List<IParere> lstIParerePf = HelperAcccl.getParereByPratica(av.getPraticaAccclPf()); 
					%>
	           		<%for (int j=0; j<lstIParerePf.size(); j++) { %>
	           			<%= lstIParerePf.get(j).getLivelloParere() %>:&nbsp;
	           			<%if (lstIParerePf.get(j).isAccettato()) {%>
	           				accettato
	           			<%} %>
	           			<br>
	           		<% } %>
	           	</td>
	           	<td class="VertDxBassa"><table>
				<%for (int j=0; j<av.getLstQaSocioAbilitato().size(); j++) {%>
					<tr>
		           	<%if (av.getLstQaSocioAbilitato().get(j).getPraticaAccclPf() != null) {%>
		           		<td class="VertDxBassa">Socio <%=av.getLstQaSocioAbilitato().get(j).getCodice_fiscale()%> Stato: <%=av.getLstQaSocioAbilitato().get(j).getPraticaAccclPf().getStatoPratica()%></td>
					<%} else { %>
						<td class="VertDxBassa">Socio <%=av.getLstQaSocioAbilitato().get(j).getCodice_fiscale()%> Stato: </td>
		           	<%} %>
			           	<td class="VertDxBassa">
			           		<% List<IParere> lstIParerePfSocio = HelperAcccl.getParereByPratica(av.getLstQaSocioAbilitato().get(j).getPraticaAccclPf()); 
							%>
			           		<%for (int z=0; z<lstIParerePfSocio.size(); z++) { %>
			           			<%= lstIParerePfSocio.get(z).getLivelloParere() %>:&nbsp;
			           			<%if (lstIParerePfSocio.get(z).isAccettato()) {%>
			           				accettato
			           			<%} %>
			           			<br>
			           		<% } %>
			           	</td>
		           	</tr>
				<%}%>
				</table></td>
	           	<% if(c.getIsInstalUrgente().equals(new Long("1"))) {%>
	           		<td class="VertDxBassa">Si</td>
	           	<%} else { %>
	           		<td class="VertDxBassa">No</td>
	           	<%} %>				
				<td class="VertDxBassa"><%=c.getEsid()%></td>
				<td class="VertDxBassa"><%=c.getRagioneSociale()%></td>
				<td class="VertDxBassa"><%=c.getPartitaIva()%></td>
				<td class="VertDxBassa"><%=c.getCodiceAgente()%></td>
				<%if (c.getIsBedAndBreakfast().equals(Long.valueOf(0))) {%>
					<td class="VertDxBassa">No</td>
				<%} else { %>
					<td class="VertDxBassa">Si</td>
				<%} %>
				<td class="VertDxBassa"><%=c.getIdSoggetto()%></td>
				<td class="VertDxBassa"><%=c.getConto8cifre()%></td>
				<td class="VertDxBassa"><%=c.getIdSoggettoPf()%></td>
				<td class="VertDxBassa"><%=c.getConto8cifrePf()%></td>
				<%if (av.getIsIdSoggettPfCollegatoIdSoggettoAz()) {%>
					<td class="VertDxBassa">Si</td>
				<%} else { %>
					<td class="VertDxBassa">No</td>
				<%} %>
				<td class="VertDxBassa"><%=c.getId_doc_pf()%></td>					
				<td class="VertDxBassa"><%=c.getDataInserimento()%></td>
				<td class="VertDxBassa"><%=c.getDataFirma()%></td>
				<td class="VertDxBassa"><%=c.getBarcodeContratto()%></td>
				<td class="VertDxBassa"><%=c.getBarcodeQa()%></td>
				<td class="VertDxBassa"><%=c.getBarcodeContrattoEN()%></td>
				<td class="VertDxBassa"><%=c.getBarcodeCartellinoFirma()%></td>
				<%if (c.getIsExtPuntoVendita().equals(new Long("0"))) {%>
					<td class="VertDxBassa">No</td>
				<%} else { %>
					<td class="VertDxBassa">Si</td>
				<%} %>
				<%if ((c.getManualEntry() != null) && (c.getManualEntry().equals(new Long("1")))) { %>
					<td class="VertDxBassa">Si</td>
				<%} else { %>
					<td class="VertDxBassa">No</td>
				<%} %>				
				<%if (c.getIsQaAgenteErrato().equals(new Long("1"))) { %>
					<td class="VertDxBassa">Si</td>
				<%} else { %>
					<td class="VertDxBassa">&nbsp;</td>
				<%} %>	
				<td class="VertDxBassa"><%=c.getDescrizioneGruppo()%></td>
			</tr>
		<%} %>
	<%} else {%>
		<tr>
			<td colspan="23" class="titolotab" height="35" align="center">
				<img src="/img/h2o/triangolo.gif" width="25" height="22" hspace="10"
					align="absmiddle"><br/><%=errorMessage %>
			</td>
		</tr>
	    <tr>
	        <td >
	            <br/>
	        </td>
	    </tr>	
	<%} %>
</table>
<table align="center">
    <tr>
        <td >
            <br/>
        </td>
    </tr>
    <tr>
		<td  align="center" class="VertDxBassa">
			<sm:includeIfEventAllowed eventName="Indietro" eventDescription="Indietro">
				<input type="Button" name="<sm:getEventParamName/>" value="<sm:getEventParamValue/>" 
					style="cursor:hand" class="Bottone" onClick="JavaScript:CallAddress('<sm:getMainURL/>', '<sm:getEventParamName/>', '')">
			</sm:includeIfEventAllowed>
		</td>
	</tr>
</table>
<%
}
%>
</form>
</body>
</html>