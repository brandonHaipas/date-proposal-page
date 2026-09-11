import { useState } from 'preact/hooks';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const PLACEHOLDER_SLOTS = [
  'Fri, Sep 12 · 7:00 PM',
  'Sat, Sep 13 · 1:00 PM',
  'Sat, Sep 13 · 6:30 PM',
];

interface BookingPageProps {
  onBooked: (slot: string) => void;
}

export function BookingPage({ onBooked }: BookingPageProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Card align="center">
      <p className="eyebrow">Pick a time</p>
      <h1 className="question">When works for you?</h1>
      <div className="slots">
        {PLACEHOLDER_SLOTS.map((slot) => (
          <label className={`slot ${selected === slot ? 'slot-selected' : ''}`} key={slot}>
            <input
              type="radio"
              name="slot"
              checked={selected === slot}
              onChange={() => setSelected(slot)}
            />
            {slot}
          </label>
        ))}
      </div>
      <Button
        variant="ember"
        onClick={() => selected && onBooked(selected)}
      >
        Confirm
      </Button>
    </Card>
  );
}