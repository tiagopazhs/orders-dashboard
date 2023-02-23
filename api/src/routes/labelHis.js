const router = require("express").Router();
const LabelHis = require('../models/LabelHis');

//Get requisiton, it can be get this table: historyLabel.
router.get('/', async (req, res) => {
    try{
      const dataLabelHis = await LabelHis.find()
      res.status(200).json(dataLabelHis)
  
    }catch (error) {
      res.status(500).json({ error: error })
    }
})
  
//Post requisition, it change the printer variables from the post requisition from Front End
router.post('/', function (req, res) {
  
    let usuario = req.body.usuario
    let data = req.body.data
    let horario = req.body.horario
    let quantidade = req.body.quantidade
    let campoCod = req.body.campoCod
    let campoDesc1 = req.body.campoDesc1
    let campoDesc2 = req.body.campoDesc2
  
    // Test if there are a field code
    if(!campoCod) {
      res.status(422).json({error: 'o codigo do produto e obrigatorio!'})
      return 
    }
  
    const labelHistory = {
      usuario,
      data,
      horario,
      quantidade,
      campoCod,
      campoDesc1,
      campoDesc2
    }
  
    try {
      LabelHis.create(labelHistory)
      return res.json({msg: "post executed, data below:", campoCod, campoDesc1, campoDesc2})
    }catch(error) {
      res.status(500).json({error: error})
    }
})
  
module.exports = router