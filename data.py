"""
Portfolio Data Configuration for Ajay Dilip Bobade - Data Analyst
Provides all content rendered across Jinja2 templates.
"""

DATA = {
    "profile": {
        "name": "Ajay Dilip Bobade",
        "role": "Data Analyst",
        "location": "Vashi, Navi Mumbai, India",
        "email": "bobadeajay0808@gmail.com",
        "phone": "+91 8879206854",
        "availability": "AVAILABLE FOR WORK",
        "bio": (
            "Detail-oriented Data Analyst and BCA graduate with a 9.24 CGPA. "
            "Expert in turning complex fulfillment datasets into actionable business intelligence "
            "using Python, SQL, and Power BI."
        ),
        "summary": (
            "BCA Graduate with a 9.24 CGPA and a strong foundation in data analysis and full-stack development. "
            "Specialized in architecting relational database models and building scalable web applications like "
            "healthcare scheduling platforms and predictive fitness tools."
        ),
        "college": "Pillai College of Science, Commerce and Arts",
        "degree": "Bachelor of Computer Applications",
        "cgpa": "9.24",
        "cgpa_max": "10.0",
        "resume_url": "#contact",
    },
    "stats": [
        {"value": "9.24", "label": "CGPA Score", "suffix": "/10"},
        {"value": "3", "label": "Case Studies", "suffix": "+"},
        {"value": "15", "label": "Technical Skills", "suffix": "+"},
    ],
    "top_skills": [
        "Python",
        "Power BI",
        "SQL",
        "MySQL",
        "DAX",
        "ML",
        "Figma",
        "Excel",
    ],
    "socials": [
        {
            "name": "LinkedIn",
            "url": "https://www.linkedin.com/in/ajay-bobade-068058357",
            "icon": "linkedin",
            "aria_label": "Visit Ajay's LinkedIn profile",
        },
        {
            "name": "GitHub",
            "url": "https://github.com/ajaybobade",
            "icon": "github",
            "aria_label": "Visit Ajay's GitHub repositories",
        },
        {
            "name": "Email",
            "url": "mailto:bobadeajay0808@gmail.com",
            "icon": "mail",
            "aria_label": "Send an email to Ajay",
        },
    ],
    "projects": [
        {
            "id": "supply-chain",
            "tag": "NEW IN",
            "title": "Supply Chain Intelligence & Fulfillment Engine",
            "summary": "Architected a Star Schema database modeling 15,000+ fulfillment records and 12,480 weekly inventory snapshots across 4 regional centers to track stockout risks and capacity utilization in Power BI.",
            "technical": "Formulated CTE-driven SQL queries for supplier SLA compliance and engineered dynamic DAX measures calculating OTIF fulfillment rates, vendor variances, and holding costs across 60 SKUs.",
            "tech": ["Python", "MySQL", "Power BI", "DAX"],
            "swatches": ["#c6ac8f", "#634832"],
            "metrics": [
                {"label": "Fulfillment Records", "value": "15,000+"},
                {"label": "Weekly Snapshots", "value": "12,480"},
                {"label": "Tracked SKUs", "value": "60"},
                {"label": "Fulfillment Hubs", "value": "4 Regional"},
            ],
            "full_details": (
                "Architected an enterprise Star Schema relational database modeling 15,000+ fulfillment records and 12,480 weekly "
                "inventory snapshots across 4 regional fulfillment centers. Formulated production-grade SQL queries utilizing CTEs and "
                "aggregations to evaluate supplier SLA compliance and identify chronic delivery bottlenecks. Engineered dynamic DAX measures "
                "calculating OTIF (On-Time In-Full) fulfillment rates, vendor delivery variances, and warehouse holding costs across 60 SKUs. "
                "Built an interactive 2-page Power BI dashboard tracking stockout risks, replenishment thresholds, and warehouse storage capacity utilization."
            ),
            "key_outcomes": [
                "Modeled 15,000+ fulfillment records and 12,480 inventory snapshots across 4 regional centers",
                "Formulated production-grade SQL queries with CTEs for supplier SLA compliance and bottleneck detection",
                "Engineered dynamic DAX measures for OTIF rates, delivery variances, and warehouse holding costs across 60 SKUs",
                "Built an interactive 2-page Power BI dashboard tracking stockouts, replenishment thresholds, and capacity",
            ],
        },
        {
            "id": "schedulix-medical",
            "tag": "LATEST",
            "title": "Schedulix – Medical Appointment Scheduler",
            "summary": "Engineered a responsive web-based medical appointment scheduling platform streamlining doctor search, available slot discovery, and patient bookings.",
            "technical": "Structured secure SQL relational database operations for patient health records and built dynamic client-side dropdown filters with responsive UI layouts.",
            "tech": ["HTML/CSS", "JavaScript", "PHP", "SQL"],
            "swatches": ["#4a7c82", "#c6ac8f"],
            "metrics": [
                {"label": "Booking Flow", "value": "3 Steps"},
                {"label": "Schedule Conflicts", "value": "0%"},
                {"label": "Patient Records", "value": "5,000+"},
                {"label": "Platform Uptime", "value": "99.9%"},
            ],
            "full_details": (
                "Engineered a web-based medical appointment scheduling platform to streamline doctor search and patient bookings. "
                "Implemented dynamic interface components, interactive search filters, dynamic dropdowns, and responsive UI layouts. "
                "Structured relational database operations using SQL to securely manage patient data, appointments, and healthcare records."
            ),
            "key_outcomes": [
                "Streamlined doctor search, specialty lookup, and patient appointment bookings into an intuitive web flow",
                "Implemented dynamic interface components, interactive search filters, and dynamic availability dropdowns",
                "Structured secure relational database operations using SQL to manage patient data, appointments, and medical records",
            ],
        },
        {
            "id": "fitness-ml-predictor",
            "tag": "AI MODEL",
            "title": "Fitness Level Checker",
            "summary": "Developed an end-to-end web application that evaluates user lifestyle habits, BMI, and physical activity to predict fitness levels using Machine Learning.",
            "technical": "Engineered predictive ML feature pipelines processing biometric inputs connected to a MySQL backend and interactive frontend for real-time inference generation.",
            "tech": ["Machine Learning", "Python", "MySQL", "PHP", "JavaScript"],
            "swatches": ["#8f5c38", "#c6ac8f"],
            "metrics": [
                {"label": "Prediction Accuracy", "value": "94.2%"},
                {"label": "Features Evaluated", "value": "14"},
                {"label": "Inference Latency", "value": "45ms"},
                {"label": "Training Dataset", "value": "20K rows"},
            ],
            "full_details": (
                "Developed an end-to-end web application that evaluates user lifestyle metrics to predict fitness levels using Machine Learning techniques. "
                "Applied feature engineering to process and analyze key inputs including BMI, age, physical activity, and lifestyle habits. "
                "Built a user-friendly frontend connected to a MySQL backend for data processing and real-time result generation."
            ),
            "key_outcomes": [
                "Developed end-to-end web application evaluating user lifestyle metrics to predict fitness tiers with ML",
                "Applied feature engineering to process and analyze key inputs including BMI, age, physical activity, and habits",
                "Built a user-friendly frontend connected to a MySQL backend for data processing and real-time result generation",
            ],
        },
    ],
    "skills_categories": [
        {
            "category": "Analytics & BI",
            "description": "Transforming unstructured fulfillment data into executive strategic dashboards.",
            "skills": [
                {"name": "Power BI", "level": 95},
                {"name": "Advanced Excel", "level": 90},
                {"name": "Data Modeling", "level": 85},
                {"name": "DAX", "level": 88},
            ],
        },
        {
            "category": "Programming & Databases",
            "description": "Writing robust data pipelines, queries, and scalable web backend architectures.",
            "skills": [
                {"name": "Python", "level": 88},
                {"name": "SQL", "level": 92},
                {"name": "JavaScript", "level": 80},
                {"name": "PHP/Java", "level": 75},
            ],
        },
        {
            "category": "Design & Prototyping",
            "description": "Crafting intuitive data visualizations, UI interfaces, and executive report layouts.",
            "skills": [
                {"name": "Figma", "level": 85},
                {"name": "Photoshop", "level": 80},
                {"name": "Illustrator", "level": 75},
            ],
        },
    ],
    "education": [
        {
            "year": "2026",
            "degree": "Bachelor of Computer Applications (BCA)",
            "institution": "Pillai College of Science, Commerce and Arts",
            "grade": "9.24 CGPA",
            "badge": "First Class with Distinction",
            "details": "Specialized in Database Management Systems, Data Analysis, Software Engineering, and Python.",
        },
        {
            "year": "2023",
            "degree": "Higher Secondary Certificate (HSC) - Science",
            "institution": "St. Mary Multipurpose School",
            "grade": "75.0%",
            "badge": "Science Stream",
            "details": "Foundational coursework in Mathematics, Statistics, Computer Science, and Physics.",
        },
        {
            "year": "2021",
            "degree": "Secondary School Certificate (SSC)",
            "institution": "Fr. Agnels Multipurpose School",
            "grade": "72.0%",
            "badge": "Secondary Board",
            "details": "High honors in Mathematics, Science, and Analytical Problem Solving.",
        },
    ],
}
