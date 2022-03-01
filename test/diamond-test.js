const { expect } = require('chai');

describe('MyDiamond', function () {
  let dao;
  let user1
  let user2;
  let mytokenfacet;

  describe('#cutFacets', function () {

    before(async function () {
      [dao, user1, user2] = await ethers.getSigners();
    });
  
    beforeEach(async function () {
      //deploy diamond contract
      const MyDiamondFactory = await ethers.getContractFactory('MyDiamond');
      const diamond = await MyDiamondFactory.deploy();
      await diamond.deployed();
  
      //deploy uninitialized token contract
      const MyTokenFactory = await ethers.getContractFactory('MyToken');
      const mytoken = await MyTokenFactory.deploy();
      await mytoken.deployed();

      //deploy uninitialized set contract
      const MySetFactory = await ethers.getContractFactory('MySet');
      const myset = await MySetFactory.deploy();
      await myset.deployed();

      //declare facets to be cut
      const facetCuts = [
        {
          target: mytoken.address,
          action: 0,
          selectors: Object.keys(mytoken.interface.functions).map(
            (fn) => mytoken.interface.getSighash(fn),
          ),
        },
        {
          target: myset.address,
          action: 0,
          selectors: Object.keys(myset.interface.functions)
          .filter((fn) => fn != 'supportsInterface(bytes4)') // filter out duplicates
          .map((fn) => myset.interface.getSighash(fn),
          ),
        },
      ];
  
      //do the cut
      await diamond
        .connect(dao)
        .diamondCut(facetCuts, ethers.constants.AddressZero, '0x');

      //get the instance of the new MyToken facet
      mytokenfacet = await ethers.getContractAt('MyToken', diamond.address);
      //get the instance of the new MySet facet
      mysetfacet = await ethers.getContractAt('MySet', diamond.address);

    });

    describe('MySet facet', function() {

      it('burn requires role of comptroller', async function() {

        //initialize MyToken's storage (metadata and supply)
        await mytokenfacet.initERC20("MyToken", "MTN", 18, 100);
        const totalSupply = await mytokenfacet.totalSupply();
        expect(totalSupply).to.equal(100)

        //initialize MySet balance at id1 to 3 tokens
        await mysetfacet.__mint(dao.address, 1, 3);

        //through mysetfacet, check that balance of id1 is 3
        expect(await mysetfacet.balanceOf(dao.address, 1)).to.equal(3)

        //approve transfer and send 2 of 3 id1 tokens
        await mysetfacet.connect(user2).setApprovalForAll(dao.address, true);
        await mysetfacet.safeTransferFrom(dao.address, user1.address, 1, 2, '0x');

        // check that id1 balance of user1.address was updated from 0 to 2
        expect(await mysetfacet.balanceOf(user1.address, 1)).to.equal(2)

        // now through mytokenfacet, check that the address has the 2 tokens
        const validAddr = await mytokenfacet.verifyRole(1, user1.address);
        expect(validAddr).to.equal(true);

        // confirm that user1 burns (bc they are a comptroller)
        await mytokenfacet.connect(user1).__burn(dao.address, 50);
        expect(await mytokenfacet.totalSupply()).to.equal(50);

        // confirm that user2 cannot burn (bc they are not comptroller)
        await expect(mytokenfacet.connect(user2).__burn(dao.address, 20)).to.be.reverted;
        expect(await mytokenfacet.totalSupply()).to.equal(50);

      })
    })

  });
});