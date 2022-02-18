"use strict";
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const raw = fs.readFileSync('public/phasmo/ghosts.json');
const json= JSON.parse(raw.toString());
const evidence = json["evidence"];
const evidenceOut = {};

for( const i in evidence )
{
  const evi = evidence[i];
  const key = evi.id;
  const val = evi.name;
  evidenceOut[key] = val;
}

const ghosts = json["ghosts"];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('phasmo/index', { title: "Candice's Phasmophobia Evidence Tracker", ghosts:ghosts, evidence:evidenceOut });
});

module.exports = router;
