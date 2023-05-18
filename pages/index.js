import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../bin/contracts/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  var transactions = []

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let inputBox = document.getElementById("inputAmount")
      let tx = await atm.deposit(inputBox.value, generateRandomId(5));
      await tx.wait()
      getBalance();
      updateTable();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let inputBox = document.getElementById("inputAmount")
      let tx = await atm.withdraw(inputBox.value, generateRandomId(5));
      await tx.wait()
      getBalance();
      updateTable();
    }
  }

  const updateTable = async() => {
    if (atm) {
      let transactionHistory = await atm.getTransactionHistory();
      
      transactions = transactionHistory;

      const tableBody = document.getElementById("transactionTable");
      tableBody.innerHTML = "";

      let rowIndex = 0
      transactionHistory.forEach((transaction) => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = transaction._id;
        row.appendChild(idCell);

        const senderCell = document.createElement("td");
        senderCell.textContent = transaction._address;
        row.appendChild(senderCell);

        const operationCell = document.createElement("td");
        operationCell.textContent = transaction.operation;
        row.appendChild(operationCell);
        
        const amountCell = document.createElement("td");
        amountCell.textContent = transaction.amount;2
        row.appendChild(amountCell);

        tableBody.appendChild(row);

        rowIndex+=1;
      });
    }
  }

  function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }
  
    return randomId;
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    updateTable();

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <input type="text" id="inputAmount" placeholder="Enter text here"></input>
        <button onClick={deposit}>Deposit amount</button>
        <button onClick={withdraw}>Withdraw amount</button>

        <table className="container">
          <thead>
            <tr>
              <th>ID</th>
              <th>Address</th>
              <th>Transaction</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody id="transactionTable">
          </tbody>
        </table>

      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          justify-content: center;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          display: flex;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
      `}
      </style>
    </main>
  )
}