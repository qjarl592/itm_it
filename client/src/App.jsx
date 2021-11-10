/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import React, { createContext, useEffect, useReducer, useState} from "react";
import ERC_721 from "./contracts/ERC721.json";
import Purchase from "./contracts/Purchase.json"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Market from './components/Market';
import Layout from './components/Layout';
import Profile from './components/Profile';
import Wallet from "./components/Wallet";
import getWeb3 from "./service/getWeb3";

const app=css`
  height: 100vh;
`

export const WebDispatch = createContext({});

const reducer = (state, action) =>{
    switch (action.type) {
        case 'setMethod':
            return{
                ...state,
                methods: action.methods
            };
        case 'setAccount':
            return {
                ...state,
                accounts: action.accounts
            }
        default:
            return state;
    }
}

const pinataSDK = require('@pinata/sdk');
const pinataObj = pinataSDK(process.env.REACT_APP_PINATA_API_KEY, process.env.REACT_APP_PINATA_SECRET_KEY);

const App = () => {
    const initialState = null
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = {state, dispatch}
    const [accounts, setAccounts] = useState();
    const [ERC721Contract, setERC721Contract] = useState();
    const [purchaseContract, setPurchaseContract] = useState();
    const [pinata, setPinata] = useState(pinataObj)

    useEffect(()=>{
        const isLogin = localStorage.getItem("isLogin");
        isLogin && connectWeb3();
    },[])

    const connectWeb3 =async ()=>{
        try{
            const web = await getWeb3();
            const accounts = await web.eth.getAccounts();
            const networkId = await web.eth.net.getId();
            const deployedNetwork = ERC_721.networks[networkId];
            const ERC721 = await new web.eth.Contract(
                ERC_721.abi,
                deployedNetwork && deployedNetwork.address,
            );
            const purchase = await new web.eth.Contract(
                Purchase.abi,
                deployedNetwork && deployedNetwork.address
            )
            setPurchaseContract(purchase);
            setAccounts(accounts);
            setERC721Contract(ERC721);
            console.log(purchaseContract);
            localStorage.setItem("isLogin", "true");
            
            dispatch({type : 'setMethod', methods: ERC721.methods})
            dispatch({type : 'setAccount', accounts: accounts})
        }catch(error){
            console.log(error);
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
        }
    }

    return(
        <div css={app} className="App">
            <WebDispatch.Provider value={value}>
            <Router>
                <Switch>
                        <Layout>
                            <Route exact path="/" render ={
                                props =>  <Market {...props} accounts={accounts} ERC721Contract={ERC721Contract} purchaseContract={purchaseContract} pinata={pinata}  />}>
                            </Route>
                            <Route exact path="/profile" render={
                                props => <Profile {...props} accounts={accounts} ERC721Contract={ERC721Contract} purchaseContract={purchaseContract} pinata={pinata}/>} />
                            <Route exact path='/wallet' render={
                                props => <Wallet {...props} connectWeb3={connectWeb3}/>} />
                        </Layout>
                </Switch>
            </Router>
            </WebDispatch.Provider>
        </div>
    )
}

export default App;

//   getAsset = async (event) => {
//     const { accounts, contract } = this.state;
//     var allTokensID = await contract.methods.getMyAllTokenids(accounts[0]).call();
//     const myTokens=[];
//     for(const tokenID of allTokensID){
//       var ipfsHash = await this.state.contract.methods.tokenURI(tokenID).call();
//       for await (const file of ipfs.get(ipfsHash)) {
//         if (!file.content) continue;
//         const content = [];
//         for await (const chunk of file.content) {
//           content.push(chunk);
//         }
//         var result = JSON.parse(content);
//         var token = new Object();
//         token.id=tokenID;
//         token.asset=result
//         myTokens.push(token);
//       }
//     }
//     this.setState({myTokens});
//   };
//
//   burnAsset = async (targetID) => {
//     const { accounts, contract } = this.state;
//     await contract.methods.burn(targetID).send({ from: accounts[0] });
//     this.getAsset();
//   }
//
//   render() {
//     const assets = this.state.myTokens.map((token, index) => (
//       <div key={index}>
//         <strong>Token ID : {token.id}</strong>
//         <br/>
//         Title : {token.asset.title}
//         <br/>
//         Author : {token.asset.author}
//         <br/>
//         Description : {token.asset.description}
//         <br/>
//         Price : {token.asset.price}
//         <br/>
//         <img width="300px" src={baseURL+token.asset.image}></img>
//         <br/>
//         <form>
//           <input type="button" value="burn" onClick={() => this.burnAsset(token.id)}></input>
//         </form>
//         <br/>
//       </div>
//     ));
//
//     if (!this.state.web3) {
//       return <div>Loading Web3, accounts, and contract...</div>;
//     }
//     return (
//       <div css={app} className="App">
//         <Router>
//           <Switch>
//             <Layout>
//               <Route path="/market" layout={Layout}>
//                 <Market assets={assets} />
//               </Route>
//               <Route exact path="/profile" render={
//                 props => <Profile ipfs={ipfs}{...props} />} />
//             </Layout>
//           </Switch>
//         </Router>
//       </div>
//     );
//   }
// }
//
// export default App;
