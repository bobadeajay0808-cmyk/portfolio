import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))

for p in [current_dir, parent_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

portfolio_sub = os.path.join(parent_dir, "portfolio")
if os.path.isdir(portfolio_sub) and portfolio_sub not in sys.path:
    sys.path.insert(0, portfolio_sub)

from app import app