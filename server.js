const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("server is working");
});

app.listen(5000, () => {
  console.log("server running on port 5000");
});

app.post("/calculate", (req, res) => {
    const { mileage, price, distance } = req.body;

    const fuel = distance / mileage;
    const cost = fuel * price;

    res.json({ fuel, cost });
});
const fs = require("fs");

app.get("/trips", (req, res) => {
    if (!fs.existsSync("data.json")) {
        return res.json([]);
    }

    const data = JSON.parse(fs.readFileSync("data.json"));
    res.json(data);
}); 

app.delete("/delete-trip/:index", (req, res) => {
    const index = req.params.index;

    let data = JSON.parse(fs.readFileSync("data.json"));

    data.splice(index, 1);

    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

    res.json({ message: "Deleted successfully" });
}); 


app.post("/save-trip", (req, res) => {
    const trip = req.body;

    let data = [];

    if (fs.existsSync("data.json")) {
        data = JSON.parse(fs.readFileSync("data.json"));
    }

    data.push(trip);

    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
console.log("Incoming trip:", req.body);
    res.json({ message: "Trip saved successfully" });
});

const cors = require("cors");
app.use(cors());