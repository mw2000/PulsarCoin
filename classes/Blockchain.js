var Block = require('./Block.js');
var Transaction = require('./Transaction.js');
const request = require('sync-request');

module.exports = class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock()];     //Initializes chain with genesis block
    this.difficulty = 5;
    this.pendingTransactions = [];
    this.miningReward = 100;
    this.nodes = [];
  }

  createGenesisBlock(){ // Creates Genesis block to start the chain
    return new Block('6/6/2018', "Genesis Block", 0, "0")
  }

  getLatestBlock(){ //Gets the latest block in the chain
    return this.chain[this.chain.length-1];
  }

  addBlock(newBlock){ //Adds a new Block to the chain
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  minePendingTransactions(miningRewardAddress){
    let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [
        new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(fromAddress, toAddress, amount){
    this.pendingTransactions.push(new Transaction(fromAddress, toAddress, amount));
  }

  getBalanceOfAddress(address){
    let balance=0;

    for(const block of this.chain){
      for(const trans of block.transactions){
        if(trans.fromAddress === address){
          balance = balance - trans.amount;
        }

        if(trans.toAddress === address){
          balance = balance + trans.amount;
        }
      }
    }
    return balance;
  }

  registerNode(address) {
    this.nodes.push(address);
  }

  isChainValid(chain, length){
    for (let i = 1; i < length; i++){ //Looping from one as this.chain[0] is genesis block
      const currentBlock = chain[i];
      const previousBlock =chain[i - 1];

      //If current block hash is different from the hash calculated it is an invalid chain
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      //If current block previoushash is different from the prevois block hash it is an invalid chain
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  resolveConflicts() {
    let neighbours = this.nodes;
    let max_length = this.chain.length;
    var newChain=[];

    for(var node of neighbours){
      var res = request('GET', "http://"+node+"/chain")
      var response = JSON.parse(res.getBody())
      var length = response.length;
      var chain = response.chain;

      if (length > max_length){
        max_length =  length;
        newChain = chain;
        console.log("More")
      }
    }

    var validity =  this.isChainValid(newChain)

    if (newChain.length>0 && validity) {
      this.chain = newChain;
      console.log(this.chain)
      return true;
    }
    else {
      return false;
    }

  }
}
