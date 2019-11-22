"use strict";
const Match = require('./src/models/match');
const Team = require('./src/models/team');
const argv = process.argv

class App {
  constructor(type, weather) {
    this.match = new Match(type, weather);
  }

  randomize(team1, team2) {
    return this.match.getToss(team1, team2);
  }
}

let app = new App(argv[2], argv[3]);

let team1 = new Team('Lengaburu');
team1.setPreferences('clear', 'day', 'bats');
team1.setPreferences('cloudy', 'night', 'bowls');

let team2 = new Team('Enchai');
team2.setPreferences('clear', 'day', 'bowls');
team2.setPreferences('cloudy', 'night', 'bats');

console.log(app.randomize(team1, team2));
console.log(app.randomize(team1, team2));
console.log(app.randomize(team1, team2));


