# Recipe Stamp

Recipe Stamp is a Base Mini App built with Next.js, TypeScript, Wagmi, Viem, and Tailwind CSS.

## Configure

Before production deployment, fill in:

- `src/app/layout.tsx`: replace `PASTE_BASE_DEV_VERIFY_TOKEN` with the base.dev verify token.
- `src/lib/contract.ts`: replace `recipeStampContractAddress` with the deployed Base contract address.
- `src/lib/contract.ts`: replace `erc8021DataSuffix` with the ERC-8021 encoded string.

The only contract write actions in the UI are `Stamp Sweet`, `Stamp Spicy`, and `Stamp Fresh`.

## Run

```bash
npm run dev
npm run build
npm run start
```
