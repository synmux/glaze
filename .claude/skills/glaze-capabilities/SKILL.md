---
name: glaze-capabilities
description: What Glaze itself can do outside the coding agent — publishing, store screenshots, the app icon/name, sharing, the Store, project management, credits/billing, teams. Load when the user asks how or where to do something that Glaze handles rather than their app's code — how to publish, share, or submit their app, where screenshots or promotional/marketing images for the store listing should be made, how to change the app icon or name, install or update Store apps, archive/delete/export a project, or manage credits, plans, or teams. Answer by pointing them to the right Glaze flow instead of building anything. Not for features inside the user's own app — that's normal app work.
---

# Glaze Capabilities (Beyond the Agent)

Glaze the app provides these features itself — outside the user's app code and outside you. Never implement them in the app or produce store/marketing assets yourself — store screenshots come from the publish flow's Capture App, not from you launching the app. Answer in one short message that points the user to the right place in Glaze — no project exploration, no builds, no tool use. (This doesn't restrict live-inspection previews when you're debugging or verifying your own work.)

The main window's sidebar: **My Projects** (the user's created apps), **Store**, and **Installed Apps**. Settings opens from the account item.

## Publishing an app

- **My Projects** → select the app → **Publish** (or **Publish Update** if it's already published).
- The running app's floating toolbar also has a Share button that opens the same flow.
- The publish form covers: app icon and name, tagline (with AI generation), full description, "What's new" changelog, screenshots, and the publish target — public store, unlisted link, or organization.

## Store screenshots

The publish form has a **Screenshots** card — this is where store screenshots are made:

- **Capture App** opens the app with a floating capture overlay; each shot is framed to 16:9 and added to the listing automatically.
- Users can also drag & drop or upload image files (PNG, JPEG, GIF, WebP).
- Up to 6 screenshots per listing.

If the user asks "where should screenshots be made" or "how do I add screenshots", the complete answer is the pointer above. Do not build capture features, add screenshot code, or produce the listing images yourself.

## App icon & name

Clicking the app icon (pencil badge) in the app's detail pane in **My Projects** or in the publish form opens the icon editor — it generates AI icon variants (optionally from a prompt) or accepts an uploaded image. The app's display name is edited inline in the same places. Neither can be changed from the app's code.

## Managing projects

In **My Projects**, each app's context menu and detail pane offer: Open App, Open with Agent, editing the icon, configuring MCP servers for the agent, Copy Share Link (published apps), Export Project (a portable `.glaze` file), Archive, Delete, and Unpublish. The detail pane also reveals the project directory in Finder.

## Store & installed apps

The **Store** is for browsing, searching, and installing apps other people published. **Installed Apps** lists them, surfaces available updates, and can update them all at once. Store apps update through Glaze — the user doesn't edit their code.

## Account, credits & teams

Settings covers the user's profile (username, avatar), credits usage and billing/plans, inviting friends (referral credits), creating teams/organizations (for publishing apps to an org), and AI access permissions. Questions about credits running out, plans, or team sharing belong here — not in code.

## Example answer

> Store screenshots are made in Glaze's publish flow: open **My Projects**, select your app, and click **Publish** (or **Publish Update**). In the **Screenshots** section, **Capture App** opens your app with a capture overlay and frames each shot to 16:9 for you — or drag in your own images (up to 6).

(If the user instead wants one of these as a _feature inside their own app_ — e.g. a screenshot-capture tool — that's normal app work; this skill doesn't apply.)
