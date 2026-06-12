"use client";

import {
  CheckCircle2,
  ChefHat,
  Flame,
  Leaf,
  Loader2,
  Power,
  ReceiptText,
  Sparkles,
  Sprout,
  Wallet,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  BaseError,
  type Address,
  UserRejectedRequestError,
} from "viem";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContracts,
  useWriteContract,
} from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { recipeStampAbi } from "@/lib/abi";
import {
  erc8021DataSuffix,
  hasAttributionSuffix,
  hasContractAddress,
  recipeStampContractAddress,
} from "@/lib/contract";
import { wagmiConfig } from "@/lib/wagmi";

type StampKind = "Sweet" | "Spicy" | "Fresh";
type StatusKind = "Ready" | "Pending" | "Confirmed" | "Failed" | "Request rejected";

const zeroAddress = "0x0000000000000000000000000000000000000000" as Address;

const stampActions: Array<{
  kind: StampKind;
  method: "stampSweet" | "stampSpicy" | "stampFresh";
  icon: typeof Sparkles;
  accent: string;
  copy: string;
}> = [
  {
    kind: "Sweet",
    method: "stampSweet",
    icon: Sparkles,
    accent: "bg-[#d84a3a] text-white shadow-[#d84a3a]/25",
    copy: "Jam, citrus, and a crisp red seal.",
  },
  {
    kind: "Spicy",
    method: "stampSpicy",
    icon: Flame,
    accent: "bg-[#236b45] text-white shadow-[#236b45]/25",
    copy: "Pepper heat with a stainless finish.",
  },
  {
    kind: "Fresh",
    method: "stampFresh",
    icon: Leaf,
    accent: "bg-[#0052ff] text-white shadow-[#0052ff]/25",
    copy: "Garden herbs and a clean blue mark.",
  },
];

function shortAddress(address?: Address) {
  if (!address) {
    return "Not connected";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatCount(value: unknown) {
  return typeof value === "bigint" ? value.toString() : "0";
}

function friendlyError(error: unknown): StatusKind {
  console.error(error);

  if (
    error instanceof UserRejectedRequestError ||
    (error instanceof BaseError &&
      error.walk((cause) => cause instanceof UserRejectedRequestError))
  ) {
    return "Request rejected";
  }

  return "Failed";
}

export default function Home() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [lastAction, setLastAction] = useState<StampKind>();
  const [activity, setActivity] = useState<StatusKind>("Ready");

  const contractAddress = hasContractAddress
    ? recipeStampContractAddress
    : zeroAddress;

  const reads = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi: recipeStampAbi,
        functionName: "userSweets",
        args: [address ?? zeroAddress],
      },
      {
        address: contractAddress,
        abi: recipeStampAbi,
        functionName: "userSpicies",
        args: [address ?? zeroAddress],
      },
      {
        address: contractAddress,
        abi: recipeStampAbi,
        functionName: "userFreshes",
        args: [address ?? zeroAddress],
      },
      {
        address: contractAddress,
        abi: recipeStampAbi,
        functionName: "totalSweets",
      },
      {
        address: contractAddress,
        abi: recipeStampAbi,
        functionName: "totalSpicies",
      },
      {
        address: contractAddress,
        abi: recipeStampAbi,
        functionName: "totalFreshes",
      },
    ],
    query: {
      enabled: hasContractAddress,
      refetchInterval: 6000,
    },
  });

  const counts = useMemo(() => {
    const values = reads.data?.map((entry) =>
      entry.status === "success" ? entry.result : 0n,
    );

    return {
      mySweet: formatCount(values?.[0]),
      mySpicy: formatCount(values?.[1]),
      myFresh: formatCount(values?.[2]),
      totalSweet: formatCount(values?.[3]),
      totalSpicy: formatCount(values?.[4]),
      totalFresh: formatCount(values?.[5]),
    };
  }, [reads.data]);

  async function stamp(kind: StampKind, method: (typeof stampActions)[number]["method"]) {
    if (!isConnected || !hasContractAddress || !hasAttributionSuffix) {
      setActivity("Failed");
      return;
    }

    setLastAction(kind);
    setActivity("Pending");

    try {
      const hash = await writeContractAsync({
        address: recipeStampContractAddress,
        abi: recipeStampAbi,
        functionName: method,
        dataSuffix: erc8021DataSuffix,
      });

      await waitForTransactionReceipt(wagmiConfig, { hash });
      setActivity("Confirmed");
      await reads.refetch();
    } catch (error) {
      setActivity(friendlyError(error));
    }
  }

  const walletStatus = isConnected ? "Connected" : "Ready to connect";
  const appReady = isConnected && hasContractAddress && hasAttributionSuffix;

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f1e7] text-[#1f2528]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 rounded-[8px] border border-[#d8cdbb] bg-[#fffaf0]/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#0052ff] text-white">
              <ChefHat size={24} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-normal">Recipe Stamp</h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-[#596166]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#236b45]" />
                <span>{walletStatus}</span>
                <span className="hidden sm:inline">/</span>
                <span className="font-mono">{shortAddress(address)}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setWalletMenuOpen((open) => !open)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#1f2528] px-4 text-sm font-bold text-white transition hover:bg-[#333b40] sm:w-auto"
              aria-label="Open wallet options"
            >
              <Wallet size={18} aria-hidden="true" />
              {isConnected ? "Wallet Options" : "Connect Wallet"}
            </button>

            {walletMenuOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-full min-w-64 rounded-[8px] border border-[#d8cdbb] bg-white p-2 shadow-xl sm:w-72">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    type="button"
                    onClick={() => {
                      connect({ connector });
                      setWalletMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-[6px] px-3 py-2 text-left text-sm font-semibold text-[#1f2528] hover:bg-[#f7f1e7]"
                  >
                    <span>{connector.name}</span>
                    {isConnecting ? (
                      <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                    ) : (
                      <Power size={16} aria-hidden="true" />
                    )}
                  </button>
                ))}
                {isConnected ? (
                  <button
                    type="button"
                    onClick={() => {
                      disconnect();
                      setWalletMenuOpen(false);
                    }}
                    className="mt-1 flex w-full items-center justify-between rounded-[6px] px-3 py-2 text-left text-sm font-semibold text-[#b63124] hover:bg-[#fff0ec]"
                  >
                    <span>Disconnect</span>
                    <X size={16} aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[430px] rounded-[8px] border border-[#c9bfaf] bg-[#e9dfcf] p-4 shadow-inner">
            <div className="absolute inset-x-4 top-4 h-3 rounded-full bg-[#b7bdc0]" />
            <div className="mt-7 grid gap-4 md:grid-cols-[1fr_0.72fr]">
              <div className="rounded-[8px] border border-[#d8cdbb] bg-[#fffaf0] p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-[#d84a3a]">
                    Kitchen Counter
                  </span>
                  <ReceiptText size={18} className="text-[#596166]" aria-hidden="true" />
                </div>
                <div className="border-y border-dashed border-[#d8cdbb] py-4">
                  <p className="text-4xl font-black leading-none tracking-normal">
                    Onchain recipe cards with three clean stamps.
                  </p>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#596166]">
                    No points, no token, no rewards, no limits. Each mark records
                    only your personal count and the total count on Base.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {["Tomato", "Basil", "Cream"].map((tag, index) => (
                    <div
                      key={tag}
                      className="rounded-[8px] border border-[#d8cdbb] bg-white px-2 py-3 text-center text-xs font-bold text-[#596166]"
                    >
                      <span
                        className={`mx-auto mb-2 block h-3 w-8 rounded-full ${
                          index === 0
                            ? "bg-[#d84a3a]"
                            : index === 1
                              ? "bg-[#236b45]"
                              : "bg-[#f7f1e7]"
                        }`}
                      />
                      {tag}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[8px] border border-[#7f8587] bg-[#b7bdc0] p-4 text-[#1f2528]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase">Freshness Meter</span>
                    <Sprout size={18} aria-hidden="true" />
                  </div>
                  <div className="mt-5 h-4 rounded-full bg-[#6e777b] p-1">
                    <div className="h-full w-4/5 rounded-full bg-[#236b45]" />
                  </div>
                  <p className="mt-3 text-sm font-semibold">Base gas only</p>
                </div>

                <div className="rounded-[8px] border border-[#d8cdbb] bg-white p-4">
                  <span className="text-xs font-black uppercase text-[#596166]">
                    Ingredient Rail
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Jam", "Pepper", "Mint", "Sea Salt", "Oil", "Citrus"].map(
                      (item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[#d8cdbb] bg-[#fffaf0] px-3 py-1 text-xs font-bold"
                        >
                          {item}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="rounded-[8px] border border-[#d8cdbb] bg-white p-4">
              <h2 className="text-lg font-black tracking-normal">Stamp Pad</h2>
              <p className="mt-1 text-sm leading-6 text-[#596166]">
                These are the only buttons that send contract writes.
              </p>
              <div className="mt-4 grid gap-3">
                {stampActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.kind}
                      type="button"
                      disabled={!appReady || isWriting}
                      onClick={() => stamp(action.kind, action.method)}
                      className={`flex min-h-16 items-center justify-between rounded-[8px] px-4 py-3 text-left shadow-lg transition disabled:cursor-not-allowed disabled:opacity-55 ${action.accent}`}
                    >
                      <span>
                        <span className="block text-base font-black">
                          Stamp {action.kind}
                        </span>
                        <span className="block text-xs font-semibold opacity-90">
                          {action.copy}
                        </span>
                      </span>
                      {isWriting && lastAction === action.kind ? (
                        <Loader2 className="animate-spin" size={22} aria-hidden="true" />
                      ) : (
                        <Icon size={22} aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[8px] border border-[#d8cdbb] bg-[#fffaf0] p-4">
              <h2 className="text-lg font-black tracking-normal">Recent Activity</h2>
              <div className="mt-3 flex items-center justify-between rounded-[8px] bg-white px-3 py-3 text-sm">
                <span className="font-bold">Last Transaction</span>
                <span className="flex items-center gap-2 font-semibold text-[#596166]">
                  {activity === "Pending" ? (
                    <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                  ) : activity === "Confirmed" ? (
                    <CheckCircle2 size={16} className="text-[#236b45]" aria-hidden="true" />
                  ) : null}
                  {activity}
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-[#596166]">
                <div className="flex justify-between">
                  <span>Wallet Status</span>
                  <span className="font-semibold text-[#1f2528]">{walletStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span>Network</span>
                  <span className="font-semibold text-[#1f2528]">
                    {chainId === 8453 ? "Base" : isConnected ? "Switch to Base" : "Base"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          {[
            ["Sweet", counts.mySweet, counts.totalSweet, "bg-[#d84a3a]"],
            ["Spicy", counts.mySpicy, counts.totalSpicy, "bg-[#236b45]"],
            ["Fresh", counts.myFresh, counts.totalFresh, "bg-[#0052ff]"],
          ].map(([label, mine, total, dot]) => (
            <div
              key={label}
              className="rounded-[8px] border border-[#d8cdbb] bg-white p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${dot}`} />
                <h3 className="font-black">{label} Stamps</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[8px] bg-[#f7f1e7] p-3">
                  <p className="text-xs font-bold text-[#596166]">My {label} Stamps</p>
                  <p className="mt-2 text-3xl font-black">{mine}</p>
                </div>
                <div className="rounded-[8px] bg-[#f7f1e7] p-3">
                  <p className="text-xs font-bold text-[#596166]">
                    Total {label} Stamps
                  </p>
                  <p className="mt-2 text-3xl font-black">{total}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
