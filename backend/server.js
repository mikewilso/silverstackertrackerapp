import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage, dest: 'uploads/'});

// fetches all the stack items from the database
app.get('/stack', (req,res) => {
  const q = "SELECT * FROM stack;"
  db.query(q,(err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})

// fetches all the metal types from the database
app.get('/metals', (req,res) => {
  const q = "SELECT * FROM metals;"
  db.query(q,(err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})

// fetches all the shapes from the database
app.get('/itemforms', (req,res) => {
  const q = "SELECT * FROM itemforms;"
  db.query(q,(err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})

// adds a new stack item to the database
app.post('/stack', (req,res) => {
  const q = "INSERT INTO stack (\
              `name`,\
              `description`,\
              `purchasedate`,\
              `purchasedfrom`,\
              `purchaseprice`,\
              `form`,\
              `mint`,\
              `metaltype`,\
              `purity`,\
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
              `totalpuregramweight`,\
              `imagefileid`) VALUES(?)";

  
  const values = [
    req.body.name, 
    req.body.description,
    req.body.purchasedate,
    req.body.purchasedfrom,
    req.body.purchaseprice,
    req.body.form,
    req.body.mint,
    req.body.metaltype,
    req.body.purity,
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
    req.body.totalpuregramweight,
    req.body.imagefileid
  ];
  console.log(values);
  db.query(q,[values], (err, data) => {
    if(err) return res.json(err)
    return res.json("New addition to the stack officially added.");
  })
})

app.post('/upload', upload.single('imagefile'), (req, res) => {
  try {
    // Save the file path in the database
    const filePath = req.file.path;
    const q = "INSERT INTO images (path) VALUES (?);";
    db.query(q, [filePath], (err, result) => {
      if (err) throw err;
      res.status(201).json({ 
        message: "File uploaded and path saved successfully",
        imageId: result.insertId 
      });
    });
  } catch (error) {
    console.error(error);
  }
});

// TODO: Figure out how to serve the images with the correct path and corresponding form data
app.get('/image/:id', (req, res) => {
  const q = "SELECT path FROM images WHERE id = ?;";
  db.query(q, [req.params.id], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.sendFile(result[0].path, { root: __dirname });
  });
});

app.listen(port, () => {
  console.log('Server started on port 4000')
})

app.use(cors());

app.get('/home', (req, res) => {
  const data = {
    message: 'Michael'
  }
  res.send(data);
})