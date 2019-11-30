const Player = require('../../src/models/player'),
  Utils = require('../../src/common/utils'),
  expect = require('chai').expect,
  sinon = require('sinon'),
  samplePlayerData = require("../data-samples/player");

describe('Testing Player functions', function() {

  let player = new Player(samplePlayerData);
  let randomIntFromIntervalStub = sinon.stub(Utils, "randomIntFromInterval").returns(55);

  context('runScoredInOneBall', function() {
    it('check if non-zero score is returned', function() {
      expect(player.runScoredInOneBall()).to.equal('2');
      expect(randomIntFromIntervalStub.calledOnce).to.be.true;
    })

    it('check if -1 is returned when probability is incorrect', function() {
      player.runs.probability = {
        "dot": -5,
        "1": -30,
        "2":-25,
        "3":-10,
        "4":-15,
        "5":-1,
        "6":-9,
        "out":-5
      }
      expect(player.runScoredInOneBall()).to.equal(-1);
    })
  })
  
})