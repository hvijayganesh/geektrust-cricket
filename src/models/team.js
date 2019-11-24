"use strict";
const _ = require('lodash');

class Team {
  constructor(name) {
    this.name = name;
    this.preference = {};
    this.isBatting = false;
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
}

module.exports = Team; 