import showPrompt from './showPrompt';
import template from './passphrase.html?raw';

const EVENT = 'enclave:passphrase';

export function showPassphrasePrompt(): Promise<string> {
  return showPrompt(template, EVENT);
}
