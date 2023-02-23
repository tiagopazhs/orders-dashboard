const express = require('express');
const app = express();

const router = require("express").Router();




const moment = require('moment');
moment.locale('pt-br');

const { workDays, specialDeadLine, getRequest } = require('../utils');

//stores id: Loja do galo, Inter Store, MRV and Intertag.
const storeFilter = ["203619239", "203370950", "203994140", "203619241"]



//Get requisiton, of all orders.
router.get('/', async (req, res) => {
  try {

    // arrays to receive the orders 
    let ordersData = []
    let ordersList = []
    let orderObject = []
    let ordersListFilter = []
    let ordersResult = []
    let pedidoTratado = []

    // set variables to build the result of the request
    let pNumero = ""
    let pLoja = ""
    let pStatus = ""
    let pCliente = ""
    let pDataCriacao = 0
    let pDataEnvioFormat = 0
    let pItens = []
    let pPrazoEspecial = ""
    let pTempo = 0
    let pTempoAtraso = 0
    let pTransportadora = ""

    // while aux variables
    let j = 0
    let k = 0
    let run = true
    let aut = true
    let times = 0
    let currentSecond = -1
    let sub = 0

    // variales to use in the requisition
    let pageNumber = 1
    let startReq = "01/12/2022"
    let endReq = "30/12/2022"
    let openSituation = false
    let productsRequisition = false

    //Concat all orders requisions
    console.log('A requisição de pedidos está sendo executada...')
    while (run) {

      // Verify if the current second is equal the auxiliar variable. Authorize if it is not equal.
      if (currentSecond != (new Date().getSeconds())) {
        currentSecond = (new Date().getSeconds())
        times = 0
        aut = true
      }

      // Authorize the requisition to run just 2 times for second
      if (aut) {
        try {
          ordersData = await getRequest(pageNumber, startReq, endReq, openSituation, productsRequisition)
          if(ordersData.pedidos) ordersList = ordersList.concat(ordersData.pedidos);
          pageNumber++
        }
        catch (error) {
          console.error(` \n ALERTA DE ERRO: ${error}`)
        }

        //limit of requisition
        times++
        if (times > 2) { aut = false }

        //finalize the requisition. It'll run 2 times
        if (!ordersData.pedidos || ordersData.pedidos.length < 100) {
          if (openSituation) {
            console.log('requisição completa! tamanho:', ordersList.length)
            run = false
          } else {
            openSituation = true
            run = false // just to teste
            console.log('requisição completa! tamanho:', ordersList.length)// just to teste
          }
        }
      }
    }

    // filter orders by stores
    while (k < ordersList.length) {
      if (storeFilter.includes(ordersList[k].pedido.loja))
        //remove itens for VtexCafe store that are not the interpass
        if (ordersList[k].pedido.loja === "203619241" && ordersList[k].pedido.itens[0].item.codigo === "intertag01") ordersListFilter = ordersListFilter.concat(ordersList[k])
        //keep items diferent of the intercafe store
        else if (ordersList[k].pedido.loja != "203619241") {
          //remove itens that are not sended
          if (ordersList[k].pedido.transporte.transportadora != "Entrega Local" && ordersList[k].pedido.transporte.transportadora != "Retirar pessoalmente") ordersListFilter = ordersListFilter.concat(ordersList[k])
        }
      k++
    }

    //variables to deal with orders fields
    while (j < ordersListFilter.length) {

      orderObject = ordersListFilter[j].pedido

      pNumero = ordersListFilter[j].pedido.numero
      pLoja = ordersListFilter[j].pedido.loja
      pStatus = ordersListFilter[j].pedido.situacao
      pCliente = ordersListFilter[j].pedido.cliente.nome
      pDataCriacao = ordersListFilter[j].pedido.data
      if ('nota' in orderObject) {
        pDataEnvio = ordersListFilter[j].pedido.nota.dataEmissao;
      } else {
        pDataEnvio = moment().format('YYYY-MM-DD')
      }
      pItens = ordersListFilter[j].pedido.itens
      pPrazoEspecial = specialDeadLine(pItens)
      pTempo = workDays(pDataCriacao, pDataEnvio)

      if (pPrazoEspecial) { sub = 4 } else { sub = 2 }
      if (pTempo - sub < 1) { pTempoAtraso = 0 } else { pTempoAtraso = pTempo - sub }
      if (ordersListFilter[j].pedido.transporte.transportadora != undefined) { pTransportadora = ordersListFilter[j].pedido.transporte.transportadora } else { pTransportadora = 'correios' }



      //order fields
      pedidoTratado = {
        pNumero,
        pLoja,
        pStatus,
        pCliente,
        pDataCriacao,
        pDataEnvioFormat,
        pItens,
        pPrazoEspecial,
        pTempo,
        pTempoAtraso,
        pTransportadora,
      }

      ordersResult = ordersResult.concat(pedidoTratado);
      j++;
    }

    res.json(ordersResult) // res.json(ordersList.length)
  }
  catch (err) {
    console.log(err)
    res.json({ err })
  }
})


module.exports = router