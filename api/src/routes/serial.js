const router = require("express").Router();

const Code = require('../models/code')

// create / criação de dados
router.post('/', async (req, res) => {

    // req.body
  
    const {pedido, item, ean, serial, verificado} = req.body
  
    if(!pedido) {
      res.status(422).json({error: 'o pedido e obrigatorio!'})
      return 
    }
  
    const code = {
      pedido,
      item,
      ean,
      serial,
      verificado
    }
  
    try {
      // criando dados
      await Code.create(code)
  
      res.status(201).json({ message: 'Pedido criado com sucesso!'})
  
    }catch(error) {
      res.status(500).json({error: error})
    }
  
  })

  // Read / leitura de dados
  router.get('/' , async (req, res) => {
    try{
      const serials = await Code.find()
      res.status(200).json(serials)

    }catch (error) {
      res.status(200).json({ "pedido": "111111",
      "item": "pantufa G",
      "ean": "123",
      "serial": "321",
      "verificado": true})

      // res.status(500).json({ error: error })
    }
  })


  // Read - filtrar por pessoa
  router.get('/:pedido', async (req, res) => {
    
    // to print everything of the requision on terminal
    console.log(req)

    // extrair o dado da requisição pela url = req.params
    const pedido = req.params.pedido

    try{
      const code = await Code.findOne({pedido: pedido})

      if(!code) {
        res.status(422).json({message: 'O pedido nao foi encontrado'})
        return
      }

      res.status(200).json(code)

    } catch (error) {
      res.status(500).json({ error: error })
    }

  })

router.patch('/:pedido' , async (req, res) => {
  
  const Pedido = req.params.pedido

  const {pedido, item, ean, serial, verificado} = req.body

  const code = {
    pedido,
    item,
    ean,
    serial,
    verificado
  }

  try{

    const updatedCode = await Code.updateOne({pedido:pedido}, code)

    console.log(updatedCode)

    if(updatedCode.matchedCount === 0) {
      res.status(422).json({message: 'O pedido nao foi atualizado'})
      return
    }

    res.status(200).json(code)

  }catch(error){
    res.status(500).json({error:error})
  }
})


router.put('/:pedido' , async (req, res) => {
  
  const Pedido = req.params.pedido

  const {pedido, item, ean, serial, verificado} = req.body

  const code = {
    pedido,
    item,
    ean,
    serial,
    verificado
  }

  try{

    const updatedCode = await Code.updateOne({pedido:pedido}, code)

    console.log(updatedCode)

    if(updatedCode.matchedCount === 0) {
      res.status(422).json({message: 'O pedido nao foi atualizado'})
      return
    }

    res.status(200).json(code)

  }catch(error){
    res.status(500).json({error:error})
  }
})

// router delete
router.delete('/:pedido', async (req, res) => {
  const pedido = req.params.pedido

  const code = await Code.findOne({pedido:pedido})
  if(!code) {
    res.status(422).json({message: 'O usuario nao foi deletado :( !'})
    return
  }
  try{

    await Code.deleteOne({pedido:pedido})
    res.status(200).json({message: 'Usuario removido com sucesso! :)'})

  }catch(error) {
    res.status(500).json({error:error})
  }

})

  module.exports = router