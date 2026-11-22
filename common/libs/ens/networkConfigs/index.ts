import mainJson from './main.json';
import rinkebyJson from './rinkeby.json';
import ropstenJson from './ropsten.json';
import rskJson from './rsk.json';

const main: IEnsAddresses = mainJson;
const rinkeby: IEnsAddresses = rinkebyJson;
const ropsten: IEnsAddresses = ropstenJson;
const rsk: IEnsAddresses = rskJson;

interface IEnsAddresses {
  public: {
    resolver: string;
    reverse: string;
    ethAuction: string;
  };
  registry: string;
}

export interface ITLDCollection {
  [key: string]: boolean;
}

export function getENSAddressesForChain(chainId: number): IEnsAddresses {
  switch (chainId) {
    case 30:
      return rsk;
    default:
      return main;
  }
}

export function getENSTLDForChain(chainId: number): string {
  if (chainId === 30) {
    return 'rsk';
  }

  return 'eth';
}

export function getValidTLDsForChain(chainId: number): ITLDCollection {
  if (chainId === 30) {
    return { rsk: true };
  }

  return {
    mintme: true,
    test: true,
    reverse: true
  };
}

export default { main, rinkeby, ropsten, rsk };
