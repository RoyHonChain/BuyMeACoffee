const hre = require("hardhat");

async function getBalance(address){
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses){
    let idx=0;

    for(const address of addresses){
        console.log(`Address ${idx} balance: `,await getBalance(address));
        idx++;
    }
}

async function printMemos(memos){
    for(const memo of memos){
        const timestamp=memo.timestamp;
        const tipper=memo.name;
        const tipperAddress=memo.from;
        const message=memo.message;
        const amount=hre.ethers.utils.formatEther(memo.amount);
        console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) send:"${amount}" said: "${message}"`);
    }
}

async function main(){
    const [owner,tipper1,tipper2,tipper3] = await hre.ethers.getSigners();

    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();

    await buyMeACoffee.deployed();

    console.log("BuyMeACoffe deployed to", buyMeACoffee.address);

    const addresses = [owner.address,tipper1.address,buyMeACoffee.address];
    console.log("== Start ==");
    await printBalances(addresses);

    const tip={value: hre.ethers.utils.parseEther("1")};
    await buyMeACoffee.connect(tipper1).buyCoffee("AAA","111111",tip);
    await buyMeACoffee.connect(tipper2).buyCoffee("BBB","222222",tip);
    await buyMeACoffee.connect(tipper3).buyCoffee("CCC","333333",tip);

    console.log("== After Buy Coffee ==");
    await printBalances(addresses);

    await buyMeACoffee.connect(owner).withdrawTips();
    console.log("== After withdrawTips ==");
    await printBalances(addresses);

    console.log("== memos ==");
    const memos = await buyMeACoffee.getMemos();
    await printMemos(memos);

}

main();