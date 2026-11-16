// Quiz night (quiz.js, data/quiz.json from scripts/build-quiz.cjs, written questions in data/trivia.json)
const assert = require('assert'), fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..'), rd = f => fs.readFileSync(path.join(R, f), 'utf8');
const films = JSON.parse(rd('data/films.json')), T = JSON.parse(rd('data/trivia.json')), Q = JSON.parse(rd('data/quiz.json'));
for (const f of films) {
  const id = f.title + ' (' + f.year + ')';
  assert.ok(T[id] && T[id].length >= 3, 'three written questions for ' + id);
  for (const q of T[id]) assert.ok(q.a.length === 4 && new Set(q.a).size === 4 && q.c >= 0 && q.c < 4, 'four different options and one answer: ' + id + ' ' + q.q);
  assert.ok(Q[id], 'quiz data for ' + id);
  const tw = f.title.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 4 && !['with', 'from', 'part', 'movie'].includes(w));
  for (const d of Q[id].d || []) assert.ok(!d.toLowerCase().split(/[^a-z0-9]+/).some(w => tw.some(t => w.startsWith(t))), 'menu round dish names the film: ' + id + ': ' + d);
}
const html = rd('index.html');
assert.ok(html.indexOf('src="quiz.js') > html.indexOf('src="friends.js'), 'quiz.js loads after friends.js');
assert.ok(html.includes('id="modeQuiz"') && html.includes('id="quizPanel"'), 'Quiz it tab and panel');
for (const f of ['quiz.js', 'scripts/build-quiz.cjs', 'data/trivia.json']) assert.ok(!rd(f).includes(String.fromCharCode(8212)), 'em dash in ' + f);
console.log('quiz: pass');
