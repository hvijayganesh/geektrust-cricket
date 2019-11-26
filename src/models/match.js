"use strict";
const _ = require('lodash');
const Utils = require('../common/utils');

class Match {
  constructor(data) {
    if (data) {
      _.extend(this, data);
    }
    this.teams = [];
    this.result;
  }

  getToss(team1, team2) {
    let random = Math.random();
    return random < 0.5 ? team1.getPreferences(this.type, this.weather) : team2.getPreferences(this.type, this.weather);
  }

  _updatePlayerScoreAndScoreBoard(player, scoreBoard, runs, ball, isOut = false, team) {
    player.runs.scored += runs;
    player.runs.ballsFaced++;
    let perBallData = {
      player: player.name,
      runs: runs,
      is_out: isOut
    };
    team.runsPerBall[ball] = perBallData;
    team.battingFirst ? scoreBoard.runsNeeded += runs : scoreBoard.runsNeeded -= runs;
  }

  _changeStrike(remainingPlayers) {
    let temp = remainingPlayers[0];
    remainingPlayers[0] = remainingPlayers[1];
    remainingPlayers[1] = temp;
    return remainingPlayers[0];
  }

  _simulateEveryBall(striker, scoreBoard, remainingPlayers, ball, team) {
    let me = this;
    let runsScored = striker.runScoredInOneBall();
    switch (runsScored) {
      case 'dot':
        me._updatePlayerScoreAndScoreBoard(striker, scoreBoard, 0, ball, false, team);
        break;
      case '1':
      case '3':
      case '5':
        me._updatePlayerScoreAndScoreBoard(striker, scoreBoard, Number(runsScored), ball, false, team);
        striker = me._changeStrike(remainingPlayers);
        break;
      case 'out':
          me._updatePlayerScoreAndScoreBoard(striker, scoreBoard, 0, ball, true, team);
          let playerGotOut = remainingPlayers.shift();
          playerGotOut.isOut = true;
          remainingPlayers.push(playerGotOut)
          striker = me._changeStrike(remainingPlayers);
          scoreBoard.wktsLeft-- ;
          break;
      default:
        me._updatePlayerScoreAndScoreBoard(striker, scoreBoard, Number(runsScored), ball, false, team);
        break;
    }
    return striker;
  }

  _checkTargetReached(team, scoreBoard, i, totalBalls) {
    let me = this;
    if ((scoreBoard.wktsLeft == 0 || i == totalBalls) && scoreBoard.runsNeeded > 0) {
      me.result = 'Lost';
      scoreBoard.ballsRemaining = totalBalls - i;
      return true;
    } else if (scoreBoard.runsNeeded < 0) {
      me.result = 'Won';
      team.hasWon = true;
      scoreBoard.ballsRemaining = totalBalls - i;
      return true;
    }
    return false;
  }

  simulateOvers(team) {
    let me = this;
    let players = team.players;
    let scoreBoard = me.scoreBoard;
    let remainingPlayers = players;
    let striker = remainingPlayers[0];
    let totalBalls = scoreBoard.oversLeft * 6
    for(let i = 1; i <= totalBalls; i++) {
      let ball = i % 6;
      if (ball === 1 && scoreBoard.oversLeft >=1) {
        team.runsPerOver[scoreBoard.oversLeft] = scoreBoard.runsNeeded;
        scoreBoard.oversLeft--;
      }
      striker = me._simulateEveryBall(striker, scoreBoard, remainingPlayers, i, team);
      if (!team.battingFirst) {
        if(me._checkTargetReached(team, scoreBoard, i, totalBalls))
          break;
      }
    }
  }

  _displayMatchResult(team) {
    let me = this;
    if (me.result == 'Won') {
      Utils.printToFile(`${team.name} won by ${me.scoreBoard.wktsLeft} wickets and ${me.scoreBoard.ballsRemaining} balls remaining\n\n`);
    } else {
      Utils.printToFile(`${team.name} lost by ${me.scoreBoard.runsNeeded} runs\n\n`);
    }
    _.forEach(_.sortBy(team.players, ['battingOrder']), (player) => {
      if (player.runs.scored || player.runs.ballsFaced) {
        Utils.printToFile(`${player.name} - ${player.runs.scored}${player.isOut ? '' : '*'} (${player.runs.ballsFaced} balls)\n`);
      }
    });
    Utils.printToFile(`\n`);
  }

  _displayCommentary(team) {
    let me = this;
    Utils.printToFile(`Sample Commentary\n`);
    let oversLeft = team.runsPerOver.length - 1;
    for (let i = oversLeft, j = 1, l = 0; i > 0; i--, l++) {
      if (team.runsPerOver[i] != undefined) {
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
    }
  }

  summary(team) {
    this._displayMatchResult(team);
    this._displayCommentary(team);
  }
}

module.exports = Match;