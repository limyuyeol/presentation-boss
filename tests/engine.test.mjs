import test from 'node:test';
import assert from 'node:assert/strict';
import {sample,basicAnalysis,questions,followup} from '../public/engine.js';
test('missing script and unsupported effects produce actionable findings',()=>{const p=sample(),r=basicAnalysis(p);assert(r.findings.some(f=>f.page===4&&f.title.includes('비어')));assert(r.findings.some(f=>f.page===2&&f.title.includes('근거')));assert(r.findings.every(f=>f.mission&&f.page>=1&&f.page<=4));});
test('adding explicit limitations removes unsupported effect flag',()=>{const p=sample();p.pages[1].script='정확도가 높을 것으로 기대하지만 아직 측정하지 못했고 실험을 계획하고 있습니다.';const r=basicAnalysis(p);assert(!r.findings.some(f=>f.page===2&&f.title.includes('근거')));});
test('question perspectives differ and follow-up reacts to uncertainty and numbers',()=>{const p=sample();assert.equal(questions(p,'concept').length,3);assert.notEqual(questions(p,'concept')[0].text,questions(p,'practical')[0].text);assert.match(followup('아직 검증하지 못했습니다.'),/확인/);assert.match(followup('실험에서 12초가 걸렸습니다.'),/측정/);});
