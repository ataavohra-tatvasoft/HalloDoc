# Project: HalloDoc

## Note:

**This repository is of backend code only.**

**For Front-End Integration, integrate below repository and configure accordingly.**

[Front-End Repository Link](https://github.com/Abhay-tatva/Hallo-Doc-App.git)
</br>

## Description:

**This project aims to develop a web-based platform that facilitates online doctor consultations and diagnostic services. Inspired by the Halodoc platform, it strives to create a user-friendly experience for both doctors and patients.**

## Badges

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Features:

**Online Doctor Consultation:** Patients can connect with doctors virtually for consultations, reducing the need for physical visits.
</br>

**Diagnostics Services:** The platform may integrate with third-party services to enable patients to access diagnostic tests and receive results securely. (Implementation details depend on integration feasibility).
</br>

## User Roles:

- **Admin:** Manages the platform, including user accounts, patient records, and appointment requests. Can review patient history, manage cases, and control requests (cancel, block).
  </br>

- **Physician:** Offers consultations online, manages patient appointments, accesses patient medical records securely, and communicates with patients through the platform.
  </br>

- **Patient:** Seeks online consultations, requests diagnostic services (if available), manages appointments, and securely communicates with doctors.
  </br>

## Technology Stack:

- **Frontend:** Reactjs
  </br>

- **Backend:** Node.js, Typescript
  </br>

- **Database:** MySQL, WAMPP
  </br>

- **API Test:** Postman
  </br>

## Getting Started:

- **Clone the repository.**

- **Install dependencies using npm install or yarn install.**

- **Make config.env, src/connections/database.ts && src/db/config/config.json file according to your credentials if they are not available in repository.**

- **Configure the database connection details from:**
  `"config.env","src/db/config/config.json" & "src/connections/database.ts"`

- **Run migrations and seeders as:**

  `"npx sequelize-cli db:migrate" & "npx sequelize db:seed:all" in src/db directory"`

- **To undo migrations and seeders, run:**

  `"npx sequelize-cli db:migrate:undo:all" & "npx sequelize db:seed:undo:all" in src/db directory`

- **Run the development server using "npm run dev" in root directory.**

- **Default users and password for getting started:**

  - Admin: `admin27@yopmail.com` ,
    Password: `Password@6789`

  - Provider: `provider27@yopmail.com` ,
    Password: `Password@6789`

  - Patient: `patient27@yopmail.com` ,
    Password: `Password@6789`

## Contributing

- We welcome contributions! Please follow these guidelines:

  - Fork the repository and create your branch from main.
  - Ensure your code follows our coding standards.
  - Submit a pull request detailing your changes.

## Authors and acknowledgment

- Ataa Vohra - Lead Developer

## License

- This project is licensed under the ISC License. See the LICENSE file for details.

## Project status

**Development is ongoing with regular updates and improvements.**

## Disclaimer:

**This project is for educational purposes only. Always consult with a licensed physician for any medical concerns.**
