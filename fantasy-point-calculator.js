/**
 * Rohit Cricket — Fantasy Cricket Point Engine
 * Demo-only scoring logic. Validate contest rules before production use.
 */
class FantasyPointCalculator {
  static calculatePlayerPoints(stats = {}, role = 'PLAYER') {
    const safe = {
      isPlaying11: Boolean(stats.isPlaying11),
      playerType: stats.playerType || 'PLAYER',
      runs: this.number(stats.runs, 0),
      ballsFaced: this.number(stats.ballsFaced, 0),
      fours: this.number(stats.fours, 0),
      sixes: this.number(stats.sixes, 0),
      isOut: Boolean(stats.isOut),
      wickets: this.number(stats.wickets, 0),
      bowledOrLbwWickets: this.number(stats.bowledOrLbwWickets, 0),
      oversBowled: this.number(stats.oversBowled, 0),
      runsConceded: this.number(stats.runsConceded, 0),
      maidenOvers: this.number(stats.maidenOvers, 0),
      catches: this.number(stats.catches, 0),
      stumpings: this.number(stats.stumpings, 0),
      directRunOuts: this.number(stats.directRunOuts, 0),
      indirectRunOuts: this.number(stats.indirectRunOuts, 0)
    };

    let basePoints = safe.isPlaying11 ? 25 : 0;
    let battingPoints = safe.runs + safe.fours + safe.sixes * 2;
    let bowlingPoints = safe.wickets * 25 + safe.bowledOrLbwWickets * 8;
    let fieldingPoints = safe.catches * 8 + safe.stumpings * 12 +
      safe.directRunOuts * 12 + safe.indirectRunOuts * 6;
    let economyPoints = 0;
    let strikeRatePoints = 0;

    if (safe.runs >= 100) battingPoints += 16;
    else if (safe.runs >= 50) battingPoints += 8;

    if (safe.runs === 0 && safe.isOut && safe.playerType !== 'BOWLER') {
      battingPoints -= 2;
    }

    if (safe.ballsFaced >= 10) {
      const strikeRate = (safe.runs / safe.ballsFaced) * 100;
      if (strikeRate > 170) strikeRatePoints += 6;
      else if (strikeRate >= 150.01) strikeRatePoints += 4;
      else if (strikeRate >= 130) strikeRatePoints += 2;
      else if (strikeRate >= 60 && strikeRate <= 70) strikeRatePoints -= 2;
      else if (strikeRate >= 50) strikeRatePoints -= 4;
      else strikeRatePoints -= 6;
    }

    if (safe.wickets >= 5) bowlingPoints += 16;
    else if (safe.wickets >= 4) bowlingPoints += 8;
    else if (safe.wickets >= 3) bowlingPoints += 4;
    bowlingPoints += safe.maidenOvers * 12;

    if (safe.oversBowled >= 2 && safe.oversBowled > 0) {
      const economy = safe.runsConceded / safe.oversBowled;
      if (economy < 5) economyPoints += 6;
      else if (economy <= 5.99) economyPoints += 4;
      else if (economy <= 7) economyPoints += 2;
      else if (economy >= 10 && economy <= 11) economyPoints -= 2;
      else if (economy <= 12) economyPoints -= 4;
      else economyPoints -= 6;
    }

    if (safe.catches >= 3) fieldingPoints += 4;

    const totalRawPoints = basePoints + battingPoints + bowlingPoints +
      fieldingPoints + economyPoints + strikeRatePoints;
    const multiplier = role === 'C' ? 2 : role === 'VC' ? 1.5 : 1;

    return {
      role,
      rawPoints: totalRawPoints,
      multiplier,
      finalFantasyPoints: totalRawPoints * multiplier,
      breakdown: { basePoints, battingPoints, bowlingPoints, fieldingPoints,
        economyPoints, strikeRatePoints }
    };
  }

  static number(value, fallback) {
    const result = Number(value);
    return Number.isFinite(result) && result >= 0 ? result : fallback;
  }
}

// Browser usage: window.FantasyPointCalculator.calculatePlayerPoints(stats, 'C')
if (typeof window !== 'undefined') window.FantasyPointCalculator = FantasyPointCalculator;
if (typeof module !== 'undefined') module.exports = FantasyPointCalculator;
