import React from 'react';

import translate, { translateRaw } from 'translations';
import trezor from 'assets/images/icn-trezor-new.svg';
import ledger from 'assets/images/icn-ledger-nano.svg';
import { HardwareWalletChoice, OnboardingButton } from '../components';
import './FourthSlide.scss';

export default function FourthSlide() {
  return (
    <section className="FourthSlide">
      <section>
        <h1>{translate('ONBOARDING_TEXT_25')}</h1>
        <br/>
        <p>
          {translate('ONBOARDING_TEXT_29', {
            $link: 'https://support.mycrypto.com/'
          })}
        </p>
        <OnboardingButton />
      </section>
    </section>
  );
}
