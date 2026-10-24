# EcoPlate Test Plan

Run these tests in the browser and fill the result column based on what actually happens.

| ID | Test | Steps | Expected result | Actual result |
|---|---|---|---|---|
| T01 | Initial load | Open `index.html` in a browser | Homepage, sample cards and dashboard appear | To be tested |
| T02 | Add valid listing | Fill every required field; choose a future ready time and later deadline; accept safety checkbox; submit | Listing appears in Browse food and total count increases | To be tested |
| T03 | Required fields | Submit with a required field blank | Browser blocks submission and indicates the missing field | To be tested |
| T04 | Invalid portions | Enter 0 or a negative portion count | Browser validation prevents submission | To be tested |
| T05 | Deadline before ready time | Choose a deadline earlier than or equal to ready time | Form displays an error and does not create the listing | To be tested |
| T06 | Past deadline | Set the deadline in the past | Form rejects the listing | To be tested |
| T07 | Search | Search for a food name, provider or location | Matching cards are shown | To be tested |
| T08 | Status filter | Change status filter | Only matching status cards appear | To be tested |
| T09 | View details | Click Details on a listing | Dialog displays listing and collection details | To be tested |
| T10 | Reserve listing | Reserve an Available listing and confirm | Status becomes Reserved; available count updates | To be tested |
| T11 | Mark collected | Open a Reserved listing and mark collected | Status becomes Collected; collected and portion metrics update | To be tested |
| T12 | Release reservation | Release a Reserved listing | Status returns to Available | To be tested |
| T13 | Expired deadline | Wait for a deadline to pass or use a test record with a past deadline | Listing displays Expired status | To be tested |
| T14 | Persistence | Refresh the page after adding a listing | Listing remains in the same browser | To be tested |
| T15 | CSV export | Click Export listings CSV | CSV file downloads and includes listing data | To be tested |
| T16 | Responsive layout | Test narrow mobile viewport and desktop | Content remains readable and controls usable | To be tested |
| T17 | Demo-data disclosure | Review sample listings | Team explains they are illustrative demo records | To be checked |
| T18 | Data scope | Open the project in a different browser/profile | Explain that LocalStorage data is not synchronized | To be checked |

## Test record template

- Date/time:
- Browser and version:
- Device/viewport:
- Test ID:
- Steps performed:
- Expected result:
- Actual result:
- Pass/Fail:
- Screenshot or evidence filename:
- Tester:
