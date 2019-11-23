"use strict";
const _ = require('lodash');

class Match {
  constructor(data) {
    if (data) {
      _.extend(this, data);
    }
  }

  getToss(team1, team2) {
    let random = Math.random();
    return random < 0.5 ? team1.getPreferences(this.type, this.weather) : team2.getPreferences(this.type, this.weather);
  }
}

module.exports = Match;