# Eminent Enterprises — Android app

The Expo (React Native) mobile app for Eminent Enterprises and Buraq Eminent Constructors. It shares the website's Supabase project, design tokens, brand copy, and calculator logic, so listings, prices, and calculator results match the site.

- **Expo SDK 58**, Expo Router, TypeScript
- **Package name:** `com.eminentpak.app`. This becomes permanent once the app is published on Google Play.

## What's in the app

| Tab | Contents |
|---|---|
| Home | Hero search, pathways, featured listings, price-by-area, Buraq work, insights, contact CTA |
| Search | Live Supabase listings with keyword search, Buy/Rent, a full filter sheet, and sort options |
| Saved | Shortlist kept on the device, a compare bar, and "ask about these on WhatsApp" |
| Tools | Eminent Estimate, Mortgage, Area Converter, Construction Cost, and Material calculators |
| More | Projects, area guides, insights, overseas, services, Buraq, list your property, about, contact, legal |

The property detail screen has a gallery and lightbox, specs, features, floor plans, open in Maps, an area converter, the consultant, an instalment estimate, similar listings, and a sticky Call and WhatsApp bar.

## How the app shares code with the website

- **Listings** come straight from the Supabase `properties` table, read with the public anon key. Row Level Security keeps that key read-only. When admins add or edit listings on the website, the app shows the changes after a pull-to-refresh, or automatically within 5 minutes.
- **Enquiries** are posted to the website's `/api/leads` endpoint, so app and web leads go through the same place.
- **Shared modules** are copied from the website and imported with the same `@/` paths: `src/types`, `src/data`, `src/config/site.ts`, `src/lib/{area,format-pkr,mortgage,valuation,construction-estimate,material-estimate,whatsapp,...}`. If you change brand copy, contact numbers, rates, or calculator logic on the website, copy the same change into `mobile/src`.
- **Admin** stays on the website. The More tab links to `/admin` in an in-app browser. This keeps the website's cache revalidation working on every edit.

## Run it on your phone (Expo Go)

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on Android. The phone and the PC must be on the same Wi-Fi network. If they aren't, use `npx expo start --tunnel`.

The Supabase values come from `mobile/.env`, which is git-ignored. To create it, copy `.env.example` and fill in the same `NEXT_PUBLIC_SUPABASE_*` values the website uses.

## Build a test APK

You need a free Expo account and the EAS CLI (`npm i -g eas-cli`, or use `npx eas-cli@latest`).

```bash
cd mobile
eas login
eas init                 # first time only: links the project and writes its projectId into app.json
npm run build:apk        # eas build --platform android --profile preview
```

When the build finishes, EAS shows a link and a QR code. Open the link on an Android phone to install the APK.

## Publish to Google Play

1. Build the release bundle: `npm run build:aab` (production profile, `.aab`). EAS creates and stores the upload keystore for you. Back it up with `eas credentials`.
2. In the [Google Play Console](https://play.google.com/console), create the app and complete the store listing, content rating, target audience, and the **Data safety** form:
   - The app collects the name, phone number, and email that a user types into an enquiry form. This data goes to the website's `/api/leads` endpoint.
   - There's no login, tracking, or advertising SDK. Saved listings stay on the device.
3. Use the website's privacy policy URL: `https://www.eminentpak.com/privacy`.
4. Upload the `.aab` to **Internal testing** first. You can also run `eas submit -p android`, which needs a Play service-account key. When testing passes, promote the build to Production.
5. For each update, run `npm run build:aab` again. `versionCode` increments automatically (`autoIncrement` in `eas.json`). Bump `version` in `app.json` for user-facing releases.

## Scripts

```bash
npm start            # Expo dev server
npm run typecheck    # tsc --noEmit
npm run lint         # expo lint
npm run build:apk    # installable test APK (EAS)
npm run build:aab    # Play Store bundle (EAS)
```

## Project layout

```
mobile/
  app.json, eas.json        app config and EAS build profiles (APK / AAB)
  assets/images/            app icon, adaptive icon, splash (EE brand mark)
  src/app/                  screens (Expo Router; every file is a route)
    (tabs)/                 Home, Search, Saved, Tools, More
    property/[slug].tsx     listing detail
    filters.tsx, enquire.tsx  modal sheets
    tools/, projects/, construction/, services/, areas/, insights/ …
  src/components/           UI kit (ui, form, layout, cards, gallery, …)
  src/theme/                design tokens mirrored from the website's globals.css
  src/state/                listings cache, saved/compare (AsyncStorage), filters
  src/lib/                  Supabase client, repository, API, links + shared logic
```
