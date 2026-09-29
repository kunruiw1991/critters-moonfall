import {run} from './stress.mjs';
for(let level=1;level<=6;level++)console.log(JSON.stringify(run(level,731,20)));
