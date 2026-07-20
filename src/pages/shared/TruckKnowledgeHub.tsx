import React, { useState } from 'react';
import openTruckImg from '../../assets/trucks/open.webp';
import boxTruckImg from '../../assets/trucks/box.webp';
import containerTruckImg from '../../assets/trucks/container.webp';
import tipperTruckImg from '../../assets/trucks/tipper.webp';
import tankerTruckImg from '../../assets/trucks/tanker.webp';
import flatbedTruckImg from '../../assets/trucks/flatbed.webp';
import reeferTruckImg from '../../assets/trucks/reefer.webp';
import carrierTruckImg from '../../assets/trucks/carrier.webp';
import trailerTruckImg from '../../assets/trucks/trailer.webp';

/**
 * TruckKnowledgeHub — "Complete Truck Knowledge / संपूर्ण ट्रक ज्ञान" training
 * guide for the Telecalling & Driver Onboarding team. Bilingual (English +
 * Hindi), addressed directly to you (the caller). Royal-blue themed by default;
 * `accent` can override. Contains every section of the source training deck.
 */

interface Props { accent?: string }
interface Bi { en: string; hi: string }

const SECTIONS: Array<{ id: string; label: Bi; icon: string }> = [
  { id: 'intro', label: { en: 'Overview', hi: 'अवलोकन' }, icon: 'menu_book' },
  { id: 'why', label: { en: 'Why It Matters', hi: 'क्यों ज़रूरी' }, icon: 'lightbulb' },
  { id: 'classification', label: { en: 'Classification', hi: 'वर्गीकरण' }, icon: 'category' },
  { id: 'oems', label: { en: 'OEMs / Makers', hi: 'निर्माता' }, icon: 'factory' },
  { id: 'body', label: { en: 'Body Types', hi: 'बॉडी टाइप' }, icon: 'view_in_ar' },
  { id: 'wheels', label: { en: 'Wheel / Tyre', hi: 'टायर' }, icon: 'tire_repair' },
  { id: 'types', label: { en: 'Truck Types', hi: 'ट्रक प्रकार' }, icon: 'local_shipping' },
  { id: 'models', label: { en: 'Models', hi: 'मॉडल' }, icon: 'tag' },
  { id: 'axles', label: { en: 'Axles', hi: 'एक्सल' }, icon: 'settings' },
  { id: 'dimensions', label: { en: 'Dimensions', hi: 'आयाम' }, icon: 'straighten' },
  { id: 'docs', label: { en: 'Documents', hi: 'दस्तावेज़' }, icon: 'description' },
  { id: 'matching', label: { en: 'Job Matching', hi: 'जॉब मैच' }, icon: 'swap_horiz' },
  { id: 'glossary', label: { en: 'Glossary', hi: 'शब्दावली' }, icon: 'abc' },
];

const WHY: Array<{ icon: string; title: Bi; desc: Bi }> = [
  { icon: 'record_voice_over', title: { en: 'Speak Confidently', hi: 'आत्मविश्वास से बात करें' }, desc: { en: 'Communicate professionally with drivers and fleet owners using correct industry language.', hi: 'सही इंडस्ट्री भाषा का उपयोग करके ड्राइवर और फ्लीट ओनर से पेशेवर तरीके से बात करें।' } },
  { icon: 'fact_check', title: { en: 'Understand Requirements', hi: 'ज़रूरतें समझें' }, desc: { en: 'Accurately assess driver needs during the onboarding process.', hi: 'ऑनबोर्डिंग के दौरान ड्राइवर की ज़रूरतों का सही आकलन करें।' } },
  { icon: 'recommend', title: { en: 'Recommend Relevantly', hi: 'सही सुझाव दें' }, desc: { en: 'Suggest appropriate jobs, training programs and trips based on truck type.', hi: 'ट्रक के प्रकार के आधार पर उपयुक्त जॉब, ट्रेनिंग और ट्रिप सुझाएं।' } },
  { icon: 'join_inner', title: { en: 'Improve Matching', hi: 'मैचिंग बेहतर करें' }, desc: { en: 'Increase accuracy in job–driver matchmaking.', hi: 'जॉब–ड्राइवर मैचमेकिंग में सटीकता बढ़ाएं।' } },
  { icon: 'verified_user', title: { en: 'Build Trust', hi: 'भरोसा बनाएं' }, desc: { en: 'Establish credibility using correct terminology like axle, body type and capacity.', hi: 'axle, बॉडी टाइप और क्षमता जैसी सही शब्दावली से विश्वसनीयता बनाएं।' } },
];

const GVW: Array<{ code: string; range: Bi; color: string }> = [
  { code: 'LCV', range: { en: 'up to 7.5 tons', hi: '7.5 टन तक' }, color: '#3498DB' },
  { code: 'ICV', range: { en: '7.5 – 16 tons', hi: '7.5 – 16 टन' }, color: '#2563EB' },
  { code: 'MCV', range: { en: '16 – 25 tons', hi: '16 – 25 टन' }, color: '#F39C12' },
  { code: 'HCV', range: { en: '25 – 49 tons', hi: '25 – 49 टन' }, color: '#E67E22' },
  { code: 'MHCV / Multi-Axle', range: { en: '49+ tons', hi: '49+ टन' }, color: '#E74C3C' },
];

const FUNCTION_ITEMS: Bi[] = [
  { en: 'Cargo Trucks (Open / Closed)', hi: 'कार्गो ट्रक (खुला / बंद)' },
  { en: 'Tipper Trucks', hi: 'टिपर ट्रक' },
  { en: 'Trailer / Semi-Trailer', hi: 'ट्रेलर / सेमी-ट्रेलर' },
  { en: 'Tankers', hi: 'टैंकर' },
  { en: 'Car Carriers', hi: 'कार कैरियर' },
  { en: 'Container Trucks', hi: 'कंटेनर ट्रक' },
  { en: 'Refrigerator (Reefer) Trucks', hi: 'रेफ्रिजरेटर (रीफर) ट्रक' },
];

const MAJOR_OEMS: Array<{ name: string; desc: Bi }> = [
  { name: 'Tata Motors', desc: { en: 'Largest commercial vehicle maker in India', hi: 'भारत का सबसे बड़ा कमर्शियल वाहन निर्माता' } },
  { name: 'Ashok Leyland', desc: { en: 'Second largest CV manufacturer', hi: 'दूसरा सबसे बड़ा CV निर्माता' } },
  { name: 'Mahindra Trucks & Buses', desc: { en: 'Growing presence in the LCV segment', hi: 'LCV सेगमेंट में बढ़ती उपस्थिति' } },
  { name: 'Eicher', desc: { en: 'Popular for medium trucks', hi: 'मीडियम ट्रकों के लिए लोकप्रिय' } },
  { name: 'BharatBenz', desc: { en: "Daimler's Indian brand", hi: 'डेमलर का भारतीय ब्रांड' } },
];
const TRAILER_MAKERS = ['Tata DLT', 'Hyva', 'Caparo', 'Bulbul', 'Hercules', 'Tratec'];

const BODY_TYPES: Array<{ emoji: string; title: Bi; desc: Bi }> = [
  { emoji: '📦', title: { en: 'Open Body', hi: 'खुली बॉडी' }, desc: { en: 'General goods, machinery, steel. Variants: short, long, high-side body.', hi: 'सामान्य माल, मशीनरी, स्टील। वेरिएंट: शॉर्ट, लॉन्ग, हाई-साइड बॉडी।' } },
  { emoji: '🚚', title: { en: 'Closed / Box Truck', hi: 'बंद / बॉक्स ट्रक' }, desc: { en: 'FMCG, electronics, fragile goods, e-commerce loads.', hi: 'FMCG, इलेक्ट्रॉनिक्स, नाज़ुक सामान, ई-कॉमर्स लोड।' } },
  { emoji: '🚛', title: { en: 'Container Body', hi: 'कंटेनर बॉडी' }, desc: { en: '20 / 24 / 32 ft containers for long routes.', hi: '20 / 24 / 32 फीट कंटेनर, लंबे रूट के लिए।' } },
  { emoji: '🏗️', title: { en: 'Tipper Body', hi: 'टिपर बॉडी' }, desc: { en: 'Hydraulic lifting body — sand, gravel, construction, mining.', hi: 'हाइड्रोलिक लिफ्टिंग बॉडी — रेत, बजरी, निर्माण, खनन।' } },
  { emoji: '🛢️', title: { en: 'Tanker Body', hi: 'टैंकर बॉडी' }, desc: { en: 'Fuel, water, milk, chemicals.', hi: 'ईंधन, पानी, दूध, केमिकल।' } },
  { emoji: '🏭', title: { en: 'Flatbed Trailer', hi: 'फ्लैटबेड ट्रेलर' }, desc: { en: 'Steel coils, industrial goods, machinery.', hi: 'स्टील कॉइल, औद्योगिक सामान, मशीनरी।' } },
  { emoji: '❄️', title: { en: 'Refrigerated Body', hi: 'रेफ्रिजरेटेड बॉडी' }, desc: { en: 'Cold chain: food, pharma, dairy.', hi: 'कोल्ड चेन: खाद्य, फार्मा, डेयरी।' } },
  { emoji: '🚗', title: { en: 'Car Carrier Body', hi: 'कार कैरियर बॉडी' }, desc: { en: 'Vehicle logistics.', hi: 'वाहन लॉजिस्टिक्स।' } },
];

const RIGID_WHEELS: Array<{ title: Bi; desc: Bi }> = [
  { title: { en: '4 Tyre Truck', hi: '4 टायर ट्रक' }, desc: { en: '1 axle front, 1 axle rear. 2–5 tons. Popular for last-mile deliveries.', hi: '1 एक्सल आगे, 1 एक्सल पीछे। 2–5 टन। लास्ट-माइल डिलीवरी के लिए लोकप्रिय।' } },
  { title: { en: '6 Tyre Truck', hi: '6 टायर ट्रक' }, desc: { en: 'Small & medium trucks. 7–12 tons.', hi: 'छोटे और मीडियम ट्रक। 7–12 टन।' } },
  { title: { en: '10 Tyre Truck', hi: '10 टायर ट्रक' }, desc: { en: '180 / 1912 / 2523 models. 16–19 tons. Most common goods vehicle.', hi: '180 / 1912 / 2523 मॉडल। 16–19 टन। सबसे आम माल वाहन।' } },
  { title: { en: '12 Tyre Truck', hi: '12 टायर ट्रक' }, desc: { en: '25–31 tons. Heavy cargo.', hi: '25–31 टन। भारी कार्गो।' } },
  { title: { en: '14 / 16 Tyre Trucks', hi: '14 / 16 टायर ट्रक' }, desc: { en: '35–40 tons. Industrial cargo, steel, long haul.', hi: '35–40 टन। औद्योगिक कार्गो, स्टील, लंबी दूरी।' } },
];
const TRAILER_WHEELS: Array<{ title: string; desc: Bi }> = [
  { title: '18 Tyre', desc: { en: 'Payload 35+ tons', hi: 'पेलोड 35+ टन' } },
  { title: '22 Tyre', desc: { en: 'Payload 40+ tons', hi: 'पेलोड 40+ टन' } },
  { title: '24 Tyre', desc: { en: 'Payload 45+ tons', hi: 'पेलोड 45+ टन' } },
  { title: '28 Tyre & Above', desc: { en: 'Payload 60+ tons', hi: 'पेलोड 60+ टन' } },
];

interface TruckType { emoji: string; title: Bi; rows: Array<{ k: Bi; v: Bi }>; usedFor: Bi[]; note: Bi }
const TRUCK_TYPES: TruckType[] = [
  {
    emoji: '🚚', title: { en: 'Cargo Trucks (Open / Closed Body)', hi: 'कार्गो ट्रक (खुली / बंद बॉडी)' },
    rows: [
      { k: { en: 'Description', hi: 'विवरण' }, v: { en: 'Rigid trucks with fixed cabin and cargo body', hi: 'फिक्स्ड केबिन और कार्गो बॉडी वाले रिजिड ट्रक' } },
      { k: { en: 'Popular Models', hi: 'लोकप्रिय मॉडल' }, v: { en: 'Tata 407 / 709 / 1109 / 1512 / 1613 / 2518 · Leyland Ecomet / Boss · Eicher Pro', hi: 'टाटा 407 / 709 / 1109 / 1512 / 1613 / 2518 · लेलैंड इकोमेट / बॉस · आयशर प्रो' } },
      { k: { en: 'Payload', hi: 'पेलोड' }, v: { en: '3 ton to 20 ton', hi: '3 टन से 20 टन' } },
      { k: { en: 'Tyre Formats', hi: 'टायर फॉर्मेट' }, v: { en: '4 tyre, 6 tyre, 10 tyre', hi: '4 टायर, 6 टायर, 10 टायर' } },
    ],
    usedFor: [{ en: 'FMCG', hi: 'FMCG' }, { en: 'General goods', hi: 'सामान्य माल' }, { en: 'Retail, textile, electronics', hi: 'रिटेल, टेक्सटाइल, इलेक्ट्रॉनिक्स' }, { en: 'Industrial raw material', hi: 'औद्योगिक कच्चा माल' }],
    note: { en: 'Ask the driver: "Open body ya container? Kitna feet ka?"', hi: 'ड्राइवर से पूछें: "Open body ya container? Kitna feet ka?"' },
  },
  {
    emoji: '🚛', title: { en: 'Container Trucks', hi: 'कंटेनर ट्रक' },
    rows: [
      { k: { en: 'Description', hi: 'विवरण' }, v: { en: 'Enclosed fixed-length containers: 20 / 24 / 28 / 32 ft', hi: 'बंद फिक्स्ड-लंबाई कंटेनर: 20 / 24 / 28 / 32 फीट' } },
      { k: { en: 'Payload', hi: 'पेलोड' }, v: { en: '8 ton – 18 ton', hi: '8 टन – 18 टन' } },
      { k: { en: 'Wheels', hi: 'पहिये' }, v: { en: 'Mostly 6 & 10 tyre', hi: 'ज़्यादातर 6 और 10 टायर' } },
    ],
    usedFor: [{ en: 'E-commerce', hi: 'ई-कॉमर्स' }, { en: 'Courier', hi: 'कूरियर' }, { en: 'Perishable goods', hi: 'जल्दी खराब होने वाला माल' }, { en: 'Long-distance secure transport', hi: 'लंबी दूरी का सुरक्षित परिवहन' }],
    note: { en: 'If container: ask "20 ft / 24 ft / 32 ft? Height? High cube?"', hi: 'कंटेनर हो तो पूछें: "20 ft / 24 ft / 32 ft? Height? High cube?"' },
  },
  {
    emoji: '🏗️', title: { en: 'Tipper Trucks', hi: 'टिपर ट्रक' },
    rows: [
      { k: { en: 'Description', hi: 'विवरण' }, v: { en: 'Hydraulic lifting dump body', hi: 'हाइड्रोलिक लिफ्टिंग डंप बॉडी' } },
      { k: { en: 'OEMs', hi: 'OEM' }, v: { en: 'Tata Signa, Leyland AVTR, BharatBenz 2823 / 3523', hi: 'टाटा सिग्ना, लेलैंड AVTR, भारतबेंज़ 2823 / 3523' } },
      { k: { en: 'Capacity', hi: 'क्षमता' }, v: { en: '10 – 35 tons', hi: '10 – 35 टन' } },
      { k: { en: 'Tyre Configs', hi: 'टायर कॉन्फ़िग' }, v: { en: '10 tyre, 12 tyre, 14 tyre', hi: '10 टायर, 12 टायर, 14 टायर' } },
    ],
    usedFor: [{ en: 'Mining', hi: 'खनन' }, { en: 'Sand transport', hi: 'रेत परिवहन' }, { en: 'Construction', hi: 'निर्माण' }, { en: 'Infrastructure projects', hi: 'इंफ्रास्ट्रक्चर परियोजनाएं' }],
    note: { en: 'Always ask "Box body ya rock body?" — Rock = mining, Box = sand/stone.', hi: 'हमेशा पूछें "Box body ya rock body?" — Rock = खनन, Box = रेत/पत्थर।' },
  },
  {
    emoji: '🚧', title: { en: 'Trailer / Semi-Trailer Trucks', hi: 'ट्रेलर / सेमी-ट्रेलर ट्रक' },
    rows: [
      { k: { en: 'Description', hi: 'विवरण' }, v: { en: 'Tractor head + detachable trailer', hi: 'ट्रैक्टर हेड + अलग होने वाला ट्रेलर' } },
      { k: { en: 'OEM Tractors', hi: 'OEM ट्रैक्टर' }, v: { en: 'Tata Prima · Ashok Leyland Captain · BharatBenz 4023 / 4928', hi: 'टाटा प्रीमा · अशोक लेलैंड कैप्टन · भारतबेंज़ 4023 / 4928' } },
      { k: { en: 'Trailer Types', hi: 'ट्रेलर प्रकार' }, v: { en: 'Flatbed, Semi-low bed, Low bed, Container trailer, Bulker', hi: 'फ्लैटबेड, सेमी-लो बेड, लो बेड, कंटेनर ट्रेलर, बल्कर' } },
      { k: { en: 'Payload', hi: 'पेलोड' }, v: { en: '25 to 60 tons (depends on axles)', hi: '25 से 60 टन (एक्सल पर निर्भर)' } },
      { k: { en: 'Tyre Configs', hi: 'टायर कॉन्फ़िग' }, v: { en: '18, 22, 24, 28 tyres', hi: '18, 22, 24, 28 टायर' } },
    ],
    usedFor: [{ en: 'Steel', hi: 'स्टील' }, { en: 'Machinery', hi: 'मशीनरी' }, { en: 'Cement', hi: 'सीमेंट' }, { en: 'Heavy industrial loads', hi: 'भारी औद्योगिक लोड' }, { en: 'Container logistics', hi: 'कंटेनर लॉजिस्टिक्स' }],
    note: { en: 'Ask: "Prime mover kaun sa? Trailer ka type? Axle kitna?"', hi: 'पूछें: "Prime mover kaun sa? Trailer ka type? Axle kitna?"' },
  },
  {
    emoji: '🛢️', title: { en: 'Tanker Trucks', hi: 'टैंकर ट्रक' },
    rows: [
      { k: { en: 'Types', hi: 'प्रकार' }, v: { en: 'Fuel, Water, Chemical, LPG (special category)', hi: 'ईंधन, पानी, केमिकल, LPG (विशेष श्रेणी)' } },
      { k: { en: 'Capacity', hi: 'क्षमता' }, v: { en: '6,000 L – 24,000 L', hi: '6,000 लीटर – 24,000 लीटर' } },
      { k: { en: 'Tyres', hi: 'टायर' }, v: { en: '6, 10, 12 tyre', hi: '6, 10, 12 टायर' } },
    ],
    usedFor: [{ en: 'Petrol pumps', hi: 'पेट्रोल पंप' }, { en: 'Industries', hi: 'उद्योग' }, { en: 'Municipality water supply', hi: 'नगरपालिका जल आपूर्ति' }],
    note: { en: 'If chemical → ask "MS ya SS tanker?" (material grade).', hi: 'केमिकल हो तो पूछें "MS ya SS tanker?" (मटेरियल ग्रेड)।' },
  },
  {
    emoji: '❄️', title: { en: 'Refrigerated (Reefer) Trucks', hi: 'रेफ्रिजरेटेड (रीफर) ट्रक' },
    rows: [
      { k: { en: 'Description', hi: 'विवरण' }, v: { en: 'Insulated, temperature-controlled cargo body', hi: 'इंसुलेटेड, तापमान-नियंत्रित कार्गो बॉडी' } },
      { k: { en: 'Capacity', hi: 'क्षमता' }, v: { en: '2 ton – 18 ton', hi: '2 टन – 18 टन' } },
      { k: { en: 'Lengths', hi: 'लंबाई' }, v: { en: '14 ft, 20 ft, 24 ft', hi: '14 फीट, 20 फीट, 24 फीट' } },
    ],
    usedFor: [{ en: 'Dairy', hi: 'डेयरी' }, { en: 'Meat & seafood', hi: 'मीट और सी-फूड' }, { en: 'Pharma', hi: 'फार्मा' }, { en: 'Ice cream', hi: 'आइसक्रीम' }],
    note: { en: 'If reefer → ask "Thermo King ya Carrier? Temperature range?"', hi: 'रीफर हो तो पूछें "Thermo King ya Carrier? Temperature range?"' },
  },
  {
    emoji: '🚗', title: { en: 'Car Carrier Trucks', hi: 'कार कैरियर ट्रक' },
    rows: [
      { k: { en: 'Description', hi: 'विवरण' }, v: { en: 'Long trailer with multi-level racks', hi: 'मल्टी-लेवल रैक वाला लंबा ट्रेलर' } },
      { k: { en: 'Length', hi: 'लंबाई' }, v: { en: '40 ft – 70 ft', hi: '40 फीट – 70 फीट' } },
      { k: { en: 'Capacity', hi: 'क्षमता' }, v: { en: '6 to 12 cars', hi: '6 से 12 कारें' } },
    ],
    usedFor: [{ en: 'Manufacturers', hi: 'निर्माता' }, { en: 'Dealerships', hi: 'डीलरशिप' }, { en: 'Interstate vehicle movement', hi: 'अंतरराज्यीय वाहन परिवहन' }],
    note: { en: 'Confirm number of levels and total car capacity before matching a load.', hi: 'लोड match करने से पहले लेवल की संख्या और कुल कार क्षमता की पुष्टि करें।' },
  },
];

const MODELS: Array<{ code: string; desc: Bi }> = [
  { code: '1613', desc: { en: 'Tata 16-ton truck, 130 HP engine', hi: 'टाटा 16-टन ट्रक, 130 HP इंजन' } },
  { code: '2518', desc: { en: 'Tata 25-ton truck, 180 HP engine', hi: 'टाटा 25-टन ट्रक, 180 HP इंजन' } },
  { code: '3718', desc: { en: 'Tata 37-ton truck, 180 HP engine', hi: 'टाटा 37-टन ट्रक, 180 HP इंजन' } },
  { code: '4923', desc: { en: 'BharatBenz 49-ton truck, 230 HP engine', hi: 'भारतबेंज़ 49-टन ट्रक, 230 HP इंजन' } },
  { code: '3520', desc: { en: 'Leyland 35-ton truck, 200 HP engine', hi: 'लेलैंड 35-टन ट्रक, 200 HP इंजन' } },
  { code: '1109', desc: { en: 'Tata 11-ton truck, 90 HP engine', hi: 'टाटा 11-टन ट्रक, 90 HP इंजन' } },
];

const AXLES: Array<{ n: number; title: Bi; desc: Bi }> = [
  { n: 1, title: { en: 'Single Axle = 4 tyre', hi: 'सिंगल एक्सल = 4 टायर' }, desc: { en: 'Lightest configuration for small deliveries', hi: 'छोटी डिलीवरी के लिए सबसे हल्का' } },
  { n: 2, title: { en: 'Double Axle = 6 tyre', hi: 'डबल एक्सल = 6 टायर' }, desc: { en: 'Medium capacity trucks', hi: 'मीडियम क्षमता ट्रक' } },
  { n: 3, title: { en: 'Tri-Axle = 10 tyre', hi: 'ट्राई-एक्सल = 10 टायर' }, desc: { en: 'Most common goods vehicle configuration', hi: 'सबसे आम माल वाहन कॉन्फ़िगरेशन' } },
  { n: 4, title: { en: 'Quad Axle = 12 tyre', hi: 'क्वाड एक्सल = 12 टायर' }, desc: { en: 'Heavy cargo transport', hi: 'भारी कार्गो परिवहन' } },
  { n: 5, title: { en: 'Penta Axle = 14 tyre', hi: 'पेंटा एक्सल = 14 टायर' }, desc: { en: 'Industrial and steel transport', hi: 'औद्योगिक और स्टील परिवहन' } },
  { n: 6, title: { en: 'Hepta Axle = 16 tyre', hi: 'हेप्टा एक्सल = 16 टायर' }, desc: { en: 'Maximum load capacity', hi: 'अधिकतम लोड क्षमता' } },
];

const DOCS: Array<{ icon: string; name: Bi; desc: Bi }> = [
  { icon: 'badge', name: { en: 'RC (Registration Certificate)', hi: 'RC (रजिस्ट्रेशन सर्टिफिकेट)' }, desc: { en: 'Proof of vehicle ownership and registration', hi: 'वाहन स्वामित्व और पंजीकरण का प्रमाण' } },
  { icon: 'health_and_safety', name: { en: 'Fitness Certificate', hi: 'फिटनेस सर्टिफिकेट' }, desc: { en: 'Vehicle roadworthiness certification', hi: 'वाहन की सड़क-योग्यता प्रमाणन' } },
  { icon: 'map', name: { en: 'National Permit (NP)', hi: 'नेशनल परमिट (NP)' }, desc: { en: 'Authorization for interstate operations', hi: 'अंतरराज्यीय संचालन के लिए अनुमति' } },
  { icon: 'eco', name: { en: 'PUC', hi: 'PUC' }, desc: { en: 'Pollution Under Control certificate', hi: 'प्रदूषण नियंत्रण प्रमाणपत्र' } },
  { icon: 'shield', name: { en: 'Insurance', hi: 'बीमा' }, desc: { en: 'Vehicle insurance coverage', hi: 'वाहन बीमा कवरेज' } },
  { icon: 'toll', name: { en: 'Fastag', hi: 'फास्टैग' }, desc: { en: 'Electronic toll collection system', hi: 'इलेक्ट्रॉनिक टोल कलेक्शन सिस्टम' } },
  { icon: 'contact_page', name: { en: 'Driver DL Type', hi: 'ड्राइवर DL टाइप' }, desc: { en: 'Transport DL required for commercial vehicles', hi: 'कमर्शियल वाहनों के लिए ट्रांसपोर्ट DL आवश्यक' } },
];

const MATCHING: Array<{ truck: Bi; job: Bi }> = [
  { truck: { en: 'Tipper', hi: 'टिपर' }, job: { en: 'Send mining / construction jobs', hi: 'खनन / निर्माण जॉब भेजें' } },
  { truck: { en: '32 ft Container', hi: '32 फीट कंटेनर' }, job: { en: 'Long-haul parcel loads', hi: 'लंबी दूरी के पार्सल लोड' } },
  { truck: { en: '10 Tyre Open Truck', hi: '10 टायर खुला ट्रक' }, job: { en: 'General goods', hi: 'सामान्य माल' } },
  { truck: { en: '18 / 22 Tyre Trailer', hi: '18 / 22 टायर ट्रेलर' }, job: { en: 'Heavy industrial loads', hi: 'भारी औद्योगिक लोड' } },
  { truck: { en: 'Reefer Truck', hi: 'रीफर ट्रक' }, job: { en: 'Cold-chain loads', hi: 'कोल्ड-चेन लोड' } },
  { truck: { en: 'Tanker', hi: 'टैंकर' }, job: { en: 'Fuel / water / chemical jobs', hi: 'ईंधन / पानी / केमिकल जॉब' } },
];

const GLOSSARY: Array<{ term: string; def: Bi }> = [
  { term: 'GVW', def: { en: 'Gross Vehicle Weight', hi: 'सकल वाहन भार' } },
  { term: 'LCV / ICV / MCV / HCV', def: { en: 'Weight classification categories', hi: 'भार वर्गीकरण श्रेणियाँ' } },
  { term: 'ODC', def: { en: 'Over Dimension Cargo', hi: 'ओवर डायमेंशन कार्गो' } },
  { term: 'Prime Mover', def: { en: 'Tractor unit of a trailer', hi: 'ट्रेलर का ट्रैक्टर यूनिट' } },
  { term: 'Bulker', def: { en: 'Loose dry cargo (cement / fly ash)', hi: 'खुला सूखा कार्गो (सीमेंट / फ्लाई ऐश)' } },
  { term: 'High Cube', def: { en: 'Higher roof container', hi: 'ऊंची छत वाला कंटेनर' } },
];

const SUMMARY: Bi[] = [
  { en: 'All major truck types', hi: 'सभी प्रमुख ट्रक प्रकार' },
  { en: 'Load capacities', hi: 'लोड क्षमताएं' },
  { en: 'Body types', hi: 'बॉडी टाइप' },
  { en: 'Axle / wheel configurations', hi: 'एक्सल / व्हील कॉन्फ़िग' },
  { en: 'Popular models & OEMs', hi: 'लोकप्रिय मॉडल और OEM' },
  { en: 'What to ask a driver', hi: 'ड्राइवर से क्या पूछें' },
  { en: 'Which loads suit which truck', hi: 'कौन सा लोड किस ट्रक के लिए' },
];

const TRUCK_IMAGES: Record<string, string> = {
  open: openTruckImg,
  box: boxTruckImg,
  container: containerTruckImg,
  tipper: tipperTruckImg,
  tanker: tankerTruckImg,
  flatbed: flatbedTruckImg,
  reefer: reeferTruckImg,
  carrier: carrierTruckImg,
  trailer: trailerTruckImg,
};

const EMOJI_ART: Record<string, string> = {
  '📦': 'open',
  '🚚': 'box',
  '🚛': 'container',
  '🏗️': 'tipper',
  '🛢️': 'tanker',
  '🏭': 'flatbed',
  '❄️': 'reefer',
  '🚗': 'carrier',
  '🚧': 'trailer'
};

const TruckArt: React.FC<{ emoji?: string; name?: string; label?: string; className?: string; style?: React.CSSProperties; onZoom?: (src: string, label: string) => void }> = ({ emoji, name, label, className, style, onZoom }) => {
  const key = name || (emoji ? EMOJI_ART[emoji] : '') || 'container';
  const src = TRUCK_IMAGES[key] || TRUCK_IMAGES.container;
  return (
    <img
      src={src}
      alt={label || key}
      loading="lazy"
      onClick={onZoom ? () => onZoom(src, label || key) : undefined}
      className={`${className} object-cover rounded-lg ${onZoom ? 'cursor-zoom-in hover:opacity-95 transition-opacity' : ''}`}
      style={style}
    />
  );
};

export const TruckKnowledgeHub: React.FC<Props> = ({ accent = '#2563EB' }) => {
  const [active, setActive] = useState('intro');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [zoom, setZoom] = useState<{ src: string; label: string } | null>(null);
  const openZoom = (src: string, label: string) => setZoom({ src, label });
  const L = (t: Bi) => (lang === 'hi' ? t.hi : t.en);
  const go = (id: string) => {
    setActive(id);
    document.getElementById(`kh-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const Section: React.FC<{ id: string; icon: string; title: Bi; sub?: Bi; children: React.ReactNode }> = ({ id, icon, title, sub, children }) => (
    <section id={`kh-${id}`} className="scroll-mt-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: accent }}>
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </span>
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-tight">{L(title)}</h2>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{L(sub)}</p>}
        </div>
      </div>
      {children}
    </section>
  );

  const Note: React.FC<{ t: Bi }> = ({ t }) => (
    <div className="mt-3 rounded-lg border p-3 text-sm flex items-start gap-2" style={{ backgroundColor: `${accent}0D`, borderColor: `${accent}33` }}>
      <span className="material-symbols-outlined text-[18px] shrink-0" style={{ color: accent }}>tips_and_updates</span>
      <div>
        <span className="font-bold" style={{ color: accent }}>{lang === 'hi' ? 'आपके लिए सुझाव: ' : 'Your tip: '}</span>
        <span className="text-gray-700">{L(t)}</span>
      </div>
    </div>
  );

  const DIMENSIONS: Array<{ t: Bi; items: Bi[] }> = [
    { t: { en: 'Length', hi: 'लंबाई' }, items: ['14 ft', '17 ft', '19 ft', '20 ft', '24 ft', '28 ft', '32 ft'].map((x) => ({ en: x, hi: x })) },
    { t: { en: 'Height', hi: 'ऊंचाई' }, items: [{ en: 'Standard', hi: 'स्टैंडर्ड' }, { en: 'High Cube', hi: 'हाई क्यूब' }] },
    { t: { en: 'Width', hi: 'चौड़ाई' }, items: ['7 ft', '8 ft'].map((x) => ({ en: x, hi: x })) },
  ];
  const GOALS: Bi[] = [
    { en: '01 · Learn Truck Types', hi: '01 · ट्रक प्रकार सीखें' },
    { en: '02 · Master Terminology', hi: '02 · शब्दावली सीखें' },
    { en: '03 · Match Jobs Effectively', hi: '03 · प्रभावी जॉब मैच करें' },
  ];

  return (
    <div className="w-full flex gap-5 items-start">
      {/* Table of contents — sticky, stays put while the page scrolls */}
      <aside className="hidden lg:block w-60 shrink-0 sticky top-0 self-start max-h-[calc(100vh-70px)] overflow-y-auto py-1">
        <div className="space-y-1 pr-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">{lang === 'hi' ? 'ज्ञान गाइड' : 'Knowledge Guide'}</div>
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => go(s.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-semibold text-left transition-colors ${active === s.id ? 'text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              style={active === s.id ? { backgroundColor: accent } : undefined}>
              <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
              {L(s.label)}
            </button>
          ))}
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-10 pb-16">
        {/* Language toggle */}
        <div className="flex items-center justify-between gap-3 sticky top-0 z-20 bg-background/80 backdrop-blur py-1 -mt-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{lang === 'hi' ? 'भाषा' : 'Language'}</span>
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-0.5 shrink-0">
            {(['en', 'hi'] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${lang === l ? 'text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                style={lang === l ? { backgroundColor: accent } : undefined}>
                {l === 'en' ? 'English' : 'हिंदी'}
              </button>
            ))}
          </div>
        </div>

        {/* Hero */}
        <section id="kh-intro" className="scroll-mt-4">
          <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
            <div className="hidden lg:block absolute right-5 bottom-5 w-60 h-32 rounded-xl overflow-hidden shadow-xl border-2 border-white/40">
              <TruckArt name="trailer" label="Trailer / Semi-Trailer" onZoom={openZoom} className="w-full h-full rounded-none" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-90">{lang === 'hi' ? 'ट्रकमित्र प्रशिक्षण' : 'Truckmitr Training'}</p>
            <h1 className="text-3xl font-extrabold mt-1">{lang === 'hi' ? 'संपूर्ण ट्रक ज्ञान' : 'Complete Truck Knowledge'}</h1>
            <p className="text-sm mt-3 max-w-2xl opacity-95">
              {lang === 'hi'
                ? 'यह गाइड आपके लिए है — टेलीकॉलिंग और ड्राइवर ऑनबोर्डिंग टीम। ट्रक के प्रकार पहचानें, स्पेसिफिकेशन समझें, और ड्राइवर व फ्लीट ओनर से आत्मविश्वास से बात करें।'
                : 'A comprehensive guide for you — the Telecalling & Driver Onboarding team. Identify truck types, understand specifications, and speak confidently with drivers & fleet owners.'}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {GOALS.map((g) => (
                <span key={g.en} className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">{L(g)}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Why */}
        <Section id="why" icon="lightbulb" title={{ en: 'Why You Must Know Truck Types', hi: 'आपको ट्रक के प्रकार क्यों जानने चाहिए' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {WHY.map((w) => (
              <div key={w.title.en} className="border border-gray-200 rounded-xl p-4 bg-white">
                <span className="material-symbols-outlined text-[24px]" style={{ color: accent }}>{w.icon}</span>
                <h3 className="font-bold text-gray-900 text-sm mt-2">{L(w.title)}</h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{L(w.desc)}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Classification */}
        <Section id="classification" icon="category" title={{ en: 'Classification of Trucks in India', hi: 'भारत में ट्रकों का वर्गीकरण' }} sub={{ en: 'Three ways the industry classifies trucks', hi: 'इंडस्ट्री ट्रकों को तीन तरह से वर्गीकृत करती है' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 font-bold text-white text-sm" style={{ backgroundColor: accent }}>{lang === 'hi' ? 'कार्य के आधार पर' : 'By Function'}</div>
              <ul className="p-4 space-y-2 text-sm text-gray-700">
                {FUNCTION_ITEMS.map((x) => (
                  <li key={x.en} className="flex items-start gap-2"><span className="text-gray-300 mt-0.5">•</span>{L(x)}</li>
                ))}
              </ul>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 font-bold text-white text-sm" style={{ backgroundColor: accent }}>{lang === 'hi' ? 'भार (GVW) के आधार पर' : 'By GVW (Gross Vehicle Weight)'}</div>
              <div className="p-3 space-y-2">
                {GVW.map((g) => (
                  <div key={g.code} className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded text-white whitespace-nowrap" style={{ backgroundColor: g.color }}>{g.code}</span>
                    <span className="text-sm font-semibold text-gray-700 text-right">{L(g.range)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 font-bold text-white text-sm" style={{ backgroundColor: accent }}>{lang === 'hi' ? 'एक्सल / व्हील के आधार पर' : 'By Axle / Wheel Configuration'}</div>
              <div className="p-4 flex flex-wrap gap-2">
                {['4 Tyre', '6 Tyre', '10 Tyre', '12 Tyre', '14 Tyre', '16 Tyre', '18 Tyre', '22/24/28 Tyre (trailers)'].map((x) => (
                  <span key={x} className="text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{x}</span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* OEMs */}
        <Section id="oems" icon="factory" title={{ en: 'Key OEMs (Manufacturers) in India', hi: 'भारत के प्रमुख OEM (निर्माता)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{lang === 'hi' ? 'प्रमुख भारतीय OEM' : 'Major Indian OEMs'}</h3>
              {MAJOR_OEMS.map((o) => (
                <div key={o.name} className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 bg-white">
                  <span className="w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-white text-xs shrink-0" style={{ backgroundColor: accent }}>{o.name.slice(0, 2).toUpperCase()}</span>
                  <div><div className="font-bold text-sm text-gray-900">{o.name}</div><div className="text-xs text-gray-500">{L(o.desc)}</div></div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{lang === 'hi' ? 'लोकप्रिय ट्रेलर निर्माता' : 'Popular Trailer Manufacturers'}</h3>
                <div className="flex flex-wrap gap-2">
                  {TRAILER_MAKERS.map((m) => (<span key={m} className="text-sm font-semibold bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg">{m}</span>))}
                </div>
              </div>
              <Note t={{ en: 'Always ask "Tata or Leyland or BharatBenz?" — drivers identify trucks by OEM brand first.', hi: 'हमेशा पूछें "Tata या Leyland या BharatBenz?" — ड्राइवर सबसे पहले OEM ब्रांड से ट्रक पहचानते हैं।' }} />
            </div>
          </div>
        </Section>

        {/* Body types */}
        <Section id="body" icon="view_in_ar" title={{ en: 'Truck Body Types', hi: 'ट्रक बॉडी के प्रकार' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BODY_TYPES.map((b) => (
              <div key={b.title.en} className="border border-gray-200 rounded-xl overflow-hidden bg-white text-center">
                <div className="relative">
                  <TruckArt emoji={b.emoji} label={L(b.title)} onZoom={openZoom} className="w-full h-44 rounded-none" />
                  <span className="absolute top-2 right-2 bg-black/50 text-white rounded-md w-6 h-6 flex items-center justify-center pointer-events-none"><span className="material-symbols-outlined text-[15px]">zoom_in</span></span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm text-gray-900">{L(b.title)}</h3>
                  <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">{L(b.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Wheels */}
        <Section id="wheels" icon="tire_repair" title={{ en: 'Wheel / Tyre Configurations', hi: 'व्हील / टायर कॉन्फ़िगरेशन' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{lang === 'hi' ? 'रिजिड ट्रक (नॉन-ट्रेलर)' : 'Rigid Trucks (Non-Trailer)'}</h3>
              <div className="space-y-2">
                {RIGID_WHEELS.map((w) => (
                  <div key={w.title.en} className="border border-gray-200 rounded-xl p-3 bg-white">
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-900"><span className="material-symbols-outlined text-[18px]" style={{ color: accent }}>trip_origin</span>{L(w.title)}</div>
                    <p className="text-xs text-gray-500 mt-1 ml-6">{L(w.desc)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{lang === 'hi' ? 'ट्रेलर ट्रक' : 'Trailer Trucks'}</h3>
              <div className="space-y-2">
                {TRAILER_WHEELS.map((w) => (
                  <div key={w.title} className="border border-gray-200 rounded-xl p-3 bg-white flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-gray-900">{w.title}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white whitespace-nowrap" style={{ backgroundColor: accent }}>{L(w.desc)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Truck types in detail */}
        <Section id="types" icon="local_shipping" title={{ en: 'Truck Types in Detail', hi: 'ट्रक के प्रकार विस्तार से' }} sub={{ en: 'Models, payload, tyres, usage & what to ask', hi: 'मॉडल, पेलोड, टायर, उपयोग और क्या पूछें' }}>
          <div className="space-y-4">
            {TRUCK_TYPES.map((t) => (
              <div key={t.title.en} className="border border-gray-200 rounded-2xl overflow-hidden bg-white grid md:grid-cols-[300px_1fr]">
                {/* Big image */}
                <div className="relative min-h-[200px] bg-gray-50">
                  <TruckArt emoji={t.emoji} label={L(t.title)} onZoom={openZoom} className="absolute inset-0 w-full h-full rounded-none" />
                  <span className="absolute top-2 right-2 bg-black/50 text-white rounded-md w-7 h-7 flex items-center justify-center pointer-events-none"><span className="material-symbols-outlined text-[16px]">zoom_in</span></span>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 pointer-events-none">
                    <h3 className="text-white font-bold text-base drop-shadow">{L(t.title)}</h3>
                  </div>
                </div>
                {/* Details */}
                <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <table className="w-full text-sm">
                    <tbody>
                      {t.rows.map((r) => (
                        <tr key={r.k.en} className="border-b border-gray-50 last:border-0 align-top">
                          <td className="py-2 pr-3 text-gray-400 font-semibold whitespace-nowrap w-28">{L(r.k)}</td>
                          <td className="py-2 text-gray-800 font-medium">{L(r.v)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{lang === 'hi' ? 'किसके लिए' : 'Used For'}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {t.usedFor.map((u) => (<span key={u.en} className="text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{L(u)}</span>))}
                    </div>
                    <Note t={t.note} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Popular models */}
        <Section id="models" icon="tag" title={{ en: 'Popular Truck Models (Driver-Language)', hi: 'लोकप्रिय ट्रक मॉडल (ड्राइवर की भाषा)' }} sub={{ en: 'The code denotes GVW class & engine power', hi: 'कोड GVW क्लास और इंजन पावर बताता है' }}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {MODELS.map((m) => (
              <div key={m.code} className="border border-gray-200 rounded-xl p-4 bg-white flex items-center gap-3">
                <span className="font-mono text-xl font-extrabold px-3 py-1 rounded-lg text-white shrink-0" style={{ backgroundColor: accent }}>{m.code}</span>
                <span className="text-xs text-gray-600 font-medium">{L(m.desc)}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Axles */}
        <Section id="axles" icon="settings" title={{ en: 'Axle Configurations Explained', hi: 'एक्सल कॉन्फ़िगरेशन' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {AXLES.map((a) => (
              <div key={a.n} className="border border-gray-200 rounded-xl p-4 bg-white flex items-start gap-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-white text-sm shrink-0" style={{ backgroundColor: accent }}>{a.n}</span>
                <div><div className="font-bold text-sm text-gray-900">{L(a.title)}</div><div className="text-xs text-gray-500 mt-0.5">{L(a.desc)}</div></div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg p-3 text-sm font-semibold flex items-start gap-2 text-white" style={{ backgroundColor: accent }}>
            <span className="material-symbols-outlined text-[20px] shrink-0">insights</span>
            <span>{lang === 'hi' ? 'मुख्य बात: अधिक एक्सल = अधिक क्षमता + अधिक स्थिरता + अधिक टोल शुल्क।' : 'Key insight: More axles = higher capacity + more stability + more toll charges.'}</span>
          </div>
        </Section>

        {/* Dimensions */}
        <Section id="dimensions" icon="straighten" title={{ en: 'Understanding Truck Dimensions', hi: 'ट्रक के आयाम समझें' }} sub={{ en: 'Confirm exact dimensions when matching loads', hi: 'लोड मैच करते समय सटीक आयाम की पुष्टि करें' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DIMENSIONS.map((d) => (
              <div key={d.t.en} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 font-bold text-white text-sm" style={{ backgroundColor: accent }}>{L(d.t)}</div>
                <div className="p-4 flex flex-wrap gap-2">
                  {d.items.map((i) => (<span key={i.en} className="text-sm font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-lg">{L(i)}</span>))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Documents */}
        <Section id="docs" icon="description" title={{ en: 'Truck Documentation', hi: 'ट्रक के दस्तावेज़' }} sub={{ en: 'What drivers may ask during onboarding', hi: 'ऑनबोर्डिंग के दौरान ड्राइवर क्या पूछ सकते हैं' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DOCS.map((d) => (
              <div key={d.name.en} className="border border-gray-200 rounded-xl p-4 bg-white flex items-start gap-3">
                <span className="material-symbols-outlined text-[24px] shrink-0" style={{ color: accent }}>{d.icon}</span>
                <div><div className="font-bold text-sm text-gray-900">{L(d.name)}</div><div className="text-xs text-gray-500 mt-0.5">{L(d.desc)}</div></div>
              </div>
            ))}
          </div>
        </Section>

        {/* Matching */}
        <Section id="matching" icon="swap_horiz" title={{ en: 'Matching Driver Needs to Truck Type', hi: 'ड्राइवर की ज़रूरत को ट्रक टाइप से मैच करें' }} sub={{ en: 'Match drivers with the right jobs', hi: 'ड्राइवर को सही जॉब से मैच करें' }}>
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3">{lang === 'hi' ? 'ट्रक टाइप' : 'Truck Type'}</th>
                  <th className="px-4 py-3">{lang === 'hi' ? 'सुझाव' : 'Recommend'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MATCHING.map((m) => (
                  <tr key={m.truck.en}>
                    <td className="px-4 py-3 font-bold text-gray-900">
                      <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]" style={{ color: accent }}>local_shipping</span>{L(m.truck)}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{L(m.job)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Glossary */}
        <Section id="glossary" icon="abc" title={{ en: 'Common Truck Terms (Glossary)', hi: 'सामान्य ट्रक शब्दावली' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GLOSSARY.map((g) => (
              <div key={g.term} className="border border-gray-200 rounded-xl p-4 bg-white">
                <div className="font-extrabold text-sm" style={{ color: accent }}>{g.term}</div>
                <div className="text-xs text-gray-600 mt-1">{L(g.def)}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Summary */}
        <section className="rounded-2xl border-2 p-6 bg-white" style={{ borderColor: `${accent}44` }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined" style={{ color: accent }}>task_alt</span>
            <h2 className="text-lg font-bold text-gray-900">{lang === 'hi' ? 'सारांश — अब आप समझते हैं' : 'Summary — You Should Now Understand'}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SUMMARY.map((x) => (
              <div key={x.en} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="material-symbols-outlined text-[18px]" style={{ color: accent }}>check_circle</span>
                {L(x)}
              </div>
            ))}
          </div>
          <p className="text-sm font-semibold mt-4 flex items-center gap-2" style={{ color: accent }}>
            <TruckArt name="container" className="h-6 w-10 shrink-0" />
            {lang === 'hi' ? 'अब आप टेलीकॉलिंग और ड्राइवर ऑनबोर्डिंग में उत्कृष्टता के लिए तैयार हैं!' : "You're now equipped to excel in telecalling and driver onboarding!"}
          </p>
        </section>
      </div>

      {/* Enlarged image lightbox */}
      {zoom && (
        <div className="fixed inset-0 z-[60] bg-black/85 flex items-center justify-center p-4" onClick={() => setZoom(null)}>
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={zoom.src} alt={zoom.label} className="w-full max-h-[86vh] object-contain rounded-xl shadow-2xl bg-white" />
            <div className="absolute top-3 left-3 bg-black/60 text-white text-sm font-bold px-3 py-1.5 rounded-lg">{zoom.label}</div>
            <button onClick={() => setZoom(null)} title="Close" className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TruckKnowledgeHub;
