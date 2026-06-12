import type { Address, Hex } from "viem";

export const recipeStampContractAddress =
  "0x66c28ee949585b92652a0e7b65a90995bdc499a4" as Address;

export const buildCode = "bc_qy2b1nn8";

export const erc8021DataSuffix =
  "0x62635f71793262316e6e380b0080218021802180218021802180218021" as Hex;

export const hasContractAddress =
  /^0x[a-fA-F0-9]{40}$/.test(recipeStampContractAddress);

export const hasAttributionSuffix = /^0x([a-fA-F0-9]{2})*$/.test(
  erc8021DataSuffix,
);
