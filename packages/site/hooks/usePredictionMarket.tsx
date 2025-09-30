"use client";

import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FhevmInstance } from "@/../fhevm-react/fhevmTypes";
import { FhevmDecryptionSignature } from "@/../fhevm-react/FhevmDecryptionSignature";
import type { GenericStringStorage } from "@/../fhevm-react/GenericStringStorage";
import { PredictionMarketAddresses } from "@/abi/PredictionMarketAddresses";
import { PredictionMarketABI } from "@/abi/PredictionMarketABI";

type MarketInfo = {
  abi: typeof PredictionMarketABI.abi;
  address?: `0x${string}`;
  chainId?: number;
  chainName?: string;
};

function getPredictionMarketByChainId(chainId: number | undefined): MarketInfo {
  if (!chainId) {
    return { abi: PredictionMarketABI.abi };
  }
  const entry = (PredictionMarketAddresses as any)[chainId.toString()];
  if (!entry || !("address" in entry) || entry.address === ethers.ZeroAddress) {
    return { abi: PredictionMarketABI.abi, chainId };
  }
  return {
    address: entry.address as `0x${string}`,
    chainId: entry.chainId ?? chainId,
    chainName: entry.chainName,
    abi: PredictionMarketABI.abi,
  };
}

export function usePredictionMarket(parameters: {
  instance: FhevmInstance | undefined;
  fhevmDecryptionSignatureStorage: GenericStringStorage;
  eip1193Provider: ethers.Eip1193Provider | undefined;
  chainId: number | undefined;
  ethersSigner: ethers.JsonRpcSigner | undefined;
  ethersReadonlyProvider: ethers.ContractRunner | undefined;
  sameChain: React.RefObject<(chainId: number | undefined) => boolean>;
  sameSigner: React.RefObject<
    (ethersSigner: ethers.JsonRpcSigner | undefined) => boolean
  >;
}) {
  const {
    instance,
    fhevmDecryptionSignatureStorage,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  } = parameters;

  const [myYesStakeHandle, setMyYesStakeHandle] = useState<string | undefined>(
    undefined
  );
  const [myNoStakeHandle, setMyNoStakeHandle] = useState<string | undefined>(
    undefined
  );
  const [message, setMessage] = useState<string>("");
  const [isPlacing, setIsPlacing] = useState<boolean>(false);
  const isPlacingRef = useRef<boolean>(false);

  const marketRef = useRef<MarketInfo | undefined>(undefined);

  const market = useMemo(() => {
    console.log('usePredictionMarket: chainId =', chainId);
    const m = getPredictionMarketByChainId(chainId);
    console.log('usePredictionMarket: market info =', m);
    marketRef.current = m;
    if (!m.address) {
      if (chainId === undefined) {
        setMessage("Connecting to wallet...");
      } else {
        setMessage(`PredictionMarket deployment not found for chainId=${chainId}.`);
      }
    } else {
      setMessage(""); // Clear message when address is found
    }
    return m;
  }, [chainId]);

  const canPlace = useMemo(() => {
    return market.address && instance && ethersSigner && !isPlacing;
  }, [market.address, instance, ethersSigner, isPlacing]);

  const refreshMyStakes = useCallback(() => {
    if (!marketRef.current?.address || !ethersReadonlyProvider) return;
    const contract = new ethers.Contract(
      marketRef.current.address,
      marketRef.current.abi,
      ethersReadonlyProvider
    );
    Promise.all([contract.getMyStake(1), contract.getMyStake(0)])
      .then(([yes, no]) => {
        setMyYesStakeHandle(yes);
        setMyNoStakeHandle(no);
      })
      .catch(() => setMessage("Failed to refresh stakes"));
  }, [ethersReadonlyProvider]);

  useEffect(() => {
    refreshMyStakes();
  }, [refreshMyStakes]);

  const placeBet = useCallback(
    (outcome: 0 | 1, amount: number) => {
      if (isPlacingRef.current) return;
      if (!market.address || !instance || !ethersSigner || amount <= 0) return;

      const thisAddress = market.address;
      const thisSigner = ethersSigner;
      const thisChainId = chainId;

      isPlacingRef.current = true;
      setIsPlacing(true);
      setMessage("Encrypting bet...");

      const run = async () => {
        const isStale = () =>
          thisAddress !== marketRef.current?.address ||
          !sameChain.current(thisChainId) ||
          !sameSigner.current(thisSigner);

        try {
          const input = instance.createEncryptedInput(
            thisAddress,
            thisSigner.address
          );
          input.add128(amount);
          const enc = await input.encrypt();

          if (isStale()) {
            setMessage("Ignore placeBet");
            return;
          }

          setMessage("Sending placeBet...");
          const contract = new ethers.Contract(
            thisAddress,
            market.abi,
            thisSigner
          );
          const tx = await contract.placeBet(outcome, enc.handles[0], enc.inputProof);
          await tx.wait();
          setMessage("Bet placed!");
          refreshMyStakes();
        } catch {
          setMessage("placeBet failed");
        } finally {
          isPlacingRef.current = false;
          setIsPlacing(false);
        }
      };
      run();
    },
    [market.address, market.abi, instance, ethersSigner, chainId, refreshMyStakes, sameChain, sameSigner]
  );

  const decryptMyStake = useCallback(
    async (outcome: 0 | 1) => {
      if (!market.address || !instance || !ethersSigner) return;
      const handle = outcome === 1 ? myYesStakeHandle : myNoStakeHandle;
      if (!handle || handle === ethers.ZeroHash) return;

      const sig = await FhevmDecryptionSignature.loadOrSign(
        instance,
        [market.address as `0x${string}`],
        ethersSigner,
        fhevmDecryptionSignatureStorage
      );
      if (!sig) {
        setMessage("Unable to build FHEVM decryption signature");
        return;
      }
      const res = await instance.userDecrypt(
        [{ handle, contractAddress: market.address! }],
        sig.privateKey,
        sig.publicKey,
        sig.signature,
        sig.contractAddresses,
        sig.userAddress,
        sig.startTimestamp,
        sig.durationDays
      );
      return res[handle];
    },
    [market.address, instance, ethersSigner, myYesStakeHandle, myNoStakeHandle, fhevmDecryptionSignatureStorage]
  );

  return {
    contractAddress: market.address,
    canPlace,
    placeBet,
    decryptMyStake,
    refreshMyStakes,
    myYesStakeHandle,
    myNoStakeHandle,
    message,
  };
}


