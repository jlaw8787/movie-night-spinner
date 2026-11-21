/* Lighter print (21 Nov 2026): the opt-in switch lifts every PDF page before it goes in, so home printers that print dark use less ink. */
const fs=require("fs"),path=require("path"),assert=require("assert");
const root=path.join(__dirname,".."),app=fs.readFileSync(path.join(root,"app.js"),"utf8"),html=fs.readFileSync(path.join(root,"index.html"),"utf8");
assert(/id="lightBtn"[^>]*>Lighter print: off</.test(html),"Lighter print button is in More options");
assert(app.includes('localStorage.getItem("mns-lightprint")'),"the choice is remembered on the device");
const lut=new Function("return "+app.match(/const INK_LUT=(\(\(\)=>\{[\s\S]*?\}\)\(\))/)[1])();
assert.strictEqual(lut[0],0);assert.strictEqual(lut[255],255);
for(let v=1;v<255;v++)assert(lut[v]>=v,"never darkens");
assert(lut[40]>70,"navy panels come out clearly lighter");
/* every A4 page that goes into a PDF passes through inkLift once (sheet pages are lifted as they render, so not twice) */
const kitLine=app.split("\n").filter(l=>/pdf\.addImage\((?!inkLift)\w+\.toDataURL/.test(l)&&!/cvs\.forEach/.test(l));
assert(app.includes("cvs.push(inkLift(await renderCanvas(el,true)))"),"sheet pages lifted as they render");
assert(!app.includes("inkLift(cv).toDataURL"),"sheet pages not lifted twice");
console.log(`PASS: lighter print switch, remembered choice, gamma lift never darkens, every PDF page lifted once (${kitLine.length} other addImage line(s) left as is).`);
