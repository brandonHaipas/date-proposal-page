import { useState } from 'preact/hooks';
import { LandingPage } from './pages/LandingPage';
import { BookingPage } from './pages/BookingPage';
import { Card } from './components/Card';
import './index.css';

type Step = 'ask' | 'no' | 'booking' | 'confirmed';

export function App() {
  const [step, setStep] = useState<Step>('ask');
  const [chosenSlot, setChosenSlot] = useState<string | null>(null);

  if (step === 'ask') {
    return <LandingPage onYes={() => setStep('booking')} onNo={() => setStep('no')} />;
  }
  if (step === 'no') {
    return (
      <Card align="center">
        <p className="question">Okay, no worries — thanks for reading this far.</p>
      </Card>)
  }
  if (step === 'booking') {
    return (
      <BookingPage
        onBooked={(slot) => {
          setChosenSlot(slot);
          setStep('confirmed');
        }}
      />
    );
  }
  return (
    <Card align="center">
      <p className="question">See you {chosenSlot} 🎉</p>
    </Card>
  );
}