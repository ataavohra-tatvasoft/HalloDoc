# Project: HalloDoc

## Note:

**This repository is of backend code only.**

**For Front-End Integration, integrate below repository and configure accordingly.**

[Front-End Repository Link](https://github.com/Abhay-tatva/Hallo-Doc-App.git)

## Description:

**The HalloDoc platform 🏥 offers:**

- Online doctor consultations and diagnostics services
- A valuable tool for doctors to enhance patient care and streamline their work processes
- A user-friendly interface that simplifies tasks for doctors:
  - Convenient access to patient records 📁
  - Efficient management of appointments 📅
  - Secure communication with patients 💬
- Functionality for patients to request care for themselves or on behalf of others

## Badges

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Features:

- **Admin Dashboard:** Easily manage patient and physician records, filter and search requests.

- **Request Management:** Comprehensive controls for handling patient and provider requests.
- **Appointment Scheduling:** Streamlined process for booking and managing appointments.

- **Role Management:** Flexible role creation and assignment for user-specific access.

- **Mobile Compatibility:** Optimized views for both desktop and mobile devices.

## User Roles:

- **Admin:**

  - Comprehensive access to patient and physician records
  - Ability to review patient history 📜
  - Manage cases and control requests (cancel/block) 🚫
  - Directed to the landing page showcasing patient requests upon login
  - Filter requests by type and search by patient/requestor names 🔍
  - View requests in grid format on desktop 🖥️ and card view on mobile devices 📱
  - Schedule appointments for providers
  - Manage request actions (view cases, notes, documents) 📄
  - View provider locations
  - Create roles and assign them to specific users

- **Physician:**

  - Manage request states (new, active, pending, to close)
  - View profiles
  - Accept/reject appointments
  - Create own appointments

- **Patient:**
  - View their requests and statuses
  - Access request actions (view notes, documents) 📝

## Technology Stack:

- **Frontend:** Reactjs
  </br>

- **Backend:** Node.js, Typescript
  </br>

- **Database:** MySQL
  </br>

- **API Test:** Postman
  </br>

## Getting Started:

- **Clone the repository.**

- **Install dependencies using `npm install`.**

- **Make `.env` file according to your credentials as they are not available in repository.**

- **Configure the database connection details from:**

  `".env","src/db/config/config.json" & "src/connections/database.ts"`

- **Run migrations and seeders as:**

  `"npm run migrate" & "npm run seed" in root directory"`

- **To undo migrations and seeders, run:**

  `"npm run migrate:undo" & "npm run seed:undo" in root directory`

- **Run the development server using `npm run dev` or `npm run dev:watch` in root directory.**

- **Default users and password for getting started:**

  - Admin: `admin27@yopmail.com` ,
    Password: `Password@6789`

  - Provider: `provider27@yopmail.com` ,
    Password: `Password@6789`

  - Patient: `patient27@yopmail.com` ,
    Password: `Password@6789`

## Contributing

- We welcome contributions! Please follow these guidelines:

  - Fork the repository and create your branch from main
  - Ensure your code follows our coding standards
  - Submit a pull request detailing your changes

## Authors and acknowledgment

- Ataa Vohra - Lead Developer

## License

- This project is licensed under the ISC License. See the LICENSE file for details.

## Project status

**Development is ongoing with regular updates and improvements.**

## Disclaimer:

**This project is for educational purposes only. Always consult with a licensed physician for any medical concerns.**
