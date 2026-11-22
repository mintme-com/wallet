import { IFullWallet, fromPrivateKey } from 'ethereumjs-wallet';
import { toBuffer } from 'ethereumjs-util';
import Worker from './workers/fromV3.worker?worker';

export default function fromV3(
  keystore: string,
  password: string,
  nonStrict: boolean
): Promise<IFullWallet> {
  return new Promise((resolve, reject) => {
    const worker = new Worker();
    worker.postMessage({ keystore, password, nonStrict });
    worker.onmessage = (ev: MessageEvent) => {
      const data = ev.data;
      try {
        const wallet = fromPrivateKey(toBuffer(data));
        resolve(wallet);
      } catch (e) {
        reject(e);
      }
    };
  });
}
