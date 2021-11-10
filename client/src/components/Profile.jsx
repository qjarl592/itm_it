import React from 'react';
import {WebDispatch} from "../App";
import {useContext, useEffect, useState} from "react";

const Profile = ({accounts, contract, pinata}) => {
	const [myAssets, setMyAssets]=useState({});
	const {state, dispatch} = useContext(WebDispatch);

	useEffect(() => {
		const myAccount = accounts[0];
		const filter = {
			status: 'pinned',
			metadata: {
				keyvalues: {
					show: {
						value: 'y',
						op: 'eq'
					},
					account: {
						value: myAccount,
						op: 'eq'
					}
				}
			}
		}
		async function fetchPinned() {
			const tokens = await pinata.pinList(filter);
			setMyAssets(tokens.rows);
		}
		fetchPinned();
	},[]);

	return(
		<div>
			{/*<Modalbutton contract={contract} accounts={accounts}/>*/}
			{/*{Object.keys(myAssets).map(key => ( */}
			{/*	<Asset asset={myAssets[key]}/>*/}
			{/*))};*/}
		</div>
	)
}

export default Profile;