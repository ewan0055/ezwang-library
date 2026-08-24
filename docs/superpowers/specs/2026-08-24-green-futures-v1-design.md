# Green Futures Melbourne Version 1 Design

## Scope

Build A1.2 Basic Application Development Version 1 for Business Requirements A and B only. The application extends the Green Futures Melbourne NFP concept designed in A1.1. Category C features - authentication, roles, ratings and advanced security - are deliberately excluded from this version.

## User Outcome

A young person can browse trusted climate-learning and wellbeing resources, view local climate-action events, and submit an event-interest form. Clear validation feedback prevents incomplete or malformed submissions. Stored submissions remain visible after a page refresh.

## Screens and Navigation

- **Home / Resource Hub:** a heading, short mission statement, responsive resource cards and a category filter.
- **Local Events:** responsive event cards sourced from a JavaScript array; each card can populate the event choice in the form.
- **Join an Activity:** a form with name, email and event selection fields; successful submissions are saved and displayed below the form.

Navigation will use simple in-page Vue state and buttons for Version 1. Vue Router, authentication guards and protected routes are not needed for A+B.

## Data and State

- `resources`: an imported JavaScript or JSON array with id, title, category, duration and description.
- `events`: an imported JavaScript or JSON array with id, title, date, suburb, duration and availability.
- `registrations`: a Vue `ref` loaded from Local Storage at application startup and saved after every valid form submission.
- `selectedCategory` and `selectedView`: Vue `ref` values used for filtering and navigation.

## Validation

The registration form uses `v-model`, `@blur`, `@input` and `@submit.prevent`.

- Name: required and at least three non-space characters.
- Email: required and must match a simple email-format pattern.
- Event: required and must match one current event id.

Errors appear next to the relevant field, use `aria-describedby`, and disappear only when that individual field becomes valid.

## Responsiveness

Bootstrap containers, rows and columns create a one-column mobile layout, two-column tablet layout, and three-column desktop resource/event grid. A small local CSS media query keeps navigation buttons readable below 576px.

## Explicitly Deferred (Category C)

- Login/register user accounts
- Role-based pages
- Aggregated user ratings
- Client-side security features beyond the required validation and safe Vue text interpolation

## Acceptance Checklist

- Vue 3 Composition API is used in every new component.
- The layout is demonstrably usable below 576px, from 576-768px, from 992-1200px and above 1400px.
- At least three clear validations are visible during the demo.
- Resource and event cards come from arrays/JSON via `v-for`.
- A valid registration persists in Local Storage after refresh.
- No `v-html` is used; user-entered values render via standard Vue interpolation.
