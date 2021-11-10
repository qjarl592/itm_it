
import React, { useState } from 'react';
/** @jsx jsx */
import AssetMarketDetail from './AssetMarketDetail';
import { css, jsx } from '@emotion/react'

const asset = css`
	list-style: none;
	width: 230px;
	height: 350px;
	box-shadow: 6px 0px 6px 2px rgba(217, 217, 217, 1);
	img{
		object-fit: contain;
		width: 100%;
	}
	.info{
		h2{
			font-size: 1.0rem
		}
		h3{
			font-size:0.8rem
		}
	}
`
const baseURL='https://gateway.pinata.cloud/ipfs/';

const AssetMarket = ({asset, accounts, purchaseContract}) => {
	console.log(asset)
	console.log(accounts)
	const [isModalOpen, setIsModalOpen] = useState(false); //모달창이 열렸는가?
	const [isUpdateDone, setIsUpdateDone] = useState(false); //구매완료가 되었는가?
  
	const openModal = () => {
	  setIsModalOpen(true);
	};
  
	const closeModal = () => {
	  setIsModalOpen(false);
	  setIsUpdateDone(false);
	};
  
	const updateComplete = () => {
	  setIsUpdateDone(true);
	};
 
	return (
		<li css={asset} className="asset">
			<img src={asset.metadata.keyvalues.image} alt="asset" onClick={openModal}/>
			<AssetMarketDetail asset={asset} accounts={accounts} purchaseContract={purchaseContract} isOpen={isModalOpen} isUpdateDone = {isUpdateDone} close={closeModal} updateCheck = {updateComplete}/>
			<div className="info">
				<h2>{asset.metadata.name}</h2>
				<audio controls>
					<source src={baseURL+asset.ipfs_pin_hash}></source>
				</audio>
				<h3>{asset.metadata.keyvalues.price} ETH</h3>
			</div>
		</li>
	)
}

export default AssetMarket;