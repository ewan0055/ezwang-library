# Green Futures Melbourne Version 2 Design

## Goal

Extend the existing A1.2 Vue 3 application with the Version 2 Business
Requirements C.1 to C.4 while retaining the Resource Hub, Events, activity
registration, responsiveness, validations, and dynamic data already present.

## Scope

The application remains a client-side Vue 3 Composition API project. Firebase,
a server, and external authentication services are intentionally out of scope.
Local Storage provides persistence for demonstration purposes only.

## Roles

### Community Member

- Registers a new account and signs in.
- Views resources and their aggregate rating scores.
- Adds a one-to-five-star rating and a short text review to a resource.
- Views their own account details and reviews.

### Coordinator

- Signs in with a seeded demonstration account.
- Accesses a Coordinator Dashboard that a Community Member cannot open.
- Views all resource reviews and aggregate rating summaries.

The seeded Coordinator account is:

```text
Email: coordinator@greenfutures.org.au
Password: Green2026!
```

New registrations always receive the Community Member role; the registration
form does not expose a way to create a Coordinator account.

## Authentication and Authorisation

- `authService.js` owns user registration, sign-in, sign-out, and Local
  Storage persistence.
- Passwords are hashed with browser `crypto.subtle` before storage. The app
  labels this as a client-side demonstration, not production authentication.
- A current-session object contains only the authenticated user's safe public
  fields and role.
- Protected page rendering checks the current session and role. If a user is
  not authorised, the app displays a clear access-denied state instead of the
  Coordinator Dashboard.

## Rating and Review Data

- Each review includes `id`, `resourceId`, `userId`, `authorName`, `score`,
  `comment`, and `createdAt`.
- Reviews persist under the Local Storage key `gfmReviews`.
- Resource cards derive their average score and review count from all reviews
  whose `resourceId` matches the resource.
- A Community Member may submit one review per resource and update that review
  later. This avoids duplicate submissions by the same account.
- The Coordinator Dashboard shows all reviews and per-resource averages.

## Security Controls

- Vue interpolation renders user review text as text; the application will not
  use `v-html` for comments or profiles.
- Registration validates name length, email format, password strength, and
  duplicate email addresses.
- Review input validates score range, comment length, and rejects angle
  brackets before persistence. This complements Vue's safe text rendering.
- Password values never appear in the UI after form submission and are not
  placed in the session object.
- Code that uses browser cryptography or Local Storage for this assignment is
  labelled as beyond Week 5 / A1.3-specific functionality.

## Components and Data Flow

```text
App.vue
  ├─ GfmNavigation.vue
  ├─ ResourceHub.vue
  │   └─ ResourceReviewForm.vue
  ├─ EventList.vue
  ├─ ActivityRegistrationForm.vue
  ├─ AuthForm.vue
  ├─ MemberDashboard.vue
  └─ CoordinatorDashboard.vue

authService.js  -> users and current session in Local Storage
reviewService.js -> reviews and aggregate calculations in Local Storage
gfmData.js      -> static resources and events
```

## Acceptance Checks

1. A new Community Member can register, sign in, sign out, and receive
   validation feedback for invalid input.
2. The seeded Coordinator can sign in and see the Coordinator Dashboard.
3. A Community Member cannot view the Coordinator Dashboard or create a
   Coordinator account.
4. A signed-in Community Member can rate a resource and see its average score
   change after the review is saved.
5. Reviews and accounts remain after refresh through Local Storage.
6. A comment such as `<img src=x onerror=alert(1)>` is rejected and is never
   inserted as HTML.
7. The main views remain usable at desktop and approximately 390px mobile
   width.

## Deliberate Limits

Client-side Local Storage and client-side route checks are suitable for this
course demonstration but are not secure enough for a production service. A
real deployment would require server-side authentication, role enforcement,
and protected data storage.
