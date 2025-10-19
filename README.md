# 🚀 AI IDE - Intelligent Development Environment

<div align="center">

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**بيئة تطوير متكاملة مدعومة بالذكاء الاصطناعي | AI-Powered Integrated Development Environment**

[English](#english) | [العربية](#arabic)

</div>

---

<div id="arabic" dir="rtl">

## 📋 نظرة عامة

AI IDE هو محرر أكواد ويب متطور مدعوم بالذكاء الاصطناعي من Google Gemini. يوفر بيئة تطوير احترافية مع واجهة Glassmorphism جميلة ودعم كامل للغتين العربية والإنجليزية.

## ✨ المميزات الرئيسية

### 🎨 واجهة المستخدم
- **تصميم Glassmorphism** - واجهة عصرية بتأثيرات زجاجية شفافة
- **الوضع الداكن/الفاتح** - تبديل سهل بين الأوضاع مع حفظ التفضيلات
- **دعم RTL/LTR** - تبديل كامل بين العربية والإنجليزية
- **تصميم متجاوب** - يعمل على جميع أحجام الشاشات

### 💻 محرر الأكواد
- **Monaco Editor** - نفس محرر VS Code الاحترافي
- **تلوين الأكواد** - دعم Python مع syntax highlighting
- **الإكمال التلقائي** - اقتراحات ذكية أثناء الكتابة
- **أرقام الأسطر** - وminimap للتنقل السريع

### 🤖 ميزات الذكاء الاصطناعي
- **توليد الأكواد** - اكتب وصفاً واحصل على كود جاهز
- **فحص وإصلاح** - اكتشاف وإصلاح الأخطاء تلقائياً
- **تحسين الكود** - جعل الكود أكثر كفاءة وقابلية للقراءة
- **مساعد دردشة** - اسأل أي سؤال برمجي واحصل على إجابة فورية

### ⚡ تنفيذ الأكواد
- **تشغيل Python** - تنفيذ آمن في بيئة معزولة
- **مدخلات وقت التشغيل** - إدخال البيانات أثناء التنفيذ
- **وحدة إخراج واضحة** - عرض النتائج والأخطاء بشكل منظم

## 🛠️ التثبيت والإعداد

### المتطلبات الأساسية
- Python 3.8 أو أحدث
- pip (مدير حزم Python)
- Git

### خطوات التثبيت

1. **استنساخ المستودع**
```bash
git clone https://github.com/jasonfavod-hub/ai-ide-project.git
cd ai-ide-project
```

2. **إنشاء بيئة افتراضية**
```bash
python -m venv venv

# على Windows
venv\Scripts\activate

# على Linux/Mac
source venv/bin/activate
```

3. **تثبيت المكتبات المطلوبة**
```bash
pip install -r requirements.txt
```

4. **إعداد مفتاح Gemini API**

أنشئ ملف `.env` في المجلد الرئيسي:
```bash
GEMINI_API_KEY=your_api_key_here
```

**للحصول على مفتاح API:**
- اذهب إلى [Google AI Studio](https://makersuite.google.com/app/apikey)
- سجل دخول بحساب Google
- انقر على "Create API Key"
- انسخ المفتاح والصقه في ملف `.env`

5. **تشغيل التطبيق**
```bash
python app.py
```

6. **افتح المتصفح**
```
http://127.0.0.1:5000
```

## 📁 هيكل المشروع

```
ai-ide-project/
├── app.py                 # خادم Flask الرئيسي
├── requirements.txt       # المكتبات المطلوبة
├── .env                   # متغيرات البيئة (مفتاح API)
├── .gitignore            # ملفات يتم تجاهلها من Git
├── Procfile              # للنشر على Heroku
├── templates/
│   └── index.html        # واجهة المستخدم الرئيسية
├── static/
│   ├── style.css         # تنسيقات Glassmorphism
│   ├── script.js         # منطق JavaScript
│   └── images/           # الصور والأيقونات
└── README.md             # هذا الملف
```

## 🎯 كيفية الاستخدام

### 1. كتابة وتشغيل الكود
1. اكتب كود Python في المحرر
2. (اختياري) أدخل مدخلات في حقل "Runtime Inputs"
3. اضغط زر "▶ Run"
4. شاهد النتائج في "Output Console"

### 2. استخدام الذكاء الاصطناعي

#### توليد كود جديد:
1. اضغط "Generate Code"
2. اكتب وصفاً لما تريد (مثال: "اكتب دالة لحساب الأعداد الأولية")
3. اضغط "Send"
4. سيظهر الكود المولد في "AI Response"
5. يمكنك نسخه إلى المحرر

#### فحص وإصلاح الكود:
1. اكتب أو الصق كود في المحرر
2. اضغط "Check & Fix"
3. اكتب ملاحظة (اختياري)
4. اضغط "Send"
5. سيظهر الكود المصحح

#### تحسين الكود:
1. اكتب كود في المحرر
2. اضغط "Improve Code"
3. اضغط "Send"
4. سيظهر الكود المحسّن مع شرح التحسينات

### 3. اختصارات لوحة المفاتيح
- `Ctrl/Cmd + Enter` - تشغيل الكود
- `Ctrl/Cmd + Shift + K` - مسح الكود
- `Ctrl/Cmd + Shift + L` - مسح الإخراج

## 🔧 استكشاف الأخطاء

### المشكلة: "GEMINI_API_KEY is not set"
**الحل:**
- تأكد من وجود ملف `.env` في المجلد الرئيسي
- تأكد من أن المفتاح صحيح ومكتوب بدون مسافات
- أعد تشغيل التطبيق

### المشكلة: خطأ 400 من Gemini API
**الحل:**
- تحقق من صلاحية مفتاح API
- تأكد من أن لديك رصيد كافٍ في حساب Google Cloud
- راجع سجل الأخطاء في console

### المشكلة: الكود لا يعمل
**الحل:**
- تأكد من تثبيت جميع المكتبات: `pip install -r requirements.txt`
- تأكد من تفعيل البيئة الافتراضية
- تحقق من نسخة Python: `python --version` (يجب أن تكون 3.8+)

## 🚀 النشر على الإنترنت

### Heroku
```bash
# تسجيل الدخول
heroku login

# إنشاء تطبيق
heroku create your-app-name

# إضافة متغيرات البيئة
heroku config:set GEMINI_API_KEY=your_api_key

# رفع الكود
git push heroku main
```

### Render / Railway
- ارفع المشروع على GitHub
- اربط المستودع بـ Render/Railway
- أضف متغير البيئة `GEMINI_API_KEY`
- انشر التطبيق

## 🤝 المساهمة

نرحب بالمساهمات! إذا كان لديك اقتراح أو وجدت خطأ:

1. Fork المستودع
2. أنشئ فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى الفرع (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## 📝 الترخيص

هذا المشروع مرخص تحت MIT License - انظر ملف LICENSE للتفاصيل.

## 👨‍💻 المطور

**Jason Favod**
- GitHub: [@jasonfavod-hub](https://github.com/jasonfavod-hub)
- المستودع: [ai-ide-project](https://github.com/jasonfavod-hub/ai-ide-project)

## 🙏 شكر وتقدير

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - محرر الأكواد
- [Google Gemini](https://deepmind.google/technologies/gemini/) - الذكاء الاصطناعي
- [Flask](https://flask.palletsprojects.com/) - إطار العمل

---

</div>

<div id="english">

## 📋 Overview

AI IDE is an advanced web-based code editor powered by Google Gemini AI. It provides a professional development environment with a beautiful Glassmorphism interface and full support for both Arabic and English languages.

## ✨ Key Features

### 🎨 User Interface
- **Glassmorphism Design** - Modern interface with translucent glass effects
- **Dark/Light Mode** - Easy toggle with preference saving
- **RTL/LTR Support** - Full bidirectional text support
- **Responsive Design** - Works on all screen sizes

### 💻 Code Editor
- **Monaco Editor** - The same professional editor as VS Code
- **Syntax Highlighting** - Python support with color coding
- **Auto-completion** - Smart suggestions while typing
- **Line Numbers** - With minimap for quick navigation

### 🤖 AI Features
- **Code Generation** - Describe what you want and get ready code
- **Check & Fix** - Automatically detect and fix errors
- **Code Improvement** - Make code more efficient and readable
- **Chat Assistant** - Ask any programming question

### ⚡ Code Execution
- **Run Python** - Safe execution in isolated environment
- **Runtime Inputs** - Provide data during execution
- **Clear Output Console** - Organized display of results and errors

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Git

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/jasonfavod-hub/ai-ide-project.git
cd ai-ide-project
```

2. **Create virtual environment**
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On Linux/Mac
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Setup Gemini API Key**

Create a `.env` file in the root directory:
```bash
GEMINI_API_KEY=your_api_key_here
```

**To get an API key:**
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Sign in with your Google account
- Click "Create API Key"
- Copy and paste it in the `.env` file

5. **Run the application**
```bash
python app.py
```

6. **Open browser**
```
http://127.0.0.1:5000
```

## 🎯 Usage

### 1. Write and Run Code
1. Write Python code in the editor
2. (Optional) Enter inputs in "Runtime Inputs"
3. Click "▶ Run" button
4. View results in "Output Console"

### 2. Use AI Features

#### Generate New Code:
1. Click "Generate Code"
2. Describe what you want (e.g., "Write a function to calculate prime numbers")
3. Click "Send"
4. Generated code appears in "AI Response"
5. Copy it to the editor

#### Check and Fix Code:
1. Write or paste code in the editor
2. Click "Check & Fix"
3. Add a note (optional)
4. Click "Send"
5. Fixed code will appear

#### Improve Code:
1. Write code in the editor
2. Click "Improve Code"
3. Click "Send"
4. Improved code with explanations will appear

### 3. Keyboard Shortcuts
- `Ctrl/Cmd + Enter` - Run code
- `Ctrl/Cmd + Shift + K` - Clear code
- `Ctrl/Cmd + Shift + L` - Clear output

## 🔧 Troubleshooting

### Issue: "GEMINI_API_KEY is not set"
**Solution:**
- Ensure `.env` file exists in root directory
- Verify the key is correct without spaces
- Restart the application

### Issue: 400 Error from Gemini API
**Solution:**
- Check API key validity
- Ensure you have sufficient quota in Google Cloud
- Review error logs in console

### Issue: Code doesn't work
**Solution:**
- Install all dependencies: `pip install -r requirements.txt`
- Activate virtual environment
- Check Python version: `python --version` (must be 3.8+)

## 🚀 Deployment

### Heroku
```bash
# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set GEMINI_API_KEY=your_api_key

# Deploy
git push heroku main
```

### Render / Railway
- Push project to GitHub
- Connect repository to Render/Railway
- Add `GEMINI_API_KEY` environment variable
- Deploy the application

## 🤝 Contributing

Contributions are welcome! If you have a suggestion or found a bug:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👨‍💻 Developer

**Jason Favod**
- GitHub: [@jasonfavod-hub](https://github.com/jasonfavod-hub)
- Repository: [ai-ide-project](https://github.com/jasonfavod-hub/ai-ide-project)

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI engine
- [Flask](https://flask.palletsprojects.com/) - Web framework

---

<div align="center">

**Made with ❤️ by Jason Favod**

⭐ Star this repo if you find it helpful!

</div>

</div>
