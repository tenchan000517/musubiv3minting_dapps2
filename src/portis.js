import Web3 from 'web3';
import Portis from '@portis/web3';

const portis = new Portis('<YOUR_PORTIS_API_KEY>', 'mainnet');
const web3 = new Web3(portis.provider);

export { portis, web3 };
