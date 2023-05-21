import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../bin/contracts/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  var transactions = []

  const getWallet = async() => {
    console.log("1")
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      console.log("2")
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    console.log("3")
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    console.log("14");
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
    console.log("1")
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const sendToETH = async() => {
    console.log("sending ETH");

    if (atm) {
      let receiverAddress = document.getElementById("receiverAddress")
      let amountHolder = document.getElementById("inputAmount")

      let address = receiverAddress.value;
      let amount = parseInt(amountHolder.value)
      let id = generateRandomId(5);

      atm.sendETH(address, amount, id);
      updateTable();
    }
  }

  const deleteTransaction = async(id) => {
    console.log("deleting transaction", id);

    if (atm) {
      let deletion = await atm.deleteTransaction(id);
      updateTable();
    }
  }

  const updateTable = async() => {
    console.log("updating table");
    if (atm) {
      let transactionKeys = await atm.getTransactionKeys();
      let transactionValues = await atm.getTransactionValues();

      console.log(transactionKeys, transactionValues);

      const tableBody = document.getElementById("transactionTable");
      tableBody.innerHTML = "";

      for (let rowIndex = 0; rowIndex < transactionKeys.length; rowIndex++) {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = transactionKeys[rowIndex];
        row.appendChild(idCell);

        const senderCell = document.createElement("td");
        senderCell.textContent = transactionValues[rowIndex].senderAddress;
        row.appendChild(senderCell);

        const receiverCell = document.createElement("td");
        receiverCell.textContent = transactionValues[rowIndex].receiverAddress;
        row.appendChild(receiverCell);
        
        const amountCell = document.createElement("td");
        amountCell.textContent = transactionValues[rowIndex].amount;
        row.appendChild(amountCell);

        tableBody.appendChild(row);
      };
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

    updateTable();

    return (
      <div>
        <p>Your Account: {account}</p>
        <input type="text" id="receiverAddress" placeholder="Enter receiver address here"></input>
        <input type="text" id="inputAmount" placeholder="Enter amount here"></input>
        <button onClick={sendToETH}>Send ETH</button>
        <button onClick={deleteTransaction}>Delete last transaction</button>

        <table className="container">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sender</th>
              <th>Receiver</th>
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
      <header><h1>ETH Transfer</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          justify-content: center;
        }
        table {
          border-collapse: collapse;
          border: 1px solid black;
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