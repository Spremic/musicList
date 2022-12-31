const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const UserUcenik = require("./model/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 3000;
const app = express();
app.use(express.static(__dirname + "/static/css"));
app.use(express.static(__dirname + "/static/script"));
app.use(express.static(__dirname + "/static/admin"));
app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());

const url = `mongodb+srv://spremic:4D9i4qUp5c3s8c5d@cluster0.ikpu9t3.mongodb.net/?retryWrites=true&w=majority`;
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.set("strictQuery", false);
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });

const JWT_SECRET = "HASGDHGQWEDQGWEHDAS~!@ew#$#56%$^%yhfgjhjrtrhrhtRHSFSfsdf";

//registrovanje korisnika
app.post("/api/register", async (req, res) => {
  const { nameBand, email, password: plainTextPassword } = req.body;
  const password = await bcrypt.hash(plainTextPassword, 10);
  try {
    const response = await UserUcenik.create({
      nameBand,
      email,
      password,
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
  res.json({ status: "OK" });
});
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  let emailCheck = await UserUcenik.findOne({ email }).lean();
  if (!emailCheck) {
    return res.json({ status: "mail", mail: "Nepostojeca email adresa" });
  }
  if (await bcrypt.compare(password, emailCheck.password)) {
    const token = jwt.sign(
      {
        id: emailCheck._id,
        nameBand: emailCheck.nameBand,
        email: emailCheck.email,
        password: emailCheck.password,
        naslov: emailCheck.naslov,
        pevac: emailCheck.pevac,
        tekst: emailCheck.tekst,
      },
      JWT_SECRET
    );

    return res.json({ status: "OK", token: token });
  } else {
    return res.json({ status: "password", password: "Pogresna sifra" });
  }
});
app.post("/api/dynamicLoad", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const nameBand = user.nameBand;
    const naslov = user.naslov;
    const pevac = user.pevac;
    const tekst = user.tekst;
    return res.json({ status: "ok", nameBand, naslov, pevac, tekst });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: "greska" });
  }
});
app.post("/api/addMusic", async (req, res) => {
  const { token, naslov, pevac, tekst } = req.body;
  const user = await jwt.verify(token, JWT_SECRET);
  try {
    const _id = user.id;
    await UserUcenik.updateOne(
      { _id },
      {
        $push: { naslov, pevac, tekst },
      }
    );
    console.log(user);
    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
