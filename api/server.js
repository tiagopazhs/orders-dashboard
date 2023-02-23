const express = require('express');
const app = express();
const cors = require('cors');
const HTTP_PORT = 8500;
const mongoose = require('mongoose');

require('dotenv').config();
app.use(express.json());
app.use(cors());

//User env file to enter with password
const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

const labelHis = require('./src/routes/labelHis')
const labelExec = require('./src/routes/labelExec')
const pedidos = require('./src/routes/pedidos')
const produtos = require('./src/routes/produtos')
const serial = require('./src/routes/serial')

// forma de ler JSON / middlewares
app.use(express.urlencoded({
  extended: true,
}),
)

app.use('/historic', labelHis)
app.use('/procces', labelExec)
app.use('/pedidos', pedidos)
app.use('/produtos', produtos)
app.use('/serial', serial)

//End point: initial route
app.get('/', async (req, res) => {
  try {
    res.json({ msg: 'Rota inicial' })
  } catch (error) {
    res.status(500).json({ error: error })
  }
})


//conect to mongoDB
mongoose.connect(
  `mongodb://${DB_USER}:${DB_PASSWORD}@ac-xb501ws-shard-00-00.ibx1tea.mongodb.net:27017,ac-xb501ws-shard-00-01.ibx1tea.mongodb.net:27017,ac-xb501ws-shard-00-02.ibx1tea.mongodb.net:27017/?ssl=true&replicaSet=atlas-jxxop3-shard-0&authSource=admin&retryWrites=true&w=majority`
)
  .then(() => {
    console.log('Servidor conectado!')
    app.listen(HTTP_PORT)
  })
  .catch((err) => console.log(err));
