# InternCertify - Mobile-First Certificate Verification Web Application

A clean, responsive mobile-first certificate verification web application matching the **InternCertify** design with URL-based dynamic data loading, built using vanilla **HTML**, **CSS**, and **JavaScript**.

---

## 🌟 Visual Styling & Layout

1. **Mobile-First Container**:
   - Strictly constrained to a **maximum width of 480px** (`max-width: 480px`), cleanly centered on screen with mobile viewport styling.
2. **Header**:
   - Logo text: **"InternCertify"** with dark slate (`Intern`) and blue (`Certify`) text, with an interactive hamburger menu icon on the top right.
3. **Title**:
   - `InternCertify Verified Certificate - [Student Name]` in **bold dark blue text** (`#0a2540`).
4. **Central Badge**:
   - A tilted green circular badge prominently displaying **`★ ★ ★ VERIFIED ★ ★ ★`** with checkmark crest and authentic seal ribbons.
5. **Heading**:
   - Displays `🎉 CONGRATULATIONS 🎉` followed by *"It's a verified certificate from Intern Certify"*.
6. **Certificate Data List**:
   - Learner Full Name
   - Internship Course
   - Duration
   - Roll No (includes one-click copy button)
   - College
7. **Footer Note & Angled Trim**:
   - Italic security disclaimer: *“The details accessed via the QR code are secure and will only display the information related to the learner's internship.”*
   - Decorative **angled cyan/blue gradient bottom trim** along the bottom edge of the certificate card.

---

## 👥 Candidate Records

Exactly these 3 candidate records are supported and stored:

| Candidate Name | Roll No | Course | Duration | College | Direct Test URL |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Rahul M** *(Default)* | `721223205042` | Front end Development | 19-05-2026 to 17-06-2026 | Karpagam Institute of Technology | [?id=721223205042](http://localhost:3000/?id=721223205042) |
| **Sherin Fathima A** | `721223205053` | Front end Development | 19-05-2026 to 17-06-2026 | Karpagam Institute of Technology | [?id=721223205053](http://localhost:3000/?id=721223205053) |
| **Balasundari S** | `721223205012` | Front end Development | 19-05-2026 to 17-06-2026 | Karpagam Institute of Technology | [?id=721223205012](http://localhost:3000/?id=721223205012) |

---

## 🔍 URL Query Parameter Lookup & Default Fallback

The app reads the `?id=` parameter on page load:
- **By Roll Number**:
  - `?id=721223205042` -> **Rahul M**
  - `?id=721223205053` -> **Sherin Fathima A**
  - `?id=721223205012` -> **Balasundari S**
- **By Code**:
  - `?id=trh82nc` -> **Rahul M**
  - `?id=fyi73gt` -> **Sherin Fathima A**
  - `?id=bal12kit` -> **Balasundari S**
- **Default Fallback**:
  - If no ID is provided (e.g. `http://localhost:3000/`) or if an unknown ID is provided, it automatically defaults to displaying **Rahul M**.

---

## 🚀 How to Run Locally

```bash
# Start local Node.js server
node server.js
```
Open [http://localhost:3000/?id=721223205042](http://localhost:3000/?id=721223205042) in your browser.
