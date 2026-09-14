"""Verified agricultural knowledge, medicines, and multilingual chatbot replies."""

DISEASES = {
    "healthy": {
        "name": {
            "en": "Healthy leaf",
            "hi": "स्वस्थ पत्ती",
            "ta": "ஆரோக்கியமான இலை",
            "mr": "निरोगी पान",
        },
        "confidence_boost": 0.08,
        "advice": {
            "en": "Leaf colour looks normal. Keep monitoring moisture, pests and nutrient balance.",
            "hi": "पत्ती का रंग सामान्य दिखता है। नमी, कीट और पोषक तत्वों के संतुलन की निगरानी करते रहें।",
            "ta": "இலை நிறம் சாதாரணமாக உள்ளது. ஈரப்பதம், பூச்சிகள் மற்றும் ஊட்டச்சத்து சமநிலையை தொடர்ந்து கண்காணிக்கவும்.",
            "mr": "पानाचा रंग सामान्य दिसत आहे. ओलावा, कीड आणि पोषक संतुलनावर लक्ष ठेवा.",
        },
        "medicines": ["neem_oil", "vermicompost"],
    },
    "fungal_blight": {
        "name": {
            "en": "Fungal blight / leaf spot",
            "hi": "फंगल ब्लाइट / पत्ती धब्बा",
            "ta": "பூஞ்சை கருகல் / இலைப்புள்ளி",
            "mr": "बुरशीजन्य करपा / पानांवरील ठिपके",
        },
        "advice": {
            "en": "Brown or black spots often indicate fungal infection. Remove badly infected leaves, avoid overhead watering, and use a recommended fungicide. This is an AI indication, not a lab diagnosis.",
            "hi": "भूरे या काले धब्बे अक्सर फंगल संक्रमण का संकेत देते हैं। अत्यधिक प्रभावित पत्तियां हटाएं, ऊपर से पानी न डालें और अनुशंसित कवकनाशी का प्रयोग करें।",
            "ta": "பழுப்பு அல்லது கருப்பு புள்ளிகள் பூஞ்சை தொற்றைக் குறிக்கின்றன. பாதிக்கப்பட்ட இலைகளை அகற்றி, மேல் தெளிப்பு நீர்ப்பாசனத்தைத் தவிர்க்கவும், பரிந்துரைக்கப்பட்ட பூஞ்சைக் கொல்லியைப் பயன்படுத்தவும்.",
            "mr": "तपकिरी किंवा काळे ठिपके बुरशी संसर्गाचे संकेत देतात. जास्त प्रादुर्भाव झालेली पाने काढून टाका, वरून पाणी देणे टाळा आणि योग्य बुरशीनाशक वापरा.",
        },
        "medicines": ["mancozeb", "copper_fungicide", "neem_oil"],
    },
    "bacterial_blight": {
        "name": {
            "en": "Bacterial leaf blight",
            "hi": "बैक्टीरियल पत्ती झुलसा",
            "ta": "பாக்டீரியா இலைக்கருகல்",
            "mr": "जिवाणूजन्य पान करपा",
        },
        "advice": {
            "en": "Yellow halos around dark lesions can indicate bacterial blight. Avoid working in wet fields, use copper-based protectants, and consult an expert if it is spreading.",
            "hi": "काले घावों के चारों ओर पीले घेरे जीवाणु झुलसा का संकेत हो सकते हैं। गीले खेत में काम न करें, कॉपर युक्त सुरक्षात्मक दवा डालें और प्रसार होने पर विशेषज्ञ से सलाह लें।",
            "ta": "கரும் புள்ளிகளைச் சுற்றியுள்ள மஞ்சள் வளையங்கள் பாக்டீரியா கருகலைக் குறிக்கலாம். ஈரமான வயலில் வேலை செய்வதைத் தவிர்த்து, தாமிர அடிப்படையிலான மருந்துகளைப் பயன்படுத்தவும்.",
            "mr": "काळ्या डागांभोवती पिवळी कडा जिवाणू करप्याचे लक्षण असू शकते. ओल्या शेतात काम करणे टाळा, तांबेयुक्त औषधे वापरा आणि तज्ज्ञांचा सल्ला घ्या.",
        },
        "medicines": ["copper_fungicide", "streptomycin_agri", "neem_oil"],
    },
    "yellow_deficiency": {
        "name": {
            "en": "Yellowing / nutrient stress",
            "hi": "पीलापन / पोषक तत्वों की कमी",
            "ta": "மஞ்சளாதல் / ஊட்டச்சத்துக் குறைபாடு",
            "mr": "पाने पिवळी पडणे / पोषक कमतरता",
        },
        "advice": {
            "en": "Widespread yellowing often relates to nitrogen stress, waterlogging or root issues. Check soil NPK, drainage and irrigation before spraying pesticides.",
            "hi": "व्यापक पीलापन नाइट्रोजन की कमी, जलभराव या जड़ समस्याओं से जुड़ा हो सकता है। कीटनाशक छिड़कने से पहले मिट्टी NPK और जल निकासी जांचें।",
            "ta": "அதிகளவில் மஞ்சளாதல் பெரும்பாலும் நைட்ரஜன் குறைபாடு, நீர் தேங்குதல் அல்லது வேர் பிரச்சனைகளால் ஏற்படுகிறது. பூச்சிக்கொல்லி தெளிக்கும் முன் மண் NPK மற்றும் வடிகால் வசதியை சரிபார்க்கவும்.",
            "mr": "मोठ्या प्रमाणावर पिवळेपणा नायट्रोजन कमतरता, पाणी साचणे किंवा मुळांच्या समस्येमुळे असू शकतो. कीटकनाशक फवारण्यापूर्वी माती NPK व निचरा तपासा.",
        },
        "medicines": ["urea_npk", "vermicompost", "micronutrient_mix"],
    },
    "pest_damage": {
        "name": {
            "en": "Pest feeding damage",
            "hi": "कीट नुकसान",
            "ta": "பூச்சி தாக்குதல் சேதம்",
            "mr": "कीड नुकसान",
        },
        "advice": {
            "en": "Irregular holes and chewing marks can indicate pests. Inspect the underside of leaves. Prefer neem or targeted insecticide only after identifying the pest.",
            "hi": "अनियमित छेद और चबाने के निशान कीट प्रकोप दर्शाते हैं। पत्तियों के नीचे जांचें। कीट की पहचान के बाद ही नीम तेल या लक्षित कीटनाशक का उपयोग करें।",
            "ta": "ஒழுங்கற்ற துளைகள் மற்றும் மெல்லப்பட்ட அடையாளங்கள் பூச்சிகளைக் குறிக்கலாம். இலைகளின் அடிப்பகுதியை ஆராய்ந்து, பூச்சியை அடையாளம் கண்ட பின்னரே வேப்ப எண்ணெய் அல்லது பூச்சிக்கொல்லியைப் பயன்படுத்தவும்.",
            "mr": "अनियमित छिद्रे आणि कुरतडलेली पाने किडींचा प्रादुर्भाव दर्शवतात. पानांची खालची बाजू तपासा. कीड ओळखल्यानंतरच कडुनिंब तेल किंवा कीटकनाशक वापरा.",
        },
        "medicines": ["neem_oil", "imidacloprid", "sticky_traps"],
    },
}

MEDICINES = {
    "neem_oil": {
        "name": {"en": "Neem oil 300 ml", "hi": "नीम तेल 300 मिली", "ta": "வேப்ப எண்ணெய் 300 மி.லி", "mr": "कडुनिंब तेल 300 मिली"},
        "price": 189,
        "unit": "bottle",
        "kind": "organic",
        "use": {
            "en": "Organic pest and mild fungal support. Spray in evening.",
            "hi": "जैविक कीट और हल्के फंगल नियंत्रण के लिए। शाम के समय छिड़काव करें।",
            "ta": "இயற்கை பூச்சி மற்றும் லேசான பூஞ்சை மேலாண்மைக்கு. மாலையில் தெளிக்கவும்.",
            "mr": "सेंद्रिय कीड व हलक्या बुरशी नियंत्रणासाठी. संध्याकाळी फवारणी करा.",
        },
    },
    "mancozeb": {
        "name": {"en": "Mancozeb 75% WP 500 g", "hi": "मैंकोजेब 75% WP 500 ग्राम", "ta": "மேன்கோசெப் 500 கிராம்", "mr": "मँकोझेब 500 ग्रॅम"},
        "price": 245,
        "unit": "pack",
        "kind": "fungicide",
        "use": {
            "en": "Protective fungicide for blight and leaf spots. Follow label dose.",
            "hi": "ब्लाइट और पत्ती धब्बों के लिए सुरक्षात्मक कवकनाशी। लेबल पर लिखी मात्रा का पालन करें।",
            "ta": "கருகல் மற்றும் இலைப்புள்ளிக்கு பாதுகாப்பு பூஞ்சைக் கொல்லி. லேபிள் அளவை பின்பற்றவும்.",
            "mr": "करपा व पानावरील डागांसाठी संरक्षक बुरशीनाशक. योग्य मात्रा वापरा.",
        },
    },
    "copper_fungicide": {
        "name": {"en": "Copper oxychloride 500 g", "hi": "कॉपर ऑक्सीक्लोराइड 500 ग्राम", "ta": "காப்பர் ஆக்ஸிகுளோரைடு 500 கிராம்", "mr": "कॉपर ऑक्सिक्लोराईड 500 ग्रॅम"},
        "price": 220,
        "unit": "pack",
        "kind": "fungicide",
        "use": {
            "en": "Useful against bacterial and fungal leaf diseases. Do not mix with incompatible chemicals.",
            "hi": "जीवाणु और फंगल पत्ती रोगों में उपयोगी। असंगत रसायनों के साथ न मिलाएं।",
            "ta": "பாக்டீரியா மற்றும் பூஞ்சை இலை நோய்களுக்கு உகந்தது. பொருந்தாத ரசாயனங்களுடன் கலக்காதீர்கள்.",
            "mr": "जिवाणू व बुरशीजन्य रोगांवर गुणकारी. विसंगत रसायनांसोबत मिसळू नका.",
        },
    },
    "streptomycin_agri": {
        "name": {"en": "Agri streptomycin combo 6 g", "hi": "स्ट्रेप्टोमाइसिन कॉम्बो 6 ग्राम", "ta": "ஸ்ட்ரெப்டோமைசின் காம்போ 6 கிராம்", "mr": "स्ट्रेप्टोमायसीन कॉम्बो 6 ग्रॅम"},
        "price": 95,
        "unit": "sachet",
        "kind": "bactericide",
        "use": {
            "en": "For bacterial blight management under expert guidance. Restricted agricultural use only.",
            "hi": "विशेषज्ञ सलाह के तहत जीवाणु झुलसा नियंत्रण के लिए। केवल सीमित कृषि उपयोग हेतु।",
            "ta": "பாக்டீரியா இலைக்கருகலுக்கு நிபுணர் வழிகாட்டுதலுடன் பயன்படுத்தவும்.",
            "mr": "तज्ज्ञांच्या मार्गदर्शनाखाली जिवाणू करपा नियंत्रणासाठी. केवळ शेती वापरासाठी.",
        },
    },
    "urea_npk": {
        "name": {"en": "NPK 19-19-19 1 kg", "hi": "NPK 19-19-19 1 किग्रा", "ta": "NPK 19-19-19 1 கிலோ", "mr": "NPK 19-19-19 1 किलो"},
        "price": 165,
        "unit": "bag",
        "kind": "fertilizer",
        "use": {
            "en": "Balanced foliar/soil nutrient support when yellowing is due to nutrition.",
            "hi": "पोषक तत्वों की कमी से पीलापन होने पर संतुलित पोषण प्रदान करता है।",
            "ta": "ஊட்டச்சத்துக் குறைவால் மஞ்சளாதல் ஏற்பட்டால் சமச்சீர் ஊட்டச்சத்து அளிக்கும்.",
            "mr": "पोषक तत्वांच्या कमतरतेमुळे पिवळेपणा आल्यास संतुलित पोषण देते.",
        },
    },
    "vermicompost": {
        "name": {"en": "Vermicompost 5 kg", "hi": "वर्मीकम्पोस्ट 5 किग्रा", "ta": "மண்புழு உரம் 5 கிலோ", "mr": "गांडूळ खत 5 किलो"},
        "price": 149,
        "unit": "bag",
        "kind": "organic",
        "use": {
            "en": "Improves soil health and microbial activity.",
            "hi": "मिट्टी के स्वास्थ्य और सूक्ष्मजीवी गतिविधि को सुधारता है।",
            "ta": "மண் ஆரோக்கியத்தையும் நுண்ணுயிர் பெருக்கத்தையும் மேம்படுத்துகிறது.",
            "mr": "मातीचे आरोग्य आणि उपयुक्त सूक्ष्मजीवांची संख्या वाढवते.",
        },
    },
    "imidacloprid": {
        "name": {"en": "Imidacloprid 17.8% SL 100 ml", "hi": "इमिडाक्लोप्रिड 17.8% 100 मिली", "ta": "இமிடாக்ளோபிரிட் 100 மி.லி", "mr": "इमिडाक्लोप्रिड 100 मिली"},
        "price": 210,
        "unit": "bottle",
        "kind": "insecticide",
        "use": {
            "en": "For sucking pests after identification. Follow waiting period and safety gear.",
            "hi": "पहचान के बाद रस चूसक कीटों के लिए। प्रतीक्षा अवधि और सुरक्षा उपकरण अपनाएं।",
            "ta": "சாறு உறிஞ்சும் பூச்சிகளுக்கு அடையாளம் கண்ட பின் தெளிக்கவும். பாதுகாப்பு விதிகளைப் பின்பற்றவும்.",
            "mr": "रसशोषक किडींसाठी कीड ओळखल्यानंतरच वापरा. सुरक्षिततेचे नियम पाळा.",
        },
    },
    "sticky_traps": {
        "name": {"en": "Yellow sticky traps (10 pcs)", "hi": "पीले चिपचिपे ट्रैप (10 नग)", "ta": "மஞ்சள் ஒட்டும் பொறி (10)", "mr": "पिवळे चिकट सापळे (10)"},
        "price": 99,
        "unit": "pack",
        "kind": "monitoring",
        "use": {
            "en": "Monitor whitefly, aphid and similar flying pests.",
            "hi": "सफेद मक्खी, माहू और उड़ने वाले कीटों की निगरानी के लिए।",
            "ta": "வெள்ளை ஈ மற்றும் அசுவினி போன்ற பூச்சிகளைக் கண்காணிக்க.",
            "mr": "पांढरी माशी आणि मावा यांसारख्या उडणाऱ्या किडींच्या निरीक्षणासाठी.",
        },
    },
    "micronutrient_mix": {
        "name": {"en": "Micronutrient mix 500 g", "hi": "सूक्ष्म पोषक तत्व मिश्रण 500 ग्राम", "ta": "நுண்ணூட்டச்சத்து கலவை 500 கிராம்", "mr": "सूक्ष्म अन्नद्रव्ये मिश्रण 500 ग्रॅम"},
        "price": 175,
        "unit": "pack",
        "kind": "fertilizer",
        "use": {
            "en": "Supports zinc, boron and related deficiencies after soil test.",
            "hi": "मिट्टी परीक्षण के बाद जिंक, बोरॉन और सूक्ष्म पोषक तत्वों की कमी दूर करने में सहायक।",
            "ta": "மண் பரிசோதனைக்கு பின் துத்தநாகம், போரான் குறைபாடுகளை நிவர்த்தி செய்ய உதவும்.",
            "mr": "माती चाचणीनंतर जस्त, बोरॉन आणि संबंधित अन्नद्रव्यांची कमतरता भरून काढण्यासाठी.",
        },
    },
}

DOCTORS = [
    {
        "email": "ananya.patil@agrishield.in",
        "name": "Dr. Ananya Patil",
        "qualification": "Ph.D. Plant Pathology",
        "specialization": "Rice & vegetable fungal diseases",
        "experience": 12,
        "bio": "Plant pathologist working with Maharashtra rice and tomato growers.",
        "languages": "en,hi,mr",
        "fee": 299,
        "days": "Mon,Tue,Wed,Thu,Fri",
        "slots": ["09:00", "10:00", "11:30", "15:00", "16:30"],
    },
    {
        "email": "karthik.r@agrishield.in",
        "name": "Dr. Karthik Raman",
        "qualification": "M.Sc. Agricultural Entomology",
        "specialization": "Pest IPM & cotton/paddy insects",
        "experience": 9,
        "bio": "IPM specialist supporting Tamil Nadu and pan-India pest outbreaks.",
        "languages": "en,ta,hi",
        "fee": 249,
        "days": "Tue,Wed,Thu,Sat",
        "slots": ["10:00", "12:00", "14:00", "17:00"],
    },
    {
        "email": "meera.sharma@agrishield.in",
        "name": "Dr. Meera Sharma",
        "qualification": "M.Sc. Agronomy",
        "specialization": "Nutrient deficiency & soil health",
        "experience": 11,
        "bio": "Helps farmers correct yellowing, NPK imbalance and irrigation stress.",
        "languages": "en,hi",
        "fee": 199,
        "days": "Mon,Wed,Fri,Sat",
        "slots": ["09:30", "11:00", "13:00", "16:00"],
    },
    {
        "email": "rahul.deshmukh@agrishield.in",
        "name": "Dr. Rahul Deshmukh",
        "qualification": "M.Sc. Plant Protection",
        "specialization": "Integrated disease management",
        "experience": 8,
        "bio": "Marathi-first consultations for grape, onion and soybean growers.",
        "languages": "en,mr,hi",
        "fee": 229,
        "days": "Mon,Tue,Thu,Fri,Sun",
        "slots": ["08:30", "11:00", "15:30", "18:00"],
    },
]

CHAT_KB = [
    {
        "keys": ["hello", "hi", "namaste", "vanakkam", "namaskar"],
        "replies": {
            "en": "Namaste. I am AgriShield assistant. Upload a leaf photo, ask about disease, medicines, or book a plant doctor.",
            "hi": "नमस्ते। मैं AgriShield सहायक हूँ। पत्ती का फोटो अपलोड करें, रोग/दवा पूछें, या डॉक्टर परामर्श बुक करें।",
            "ta": "வணக்கம். நான் AgriShield உதவியாளர். இலை படத்தை பதிவேற்றுங்கள், பயிர் பராமரிப்பு அல்லது மருத்துவர் ஆலோசனை பெறுங்கள்.",
            "mr": "नमस्कार. मी AgriShield सहाय्यक आहे. पानाचा फोटो अपलोड करा, रोग/औषध विचारा किंवा डॉक्टरची वेळ बुक करा.",
        },
    },
    {
        "keys": ["disease", "rog", "noyo", "blight", "spot", "yellow", "keet", "pest", "puchi", "bushi"],
        "replies": {
            "en": "For disease help: go to Detect, upload a clear leaf photo in daylight. If confidence is low, book a plant doctor. Do not spray strong chemicals before identification.",
            "hi": "रोग सहायता के लिए: Detect में जाएं और दिन की रोशनी में साफ पत्ती फोटो अपलोड करें। संदेह होने पर डॉक्टर से सलाह लें।",
            "ta": "நோய் உதவிக்கு: Detect பக்கத்தில் பகல் வெளிச்சத்தில் எடுத்த தெளிவான இலை படத்தை பதிவேற்றுங்கள். சந்தேகம் இருந்தால் மருத்துவரை அணுகுங்கள்.",
            "mr": "रोग मदतीसाठी: Detect मध्ये जा आणि दिवसा काढलेला स्पष्ट फोटो अपलोड करा. शंका असल्यास प्लांट डॉक्टरचा सल्ला घ्या.",
        },
    },
    {
        "keys": ["medicine", "dawai", "marundhu", "aushadh", "spray", "fungicide", "neem"],
        "replies": {
            "en": "Medicine is suggested only after a possible disease class is identified. Open Shop to order neem, fungicide or nutrients. Always read the label dose.",
            "hi": "रोग की पहचान के बाद ही दवा सुझाई जाती है। नीम, कवकनाशी या पोषक तत्व ऑर्डर करने के लिए Shop खोलें। लेबल अवश्य पढ़ें।",
            "ta": "நோய் கண்டறிந்த பின்னரே மருந்து பரிந்துரைக்கப்படும். வேப்ப எண்ணெய், பூஞ்சைக் கொல்லி வாங்க Shop செல்லுங்கள்.",
            "mr": "रोग ओळख पटल्यानंतरच औषध सुचवले जाते. Shop मधून कडुनिंब तेल, बुरशीनाशक मागवा आणि लेबल नक्की वाचा.",
        },
    },
    {
        "keys": ["doctor", "expert", "consult", "appointment", "book", "vaidya", "maruthuvar"],
        "replies": {
            "en": "You can search plant doctors, pick a slot and wait for acceptance. After confirmation, use text or voice chat in the consultation room.",
            "hi": "प्लांट डॉक्टर खोजें, उपलब्ध समय चुनें और अनुरोध भेजें। स्वीकृति के बाद परामर्श कक्ष में चैट या वॉइस से बात करें।",
            "ta": "தாவர மருத்துவரைத் தேர்வு செய்து முன்பதிவு செய்யுங்கள். மருத்துவர் ஒப்புதலுக்குப் பின் ஆலோசனை அறையில் பேசலாம்.",
            "mr": "प्लांट डॉक्टर शोधा, वेळ निवडा आणि विनंती पाठवा. मंजुरीनंतर सल्लागार दालनात चॅट किंवा व्हॉईसने बोला.",
        },
    },
    {
        "keys": ["order", "cart", "delivery", "shop", "kharid"],
        "replies": {
            "en": "Add suggested products to cart, enter village address and place the order. You can track status from Orders.",
            "hi": "सुझाए गए उत्पाद कार्ट में डालें, गांव का पता भरें और ऑर्डर दें। Orders पृष्ठ पर स्थिति ट्रैक करें।",
            "ta": "தேவையான பொருட்களை கார்ட்டில் சேர்த்து முகவரியை இட்டு ஆர்டர் செய்யுங்கள். Orders பகுதியில் கண்காணிக்கலாம்.",
            "mr": "सुचवलेली उत्पादने कार्टमध्ये जोडा, पत्ता भरा आणि ऑर्डर द्या. Orders मध्ये स्थिती तपासा.",
        },
    },
    {
        "keys": ["rain", "weather", "risk", "mosam", "mazhai", "paus"],
        "replies": {
            "en": "Open Risk to estimate pest/disease pressure from crop, month, rainfall and humidity. High risk means scout fields daily.",
            "hi": "Risk पृष्ठ पर फसल, महीना, बारिश और नमी से कीट/रोग जोखिम का अनुमान लगाएं। उच्च जोखिम में खेत का प्रतिदिन निरीक्षण करें।",
            "ta": "Risk பக்கத்தில் பயிர், மாதம், மழை, ஈரப்பதத்தை வைத்து அபாயத்தைக் கணிக்கவும். அதிக அபாயம் என்றால் தினமும் கண்காணிக்கவும்.",
            "mr": "Risk मध्ये पीक, महिना, पाऊस व आर्द्रतेवरून रोग धोका तपासा. धोका जास्त असल्यास दररोज शेताची पाहणी करा.",
        },
    },
    {
        "keys": ["soil", "npk", "urea", "fertilizer", "khad"],
        "replies": {
            "en": "Use Crop Advisor with N, P, K values. Balanced NPK plus organic matter is safer than repeating only urea.",
            "hi": "Crop Advisor में N, P, K मान दर्ज करें। केवल यूरिया के बजाय संतुलित NPK और जैविक खाद का उपयोग बेहतर है।",
            "ta": "Crop Advisor-ல் NPK அளவுகளைப் பயன்படுத்துங்கள். வெறும் யூரியாவுக்கு பதில் சமச்சீர் உரம் மற்றும் இயற்கை உரம் சிறந்தது.",
            "mr": "Crop Advisor मध्ये NPK मूल्ये वापरा. केवळ युरियाऐवजी संतुलित खते व सेंद्रिय खतांचा वापर सुरक्षित आहे.",
        },
    },
]


def chatbot_reply(text: str, lang: str) -> str:
    """Return a safe, intent-based response in the farmer's selected language.

    The demo knowledge base deliberately stays limited to verified first-level
    guidance. Uncertain symptoms must be escalated to a plant doctor.
    """
    query = (text or "").casefold()
    intents = {
        "greeting": ("hello", "namaste", "vanakkam", "namaskar", "नमस्ते", "வணக்கம்", "नमस्कार"),
        "disease": ("disease", "blight", "spot", "yellow", "pest", "रोग", "बीमारी", "पत्ती", "நோய்", "இலை", "रोग", "पान"),
        "medicine": ("medicine", "spray", "fungicide", "neem", "दवा", "औषध", "மருந்து", "स्प्रे"),
        "doctor": ("doctor", "expert", "consult", "appointment", "book", "डॉक्टर", "तज्ञ", "सल्ला", "மருத்துவர்", "நிபுணர்"),
        "order": ("order", "cart", "delivery", "shop", "खरीद", "ऑर्डर", "खरेदी", "ஆர்டர்", "வாங்க"),
        "risk": ("risk", "weather", "rain", "जोखिम", "बारिश", "धोका", "पाऊस", "ஆபத்து", "மழை"),
        "soil": ("soil", "npk", "urea", "fertilizer", "मिट्टी", "माती", "खत", "उर्वरक", "மண்", "உரம்"),
    }
    intent = next((name for name, keys in intents.items() if any(key in query for key in keys)), "fallback")
    replies = {
        "en": {
            "greeting": "Namaste. Upload a clear leaf photo, ask about crop care, or book a verified plant doctor.",
            "disease": "Open Detect and upload a clear daylight leaf photo. If confidence is low or symptoms spread, book a plant doctor before using strong chemicals.",
            "medicine": "Medicine suggestions are preliminary. Check the product label and dose, then ask a plant doctor for uncertain or severe cases.",
            "doctor": "Choose a verified doctor, select an available slot and send the request. Voice and text consultation open after the doctor accepts.",
            "order": "Add a suggested product to the cart, provide a complete village address and phone number, then place the order from Shop.",
            "risk": "Use Risk to estimate pressure from crop, month, rainfall and humidity. High risk means inspect the field frequently.",
            "soil": "Use Crop Advisor with soil N, P and K values. A local soil test is still the best basis for fertilizer decisions.",
            "fallback": "I can help with leaf disease, medicines, orders, risk and doctor booking. Try: leaf spots, book doctor, or neem oil.",
        },
        "hi": {
            "greeting": "नमस्ते। पत्ते की साफ तस्वीर अपलोड करें, फसल देखभाल पूछें या सत्यापित प्लांट डॉक्टर बुक करें।",
            "disease": "Detect में दिन की रोशनी में ली गई साफ पत्ती की तस्वीर अपलोड करें। भरोसा कम हो या लक्षण फैल रहे हों तो तेज रसायन डालने से पहले डॉक्टर से सलाह लें।",
            "medicine": "दवा की सलाह प्रारंभिक है। लेबल और मात्रा पढ़ें। गंभीर या अनिश्चित स्थिति में प्लांट डॉक्टर की सलाह लें।",
            "doctor": "सत्यापित डॉक्टर चुनें, उपलब्ध समय चुनें और अनुरोध भेजें। डॉक्टर के स्वीकार करने के बाद वॉइस और टेक्स्ट परामर्श खुलेगा।",
            "order": "सुझाया गया उत्पाद कार्ट में डालें, पूरा गांव का पता और फोन नंबर दें, फिर Shop से ऑर्डर करें।",
            "risk": "Risk में फसल, महीना, बारिश और नमी से जोखिम देखें। अधिक जोखिम में खेत को बार-बार जांचें।",
            "soil": "Crop Advisor में मिट्टी के N, P और K मान भरें। उर्वरक निर्णय के लिए स्थानीय मिट्टी परीक्षण सबसे अच्छा है।",
            "fallback": "मैं पत्ती रोग, दवा, ऑर्डर, जोखिम और डॉक्टर बुकिंग में मदद कर सकता हूँ। लिखें: पत्ती पर धब्बे, डॉक्टर बुक करें या नीम तेल।",
        },
        "ta": {
            "greeting": "வணக்கம். தெளிவான இலைப் படத்தை பதிவேற்றுங்கள், பயிர் பராமரிப்பு கேளுங்கள் அல்லது சரிபார்க்கப்பட்ட தாவர மருத்துவரை முன்பதிவு செய்யுங்கள்.",
            "disease": "Detect பக்கத்தில் பகல் வெளிச்சத்தில் எடுத்த தெளிவான இலைப் படத்தை பதிவேற்றுங்கள். நம்பகத்தன்மை குறைவாக இருந்தால் அல்லது அறிகுறிகள் பரவினால் வலுவான ரசாயனங்களைப் பயன்படுத்தும் முன் மருத்துவரை அணுகுங்கள்.",
            "medicine": "மருந்து பரிந்துரை ஆரம்ப வழிகாட்டுதல் மட்டுமே. லேபிள் மற்றும் அளவைப் படியுங்கள்; கடுமையான அல்லது உறுதியற்ற நிலையில் மருத்துவரிடம் ஆலோசிக்கவும்.",
            "doctor": "சரிபார்க்கப்பட்ட மருத்துவரைத் தேர்ந்தெடுத்து, கிடைக்கும் நேரத்தை தேர்வு செய்து கோரிக்கையை அனுப்புங்கள். மருத்துவர் ஏற்றுக்கொண்ட பிறகு குரல் மற்றும் உரை ஆலோசனை திறக்கும்.",
            "order": "பரிந்துரைக்கப்பட்ட பொருளை கார்ட்டில் சேர்த்து, முழுமையான கிராம முகவரி மற்றும் தொலைபேசி எண்ணைத் தருங்கள்; பிறகு Shop-ல் ஆர்டர் செய்யுங்கள்.",
            "risk": "Risk பக்கத்தில் பயிர், மாதம், மழை மற்றும் ஈரப்பதத்தால் ஏற்படும் அபாயத்தைப் பாருங்கள். அதிக அபாயம் என்றால் வயலை அடிக்கடி பார்வையிடுங்கள்.",
            "soil": "Crop Advisor-ல் மண்ணின் N, P, K மதிப்புகளை உள்ளிடுங்கள். உர முடிவுக்கு உள்ளூர் மண் பரிசோதனையே சிறந்தது.",
            "fallback": "இலை நோய், மருந்து, ஆர்டர், அபாயம் மற்றும் மருத்துவர் முன்பதிவில் உதவ முடியும். இலைப் புள்ளிகள், மருத்துவர் முன்பதிவு அல்லது வேப்பெண்ணெய் எனக் கேளுங்கள்.",
        },
        "mr": {
            "greeting": "नमस्कार. पानाचा स्पष्ट फोटो अपलोड करा, पीक निगेबद्दल विचारा किंवा सत्यापित प्लांट डॉक्टरची वेळ बुक करा.",
            "disease": "Detect मध्ये दिवसा काढलेला स्पष्ट पानाचा फोटो अपलोड करा. विश्वास कमी असेल किंवा लक्षणे पसरत असतील तर तीव्र रसायन वापरण्यापूर्वी डॉक्टरांचा सल्ला घ्या.",
            "medicine": "औषधाची सूचना ही प्राथमिक आहे. लेबल आणि मात्रा वाचा; गंभीर किंवा अनिश्चित परिस्थितीत प्लांट डॉक्टरांचा सल्ला घ्या.",
            "doctor": "सत्यापित डॉक्टर निवडा, उपलब्ध वेळ निवडा आणि विनंती पाठवा. डॉक्टरांनी स्वीकारल्यानंतर व्हॉइस आणि टेक्स्ट सल्ला सुरू होईल.",
            "order": "सुचवलेले उत्पादन कार्टमध्ये टाका, संपूर्ण गावाचा पत्ता व फोन क्रमांक द्या आणि Shop मधून ऑर्डर करा.",
            "risk": "Risk मध्ये पीक, महिना, पाऊस आणि आर्द्रतेवरून धोका पहा. जास्त धोका असेल तर शेताची वारंवार पाहणी करा.",
            "soil": "Crop Advisor मध्ये मातीचे N, P आणि K मूल्ये भरा. खताच्या निर्णयासाठी स्थानिक माती चाचणी सर्वोत्तम आहे.",
            "fallback": "मी पानावरील रोग, औषध, ऑर्डर, धोका आणि डॉक्टर बुकिंगमध्ये मदत करू शकतो. पानावर डाग, डॉक्टर बुक करा किंवा कडुनिंब तेल असे विचारा.",
        },
    }
    language_replies = replies.get(lang, replies["en"])
    return language_replies[intent]


CROPS = ["rice", "wheat", "tomato", "cotton", "onion", "soybean", "grape", "maize"]


SEEDS = {
    "rice_swarna_seed": {
        "name": {"en": "Swarna paddy seed 1 kg", "hi": "स्वर्णा धान बीज 1 किग्रा", "ta": "ஸ்வர்ணா நெல் விதை 1 கிலோ", "mr": "स्वर्णा भात बियाणे 1 किलो"},
        "price": 165, "unit": "1 kg pack", "kind": "seed",
        "use": {"en": "High-yield paddy seed. Choose varieties approved for your district and season."}, "crop": "rice", "season": "Kharif",
    },
    "tomato_hybrid_seed": {
        "name": {"en": "Tomato hybrid seed 10 g", "hi": "टमाटर हाइब्रिड बीज 10 ग्राम", "ta": "தக்காளி கலப்பின விதை 10 கிராம்", "mr": "टोमॅटो हायब्रीड बियाणे 10 ग्रॅम"},
        "price": 240, "unit": "10 g pack", "kind": "seed",
        "use": {"en": "Hybrid tomato seed for nursery raising. Follow local spacing and disease-management guidance."}, "crop": "tomato", "season": "Rabi / summer",
    },
    "maize_seed": {
        "name": {"en": "Maize seed 2 kg", "hi": "मक्का बीज 2 किग्रा", "ta": "மக்காச்சோளம் விதை 2 கிலோ", "mr": "मका बियाणे 2 किलो"},
        "price": 310, "unit": "2 kg pack", "kind": "seed",
        "use": {"en": "Maize seed for suitable rainfed or irrigated fields. Verify local variety suitability before sowing."}, "crop": "maize", "season": "Kharif / Rabi",
    },
}

PRODUCTS = {**MEDICINES, **SEEDS}


GOVERNMENT_SCHEMES = [
    {
        "id": "pm_kisan",
        "category": "finance",
        "name": {
            "en": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
            "hi": "प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)",
            "ta": "பிரதம மந்திரி கிசான் சம்மான் நிதி (PM-KISAN)",
            "mr": "पंतप्रधान किसान सन्मान निधी (PM-KISAN)",
        },
        "ministry": {
            "en": "Ministry of Agriculture & Farmers Welfare",
            "hi": "कृषि एवं किसान कल्याण मंत्रालय",
            "ta": "வேளாண்மை மற்றும் உழவர் நல அமைச்சகம்",
            "mr": "कृषी आणि शेतकरी कल्याण मंत्रालय",
        },
        "subsidy": "₹6,000 / year (Direct Benefit Transfer)",
        "benefit": {
            "en": "Direct income support of ₹6,000 per year in three equal 4-monthly installments of ₹2,000 deposited directly into farmer bank accounts via Aadhaar-linked DBT.",
            "hi": "प्रति वर्ष ₹6,000 की सीधी आय सहायता, 4 महीने के अंतराल पर ₹2,000 की तीन समान किस्तों में आधार से जुड़े बैंक खातों में डीबीटी के माध्यम से।",
            "ta": "ஆண்டுக்கு ₹6,000 நேரடி வருமான ஆதரவு, 4 மாதங்களுக்கு ஒருமுறை ₹2,000 வீதம் 3 தவணைகளில் ஆதார் இணைக்கப்பட்ட வங்கிக் கணக்கில் வரவு வைக்கப்படுகிறது.",
            "mr": "दरवर्षी ₹6,000 थेट उत्पन्न साहाय्य, 4 महिन्यांच्या अंतराने ₹2,000 च्या 3 समान हप्त्यांमध्ये आधार लिंक केलेल्या बँक खात्यात थेट जमा.",
        },
        "eligibility": {
            "en": "All landholder farmer families with cultivable landholding in their names across India (subject to standard exclusion criteria like institutional landholders and income tax payees).",
            "hi": "देश भर के वे सभी किसान परिवार जिनके नाम पर कृषि योग्य भूमि दर्ज है (आयकर दाता और संस्थागत भूमिधारकों को छोड़कर)।",
            "ta": "தங்கள் பெயரில் சாகுபடி நிலம் வைத்துள்ள அனைத்து விவசாய குடும்பங்களும் (வருமான வரி செலுத்துவோர் தவிர).",
            "mr": "स्वतःच्या नावावर शेतजमीन असलेले सर्व शेतकरी कुटुंबे (आयकर भरणारे व संस्थात्मक जमीनधारक वगळून).",
        },
        "documents": ["Aadhaar Card", "Land Khata / Khasra / Patta Record", "Aadhaar-Linked Bank Account", "Active Mobile Number"],
        "portal": "https://pmkisan.gov.in",
        "helpline": "155261 / 011-24300606",
        "icon": "account_balance_wallet",
    },
    {
        "id": "pmfby",
        "category": "insurance",
        "name": {
            "en": "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
            "hi": "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
            "ta": "பிரதம மந்திரி பயிர் காப்பீட்டுத் திட்டம் (PMFBY)",
            "mr": "पंतप्रधान पीक विमा योजना (PMFBY)",
        },
        "ministry": {
            "en": "Ministry of Agriculture & Farmers Welfare",
            "hi": "कृषि एवं किसान कल्याण मंत्रालय",
            "ta": "வேளாண்மை மற்றும் உழவர் நல அமைச்சகம்",
            "mr": "कृषी आणि शेतकरी कल्याण मंत्रालय",
        },
        "subsidy": "Only 1.5% - 2% Farmer Premium (Govt pays the rest)",
        "benefit": {
            "en": "Comprehensive risk insurance covering yield losses due to non-preventable risks (drought, flood, unseasonal rains, pest attacks, post-harvest cyclonic damage). Farmers pay only 2% premium for Kharif, 1.5% for Rabi, and 5% for commercial/horticultural crops.",
            "hi": "अपरिहार्य प्राकृतिक आपदाओं (सूखा, बाढ़, बेमौसम बारिश, कीट प्रकोप) के कारण होने वाले नुकसान के लिए व्यापक बीमा। खरीफ के लिए केवल 2%, रबी के लिए 1.5%, और वाणिज्यिक फसलों के लिए 5% प्रीमियम।",
            "ta": "வறட்சி, வெள்ளம், பூச்சித் தாக்குதல் மற்றும் அறுவடைக்குப் பிந்தைய சேதங்களுக்கு முழுமையான பயிர் காப்பீடு. காரீஃப் பயிர்களுக்கு 2%, ரபி பயிர்களுக்கு 1.5% பிரீமியம் மட்டுமே.",
            "mr": "दुष्काळ, पूर, अवकाळी पाऊस, कीड संसर्ग यासारख्या नैसर्गिक संकटांमुळे होणाऱ्या नुकसानीसाठी सर्वसमावेशक विमा. खरीप पिकांसाठी फक्त २%, रब्बीसाठी १.५% प्रीमियम.",
        },
        "eligibility": {
            "en": "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas are eligible for both loanee and non-loanee categories.",
            "hi": "अधिसूचित क्षेत्रों में अधिसूचित फसल उगाने वाले सभी किसान, जिनमें बटाईदार और काश्तकार किसान भी शामिल हैं।",
            "ta": "அறிவிக்கப்பட்ட பகுதிகளில் அறிவிக்கப்பட்ட பயிர்களை பயிரிடும் அனைத்து விவசாயிகளும் (குத்தகை விவசாயிகள் உட்பட).",
            "mr": "अधिसूचित क्षेत्रातील अधिसूचित पिके घेणारे सर्व शेतकरी, ज्यामध्ये भाडेकरू व वाटेकरी शेतकऱ्यांचा समावेश आहे.",
        },
        "documents": ["Aadhaar Card", "Land Ownership / LPC / Tenancy Agreement", "Sowing Certificate / Village Patwari Report", "Bank Passbook"],
        "portal": "https://pmfby.gov.in",
        "helpline": "14447",
        "icon": "verified_user",
    },
    {
        "id": "kcc",
        "category": "finance",
        "name": {
            "en": "KCC (Kisan Credit Card)",
            "hi": "किसान क्रेडिट कार्ड (KCC)",
            "ta": "கிசான் கடன் அட்டை (KCC)",
            "mr": "किसान क्रेडिट कार्ड (KCC)",
        },
        "ministry": {
            "en": "Ministry of Finance & NABARD / RBI",
            "hi": "वित्त मंत्रालय और नाबार्ड / आरबीआई",
            "ta": "நிதி அமைச்சகம் மற்றும் நபார்ட் / ஆர்பிஐ",
            "mr": "वित्त मंत्रालय आणि नाबार्ड / आरबीआय",
        },
        "subsidy": "Effective 4% p.a. Interest Rate (with Prompt Repayment)",
        "benefit": {
            "en": "Flexible credit up to ₹3 Lakhs without collateral requirement up to ₹1.6 Lakhs. Subsidized interest rate at 7% p.a. with 3% prompt repayment incentive, reducing effective borrowing cost to 4% p.a. for seeds, fertilizers, pesticides, and harvest expenses.",
            "hi": "₹3 लाख तक का आसान कृषि ऋण; ₹1.6 लाख तक बिना बंधक के। समय पर भुगतान पर 3% अतिरिक्त छूट के साथ प्रभावी ब्याज दर केवल 4% वार्षिक।",
            "ta": "₹3 லட்சம் வரை சலுகை வட்டி கடன்; ₹1.6 லட்சம் வரை பிணை தேவையில்லை. சரியான நேரத்தில் திருப்பிச் செலுத்தினால் 4% ஆண்டு வட்டி மட்டுமே.",
            "mr": "₹3 लाखांपर्यंत सवलतीच्या दरात पीक कर्ज; ₹1.6 लाखांपर्यंत तारण विना. वेळेवर परतफेडीवर प्रभावी व्याजदर फक्त ४% वार्षिक.",
        },
        "eligibility": {
            "en": "Individual/joint owner-cultivators, tenant farmers, oral lessees, sharecroppers, self-help groups (SHGs), and joint liability groups (JLGs).",
            "hi": "व्यक्तिगत या संयुक्त किसान, काश्तकार, बटाईदार, स्वयं सहायता समूह (SHGs) और संयुक्त देयता समूह (JLGs)।",
            "ta": "தனிநபர் விவசாயிகள், குத்தகைதாரர்கள், பங்குதாரர்கள், மகளிர் சுயஉதவிக் குழுக்கள் (SHGs).",
            "mr": "वैयक्तिक किंवा संयुक्त शेतकरी, भाडेकरू शेतकरी, वाटेकरी आणि शेतकरी बचत गट (SHGs).",
        },
        "documents": ["Duly filled Bank Application Form", "ID & Address Proof (Aadhaar/Voter ID)", "Land Revenue Record (7/12, 8A, or Patta)", "Passport Photo"],
        "portal": "https://www.myscheme.gov.in/schemes/kcc",
        "helpline": "1800 180 1551",
        "icon": "credit_card",
    },
    {
        "id": "smam",
        "category": "equipment",
        "name": {
            "en": "SMAM (Sub-Mission on Agricultural Mechanization)",
            "hi": "कृषि यंत्रीकरण उप-मिशन (SMAM)",
            "ta": "வேளாண் இயந்திரமயமாக்கல் துணை இயக்கம் (SMAM)",
            "mr": "कृषी यांत्रिकीकरण उप-अभियान (SMAM)",
        },
        "ministry": {
            "en": "Department of Agriculture & Farmers Welfare",
            "hi": "कृषि एवं किसान कल्याण विभाग",
            "ta": "வேளாண்மை மற்றும் உழவர் நலத்துறை",
            "mr": "कृषी आणि शेतकरी कल्याण विभाग",
        },
        "subsidy": "40% to 50% Subsidy on Machinery & Sprayers",
        "benefit": {
            "en": "Direct capital financial subsidy between 40% to 50% for purchasing agricultural equipment (power tillers, tractor attachments, automated sprayers, rotavators, drone sprayers) and up to 80% support for establishing Custom Hiring Centres (CHCs).",
            "hi": "कृषि उपकरण (ट्रैक्टर अटैचमेंट, पावर टिलर, स्प्रेयर, रोटावेटर, कृषि ड्रोन) खरीदने पर 40% से 50% की सीधी वित्तीय सब्सिडी। कस्टम हायरिंग सेंटर के लिए 80% तक सहायता।",
            "ta": "டிராக்டர் கருவிகள், பவர் டில்லர், மருந்து தெளிப்பான், ட்ரோன் ஆகியவற்றை வாங்க 40% முதல் 50% வரை மானியம்.",
            "mr": "ट्रॅक्टर अवजारे, पॉवर टिलर, रोटाव्हेटर, आधुनिक फवारणी यंत्रे आणि ड्रोन खरेदीवर ४०% ते ५०% थेट अनुदान.",
        },
        "eligibility": {
            "en": "Individual farmers with priority given to small & marginal farmers, women farmers, SC/ST categories, and farmer producer organisations (FPOs).",
            "hi": "व्यक्तिगत किसान (छोटे, सीमांत, महिला, एससी/एसटी किसानों और एफपीओ को विशेष प्राथमिकता)।",
            "ta": "சிறு, குறு விவசாயிகள், பெண் விவசாயிகள், எஸ்சி/எஸ்டி பிரிவினர் மற்றும் உழவர் உற்பத்தியாளர் அமைப்புகள் (FPOs).",
            "mr": "अल्प व अत्यल्प भूधारक शेतकरी, महिला शेतकरी, मागासवर्गीय शेतकरी आणि शेतकरी उत्पादक कंपन्या (FPOs).",
        },
        "documents": ["Aadhaar Card", "Land Record (RoR/Patta)", "Bank Passbook Copy", "Official Dealer Quotation / Proforma Invoice"],
        "portal": "https://agrimachinery.nic.in",
        "helpline": "1800-180-1551",
        "icon": "precision_manufacturing",
    },
    {
        "id": "soil_health_card",
        "category": "soil",
        "name": {
            "en": "National Soil Health Card Scheme",
            "hi": "राष्ट्रीय मृदा स्वास्थ्य कार्ड योजना",
            "ta": "தேசிய மண் நல அட்டை திட்டம்",
            "mr": "राष्ट्रीय माती आरोग्य पत्रिका योजना",
        },
        "ministry": {
            "en": "Ministry of Agriculture & Farmers Welfare",
            "hi": "कृषि एवं किसान कल्याण मंत्रालय",
            "ta": "வேளாண்மை மற்றும் உழவர் நல அமைச்சகம்",
            "mr": "कृषी आणि शेतकरी कल्याण मंत्रालय",
        },
        "subsidy": "100% Free Soil Testing & Diagnostic Report",
        "benefit": {
            "en": "Free 12-parameter soil testing (N, P, K, Sulphur, Zinc, Iron, Copper, Manganese, Boron, pH, Electrical Conductivity, Organic Carbon) every 2 years with scientific crop-wise fertilizer dosage recommendations to eliminate fertilizer overspending.",
            "hi": "हर 2 साल में 12 मापदंडों (एन, पी, के, सल्फर, सूक्ष्म पोषक तत्व, पीएच) की निःशुल्क मिट्टी जांच और फसल-वार सटीक उर्वरक सिफारिश ताकि रासायनिक लागत घट सके।",
            "ta": "மண்ணின் 12 ஊட்டச்சத்து அளவுருக்கள் (NPK, pH, நுண்ணூட்டச்சத்துக்கள்) அடங்கிய இலவச மண் நல அட்டை மற்றும் பயிர் வாரியான உரப் பரிந்துரை.",
            "mr": "दर २ वर्षांनी मोफत १२ घटकांची (NPK, सूक्ष्म अन्नद्रव्ये, सामू) माती परीक्षण पत्रिका आणि खतांच्या बचतीसाठी शास्त्रोक्त शिफारसी.",
        },
        "eligibility": {
            "en": "All operational agricultural landholders across all Indian states and Union Territories.",
            "hi": "सभी राज्यों और केंद्र शासित प्रदेशों के सभी कृषि भूमिधारक किसान।",
            "ta": "அனைத்து இந்திய மாநிலங்களிலும் உள்ள அனைத்து விவசாயிகளும்.",
            "mr": "सर्व राज्यातील शेतकरी ज्यांच्याकडे लागवडीखालील जमीन आहे.",
        },
        "documents": ["Farmer ID / Aadhaar", "Plot Survey / Khasra Number for GPS Geo-tagging of sample"],
        "portal": "https://soilhealth.dac.gov.in",
        "helpline": "011-23382012",
        "icon": "eco",
    },
    {
        "id": "pmksy",
        "category": "irrigation",
        "name": {
            "en": "PMKSY (Per Drop More Crop - Micro Irrigation)",
            "hi": "प्रधानमंत्री कृषि सिंचाई योजना (प्रति बूंद अधिक फसल)",
            "ta": "பிரதம மந்திரி கிருஷி சிஞ்சாயி யோஜனா (நுண் பாசனம்)",
            "mr": "पंतप्रधान कृषी सिंचन योजना (प्रति थेंब अधिक पीक)",
        },
        "ministry": {
            "en": "Ministry of Agriculture & Ministry of Jal Shakti",
            "hi": "कृषि मंत्रालय एवं जल शक्ति मंत्रालय",
            "ta": "வேளாண்மை மற்றும் ஜல் சக்தி அமைச்சகம்",
            "mr": "कृषी मंत्रालय आणि जलशक्ती मंत्रालय",
        },
        "subsidy": "45% to 55% Subsidy for Drip & Sprinkler Systems",
        "benefit": {
            "en": "Financial subsidy of 55% for small & marginal farmers and 45% for other farmers on the installation of precision drip and micro-sprinkler irrigation systems, saving up to 50% water while increasing yield by 30-40%.",
            "hi": "ड्रिप (टपक) और स्प्रिंकलर (फव्वारा) सिंचाई प्रणाली लगाने पर छोटे और सीमांत किसानों को 55% और अन्य किसानों को 45% सरकारी अनुदान।",
            "ta": "சொட்டு நீர் மற்றும் தெளிப்பு நீர் பாசன அமைப்புகளை நிறுவ சிறு/குறு விவசாயிகளுக்கு 55% மற்றும் இதர விவசாயிகளுக்கு 45% மானியம்.",
            "mr": "ठिबक आणि तुषार सिंचन बसवण्यासाठी अल्प व अत्यल्प भूधारक शेतकऱ्यांना ५५% तर इतर शेतकऱ्यांना ४५% शासकीय अनुदान.",
        },
        "eligibility": {
            "en": "All farmers with agricultural land having an assured water source (well, borewell, canal, farm pond, or community lifting).",
            "hi": "वे सभी किसान जिनके पास कृषि योग्य भूमि और सुनिश्चित जल स्रोत (बोरवेल, कुआं, नहर, तालाब) उपलब्ध है।",
            "ta": "உறுதியான நீர் ஆதாரம் (கிணறு, ஆழ்துளை கிணறு, குளம்) கொண்ட சாகுபடி நிலமுடைய அனைத்து விவசாயிகளும்.",
            "mr": "जमीन आणि पाण्याचा खात्रीशीर स्त्रोत (विहीर, कूपनलिका, शेततळे) उपलब्ध असलेले सर्व शेतकरी.",
        },
        "documents": ["Aadhaar Card", "7/12, 8A / Land Title Document", "Water Source Certificate / Electricity Bill", "Bank Passbook"],
        "portal": "https://pmksy.gov.in",
        "helpline": "1800 180 1551",
        "icon": "water_drop",
    },
    {
        "id": "pm_kusum",
        "category": "solar",
        "name": {
            "en": "PM-KUSUM (Solar Agricultural Pumps Scheme)",
            "hi": "प्रधानमंत्री कुसुम योजना (सोलर कृषि पंप)",
            "ta": "பிரதம மந்திரி குசும் திட்டம் (சூரிய மின்சார பம்பு)",
            "mr": "पंतप्रधान कुसुम योजना (सौर कृषी पंप)",
        },
        "ministry": {
            "en": "Ministry of New and Renewable Energy (MNRE)",
            "hi": "नवीन और नवीकरणीय ऊर्जा मंत्रालय",
            "ta": "புதிய மற்றும் புதுப்பிக்கத்தக்க எரிசக்தி அமைச்சகம்",
            "mr": "नवीन आणि नवीकरणीय ऊर्जा मंत्रालय",
        },
        "subsidy": "Up to 60% Govt Subsidy + 30% Bank Loan Support",
        "benefit": {
            "en": "Subsidized installation of standalone off-grid solar water pumps (3 HP to 10 HP) and solarization of existing grid-connected agriculture pumps. Farmers contribute only 10% of total pump cost, gaining day-time free electricity for irrigation.",
            "hi": "सोलर कृषि पंप (3 HP से 10 HP) लगाने के लिए 60% तक सरकारी सब्सिडी (केंद्र + राज्य) और 30% बैंक ऋण। किसान को केवल 10% लागत देनी होती है।",
            "ta": "சூரிய சக்தி வேளாண் பம்புகளை அமைக்க 60% வரை அரசு மானியம். விவசாயி 10% மட்டுமே செலுத்த வேண்டும்; பகலில் தடையற்ற மின்சாரம்.",
            "mr": "सौर कृषी पंप (३ ते १० एचपी) बसवण्यासाठी ६०% पर्यंत सरकारी अनुदान आणि ३०% कर्ज. शेतकऱ्याला फक्त १०% रक्कम भरावी लागते.",
        },
        "eligibility": {
            "en": "Individual farmers, groups of farmers, cooperatives, panchayats, and water user associations having cultivable land and water source.",
            "hi": "व्यक्तिगत किसान, किसान समूह, पंचायत और जल उपयोगकर्ता संघ जिनके पास कृषि योग्य भूमि और जल स्रोत है।",
            "ta": "விவசாயிகள், உழவர் குழுக்கள் மற்றும் பஞ்சாயத்துகள்.",
            "mr": "वैयक्तिक शेतकरी, शेतकरी गट, सहकारी संस्था आणि ग्रामपंचायती.",
        },
        "documents": ["Aadhaar Card", "Land 7/12 & 8A / Land Registry", "Source of Water Affidavit", "Bank Account Details"],
        "portal": "https://pmkusum.mnre.gov.in",
        "helpline": "011-24360707",
        "icon": "solar_power",
    },
]


CROP_RECOVERY_PROTOCOLS = {
    "fungal_blight": {
        "title": "Fungal Blight 14-Day Recovery Plan",
        "target_disease": "Fungal blight / leaf spot",
        "stages": [
            {
                "day": 1,
                "stage_name": "Detection & Physical Sanitation",
                "badge": "Immediate Action",
                "actions": [
                    "Isolate severely infected lower leaves displaying brown spots and safely bury or burn away from field.",
                    "Switch off overhead sprinkler irrigation immediately to avoid spore dissemination; switch to drip or furrow irrigation.",
                    "Sanitize pruning shears with 70% alcohol or 1% bleach solution between plant rows.",
                ],
                "spray_advice": "No chemical spray on Day 1 — complete mechanical sanitation and allow canopy to dry out.",
                "expected_outcome": "Spore transfer arrested; baseline lesion count documented.",
            },
            {
                "day": 3,
                "stage_name": "Targeted Anti-Fungal Treatment",
                "badge": "Critical Treatment",
                "actions": [
                    "Inspect morning weather forecast (ensure >6 hours rain-free window and wind <12 km/h).",
                    "Foliar spray Mancozeb 75% WP (2.5 g/L) or Copper Oxychloride 50% WP (3.0 g/L), covering leaf undersides.",
                    "For organic certified plots: Apply Cold-Pressed Neem Oil (1500 ppm at 5 ml/L water with sticker).",
                ],
                "spray_advice": "Spray between 06:30 AM - 08:30 AM once night dew has evaporated. Wear protective gloves and mask.",
                "expected_outcome": "Fungal hyphae penetration halted; protective barrier established.",
            },
            {
                "day": 7,
                "stage_name": "Lesion Arrest & Foliar Nutrition",
                "badge": "Mid-Term Evaluation",
                "actions": [
                    "Inspect lesion borders: active yellow/water-soaked halos should have dried into defined brown rings.",
                    "Apply foliar potassium silicate or 19:19:19 NPK booster (3 g/L) to strengthen plant cell walls.",
                    "Check soil moisture and ensure no standing water around crop root crowns.",
                ],
                "spray_advice": "If spots are still spreading rapidly, follow up with systemic Azoxystrobin or consult a plant doctor.",
                "expected_outcome": "No new lesions on upper canopy leaves; existing spots hardened and dormant.",
            },
            {
                "day": 14,
                "stage_name": "Tissue Regeneration & Full Clearance",
                "badge": "Recovery Milestone",
                "actions": [
                    "Inspect newly emerged apical leaves and shoots — they should be bright green and free of lesions.",
                    "Take a follow-up leaf photo on AgriShield Detect to verify healthy AI classification (>90% confidence).",
                    "Apply bio-fertilizer (Pseudomonas fluorescens 10 g/L) as a prophylactic protective shield.",
                ],
                "spray_advice": "Maintain normal crop management; mark plot recovered in My Plants dashboard.",
                "expected_outcome": "Full vegetative recovery; photosynthesizing canopy restored.",
            },
        ],
    },
    "bacterial_blight": {
        "title": "Bacterial Blight 14-Day Recovery Plan",
        "target_disease": "Bacterial leaf blight",
        "stages": [
            {
                "day": 1,
                "stage_name": "Containment & Drainage Control",
                "badge": "Containment",
                "actions": [
                    "Drain excess standing water from field to lower micro-climate humidity.",
                    "Suspend nitrogen top-dressing immediately (excess N promotes bacterial multiplying).",
                    "Avoid touching or pruning wet plants; workers should not move from infected to healthy rows.",
                ],
                "spray_advice": "Do not spray plain water or foliar fertilizers while leaf surface is wet.",
                "expected_outcome": "Bacterial ooze spread contained; field entry restricted.",
            },
            {
                "day": 3,
                "stage_name": "Bactericide & Copper Application",
                "badge": "Bacterial Treatment",
                "actions": [
                    "Spray Copper Hydroxide (2 g/L) combined with Streptomycin Sulphate + Tetracycline (Agrimycin / Plantomycin at 0.5 g/L).",
                    "For organic management: Spray fermented butter-milk (chaas 50 ml/L) mixed with fresh neem leaf extract.",
                    "Ensure thorough coverage of both upper and lower leaf surfaces.",
                ],
                "spray_advice": "Spray during calm morning hours. Verify label instructions for crop-specific waiting period.",
                "expected_outcome": "Bacterial populations drastically reduced on foliage.",
            },
            {
                "day": 7,
                "stage_name": "Halting of Water-Soaked Streaks",
                "badge": "Progress Review",
                "actions": [
                    "Check leaf edges: water-soaked wavy lesions should dry up and turn pale straw-colored.",
                    "Apply light Muriate of Potash (MOP) to induce systemic acquired resistance in plant tissue.",
                    "Re-inspect border rows for any bacterial seepage.",
                ],
                "spray_advice": "Repeat copper spray at 50% dose only if damp weather or strong winds continue.",
                "expected_outcome": "Lesions dry; bacterial ooze completely arrested.",
            },
            {
                "day": 14,
                "stage_name": "Canopy Renewal & Immunity Shield",
                "badge": "Restoration",
                "actions": [
                    "Confirm newly unfurled leaves show no edge-scorching or translucent streaks.",
                    "Incorporate Trichoderma harzianum and Bacillus subtilis into root zone soil.",
                    "Update crop health status to Stable in AgriShield dashboard.",
                ],
                "spray_advice": "Standard preventative schedule resumed. Maintain balanced N:P:K 2:1:1.",
                "expected_outcome": "Plant resumes vigorous vegetative flush.",
            },
        ],
    },
    "yellow_deficiency": {
        "title": "Nutrient Stress & Chlorosis 14-Day Restoration",
        "target_disease": "Yellowing / nutrient stress",
        "stages": [
            {
                "day": 1,
                "stage_name": "Root Zone & Drainage Audit",
                "badge": "Diagnosis",
                "actions": [
                    "Check root zone for waterlogging or soil compaction restricting oxygen uptake.",
                    "Test irrigation water electrical conductivity (EC) and soil pH if portable meter available.",
                    "Distinguish between older leaf chlorosis (Nitrogen/Magnesium) vs new leaf chlorosis (Iron/Zinc).",
                ],
                "spray_advice": "Aerate compacted furrows; let root zone breathe before adding liquid nutrients.",
                "expected_outcome": "Root asphyxiation identified and relieved.",
            },
            {
                "day": 3,
                "stage_name": "Micronutrient & Nitrogen Foliar Correction",
                "badge": "Correction Spray",
                "actions": [
                    "Spray Chelated Multi-Micronutrient formulation (Grade II / Zinc-EDTA + Ferrous Sulphate at 2 g/L).",
                    "Add Urea (10 g/L) or Seaweed Extract (2 ml/L) to foliar spray mix for rapid stomatal absorption.",
                    "Apply vermicompost or well-decomposed FYM (1 kg per plant basin) to root zone.",
                ],
                "spray_advice": "Apply early morning or late afternoon when stomata are open for maximum nutrient intake.",
                "expected_outcome": "Nutrient uptake initiates within 24-48 hours.",
            },
            {
                "day": 7,
                "stage_name": "Chlorophyll Regrowth Inspection",
                "badge": "Color Recovery",
                "actions": [
                    "Observe leaf color shift: pale chlorotic veins should show darkening green pigmentation.",
                    "Check that new emerging leaves exhibit normal deep green chlorophyll levels.",
                    "Maintain light, regular irrigation without flooding.",
                ],
                "spray_advice": "Optional secondary booster: Magnesium Sulphate (Epsom salt at 5 g/L) if interveinal chlorosis persists.",
                "expected_outcome": "Leaf chlorophyll index increases by 30-50%.",
            },
            {
                "day": 14,
                "stage_name": "Full Health & Photosynthetic Vitality",
                "badge": "Normal Health",
                "actions": [
                    "Take updated leaf photo with AgriShield to verify Healthy Leaf AI status.",
                    "Top-dress balanced bio-NPK consortia to ensure sustained soil fertility.",
                    "Record recovery log in My Plants for future seasonal planning.",
                ],
                "spray_advice": "Return to regular fertilization schedule as advised by Soil Health Card.",
                "expected_outcome": "Canopy is lush green; full photosynthetic capacity restored.",
            },
        ],
    },
    "healthy": {
        "title": "Healthy Crop Preventive Maintenance Protocol",
        "target_disease": "Healthy leaf",
        "stages": [
            {
                "day": 1,
                "stage_name": "Baseline Health Recording",
                "badge": "Optimal Status",
                "actions": [
                    "Log healthy plot status and leaf picture in My Plants inventory.",
                    "Check field periphery for early weed or pest vectors.",
                ],
                "spray_advice": "No remedial spray required.",
                "expected_outcome": "Baseline health established.",
            },
            {
                "day": 7,
                "stage_name": "Prophylactic Plant Shield",
                "badge": "Preventive Shield",
                "actions": [
                    "Apply preventive botanical spray (Neem oil 3 ml/L or Panchagavya 30 ml/L).",
                    "Check AgriShield Weather-Based Risk forecast for upcoming rain or humidity spikes.",
                ],
                "spray_advice": "Preventive bio-shield prevents airborne fungal spores from settling.",
                "expected_outcome": "Robust surface immunity maintained.",
            },
            {
                "day": 14,
                "stage_name": "Bi-Weekly Health Audit",
                "badge": "Routine Check",
                "actions": [
                    "Re-scan sample leaves to ensure continued disease-free status.",
                    "Maintain balanced irrigation and optimal soil moisture.",
                ],
                "spray_advice": "Maintain standard agronomic practices.",
                "expected_outcome": "High productivity trajectory sustained.",
            },
        ],
    },
}