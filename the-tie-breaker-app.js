"use strict";
const BaseApp = require('./base-app');
const argv = require('yargs').argv;
const _ = require('lodash');
const Utils = require('./src/common/utils');

class TieBreakerApp extends BaseApp {
  constructor(input) {
    super(input);
    this.input = input;
  }

  async initTeams() {
    await super.initTeams();
    this.match.teams[0].battingFirst = true;
    await this.match.teams[1].loadPlayers(this.input.fileName2);
  }

  initCurrentScoreBoard() {
    super.initCurrentScoreBoard();
    this.match.scoreBoard.runsNeeded = 0;
  }

  resetScoreBoard() {
    _.extend(this.match.scoreBoard, {oversLeft: this.input.oversLeft, wktsLeft: this.input.wktsLeft});
  }

  _displayTeamWiseCommentary(team) {
    let me = this;
    Utils.printToFile(`${team.name} innings\n`);
    super._displayTeamWiseCommentary(team);
  }

  _displayCommentary(team1, team2) {
    let me = this;
    Utils.printToFile(`Sample Commentary\n\n`);
    me._displayTeamWiseCommentary(team1);
    me._displayTeamWiseCommentary(team2);
  }

  _displayMatchResult(team1, team2) {
    let me = this;
    let scoreBoard = me.match.scoreBoard;
    if (team2.hasWon) {
      Utils.printToFile(`${team2.name} won by ${scoreBoard.wktsLeft} wickets and ${scoreBoard.ballsRemaining} balls remaining\n\n`);
    } else {
      Utils.printToFile(`${team1.name} won by ${scoreBoard.runsNeeded} runs\n\n`);
    }
    me._displayPlayerScoreCard(team1);
    me._displayPlayerScoreCard(team2);
  }

  matchSummary() {
    let me = this;
    let team1 = this.match.teams[0];
    let team2 = this.match.teams[1];
    me._displayMatchResult(team1, team2);
    me._displayCommentary(team1, team2);
  }
}

let app = new TieBreakerApp(argv);
app.init(() => {
  app.match.simulateOvers(app.match.teams[0]);
  app.resetScoreBoard();
  app.match.simulateOvers(app.match.teams[1]);
  app.initOutputFile(app.input.outputFile);
  app.clearFileContents();
  app.matchSummary();
});