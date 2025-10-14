// 自動分割ロジック
const AutoSplit = {
  // 電話番号分割 "090-1234-5678" → ["090", "1234", "5678"]
  splitPhone: (phoneNumber) => {
    if (!phoneNumber) return ['', '', ''];
    
    const cleaned = phoneNumber.replace(/[^\d]/g, '');
    
    if (cleaned.length === 11) {
      return [
        cleaned.substr(0, 3),
        cleaned.substr(3, 4), 
        cleaned.substr(7, 4)
      ];
    } else if (cleaned.length === 10) {
      return [
        cleaned.substr(0, 3),
        cleaned.substr(3, 3),
        cleaned.substr(6, 4)
      ];
    }
    return [cleaned, '', ''];
  },
  
  // 郵便番号分割 "123-4567" → ["123", "4567"]  
  splitZipCode: (zipCode) => {
    if (!zipCode) return ['', ''];
    
    const cleaned = zipCode.replace(/[^\d]/g, '');
    if (cleaned.length === 7) {
      return [cleaned.substr(0, 3), cleaned.substr(3, 4)];
    }
    return [cleaned, ''];
  },
  
  // 氏名分割 "山田太郎" → ["山田", "太郎"]
  splitName: (fullName) => {
    if (!fullName) return ['', ''];
    
    // 一般的な姓名分割（2文字姓を仮定）
    if (fullName.length >= 3) {
      return [fullName.substr(0, 2), fullName.substr(2)];
    } else if (fullName.length === 2) {
      return [fullName.substr(0, 1), fullName.substr(1)];
    }
    return [fullName, ''];
  },
  
  // フリガナ分割 "タナカタロウ" → ["タナカ", "タロウ"]
  splitKatakana: (fullKatakana) => {
    if (!fullKatakana) return ['', ''];
    
    // スペースで分割されている場合
    if (fullKatakana.includes(' ') || fullKatakana.includes('　')) {
      const parts = fullKatakana.split(/[\s　]+/);
      return [parts[0] || '', parts[1] || ''];
    }
    
    // 一般的な姓名分割（2-3文字姓を仮定）
    if (fullKatakana.length >= 4) {
      // 3文字姓のパターンをチェック
      const threeCharSurnames = ['サトウ', 'タナカ', 'ワタナベ', 'ヤマモト', 'ナカムラ'];
      const firstThree = fullKatakana.substr(0, 3);
      if (threeCharSurnames.includes(firstThree)) {
        return [firstThree, fullKatakana.substr(3)];
      }
      // デフォルトは2文字姓
      return [fullKatakana.substr(0, 2), fullKatakana.substr(2)];
    } else if (fullKatakana.length === 2) {
      return [fullKatakana.substr(0, 1), fullKatakana.substr(1)];
    }
    return [fullKatakana, ''];
  },
  
  // ふりがな分割 "たなかたろう" → ["たなか", "たろう"]
  splitKana: (fullKana) => {
    if (!fullKana) return ['', ''];
    
    // スペースで分割されている場合
    if (fullKana.includes(' ') || fullKana.includes('　')) {
      const parts = fullKana.split(/[\s　]+/);
      return [parts[0] || '', parts[1] || ''];
    }
    
    // 一般的な姓名分割（2-3文字姓を仮定）
    if (fullKana.length >= 4) {
      // 3文字姓のパターンをチェック
      const threeCharSurnames = ['さとう', 'たなか', 'わたなべ', 'やまもと', 'なかむら'];
      const firstThree = fullKana.substr(0, 3);
      if (threeCharSurnames.includes(firstThree)) {
        return [firstThree, fullKana.substr(3)];
      }
      // デフォルトは2文字姓
      return [fullKana.substr(0, 2), fullKana.substr(2)];
    } else if (fullKana.length === 2) {
      return [fullKana.substr(0, 1), fullKana.substr(1)];
    }
    return [fullKana, ''];
  }
};

