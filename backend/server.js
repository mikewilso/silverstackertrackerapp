import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
const port = 4000;

const db = mysql.createConnection({
  host:"127.0.0.1",
  user:"root",
  password:"password",
  database:"stackdb"
})

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json('hello this is the backend')
})

app.get('/stack', (req,res) => {
  const q = "SELECT * FROM stack;"
  db.query(q,(err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})

app.post('/stack', (req,res) => {
  const q = "INSERT INTO stack (\
              `name`,\
              `description`,\
              `purchasedate`,\
              `purchasedfrom`,\
              `purchaseprice`,\
              `shape`,\
              `mint`,\
              `metaltype`,\
              `purity`,\
              `weighttype`,\
              `unitweight`,\
              `ozweight`,\
              `oztweight`,\
              `gramweight`,\
              `ozweightpure`,\
              `oztweightpure`,\
              `gramweightpure`,\
              `amount`,\
              `totalpureozweight`,\
              `totalpureoztweight`,\
              `totalpuregramweight`) VALUES(?)";

  
  const values = [
    req.body.name, 
    req.body.description,
    req.body.purchasedate,
    req.body.purchasedfrom,
    req.body.purchaseprice,
    req.body.shape,
    req.body.mint,
    req.body.metaltype,
    req.body.purity,
    req.body.weighttype,
    req.body.unitweight,
    req.body.ozweight,
    req.body.oztweight,
    req.body.gramweight,
    req.body.ozweightpure,
    req.body.oztweightpure,
    req.body.gramweightpure,
    req.body.amount,
    req.body.totalpureozweight,
    req.body.totalpureoztweight,
    req.body.totalpuregramweight
  ];
  console.log(values);
  db.query(q,[values], (err, data) => {
    if(err) return res.json(err)
    return res.json("New addition to the stack officially added.");
  })
})

app.listen(port, () => {
  console.log('Server started on port 4000')
})

app.use(cors())

app.get('/home', (req, res) => {
  const data = {
    message: 'Michael'
  }
  res.send(data)
})