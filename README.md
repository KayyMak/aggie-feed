# AggieFeed Mobile App

## Project overview

This app shows public activities from UC Davis AggieFeed. Tap an activity card to open its details. Use the back button to return to the feed.

The feed shows the activity title and posting organization. The detail page shows:

- Title (`title`)
- Posting organization (`actor.displayName`)
- Activity type (`object.objectType`)
- Publish date (`published`)

The app shows a spinner while loading. If a request fails, it shows an error and a Retry button. Empty feeds show a message.

## Required environment setup

- Node.js 22.13 or newer, with npm. This is the [minimum Node version for Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/).
- Expo Go on your iPhone or Android phone, with support for Expo SDK 57.
- An internet connection to install packages and fetch activities.
- For a local connection, your computer and phone must be on the same Wi-Fi network. A tunnel can help if the network blocks the connection.
- On a physical iPhone, sign in to Expo Go and the computer's Expo CLI with the same free Expo account. See [Expo's sign-in instructions](https://docs.expo.dev/troubleshooting/expo-go-sign-in-required/).

No API key, `.env` file, database, or global Expo CLI installation is needed.

## Setup instructions

Open the project folder containing `package.json` and install its packages:

```sh
npm install
```

For iPhone testing, sign in on your computer:

```sh
npx expo login
```

Then sign in to Expo Go on your iPhone with the same account.

## How to run the app

Start the development server:

```sh
npm start
```

Keep the terminal running. On iPhone, scan the terminal's QR code with the Camera app. On Android, scan it using Expo Go's QR scanner.

If the phone cannot connect over Wi-Fi, stop the server with Ctrl+C and try a tunnel:

```sh
npx expo start --go --tunnel --clear
```

Scan the new QR code. The tunnel helper, `@expo/ngrok`, is included in the project's development packages, so `npm install` installs it locally. A tunnel needs internet on both devices and is slower than a local connection. See [Expo's connection guide](https://docs.expo.dev/get-started/start-developing/).

Press `r` in the terminal to reload the app. Press Ctrl+C to stop the server.

On Windows, if PowerShell blocks `npm` or `npx`, use `npm.cmd` and `npx.cmd` instead. For example:

```powershell
npm.cmd install
npx.cmd expo start --go --tunnel --clear
```

You can also use an Android emulator with `npm run android`. An iOS simulator needs a Mac and Xcode; run `npm run ios` there. Neither is needed for the phone setup above.

## Libraries used

| Library | Purpose |
| --- | --- |
| React 19 | Components and shared data through React Context |
| React Native 0.86 | Native lists, text, buttons, and layout |
| Expo SDK 57 | Development tools and phone testing |
| Expo Router | Feed and detail routes, with back navigation |
| react-native-screens | Native screens used by navigation |
| react-native-safe-area-context | Safe area support for navigation |
| expo-linking | App links used by Expo Router |
| expo-constants | App information used by Expo tools |
| expo-status-bar | Status bar appearance |
| TypeScript | Types for activities and components |
| ESLint and eslint-config-expo | Code checks |
| @expo/ngrok | Tunnel connections during development |

The app uses the built-in `fetch` API for requests and Node's built-in test runner for tests.

## Project structure

```text
src/
  api/activities.ts          Request the public feed
  app/_layout.tsx           Set up navigation and shared data
  app/index.tsx             Activity list
  app/activity/[id].tsx      Selected activity details
  components/feed-error.tsx  Error message and Retry button
  context/activities.tsx     Shared activities, loading, error, and retry
  types/activity.ts         Activity type
  utils/parse-activities.ts  Check API data before storing it
tests/                      Request and data-check tests
```

## Code checks

Run these commands from the app folder:

```sh
npm run lint
npx tsc --noEmit
npm test
```

Tests cover malformed responses, missing fields, unusable titles and IDs, invalid publish dates, and new requests after HTTP or network failures. They use mocked requests and do not require access to AggieFeed.

## Assumptions and data handling

The public feed comes from:

```text
https://aggiefeed.ucdavis.edu/api/v1/activity/public?s=0&l=25
```

- The response must be an array. An unexpected response format shows an error.
- Activities need a nonempty string ID and title. Entries without them are skipped.
- Organization names and activity types must be nonempty strings. Missing or wrongly typed values are hidden.
- Publish dates must be nonempty strings that JavaScript can parse as dates. Invalid values are hidden.
- Both screens use the same data in React Context. Opening details does not make another API request.
- Retry sends a new request. The spinner appears until it finishes. Another failure shows the error and Retry button again.

## Known issues and limitations

- Only the 25 activities returned by this request are loaded. There is no pagination.
- A direct detail link works only if its activity is in the loaded feed. Otherwise, the app shows an unavailable message and a link back to the feed.
- Data is kept in memory. Restarting the app fetches the feed again; there is no saved offline copy.
- Publish dates show the original API timestamp rather than a formatted local date.
- Retries are manual. There is no automatic refresh or retry.
- The app targets iOS and Android. A browser version is not included.
- The app has been opened on a physical iPhone during development. Android behavior still needs a device check.
