"use client";

import { QueryClient } from "@tanstack/react-query";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({
      target: "metaMask",
    }),
    injected({
      target: "okxWallet",
    }),
    injected(),
    coinbaseWallet({
      appName: "Recipe Stamp",
      preference: "all",
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

export const queryClient = new QueryClient();
