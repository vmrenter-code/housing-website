# Housing Website

A housing web application centered around major universities - **UCI INF 124**.

---

## Group Information

**Group ID:** G21

| Name            |
|-----------------|
| Dante Luong     |
| Eliran Avigani  |
| Victor Renteria |
| Yilin Shen      |

---

## Project Overview

We are building a housing web application centered around major universities. Users can select a location to view
housing options nearby and apply filters such as **price**, **number of rooms**, and **distance to campus**. Users can
also update personal preferences, save and share favorite listings, and manage the places they're considering.


## Project Resources

| Resource            | Link                                                                                                                                                                                      |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 🗺️ Site Map        | [Lucidspark](https://lucid.app/lucidspark/33f63c3a-3040-40c1-8e6d-ff406228c629/edit?viewport_loc=-4104%2C-2638%2C8202%2C4576%2C0_0&invitationId=inv_4a80dd52-49fe-4ebe-993b-2b9704c98d30) |
| 🎨 Wireframes       | [Figma](https://www.figma.com/design/tLXWpliFJH1oyB6qIMWQDO/University-Housing-App-%E2%80%93-Wireframes?node-id=2-12&t=XaIHSkMGht9VFrj1-1)                                                |
| 📊 Use Case Diagram | [Lucidchart](https://lucid.app/lucidchart/ef81fe2f-4fe0-4660-b25e-7862c4f6d204/edit?viewport_loc=-535%2C-387%2C3135%2C1552%2C0_0&invitationId=inv_9b166332-984c-4011-9076-e5d69bedafd0)   |
| 📋 Jira Board       | [Jira](https://uci-inf124-team-housing.atlassian.net/jira/software/projects/SCRUM/summary?atlOrigin=eyJpIjoiYTU0NzEyNTZiNzcwNGQ0YWJjNzhkN2RmMGYwMTM2M2UiLCJwIjoiaiJ9)                     |
| 💻 Git Repository   | [GitHub](https://github.com/vmrenter-code/housing-website.git)                                                                                                                            |

---

## Tech Stack

- **Front-end:** React (bootstrapped with [Create React App](https://github.com/facebook/create-react-app))
- **Back-end:** Node.js with Express
- **Database:** MongoDB

---

## Project Structure

```
housing-website/
├── front-end/           # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable UI elements
│   │   ├── pages/       # Route-level components (Home, Listing, etc.)
│   │   ├── hooks/       # Custom hooks
│   │   ├── utils.js     # Helper functions
│   │   ├── App.css
│   │   ├── App.js       # Routing setup
│   │   ├── index.css
│   │   └── index.js     # React Entry point
│   ├── package.json
│   └── package-lock.json
└── back-end/            # Express.js API
    ├── middleware/      # Custom middleware
    ├── models/          # Database schemas
    ├── routes/          # API endpoints
    ├── index.js         # Server Entry point
    ├── package.json
    └── package-lock.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v24 or later recommended)
- npm (v11 or later recommended)

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/vmrenter-code/housing-website.git
cd housing-website

# Install Front-end dependencies
cd front-end
npm install

# Install Back-end dependencies
cd back-end
npm install
```