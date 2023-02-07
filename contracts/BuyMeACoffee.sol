// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// Deployed to Goerli at 0xc3A08d77B529eCd2B5a8c9254B7b7adE92375efA

contract BuyMeACoffee {
    // event memo created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message,
        uint256 amount
    );

    //Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
        uint256 amount;
    }

    //list all the memos received from frens.
    Memo[] memos;

    address payable public owner;

    //deploy logic
    constructor(){
        owner=payable(msg.sender);
    }

    function transferOwnership(address _newOwner) public {
        require(msg.sender==owner);
        owner=payable(_newOwner);
    }

    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value>0,"yo~ there are no free coffee here~ ");

        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message,
            msg.value
        ));

        emit NewMemo(
            msg.sender, 
            block.timestamp, 
            _name, 
            _message,
            msg.value
        );
    }

    function withdrawTips() public {
        require(owner.send(address(this).balance));

    }

    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }

}
