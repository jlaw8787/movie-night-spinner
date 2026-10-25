"""Put a finished print design onto the site in one go.
Usage: python3 integrate.py <print folder>
The folder holds film.json:
  {"fmt":"jurassic","fn":"fmtJurassic","faces":["outside.html","inside.html"],"names":["Outside","Inside"],
   "mm":[297,210],"fonts":"family=...","fams":["A","B"],"phone":{"disp":"'A',serif"},"build":"python3 build.py local"}
and optionally <fmt>.labels.json. Runs the design's build, converts the faces into the renderer,
updates fonts, phone palette and dish labels, then rebuilds the site data."""
import sys, os, json, subprocess
K = os.path.dirname(os.path.abspath(__file__)); REPO = '/home/claude/polish'
folder = os.path.abspath(sys.argv[1])
c = json.load(open(os.path.join(folder, 'film.json')))
def run(cmd, cwd=REPO):
    r = subprocess.run(cmd, cwd=cwd, shell=isinstance(cmd, str), capture_output=True, text=True)
    if r.returncode: raise SystemExit(f'FAILED: {cmd}\n{r.stdout[-1500:]}\n{r.stderr[-1500:]}')
    return r.stdout.strip()
src = c.get('src', folder)
if c.get('build'): run(c['build'], cwd=src)
run(['python3', f'{K}/ensure_helpers.py'])
old = os.path.join(REPO, 'assets', 'era', c['fmt'])
if os.path.isdir(old):
    for n in os.listdir(old): os.remove(os.path.join(old, n))
args = ['python3', f'{K}/to_renderer.py', src, c['fmt'], c['fn'], *c['faces'], '--mm', ','.join(str(x) for x in c['mm']), '--names', json.dumps(c['names'])]
if c.get('fonts'): args += ['--fonts', c['fonts']]
if c.get('fams'): args += ['--fams', ','.join(c['fams'])]
print(run(args))
if c.get('phone'): print(run(['python3', f'{K}/set_phone.py', c['fmt'], json.dumps(c['phone'])]))
if os.path.exists(os.path.join(folder, c['fmt'] + '.labels.json')): print(run(['python3', f'{K}/apply_labels.py', folder, c['fmt']]))
print(run(['node', 'scripts/build-data.cjs']).splitlines()[-1])
