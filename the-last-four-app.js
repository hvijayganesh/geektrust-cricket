"use strict";
const BaseApp = require('./base-app');
const argv = require('yargs').argv;

class TheLastFourApp extends BaseApp {
  constructor(input) {
    super(input);
    this.input = input;
  }

  _displayMatchResult(team) {
    let me = this;
    let scoreBoard = me.match.scoreBoard;
    if (me.result == 'Won') {
      this.utils.printToFile(`${team.name} won by ${scoreBoard.wktsLeft} wickets and ${scoreBoard.ballsRemaining} balls remaining\n\n`);
    } else {
      this.utils.printToFile(`${team.name} lost by ${scoreBoard.runsNeeded} runs\n\n`);
    }
    me._displayPlayerScoreCard(team);
  }

  matchSummary() {
    let me = this;
    me._displayMatchResult(app.match.battingTeam, app.match.bowlingTeam);
    me._displayCommentary(app.match.battingTeam, true);
  }
}

let app = new TheLastFourApp(argv);
app.init(() => {
  app.match.simulateOvers(app.match.battingTeam);
  app.initOutputFile(app.input.outputFile);
  app.clearFileContents();
  app.matchSummary();
});