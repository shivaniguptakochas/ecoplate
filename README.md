# EcoPlate — A Smart Campus Food Waste Reduction Platform

[![Bennett University](https://img.shields.io/badge/Bennett%20University-B.Tech%20CSE-green.svg)](https://www.bennett.edu.in)
[![Course](https://img.shields.io/badge/Course-Technology%20%26%20Sustainability%20(2026CSAE102)-blue.svg)](#)
[![SDG 12](https://img.shields.io/badge/UN%20SDG-12%20Responsible%20Consumption-orange.svg)](#)
[![Tech](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-brightgreen.svg)](#)

> **EcoPlate** is a beginner-friendly, responsive campus surplus food coordination prototype. It enables college canteens and hostel dining halls to rapidly broadcast surplus food availability, allowing students and authorized volunteers to reserve and collect food before it becomes avoidable waste.

---

## 👥 Team Members (Bennett University)

| Name | Enrollment No. | Suggested Project Role |
| :--- | :--- | :--- |
| **Hannu Kumar Gupta** | `S26CSEU3130` | Coordinator, problem research, proposal and integration |
| **Samir Kumar** | `S26CSEU3117` | HTML structure, page semantics, and navigation |
| **Akshat Sharma** | `S26CSEU3116` | CSS design system, sustainability theme, and layout |
| **Kumar Vibhuti Ranjan** | `S26CSEU3114` | JavaScript logic, LocalStorage engine, and dashboard testing |

---

## 🚀 Features

1. **Surplus Food Listings (`food.html`)**:
   - Browse active surplus meals with category badges, portion counts, campus mess provider, and pickup deadlines.
   - Interactive search by dish name, mess name, or campus location.
   - Live status filter pills (`All`, `Available`, `Reserved`, `Collected`, `Expired`).
   - Category filtering (`Meal`, `Bakery`, `Fruit/Vegetable`, `Packaged Food`, `Snacks`).
   - Sorting by urgent deadline, highest quantity, or newest additions.

2. **Add Food Form (`add-listing.html`)**:
   - Comprehensive input validation (dish name, category, positive quantity, units, provider, preparation timestamp, pickup deadline, and exact location).
   - Validation prevents past deadlines or deadlines preceding preparation time.
   - Mandatory food-safety declaration checkbox before submission.

3. **Status Workflow & Transitions**:
   - `Available`: Can be reserved by student/NGO with recipient name and verification details.
   - `Reserved`: Can be marked as `Collected` upon physical handover, or released back to `Available`.
   - `Collected`: Recorded towards campus food waste prevention metrics (cannot be reserved again).
   - `Expired`: Automatically triggered if pickup deadline passes without collection (disabled from reservation).

4. **Campus Impact Dashboard (`dashboard.html`)**:
   - Real-time KPI summary cards: Total Listings, Total Food Listed, Total Food Collected, Overall Collection Rate %, and Expired/Unclaimed listings.
   - Visual progress bars for status distribution and food category breakdowns.
   - Campus mess and canteen participation tracker.
   - Recent activity audit trail table.
   - One-click JSON data export.

5. **Design & Accessibility (`css/styles.css`)**:
   - Handcrafted sustainability-focused color scheme: deep forest green (`#1b4332`), mint (`#52b788`), off-white (`#f8faf8`), and charcoal (`#1f2937`).
   - Clean typography using Google Fonts (Plus Jakarta Sans).
   - Mobile-responsive navigation with hamburger drawer.
   - Accessible focus rings, semantic HTML5, and floating toast notifications.

---

## 📂 File & Directory Structure

```text
ecoplate/
├── index.html          # Home: value proposition, 3-step workflow, SDG cards, quick metrics
├── food.html           # Available Food: browse, live search, status chips, reservation modal
├── add-listing.html    # Add Listing: validated submission form for campus canteens
├── dashboard.html      # Impact Dashboard: KPI cards, progress bars, recent activity log
├── about.html          # About & Safety: team attribution, food safety policy, stakeholder analysis
├── css/
│   └── styles.css      # Design system tokens, components, responsive styles, animations
├── js/
│   ├── app.js          # Shared navigation, toast notifications, modal dialogs, date formatters
│   ├── storage.js      # LocalStorage CRUD engine, sample demo data, auto-expiry, statistics
│   ├── listings.js     # Search, filter, render food cards, reservation and collection handlers
│   └── dashboard.js    # Metric computations, status progress bars, audit log rendering
├── assets/             # Project assets and icons
└── README.md           # Project documentation, execution steps, and testing verification
```

---

## 💻 How to Run Locally

Because this project is built using pure **HTML5, CSS3, and Vanilla JavaScript**, no build steps, Node packages, or compilers are required.

### Option 1: Direct Browser Opening
Simply double-click `index.html` or open it with any modern web browser (Google Chrome, Microsoft Edge, Safari, Mozilla Firefox).

### Option 2: Using a Lightweight Local Web Server (Recommended)
If you have Python installed:
```bash
cd /Users/hannukumargupta/.gemini/antigravity-ide/scratch/ecoplate
python3 -m http.server 3000
```
Then navigate to `http://localhost:3000` in your web browser.

Or with Node.js `npx serve`:
```bash
cd /Users/hannukumargupta/.gemini/antigravity-ide/scratch/ecoplate
npx -y serve .
```

---

## 🧪 Testing Plan & Verification Steps

| Test Case | Steps to Test | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :---: |
| **1. Submit Empty Form** | Open `add-listing.html` and click "Publish Surplus Food Listing" without filling fields. | Required-field errors appear; no listing is saved. | PASS |
| **2. Submit Valid Listing** | Fill all fields with valid inputs, select future deadline, check declaration, and submit. | Success toast appears; redirects to `food.html` with new card visible. | PASS |
| **3. Negative / Zero Quantity** | Enter `0` or `-10` in Quantity. | Validation message flags that quantity must be greater than 0. | PASS |
| **4. Past Pickup Deadline** | Select a deadline date/time in the past. | Validation flags that pickup deadline must be in the future. | PASS |
| **5. Search by Food Name** | Type "Biryani" in the search box on `food.html`. | Only matching listings are displayed; counter updates. | PASS |
| **6. Filter by Status** | Click "Reserved" chip on `food.html`. | Only listings currently in Reserved status appear. | PASS |
| **7. Reserve an Available Listing** | Open an Available listing card, click "Reserve Food", enter recipient name, and confirm. | Status transitions to `Reserved`; toast confirms pickup deadline. | PASS |
| **8. Mark Reserved Listing Collected** | Open a Reserved listing, click "Mark Collected", and confirm. | Status transitions to `Collected`; impact dashboard counts update. | PASS |
| **9. Refresh Persistence** | Refresh the browser (`F5` or `Cmd+R`). | All listings, newly added items, and status updates remain saved in LocalStorage. | PASS |
| **10. Mobile Responsiveness** | Resize browser window to mobile width (<768px). | Navigation collapses into hamburger; layout adjusts seamlessly to single column. | PASS |

---

## ⚠️ Limitations & Food Safety Disclaimer

1. **LocalStorage Prototype Limitation**:
   Data is stored strictly in the current browser's `LocalStorage` (`ecoplateListings`). Data is not synchronized across different computers or browsers. In an enterprise campus deployment, this would be backed by a secure PostgreSQL/Node.js backend with JWT authentication and SMS webhooks.

2. **Food Safety Responsibility**:
   EcoPlate is an academic digital coordination prototype. **EcoPlate does not certify or verify food safety, quality, or freshness.** Providers (canteen managers and mess contractors) and collection volunteers remain solely responsible for adhering to campus health rules and national food safety guidelines (e.g. FSSAI standards).
