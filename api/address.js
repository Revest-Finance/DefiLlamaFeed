require('isomorphic-fetch');

module.exports = async (req, res) => {
    handleCORS(res);
    let status = 200;
    
    const URL = "https://api.etherscan.io/api?module=account&action=tokentx&address=0xA81bd16Aa6F6B25e66965A2f842e9C806c0AA11F&page=1&offset=10000&startblock=0&endblock=latest&sort=asc&apikey=" + process.env.ETHERSCAN_API;
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
    console.log(tokens);
    for(const address in tokens){
        if(tokens[address] > 0) {
        realTokens.add(address);
        }
    }
    let body = Array.from(realTokens);
    const response = {
        statusCode: status,
        body
    };
    res.send(response);
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