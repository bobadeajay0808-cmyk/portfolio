"""
Flask Application for Ajay Dilip Bobade - Data Analyst Portfolio
Desert Glassmorphism Theme with Secure Integrated Admin Panel
"""

import os
import sys
import json
from datetime import datetime
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from data import DATA as DEFAULT_DATA

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static"),
    static_url_path="/static"
)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "desert-glassmorphism-secret-key-2026")

# Admin Login Credentials
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")

DATA_FILE = os.path.join(os.path.dirname(__file__), "data.json")
MESSAGES_FILE = os.path.join(os.path.dirname(__file__), "messages.json")


def normalize_url(url):
    """Ensures social links and emails have appropriate protocol prefixes."""
    if not url:
        return ""
    url = url.strip()
    if "@" in url and not url.startswith("mailto:") and not url.startswith("http"):
        return f"mailto:{url}"
    if url.startswith("www."):
        return f"https://{url}"
    if url.startswith("linkedin.com") or url.startswith("github.com"):
        return f"https://{url}"
    return url


def load_portfolio_data():
    """Loads active portfolio data from data.json or falls back to data.py defaults."""
    data = None
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            print(f"⚠️ Error reading {DATA_FILE}: {e}. Falling back to default data.")
    if not data:
        data = DEFAULT_DATA

    # Auto-heal project fields if they were saved as blank
    if "projects" in data and isinstance(data["projects"], list):
        default_map = {p["id"]: p for p in DEFAULT_DATA.get("projects", [])}
        for proj in data["projects"]:
            p_id = proj.get("id")
            if p_id in default_map:
                def_p = default_map[p_id]
                if not proj.get("summary") and def_p.get("summary"):
                    proj["summary"] = def_p["summary"]
                if not proj.get("technical") and def_p.get("technical"):
                    proj["technical"] = def_p["technical"]
                if not proj.get("full_details") and def_p.get("full_details"):
                    proj["full_details"] = def_p["full_details"]

    # Normalize all social links
    if "socials" in data and isinstance(data["socials"], list):
        for soc in data["socials"]:
            if "url" in soc:
                soc["url"] = normalize_url(soc["url"])
    return data


def save_portfolio_data(data):
    """Saves updated portfolio data to data.json."""
    try:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
    except OSError as e:
        print(f"⚠️ Serverless/Read-only filesystem warning (save_portfolio_data): {e}")


def load_messages():
    """Loads received contact transmissions."""
    if os.path.exists(MESSAGES_FILE):
        try:
            with open(MESSAGES_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []


def save_message(message_item):
    """Appends a new transmission to messages.json."""
    try:
        messages = load_messages()
        messages.insert(0, message_item)
        with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
            json.dump(messages, f, indent=4, ensure_ascii=False)
    except OSError as e:
        print(f"⚠️ Serverless/Read-only filesystem warning (save_message): {e}")


# -----------------------------------------------------------------------------
# Core Web Routes
# -----------------------------------------------------------------------------

@app.route("/")
def index():
    """Renders the single-page Desert Glassmorphism portfolio."""
    # If admin did not opt-in to persistent session, visiting the public portfolio auto-locks the admin console
    if session.get("is_admin") and not session.get("remember_login"):
        session.pop("is_admin", None)
    data = load_portfolio_data()
    return render_template("index.html", data=data)


@app.route("/admin", methods=["GET", "POST"])
@app.route("/admin/", methods=["GET", "POST"])
def admin_panel():
    """
    Renders the Admin Panel.
    If not authenticated, displays the login screen.
    When authenticated, displays the full 6-tab field manager.
    """
    error = None
    if request.method == "POST":
        u = request.form.get("username", "").strip()
        p = request.form.get("password", "").strip()
        remember = request.form.get("remember", "").strip()
        if u.lower() == ADMIN_USERNAME.lower() and p == ADMIN_PASSWORD:
            session["is_admin"] = True
            session["remember_login"] = (remember == "yes" or remember == "true")
        else:
            error = "Invalid username or password. Default: admin / admin123"

    is_authenticated = bool(session.get("is_admin"))
    data = load_portfolio_data()
    messages = load_messages()
    return render_template(
        "admin.html",
        data=data,
        messages=messages,
        is_authenticated=is_authenticated,
        error=error,
        username=ADMIN_USERNAME,
    )


@app.route("/admin/login", methods=["GET", "POST"])
@app.route("/login", methods=["GET", "POST"])
def login():
    """
    Handles authentication when submitting from a login form or accessing /admin/login.
    Guarantees that http://192.168.29.150:5001/admin/login never returns 404!
    """
    if request.method == "POST":
        u = request.form.get("username", "").strip()
        p = request.form.get("password", "").strip()
        remember = request.form.get("remember", "").strip()
        if u.lower() == ADMIN_USERNAME.lower() and p == ADMIN_PASSWORD:
            session["is_admin"] = True
            session["remember_login"] = (remember == "yes" or remember == "true")
            return redirect(url_for("admin_panel"))
        error = "Invalid username or password. Default: admin / admin123"
        data = load_portfolio_data()
        messages = load_messages()
        return render_template("admin.html", data=data, messages=messages, is_authenticated=False, error=error)

    if session.get("is_admin"):
        return redirect(url_for("admin_panel"))

    data = load_portfolio_data()
    messages = load_messages()
    return render_template("admin.html", data=data, messages=messages, is_authenticated=False)


@app.route("/admin/exit")
@app.route("/admin/return")
def admin_exit():
    """
    Safely logs out of the admin panel and returns to the public portfolio website.
    Ensures that re-visiting /admin will require authentication again.
    """
    session.pop("is_admin", None)
    session.pop("remember_login", None)
    return redirect(url_for("index"))


@app.route("/admin/logout")
@app.route("/logout")
def logout():
    """Logs out and reloads /admin in locked mode."""
    session.pop("is_admin", None)
    session.pop("remember_login", None)
    next_page = request.args.get("next")
    if next_page:
        return redirect(next_page)
    return redirect(url_for("admin_panel"))


# -----------------------------------------------------------------------------
# API Endpoints
# -----------------------------------------------------------------------------

@app.route("/api/contact", methods=["POST"])
def contact():
    """Accepts contact form transmissions."""
    payload = request.get_json(silent=True) or request.form.to_dict()

    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip()
    message = payload.get("message", "").strip()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    print("\n" + "=" * 50)
    print("📡 [INCOMING TRANSMISSION] New Contact Message Received:")
    print(f"   Name     : {name}")
    print(f"   Email    : {email}")
    print(f"   Message  : {message}")
    print("=" * 50 + "\n", file=sys.stdout, flush=True)

    if not name or not message:
        return jsonify({
            "status": "error",
            "message": "Name and message fields are required."
        }), 400

    save_message({
        "id": f"msg_{int(datetime.now().timestamp() * 1000)}",
        "timestamp": timestamp,
        "name": name,
        "email": email,
        "message": message
    })

    return jsonify({
        "status": "success",
        "message": f"Thank you, {name}! Your transmission has been safely received."
    }), 200


@app.route("/api/admin/data", methods=["GET"])
def get_admin_data():
    """Returns current portfolio data structure as JSON."""
    return jsonify(load_portfolio_data())


@app.route("/api/admin/save", methods=["POST"])
def save_admin_data():
    """Saves updated portfolio data submitted by the Admin Panel."""
    if not session.get("is_admin"):
        return jsonify({"status": "error", "message": "Unauthorized. Please log in."}), 401

    new_data = request.get_json(silent=True)
    if not new_data or not isinstance(new_data, dict):
        return jsonify({"status": "error", "message": "Invalid JSON data received."}), 400

    try:
        save_portfolio_data(new_data)
        return jsonify({
            "status": "success",
            "message": "Portfolio data saved successfully! Changes are now live on your site."
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/admin/reset", methods=["POST"])
def reset_admin_data():
    """Resets portfolio data back to default configuration."""
    if not session.get("is_admin"):
        return jsonify({"status": "error", "message": "Unauthorized. Please log in."}), 401

    if os.path.exists(DATA_FILE):
        try:
            os.remove(DATA_FILE)
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    return jsonify({
        "status": "success",
        "message": "Portfolio data successfully reset to defaults."
    }), 200


@app.route("/api/admin/messages", methods=["GET"])
def get_messages():
    """Returns all received contact messages."""
    return jsonify(load_messages())


# -----------------------------------------------------------------------------
# Auto-Redirects & Graceful 404 Handler
# -----------------------------------------------------------------------------

@app.route("/www.linkedin.com/<path:subpath>")
@app.route("/linkedin.com/<path:subpath>")
def redirect_linkedin(subpath):
    return redirect(f"https://www.linkedin.com/{subpath}", code=302)


@app.route("/www.github.com/<path:subpath>")
@app.route("/github.com/<path:subpath>")
def redirect_github(subpath):
    return redirect(f"https://github.com/{subpath}", code=302)


@app.errorhandler(404)
def page_not_found(e):
    """Graceful 404 handler that auto-redirects accidental relative social links or admin paths."""
    path = request.path.lstrip("/")
    if "admin" in path.lower():
        return redirect(url_for("admin_panel"))
    if path.startswith("www.") or "linkedin.com" in path or "github.com" in path:
        return redirect(f"https://{path}", code=302)
    if "@" in path and not path.startswith("mailto:"):
        return redirect(f"mailto:{path}", code=302)
    return redirect(url_for("admin_panel"))


@app.errorhandler(Exception)
def handle_unexpected_error(e):
    """Catches any internal runtime error and prints full traceback instead of 500 crash."""
    import traceback
    err_trace = traceback.format_exc()
    print("CRITICAL FLASK RUNTIME ERROR:\n", err_trace, file=sys.stderr)
    return f"""
    <!DOCTYPE html>
    <html>
    <head><title>Flask Runtime Error</title></head>
    <body style="font-family: monospace; background: #0a0908; color: #f5ebe0; padding: 2rem;">
        <h2 style="color: #ff9d76;">⚠️ Flask Runtime Error</h2>
        <p>An unexpected error occurred during page rendering:</p>
        <pre style="background: rgba(255,255,255,0.08); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15); color: #fca5a5; white-space: pre-wrap;">{err_trace}</pre>
    </body>
    </html>
    """, 500


if __name__ == "__main__":
    print("🏜️  Portfolio running at http://0.0.0.0:5001")
    print("🔑 Admin Panel available at http://0.0.0.0:5001/admin")
    print(f"   Credentials: Username='{ADMIN_USERNAME}', Password='{ADMIN_PASSWORD}'")
    app.run(host="0.0.0.0", port=5001, debug=True)
