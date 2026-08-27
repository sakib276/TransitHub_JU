# Vehicle Status Update — Frontend Feature

This module implements the **Driver Vehicle Status Update** feature of the TransitHub JU project.

The feature allows drivers to view their vehicle's current status and update it based on its operational condition.

## Feature Scope

- View current vehicle status
- Select vehicle status:
  - `AVAILABLE`
  - `BUSY`
  - `OFFLINE`
- Validate vehicle status updates
- Require a stand when selecting `AVAILABLE`
- Display vehicle status information
- Provide status-related user feedback
- Separate UI and service logic for future backend integration

## Structure

```text
vehicle-status/
├── components/
│   ├── status-info.jsx
│   ├── status-selector.jsx
│   └── vehicle-status-card.jsx
├── pages/
│   └── vehicle-status-page.jsx
├── services/
│   └── vehicle-status-service.js
├── styles/
│   └── vehicle-status.css
├── tests/
│   └── vehicle-status-service.test.js
└── index.js

Followed Coding Standards

This feature follows the project's defined coding standards:

- camelCase for variables and functions
- PascalCase for React components and classes
- CONSTANT_CASE for constants
- kebab-case for filenames
- 2-space indentation
- Consistent spacing and curly braces
- JSDoc for public functions and methods

Testing Done

Vitest is used to test vehicle-status validation, including:

-Valid AVAILABLE status with a stand
-Invalid AVAILABLE status without a stand
-Valid BUSY status
-Valid OFFLINE status
-Empty status validation

