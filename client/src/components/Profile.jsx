import React from 'react';
import { useEffect, useState} from "react";
import CreateNftForm from "./CreateNFTForm";
import {useRecoilState} from "recoil";
import {accountState} from "../state/state";
import Asset from "./Asset";

const Profile = ({contract, pinata}) => {
	const [myAssets, setMyAssets]=useState({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [account, setAccount] = useRecoilState(accountState);

	useEffect(() => {
		const filter = {
			status: 'pinned',
			metadata: {
				keyvalues: {
					account: {
						value: account.toString(),
						op: 'eq'
					}
				}
			}
		}
		const tokens = pinata.pinList(filter);
		setMyAssets(tokens.rows);
	},[account]);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return(
		<div>
			<button onClick={openModal}>NFT 생성하기</button>
			<CreateNftForm isModalOpen={isModalOpen} closeModal={closeModal} contract={contract} pinata={pinata}/>
			{/*{Object.keys(myAssets).map(key => (*/}
			{/*	<Asset asset={myAssets[key]}/>*/}
			{/*))};*/}
		</div>
	)
}

export default Profile;