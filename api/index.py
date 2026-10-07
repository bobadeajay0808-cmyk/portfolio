import os
import sys
import traceback

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))

for p in [current_dir, parent_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

portfolio_sub = os.path.join(parent_dir, "portfolio")
if os.path.isdir(portfolio_sub) and portfolio_sub not in sys.path:
    sys.path.insert(0, portfolio_sub)

try:
    from app import app
except Exception as e:
    from flask import Flask
    app = Flask(__name__)
    err_trace = traceback.format_exc()
    print("FATAL STARTUP ERROR IN VERCEL SERVERLESS FUNCTION:\n", err_trace, file=sys.stderr)

    @app.route("/")
    @app.route("/<path:subpath>")
    def render_error(subpath=""):
        return f"""
        <!DOCTYPE html>
        <html>
        <head><title>Startup Error | Ajay Bobade Portfolio</title></head>
        <body style="font-family: sans-serif; background: #0a0908; color: #f5ebe0; padding: 2rem;">
            <h2 style="color: #ff9d76;">⚠️ Serverless Function Startup Error</h2>
            <p>The Flask application failed to start on Vercel. Error details below:</p>
            <pre style="background: rgba(255,255,255,0.06); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); color: #fca5a5; overflow-x: auto;">{err_trace}</pre>
        </body>
        </html>
        """, 500
