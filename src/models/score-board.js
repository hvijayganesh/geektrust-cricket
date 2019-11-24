"use strict";
const _ = require('lodash');

class ScoreBoard {
  constructor(data) {
    if (data) {
      _.extend(this, data);
    }
    this.runsPerBall = new Array(this.oversLeft * 6);
    this.runsPerOver = [];
  }
}

module.exports = ScoreBoard;