# RecipeStamp

RecipeStamp is a Base Mini App for stamping recipe-style flavor tags.

The app provides a simple interface for interacting with a deployed Base smart contract. It focuses on three supported recipe stamp actions: Sweet, Spicy, and Fresh.

Repository: https://github.com/MarinaEddie/recipe-stamp.git

## Overview

RecipeStamp is designed as a minimal, focused application for sending specific stamp transactions to a Base contract.

The interface exposes only the supported recipe-style stamp actions:

- `Stamp Sweet`
- `Stamp Spicy`
- `Stamp Fresh`

No other contract write actions are presented in the UI.

## Features

- Base Mini App structure
- Next.js application framework
- TypeScript for safer development
- Wagmi and Viem for contract interaction
- Tailwind CSS for styling
- Minimal interface focused on recipe stamp actions
- Configuration points for deployment-specific values
- Clear separation between app layout and contract configuration

## Tech Stack

- Next.js
- TypeScript
- Wagmi
- Viem
- Tailwind CSS
- Base

## Getting Started

Clone the repository:

```bash
git clone https://github.com/MarinaEddie/recipe-stamp.git
cd recipe-stamp
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local app in your browser using the URL printed by Next.js.

## Available Scripts

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Configuration

Before deploying the app, review the deployment-specific configuration values.

Update the Base Mini App verification placeholder in:

```text
src/app/layout.tsx
```

Replace the contract address placeholder in:

```text
src/lib/contract.ts
```

Replace the ERC-8021 encoded data suffix placeholder in:

```text
src/lib/contract.ts
```

Make sure all deployment-specific values are correct before building or publishing the app.

## Contract Interaction

The UI is intentionally limited to the supported recipe stamp actions.

The available write actions are:

- `Stamp Sweet`
- `Stamp Spicy`
- `Stamp Fresh`

These are the only contract write actions exposed by the interface.

## Project Structure

Key files include:
