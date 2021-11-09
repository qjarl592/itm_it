
import React, { useState } from 'react';
/** @jsx jsx */
import AssetDetail from './AssetDetail';
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
const like = css `
	display: flex;
	align-items: center;
`

const heartCount= css`
	font-size: 0.6rem;
`
const heart =css`
	background-color: white;
	color: white;
	border: none;
`

const baseURL='https://gateway.pinata.cloud/ipfs/';

const Asset = (props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isUpdateDone, setIsUpdateDone] = useState(false);
  
	const openModal = () => {
	  console.log("click");
	  setIsModalOpen(true);
	  setIsUpdateDone(false)
	};
  
	const closeModal = () => {
	  setIsModalOpen(false);
	  setIsUpdateDone(false);
	};
  
	const updateComplete = () => {
	  setIsUpdateDone(true);
	};
 
	console.log(props.asset.metadata.keyvalues.image);
	return (
		<li css={asset} className="asset">
			<div css={like}>
				<button css={heart}><img css={heart} src="/images/heart.png" alt="heart"/></button>
				<h2 css={heartCount}>5</h2>
			</div>
			<img src={props.asset.metadata.keyvalues.image} alt="asset" onClick={openModal}/>
			<AssetDetail asset={props} isOpen={isModalOpen} isUpdateDone = {isUpdateDone} close={closeModal} updateCheck = {updateComplete}/>
			<div className="info">
				<h2>{props.asset.metadata.name}</h2>
				<audio controls>
					<source src={baseURL+props.asset.ipfs_pin_hash}></source>
				</audio>
				<h3>{props.asset.metadata.keyvalues.price} ETH</h3>
			</div>
		</li>
	)
}

export default Asset;