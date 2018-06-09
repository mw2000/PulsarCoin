const SHA256 = require("crypto-js/sha256"); //Importing the SHA256 hashing function

module.exports = class Block {
  constructor(timestamp, transactions, previousHash = ''){
    //assigning data to the block
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.hash = this.calculateHash(); //Calculate Hash of the current block
    this.nonce = 0;
  }

  /*Returns the Hash of the block by adding index, data, timestamp and the previous hash using the SHA256 hashing algorithm*/
  calculateHash() {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }

  //Mines block
  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        this.nonce++;
        this.hash = this.calculateHash();
    }
    console.log("BLOCK MINED: " + this.hash);
  }
}
