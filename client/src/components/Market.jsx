
/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import {WebDispatch} from "../App";
import {useContext, useEffect, useState} from "react";
import AssetMarket from "./AssetMarket";
import { useRecoilState, useRecoilValue } from 'recoil';
import { keywordState } from '../state/state';

const market= css`
	width: 66%;
	height: 100%;
	background-color: white;
	box-shadow: 6px 0px 6px 2px rgba(217, 217, 217, 1);
`
const asset = css`
	list-style: none;
	width: 230px;
	height: 350px;
	box-shadow: 6px 0px 6px 2px rgba(217, 217, 217, 1);
	img{
		object-fit: contain;
		width: 100%;
	}
`

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('2b7b1e2284f63479d880', '8a2fe76b94ecaddfc60194c0aae5b7820e09ee0b44fa2dfc757c7adbf82d21f6');
const baseURL='https://gateway.pinata.cloud/ipfs/';

const filter={
	status: 'pinned',
	metadata:{
		name: '',
		keyvalues: {
			// state: {
			// 	value: 'public',
			// 	op: 'eq'
			// },
			show: {
				value: 'y',
				op: 'eq'
			}
		}
	}
}

const Market = ({history,accounts}) => {

	// const keyword = useRecoilValue(keywordState)

	const [keyword, setKeyword] = useRecoilState(keywordState)
	const {state, dispatch} = useContext(WebDispatch);
	const [assets, setAssets] = useState({});
	// const [assets, setAssets] = useState();
	//

	useEffect(() => {
		filter.metadata.name=keyword;
		console.log(filter);
		async function fetchPinned() {
			const tokens = await pinata.pinList(filter);
			setAssets(tokens.rows);
		}
		fetchPinned();
	},[keyword]);
	
	const onSubmit = async () => {
		const tokens = await pinata.pinList(filter);
		console.log(tokens)
		//state가 null일 경우에만 wallet으로 이동합니다.
		console.log(`state :${state}`)
		if(state){
			history.push("/profile")
		}else{
			history.push("/wallet");
		}
	}
	return (
		<div css={market}>
			<button onClick={onSubmit}>아이템 업로드하기</button>
			{Object.keys(assets).map(key => ( 
				<AssetMarket asset={assets[key]}/>
			))}
		</div>
	)

};

export default Market;

