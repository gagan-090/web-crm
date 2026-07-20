// Greenline driver screening — shared definition + scoring.
//
// This mirrors the mobile app's GREENLINE_MODULES (32 questions in 9 sections)
// and the server-side 0–100 sectioned score used by the Web CRM native endpoint
// (MmCallerController@mmDriverScreeningSubmit). Keeping the scoring here in sync
// with the backend means the live preview equals the stored `result`.

export type YesNo = 'Yes' | 'No';

export interface ScreeningQuestion {
  id: number;
  text: string;
  expected: YesNo;
  autoReject?: boolean;
}

export interface ScreeningModule {
  id: string;
  title: string;
  questions: ScreeningQuestion[];
}

export const GREENLINE_MODULES: ScreeningModule[] = [
  {
    id: 'A',
    title: 'अनुभाग A: मूल जानकारी एवं अनुभव (Basic Profile & Experience)',
    questions: [
      { id: 1, text: '1. कृपया अपना पूरा नाम बताइए, जैसा कि आपके ड्राइविंग लाइसेंस में लिखा है।', expected: 'Yes' },
      { id: 2, text: '2. आपको ट्रेलर वाहन चलाने का कुल कितना वर्षों का अनुभव है? (कम से कम 3 वर्ष अनिवार्य)', expected: 'Yes', autoReject: true },
      { id: 3, text: '3. आपने किस प्रकार के ट्रेलर चलाए हैं? (कंटेनर, फ्लैटबेड, मल्टी-एक्सियल, टैंकर आदि)', expected: 'Yes' },
      { id: 4, text: '4. क्या आप वर्तमान में ट्रेलर चला रहे हैं? यदि नहीं, तो आख़िरी बार कब चलाया था?', expected: 'Yes' },
      { id: 5, text: '5. आपने आख़िरी बार किस ट्रांसपोर्टर या कंपनी के साथ काम किया था? उनके मालिक या सुपरवाइज़र का नाम बता सकते हैं?', expected: 'Yes' },
      { id: 6, text: '6. जिस ट्रेलर को आप आख़िरी बार चला रहे थे, उसका अनुमानित GVW (वजन क्षमता) कितना था?', expected: 'Yes' },
    ],
  },
  {
    id: 'B',
    title: 'अनुभाग B: दस्तावेज़ एवं पहचान की समानता (Document Consistency – अनिवार्य)',
    questions: [
      { id: 7, text: '7. क्या आपके ड्राइविंग लाइसेंस, आधार कार्ड और पैन कार्ड में आपका नाम, पिता का नाम और जन्मतिथि बिल्कुल एक जैसी है?', expected: 'Yes', autoReject: true },
      { id: 8, text: '8. क्या आपके सभी दस्तावेज़ (DL, आधार, पैन) वैध और मूल (Original) हैं?', expected: 'Yes', autoReject: true },
      { id: 9, text: '9. क्या आपको कभी किसी कंपनी ने दस्तावेज़ों में गड़बड़ी या वेरिफिकेशन फेल होने के कारण रिजेक्ट किया है?', expected: 'No' },
    ],
  },
  {
    id: 'C',
    title: 'अनुभाग C: अनुशासन, नियम और पृष्ठभूमि (Compliance & Background)',
    questions: [
      { id: 10, text: '10. क्या आपको कभी किसी ट्रांसपोर्टर या कंपनी ने फाइन किया, सस्पेंड किया या ब्लैकलिस्ट किया है?', expected: 'No' },
      { id: 11, text: '11. क्या ट्रेलर चलाते समय आपका कभी कोई एक्सीडेंट हुआ है? यदि हाँ, तो कारण बताइए।', expected: 'No' },
      { id: 12, text: '12. क्या आप ग्रीनलाइन के सभी नियम और SOPs को सख्ती से फॉलो करने के लिए तैयार हैं, भले ही वे आपकी पुरानी कंपनी से अलग हों?', expected: 'Yes' },
      { id: 13, text: '13. क्या आप स्पीड लिमिट, रूट डिसिप्लिन और रेस्ट ऑवर्स जैसे नियमों का पालन करते हैं?', expected: 'Yes' },
    ],
  },
  {
    id: 'D',
    title: 'अनुभाग D: लोकेशन, रूट और ऑपरेशन की तैयारी',
    questions: [
      { id: 14, text: '14. क्या आप ग्रीनलाइन द्वारा बताए गए इंटरव्यू लोकेशन पर उसी तय तारीख़ को रिपोर्ट करने के लिए पूरी तरह तैयार हैं?', expected: 'Yes', autoReject: true },
      { id: 15, text: '15. क्या कोई मेडिकल, पारिवारिक या व्यक्तिगत समस्या है, जिससे आप तय तारीख़ पर रिपोर्ट नहीं कर पाएंगे?', expected: 'No' },
      { id: 16, text: '16. क्या आप इंटरव्यू के बाद आपको दिए गए किसी भी रूट पर गाड़ी चलाने के लिए तैयार हैं?', expected: 'Yes' },
      { id: 17, text: '17. क्या आप लंबी दूरी, नाइट ड्राइविंग और इंटरस्टेट रूट्स पर काम करने के लिए तैयार हैं?', expected: 'Yes' },
      { id: 18, text: '18. अगर अचानक रूट या वाहन बदल दिया जाए, तो आप सामान्यतः कैसे प्रतिक्रिया देते हैं?', expected: 'Yes' },
    ],
  },
  {
    id: 'E',
    title: 'अनुभाग E: मेडिकल एवं फिटनेस',
    questions: [
      { id: 19, text: '19. क्या आपको कोई मेडिकल समस्या है जैसे आंखों की कमजोरी, BP, डायबिटीज, कमर दर्द आदि, जो लंबी दूरी की ड्राइविंग को प्रभावित कर सकती है?', expected: 'No' },
      { id: 20, text: '20. क्या आपने पिछले 12 महीनों में कोई मेडिकल फिटनेस चेकअप करवाया है?', expected: 'Yes' },
    ],
  },
  {
    id: 'F',
    title: 'अनुभाग F: टेक्नोलॉजी एवं इंटरव्यू की तैयारी',
    questions: [
      { id: 21, text: '21. क्या आपके पास स्मार्टफोन है जिसमें कैमरा, इंटरनेट और वीडियो कॉलिंग की सुविधा है?', expected: 'Yes' },
      { id: 22, text: '22. क्या आप ग्रीनलाइन अधिकारियों के साथ जब भी कहा जाए, वीडियो इंटरव्यू देने के लिए तैयार हैं?', expected: 'Yes' },
      { id: 23, text: '23. क्या आप इंटरव्यू और ऑनबोर्डिंग प्रक्रिया के दौरान अपना फोन चालू और reachable रखेंगे?', expected: 'Yes' },
      { id: 24, text: '24. क्या आप मोबाइल ऐप के ज़रिए हाज़िरी, ट्रिप अपडेट या डॉक्यूमेंट अपलोड करने में सहज हैं?', expected: 'Yes' },
    ],
  },
  {
    id: 'G',
    title: 'अनुभाग G: वेरिफिकेशन एवं सहमति (Mandatory Consent)',
    questions: [
      { id: 25, text: '25. क्या आप अपने ID, कोर्ट चेक और एड्रेस वेरिफिकेशन से जुड़े OTP साझा करने के लिए सहमत हैं?', expected: 'Yes', autoReject: true },
      { id: 26, text: '26. क्या आप बैकग्राउंड वेरिफिकेशन (कोर्ट, पुलिस, एड्रेस चेक) के लिए अपनी पूरी सहमति देते हैं?', expected: 'Yes', autoReject: true },
    ],
  },
  {
    id: 'H',
    title: 'अनुभाग H: वित्तीय स्थिति एवं स्थिरता',
    questions: [
      { id: 27, text: '27. क्या आपके ऊपर किसी ट्रांसपोर्टर से लिया हुआ कोई लोन या एडवांस है, जो जॉइनिंग में रुकावट बन सकता है?', expected: 'No' },
      { id: 28, text: '28. क्या आप कंपनी के सैलरी साइकिल (मासिक / पखवाड़ा) से सहज हैं, या आपको रोज़ाना एडवांस की आवश्यकता होती है?', expected: 'Yes' },
    ],
  },
  {
    id: 'I',
    title: 'अनुभाग I: गंभीरता और अंतिम प्रतिबद्धता',
    questions: [
      { id: 29, text: '29. यदि ग्रीनलाइन द्वारा चयन हो जाता है, तो आप कितने दिनों में जॉइन कर सकते हैं?', expected: 'Yes' },
      { id: 30, text: '30. आप ग्रीनलाइन के साथ काम क्यों करना चाहते हैं, अपनी पिछली या मौजूदा कंपनी के बजाय?', expected: 'Yes' },
      { id: 31, text: '31. क्या आपने कभी बिना बताए बीच में नौकरी छोड़ी है? यदि हाँ, तो कारण क्या था?', expected: 'No' },
      { id: 32, text: '32. यदि चयन हो जाता है, तो क्या आप पक्का कमिट करते हैं कि इंटरव्यू या सिलेक्शन के बाद ड्रॉप नहीं करेंगे?', expected: 'Yes' },
    ],
  },
];

// Flat id → question text (for the read-only results view).
export const SCREENING_QUESTIONS: { id: number; text: string }[] =
  GREENLINE_MODULES.flatMap(m => m.questions.map(q => ({ id: q.id, text: q.text })));

export const TOTAL_QUESTIONS = SCREENING_QUESTIONS.length; // 32

export type Decision = 'GREEN' | 'AMBER' | 'RED';
export type ScreeningStatus = 'shortlisted' | 'pending' | 'rejected';

export interface ScreeningResult {
  score: number;
  decision: Decision;
  status: ScreeningStatus;
}

// Sectioned 0–100 score — IDENTICAL to the backend formula so the live preview
// matches the stored `result`. Plus the auto-reject + GREEN/AMBER/RED decision.
export function computeScreening(answers: Record<number, YesNo>): ScreeningResult {
  const yes = (id: number) => answers[id] === 'Yes';
  const no = (id: number) => answers[id] === 'No';

  let score = 0;

  // 1) Experience & Skills – 25
  if (yes(2)) score += 15;
  if (yes(3) && yes(6)) score += 10;
  else if (yes(3)) score += 5;

  // 2) Document Accuracy – 20
  if (yes(7)) score += 15;
  if (yes(8)) score += 5;

  // 3) Compliance & Background – 15
  if (no(10)) score += 5;
  if (no(11)) score += 5;
  if (yes(12) || yes(13)) score += 5;

  // 4) Location & Availability – 15
  if (yes(14)) score += 8;
  if (yes(15)) score += 3;
  if (yes(16) || yes(17)) score += 4;

  // 5) Technology & Readiness – 10
  if (yes(21)) score += 3;
  if (yes(22)) score += 3;
  if (yes(23) || yes(24)) score += 4;

  // 6) Verification & Consent – 10
  if (yes(25) || yes(26)) score += 10;

  // 7) Intent & Stability – 5
  if (no(31) && yes(32)) score += 5;

  // Auto-reject (critical Yes questions) + major-issue cap (accident/blacklist).
  const autoReject = [2, 7, 8, 14, 25, 26].some(id => answers[id] !== 'Yes');
  const majorIssue = yes(10) || yes(11);

  let decision: Decision;
  if (autoReject || score < 65) decision = 'RED';
  else if (score < 80 || majorIssue) decision = 'AMBER';
  else decision = 'GREEN';

  const status: ScreeningStatus =
    decision === 'GREEN' ? 'shortlisted' : decision === 'AMBER' ? 'pending' : 'rejected';

  return { score, decision, status };
}

export const decisionMeta: Record<Decision, { label: string; text: string; bg: string; border: string }> = {
  GREEN: { label: 'Recommended (Pass)', text: '#16A34A', bg: '#DCFCE7', border: '#BBF7D0' },
  AMBER: { label: 'Needs Review (Hold)', text: '#D97706', bg: '#FEF3C7', border: '#FCD34D' },
  RED:   { label: 'Rejected (Fail)',     text: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
};
