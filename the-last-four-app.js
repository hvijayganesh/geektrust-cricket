"use strict";
const Match = require('./src/models/match');
const ScoreBoard = require('./src/models/score-board');
const Team = require('./src/models/team');
const Player = require('./src/models/player');
const argv = require('yargs').argv;
const Utils = require('./src/common/utils');
const _ = require('lodash');

class TheLastFourApp {
  constructor(input) {
    this.match = new Match({type: input.type, weather: input.weather});
    this.input = input;
  }

  async init(simlateOvers) {
    let me = this;
    try {
      await me.readPlayerStats();
      me.initPlayers();
      me.initTeams();
      me.initCurrentScoreBoard();
      simlateOvers();
    } catch (error) {
      throw error;
    }
  }

  async readPlayerStats() {
    try {
      this.playerStatsMap = await Utils.readAndParsePlayerStats();
    } catch (error) {
      throw error;
    }
  }

  initPlayers() {
    let me = this;
    var battingOrder = 0;
    _.forOwn(me.playerStatsMap, function(probability, player) {
      let name = player;
      let runs = {
        scored: 0,
        ballsFaced: 0,
        probability: probability
      };
      battingOrder++;
      me.match.players.push((new Player({name, runs, battingOrder})));
     });
  }

  initTeams() {
    let team1 = new Team('Lengaburu');
    let team2 = new Team('Enchai');
    this.match.teams.push(team1);
    this.match.teams.push(team2);
    if (this.input.battingTeam == 'Lengaburu') {
      team1.isBatting = true;
    }
  }

  initCurrentScoreBoard() {
    this.match.scoreBoard = new ScoreBoard({
      oversLeft: this.input.oversLeft,
      runsNeeded: this.input.runsNeeded,
      wktsLeft: this.input.wktsLeft
    });
  }
}

let app = new TheLastFourApp(argv);
app.init(() => {
  app.match.simulateOvers();
});