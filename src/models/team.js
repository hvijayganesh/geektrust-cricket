"use strict";
const _ = require('lodash');
const Utils = require('../common/utils');
const Player = require('./player');
class Team {
  constructor(name) {
    this.name = name;
    this.preference = {};
    this.isBatting = false;
    this.players = [];
    this.runsPerBall = [];
    this.runsPerOver = [];
    this.hasWon = false;
  }

  setPreferences(type, weather, action) {
    let key = `${type}-${weather}`
    this.preference[key] = action;
  }

  getPreferences(type, weather) {
    let key = `${type}-${weather}`
    if (_.isEmpty(this.preference[key])) {
      return `${this.name} wins toss and bats`
    } else {
      return `${this.name} wins toss and ${this.preference[key]}`;
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

  async _readPlayerStats(file) {
    try {
      return await Utils.readAndParsePlayerStats(file);
    } catch (error) {
      throw error;
    }
  }

  async loadPlayers(file) {
    let me = this;
    try {
      let playerStatsMap = await me._readPlayerStats(file)
      var battingOrder = 0;
      _.forOwn(playerStatsMap, function(probability, player) {
        me.players.push(Player.create(player, probability, battingOrder));
        battingOrder++;
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Team; 