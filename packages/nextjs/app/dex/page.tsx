"use client";

import { useState } from "react";
// import { wrapInTryCatch } from "~~/utils/scaffold-eth/common";
import axios from "axios";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { Line } from "react-chartjs-2";
import { useAccount } from "wagmi";
import { Address, AddressInput, Balance, EtherInput, IntegerInput } from "~~/components/scaffold-eth";
import {
  useAccountBalance,
  useDeployedContractInfo,
  useScaffoldContractRead,
  useScaffoldContractWrite,
} from "~~/hooks/scaffold-eth";

// REGEX for number inputs (only allow numbers and a single decimal point)
const NUMBER_REGEX = /^\.?\d+\.?\d*$/;

const Dex: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ethToTokenAmount, setEthToTokenAmount] = useState("");
  const [tokenToETHAmount, setTokenToETHAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [approveSpender, setApproveSpender] = useState("");
  const [approveAmount, setApproveAmount] = useState("");
  const [accountBalanceOf, setAccountBalanceOf] = useState("");

  const { data: SwapContract } = useDeployedContractInfo("RollSwap");
  // const { data: BalloonsInfo } = useDeployedContractInfo("Balloons");
  const { address: connectedAccount } = useAccount();

  // const { data: DEXBalloonBalance } = useScaffoldContractRead({
  //   contractName: "Balloons",
  //   functionName: "balanceOf",
  //   args: [SwapContract?.address?.toString()],
  // });
  const USDC_token = "0x2C9678042D52B97D27f2bD2947F7111d93F3dD0D";
  const ETH_token = "0x5300000000000000000000000000000000000004";
  const [amountIn, setAmountIn] = useState(0);
  const [amountOut, setAmountOut] = useState(0);
  const [duration, setDuration] = useState("");

  const { writeAsync: createQuoteWrite } = useScaffoldContractWrite({
    contractName: "RollSwap",
    functionName: "createQuote",
    args: [USDC_token, ETH_token, BigInt(amountIn), BigInt(amountOut), BigInt(duration)],
  });
  const { data: p } = useScaffoldContractRead({
    contractName: "RollSwap",
    functionName: "getLatestPrice",
  });
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log(event);
    const val = await p;
    const tx = await createQuoteWrite();
    console.log("Transaction:", tx);
  };

  const { balance: contractETHBalance } = useAccountBalance(SwapContract?.address);

  return (
    <>
      <h1 className="text-center mb-4 mt-5">
        {/* <span className="block text-xl text-right mr-7">
          🎈: {parseFloat(formatEther(userBalloons || 0n)).toFixed(4)}
        </span>
        <span className="block text-xl text-right mr-7">
          💦💦: {parseFloat(formatEther(userLiquidity || 0n)).toFixed(4)}
        </span> */}
      </h1>
      <div className="items-start pt-10 grid grid-cols-1 md:grid-cols-2 content-start">
        <div className="px-5 py-5">
          <div className="bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-8 m-8">
            <div className="flex flex-col text-center">
              <span className="text-3xl font-semibold mb-2">DEX Contract</span>
              <span className="block text-2xl mb-2 mx-auto">
                <Address size="xl" address={SwapContract?.address} />
              </span>
              <span className="flex flex-row mx-auto mt-5">
                {" "}
                <Balance className="text-xl" address={SwapContract?.address} />
                {/* {isLoading ? (
                  <span>Loading...</span>
                ) : (
                  <span className="pl-8 text-xl">🎈 {parseFloat(formatEther(DEXBalloonBalance || 0n)).toFixed(4)}</span>
                )} */}
              </span>
            </div>
            <div className="py-3 px-4">
              <div className="flex mb-4 justify-center items-center">
                <form onSubmit={handleSubmit}>
                  <input value={amountIn} onChange={e => setAmountIn(Number(e.target.value))} placeholder="Amount In" />
                  <input
                    value={amountOut}
                    onChange={e => setAmountOut(Number(e.target.value))}
                    placeholder="Amount Out"
                  />
                  <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration" />
                  <button type="submit">Create Quote</button>
                </form>
              </div>
              <div className="flex justify-center items-center">
                <span className="w-1/2">
                  tokenToETH{" "}
                  <IntegerInput
                    value={tokenToETHAmount}
                    onChange={value => {
                      setEthToTokenAmount("");
                      setTokenToETHAmount(value.toString());
                    }}
                    name="tokenToETH"
                    disableMultiplyBy1e18
                  />
                </span>
                {/* <button
                  className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-6 mx-5"
                  onClick={wrapInTryCatch(tokenToEthWrite, "tokenToEthWrite")}
                >
                  Send
                </button> */}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto p-8 m-8 md:sticky md:top-0">
          {/* <Curve
            addingEth={ethToTokenAmount !== "" ? parseFloat(ethToTokenAmount.toString()) : 0}
            addingToken={tokenToETHAmount !== "" ? parseFloat(tokenToETHAmount.toString()) : 0}
            ethReserve={contractETHBalance ? parseFloat("" + contractETHBalance) : 0}
            tokenReserve={parseFloat(formatEther(contractBalance || 0n))}
            width={500}
            height={500}
          /> */}
        </div>
      </div>
    </>
  );
};

export default Dex;
