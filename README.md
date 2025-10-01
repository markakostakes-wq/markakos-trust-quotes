
# Markakos Trust — Quote Platform (Next.js)

Πλατφόρμα αιτήσεων προσφοράς (Αυτοκίνητο, Κατοικία, Υγεία, Επιχείρηση, Ζωής, Ταξιδιωτική) με υποχρεωτικά πεδία ανά κλάδο, server-side validation, GDPR logging, email ειδοποίηση & Google Sheet webhook.

## 1) Τοπική εκτέλεση
```bash
npm install
npm run dev
# άνοιξε http://localhost:3000
```

## 2) Περιβάλλον (.env.local)
Δημιούργησε αρχείο `.env.local` στη ρίζα (δίπλα στο package.json) αν θες email/Sheet:

```
# Email (SMTP, προαιρετικό)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=TO_EMAIL_SOU@gmail.com
SMTP_PASS=TO_APP_PASSWORD_SOU
NOTIFY_FROM=quotes@markakostrust.gr
NOTIFY_TO=TO_EMAIL_SOU@gmail.com

# Google Sheet (Apps Script webhook, προαιρετικό)
SHEET_WEBHOOK_URL=https://script.google.com/macros/s/XXX/exec
```

## 3) Ανέβασμα στο GitHub
1. Δημιούργησε repo στο GitHub (π.χ. `markakos-trust-quotes`).
2. Ανέβασε τα αρχεία αυτού του φακέλου στο repo (Upload files).
3. Commit.

## 4) Deploy σε Vercel (δωρεάν)
1. Συνδέσου στο https://vercel.com με το GitHub σου.
2. New Project → Import από GitHub → διάλεξε το repo.
3. Προσθήκη Environment Variables (από `.env.local` αν θες email/Sheet).
4. Deploy → θα πάρεις URL π.χ. https://markakos-trust.vercel.app
5. (Προαιρετικά) Σύνδεσε custom domain `markakostrust.gr`.

## 5) Τι περιλαμβάνει
- app/page.js: φόρμα με tabs & validators ανά κλάδο
- app/api/quotes/route.js: server validation, GDPR metadata, email (nodemailer) & Google Sheets webhook
- TailwindCSS για στυλ

## 6) Tracking (προαιρετικό)
- Πρόσθεσε GA4 & Meta Pixel events στο submit (βλ. σχόλια στο page.js).
