# Y-Spot

**Find your study spot on campus.**

Y-Spot is a mobile app that helps students discover study spaces on Yonsei's Sinchon campus. You can see what spaces exist, pick one that fits what you need right now, and find your way there.

## Features

- **Discover:** browse spots by what you want to do (*Focus Alone · Group Work · Relax and Talk*), search in English or 한글, and filter by *Open now* or *Bookable*
- **Filters:** narrow results by noise level, group size, amenities, and nearby department
- **Spot details:** noise, hours, access rules, typical busyness by hour, and directions
- **Campus map:** a simple schematic map showing which building each spot is in
- **Saved:** star your favorite spots and suggest new ones

## Tech stack

[Expo](https://expo.dev) (React Native) · TypeScript · [Expo Router](https://docs.expo.dev/router/introduction/) · [Supabase](https://supabase.com)

## Getting started

You need [Node.js](https://nodejs.org) 23.6 or newer.

```bash
git clone <repo-url>
cd Y-Spot
npm install
npm start
```

Scan the QR code with the **Expo Go** app to run Y-Spot on your phone, or press `w` to open it in a browser.

The app runs on bundled sample data by default. To connect a Supabase backend, copy `.env.example` to `.env` and fill in your project URL and anon key.

## Note

Spot details and busyness patterns are sample data for now and may not reflect actual campus conditions.
