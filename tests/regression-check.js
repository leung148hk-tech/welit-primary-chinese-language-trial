#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(root).filter(name => name.endsWith('.html')).sort();
const courseFiles = htmlFiles.filter(name => name !== 'index.html');
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function checkInlineJavaScript(fileName, content) {
  const blocks = [...content.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
  blocks.forEach((match, index) => {
    const scriptPath = path.join('/tmp', `jcmkec-${fileName}-${index}.js`);
    fs.writeFileSync(scriptPath, match[1]);
    try {
      execFileSync('node', ['--check', scriptPath], { stdio: 'pipe' });
    } catch (_) {
      failures.push(`${fileName}: 第 ${index + 1} 段內嵌 JavaScript 語法錯誤`);
    } finally {
      try { fs.unlinkSync(scriptPath); } catch (_) {}
    }
  });
}

expect(courseFiles.length === 24, `應有 24 個題庫頁，實際為 ${courseFiles.length} 個。`);
const indexContent = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
expect((indexContent.match(/location\.href='[^']+\.html'/g) || []).length === 24, 'index.html 必須提供 24 個可直接開啟的題庫按鈕。');
expect(indexContent.includes('免登入、免帳戶、免雲端同步'), 'index.html 未清楚說明直接遊玩模式。');
expect(!/firebase|localStorage|sessionStorage|signIn|teacher-dashboard|student-tools/i.test(indexContent), 'index.html 殘留登入、雲端或持久化進度功能。');
expect(!/t_(word|sent|rhet|para|read|listen|culture|write)_\d/.test(indexContent), 'index.html 仍含舊版關卡解鎖徽章。');
checkInlineJavaScript('index.html', indexContent);

courseFiles.forEach(fileName => {
  const content = fs.readFileSync(path.join(root, fileName), 'utf8');
  expect(content.includes('src="no-progress-storage.js"'), `${fileName}: 未載入本頁記憶體儲存橋接。`);
  expect(content.includes('src="diagnostics.js"'), `${fileName}: 未載入 diagnostics.js。`);
  expect(content.includes('href="mobile-accessibility.css"'), `${fileName}: 未載入 mobile-accessibility.css。`);
  expect(content.includes('src="student-feedback.js"'), `${fileName}: 未載入 student-feedback.js。`);
  checkInlineJavaScript(fileName, content);
});

const persistentApi = /\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b|\bfirebase\b|signInAnonymously|signInWith|createUserWith/i;
for (const fileName of fs.readdirSync(root).filter(name => name.endsWith('.html') || name.endsWith('.js'))) {
  if (fileName === 'no-progress-storage.js') continue;
  const content = fs.readFileSync(path.join(root, fileName), 'utf8');
  expect(!persistentApi.test(content), `${fileName}: 殘留 Firebase、登入或持久化儲存 API。`);
}

const shimPath = path.join(root, 'no-progress-storage.js');
expect(fs.existsSync(shimPath), '找不到 no-progress-storage.js。');
if (fs.existsSync(shimPath)) {
  const shim = fs.readFileSync(shimPath, 'utf8');
  expect(shim.includes('const data = new Map()'), '記憶體儲存橋接未使用暫存 Map。');
  expect(shim.includes("Object.defineProperty(window, '__jcmkecSessionStore'"), '記憶體儲存橋接未提供相容 API。');
  expect(!persistentApi.test(shim), '記憶體儲存橋接不可使用 Firebase 或持久化儲存。');
}

// 聆聽基礎版保留已驗證的專屬故事播放器；其餘語音頁使用外部共用管理器。
for (const fileName of courseFiles.filter(name => name !== 'listen_basic.html')) {
  const content = fs.readFileSync(path.join(root, fileName), 'utf8');
  expect(content.includes('src="voice-manager.js"'), `${fileName}: 未載入 voice-manager.js。`);
}

const misleadingCorrectFeedbackPages = courseFiles.filter(fileName => {
  const content = fs.readFileSync(path.join(root, fileName), 'utf8');
  return /\.option-btn\.correct\s*\{\s*background-color:\s*#fff1f2;/m.test(content);
});
expect(misleadingCorrectFeedbackPages.length === 0, `正確答案不可使用紅色回饋：${misleadingCorrectFeedbackPages.join(', ')}`);

const directUtterancePages = courseFiles.filter(fileName => fs.readFileSync(path.join(root, fileName), 'utf8').includes('new SpeechSynthesisUtterance'));
const unapprovedDirectUtterancePages = directUtterancePages.filter(fileName => fileName !== 'listen_basic.html');
expect(unapprovedDirectUtterancePages.length === 0, `仍有未遷移的直接語音物件頁面：${unapprovedDirectUtterancePages.join(', ')}`);

const longCourseNavigationPages = [
  'read_standard.html', 'read_advanced.html',
  'listen_standard.html', 'listen_advanced.html',
  'sentence_standard.html', 'sentence_advanced.html',
  'paragraph_standard.html', 'paragraph_advanced.html',
  'write_standard.html', 'write_advanced.html'
];
longCourseNavigationPages.forEach(fileName => {
  const content = fs.readFileSync(path.join(root, fileName), 'utf8');
  expect(content.includes('src="mobile-long-course-nav.js"'), `${fileName}: 未載入 mobile-long-course-nav.js。`);
});

const navigationExpectations = {
  'word_basic.html': 'continueLearning',
  'read_basic.html': 'continueReading',
  'listen_basic.html': 'continueListenLearning',
  'sentence_basic.html': 'continueSentenceLearning',
  'paragraph_basic.html': 'continueParagraphLearning',
  'write_basic.html': 'continueWriting'
};
Object.entries(navigationExpectations).forEach(([fileName, marker]) => {
  const content = fs.readFileSync(path.join(root, fileName), 'utf8');
  expect(content.includes(marker), `${fileName}: 找不到手機續學入口 ${marker}`);
});

const specialFeedbackExpectations = {
  'word_standard.html': ["StudentFeedback?.wrong(btnElement, '這個字沒有錯", 'StudentFeedback?.clear(btnElement)'],
  'paragraph_basic.html': ["StudentFeedback?.wrong(tArea, '順序尚未正確"],
  'paragraph_standard.html': ["StudentFeedback?.wrong(tArea, '順序尚未正確", "StudentFeedback?.wrong(sandboxPad, '還有格式槽位未完成"],
  'paragraph_advanced.html': ["StudentFeedback?.wrong(tArea, '順序尚未正確", "StudentFeedback?.wrong(sandboxPad, '還有格式槽位未完成"],
  'write_basic.html': ['StudentFeedback?.show(`有 ${wrongIndices.length} 個位置需要調整。'],
  'write_standard.html': ['StudentFeedback?.markWrong(slotElem)', 'StudentFeedback?.show(`有 ${wrongIndices.length} 個位置需要調整。'],
  'write_advanced.html': ['StudentFeedback?.markWrong(slot)', "StudentFeedback?.wrong(selectedButtons[0]", "StudentFeedback?.wrong(btn, '這個成語不太合適"]
};
Object.entries(specialFeedbackExpectations).forEach(([fileName, markers]) => {
  const content = fs.readFileSync(path.join(root, fileName), 'utf8');
  markers.forEach(marker => expect(content.includes(marker), `${fileName}: 特殊題型未接入共用錯答回饋 ${marker}`));
});

for (const fileName of ['diagnostics.js', 'student-feedback.js', 'voice-manager.js', 'mobile-long-course-nav.js', 'no-progress-storage.js']) {
  const scriptPath = path.join(root, fileName);
  expect(fs.existsSync(scriptPath), `找不到 ${fileName}。`);
  if (!fs.existsSync(scriptPath)) continue;
  try {
    execFileSync('node', ['--check', scriptPath], { stdio: 'pipe' });
  } catch (_) {
    failures.push(`${fileName}: JavaScript 語法錯誤`);
  }
}

if (failures.length) {
  console.error('Regression checks failed:');
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Regression checks passed for ${htmlFiles.length} HTML pages.`);
console.log('Verified: direct access to all 24 courses, no login, no Firebase, no persistent progress storage, accessible answer feedback, voice support, inline JavaScript syntax, and mobile navigation.');
