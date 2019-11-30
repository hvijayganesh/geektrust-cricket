const Player = require('../../src/models/player'),
  Team = require('../../src/models/team'),
  Match = require('../../src/models/match'),
  ScoreBoard = require('../../src/models/score-board'),
  expect = require('chai').expect,
  sinon = require('sinon'),
  samplePlayerData = require("../data-samples/player"),
  _ = require('lodash');

describe('Testing Match functions', function() {

  let team, player, match;

  context('simulateOvers', function() {

    beforeEach(() => {
      try {
        team = new Team('Lengaburu');
        player = new Player(samplePlayerData);
        player.runs.scored = 0;
        player.runs.ballsFaced = 0;
        match = new Match();
        match.scoreBoard = new ScoreBoard({
          oversLeft: 1,
          runsNeeded: 0,
          wktsLeft: 1
        });
        team.players.push(player);
        team.battingFirst = true;
        match.teams.push(team);
      } catch (e) {
        throw e;
      }
    });

    it('Batting First and player does not change strike', function() {
      runScoredInOneBallStub = sinon.stub(player, "runScoredInOneBall");
      runScoredInOneBallStub.onFirstCall().returns("dot");
      runScoredInOneBallStub.onSecondCall().returns('6');
      runScoredInOneBallStub.returns('2');
      match.simulateOvers(team);
      expect(player.runs.scored).to.be.equals(14);
      expect(player.runs.ballsFaced).to.be.equals(6);
      expect(match.scoreBoard.runsNeeded).to.be.equals(14);
      runScoredInOneBallStub.restore();
    })
    
    it('Batting First and players change strike', function() {
      player.runs.scored = 0;
      player.runs.ballsFaced = 0;

      let player2Data = _.cloneDeep(samplePlayerData);
      player2Data.name = 'N.S Nodhi';
      let player2 = new Player(player2Data);
      team.players.push(player2);

      runScoredInOneBallPlayer1Stub = sinon.stub(player, "runScoredInOneBall");
      runScoredInOneBallPlayer1Stub.onFirstCall().returns("1");

      runScoredInOneBallPlayer2Stub = sinon.stub(player2, "runScoredInOneBall");
      runScoredInOneBallPlayer2Stub.returns('2');

      match.simulateOvers(team);
      expect(player.runs.scored).to.be.equals(1);
      expect(player.runs.ballsFaced).to.be.equals(1);
      expect(player2.runs.scored).to.be.equals(10);
      expect(player2.runs.ballsFaced).to.be.equals(5);
      expect(match.scoreBoard.runsNeeded).to.be.equals(11);

      runScoredInOneBallPlayer1Stub.restore();
      runScoredInOneBallPlayer2Stub.restore();
    })

    it('Batting First and player get out', function() {
      player.runs.scored = 0;
      player.runs.ballsFaced = 0;

      let player2Data = _.cloneDeep(samplePlayerData);
      player2Data.name = 'N.S Nodhi';
      let player2 = new Player(player2Data);
      team.players.push(player2);

      let player3Data = _.cloneDeep(samplePlayerData);
      player3Data.name = 'R Rumrah';
      let player3 = new Player(player3Data);
      team.players.push(player3);

      runScoredInOneBallPlayer1Stub = sinon.stub(player, "runScoredInOneBall");
      runScoredInOneBallPlayer1Stub.onFirstCall().returns("out");

      runScoredInOneBallPlayer3Stub = sinon.stub(player3, "runScoredInOneBall");
      runScoredInOneBallPlayer3Stub.returns('2');

      match.simulateOvers(team);
      expect(player.runs.scored).to.be.equals(0);
      expect(player.runs.ballsFaced).to.be.equals(1);
      expect(player2.runs.scored).to.be.equals(0);
      expect(player2.runs.ballsFaced).to.be.equals(0);
      expect(player3.runs.scored).to.be.equals(10);
      expect(player3.runs.ballsFaced).to.be.equals(5);
      expect(match.scoreBoard.runsNeeded).to.be.equals(10);

      runScoredInOneBallPlayer1Stub.restore();
      runScoredInOneBallPlayer3Stub.restore();
    })

    it('Batting Second and match won', function() {
      player.runs.scored = 0;
      player.runs.ballsFaced = 0;

      match.scoreBoard = new ScoreBoard({
        oversLeft: 1,
        runsNeeded: 5,
        wktsLeft: 1
      });

      let player2Data = _.cloneDeep(samplePlayerData);
      player2Data.name = 'N.S Nodhi';
      let player2 = new Player(player2Data);
      team.players.push(player2);
      team.battingFirst = false;

      runScoredInOneBallPlayer1Stub = sinon.stub(player, "runScoredInOneBall");
      runScoredInOneBallPlayer1Stub.onFirstCall().returns("6");

      match.simulateOvers(team);
      expect(player.runs.scored).to.be.equals(6);
      expect(player.runs.ballsFaced).to.be.equals(1);
      expect(player2.runs.scored).to.be.equals(0);
      expect(player2.runs.ballsFaced).to.be.equals(0);
      expect(match.result).to.be.equals('Won');
      expect(match.scoreBoard.ballsRemaining).to.be.equals(5);
      expect(team.hasWon).to.be.true;

      runScoredInOneBallPlayer1Stub.restore();
    })

    it('Batting Second and match lost', function() {
      player.runs.scored = 0;
      player.runs.ballsFaced = 0;

      match.scoreBoard = new ScoreBoard({
        oversLeft: 1,
        runsNeeded: 10,
        wktsLeft: 1
      });

      let player2Data = _.cloneDeep(samplePlayerData);
      player2Data.name = 'N.S Nodhi';
      let player2 = new Player(player2Data);
      team.players.push(player2);
      team.battingFirst = false;

      runScoredInOneBallPlayer1Stub = sinon.stub(player, "runScoredInOneBall");
      runScoredInOneBallPlayer1Stub.returns("0");

      match.simulateOvers(team);
      expect(player.runs.scored).to.be.equals(0);
      expect(player.runs.ballsFaced).to.be.equals(6);
      expect(player2.runs.scored).to.be.equals(0);
      expect(player2.runs.ballsFaced).to.be.equals(0);
      expect(match.result).to.be.equals('Lost');
      expect(match.scoreBoard.ballsRemaining).to.be.equals(0);
      expect(team.hasWon).to.be.false;

      runScoredInOneBallPlayer1Stub.restore();
    })
  })
  
})