export const sample = () => ({id:crypto.randomUUID(),title:'스크린샷 구조대 · 캡스톤 발표',audience:'교수님 · 캡스톤 심사',minutes:7,created:Date.now(),pages:[
 {title:'캡처는 했는데, 어디에 있더라?',source:'스크린샷 구조대\n대학생의 학교 공지 캡처를 일정과 할 일로 정리하는 서비스\n문제 정의 · 대상 사용자',script:'안녕하세요. 학교 공지를 캡처해 두고도 마감일을 놓치는 대학생을 위한 스크린샷 구조대를 소개합니다. 캡처한 공지를 다시 찾는 번거로움을 줄이기 위해 이 프로젝트를 시작했습니다.'},
 {title:'캡처 한 장이 할 일이 되기까지',source:'주요 기능\nOCR 텍스트 추출\n마감일 인식\n사용자 확인 및 수정\n일정 등록',script:'사용자가 캡처를 올리면 텍스트와 마감일을 추출하고 일정으로 등록합니다. 누구나 쉽게 사용할 수 있으며 정확도가 높습니다.'},
 {title:'기존 방식과 무엇이 다를까요?',source:'차별점\n직접 입력하는 캘린더와 비교\n공지에서 할 일 자동 추출\n사용자 확인 후 저장',script:'기존 캘린더에 비해 편리합니다. 사용자의 시간을 절약할 수 있습니다.'},
 {title:'검증과 다음 단계',source:'검증 계획\n대학생 대상 사용성 실험\n직접 입력과 소요 시간 비교\n날짜 추출 오류율 측정',script:''}],history:[],battle:null,mode:'text',page:0,revision:0});
export const blank=()=>({...sample(),id:crypto.randomUUID(),title:'새 발표 프로젝트',pages:[{title:'발표 시작',source:'',script:''}],history:[]});
export function basicAnalysis(p){
 const findings=[]; const add=(page,title,detail,evidence,mission)=>findings.push({page,title,detail,evidence,mission});
 p.pages.forEach((s,i)=>{
  const n=i+1,t=s.script.trim();
  if(!t){add(n,'발표문이 비어 있어요','이 페이지에서 전달할 핵심 내용을 작성해 주세요.',s.source.slice(0,130),'이 페이지의 핵심 내용을 2~3문장으로 설명하기');return;}
  if(!s.source.trim()) add(n,'비교할 자료가 없어요','슬라이드 텍스트를 입력하거나 PDF를 등록하면 비교할 수 있어요.',t.slice(0,100),'자료 내용을 등록하고 발표문과 비교하기');
  if(/정확|효율|절약|편리|향상|누구나/.test(t)&&!/[0-9]|측정|실험|검증|아직|계획/.test(t)) add(n,'효과를 설명하는 근거를 점검해요','효과를 나타내는 표현이 있지만, 이 발표문에서 수치·실험·검증 계획 표현을 찾지 못했어요. 다른 페이지에 근거가 있는지도 확인하세요.',t.split(/[.!?。]/).find(x=>/정확|효율|절약|편리|향상|누구나/.test(x))?.trim()||t.slice(0,100),'효과의 근거를 설명하거나 아직 검증 전임을 밝히기');
  const terms=[...new Set(s.source.match(/[가-힣A-Za-z]{3,}/g)||[])].filter(w=>!['그리고','서비스','프로젝트'].includes(w));
  const missing=terms.filter(w=>!t.includes(w));
  if(terms.length>=3&&missing.length/terms.length>.65) add(n,'자료의 핵심어를 확인해요','단어 일치 기준으로 자료의 일부 표현이 발표문에 없어요. 다른 말로 설명했다면 문제없어요.',missing.slice(0,5).join(' · '),'자료의 핵심 개념이 발표문에 설명되어 있는지 확인하기');
  if(t.length>1100) add(n,'한 페이지의 설명이 길어요','이 페이지의 발표문이 1,100자를 넘어요. 핵심 메시지를 먼저 전달해 보세요.',t.slice(0,100)+'…','핵심 내용을 먼저 말하고 세부 설명 줄이기');
 });
 const chars=p.pages.reduce((n,s)=>n+s.script.replace(/\s/g,'').length,0);
 return {summary:findings.length?`${findings.length}개의 확인 항목을 찾았어요. 근거를 읽고 필요한 부분부터 고쳐 보세요.`:'기본 규칙에서 추가 확인 항목을 찾지 못했어요. 보스전에서 설명을 더 점검해 보세요.',findings,chars,estimatedMinutes:Math.round(chars/300*10)/10,engine:'basic'};
}
export function questions(p,kind){
 const texts=p.pages.map((s,i)=>({s,i})).filter(x=>x.s.script.trim());
 const first=texts[0]||{s:p.pages[0],i:0};
 const claim=texts.find(x=>/정확|효율|편리|향상|절약/.test(x.s.script))||first;
 const variants={evidence:['발표의 핵심 주장을 뒷받침할 자료나 실험은 무엇인가요?','그 결과를 어떻게 측정하고 비교할 계획인가요?','예상과 다른 결과가 나온다면 무엇을 바꾸겠어요?'],practical:['누가 어떤 상황에서 이 결과물을 사용하나요?','사용 중 오류가 발생하면 어떻게 대응하나요?','실제 사용 환경에서 가장 먼저 확인할 제약은 무엇인가요?'],difference:['기존 방식과 비교해 바뀌는 과정은 무엇인가요?','그 차이가 사용자에게 왜 중요한가요?','기존 방식이 더 나은 상황도 있을까요?'],concept:['프로젝트의 핵심 원리를 쉬운 말로 설명해 주세요.','그 방법을 선택한 이유는 무엇인가요?','이 방법의 한계는 무엇인가요?']};
 return (variants[kind]||variants.evidence).map((q,i)=>({page:(i===1?claim:first).i+1,text:`${(i===1?claim:first).i+1}페이지 「${(i===1?claim:first).s.title}」에 대해 질문할게요. ${q}`}));
}
export function followup(answer){if(/모르|아직|못했|계획/.test(answer))return '아직 확인하지 못한 부분을 인정했네요. 무엇을, 어떤 방법과 기준으로 확인할지 구체적으로 설명해 주세요.';if(/\d/.test(answer))return '말씀한 수치는 어떤 조건에서 얻었나요? 비교 대상과 측정 방법을 설명해 주세요.';if(answer.trim().length<40)return '방금 답변을 뒷받침하는 구체적인 사례를 하나 들어 주세요.';return `“${answer.trim().slice(0,65)}${answer.length>65?'…':''}”라고 답했네요. 이 설명이 성립하지 않는 상황이나 한계는 무엇인가요?`;}
