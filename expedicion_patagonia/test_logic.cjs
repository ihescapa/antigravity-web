const TEMPLATES = {
  Patagotitan: { parts: ['head','neck1','neck2','body','tail'], animalType: 'dinoLarge' },
  Manidens: { parts: ['single'], animalType: 'dinoSmall' },
  Bagualia: { parts: ['head','neck','body','tail'], animalType: 'dinoLarge' },
};

function groupLabCards(labCards) {
  const assigned = new Set();
  const skeletons = [];
  const bySpecies = {};
  for (const card of labCards) {
    if (!bySpecies[card.name]) bySpecies[card.name] = [];
    bySpecies[card.name].push(card);
  }
  for (const [name, cards] of Object.entries(bySpecies)) {
    const tmpl = TEMPLATES[name];
    if (!tmpl) continue;
    if (tmpl.animalType === 'dinoSmall') {
      for (const c of cards) { skeletons.push({cards:[c],complete:true}); assigned.add(c.id); }
    } else {
      const byPart = {};
      for (const p of tmpl.parts) byPart[p] = cards.filter(c => c.type===p);
      const minCount = Math.min(...Object.values(byPart).map(a => a.length));
      for (let i=0; i<minCount; i++) {
        const sc = tmpl.parts.map(p => byPart[p][i]);
        skeletons.push({cards:sc,complete:true,species:name});
        sc.forEach(c => assigned.add(c.id));
      }
      const leftoverByPart = {};
      for (const p of tmpl.parts) leftoverByPart[p] = cards.filter(c => !assigned.has(c.id) && c.type===p);
      const leftover = Object.values(leftoverByPart).flat();
      if (leftover.length > 0) {
        skeletons.push({cards:leftover,complete:false,species:name});
        leftover.forEach(c => assigned.add(c.id));
      }
    }
  }
  return skeletons;
}

let pass = 0, fail = 0;
function check(label, value, expected) {
  if (value === expected) { console.log(`  ✅ ${label}: ${value}`); pass++; }
  else { console.log(`  ❌ ${label}: got ${value}, expected ${expected}`); fail++; }
}

// TEST 1: Patagotitan tail only — must produce 1 card total (was producing 5 before fix)
const r1 = groupLabCards([{id:'f55',name:'Patagotitan',type:'tail'}]);
const total1 = r1.reduce((s,sk) => s+sk.cards.length, 0);
console.log('\nTEST 1: Patagotitan tail only');
check('cards in skeletons', total1, 1);
check('skeleton count', r1.length, 1);
check('skeleton complete', r1[0].complete, false);

// TEST 2: Full Patagotitan (5 parts)
const fullPts = ['head','neck1','neck2','body','tail'].map((t,i) => ({id:'p'+i,name:'Patagotitan',type:t,subTag:'Rojo'}));
const r2 = groupLabCards(fullPts);
console.log('\nTEST 2: Full Patagotitan');
check('skeleton count', r2.length, 1);
check('complete', r2[0].complete, true);
check('card count', r2[0].cards.length, 5);

// TEST 3: 3 Manidens singles
const r3 = groupLabCards([{id:'m1',name:'Manidens',type:'single'},{id:'m2',name:'Manidens',type:'single'},{id:'m3',name:'Manidens',type:'single'}]);
console.log('\nTEST 3: 3x Manidens singles');
check('skeleton count', r3.length, 3);
check('all complete', r3.every(s=>s.complete), true);

// TEST 4: Deck counts
const fossils = [12,9,10,11,15,9,10,8,12,9,11,10].reduce((a,b)=>a+b,0);
const actions = 10+10+5+15+5+3+2;
const conditions = 2+2+2+4;
console.log('\nTEST 4: Deck counts');
check('fossil deck (126)', fossils, 126);
check('action deck (50)', actions, 50);
check('condition deck (10)', conditions, 10);

console.log(`\n=== ${pass} PASSED, ${fail} FAILED ===`);
process.exit(fail > 0 ? 1 : 0);
