"use strict";
const Match = require('./src/models/match');
const ScoreBoard = require('./src/models/score-board');
const Team = require('./src/models/team');
const Utils = require('./src/common/utils');
const _ = require('lodash');

class BaseApp {
  constructor(input) {
    this.match = new Match({type: input.type, weather: input.weather});
    this.utils = Utils;
  }

  async init(simlateOvers) {
    let me = this;
    try {
      await me.initTeams();
      me.initCurrentScoreBoard();
      simlateOvers();
    } catch (error) {
      throw error;
    }
  }

  async _initBattingTeamPlayers(team, fileName) {
    try {
      team.isBatting = true;
      this.match.battingTeam = team;
      await team.loadPlayers(fileName);
    } catch(error) {
      throw error;
    }
  }

  async initTeams() {
    try {
      let team1 = new Team('Lengaburu');
      let team2 = new Team('Enchai');

      if (this.input.battingTeam == 'Lengaburu') {
        await this._initBattingTeamPlayers(team1, this.input.fileName);
        this.match.bowlingTeam = team2;
      } else {
        await this._initBattingTeamPlayers(team2, this.input.fileName);
        this.match.bowlingTeam = team1;
      }

      this.match.teams.push(team1);
      this.match.teams.push(team2);
    } catch (error) {
      throw error;
    }
  }

  initCurrentScoreBoard() {
    this.match.scoreBoard = new ScoreBoard({
      oversLeft: this.input.oversLeft,
      runsNeeded: this.input.runsNeeded,
      wktsLeft: this.input.wktsLeft
    });
  }

  initOutputFile(file) {
    Utils.initOutputFile(file);
  }

  clearFileContents() {
    Utils.clearFileContents();
  }

  _displayTeamWiseCommentary(team, displayEndOfOver) {
    let oversLeft = team.runsPerOver.length - 1;
    for (let i = oversLeft, j = 1, l = 0; i > 0; i--, l++) {
      if (team.runsPerOver[i] != undefined && displayEndOfOver) {
        Utils.printToFile(`\n${i} overs left. ${team.runsPerOver[i]} runs to win\n\n`)
      }
      for (let k = j, m = 1; j < k+6  ; j++, m++) {
        if (team.runsPerBall[j] != undefined) {
          if (team.runsPerBall[j].is_out) {
            Utils.printToFile(`${l}.${m} ${team.runsPerBall[j].player} got out\n`)
          } else {
            Utils.printToFile(`${l}.${m} ${team.runsPerBall[j].player} scores ${team.runsPerBall[j].runs}\n`)
          }
        } else {
          return;
        }
      }
      Utils.printToFile(`\n`);
    }
    Utils.printToFile(`\n`);
  }

  _displayCommentary(team, displayEndOfOver = false) {
    let me = this;
    Utils.printToFile(`Sample Commentary\n\n`);
    me._displayTeamWiseCommentary(team, displayEndOfOver);
  }

  _displayPlayerScoreCard(team) {
    Utils.printToFile(`${team.name}\n`);
    _.forEach(_.sortBy(team.players, ['battingOrder']), (player) => {
      if (player.runs.scored || player.runs.ballsFaced) {
        Utils.printToFile(`${player.name} - ${player.runs.scored}${player.isOut ? '' : '*'} (${player.runs.ballsFaced} balls)\n`);
      }
    });
    Utils.printToFile(`\n`);
  }
}

module.exports = BaseApp;