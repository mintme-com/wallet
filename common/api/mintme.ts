import {bityConfig, mintmeApiV2URL} from 'config';
import {checkHttpStatus, parseJSON} from "./utils";

export default function getDeployedTokens() {
  return fetch(`${mintmeApiV2URL}/open/assets/?deployed=true`, {
    method: 'get',
    headers: new Headers(bityConfig.postConfig.headers)
  })
    .then(checkHttpStatus)
    .then(parseJSON);
}
