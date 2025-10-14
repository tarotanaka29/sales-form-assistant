// フォーム項目自動判別エンジン
const FieldDetector = {
  // フィールドタイプを判別
  detectFieldType(element) {
    // ラベルテキストを優先的に取得
    const labelText = this.getLabelText(element);
    
    // 各属性を個別に評価（優先順位: ラベル > name > id > placeholder > className）
    const attributes = [
      labelText,
      element.name,
      element.id,
      element.placeholder,
      element.className
    ].filter(Boolean);
    
    // マッピングテーブルから最適なフィールドタイプを検索
    // 優先度の高い順に検索
    for (const attr of attributes) {
      const attrLower = attr.toLowerCase();
      
      for (const [fieldType, keywords] of Object.entries(FIELD_MAPPING)) {
        for (const keyword of keywords) {
          const keywordLower = keyword.toLowerCase();
          
          // 完全一致または部分一致をチェック
          if (attrLower === keywordLower || attrLower.includes(keywordLower)) {
            // 「名」が「企業名」「組織名」「会社名」の一部として含まれる場合は除外
            if (fieldType === 'firstName' && 
                (attrLower.includes('企業') || attrLower.includes('組織') || 
                 attrLower.includes('会社') || attrLower.includes('法人'))) {
              continue;
            }
            
            return fieldType;
          }
        }
      }
    }
    
    return null;
  },
  
  // ラベルテキストを取得
  getLabelText(element) {
    // label要素から取得
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent.trim();
    
    // 親要素のlabelから取得
    const parentLabel = element.closest('label');
    if (parentLabel) return parentLabel.textContent.trim();
    
    // 前の兄弟要素から取得
    let prev = element.previousElementSibling;
    while (prev) {
      if (prev.tagName === 'LABEL') {
        return prev.textContent.trim();
      }
      // divやspanの中のテキストも確認
      if (prev.textContent && prev.textContent.trim()) {
        const text = prev.textContent.trim();
        // 短いテキスト（ラベルらしいもの）のみ採用
        if (text.length < 50) {
          return text;
        }
      }
      prev = prev.previousElementSibling;
    }
    
    return '';
  },
  
  // 入力可能フィールドをすべて取得
  getAllInputFields() {
    return document.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="tel"], ' +
      'input[type="number"], input:not([type]), textarea, select'
    );
  }
};

