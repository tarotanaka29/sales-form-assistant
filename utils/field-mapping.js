// フィールド判別用マッピングテーブル
const FIELD_MAPPING = {
  // ビジネス情報（優先度を上げるため先頭に配置）
  companyName: ['会社名', 'company', '企業名', '法人名', 'corporation', 'kaisha', '組織名', '企業', '貴社名', '御社名'],
  companyKana: ['会社名(フリガナ)', '会社名（フリガナ）', '会社フリガナ', 'company_kana', '会社カナ', '企業名フリガナ'],
  department: ['部署', 'dept', 'department', '部門', '所属', 'busho'],
  position: ['役職', 'title', 'position', '肩書き', '職位', 'yakushoku'],
  url: ['URL', 'website', 'homepage', 'ホームページ', 'サイト', 'HP'],
  
  // 担当者情報
  lastName: ['姓', 'sei', '苗字', 'family-name', 'lastname', '名字', 'myoji', '担当者姓'],
  firstName: ['名', 'mei', 'given-name', 'firstname', '下の名前', '担当者名'],
  fullName: ['お名前', '氏名', 'fullname', 'shimei', '担当者氏名'],
  
  // ふりがな
  kanaLastName: ['ふりがな１', 'ふりがな1', 'ふりがな(姓)', 'ふりがな（姓）', 'kana_sei', 'furigana1', 'かな姓'],
  kanaFirstName: ['ふりがな２', 'ふりがな2', 'ふりがな(名)', 'ふりがな（名）', 'kana_mei', 'furigana2', 'かな名'],
  kanaFullName: ['ふりがな', 'ふりがな(フル)', 'ふりがな（フル）', 'kana', 'furigana', 'かな', 'ひらがな'],
  katakanaFullName: ['フリガナ', 'カタカナ', 'katakana', 'フリガナ氏名', 'KATAKANA'],
  katakanaLastName: ['フリガナ１', 'フリガナ1', 'フリガナ(姓)', 'フリガナ（姓）', 'katakana_sei', 'カタカナ姓'],
  katakanaFirstName: ['フリガナ２', 'フリガナ2', 'フリガナ(名)', 'フリガナ（名）', 'katakana_mei', 'カタカナ名'],
  
  // 住所
  zipcode: ['郵便番号', 'zip', 'postcode', '〒', 'zipcode', 'postal'],
  zipcode1: ['郵便番号1', 'zip1', '郵便番号(前)', '郵便番号（前）', 'postcode1', 'zip_1'],
  zipcode2: ['郵便番号2', 'zip2', '郵便番号(後)', '郵便番号（後）', 'postcode2', 'zip_2'],
  fullAddress: ['住所', 'address', 'ご住所', '所在地', 'jusho'],
  prefecture: ['都道府県', 'pref', '県', 'state', 'todofuken'],
  city: ['市区町村', 'city', '市', '区', '町', '村', 'shikuchoson'],
  street: ['番地', 'street', '丁目', '番', '号', 'banchi'],
  building: ['建物名', 'building', 'マンション', 'ビル', 'tatemono'],
  
  // 連絡先
  phone: ['電話番号', 'phone', 'tel', '電話', 'telephone', 'denwa'],
  phone1: ['電話番号1', 'tel1', '市外局番', 'phone1', 'tel_1'],
  phone2: ['電話番号2', 'tel2', '市内局番', 'phone2', 'tel_2'],
  phone3: ['電話番号3', 'tel3', '番号', 'phone3', 'tel_3'],
  fax: ['FAX番号', 'fax', 'ファックス', 'ファクス'],
  
  email: ['メールアドレス', 'email', 'mail', 'e-mail', 'メール'],
  emailConfirm: ['メールアドレス(確認)', 'メールアドレス（確認）', 'email_confirm', 'mail_confirm', 'メール確認', 'email確認'],
  
  // 問い合わせ
  subject: ['件名', 'subject', 'タイトル', '題名', 'kenmei'],
  message800: ['問い合わせ内容', 'message', 'content', 'お問い合わせ', 'メッセージ', '内容', '詳細', 'toiawase', '問合せ', '問合わせ'],
  message300: ['問い合わせ内容(300文字)', 'message300', '短文', '概要', '簡潔', '要約']
};

