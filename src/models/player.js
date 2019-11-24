"use strict";
const _ = require('lodash');
const Utils = require('../common/utils');

class Player {
  constructor(data) {
    if(data) {
      _.extend(this, data);
    }
    this.isOut = false;
  }

  runScoredInOneBall() {
    let me = this;
    let randomWeight = Utils.randomIntFromInterval(1, 100);
    delete me.runs.probability['player'];
    for (let score in me.runs.probability) {
      randomWeight = randomWeight - Number(me.runs.probability[score]);
      if (randomWeight <= 0) {
        return score;
      }
    }
    return -1;
  }
}

module.exports = Player;