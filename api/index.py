import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))

for p in [current_dir, parent_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

from app import app