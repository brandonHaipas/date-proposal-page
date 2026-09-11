import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface LandingPageProps {
  onYes: () => void;
  onNo: () => void;
}

export function LandingPage({ onYes, onNo }: LandingPageProps) {
  return (
    <Card>
      <p className="eyebrow">A question, for you</p>
      <h1 className="question">
        Would you go on<br />a date with me?
      </h1>
      <div className="actions">
        <Button variant="ember" onClick={onYes}>Yes, I would</Button>
        <Button variant="ash" onClick={onNo}>Not right now</Button>
      </div>
    </Card>
  );
}