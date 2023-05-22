# Starter Next/Hardhat Project

After cloning the github, you will want to do the following to get the code running on your computer.

### Method 1: Local deployment

1. Inside the project directory, in the terminal type: ```npm i```
2. Open two additional terminals in your VS code
3. In the second terminal type: ```npx hardhat node```
4. In the third terminal, type: ```npx hardhat run --network localhost scripts/deploy.js```
5. Back in the first terminal, type ```npm run dev``` to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

### Method 2: Remix connection

1. Make sure remixd is installed in your project ```npm install -g @remix-project/remixd```
2. In the second terminal type: ```npx hardhat node```
3. In the third terminal, type: ```npx hardhat run --network localhost scripts/deploy.js```
4. Then run ```remixd``` 
5. On the Remix IDE navigate to the workspace dropdown selection and select local host

If you encounter any problems running the web application, consider reinstalling your NPM or updating it to the latest version.

## About this Project
The project is created in adherance to METACRAFTERS Types of Functions - ETH + AVAX Module. This project exemplifies the following functionalities:
+ Creation of new Token ARGENTUM using the ERC20 standard in a local hardhat network
+ Minting of ARGENTUM token in provided address
+ Transfer of ARGENTUM token to provided address
+ Burning of ARGENTUM token 

The project makes use of the ERC20 standard, utlizing the following functions:
+ balanceOf()
+ totalSupply)
+ _mint()
+ _burn()
+ increaseAllowance()

## AUTHORS
+ A.G. Rapisa
+ METACRAFTERS
