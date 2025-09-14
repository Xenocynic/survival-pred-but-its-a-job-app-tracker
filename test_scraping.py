import os
import json
from imap_tools import MailBox
from dotenv import load_dotenv
from bs4 import BeautifulSoup

# Load secrets
load_dotenv("security.env")
EMAIL = os.getenv("GMAIL_USERNAME")
PASSWORD = os.getenv("GMAIL_PASSWORD")

def check_email(text):
    text_lower = text.lower()
    # Keywords for confirmation
    confirm_keywords = ["received", "confirmation", "submitted", "thank you for applying"]
    # Keywords for acceptance/rejection
    accept_keywords = ["interview", "invited", "invite", "pleased", "congratulations", "offer"]
    reject_keywords = ["rejected", "declined", "not selected", "unfortunately", "regret to inform"]
    # Check for confirmation and not acceptance/rejection
    if any(word in text_lower for word in confirm_keywords):
        return "Applied"
    elif any(word in text_lower for word in accept_keywords):
        return "Accepted"
    elif any(word in text_lower for word in reject_keywords):
        return "Rejected"

applications = []

# Connect to Gmail IMAP
with MailBox("imap.gmail.com").login(EMAIL, PASSWORD) as mailbox:
    for msg in mailbox.fetch(criteria='FROM "@myworkday.com"', limit=5):
        html_content = msg.html or ""
        soup = BeautifulSoup(html_content, "html.parser")
        text_content = soup.get_text(separator="\n", strip=True)

        # Extract the part before @workday.com
        sender = msg.from_
        if "@myworkday.com" in sender:
            company = sender.split("@")[0].title()
        else:
            company = sender

        applications.append({
            "company": company,
            "status": check_email(text_content),
            "date": msg.date.strftime("%Y-%m-%d")})
        
        print(f"Processed email from {company}")

        with open('data.txt', 'w') as f:
            json.dump({"applications": applications}, f, ensure_ascii=False, indent=4)