import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface LandingPageProps {
  onYes: () => void;
  onNo: () => void;
}

export function LandingPage({ onYes, onNo }: LandingPageProps) {
  return (
    <Card>
      <p className="eyebrow">Una pregunta para ti</p>
      <h1 className="question">
        ¿Saldrías conmigo<br />a una cita?
      </h1>
      <div className="actions">
        <Button variant="ember" onClick={onYes}>Sí, me encantaría</Button>
        <Button variant="ash" onClick={onNo}>Ahora no</Button>
      </div>
    </Card>
  );
}