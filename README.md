## Project: HalloDoc

## Description:
**This project aims to develop a web-based platform that facilitates online doctor consultations and diagnostic services. Inspired by the Halodoc platform, it strives to create a user-friendly experience for both doctors and patients.**

## Features:
**Online Doctor Consultation:** Patients can connect with doctors virtually for consultations, reducing the need for physical visits.
**Diagnostics Services:** The platform may integrate with third-party services to enable patients to access diagnostic tests and receive results securely. (Implementation details depend on integration feasibility)

## User Roles:
**Admin:** Manages the platform, including user accounts, patient records, and appointment requests. Can review patient history, manage cases, and control requests (cancel, block).
**Physician:** Offers consultations online, manages patient appointments, accesses patient medical records securely, and communicates with patients through the platform.
**Patient:** Seeks online consultations, requests diagnostic services (if available), manages appointments, and securely communicates with doctors.

## Technology Stack:
**Frontend:** (Reactjs)
**Backend:** (Node.js,)
**Database:** (MySQL)
**API Test:** (Postman)

## Getting Started:
**Clone the repository.**
**Install dependencies using npm install or yarn install.**
**Make config.env, src/connections/database.ts && src/db/config/config.json file according to your credentials if they are not available in repository.**
**Configure the database connection details from:**
"config.env",
"src/db/config/config.json
&&
src/connections/database.ts".
**Run migrations and seeders as:**
"npx sequelize-cli db:migrate
&&
npx sequelize db:seed:all" in src/db directory.
**To undo migrations and seeders, run:**
"npx sequelize-cli db:migrate:undo:all"
&&
"npx sequelize db:seed:undo:all" in src/db directory.
**Run the development server using "npm run dev" in root directory.**
**Default users and password for getting started:**
*Admin: "admin27@yopmail.com"
*Password: "Password@6789"
*Provider: "provider27@yopmail.com"
*Password: "Password@6789"
*Patient: "patient27@yopmail.com"
*Password: "Password@6789"

## Contributing:
**Pull requests are welcome.**
**Please follow the code style guide.**

## License:
**#Currently no licence required.**

## Disclaimer:
**This project is for educational purposes only. Always consult with a licensed physician for any medical concerns.**
