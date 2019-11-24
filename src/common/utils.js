"use strict"
const _ = require('lodash');
const fs = require('fs');
const csv = require('fast-csv');

const path = require('path');

function readAndParsePlayerStats() {
  return new Promise((resolve, reject) => {
    let playerStatsList = [];
    fs.createReadStream(path.join(__dirname, '../../input/probability-table.csv'))
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

function printToFile(data) {
  fs.appendFileSync(path.join(__dirname, '../../output/the-last-four-app.csv'), data)
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
  readAndParsePlayerStats,
  randomIntFromInterval,
  printToFile
}