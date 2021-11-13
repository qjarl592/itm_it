import React from 'react';
import { useEffect, useState} from "react";
import CreateNftForm from "./CreateNFTForm";
import {useRecoilState} from "recoil";
import {accountState} from "../state/state";
import Modal from 'react-modal';
import Asset from "./Asset";

const Profile = ({contract, pinata}) => {
	const [myAssets, setMyAssets]=useState({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [flag, setFlag] = useState(false)
	const [account, setAccount] = useRecoilState(accountState);


	const fetchPinned = async () => {
		const filter = {
			status: 'pinned',
			metadata: {
				keyvalues: {
					account: {
						value: account,
						op: 'eq'
					}
				}
			}
		}
		const tokens = await pinata.pinList(filter);
		setMyAssets(tokens.rows)
	}

	useEffect(() => {
		console.log("change")
		fetchPinned()
		console.log("myasset:",myAssets)
		setFlag(false)
	},[account, flag]);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return(
		<div>
			<button onClick={openModal}>NFT 생성하기</button>
			<CreateNftForm isModalOpen={isModalOpen} closeModal={closeModal} setFlag={setFlag} contract={contract} pinata={pinata}/>
			{Object.keys(myAssets).map(key => (
				<Asset asset={myAssets[key]}/>
			))};
		</div>
	)
}

export default Profile;