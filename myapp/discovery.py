

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os, re, pickle, difflib
import docx
import fitz  # PyMuPDF

app = Flask(__name__)
CORS(app)

# ——— Load tokenizer via pickle ———
# PUNKT_PATH = r"C:\Users\19064527\nltk_data\tokenizers\punkt\english.pickle"
# with open(PUNKT_PATH, "rb") as f:
#     tokenizer = pickle.load(f)

# ——— Helpers ———
def extract_text_from_pdf(path):
    text = ""
    with fitz.open(path) as pdf:
        for page in pdf:
            text += page.get_text()
    return text

def extract_text_from_docx(path):
    doc = docx.Document(path)
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())

# ——— Load docs + build field map ———
def load_and_parse(folder):
    full_text = ""
    field_map = {}
    current_field = None
    buffer = []

    for fn in os.listdir(folder):
        path = os.path.join(folder, fn)
        if fn.lower().endswith(".pdf"):
            txt = extract_text_from_pdf(path)
        elif fn.lower().endswith(".docx"):
            txt = extract_text_from_docx(path)
        else:
            continue

        full_text += txt + "\n"
        lines = txt.splitlines()

        for line in lines:
            line = line.strip()
            if not line:
                continue

            if ":" in line:
                # save previous field if any
                if current_field and buffer:
                    field_map[current_field] = "\n\n".join(buffer).strip()
                    buffer = []

                key, val = line.split(":", 1)
                current_field = key.strip().lower()
                buffer.append(val.strip())
            elif current_field:
                buffer.append(line.strip())

        # save last field
        if current_field and buffer:
            field_map[current_field] = "\n".join(buffer).strip()

    return full_text, field_map

DOCUMENTS_TEXT, FIELD_MAP = load_and_parse("doc")
print("Field map:", FIELD_MAP)

# ——— Fallback fuzzy matcher ———
def fuzzy_match(text, query, top_k=1):
    sentences = tokenizer.tokenize(text)
    qwords = set(re.findall(r'\w+', query.lower()))
    scored = []
    for s in sentences:
        swords = set(re.findall(r'\w+', s.lower()))
        score = len(qwords & swords)
        if score > 0:
            scored.append((score, s))
    scored.sort(reverse=True)
    return [s for _, s in scored[:top_k]]

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json() or {}
    q = data.get("question", "").lower().strip()
    print("User question:", q)

    if not q:
        return jsonify({"answer": "❓ Please ask a question."})

    # 1) Exact field-key match
    qwords = set(re.findall(r'\w+', q))
    for field, val in FIELD_MAP.items():
        fwords = set(field.split())
        if fwords and fwords.issubset(qwords):
            return jsonify({"answer": f" {val}"})

    # 2) If the user only typed a single word and it wasn’t an exact field, stop here
    if len(qwords) == 1:
        return jsonify({"answer": "❌ No relevant information found."})

    # 3) Fuzzy fallback for multi-word queries
    snippets = fuzzy_match(DOCUMENTS_TEXT, q, top_k=1)
    if snippets:
        return jsonify({"answer": snippets[0]})

    return jsonify({"answer": "❌ No relevant information found."})

if __name__ == "__main__":
   app.run(host="0.0.0.0", port=5000, debug=True)





# from flask import Flask, request, jsonify, render_template
# from flask_cors import CORS
# from dotenv import load_dotenv
# import os
# import traceback  
# from openai import OpenAI


# # Load environment variables
# load_dotenv()
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# app = Flask(__name__)
# CORS(app)

# # Load company data
# with open("discovery.txt", "r", encoding='utf-8') as f:
#     company_data = f.read()

# @app.route("/")
# def home():
#     return render_template("HEY.html")

# @app.route("/ask", methods=["POST"])
# def ask():
#     try:
#         user_input = request.json.get("question", "")

#         response = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {
#                     "role": "system", 
#                     "content": f"Only use this company data to answer:\n\n{company_data}"
#                 },
#                 {
#                     "role": "user",
#                     "content": user_input
#                 }
#             ]
#         )

#         answer = response.choices[0].message.content
#         return jsonify({"answer": answer})

#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return jsonify({"answer": "Sorry, something went wrong."})