/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import {WebDispatch} from "../App";
import {useContext, useEffect, useState} from "react";
import Asset from "./Asset";
import { useRecoilState } from 'recoil';
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
const filter={
	status: 'pinned',
	metadata:{
		name: '',
		keyvalues: {
			show: {
				value: 'y',
				op: 'eq'
			}
		}
	}
}

const Market = ({history,accounts,contract,purchaseContract,pinata}) => {

	const [keyword, setKeyword] = useRecoilState(keywordState) //검색 키워드
	const [assets, setAssets] = useState({}); //마켓에서 보여지는 토큰들

	useEffect(() => {
		filter.metadata.name=keyword;
		async function fetchPinned() {
			const tokens = await pinata.pinList(filter);
			setAssets(tokens.rows);
		}
		fetchPinned();
	},[keyword]);

	return (
		<div css={market}>
			{Object.keys(assets).map(key => (
				<Asset asset={assets[key]} accounts={accounts} contract={contract} purchaseContract={purchaseContract} />
			))}
		</div>
	)

};

export default Market;

