"use strict";

class Match {
  constructor(type, weather) {
    this.type = type;
    this.weather = weather;
    this.toss;
  }

  getToss(team1, team2) {
    let random = Math.random();
    return random < 0.5 ? team1.getPreferences(this.type, this.weather) : team2.getPreferences(this.type, this.weather);
  }
}

module.exports = Match;