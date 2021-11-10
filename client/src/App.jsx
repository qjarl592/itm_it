/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import React, { createContext, useEffect, useReducer, useState} from "react";
import ERC721Contract from "./contracts/ERC721.json";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Market from './components/Market';
import Layout from './components/Layout';
import Profile from './components/Profile';
import Wallet from "./components/Wallet";
import getWeb3 from "./service/getWeb3";

const app=css`
  height: 100vh;
`

const initialState = null

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

const App = () => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const value = {state, dispatch}
    const [accounts, setAccounts] = useState();
    const [contract, setContract] = useState();

    useEffect(()=>{
        const isLogin = localStorage.getItem("isLogin");
        isLogin && connectWeb3();

    },[])
    const connectWeb3 =async ()=>{
        try{
            const web = await getWeb3();
            const accounts = await web.eth.getAccounts();
            const networkId = await web.eth.net.getId();
            const deployedNetwork = ERC721Contract.networks[networkId];
            const contract = await new web.eth.Contract(
                ERC721Contract.abi,
                deployedNetwork && deployedNetwork.address,
            );
            setAccounts(accounts);
            setContract(contract);
            localStorage.setItem("isLogin", "true");
            dispatch({type : 'setMethod', methods: contract.methods})
            dispatch({type : 'setAccount', accounts: accounts})
        }catch(error){
            console.log(error);
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
        }
    }

    const handleWeb = () =>{
        connectWeb3();
    }
    return(
        <div css={app} className="App">
            <WebDispatch.Provider value={value}>
            <Router>
                <Switch>
                        <Layout>
                            <Route exact path="/" render ={
                                props =>  <Market {...props}/>}>
                            </Route>
                            <Route exact path="/profile" render={
                                props => <Profile {...props} accounts={accounts} contract={contract}/>} />
                            <Route exact path='/wallet' render={
                                props => <Wallet {...props} handleWeb={handleWeb}/>} />
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
