# RecipeStamp

RecipeStamp is a Base Mini App for stamping recipe-style flavor tags.

It is built with Next.js, TypeScript, Wagmi, Viem, and Tailwind CSS.

Repository: https://github.com/MarinaEddie/recipe-stamp.git

## Overview

RecipeStamp provides a simple interface for interacting with a deployed Base smart contract.

The app focuses on three supported stamp actions:

- `Stamp Sweet`
- `Stamp Spicy`
- `Stamp Fresh`

These are the only contract write actions exposed by the UI.

## Features

- Base Mini App structure
- Next.js application framework
- TypeScript for safer development
- Wagmi and Viem for contract interaction
- Tailwind CSS for styling
- Minimal UI focused on recipe stamp actions
- Configuration points for deployment-specific values

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

Before deploying to production, review the project configuration files.

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
