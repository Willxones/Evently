import { useState } from 'react';
import SignUp from '../auth/SignUp';
import OrganiserSetup from './OrganiserSetup';
import StripeOnboarding from './StripeOnboarding';

export default function OnboardingLayout() {
    const [step, setStep] = useState(0);

    return (
        <div>
            <h1>Onboarding</h1>
            {step == 0 && <SignUp setStep={setStep} />}
            {step == 1 && <OrganiserSetup />}
            {step == 2 && <StripeOnboarding />}
        </div>
    );
}
