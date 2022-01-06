import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import electionAbi from "./contracts/Election.json";

const Election = () => {
  // deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
  let contractAddress = "0x8B2f2c8212dd37fb3959F9BCB62f8A95BdEC6bD3";

  const [currentAccount, setCurrentAccount] = useState(null);
  const [electionName, setElectionName] = useState("...");
  const [candidateNames, setCandidateNames] = useState([]);
  const [inputData, setInputData] = useState("");

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const getElectionName = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const sContract = new ethers.Contract(
          contractAddress,
          electionAbi,
          signer
        );
        const eName = await sContract.electionName();
        setElectionName(eName);
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCandidates = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const sContract = new ethers.Contract(
          contractAddress,
          electionAbi,
          signer
        );
        let _candidateNames, _candidateCount;

        try {
          _candidateCount = (await sContract.getNumCandidates()).toNumber();

          _candidateNames = await Promise.all(
            Array(parseInt(_candidateCount))
              .fill()
              .map((element, index) => {
                return sContract.getCadidate(index);
              })
          );

          setCandidateNames(_candidateNames);
        } catch (e) {
          console.log("error in pulling file hashes", e);
        }
        console.log(candidateNames);
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputData(value);
  };

  const addCandidates = async (event) => {
    event.preventDefault();
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const sContract = new ethers.Contract(
          contractAddress,
          electionAbi,
          signer
        );
        let result;

        try {
          result = await sContract.addCandidate(inputData);
        } catch (e) {
          console.log("error in pulling file hashes", e);
        }
        console.log(candidateNames);
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCandidatesList = () => {
    return (
      <div className="candidate-list">
        <ul>
          {candidateNames.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    );
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  const getElectionNameButton = () => {
    return (
      <button onClick={getElectionName} className="cta-button elec-button">
        Election
      </button>
    );
  };

  const getCandidatesButton = () => {
    return (
      <button onClick={getCandidates} className="cta-button elec-button">
        Candidates
      </button>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="main-app">
      <form onSubmit={addCandidates}>
        <label>
          Name:
          <input
            type="text"
            value={inputData}
            name="name"
            onChange={handleChange}
          />
        </label>
        <input type="submit" value="Add Candidate" className="submit-button" />
      </form>
      <div className="button-container">
        {currentAccount ? getElectionNameButton() : connectWalletButton()}
      </div>
      <div className="button-container">
        {currentAccount ? getCandidatesButton() : ""}
      </div>
      <h1>{electionName}</h1>
      <div>{getCandidatesList()}</div>
    </div>
  );
};

export default Election;
