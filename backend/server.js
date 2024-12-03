import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';

// create the express app
const app = express();
const port = 4000;

// required for __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// create the connection to the database
const db = mysql.createConnection({
  host:"127.0.0.1",
  user:"root",
  password:"password",
  database:"stackdb"
})

// connect to the database
app.use(express.json());
app.use(cors());

// test the connection
app.get('/', (req, res) => {
  res.json('hello this is the backend.')
})

// create middleware to handle the image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

// create the upload instance
const upload = multer({ storage: storage, dest: 'uploads/'});

// STACK API
// fetches all the stack items from the database
app.get('/stack', (req,res) => {
  const q = "SELECT * FROM stack WHERE archived = 0;"
  db.query(q,(err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})

// fetches single stack item from the database
app.get('/stack/:id', (req,res) => {
  const q = "SELECT * FROM stack WHERE id = ?;"
  const id = req.params.id;
  db.query(q, [id], (err, data)=>{
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
              `formtype`,\
              `mint`,\
              `metaltype`,\
              `purity`,\
              `unitweight`,\
              `weighttype`,\
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
    req.body.formtype,
    req.body.mint,
    req.body.metaltype,
    req.body.purity,
    req.body.unitweight,
    req.body.weighttype,
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

//archives an item in the database
app.put('/stack/archive/:id', (req,res) => {
  const q = "UPDATE stack SET archived = 1 WHERE id = ?;"
  const id = req.params.id;
  db.query(q, [id], (err, data) => {
    if(err) return res.json(err)
    return res.json("Stack item archived successfully.");
  });
});

// updates a stack item in the database
app.put('/stack/:id', (req,res) => {
  const q = "UPDATE stack SET \
              `name` = ?,\
              `description` = ?,\
              `purchasedate` = ?,\
              `purchasedfrom` = ?,\
              `purchaseprice` = ?,\
              `formtype` = ?,\
              `mint` = ?,\
              `metaltype` = ?,\
              `purity` = ?,\
              `unitweight` = ?,\
              `weighttype` = ?,\
              `ozweight` = ?,\
              `oztweight` = ?,\
              `gramweight` = ?,\
              `ozweightpure` = ?,\
              `oztweightpure` = ?,\
              `gramweightpure` = ?,\
              `totalpureozweight` = ?,\
              `totalpureoztweight` = ?,\
              `totalpuregramweight` = ?,\
              `amount` = ?, \
              `imagefileid` = ? \
              WHERE id = ?";

  const values = [
    req.body.name, 
    req.body.description,
    req.body.purchasedate,
    req.body.purchasedfrom,
    req.body.purchaseprice,
    req.body.formtype,
    req.body.mint,
    req.body.metaltype,
    req.body.purity,
    req.body.unitweight,
    req.body.weighttype,
    req.body.ozweight,
    req.body.oztweight,
    req.body.gramweight,
    req.body.ozweightpure,
    req.body.oztweightpure,
    req.body.gramweightpure,
    req.body.totalpureozweight,
    req.body.totalpureoztweight,
    req.body.totalpuregramweight,
    req.body.amount,
    req.body.imagefileid,
    req.params.id 
  ];
  db.query(q, values, (err, data) => {
    if(err) return res.json(err)
    return res.json("Stack item updated successfully.");
  });
});

// deletes a stack item from the database
app.delete('/stack/remove/:id', (req, res) => {
  const id = req.params.id;
  const q = 'DELETE FROM stack WHERE id = ?';
  db.query(q, [id], (err, result) => {
    if (err) {
      return res.json(err);
    }
    return res.json('Stack item deleted successfully.');
  });
});

// // fetches total sum of gold in the stack
app.get('/stack/totals/gold', (req, res) => {
  console.log("fetching total ozt of gold in the stack")
  const q = 'SELECT SUM(totalpureoztweight) AS totalozt FROM stack WHERE metaltype = "gold" AND archived = 0;'
  console.log(q);
  db.query(q, (err, data)=>{
    if(err) return res.json(err)
    console.log(data);
    return res.json(data)
  })
});

// fetches total sums of silver in the stack
app.get('/stack/totals/silver', (req, res) => {
  console.log("fetching total ozt of silver in the stack")
  const q = 'SELECT \
            SUM(totalpureoztweight) AS totalozt, \
            SUM(totalpureozweight) AS totaloz, \
            SUM(totalpuregramweight) AS totalgrams \
            FROM stack WHERE metaltype = "silver" \
            AND archived = 0;'
  console.log(q);
  db.query(q, (err, data)=>{
    if(err) return res.json(err)
    console.log(data);
    return res.json(data)
  })
});

// fetches total sum of copper (ozt) in the stack
app.get('/stack/totals/copper', (req, res) => {
  console.log("fetching total ozt of copper in the stack")
  const q = 'SELECT SUM(totalpureoztweight) AS totalozt FROM stack WHERE metaltype = "copper" AND archived = 0;'
  console.log(q);
  db.query(q, (err, data)=>{
    if(err) return res.json(err)
    console.log(data);
    return res.json(data)
  })
});




// METALS API
// fetches all the metals from the database
app.get('/metals', (req,res) => {
  const q = "SELECT * FROM metals;"
  db.query(q,(err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})

// adds a new metal to the database
app.post('/metals/add', (req,res) => {
  const q = "INSERT INTO metals (metalvalue, metaltype) VALUES (?);"
  const values = [req.body.metalvalue, req.body.metaltype];
  db.query(q, [values], (err, data) => {
    if(err) return res.json(err)
    return res.json("New metal added successfully.");
  });
});

//deletes a metal from the database
app.delete('/metals/remove/:id', (req, res) => {
  const id = req.params.id;
  const q = 'DELETE FROM metals WHERE id = ?';
  db.query(q, [id], (err, result) => {
    if (err) {
      return res.json(err);
    }
    return res.json('Metal deleted successfully.');
  });
});


// ITEM FORMS API
// fetches all the item forms from the database
app.get('/itemforms', (req,res) => {
  const q = "SELECT * FROM itemforms;"
  db.query(q,(err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})

// adds a new item form to the database
app.post('/itemforms/add', (req,res) => {
  const q = "INSERT INTO itemforms (itemformvalue, itemformtype) VALUES (?);"
  console.log("req.body.form", req.body.form);
  const values = [req.body.itemformvalue, req.body.itemformtype];
  db.query(q, [values], (err, data) => {
    if(err) return res.json(err)
    return res.json("New form added successfully.");
  });
});

// deletes an item form from the database
app.delete('/itemforms/remove/:id', (req, res) => {
  const id = req.params.id;
  const q = 'DELETE FROM itemforms WHERE id = ?';
  db.query(q, [id], (err, result) => {
    if (err) {
      return res.json(err);
    }
    return res.json('Form deleted successfully.');
  });
});


// ITEM NAME API
// fetches all the item names from the database
app.get('/itemnames', (req,res) => {
  const q = "SELECT DISTINCT name FROM stack;"
  db.query(q,(err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
});


// PURCHASED FROM API
// fetches all the purchased from locations from the database
app.get('/purchasedfrom', (req,res) => {
  const q = "SELECT DISTINCT purchasedfrom FROM stack;"
  db.query(q,(err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})


// MINTS API
// fetches all the mints from the database
app.get('/mints', (req,res) => {
  const q = "SELECT DISTINCT mint FROM stack;"
  db.query(q,(err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})


// PURITIES API
// fetches all the purities from the database
app.get('/purities', (req,res) => {
  const q = "SELECT * FROM purity;"
  db.query(q,(err, data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})

// adds a new purity to the database
app.post('/purities/add', (req,res) => {
  const q = "INSERT INTO purity (name, purity) VALUES (?);"
  const values = [req.body.name, req.body.purity];
  db.query(q, [values], (err, data) => {
    if(err) return res.json(err)
    return res.json("New purity added successfully.");
  });
});

// deletes a purity from the database
app.delete('/purities/remove/:id', (req, res) => {
  const id = req.params.id;
  const q = 'DELETE FROM purity WHERE id = ?';
  db.query(q, [id], (err, result) => {
    if (err) {
      return res.json(err);
    }
    return res.json('Purity deleted successfully.');
  });
});


// IMAGE API
// upload an image file
app.post('/image/upload', upload.single('imagefile'), (req, res) => {
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

// fetches an image file
app.get('/image/:id', (req, res) => {
  const q = "SELECT path FROM images WHERE id = ?;";
  db.query(q, [req.params.id], (err, result) => {
    if (err) throw err;
    if (result[0]) {
      res.sendFile(result[0].path, { root: __dirname });
    } else {
      res.status(404).send('No results found');
  }
  });
});

// deletes an image file
app.delete('/image/remove/:id', (req, res) => {
  const q = "SELECT path FROM images WHERE id = ?;";
  const q2 = 'DELETE FROM images WHERE id = ?';
  const id = req.params.id;
  db.query(q, [id], (err, result) => {
    const imagePath = path.join(__dirname, `${result[0].path}`);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting image file:', err);
        return res.status(500).json({ error: 'Error deleting image file' });
      }
    });
  });
  db.query(q2, [id], (err, result) => {
    if (err) {
      return res.json(err);
    }
    return res.json('Image deleted successfully.');
  });
});

// start the server
app.listen(port, () => {
  console.log('Server started on port 4000')
})

// enable CORS
app.use(cors());

// Home route
app.get('/home', (req, res) => {
  const data = {
    message: 'Michael'
  }
  res.send(data);
})

// 404 error handler
app.use((req, res, next) => {
  res.status(404).send('Sorry, we cannot find that!');
});