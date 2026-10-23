const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:4173');await page.waitForTimeout(700);await page.screenshot({path:'artifacts/dashboard.png',fullPage:true});
 await page.getByRole('button',{name:'샘플로 먼저 연습하기'}).click();await page.locator('#script').fill('대학생을 위한 서비스입니다. 사용자는 공지를 캡처하지만 마감일을 놓칩니다. 이 문제를 해결할 계획입니다.');
 await page.reload();await page.waitForTimeout(500);await page.getByRole('button',{name:'이어서 연습하기'}).click();if(!(await page.locator('#script').inputValue()).includes('대학생을 위한'))throw Error('Persistence failed');
 await page.getByRole('button',{name:'기본 점검하기',exact:true}).click();await page.getByText('내 발표에서 발견한 보완점').waitFor();await page.screenshot({path:'artifacts/analysis.png',fullPage:true});
 await page.getByRole('button',{name:'보스전으로'}).click();await page.getByRole('button',{name:'기본 보스전 시작',exact:true}).click();
 await page.locator('#answer').fill('아직 검증하지 못했습니다. 사용자 실험을 계획하고 있습니다.');await page.getByRole('button',{name:'답변 제출'}).click();await page.getByText('아직 확인하지 못한 부분을 인정했네요.',{exact:false}).waitFor();
 await page.screenshot({path:'artifacts/battle.png',fullPage:true});
 for(let i=0;i<5;i++){await page.locator('#answer').fill('대학생 10명을 대상으로 직접 입력하는 시간과 비교하여 검증하겠습니다.');await page.getByRole('button',{name:'답변 제출'}).click();}
 await page.getByText('라운드 완료!',{exact:true}).waitFor();await page.getByRole('button',{name:'수정 미션 확인'}).click();await page.locator('[data-mission]').first().check();
 await page.getByRole('button',{name:'수정하고 다시 연습'}).click();await page.locator('#script').fill('수정된 발표문입니다. 측정은 아직 수행하지 않았고 실험을 계획하고 있습니다.');await page.getByRole('button',{name:'기본 점검하기',exact:true}).click();await page.getByRole('button',{name:'04 성장 기록'}).click();await page.getByText('이전 발표문',{exact:true}).waitFor();if(!(await page.locator('.compare').textContent()).includes('대학생을 위한'))throw Error('Comparison failed');
 await page.getByRole('button',{name:'01 준비 & 연습'}).click();await page.getByRole('button',{name:'마이크로 연습',exact:false}).click();await page.getByRole('button',{name:'녹음 시작'}).waitFor();
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/mobile-editor.png',fullPage:true});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Mobile overflow');
 await page.getByRole('button',{name:'프로젝트 목록',exact:true}).click();await page.screenshot({path:'artifacts/mobile-dashboard.png',fullPage:true});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Dashboard overflow');
 await page.getByRole('button',{name:'새 발표 만들기',exact:false}).click();await page.getByRole('button',{name:'기본 점검하기',exact:true}).click();await page.getByText('발표문을 한 페이지 이상 입력해 주세요.',{exact:true}).waitFor();
 await page.setViewportSize({width:1440,height:1000});await page.locator('#pdf-input').setInputFiles('artifacts/test.pdf');await page.waitForTimeout(1800);if(await page.locator('#source').inputValue()!=='CAPSTONE DEMO')throw Error('PDF extraction failed');if(await page.locator('canvas').count()!==1)throw Error('PDF canvas missing');
 if(errors.length)throw Error(errors.join('\n'));await browser.close();console.log('PASS: persistence, analysis, follow-up, 3-question round, missions, comparison, microphone UI, mobile layouts, empty input, PDF extraction and rendering.');
})().catch(e=>{console.error(e);process.exit(1)});
