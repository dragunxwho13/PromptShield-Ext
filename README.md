# Safe Agent Supervisor

Safe Agent Supervisor is a Chrome/Edge extension prototype for defending AI-assisted browsing against prompt injection in page content. It scans untrusted text, replaces suspicious instruction blocks with a safe notice, and records the event in a local audit panel.

## What the prototype demonstrates

- Detects common prompt injection phrases in page content.
- Neutralizes suspicious hidden or long instruction blocks before a browser-based agent reads them.
- Shows a local activity log in the side panel.
- Lets the user pause/resume the local scanner.

It is a submission demo, not production security software. It does not supervise AI providers that access Gmail, Drive, or other services through their own cloud connectors. The next production component would be an MCP policy gateway that cleans tool output and controls write actions.

## Setup and run instructions

1. Download or clone this repository.
2. In Chrome or Edge, open `chrome://extensions` or `edge://extensions`.
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose the `safe-agent-supervisor` folder.
5. Open the extension from the toolbar to see the side panel.
6. Open `safe-agent-supervisor/demo-page.html` in the browser. Refresh once after loading the extension. The hidden malicious text is replaced and the panel records the event.

## Usage

Use the toggle in the side panel to pause or enable scanning. The prototype keeps its log in local extension storage. Click **Clear** to remove the local activity history.

## Demo video

Record the 45-second walkthrough in [DEMO.md](DEMO.md), upload it as an unlisted YouTube/Drive video, and replace the placeholder link there before submitting.

## Project layout

```text
safe-agent-supervisor/  Loadable Manifest V3 extension
docs/                   Architecture and git-submission report
pitch-deck/             Presentation source and exported deck
```

## Deployment

For a classroom demo, use Chrome/Edge **Load unpacked**. Production deployment would package the extension for the Chrome Web Store and add a separately deployed, authenticated MCP policy gateway.

## Security note

This prototype deliberately does not auto-authorize payments, credential disclosure, external forwarding, or permission changes. Those actions require a gateway-level policy and explicit confirmation.
