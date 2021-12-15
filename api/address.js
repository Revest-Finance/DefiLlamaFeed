require('isomorphic-fetch');
import {addresses} from '../addresses.js';


module.exports = async (req, res) => {
    handleCORS(res);
    let status = 200;
    let network = 1;
    if(req.query.chainId != undefined) {
        network = Number(req.query.chainId);
        if(!addresses.hasOwnProperty(network)) {
            network = 1;
        }
    }
    
    const ETH_URL = addresses[network].SCAN_URL + "/api?module=account&action=tokentx&address=" + addresses[network].TOKENVAULT  +"&page=1&offset=10000&startblock=0&endblock=latest&sort=asc&apikey=" + process.env["ETHERSCAN_API_" + network];
    console.log(ETH_URL);
    let body = await formList(ETH_URL);
    const response = {
        statusCode: status,
        body
    };
    res.send(response);
}

async function formList(URL) {
    let fullLog = await fetch(URL);
    let ethersResp = await fullLog.json();
    let tokens = {};
    let realTokens = new Set();
    for(let i in ethersResp.result) {
        let inputData = ethersResp.result[i];
        if(!tokens.hasOwnProperty(inputData.contractAddress)){
        tokens[inputData.contractAddress] = 0;
        }
        tokens[inputData.contractAddress] += Number(inputData.value);
    }
    for(const address in tokens){
        if(tokens[address] > 0) {
        realTokens.add(address);
        }
    }
    return Array.from(realTokens);
}


function handleCORS(res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
}