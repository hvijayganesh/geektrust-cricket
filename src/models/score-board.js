"use strict";
const _ = require('lodash');

class ScoreBoard {
  constructor(data) {
    if (data) {
      _.extend(this, data);
    }
  }
}

module.exports = ScoreBoard;