# EcoPlate — Milestone 2 Technical Project Report

**Project title:** EcoPlate — A Smart Campus Food Waste Reduction Platform  
**Course:** Technology & Sustainability  
**Team members:** Hannu Kumar Gupta (S26CSEU3130), Samir Kumar (S26CSEU3117), Akshat Sharma (S26CSEU3116), Kumar Vibhuti Ranjan (S26CSEU3114)

> Submission note: This is a project-report draft. Add real screenshots, actual testing outcomes and genuine stakeholder feedback before submitting. Do not represent sample listings or planned research as real findings.

## 1. Abstract

EcoPlate is a responsive, browser-based prototype designed to demonstrate how campus surplus-food information could be organized in one place. Providers can create listings with food details, quantity, collection location, ready time, deadline, allergen notes and contact instructions. Users can browse and filter listings, simulate reservations, and mark items as collected. A dashboard summarizes listing statuses and estimated portions collected.

The prototype is implemented with HTML, CSS and vanilla JavaScript. Browser LocalStorage provides persistence for demonstration purposes. The current version does not provide shared multi-user data, accounts, a backend or food-safety verification.

## 2. Problem statement

Campus canteens, student events and food-service points may have surplus food while other members of the campus community may not know what is available or when it must be collected. Without a clear coordination process, potentially usable food can be wasted. EcoPlate explores a simple digital listing and status-tracking workflow to make surplus-food information easier to discover.

**Research limitation:** The problem should be validated with actual campus stakeholders. Add observations or interview notes only after collecting them.

## 3. Aim and objectives

**Aim:** Build a simple website prototype that demonstrates campus surplus-food listing and collection coordination.

**Objectives**
1. Let a provider publish a food listing with key collection details.
2. Let visitors browse, search and filter listings.
3. Demonstrate reservation and collection status changes.
4. Display summary metrics derived from prototype listings.
5. Encourage responsible consumption and reduce avoidable waste through awareness.
6. Identify what would be required to develop a safe, shared multi-user service.

## 4. Target users and stakeholders

- Campus canteens and food-service staff
- Student event organizers
- Students and staff who are eligible to collect shared food
- Campus administration and sustainability teams
- Authorized food donation organizations, where applicable

Stakeholder needs should be confirmed through real discussions before claiming they have been met.

## 5. Sustainability connection

- **SDG 12 — Responsible Consumption and Production:** The project's primary alignment is promoting more responsible use of food resources and raising awareness of food waste.
- **SDG 2 — Zero Hunger:** The project may contribute indirectly by making surplus-food coordination easier, but the prototype alone does not establish food-security outcomes.

Do not claim quantified reductions in waste, emissions or hunger without measured data and a defensible method.

## 6. Scope

### Included
- Responsive single-page interface
- Create a food listing
- Required-field validation and collection-time validation
- Search and status filter
- Listing details dialog
- Simulated reserve, release, collected and expired states
- Dashboard counts
- CSV export
- LocalStorage persistence in the same browser

### Not included
- User accounts or roles
- Server/API/database
- Cross-device or real-time synchronization
- Verified provider identity
- Notifications or messaging
- Food-safety certification or legal compliance checks
- Automatic donation matching

## 7. Technology stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure, forms, accessible content |
| CSS3 | Layout, responsive styling and visual design |
| Vanilla JavaScript | Validation, filtering, status updates and metrics |
| LocalStorage | Demo persistence in the current browser |
| CSV Blob download | Exporting current browser data |

No external JavaScript library or build tool is required.

## 8. System design

The browser renders the page from `index.html`, styles it using `style.css`, and executes interactions in `script.js`. JavaScript reads and writes listing records to LocalStorage, then refreshes the listing cards and dashboard. Because LocalStorage belongs to the browser profile, different users do not share the same dataset.

See `WORKFLOW.md` for the workflow and architecture diagrams.

## 9. Data model

Each listing stores:
- `id`: unique prototype identifier
- `foodName`: name of the food
- `provider`: provider or canteen name
- `portions`: number of portions
- `category`: food category
- `pickupLocation`: collection point
- `readyTime`: time food is ready
- `deadline`: collection deadline
- `allergens`: allergen/handling notes
- `contact`: collection instructions
- `status`: Available, Reserved, Collected or Expired
- `createdAt`: creation timestamp

## 10. Main workflow

1. Provider fills in the listing form.
2. Client-side validation checks required fields, portion count and time ordering.
3. Listing is saved in LocalStorage and displayed in the food grid.
4. Visitor searches or filters the listing and opens its details.
5. Visitor simulates a reservation.
6. The listing can be marked collected, released or expired.
7. Dashboard counts recalculate from the saved listing records.

## 11. Food safety, privacy and ethics

- Providers must follow campus rules for storage, handling, allergens and distribution.
- Users should not collect food if they are uncertain about safety.
- The prototype does not validate food safety or provider identity.
- Avoid storing personal phone numbers or sensitive data in this demo.
- The prototype is not a replacement for approved campus donation procedures.
- Any real deployment should involve campus administration and appropriate food-safety guidance.

## 12. Testing

Use `TEST_PLAN.md`. Record the actual browser/device, steps, expected result, actual result and pass/fail for every test. Do not mark tests passed until you have run them.

## 13. Limitations and future improvements

**Current limitations:** LocalStorage is browser-specific; no login, server, shared database, provider verification, messaging or automated safety checks are included. The dashboard shows prototype counts, not independently verified impact.

**Future work:** Add a backend API and database, role-based authentication, secure provider workflows, admin moderation, notifications, audit logs, privacy controls, and approved campus food-safety procedures. Consider an institution-approved donation-partner workflow before real deployment.

## 14. Team contributions

Fill this section with the team's actual contributions. Suggested work split (edit to reflect reality):
- Hannu Kumar Gupta: project coordination, integration and demonstration
- Samir Kumar: UI styling and responsive testing
- Akshat Sharma: listing form, validation and food-card interface
- Kumar Vibhuti Ranjan: dashboard, testing and documentation

Do not claim work that a team member did not perform.

## 15. Conclusion

EcoPlate demonstrates a basic digital workflow for posting and tracking surplus campus food. It provides a foundation for discussing how technology can support responsible consumption, while clearly showing the limitations of a local browser prototype. Validation with real stakeholders and a secure shared backend would be needed before operational use.

## 16. Evidence to add before final submission

- Screenshot of homepage
- Screenshot of add-food form with a valid test listing
- Screenshot of browse/search/filter behavior
- Screenshot of reservation and collected status
- Screenshot of dashboard after test data is added
- Actual test results
- Genuine stakeholder feedback if required by the course
- Source-code repository link, if required
