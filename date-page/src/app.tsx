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
        <p className="question">Está bien, no pasa nada — gracias por llegar hasta aquí.</p>
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
      <p className="question">Nos vemos {chosenSlot} 🎉</p>
    </Card>
  );
}