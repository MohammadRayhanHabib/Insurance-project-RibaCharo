Saved to the DB and shown on the homepage as a testimonial
💳 Page 2. Payment Status: Shows a list of policies that have status approved.Show it in table format with:
Premium amount
Payment frequency(monthly / yearly)
Status: Due / Paid
If the status is due, the pay button will be shown.Clicking the pay button will redirect to the payment page
💳 Page 3. Payment Page(Stripe): 
Stripe integration for premium payments
Fields auto - filled from user data and policy
On success: update DB, confirm transaction, activate policy
Change the policy status to paid
