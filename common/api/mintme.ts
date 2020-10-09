import {mintmeApiV2URL} from 'config';
import {checkHttpStatus, parseJSON} from "./utils";

export function getDeployedTokens() {
  return fetch(`${mintmeApiV2URL}/open/assets/`, {
    method: 'get',
    headers: new Headers(bityConfig.postConfig.headers)
  })
    .then(checkHttpStatus)
    .then(parseJSON);
}
