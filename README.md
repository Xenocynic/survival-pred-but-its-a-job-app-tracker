# Job Application Tracker (Name TBA)
Created for CMPUT 401's hackathon bu the EZ Survival Prediction team.

1. pip install -r requirements.txt 

2. Login to Test Gmail Account
   Gmail: cmput401survivalprediction@gmail.com
   Password: cmput401survivalprediction?

3. Go to Manage Google Account -> App Passwords 
   Create a new name "hackathon-<your-name>" 
   Copy the generated app password

4. Create a new file in the same folder as the test_scraping.py
   Name it security.env

5. Put this in the security.env
   GMAIL_USERNAME=cmput401survivalprediction@gmail.com
   GMAIL_PASSWORD=<the copied app password>

6. Save, run and edit as required

7. When pushing to git, DO NOT PUSH your security.env
   * While it does not matter for this shared gmail account, it is generally good software practice to NOT share secure keys on git 