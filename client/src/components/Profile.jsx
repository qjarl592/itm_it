import React from 'react';
import { useEffect, useState} from "react";
import CreateNftForm from "./CreateNFTForm";
import {useRecoilState} from "recoil";
import {accountState} from "../state/state";
import Asset from "./Asset";

const Profile = ({contract, pinata}) => {
	const [myAssets, setMyAssets]=useState({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [accounts, setAccounts] = useRecoilState(accountState);

	useEffect(() => {
		const filter = {
			status: 'pinned',
			metadata: {
				keyvalues: {
					account: {
						value: accounts.toString(),
						op: 'eq'
					}
				}
			}
		}
		const tokens = pinata.pinList(filter);
		setMyAssets(tokens.rows);
	},[accounts]);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};
	console.log(myAssets);
	return(
		<div>
			<button onClick={openModal}>NFT 생성하기</button>
			<CreateNftForm isModalOpen={isModalOpen} closeModal={closeModal} accounts={accounts} contract={contract} pinata={pinata}/>
			{/*{Object.keys(myAssets).map(key => (*/}
			{/*	<Asset asset={myAssets[key]}/>*/}
			{/*))};*/}
		</div>
	)
}

export default Profile;