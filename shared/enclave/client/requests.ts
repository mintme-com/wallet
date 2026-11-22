import { EnclaveMethods, EnclaveMethodParams, EnclaveResponse } from 'shared/enclave/types';
import { PROTOCOL_NAME } from 'shared/enclave/utils';

export function makeRequest<T>(type: EnclaveMethods, params: EnclaveMethodParams): Promise<T> {
  const request = window.electronAPI
    ? window.electronAPI.invokeEnclave<T>(type, params)
    : fetch(`${PROTOCOL_NAME}://${type}`, {
        method: 'POST',
        body: JSON.stringify(params)
      }).then(res => res.json());

  return request.then((res: EnclaveResponse<T>) => {
    const { error, data } = res;
    if (!error) {
      return data!;
    }
    throw new Error(error.message || 'Unknown response from server');
  });
}
