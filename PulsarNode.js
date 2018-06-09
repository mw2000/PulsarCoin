var Block = require('./classes/Block.js');
var Transaction = require('./classes/Transaction.js');
var Blockchain = require('./classes/Blockchain.js');

var express =  require('express');
var app = express();

var blockchain =  new Blockchain();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/mine', function(req, res){
  blockchain.minePendingTransactions(req.body.minersAddress);
  res.send("New Block Forged")
});

app.get('/chain', function(req, res){
  res.send({'message':"Chain called", 'chain': blockchain.chain, 'length': blockchain.chain.length});
});

app.post('/transactions/new', function(req, res){
    blockchain.createTransaction(req.body.fromAddress, req.body.toAddress, parseInt(req.body.amount));
    res.send("Transaction will be added");
});

app.post('/balance', function(req, res){
  var bal = blockchain.getBalanceOfAddress(req.body.wallet)
  res.send({"balance":bal});
});

app.post('/nodes/register', function(req, res){
  var nodes = req.body.nodes;
    for(node of nodes){
      blockchain.registerNode(node)
    }
    res.send({'message':"New nodes have been added", 'total_nodes': blockchain.nodes });
});

app.get('/nodes/resolve', function(req, res){
  replaced =  blockchain.resolveConflicts();
  console.log("Was chain replaced " + replaced);

  if(replaced){
    res.send({"message":'Our chain was replaced', "chain": blockchain.chain});
      console.log(blockchain.chain);
  }
  else {
    res.send({"message":'Our chain is authorative', "chain": blockchain.chain})
  }
});


app.listen(8080)
