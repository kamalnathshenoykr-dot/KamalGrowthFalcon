import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Google GenAI if API key is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Google GenAI SDK:', err);
  }
}

// 1. Analyze Reviews Endpoint for Kitchen Dashboard
app.post('/api/gemini/reviews', async (req, res) => {
  const { reviews, brand, kitchen } = req.body;

  if (ai) {
    try {
      const prompt = `You are the Head of Operations and Quality for Growth Falcon, a Bangalore-based cloud kitchen platform.
Analyze the following customer reviews for brand "${brand || 'All Brands'}" at kitchen "${kitchen || 'Bangalore Hub'}":

${JSON.stringify(reviews, null, 2)}

Provide your response in JSON format with exactly the following structure:
{
  "sentimentSummary": "1-2 sentences summarizing overall customer sentiment and operational pulse.",
  "positiveHighlights": ["Highlight 1", "Highlight 2"],
  "topComplaints": [
    { "issue": "Complaint summary", "frequency": "High/Med/Low", "dish": "Dish Name", "impact": "Operational impact" }
  ],
  "suggestedFixes": [
    { "dish": "Dish Name", "rootCause": "Root cause explanation", "actionItem": "Specific kitchen/packaging fix" }
  ]
}
Return only valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text?.trim() || '';
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, source: 'gemini' });
      } catch (parseErr) {
        console.error('JSON parse error from Gemini output:', parseErr, text);
      }
    } catch (err) {
      console.warn('Gemini review analysis error, using fallback:', err);
    }
  }

  // Robust Fallback response tailored to Indian cloud kitchens
  return res.json({
    success: true,
    source: 'fallback',
    data: {
      sentimentSummary: 'Overall sentiment is strongly positive (4.2/5.0 avg) driven by authentic flavours in South Indian meals and healthy grain bowls. However, travel integrity and packaging temperature loss remain key detractors during peak Bangalore traffic delivery.',
      positiveHighlights: [
        'Filter Coffee flask and Ghee Roast Dosa praised for authentic aroma and crispness.',
        'Bowl Republic Quinoa Khichdi hailed as go-to healthy lunch for tech parks in Bellandur & HSR.',
      ],
      topComplaints: [
        {
          issue: 'Soggy paratha & crust deterioration during 35+ min transit in rains',
          frequency: 'High',
          dish: 'Butter Chicken Kathi Roll',
          impact: 'Reorder rate dropped 14% on delivery distances over 4.5km',
        },
        {
          issue: 'Sambhar temperature dropped below 50°C during HSR Layout rush hour',
          frequency: 'Medium',
          dish: 'Royal South Indian Thali',
          impact: '3 ratings below 3 stars citing cold gravy',
        },
        {
          issue: 'Occasional delay in prep handover to rider during 8:30 PM weekend rush',
          frequency: 'Medium',
          dish: 'Dum Biryani Pot',
          impact: 'Prep time breached 18 min SLA by 6 minutes',
        },
      ],
      suggestedFixes: [
        {
          dish: 'Butter Chicken Kathi Roll',
          rootCause: 'Steam condensation inside aluminum foil wrapper softens outer flaky layer.',
          actionItem: 'Switch to micro-perforated breathable parchment paper wrap + insulated corrugated cardboard sleeves.',
        },
        {
          dish: 'Royal South Indian Thali',
          rootCause: 'Standard PP containers lose 12°C heat within 20 mins of Bangalore evening transit.',
          actionItem: 'Deploy bio-laminated bagasse trays with thermal foil lid seal; pre-heat station for sambhar dispensing.',
        },
        {
          dish: 'Dum Biryani Pot',
          rootCause: 'Individual pot sealing on order delays dispatch during 8-9 PM peak.',
          actionItem: 'Implement 15-minute rolling buffer preparation based on predictive surge data for Koramangala & Indiranagar.',
        },
      ],
    },
  });
});

// 2. Generate WhatsApp Campaign Nudge for Marketing View
app.post('/api/gemini/nudge', async (req, res) => {
  const { segment, language = 'English', targetBrand = 'All Brands' } = req.body;

  if (ai) {
    try {
      const prompt = `You are the Chief Marketing Officer at Growth Falcon, a premier cloud kitchen network in Bangalore.
Write a punchy, highly converting WhatsApp promotional message for the customer segment: "${segment}".
Target brand: "${targetBrand}".
Language style: "${language}" (${language === 'Hinglish' ? 'blend of colloquial Indian Hindi + English commonly used in Bangalore tech circles like Bengaluru, macha, treat, yaar, office lunch, monsoon' : 'Crisp, conversational, warm Indian modern tone'}).

Include:
- An attention-grabbing hook
- Clear value proposition / discount (e.g., 25% OFF or ₹100 Flat or Falcon Coins bonus)
- Urgency call to action with a direct app link (growthfalcon.in/order)
- Keep it under 60 words, formatted nicely with clean emojis for WhatsApp.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });

      const message = response.text?.trim() || '';
      return res.json({ success: true, message, source: 'gemini' });
    } catch (err) {
      console.warn('Gemini marketing nudge error, using fallback:', err);
    }
  }

  // Fallback nudges
  const fallbacks: Record<string, { English: string; Hinglish: string }> = {
    'Late-night regulars': {
      English: '🌙 Craving midnight fuel in Koramangala? Midnight Maska is hot and rolling! Enjoy ₹120 OFF on Dum Biryani & Rolls + 2X Falcon Coins. Delivered hot in 28 mins. Order now on the Growth Falcon App: growthfalcon.in/midnight 🚀',
      Hinglish: 'Midnight hunger pangs, yaar? 🌯 Midnight Maska ke steaming rolls & Dum Biryani ready hai! Use code MIDNIGHT100 for ₹100 flat OFF + free Falcon Coins. Garma-garam delivery right to your door: growthfalcon.in/midnight 🔥',
    },
    'Lapsed': {
      English: '👋 We miss you at Growth Falcon! Bangalore rains call for warm comfort. Enjoy FLAT ₹150 OFF on your favourite South Indian Thali or Quinoa Bowl today. Valid on direct app orders: growthfalcon.in/welcomeback 🍛',
      Hinglish: 'Arre boss, it’s been a while! 🍛 Rainy Bangalore weather me garam filter coffee aur ghee roast dosa miss ho gaya kya? Flat ₹150 OFF with code COMEBACK. Order direct, save big: growthfalcon.in/welcomeback ✨',
    },
    'High-value': {
      English: '⭐ VIP Exclusive: Thank you for being one of Bangalore’s top food connoisseurs! Here is ₹200 Falcon Credit loaded directly to your wallet for your next family feast. Order now: growthfalcon.in/vip-feast 👑',
      Hinglish: 'Exclusive VIP treat for you, boss! 🌟 Aapke Falcon Wallet me ₹200 direct credit deposit kar diya hai. Perfect for tonight’s dinner feast with zero aggregator markups: growthfalcon.in/vip-feast 🥂',
    },
    'New': {
      English: '🎉 Welcome to Bangalore’s smartest cloud kitchen collective! Enjoy 40% OFF your first order from Thali Theory, Bowl Republic, or Midnight Maska. Direct pricing, zero surge: growthfalcon.in/first40 🚀',
      Hinglish: 'Welcome to Growth Falcon family! 🎉 First order pe flat 40% OFF with code BANGALOREFIRST. No platform fees, fastest delivery in HSR & Indiranagar: growthfalcon.in/first40 🍲',
    },
  };

  const selectedSegment = fallbacks[segment] || fallbacks['Late-night regulars'];
  const fallbackMessage = (language === 'Hinglish' ? selectedSegment.Hinglish : selectedSegment.English);

  return res.json({
    success: true,
    message: fallbackMessage,
    source: 'fallback',
  });
});

// 3. Explain Financial Offer Endpoint for Partner Finance View
app.post('/api/gemini/explain-offer', async (req, res) => {
  const { offerType, offerDetails, language = 'English', audience = 'Kitchen Partner' } = req.body;

  if (ai) {
    try {
      const prompt = `You are a financial advisor from "Partner Bank", partnering with Growth Falcon cloud kitchens in Bangalore.
Explain the following financial product offer clearly to a ${audience}:
Product: ${offerType}
Offer Details: ${JSON.stringify(offerDetails, null, 2)}
Language required: "${language}" (If Hindi, write in clear Hindi/Hinglish in Devanagari or clean Roman Hindi; if Kannada, write in Kannada script with clear simple terms; if English, write in crystal clear, jargon-free business English).

Break it down into:
1. What is this offer and why are you eligible?
2. How the money works (disbursement & daily automated repayment from sales).
3. The #1 business benefit for you.
Keep it transparent, empowering, and concise (under 120 words).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.3,
        },
      });

      const explanation = response.text?.trim() || '';
      return res.json({ success: true, explanation, source: 'gemini' });
    } catch (err) {
      console.warn('Gemini finance explainer error, using fallback:', err);
    }
  }

  // Fallback multi-language explanations
  const fallbackExplanations: Record<string, Record<string, string>> = {
    English: {
      'Working Capital Loan': 'Based on your steady ₹3.8L monthly kitchen settlements through Growth Falcon, Partner Bank has pre-approved a ₹4,50,000 working capital loan. Instead of fixed monthly EMIs that stress your cash flow during lean days, repayment happens automatically as a 12% split on your daily order payouts. On days with high orders you repay faster; on slow days you repay less. Zero collateral required, 100% digital disbursement in 2 hours.',
      'EV Bike Loan': 'You have completed 480+ rides with 4.8★ rating on Growth Falcon! Partner Bank offers you a 100% financed Ather/Ola commercial EV 2-wheeler. Your EMI of ₹28 is deducted automatically per completed delivery trip. Switching to EV saves you ₹3,500/month on petrol, increasing your take-home earnings immediately.',
      'Starter Micro-Loan': 'Congratulations on maintaining consistent 4.7★ hygiene ratings as a Growth Falcon Home Cook! Partner Bank offers a ₹35,000 zero-collateral starter credit line to buy commercial utensils and bulk raw materials. Repay easily with ₹15 deducted per completed order. Build your formal CIBIL credit score while you cook!',
    },
    Hindi: {
      'Working Capital Loan': 'ग्रोथ फाल्कन पर आपकी ₹3.8 लाख की मासिक बिक्री के आधार पर पार्टनर बैंक ने आपके लिए ₹4,50,000 का वर्किंग कैपिटल लोन प्री-अप्रूव किया है। कोई फिक्स्ड EMI का झंझट नहीं! दैनिक बिक्री का 12% हिस्सा अपने-आप कटकर लोन चुक जाता है। जिस दिन ज्यादा ऑर्डर्स, उस दिन तेजी से भरपाई; धीमे दिन कम कटौती। बिना किसी गिरवी (Collateral) के 2 घंटे में सीधे खाते में!',
      'EV Bike Loan': '480+ सफल ट्रिप्स के लिए बधाई! पार्टनर बैंक आपको बिना डाउन-पेमेंट के कमर्शियल इलेक्ट्रिक स्कूटर लोन दे रहा है। प्रति ट्रिप केवल ₹28 EMI कटेगी। पेट्रोल का हर महीने ₹3,500 बचेगा और आपकी कुल कमाई तुरंत बढ़ जाएगी।',
      'Starter Micro-Loan': 'ग्रोथ फाल्कन होम कुक के रूप में शानदार 4.7★ हाइजीन रेटिंग के लिए आपको ₹35,000 का आसान स्टार्टर लोन मिल रहा है। इसे नए बर्तन और सामग्री खरीदने के लिए उपयोग करें। हर ऑर्डर पर सिर्फ ₹15 कटकर लोन चुकता होगा। आपका फॉर्मल क्रेडिट स्कोर भी मजबूत बनेगा!',
    },
    Kannada: {
      'Working Capital Loan': 'ಗ್ರೋತ್ ಫಾಲ್ಕನ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಸ್ಥಿರ ₹3.8 ಲಕ್ಷ ಮಾಸಿಕ ಮಾರಾಟದ ಆಧಾರದ ಮೇಲೆ, ಪಾರ್ಟ್ನರ್ ಬ್ಯಾಂಕ್ ನಿಮಗೆ ₹4,50,000 ವರ್ಕಿಂಗ್ ಕ್ಯಾಪಿಟಲ್ ಲೋನ್ ಅನುಮೋದಿಸಿದೆ. ಸ್ಥಿರ ಮಾಸಿಕ EMI ಬದಲು, ನಿಮ್ಮ ದೈನಂದಿನ ಆರ್ಡರ್ ಪಾವತಿಗಳಿಂದ 12% ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಕಡಿತಗೊಳ್ಳುತ್ತದೆ. ಹೆಚ್ಚು ಆರ್ಡರ್ ಬಂದಾಗ ವೇಗವಾಗಿ ಮರುಪಾವತಿಯಾಗುತ್ತದೆ. ಯಾವುದೇ ಆಸ್ತಿ ಅಡಮಾನವಿಲ್ಲದೆ 2 ಗಂಟೆಯಲ್ಲಿ ನೇರ ಜಮೆ.',
      'EV Bike Loan': '480 ಕ್ಕೂ ಹೆಚ್ಚು ಯಶಸ್ವಿ ಟ್ರಿಪ್‌ಗಳಿಗಾಗಿ ಪಾರ್ಟ್ನರ್ ಬ್ಯಾಂಕ್ ನಿಮಗೆ 100% ಇವಿ ಬೈಕ್ ಸಾಲ ನೀಡುತ್ತಿದೆ. ಪ್ರತಿ ಡೆಲಿವರಿ ಟ್ರಿಪ್‌ಗೆ ಕೇವಲ ₹28 ಕಡಿತಗೊಳ್ಳುತ್ತದೆ. ಪೆಟ್ರೋಲ್ ವೆಚ್ಚದಲ್ಲಿ ತಿಂಗಳಿಗೆ ₹3,500 ಉಳಿತಾಯವಾಗಿ ನಿಮ್ಮ ಆದಾಯ ಹೆಚ್ಚುತ್ತದೆ.',
      'Starter Micro-Loan': 'ಗ್ರೋತ್ ಫಾಲ್ಕನ್ ಹೋಮ್ ಕುಕ್ ಆಗಿ 4.7★ ರೇಟಿಂಗ್ ಹೊಂದಿದ್ದಕ್ಕಾಗಿ ₹35,000 ಸ್ಟಾರ್ಟರ್ ಲೋನ್ ಲಭ್ಯವಿದೆ. ಪ್ರತಿ ಆರ್ಡರ್‌ಗೆ ₹15 ಕಡಿತದೊಂದಿಗೆ ಸುಲಭ ಮರುಪಾವತಿ. ನಿಮ್ಮ ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್ ಬೆಳೆಸಿಕೊಳ್ಳಿ!',
    },
  };

  const langDict = fallbackExplanations[language] || fallbackExplanations.English;
  const match = langDict[offerType] || langDict['Working Capital Loan'];

  return res.json({
    success: true,
    explanation: match,
    source: 'fallback',
  });
});

// 4. Rider Support AI Chat & Ticket Classifier
app.post('/api/gemini/rider-support', async (req, res) => {
  const { query, riderName, language = 'English', riderContext } = req.body;

  if (ai) {
    try {
      const prompt = `You are the AI Fleet Support Assistant for Growth Falcon Delivery Partners in Bangalore.
A delivery partner named "${riderName || 'Partner'}" reported this issue:
"${query}"
Language: "${language}" (English, Hindi, or Kannada).
Rider Context: ${JSON.stringify(riderContext || {})}

Analyze the problem, categorize it (one of: 'payment', 'order_issue', 'safety', 'app_bug', 'account'), provide immediate helpful guidance in the requested language, and specify action steps.
Respond in valid JSON with this exact format:
{
  "category": "payment|order_issue|safety|app_bug|account",
  "reply": "Empathetic, clear, direct guidance in the specified language (${language}) under 60 words.",
  "actionSteps": ["Action step 1", "Action step 2"],
  "ticketPriority": "High|Medium|Low"
}
Return only valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text?.trim() || '';
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, source: 'gemini' });
      } catch (parseErr) {
        console.error('JSON parse error from Gemini rider support:', parseErr, text);
      }
    } catch (err) {
      console.warn('Gemini rider support error, using fallback:', err);
    }
  }

  // Fallback responses in English, Hindi, and Kannada
  const fallbacks: Record<string, any> = {
    English: {
      category: 'order_issue',
      reply: 'Don’t worry! We have logged your request. If the kitchen wait time exceeds 10 minutes, you will automatically receive ₹35 waiting compensation. Our dispatch team has also notified the kitchen supervisor.',
      actionSteps: ['Stay at the dispatch counter', 'Tap "Claim Waiting Pay" after timer completes', 'Contact support if order is canceled'],
      ticketPriority: 'Medium',
    },
    Hindi: {
      category: 'order_issue',
      reply: 'चिंता न करें! आपका अनुरोध दर्ज कर लिया गया है। यदि किचन में 10 मिनट से अधिक समय लगता है, तो आपको स्वचालित रूप से ₹35 प्रतीक्षा भत्ता मिलेगा। डिस्पैच टीम को सूचित कर दिया गया है।',
      actionSteps: ['डिस्पैच काउंटर पर प्रतीक्षा करें', 'टाइमर समाप्त होने पर क्लेम करें', 'समस्या होने पर सहायता बटन दबाएं'],
      ticketPriority: 'Medium',
    },
    Kannada: {
      category: 'order_issue',
      reply: 'ಚಿಂತಿಸಬೇಡಿ! ನಿಮ್ಮ ಕೋರಿಕೆಯನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ. ಕಿಚನ್‌ನಲ್ಲಿ ಕಾಯುವ ಸಮಯ 10 ನಿಮಿಷ ಮೀರಿದರೆ, ₹35 ಕಾಯುವಿಕೆ ಪರಿಹಾರವನ್ನು ನಿಮ್ಮ ಖಾತೆಗೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಜಮೆ ಮಾಡಲಾಗುತ್ತದೆ.',
      actionSteps: ['ಕೌಂಟರ್‌ನಲ್ಲಿ ಕಾಯಿರಿ', 'ಟೈಮರ್ ಮುಗಿದ ನಂತರ ಪರಿಹಾರ ಕ್ಲೈಮ್ ಮಾಡಿ', 'ಅಗತ್ಯವಿದ್ದರೆ ಬೆಂಬಲ ತಂಡವನ್ನು ಸಂಪರ್ಕಿಸಿ'],
      ticketPriority: 'Medium',
    },
  };

  const chosen = fallbacks[language] || fallbacks.English;
  return res.json({ success: true, data: chosen, source: 'fallback' });
});

// 5. Rider Explain Earnings & Growth Suggestions
app.post('/api/gemini/explain-earnings', async (req, res) => {
  const { earningsData, riderName, language = 'English' } = req.body;

  if (ai) {
    try {
      const prompt = `You are a friendly financial coach for Growth Falcon delivery partners in Bangalore.
Delivery Partner: ${riderName || 'Partner'}
Earnings breakdown: ${JSON.stringify(earningsData || {})}
Language: "${language}" (English, Hindi, or Kannada).

Explain this week's earnings and deductions simply in the specified language (${language}), highlighting base pay, incentives, and savings/loan deductions. Then give 2 practical tips to earn ₹2,000+ more next week in Bangalore (e.g. Koramangala 11 PM-2 AM midnight surge, lunch tech-park batching in HSR).
Format in JSON:
{
  "summary": "Clear, friendly summary of net take-home and deductions in ${language} (under 75 words).",
  "tips": [
    "Practical Bangalore tip 1 with specific zone and time",
    "Practical Bangalore tip 2"
  ]
}
Return only valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text?.trim() || '';
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, source: 'gemini' });
      } catch (parseErr) {
        console.error('JSON parse error from Gemini explain earnings:', parseErr, text);
      }
    } catch (err) {
      console.warn('Gemini explain earnings error, using fallback:', err);
    }
  }

  // Fallback explanations
  const fallbackDict: Record<string, any> = {
    English: {
      summary: 'Great job this week! You earned gross ₹7,480 across 68 trips with ₹850 in rain & weekend incentives. After deducting ₹540 for your EV EMI and ₹350 into your high-yield RD auto-savings, your net bank payout is ₹6,590.',
      tips: [
        'Login during 11:00 PM – 2:30 AM in Koramangala & Indiranagar to grab ₹30/order Midnight Maska surge bonuses.',
        'Accept batched dual-drops from HSR Cloud Spaces during 12:30 PM lunch peak to boost hourly earnings by 38%.',
      ],
    },
    Hindi: {
      summary: 'इस सप्ताह शानदार प्रदर्शन! आपने 68 ट्रिप्स में कुल ₹7,480 कमाए जिसमें ₹850 इंसेंटिव शामिल है। EV किस्त (₹540) और सेविंग्स (₹350) कटने के बाद आपकी नेट टेक-होम कमाई ₹6,590 है।',
      tips: [
        'कोरमंगला में रात 11 बजे से 2:30 बजे के बीच मिडनाइट मस्का ऑर्डर्स पर ₹30 अतिरिक्त सर्ज बोनस पाएं।',
        'HSR लेआउट में दोपहर 12:30 बजे लंच पीक के दौरान बैच ऑर्डर्स लें जिससे प्रति घंटा कमाई 38% बढ़ जाएगी।',
      ],
    },
    Kannada: {
      summary: 'ಈ ವಾರ ಅತ್ಯುತ್ತಮ ಗಳಿಕೆ! 68 ಟ್ರಿಪ್‌ಗಳಿಂದ ₹7,480 ಗಳಿಸಿದ್ದೀರಿ, ಇದರಲ್ಲಿ ₹850 ಪ್ರೋತ್ಸಾಹಧನ ಸೇರಿದೆ. ಇವಿ ಸಾಲದ ಇಎಂಐ (₹540) ಮತ್ತು ಉಳಿತಾಯ (₹350) ಕಡಿತದ ನಂತರ ನಿಮ್ಮ ನಿವ್ವಳ ಬ್ಯಾಂಕ್ ಜಮೆ ₹6,590.',
      tips: [
        'ಕೋರಮಂಗಲದಲ್ಲಿ ರಾತ್ರಿ 11 ರಿಂದ 2:30 ರವರೆಗೆ ಲಾಗಿನ್ ಆಗಿ ₹30 ಮಿಡ್‌ನೈಟ್ ಬೋನಸ್ ಪಡೆಯಿರಿ.',
        'ಎಚ್‌ಎಸ್‌ಆರ್ ಲೇಔಟ್‌ನಲ್ಲಿ ಮಧ್ಯಾಹ್ನ 12:30 ರ ಪೀಕ್ ಅವಧಿಯಲ್ಲಿ ಬ್ಯಾಚ್ ಆರ್ಡರ್‌ಗಳನ್ನು ಸ್ವೀಕರಿಸಿ.',
      ],
    },
  };

  const selected = fallbackDict[language] || fallbackDict.English;
  return res.json({ success: true, data: selected, source: 'fallback' });
});

// Download Standalone Single-File HTML App
app.get('/api/download-html', (_req, res) => {
  const filePath = path.resolve(__dirname, 'public', 'growth-falcon-app.html');
  res.download(filePath, 'growth-falcon-app.html');
});

app.get('/growth-falcon-app.html', (_req, res) => {
  const filePath = path.resolve(__dirname, 'public', 'growth-falcon-app.html');
  res.sendFile(filePath);
});

// Vite middleware in dev or static serve in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = process.env.PORT || 3000;
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Growth Falcon server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
