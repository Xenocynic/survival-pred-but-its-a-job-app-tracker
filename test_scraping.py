import os
from imap_tools import MailBox
from dotenv import load_dotenv

# Load secrets
load_dotenv("security.env")
EMAIL = os.getenv("GMAIL_USERNAME")
PASSWORD = os.getenv("GMAIL_PASSWORD")

# Connect to Gmail IMAP
with MailBox("imap.gmail.com").login(EMAIL, PASSWORD) as mailbox:
    for msg in mailbox.fetch(criteria='FROM "no-reply@accounts.google.com"', limit=5):
        print("From:", msg.from_)
        print("Subject:", msg.subject)
        print("Body:", msg.text or msg.html)
        print("-" * 50)