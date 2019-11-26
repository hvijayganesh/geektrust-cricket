"use strict"
const _ = require('lodash');
const fs = require('fs');
const csv = require('fast-csv');

const path = require('path');
var outputFile;

function readAndParsePlayerStats(file) {
  return new Promise((resolve, reject) => {
    let playerStatsList = [];
    fs.createReadStream(path.join(__dirname, `../../input/${file}`))
      .pipe(csv.parse({ headers: true }))
      .on('error', error => { reject(error); })
      .on('data', row => {
        playerStatsList.push(row);
      })
      .on('end', rowCount => {
        resolve(_.keyBy(playerStatsList, 'player'));
      });
  })
}

function initOutputFile(file) {
  outputFile = path.join(__dirname, `../../output/${file}`);
}

function printToFile(data) {
  fs.appendFileSync(outputFile, data)
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function clearFileContents() {
  fs.writeFileSync(outputFile, '')
}

module.exports = {
  readAndParsePlayerStats,
  randomIntFromInterval,
  printToFile,
  initOutputFile,
  clearFileContents
}