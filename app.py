import os
import subprocess
import json
from flask import Flask, render_template, request, jsonify
import requests # لإجراء طلبات HTTP إلى Gemini API
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- إعدادات Gemini API ---
# يرجى استبدال "YOUR_API_KEY_HERE" بمفتاح Gemini API الخاص بك. يفضل استخدام متغيرات البيئة.
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_API_KEY_HERE")
GEMINI_MODEL = "gemini-2.5-flash" 
API_URL = "https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODEL + ":generateContent"

# رسالة تحذير في حال عدم تعيين المفتاح
if GEMINI_API_KEY == "YOUR_API_KEY_HERE" or not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY is not set. AI functionality will not work.")

# --- إعداد Flask (الإعداد القياسي) ---
# Flask سيبحث تلقائياً عن القوالب في مجلد 'templates' وعن الملفات الثابتة في مجلد 'static'
app = Flask(__name__)


# ----------------------------------------------------------------------
# 1. الواجهة الرئيسية (Main Route)
# ----------------------------------------------------------------------

@app.route('/')
def index():
    """
    يقوم بعرض ملف HTML الرئيسي للصفحة باستخدام طريقة Flask القياسية.
    يتوقع أن يكون 'index.html' داخل مجلد 'templates'.
    """
    try:
        # استخدام render_template القياسية: هذا هو الإصلاح لخطأ TemplateNotFound
        return render_template('index.html')
    except Exception as e:
        # إرجاع رسالة خطأ واضحة إذا لم يتم العثور على القالب
        return f"Error rendering template: {e}. Ensure 'index.html' is inside the 'templates' folder.", 500


# ----------------------------------------------------------------------
# 2. واجهة تنفيذ كود Python (API: /api/code/run_python)
# ----------------------------------------------------------------------

@app.route('/api/code/run_python', methods=['POST'])
def run_python_code():
    """
    تتلقى كود Python ومدخلات المستخدم، وتقوم بتنفيذه في بيئة معزولة (subprocess).
    """
    data = request.get_json()
    code = data.get('code', '')
    # المدخلات تأتي كقائمة من الأسطر
    inputs = data.get('inputs', [])
    
    # دمج قائمة المدخلات في نص واحد بفواصل أسطر
    input_str = '\n'.join(inputs) 
    
    try:
        # نستخدم subprocess لتشغيل الكود في مفسر Python منفصل
        process = subprocess.run(
            ['python', '-c', code],  # تشغيل Python مع الكود كـ string
            input=input_str,          # تمرير مدخلات المستخدم
            capture_output=True,      # لالتقاط المخرجات والأخطاء
            text=True,                # للتعامل مع المخرجات كـ نص
            timeout=5                 # حد زمني للتنفيذ (5 ثوانٍ)
        )

        if process.returncode == 0:
            # نجاح التنفيذ
            output = process.stdout
            return jsonify({'output': output.strip()}), 200
        else:
            # فشل التنفيذ (خطأ في الكود)
            error = process.stderr
            return jsonify({'error': error.strip()}), 400

    except subprocess.TimeoutExpired:
        return jsonify({'error': 'Execution timeout: Code took too long to run (5s limit).'}), 408
    except Exception as e:
        return jsonify({'error': f'An unexpected error occurred during execution: {str(e)}'}), 500


# ----------------------------------------------------------------------
# 3. واجهة الذكاء الاصطناعي (API: /api/ai/generate)
# ----------------------------------------------------------------------

def call_gemini_api(system_instruction, user_prompt):
    """
    وظيفة مساعدة لإرسال طلب إلى Gemini API.
    """
    if GEMINI_API_KEY == "YOUR_API_KEY_HERE" or not GEMINI_API_KEY:
        return {"error": "API Key is missing or invalid. Please set GEMINI_API_KEY."}, 500

    # بناء حمولة (Payload) الطلب
    payload = {
        "contents": [{"parts": [{"text": user_prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 2048
        },
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        }
    }
    
    headers = {
        "Content-Type": "application/json"
    }

    try:
        # إرسال طلب POST إلى Gemini API
        response = requests.post(
            f"{API_URL}?key={GEMINI_API_KEY}", 
            headers=headers, 
            json=payload,
            timeout=30 # مهلة 30 ثانية لاستجابة AI
        )
        
        # Enhanced error logging: Log exact error from Google API
        if response.status_code >= 400:
            error_details = response.text
            app.logger.error(f"Gemini API Error [{response.status_code}]: {error_details}")
            try:
                error_json = response.json()
                error_message = error_json.get('error', {}).get('message', error_details)
            except:
                error_message = error_details
            return {"error": f"API Error {response.status_code}: {error_message}"}, response.status_code
        
        response.raise_for_status()  # رفع خطأ إذا كان رمز الحالة >= 400

        # معالجة استجابة Gemini
        result = response.json()
        
        # استخراج النص
        candidate = result.get('candidates', [{}])[0]
        generated_text = candidate.get('content', {}).get('parts', [{}])[0].get('text', 'No text generated.')
        
        return {"text": generated_text}, 200

    except requests.exceptions.RequestException as e:
        app.logger.error(f"Gemini API Request Failed: {e}")
        return {"error": f"API request failed: {str(e)}"}, 500
    except Exception as e:
        app.logger.error(f"Error processing Gemini response: {e}")
        return {"error": f"Error processing AI response: {str(e)}"}, 500


@app.route('/api/ai/generate', methods=['POST'])
def ai_generate_content():
    """
    واجهة موحدة للتعامل مع جميع طلبات AI (توليد، إصلاح، تحسين، دردشة).
    """
    data = request.get_json()
    prompt = data.get('prompt', '')
    action = data.get('action', 'chat_response') # نوع الإجراء المطلوب

    # بناء تعليمات النظام (System Instruction) بناءً على الإجراء
    if action == 'generate_code':
        system_prompt = (
            "أنت مساعد برمجة Python خبير. مهمتك هي كتابة كود Python فقط استجابة لطلب المستخدم. "
            "لا تقم بإضافة أي نص تفسيري أو شرح أو مقدمات أو خاتمات. يجب أن يكون الناتج كود Python نظيف وجاهز للتشغيل. "
            "إذا كان الطلب مكتوبًا بالعربية، قم بالرد بالكود المكتوب بالإنجليزية مع تعليقات عربية إن أمكن."
        )
        user_prompt = f"الطلب: اكتب كود Python للوظيفة التالية:\n---\n{prompt}\n---"
    
    elif action == 'check_and_fix':
        system_prompt = (
            "أنت خبير في تصحيح أخطاء Python. مهمتك هي فحص الكود المقدم من المستخدم. "
            "يجب عليك العثور على الأخطاء المنطقية أو النحوية، وإرجاع نسخة مصححة من الكود فقط. "
            "لا تقم بإضافة أي شرح أو تحليل للخطأ. يجب أن يكون الناتج كود Python نظيف وجاهز للتشغيل. "
            "إذا كان الكود خالياً من الأخطاء، أعده كما هو."
        )
        user_prompt = f"الكود المراد تصحيحه:\n---\n{prompt}\n---"

    elif action == 'improve_code':
        system_prompt = (
            "أنت خبير في تحسين أداء وكفاءة كود Python. مهمتك هي تحسين الكود المقدم من المستخدم لجعله أكثر قراءة وكفاءة. "
            "قم بإرجاع نسخة محسّنة من الكود فقط مع تعليقات بسيطة تشرح التحسينات. "
            "لا تقم بإضافة أي شرح أو تحليل للتحسينات خارج تعليقات الكود. يجب أن يكون الناتج كود Python نظيف وجاهز للتشغيل."
        )
        user_prompt = f"الكود المراد تحسينه:\n---\n{prompt}\n---"

    elif action == 'chat_response':
        system_prompt = (
            "أنت مساعد استوديو كود (Code Studio Assistant) يتحدث العربية بطلاقة. "
            "اجب على أسئلة المستخدم المتعلقة بالبرمجة، Python، مفاهيم الكود، أو مساعدته في أي مهمة برمجة عامة. "
            "حافظ على نبرة ودية ومحترمة ومفيدة."
        )
        user_prompt = prompt # الدردشة تستخدم النص كما هو

    else:
        return jsonify({"error": "Invalid AI action specified."}), 400

    # استدعاء Gemini API
    result, status_code = call_gemini_api(system_prompt, user_prompt)

    if status_code == 200 and action != 'chat_response':
        # إذا كان الإجراء هو توليد/إصلاح/تحسين، نمرر النص تحت مفتاح 'code'
        return jsonify({'code': result.get('text')}), 200
    
    # للإجراءات الأخرى (مثل الدردشة)، نمرر 'text'
    return jsonify(result), status_code


# ----------------------------------------------------------------------
# 4. نقطة الدخول لتشغيل الخادم
# ----------------------------------------------------------------------

if __name__ == '__main__':
    # تأكد من تثبيت Flask و requests
    print("--- Flask AI Code Studio is running ---")
    app.run(debug=True)
