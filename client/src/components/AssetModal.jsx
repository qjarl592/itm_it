/** @jsx jsx */
import {css,jsx} from "@emotion/react";
import React from 'react';
import {useRecoilState} from "recoil";
import {accountState} from "../state/state";
import Modal from 'react-modal';
import './AssetModal.css';
import {Colors} from "../colors/Colors";

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		width: `80vh`,
		height: '60vh',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};

const purchaseButton = css`
	background-color: ${Colors.purple_key};
	width: 50vh;
	height: 4vh;
`

const AssetModal = ({asset, contract, pinata, isOpen, close, setFlag}) => {
	const [account, setAccount] = useRecoilState(accountState);

	const buyToken = async () => {
		console.log("buy is clicked!!")		
		console.log('account : ', account)
		const seller = asset.metadata.keyvalues.account
		console.log('seller : ', seller)
		const tokenID = asset.metadata.keyvalues.tokenID
		console.log("ID : ",tokenID)
		const price = asset.metadata.keyvalues.price
		console.log("price : ",price)

		await contract.methods.purchase(account,seller,tokenID).send({ from: account, value: (price*1e18)})

		const updateAccount = {
			keyvalues: {
				account: account
			}
		}
		await pinata.hashMetadata(asset.ipfs_pin_hash, updateAccount)
		close()
	};

	// const updateToken = async () => {
	// 	console.log('update click')
	// 	const newDescription = "new description"
	// 	const newState = 'public'
	// 	const newPrice = '2'

	// 	const newMeta = {
	// 		keyvalues: {
	// 			description: newDescription,
	// 		}
	// 	}

	// 	if(newState == 'public') {
	// 		newMeta['keyvalues']['state'] = newState
	// 		newMeta['keyvalues']['price'] = newPrice
	// 	}

	// 	await pinata.hashMetadata(asset.ipfs_pin_hash, newMeta)
	// 	setFlag(true)
	// 	close()
	// }

	// const deleteToken = async () => {
	// 	console.log('delete click')
	// 	const tokenID = asset.metadata.keyvalues.tokenID
	// 	await contract.methods.burn(tokenID).send({ from: account })
	// 	await pinata.unpin(asset.ipfs_pin_hash)
	// 	setFlag(true)
	// 	close()
	// }


	return (
		<Modal
			overlayClassName="overlay"
			isOpen={isOpen}
			style={customStyles}
			onRequestClose={close}
			contentLabel="Example Modal"
		>	


			<h1>세부정보</h1>
			<h2>제목 : {asset.metadata.name}</h2>
			<h2>아티스트 : {asset.metadata.keyvalues.author}</h2>
			<h2>설명 : {asset.metadata.keyvalues.description}</h2>
			<h2>가격 : {asset.metadata.keyvalues.price} ETH</h2>
			<input css={purchaseButton} type="button" id="buy" value="구매하기" onClick={buyToken}/>
		</Modal>
	)
}
Modal.setAppElement('#root')
export default AssetModal;