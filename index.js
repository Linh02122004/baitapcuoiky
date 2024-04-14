const express = require("express");
const app = express();
const multer = require("multer");
const port = 3000;
const path = require("path");
const querystring = require("querystring");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

app.use(express.static(path.join(__dirname, "public/page")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(bodyParser.json({ limit: "1000mb" }));

app.use(cors());

const url = "mongodb://localhost:27017";
const dbName = "hagialinh1803";
const collectionName = "giays";

let client;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/page/home.html"));
});
app.post("/create", async (req, res) => {
  try {
    const giays = req.body;
    console.log(giays);

    client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();

    const giaysCollection = client.db(dbName).collection(collectionName);

    const result = await giaysCollection.insertMany(giays);
    console.log(result);

    const message = `${giays.length} shoes created successfully!`;
    res.json({ message: message });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    if (client) {
      await client.close();
      console.log("Mongo connection closed!!!");
    }
  }
});

app.post("/create1", async (req, res) => {
  try {
    const giay = req.body;

    client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();

    const giaysCollection = client.db(dbName).collection(collectionName);

    const result = await giaysCollection.insertOne(giay);
    console.log(result);

    const message = `1 shoe created successfully!`;
    res.json({ message: message });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    if (client) {
      await client.close();
      console.log("Mongo connection closed!!!");
    }
  }
});

app.get("/read", async (req, res) => {
  try {
    const tenGiay = req.query.tenGiay;
    const nhaSX = req.query.nhaSX;
    const sizeFrom = req.query.sizeFrom;
    const sizeTo = req.query.sizeTo;

    const query = {};
    if (tenGiay) {
      query.tenGiay = { $regex: tenGiay, $options: "i" };
    }
    if (nhaSX) {
      query.nhaSX = { $regex: nhaSX, $options: "i" };
    }
    if (sizeFrom && sizeTo) {
      query.size = { $gte: sizeFrom, $lte: sizeTo };
    } else if (sizeFrom && !sizeTo) {
      query.size = { $gte: sizeFrom };
    } else if (!sizeFrom && sizeTo) {
      query.size = { $lte: sizeTo };
    }

    client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    console.log("Connected to MongoDB successfully!!!");

    const shoesCollection = client.db(dbName).collection(collectionName);
    const shoes = await shoesCollection.find(query).sort({ id: -1 }).toArray(); // Sắp xếp giảm dần theo maGiay
    if (shoes.length === 0) {
      res.send(`<h1 style ="color: red;">Không có kết quả tìm kiếm</h1>`);
      return;
    }

    let tableHTML =
      '<table border="1"><tr><th>Mã Giày</th><th>Tên Giày</th><th>Nhà sản xuất</th><th>Size</th><th>Image</th></tr>';
    shoes.forEach((shoe) => {
      tableHTML += `<tr><td>${shoe.maGiay}</td><td>${shoe.tenGiay}</td><td>${shoe.nhaSX}</td><td>${shoe.size}</td><td><img style="width: 100px; height: 100px" alt="img" src="${shoe.imageGiay}"/></td></tr>`;
    });
    tableHTML += "</table>";

    res.send(tableHTML);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    if (client) {
      await client.close();
      console.log("Mongo connection closed!!!");
    }
  }
});

app.get("/read/for/update", async (req, res) => {
  try {
    const maGiay = req.query.maGiay;
    const query = { maGiay: { $regex: `.*${maGiay}.*`, $options: "i" } };

    client = new MongoClient(url);
    await client.connect();

    const giaysCollection = client.db(dbName).collection(collectionName);
    const editGiay = await giaysCollection.findOne(query);

    if (editGiay) {
      res.json(editGiay); // Send editGiay as JSON response
    } else {
      res.status(404).send("Khong tim thay ma giay");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    if (client) {
      await client.close();
      console.log("Mongo connection closed!!!");
    }
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
