# FocusFlow

> A minimal yet powerful Chrome extension for tracking time spent across websites, running distraction-free focus sessions, and reviewing your daily progress with a clean analytics view.

## Overview

**FocusFlow** is a Chrome Extension built with vanilla **HTML, CSS, and JavaScript** using **Manifest V3**. It helps you:

- track the time you spend on websites during the day
- start a focus session and keep only the tabs you choose
- lock your browsing environment during the session
- review completed sessions by date
- inspect your daily activity in a clean, dark, distraction-free UI

The project is intentionally lightweight and dependency-free at runtime, so it stays fast, simple, and easy to maintain.

## Key Features

### Time Tracking
- Tracks active browsing time per domain
- Groups data by date
- Shows a daily summary in the popup
- Provides a one-click reset for today’s browsing data

### Deep Focus Mode
- Lets you select the tabs/domains you want to keep
- Closes the unselected tabs when the session starts
- Stores the active focus session so it can survive popup close/reopen
- Shows a live timer inside the popup
- Lets the user stop the session manually

### Tab Lock / Focus Lock
- Enforces the focus session in the background using the service worker
- Blocks extra tabs while focus mode is active
- Prevents navigation to disallowed domains during the session
- Clears the lock automatically when the session ends

### Session Analytics
- Stores completed sessions by date
- Displays today’s finished sessions in a dedicated analytics page
- Includes a clean graph-ready analytics layout with date labels in `dd-mm` format
- Uses the same dark visual language as the rest of the extension

## Screens

The extension includes three main views:

- **Popup** – daily domain tracking and active session timer
- **Focus Mode** – tab selection, session duration, and session start
- **Analytics** – completed session history and session trend graph area

## How It Works

### 1) Daily browsing tracker
The background service worker listens for tab activation and navigation changes. It records time spent on each domain and stores it in `chrome.storage.local` under a date key.

### 2) Focus session creation
When the user enters Focus Mode:

- the extension lists the open tabs/domains
- the user selects the tabs to keep
- unselected tabs are closed
- the active session is saved to storage
- the lock state is saved so the service worker can enforce it

### 3) Background enforcement
While focus mode is active, the service worker:

- closes extra tabs that are created
- blocks navigation to disallowed domains
- keeps the session rules active even if the popup is closed

### 4) Session completion
When the session ends or the user stops it manually:

- the active session is removed from storage
- the completed session is added to the completed sessions bucket for today
- the lock state is cleared

### 5) Analytics
The analytics page reads `completedSessions` from storage and shows the finished sessions for today. It also includes a graph section prepared for last-7-day trend visualization.

## Storage Structure

The project stores data in `chrome.storage.local`.

### `allDomains`

Daily domain timings are stored like this:

```json
{
  "5/9/2026": {
    "youtube.com": 1245,
    "github.com": 812
  },
  "5/8/2026": {
    "stackoverflow.com": 540
  }
}
```

- each outer key is a date
- each inner key is a domain
- each value is the time spent on that domain

### `activeSession`

Stores the currently running focus session:

```json
{
  "taskName": "Study React",
  "taskDuration": 1800000,
  "startTime": 1710000000000,
  "endTime": 1710001800000,
  "completed": false
}
```

### `completedSessions`

Stores completed focus sessions grouped by date:

```json
{
  "5/9/2026": [
    {
      "taskName": "Study React",
      "taskDuration": 1800000,
      "startTime": 1710000000000,
      "endTime": 1710001800000,
      "completed": true
    }
  ]
}
```

### `focusLock`

Stores the active focus-lock enforcement state:

```json
{
  "isActive": true,
  "allowedDomains": ["github.com", "stackoverflow.com"],
  "allowedTabIds": [123, 124],
  "sessionEndTime": 1710001800000
}
```

## Project Structure

```text
Focus_Flow/
├── focus.html
├── focus.css
├── focus.js
├── focusSessionAnalytics.html
├── focusSessionAnalytics.css
├── focuseSessionAnalytics.js
├── popup.html
├── popup.css
├── popup.js
├── service-worker.js
├── manifest.json
├── icon.png
├── package.json
├── package-lock.json
└── README.md
```

## File Guide

### `popup.html`, `popup.css`, `popup.js`
Main dashboard:

- today’s domain summary
- total active time
- reset button for today
- deep focus entry point
- live active-session timer and stop button

### `focus.html`, `focus.css`, `focus.js`
Focus setup page:

- task name input
- allowed-domain tab selection list
- session duration input
- session start button
- analytics navigation

### `focusSessionAnalytics.html`, `focusSessionAnalytics.css`, `focuseSessionAnalytics.js`
Analytics page:

- today’s completed sessions list
- session trend graph layout
- last 7 day date labels
- dark, minimal presentation

### `service-worker.js`
Background logic:

- tracks domain time
- stores per-day browsing totals
- enforces focus lock behavior
- handles tab activation / update / creation events

### `manifest.json`
Chrome Extension configuration for Manifest V3.

## Installation

### Requirements
- Google Chrome or any Chromium-based browser
- Chrome Extensions developer mode enabled

### Load the extension
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the project folder
5. Pin the extension if you want quick access

## Usage

### Track daily browsing
1. Open the extension popup
2. Browse normally
3. The extension tracks time per domain automatically

### Start a focus session
1. Open **Deep Focus**
2. Enter a task name
3. Select the tabs/domains you want to keep
4. Set the session duration in minutes
5. Start the session

### View analytics
1. Open **Focus Session Analytics** from the focus page
2. Review today’s finished sessions
3. View the graph section prepared for trend visualization

## Retention / Cleanup Behavior

The extension includes cleanup logic so it can keep the stored history compact.

- only the latest 7 date buckets are kept for `allDomains`
- only the latest 7 date buckets are kept for `completedSessions`
- older date buckets are removed during cleanup

This keeps storage small and prevents the extension from holding unnecessary history forever.

## Tech Stack

- **HTML5**
- **CSS3**
- **Vanilla JavaScript**
- **Chrome Extensions Manifest V3**
- **chrome.storage.local**

## Development Notes

- The project does not rely on a runtime framework.
- Styling is custom and intentionally dark/minimal.
- Storage is centralized in `chrome.storage.local`.
- The focus lock is enforced in the background service worker rather than the popup.

## Troubleshooting

### The popup looks empty
- Make sure the extension is loaded unpacked correctly.
- Refresh the extension after file changes.
- Confirm the browser has stored session/domain data.

### The tab lock is not blocking navigation
- Make sure a focus session is active.
- Confirm the service worker is running.
- Check that the selected domains were saved to `focusLock`.

### Analytics shows no sessions
- A session only appears after it is completed or stopped.
- Verify `completedSessions` exists in storage.

## Roadmap Ideas

If you want to keep improving the project, here are natural next steps:

- complete the line graph rendering on the analytics canvas
- add better empty states and session summaries
- show a visual indicator when focus lock is active
- add export/import for session data
- add more detailed charts for weekly performance

## License

No license has been added yet. If you plan to publish this publicly on GitHub, consider adding one before sharing the repository.

## Author

Built as a personal productivity / focus-tracking Chrome extension project.
