"use strict";
const _ = require('lodash');
const Utils = require('../common/utils');

class Match {
  constructor(data) {
    if (data) {
      _.extend(this, data);
    }
    this.players = [];
    this.teams = [];
    this.result;
  }

  getToss(team1, team2) {
    let random = Math.random();
    return random < 0.5 ? team1.getPreferences(this.type, this.weather) : team2.getPreferences(this.type, this.weather);
  }

  _updatePlayerScoreAndScoreBoard(player, scoreBoard, runs, ball, isOut = false) {
    player.runs.scored += runs;
    player.runs.ballsFaced++;
    let perBallData = {
      player: player.name,
      runs: runs,
      is_out: isOut
    };
    scoreBoard.runsPerBall[ball] = perBallData;
    scoreBoard.runsNeeded -= runs;
  }

  _changeStrike(remainingPlayers) {
    let temp = remainingPlayers[0];
    remainingPlayers[0] = remainingPlayers[1];
    remainingPlayers[1] = temp;
    return remainingPlayers[0];
  }

  _simulateEveryBall(striker, scoreBoard, remainingPlayers, ball) {
    let me = this;
    let runsScored = striker.runScoredInOneBall();
    switch (runsScored) {
      case 'dot':
        me._updatePlayerScoreAndScoreBoard(striker, scoreBoard, 0, ball);
        break;
      case '1':
      case '3':
      case '5':
        me._updatePlayerScoreAndScoreBoard(striker, scoreBoard, Number(runsScored), ball);
        striker = me._changeStrike(remainingPlayers);
        break;
      case 'out':
          me._updatePlayerScoreAndScoreBoard(striker, scoreBoard, 0, ball, true);
          let wicket = remainingPlayers.shift();
          remainingPlayers.push(wicket)
          striker = me._changeStrike(remainingPlayers);
          striker.isOut = true;
          scoreBoard.wktsLeft-- ;
          break;
      default:
        me._updatePlayerScoreAndScoreBoard(striker, scoreBoard, Number(runsScored), ball);
        break;
    }
    return striker;
  }

  simulateOvers() {
    let me = this;
    let players = me.players;
    let scoreBoard = me.scoreBoard;
    let remainingPlayers = players;
    let striker = remainingPlayers[0];
    let totalBalls = scoreBoard.oversLeft * 6
    for(let i = 1; i <= totalBalls; i++) {
      let ball = i % 6;
      if (ball === 1 && scoreBoard.oversLeft >=1) {
        scoreBoard.runsPerOver[scoreBoard.oversLeft] = scoreBoard.runsNeeded;
        scoreBoard.oversLeft--;
      }
      striker = me._simulateEveryBall(striker, scoreBoard, remainingPlayers, i);
      if ((scoreBoard.wktsLeft == 0 || i == totalBalls) && scoreBoard.runsNeeded > 0) {
        me.result = 'Lost';
        break;
      } else if (scoreBoard.runsNeeded == 0) {
        me.result = 'Won';
        scoreBoard.ballsRemaining = totalBalls - i;
        break;
      } 
    }
    me.summary();
  }

  _displayMatchResult() {
    let me = this;
    let battingTeam, bowlingTeam;
    if (me.teams[0].isBatting) {
      battingTeam = me.teams[0].name;
      bowlingTeam = me.teams[1].name;
    } else {
      battingTeam = me.teams[1].name;
      bowlingTeam = me.teams[0].name;
    }
    if (me.result == 'Won') {
      Utils.printToFile(`${battingTeam} won by ${me.scoreBoard.wktsLeft} wickets and ${me.scoreBoard.ballsRemaining} balls remaining\n\n`);
    } else {
      Utils.printToFile(`${bowlingTeam} won by ${me.scoreBoard.runsNeeded} runs\n\n`);
    }
    _.forEach(_.sortBy(me.players, ['battingOrder']), (player) => {
      if (player.runs.scored || player.runs.ballsFaced) {
        Utils.printToFile(`${player.name} - ${player.runs.scored}${player.isOut ? '' : '*'} (${player.runs.ballsFaced} balls)\n`);
      }
    });
    Utils.printToFile(`\n`);
  }

  _displayCommentary() {
    let me = this;
    Utils.printToFile(`Sample Commentary\n`);
    let oversLeft = me.scoreBoard.runsPerOver.length - 1;
    for (let i = oversLeft, j = 1, l = 0; i > 0; i--, l++) {
      if (me.scoreBoard.runsPerOver[i] != undefined) {
        Utils.printToFile(`\n${i} overs left. ${me.scoreBoard.runsPerOver[i]} runs to win\n\n`)
      }
      for (let k = j, m = 1; j < k+6  ; j++, m++) {
        if (me.scoreBoard.runsPerBall[j] != undefined) {
          if (me.scoreBoard.runsPerBall[j].is_out) {
            Utils.printToFile(`${l}.${m} ${me.scoreBoard.runsPerBall[j].player} got out\n`)
          } else {
            Utils.printToFile(`${l}.${m} ${me.scoreBoard.runsPerBall[j].player} scores ${me.scoreBoard.runsPerBall[j].runs}\n`)
          }
        } else {
          return;
        }
      }
    }
  }

  summary() {
    this._displayMatchResult();
    this._displayCommentary();
  }
}

module.exports = Match;