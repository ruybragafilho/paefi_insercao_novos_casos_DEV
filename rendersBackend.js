"use strict";
    


/**
 * Gerador de Checkbox
 *
 * @param {Array} tabela - Tabela de onde os ids e os nomes das opções serão lidos
 * @param {String} idCheckBox - O id do checkbox que será gerado
 * @param {Integer} inline - 1 se o checkbox a ser gerado for inline, 0 caso contrário
 */
function gerarCheckBox( tabela, idCheckBox, inline ) {
 
  // Gera, dinamicamente, as opções do Check Box
  let checkBoxGerado = "";
  let idItem;
  let classInline = inline ? "form-check-inline" : "";

  tabela.forEach( item => {

    if( parseInt( item[ATIVO] ) == 1 ) {

      idItem = idCheckBox + item[ID];

      checkBoxGerado += 
      `<div class="form-check ${classInline}">
         <input class="form-check-input" type="checkbox" name="${idCheckBox}" id="${idItem}" value="${item[ID]}">
         <label class="form-check-label" for="${idItem}">${item[NOME]}</label>
       </div>`;

    }
  }); // Fim do tabela.forEach
      
  return checkBoxGerado;

} // Fim da função gerarCheckBox



/**
 * Gerador de Checkbox no formato de tabela
 *
 * @param {Array} tabela - Tabela de onde os ids e os nomes das opções serão lidos
 * @param {String} idCheckBox - O id do checkbox que será gerado
 * @param {Number} numColunas - Número de colunas na tabela de checkbox
 * 
 */
function gerarCheckBoxTable( tabela, idCheckBox, numColunas ) {

  
  if( numColunas < 1 ) {
    numColunas = 1;
  }

  let i = 0;
  let larguraColuna = 12 / numColunas;
  
 
  // Gera, dinamicamente, as opções do Check Box
  let checkBoxGerado = `<table class="table table-sm table-borderless">
                          <tbody>`;
  let idItem;
  
  tabela.forEach( item => {

    if( parseInt( item[ATIVO] ) == 1 ) {

      idItem = idCheckBox + item[ID];

      if( (i % numColunas) == 0 ) {
        checkBoxGerado += `<tr>`;
      }

      checkBoxGerado += 
      `<td class="col-${larguraColuna}">
         <div class="form-check">
           <input class="form-check-input" type="checkbox" name="${idCheckBox}" id="${idItem}" value="${item[ID]}">
           <label class="form-check-label" for="${idItem}">${item[NOME]}</label>
         </div>
       </td>`;

      if( (numColunas>1) && (i % numColunas) == (numColunas-1) ) {
        checkBoxGerado += `</tr>`;
      }

      ++i;

    } // Fim do if item ativo

  }); // Fim do tabela.forEach

  checkBoxGerado += `  </tbody>
                     </table>`;
      
  return checkBoxGerado;

} // Fim da função gerarCheckBoxTable



/**
 * Gerador de Select
 *
 * @param {Array} tabela - Tabela de onde os ids e os nomes das opções serão lidos
 *
 */
function gerarSelectBackend( tabela ) {
 
  // Gera, dinamicamente, as opções do Check Box
  let selectGerado = `<option selected value="">Selecione</option>`;

  tabela.forEach( item => {

    if( parseInt( item[ATIVO] ) == 1 ) {

      selectGerado += `<option value="${item[ID]}">${item[NOME]}</option>`;

    }

  }); // Fim do tabela.forEach
      
  // Retorna o select gerado  
  return selectGerado;

} // Fim da função gerarSelectBackend    



/**
 * Gerador de Abas de categorias
 *
 * @param {Integer} visivel - 1 se as abas serão visiveis inicialmente e 
 *                            0 se serão invisíveis inicialmente
 * 
 * return {Array} - Retorna um array contendo abas cujos títulos são as categorias e 
 *                  o conteúdo são os parâmetros associados à essas categorias
 */
function gerarAbasCategorias( visibilidade ) {
 
  // Flag que controla a visibilidade dos compenentes
  let display = visibilidade ? "" : "none";  

  // Ids das abas
  let idAbas = "abasCategorias";
  let idTituloAba;

  // String para armazenar as abas geradas
  let abasGerada = `<ul id="${idAbas}" class="pagination">`;
      abasGerada += `<li class="page-item"><button class="page-link" style="display:none;"></button></li>`;  

  // String para armazenar os conteúdos das abas geradas
  let conteudoAbas = "";
  let idConteudoAbas;

  BUFFER_CATEGORIAS.forEach( categoria => {

    if( parseInt( categoria[ATIVO] ) == 1 ) {

      // Gerando os cabeçalhos das abas
      idTituloAba = idAbas + "_" + categoria[ID];

      abasGerada += 
        `<li class="page-item">
           <button class="page-link" id="${idTituloAba}" style="display:${display};"
                   name="${idAbas}"  onclick="mostrarConteudoAbaSelecionada()">${categoria[NOME]}</button>
         </li>`;


      // Gerando os conteúdos das abas (checkbox dos parâmetros da categoria)
      idConteudoAbas = "checkboxParametros_" + categoria[ID] + "_";

      conteudoAbas += `<span id="${idConteudoAbas}" onchange="marcarParametrosIguais()"
                       style="padding: 10px; border: 1px solid blue; display:${display}; border-radius: 5px; text-align: left;">`;  

      conteudoAbas += gerarCheckBox( obterParametrosDasCategorias([categoria[ID]]), idConteudoAbas, 0);   

      conteudoAbas += `</span>`;    
                             
    }
  }); // Fim do tabela.forEach
  
  abasGerada += `<li class="page-item"><button class="page-link" style="display:none;"></button></li>`;  
  abasGerada += `</ul>`;
      
  return abasGerada + conteudoAbas;

} // Fim da função gerarAbasCategorias 



/**
 *  #####  TESTES PARA AS FUNÇÕES DESSE MÓDULO  #####
 */



/**
 * Função para testar a função principal inserirNovoCaso
 */
function teste_gerarAbasCategorias() {

  let abas = gerarAbasCategorias( 0 );
  
  console.log( abas );

} // Fim da função teste_gerarAbasCategorias





