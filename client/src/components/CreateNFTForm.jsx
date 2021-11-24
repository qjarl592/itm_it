/** @jsx jsx */
import Modal from 'react-modal';
import React, {useRef, useState} from 'react';
import {css, jsx} from "@emotion/react";
import './Modal.css';
import {create} from "ipfs-http-client";
import {accountState} from "../state/state";
import {useRecoilState} from "recoil";
import {Colors} from "../colors/Colors";

const modalContainer = css`
  display: flex;
  flex-direction: column;
  list-style: none;
  justify-content: center;
  align-content: center;
  li{
    font-size: 20px;
    padding: 10px;
  }
`
const audioFile = css`
  display: flex;
  align-items: center;
  *{
    font-size: 13px;
  }
  .upload-name {
    display: inline-block;
    height: 30px;
    padding: 0 10px;
    vertical-align: middle;
    border: 1px solid #dddddd;
    width: 78%;
    color: #999999;
  }
  label {
    padding: 5px 5px;
    text-align: center;
    line-height: 30px;
    color: #fff;
    background-color: #999999;
    cursor: pointer;
    height: 30px;
    width: 60px;
    margin-left: 10px;
    display: table-cell;
    vertical-align: baseline;
  }
`
const imageFile = css`
  display: flex;
  align-items: center;
  *{
    font-size: 13px;
  }
  .upload-name {
    display: inline-block;
    height: 30px;
    padding: 0 10px;
    vertical-align: middle;
    border: 1px solid #dddddd;
    width: 78%;
    color: #999999;
  }
  label {
    padding: 5px 5px;
    text-align: center;
    line-height: 30px;
    color: #fff;
    background-color: #999999;
    cursor: pointer;
    height: 30px;
    width: 60px;
    margin-left: 10px;
    display: table-cell;
    vertical-align: baseline;
  }
`
const input = css`
  width: 300px;
  height: 50px;
  border: none;
  border-bottom: 3px solid black;
`
const uploadButton = css`
  background: ${Colors.purple_key};
  color: #fff;
  border: none;
  margin: auto;
  margin-top: 20px;
  height: 40px;
  width: 80%;
  padding: 0 2em;
  cursor: pointer;
  transition: 800ms ease all;
  outline: none;
  &:hover {
    background:  #999999;
    color: white;
  }
  &:before, button:after {
    content: '';
    top: 0;
    right: 0;
    height: 2px;
    width: 0;
    background: white;
    transition: 400ms ease all;
    &:after {
      right: inherit;
      top: inherit;
      left: 0;
      bottom: 0;
    }
    &:hover:before, button:hover:after {
      width: 100%;
      transition: 800ms ease all;
`;

const ipfs = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

const CreateNftForm = ({isModalOpen, closeModal, setFlag, contract, pinata}) => {

    const [account, setAccount] = useRecoilState(accountState);
    const [audioBuffer, setAudioBuffer] = useState();
    const [imageBuffer, setImageBuffer] = useState();

    const audioCapture = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            setAudioBuffer(Buffer(reader.result));
        }
        audioRef.current.value = file.name
    }

    const imageCapture = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            setImageBuffer(Buffer(reader.result));
        }
        imageRef.current.value = file.name
    }
    const audioRef = useRef();
    const imageRef = useRef();
    const titleRef= useRef();
    const authorRef = useRef();
    const descriptionRef= useRef();

    const createToken = async () => {
        const myImageResult=await ipfs.add(imageBuffer);
        // await pinata.pinByHash(myImageResult.path);

        const options={
            pinataMetadata: {
                name: titleRef.current.value || '',
                keyvalues: {
                    author: authorRef.current.value || '',
                    description : descriptionRef.current.value || '',
                    image : 'https://gateway.pinata.cloud/ipfs/'+myImageResult.path,
                    state : 'private',
                    account: account
                }
            }
        }
        //pinning
        const myAssetResult = await ipfs.add(audioBuffer);
        const pinataResult = await pinata.pinByHash(myAssetResult.path, options);

        const nft = await contract.methods.mint(account, pinataResult.ipfsHash).send({ from: account });
        const tokenID = nft.events.Transfer.returnValues.tokenId

        const updateID = {
            keyvalues: {
                tokenID: tokenID,
            },
        }
        await pinata.hashMetadata(myAssetResult.path, updateID)
        setFlag(true)
        closeModal()
    };

    return(
        <div>
            <Modal
                className ="Modal"
                overlayClassName="overlay"
                isOpen={isModalOpen}
                onRequestClose={closeModal}
            >
                <ul css={modalContainer}>
                    <li>NFT 생성하기</li>
                    <li css={audioFile}>
                        <input ref={audioRef} className="upload-name" placeholder="음악 파일" readOnly/>
                        <label htmlFor="audio-file">파일찾기</label>
                        <input type="file" id="audio-file"style={{display:"none"}} onChange={audioCapture}/>
                    </li>
                    <li css={imageFile}>
                        <input ref={imageRef} className="upload-name" placeholder="이미지 파일" onChange={imageCapture} readOnly/>
                        <label htmlFor="image-file">파일찾기</label>
                        <input type="file" id="image-file" style={{display: "none"}} onChange={imageCapture}/>
                    </li>
                    <li>
                        <input css={input} ref={titleRef} type="text" id="setTitle" size="71" placeholder="제목"/>
                    </li>
                    <li>
                        <input css={input} ref={authorRef} type="text" id="setAuthor" size="71" placeholder="아티스트"/>
                    </li>
                    <li>
                        <textarea css={input} ref={descriptionRef} id="setDescription" cols="33" rows="10" placeholder="추가적인 설명을 작성해주세요."/>
                    </li>
                    <input css={uploadButton} type="button" id="create" value="업로드하기" onClick={createToken}/>
                </ul>
            </Modal>
        </div>
    )
}

export default CreateNftForm;