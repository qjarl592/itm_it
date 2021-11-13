// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC721.sol";
import "./IERC721Receiver.sol";
import "./IERC721Metadata.sol";
import "./Address.sol";
import "./SafeMath.sol";
import "./Context.sol";
import "./Strings.sol";
import "./ERC165.sol";
import "./Counters.sol";

/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension, but not including the Enumerable extension, which is available separately as
 * {ERC721Enumerable}.
 */

contract ERC721 is Context, ERC165, IERC721, IERC721Metadata {
    using Address for address;
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    //ipfshash와 토큰 매핑
    mapping(uint256 => asset) private _tokenURIs;

    struct asset {
        uint tokenIdListIndex;
        string ipfsHash;
    }

    uint256 [] private _tokenIdList;

    mapping(address => uint256 [] ) private _myAllTokenIds;

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");
        return _balances[owner];
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }
    /**
     * @dev See {IERC721Metadata-name}.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory ipfsHashAddr = _tokenURIs[tokenId].ipfsHash;
        /*
        string memory base = _baseURI();
        
        if (bytes(base).length == 0) {
            return ipfsHashAddr;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(ipfsHashAddr).length > 0) {
            return string(abi.encodePacked(base, ipfsHashAddr));
        }

        return bytes(base).length > 0 ? string(abi.encodePacked(base, tokenId.toString())) : "";

        */

        return ipfsHashAddr;
    }   

    function getAllTokensHash() public view returns (string [] memory) {
        string [] memory result = new string[](_tokenIdList.length);

        for(uint i = 0 ; i < _tokenIdList.length ; i++) {
            string memory ipfsHashAddr = _tokenURIs[_tokenIdList[i]].ipfsHash;
            result[i] = ipfsHashAddr;
        }

        return result;
    }

    function getMyAllTokenids(address owner) public view returns (uint [] memory) {
        return _myAllTokenIds[owner];
    }

    function getMyAllTokensHash(address owner) public view returns (string [] memory) {
        string [] memory result = new string[](_myAllTokenIds[owner].length);

        for(uint i = 0 ; i < _myAllTokenIds[owner].length ; i++) {
            string memory ipfsHashAddr = _tokenURIs[_myAllTokenIds[owner][i]].ipfsHash;
            result[i] = ipfsHashAddr;
        }

        return result;
    }

    function getAllEnableTokenIds() public view returns (uint [] memory) {
        return _tokenIdList;
    }


    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overriden in child contracts.
     */

    function _baseURI() internal view virtual returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    /**
     * @dev See {IERC721-approve}.
     */

    function approve(address to, uint256 tokenId) public virtual override {
        address owner = ERC721.ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");

        require(
            _msgSender() == owner || isApprovedForAll(owner, _msgSender()),
            "ERC721: approve caller is not owner nor approved for all"
        );

        _approve(to, tokenId);
    }

    /**
     * @dev See {IERC721-getApproved}.
     */
    function getApproved(uint256 tokenId) public view virtual override returns (address) {
        require(_exists(tokenId), "ERC721: approved query for nonexistent token");

        return _tokenApprovals[tokenId];
    }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        require(operator != _msgSender(), "ERC721: approve to caller");

        _operatorApprovals[_msgSender()][operator] = approved;
        emit ApprovalForAll(_msgSender(), operator, approved);
    }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */

    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override{
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }

    /* 
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * `_data` is additional data, it has no specified format and it is sent in call to `to`.
     *
     * This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
     * implement alternative mechanisms to perform token transfer, such as signature-based.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */

    function _safeTransfer(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) internal virtual {
        _transfer(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`),
     * and stop existing when they are burned (`_burn`).
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

    /**
     * @dev Returns whether `spender` is allowed to manage `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ERC721.ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    function mint(address to, string calldata ipfsHash) external returns (uint256) {
        require(to != address(0), "ERC721: mint to the zero address");
        require(msg.sender == to);

        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();

        asset storage newAsset = _tokenURIs[tokenId];

        _owners[tokenId] = msg.sender;
        _balances[to] += 1;
        _myAllTokenIds[to].push(tokenId);

        _setTokenURI(tokenId, newAsset, ipfsHash);
        _tokenIdList.push(tokenId);
        newAsset.tokenIdListIndex = _tokenIdList.length - 1;

        emit Transfer(address(0), to, tokenId);
        return _tokenIds.current();
    }

    function _setTokenURI(uint256 tokenId, asset storage newAsset, string memory ipfsHash) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        newAsset.ipfsHash = ipfsHash;
    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function purchase(address buyer, address payable seller, uint256 tokenId) public payable {
        require(msg.sender == buyer);
        require(msg.sender != seller, "you can't buy your own token");
        require(seller == ownerOf(tokenId));

        _approve(buyer, tokenId);

        seller.transfer(msg.value);

        safeTransferFrom(seller, buyer, tokenId);
    }

    function burn(uint256 tokenId) external {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ERC721.ownerOf(tokenId);
        require(owner == msg.sender, "msg.sender is NOT the owner of the token");

        // Clear approvals
        _approve(address(0), tokenId);

        _balances[owner] -= 1;
        delete _owners[tokenId];

        for(uint i = 0 ; i < _myAllTokenIds[owner].length ; i++){
            if(_myAllTokenIds[owner][i] == tokenId) {
                _myAllTokenIds[owner][i] = _myAllTokenIds[owner][_myAllTokenIds[owner].length - 1];
                _myAllTokenIds[owner].pop();
                return;
            }
        }

        uint tokenLastIndex = _tokenIdList.length - 1;
        uint tokenLastIndexItem = _tokenIdList[tokenLastIndex];
        uint burnableTokenIndex = _tokenURIs[tokenId].tokenIdListIndex;

        _tokenIdList[burnableTokenIndex] = tokenLastIndexItem;

        _tokenIdList.pop();
        _tokenURIs[tokenLastIndexItem].tokenIdListIndex = burnableTokenIndex;

        delete _tokenURIs[tokenId];

        emit Transfer(owner, address(0), tokenId);
    }

    /**
     * @dev Transfers `tokenId` from `from` to `to`.
     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     *
     * Emits a {Transfer} event.
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {
        require(ERC721.ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
        require(to != address(0), "ERC721: transfer to the zero address");

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        for(uint i = 0 ; i < _myAllTokenIds[from].length ; i++){
            if(_myAllTokenIds[from][i] == tokenId) {
                _myAllTokenIds[from][i] = _myAllTokenIds[from][_myAllTokenIds[from].length - 1];
                _myAllTokenIds[from].pop();
            }
        }

        _myAllTokenIds[to].push(tokenId);

        emit Transfer(from, to, tokenId);
    }

    /**
     * @dev Approve `to` to operate on `tokenId`
     *
     * Emits a {Approval} event.
     */
    function _approve(address to, uint256 tokenId) internal virtual {
        _tokenApprovals[tokenId] = to;
        emit Approval(ERC721.ownerOf(tokenId), to, tokenId);
    }

    /**
     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
     * The call is not executed if the target address is not a contract.
     *
     * @param from address representing the previous owner of the given token ID
     * @param to target address that will receive the tokens
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes optional data to send along with the call
     * @return bool whether the call correctly returned the expected magic value
     */
    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) private returns (bool) {
        if (to.isContract()) {
            try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, _data) returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

}


