const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/machine_db', { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});

const machineListingSchema = new mongoose.Schema({
  hall: String,
  machineId: String,
  machineSN: String,
  equipmentCode: String,
  //
  phaseMachine: String,
  versionRacks: String,
  versionAlgo: String,
  sensiAlgo: String,
  //
  revHVPS1: String,
  revHVPS2: String,
  revHVPS3: String,
  //
  ramIAC: String,
  ttl: String
});

const MachineListing = mongoose.model('MachineListing', machineListingSchema);

// Initialize Express app
const app = express();
app.set('view engine', 'ejs');
app.set("views", "./views/")

// Enable CORS and body parsing
//app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


// Get all machine models
app.get('/', (req, res) => {
  MachineListing.find((err, machine) => {
    if (err) return res.status(500).send(err);
    res.render('machine-listing', { machine });
  });
});
app.get('/listing', (req, res) => {
  MachineListing.find((err, machine) => {
    if (err) return res.status(500).send(err);
    res.render('machine-listing', { machine });
  });
});

// Add new machine
app.get('/add', (req, res) => {
  res.render('add-machine');
});
app.post('/add-machine', (req, res) => {
  const machine = new MachineListing({
    anonValue0: req.body.hall,
    machineId: req.body.machineId,
    machineSN: req.body.machineSN,
    equipmentCode: req.body.equipmentCode,
    phaseMachine: req.body.phaseMV3D,
    versionRacks: req.body.versionRacks,
    versionAlgo: req.body.versionAlgo,
    sensiAlgo: req.body.sensiAlgo,
    revHVPS1: req.body.revHVPS1,
    revHVPS2: req.body.revHVPS2,
    revHVPS3: req.body.revHVPS3,
    ramIAC: req.body.ramIAC,
    ttl: req.body.ttl
  });
  console.log(machine);
  machine.save((err) => {
    if (err) return res.status(500).send(err);
    //res.render('machine-listing', { machineListing });
    return res.redirect('machine-listing');
  });
});

// Modify existing machines
app.get('/edit/:id', (req, res) => {
  MachineListing.findById(req.params.id, (err, machine) => {
    if (err) throw err;
    res.render('edit', { machine });
  });
});
app.post('/update/:id', (req, res) => {
  MachineListing.findByIdAndUpdate(req.params.id, req.body, (err, machine) => {
    if (err) throw err;
    res.redirect('/listing');
  });
});

/*
// Get a specific machine model
app.get('/machine-listing/:id', (req, res) => {
  MachineListing.findById(req.params.id, (err, machine) => {
    if (err) return res.status(500).send(err);
    if (!machine) return res.status(404).send();
    return res.status(200).send(machine);
  });
});

/*
// Update an existing machine model
app.put('/machine-listing/:id', (req, res) => {
  MachineListing.findByIdAndUpdate(req.params.id, req.body, (err, updatedMachineListing) => {
    if (err) return res.status(500).send(err);
    if (!updatedMachineListing) return res.status(404).send();
    return res.status(200).send(updatedMachineListing);
  });
});

// Delete a machine model
app.delete('/machine-listing/:id', (req, res) => {
  MachineListing.findByIdAndRemove(req.params.id, (err, deletedMachineListing) => {
    if (err) return res.status(500).send(err);
    if (!deletedMachineListing) return res.status(404).send();
    return res.status(200).send(deletedMachineListing);
  });
});
*/

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
