const axios = require('axios');
const { vaultResponse } = require('./server/type');

function loadConfig() {
  /*
  const vault = `${process.env.VAULT_ADDR}/v1/csuos/nera`;
  return axios.get(vault, {
    // VAULT 서버와 통신, 환경변수로 VAULT 주소 받음
    headers: {
      'X-Vault-Token': process.env.VAULT_TOKEN,
      // 환경변수로 VAULT 토큰 값 받음
    },
  }).then((res: typeof vaultResponse) => res.data.data).catch((err: Error) => {
    console.log(err);
  });*/
  return {
    "accessSecretKey" : "12312412"
  }
}
exports.config = loadConfig();
