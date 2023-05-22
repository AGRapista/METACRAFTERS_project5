import {useState, useEffect} from "react";
import {ethers} from "ethers";
import contract_abi from "../bin/contracts/ArgentumToken.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [solContract, setContract] = useState(undefined);

  const [ownerAddress, setOwner] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const [userBalance, setUserBalance] = useState();

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractABI = contract_abi.abi;

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
    console.log("4");
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    getContract();
  };

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const _contract = new ethers.Contract(contractAddress, contractABI, signer);
 
    setContract(_contract);
  }

  const lookupOwner = async() => {
    let transaction = await solContract.getOwner();
    setOwner(transaction)
  }

  const getTotalSupply = async() => {
    let transaction = await solContract.getTotalSupply();
    setTotalSupply(transaction.toString())
  }

  const getBalance = async() => {
    let transaction = await solContract.getBalance(account[0]);
    setUserBalance(transaction.toString())
  }

  const mintTokens = async() => {
    let mintAddress = document.getElementById("mintField").value
    let tokensToMint = document.getElementById("amountToMintField").value
    let transaction = await solContract.mintToken(mintAddress, tokensToMint);
    await transaction.wait()

    getTotalSupply()
    getBalance()
  }

  const transferTokens = async() => {
    console.log("here", account[0])
    let receiver = document.getElementById("receiverField").value
    let amount = document.getElementById("amountField").value
    let transaction = await solContract.transferToken( receiver, amount);
    await transaction.wait()

    getBalance()
  }

  const burnTokens = async() => {
    let tokensToBurn = document.getElementById("burnField").value
    let transaction = await solContract.burnToken(account[0], tokensToBurn);
    await transaction.wait()

    getTotalSupply()
    getBalance()
  }
  
  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this web application.</p>
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if(solContract){
      lookupOwner();
      getTotalSupply();
      getBalance();
    }

    return (
      <div>
        <p>(Debug) Contract Owner: {ownerAddress}</p>
        <p style={{ fontWeight: 'bold'}}>Account: <span style={{ fontWeight: 'normal'}}>{account}</span></p>
        <p style={{ fontWeight: 'bold'}}>Balance: <span style={{ fontWeight: 'normal'}}>{userBalance}</span></p>
        <p style={{ fontWeight: 'bold'}} >Total Tokens in Network: <span style={{ fontWeight: 'normal'}}>{totalSupply}</span></p>

        <br/>
        <br/>

        {ownerAddress && ownerAddress.toLowerCase() === account[0].toString() && (
          <>
            <p style={{ fontWeight: 'bold'}}>Owner Control</p>
            <button onClick={mintTokens} style={{ fontWeight: 'bold'}}>Mint Tokens</button>
            <input id="mintField"></input>
            <input id="amountToMintField"></input> <br/> <br/>
            <br/>
            <br/>
          </>
        )}

        <p style={{ fontWeight: 'bold'}}>Standard Control</p>

        <button onClick={transferTokens} style={{ fontWeight: 'bold'}}>Transfer Tokens</button>
        <input id="receiverField"></input> 
        <input id="amountField"></input> <br/> <br/>

        <button onClick={burnTokens}  style={{ fontWeight: 'bold'}}>Burn Tokens</button>
        <input id="burnField"></input>

      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container" style={{ marginLeft: '35%', fontFamily: 'Verdana' }}>
      <header><h1>ARGENTUM Token</h1></header>
      {initUser()}
    </main>
  )
}