import showPrompt from './showPrompt';
import template from './pin.html?raw';

const EVENT = 'enclave:pin';

export function showPinPrompt(): Promise<string> {
  return showPrompt(template, EVENT);
}
