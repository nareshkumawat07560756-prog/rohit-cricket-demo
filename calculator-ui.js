document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#point-form');
  const result = document.querySelector('#point-result');
  if (!form || !result || !window.FantasyPointCalculator) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const stats = {};
    for (const [key, value] of data.entries()) {
      stats[key] = ['isPlaying11', 'isOut'].includes(key) ? true : value;
    }
    stats.isPlaying11 = data.has('isPlaying11');
    stats.isOut = data.has('isOut');
    const points = FantasyPointCalculator.calculatePlayerPoints(stats, data.get('role'));
    const labels = {
      basePoints: 'Starting XI', battingPoints: 'Batting', bowlingPoints: 'Bowling',
      fieldingPoints: 'Fielding', economyPoints: 'Economy', strikeRatePoints: 'Strike Rate'
    };
    const breakdown = Object.entries(points.breakdown).map(([key, value]) =>
      `<span>${labels[key]}<b>${value} pts</b></span>`).join('');
    result.innerHTML = `<div class="result-total">${points.finalFantasyPoints} Fantasy Points</div><div class="result-meta">Raw points: ${points.rawPoints} • Multiplier: ${points.multiplier}× • Role: ${points.role}</div><div class="breakdown">${breakdown}</div>`;
    result.classList.add('visible');
  });
});
