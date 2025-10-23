/**
 * Planilha externa que será importada
 */
//const PLANILHA_EXTERNA_ID  =  "1lCzpK99jD0KnYJAkRWeE49Ppq8u1IR793sQJ1bn3N30";
const PLANILHA_EXTERNA_ID  =  "15McHyDXcDaUlLo_OwEB_1YDJVUTokQcCB6OH9THyWNI";
const PLANILHA_EXTERNA     =  SpreadsheetApp.openById(PLANILHA_EXTERNA_ID);

const TABELA_EXTERNA         =  PLANILHA_EXTERNA.getSheetByName('Página1');
const BUFFER_TABELA_EXTERNA  =  TABELA_EXTERNA.getDataRange().getDisplayValues().splice(1);

const NUM_CASOS_TABELA_EXTERNA  =  BUFFER_TABELA_EXTERNA.length;


const LINHA_INICIAL = 0;
const LINHA_FINAL = 99;

//const LINHA_INICIAL = 100;
//const LINHA_FINAL = 199;

//const LINHA_INICIAL = 200;
//const LINHA_FINAL = NUM_CASOS_TABELA_EXTERNA - 1;


/**
 * Função que importa os dados da planilha externa para a planilha CASOS, do sistema
 */
function importarPlanilhaExterna() {
  
  // Obtem os casos da planilha externa
  let casos = obterCasosPlanilhaExterna(LINHA_INICIAL, LINHA_FINAL);


  // Insere os casos na planilha interna do sistema
  casos.forEach( caso => {

    inserirNovoCaso( caso.referenciaFamiliar,
                     caso.tipoLogradouro,
                     caso.nomeLogradouro,
                     caso.numero,
                     caso.complemento,
                     caso.bairro,
                     caso.idRegional,
                     caso.cep,                          
                     caso.tpsa,
                     caso.dataDeChegadaNoCREAS,
                     caso.idsOrgaosEncaminhadores,
                     caso.dataPrevistaParaResposta,                          
                     caso.idsCategorias,
                     caso.idsParametros,
                     caso.observacao );

  }); // Fim do forEach 

} // Fim da função importarPlanilhaExterna



/**
 * Função que lê os dados da planilha externa e os retorna como um array de objects. 
 * 
 * A função lê apenas as linhas entre linhaInicial e linhaFinal, pois se a planilha 
 * for muito grande, o processo de importação da planilha completa pode exceder o 
 * tempo limite de 6 minutos de execução de uma função, imposto pelo Google App Script
 */
function obterCasosPlanilhaExterna( linhaInicial, linhaFinal ) {    

  // Teste se a planilha contém dados
  if( NUM_CASOS_TABELA_EXTERNA < 1 ) {
    console.log( "\n\nPLANILHA VAZIA\n\n" );
    return null;
  }

  // Obtém os casos da tabela externa
  let casos = [];
  let linhaCaso = [];
  
  for( let i=linhaInicial; i<=linhaFinal; ++i) {

    linhaCaso = BUFFER_TABELA_EXTERNA[i];

    casos.push(
      {        
        referenciaFamiliar: linhaCaso[REFERENCIA_FAMILIAR - 1],  
        tipoLogradouro: linhaCaso[TIPO_LOGRADOURO - 1],
        nomeLogradouro: linhaCaso[NOME_LOGRADOURO - 1],   
        numero: linhaCaso[NUMERO - 1],
        complemento: linhaCaso[COMPLEMENTO - 1], 
        bairro: linhaCaso[BAIRRO - 1],                     
        idRegional: codificarDados( BUFFER_REGIONAIS, linhaCaso[REGIONAL - 1] ),          
        cep: linhaCaso[CEP - 1],
        tpsa: linhaCaso[TPSA - 1],  
        dataDeChegadaNoCREAS: linhaCaso[DATA_DE_CHEGADA_NO_CREAS - 2],  
        idsOrgaosEncaminhadores: codificarDados( BUFFER_ORGAOS_ENCAMINHADORES, linhaCaso[ORGAOS_ENCAMINHADORES - 2] ),          
        dataPrevistaParaResposta: linhaCaso[DATA_PREVISTA_PARA_RESPOSTA - 2],
        dataDaUltimaResposta: linhaCaso[DATA_DA_ULTIMA_RESPOSTA - 2],                
        idsCategorias: codificarDados( BUFFER_CATEGORIAS, linhaCaso[CATEGORIAS_CASO - 6] ),           
        idsParametros: (linhaCaso[PARAMETROS_CASO - 7] != "") ? codificarDados( BUFFER_PARAMETROS, linhaCaso[PARAMETROS_CASO - 7] ) : "",
        observacao: linhaCaso[OBSERVACAO - 7]  
      }
    ); // Fim push

  } // Fim for

  // Retorna os casos
  return casos;

} // Fim da Função obterCasosPlanilhaExterna



/**
 * Função que retorna os ids dos dados passados como parâmetro, separados por ponto e vírgula.
 * Os dados podem ser Órgãos Encaminhadores, Categorias, Parâmetros.
 * 
 * @param {Array} Tabela de onde os ids dos dados serão obtidos (EX: BUFFER_CATEGORIAS, BUFFER_PARAMETROS )
 * @param {String} String de IDs separados por ponto e vírgula
 */
function codificarDados( tabela, dados ) {

  // Converte a string de dados para um array
  const arrayDados = dados.replace( /;/g, "" ).toLowerCase().split(",");

  // ids dos dados. Será retornado por essa função
  let ids = [];

  // Nome do dado, na tabela, em lower case
  let nomeLowerCase;

  // Número de linhas da tabela
  let numLinhasTabela = tabela.length;

  // Percorre o array de dados, obtendo os ids desses dados na tabela
  arrayDados.forEach( dado => {

    for( i=0; i<numLinhasTabela; ++i ) {

      nomeLowerCase = (tabela[i][NOME]).toLowerCase();
      if(nomeLowerCase == dado.trim()) {
        ids.push( tabela[i][ID] );
      }
    }

  }); // Fim do forEach

  // Transforma o array de ids em uma string com os ids separados por ponto e vírgula e a retorna
  return ids.sort( function(a, b){return a - b} ).join(";");

} // Fim da função codificarDados



/**
 *  #####  TESTES PARA AS FUNÇÕES DESSE MÓDULO  #####
 */



/**
 * Função para testar a função teste_codificarDados
 */
function teste_codificarDados() {

  let regional = 'VENDA NOVA';  
  let id = codificarDados( BUFFER_REGIONAIS, regional );
  console.log( "ID Regional: " + id );  

  let orgaosEncaminhadores = 'Disque 100, Outros Órgãos de Defesa de Direitos';  
  let ids = codificarDados( BUFFER_ORGAOS_ENCAMINHADORES, orgaosEncaminhadores );
  console.log( "IDs Orgãos Encaminhadores: " + ids );

  //let categorias = 'Crianças e Adolescentes , Mulheres Vítimas de Violência';
  let categorias = 'Crianças e Adolescentes; , Mulheres Vítimas de Violência';
  ids = codificarDados( BUFFER_CATEGORIAS, categorias );
  console.log( "IDs Categorias: " + ids );  

  let parametros = 'Cuidador familiar com algum transtorno mental e/ou uso abusivo com alcool ou outras drogas, Família reside fora de área CRAS, Violações se estendem a demais integrantes do núcleo familiar (criança/adolescente/idosos), Reside com agressor, Possui filhos crianças e/ou adolescentes';
  ids = codificarDados( BUFFER_PARAMETROS, parametros );
  console.log( "IDs Parâmetros: " + ids );    

} // Fim da função teste_codificarDados



function teste() {

  let linhaCaso64 = BUFFER_TABELA_EXTERNA[ 63 ];
  console.log( "Parâmetros L64: " + linhaCaso64[PARAMETROS_CASO - 7] );

  let linhaCaso65 = BUFFER_TABELA_EXTERNA[ 64 ];
  console.log( "\nParâmetros L65: " + linhaCaso65[PARAMETROS_CASO - 7] );  
}



