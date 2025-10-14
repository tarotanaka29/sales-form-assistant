// バックグラウンドスクリプト
chrome.commands.onCommand.addListener((command) => {
  if (command === 'auto-fill-form') {
    // アクティブタブに自動入力メッセージを送信
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'auto-fill' });
      }
    });
  }
});

// 拡張インストール時の初期化
chrome.runtime.onInstalled.addListener(() => {
  console.log('営業フォーム自動入力アシスタントがインストールされました');
});

