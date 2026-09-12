import { useEffect, useState } from 'preact/hooks';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface BookingPageProps {
  onBooked: (slotIso: string) => void;
}

type LoadState = 'loading' | 'ready' | 'error';
type SubmitState = 'idle' | 'submitting' | 'error';

function formatSlot(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function BookingPage({ onBooked }: BookingPageProps) {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [slots, setSlots] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/availability')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar la disponibilidad');
        return res.json();
      })
      .then((data: { slots: string[] }) => {
        setSlots(data.slots);
        setLoadState('ready');
      })
      .catch(() => setLoadState('error'));
  }, []);

  const canSubmit =
    selected !== null &&
    guestName.trim().length > 0 &&
    /^\S+@\S+\.\S+$/.test(guestEmail) &&
    submitState !== 'submitting';

  async function handleConfirm() {
    if (!selected) return;
    setSubmitState('submitting');
    setSubmitError(null);

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotIso: selected, guestName, guestEmail }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Algo salió mal al reservar este horario.');
      }

      onBooked(selected);
    } catch (err) {
      setSubmitState('error');
      setSubmitError(err instanceof Error ? err.message : 'Algo salió mal.');
    }
  }

  if (loadState === 'loading') {
    return (
      <Card align="center">
        <p className="question">Revisando su calendario…</p>
      </Card>
    );
  }

  if (loadState === 'error') {
    return (
      <Card align="center">
        <p className="question">No se pudieron cargar los horarios disponibles.</p>
        <p className="eyebrow">Intenta recargar la página.</p>
      </Card>
    );
  }

  if (slots.length === 0) {
    return (
      <Card align="center">
        <p className="question">No hay horarios disponibles ahora mismo.</p>
        <p className="eyebrow">Vuelve pronto o contáctame directamente.</p>
      </Card>
    );
  }

  return (
    <Card align="center">
      <p className="eyebrow">Elige un horario</p>
      <h1 className="question">¿Qué horario te funciona?</h1>

      <div className="slots">
        {slots.map((slot) => (
          <label className={`slot ${selected === slot ? 'slot-selected' : ''}`} key={slot}>
            <input
              type="radio"
              name="slot"
              checked={selected === slot}
              onChange={() => setSelected(slot)}
            />
            {formatSlot(slot)}
          </label>
        ))}
      </div>

      <div className="fields">
        <input
          type="text"
          placeholder="Tu nombre"
          value={guestName}
          onInput={(e) => setGuestName((e.target as HTMLInputElement).value)}
        />
        <input
          type="email"
          placeholder="Tu correo electrónico"
          value={guestEmail}
          onInput={(e) => setGuestEmail((e.target as HTMLInputElement).value)}
        />
      </div>

      {submitState === 'error' && submitError && (
        <p className="error-text">{submitError}</p>
      )}

      <Button variant="ember" onClick={handleConfirm}>
        {submitState === 'submitting' ? 'Reservando…' : 'Confirmar'}
      </Button>
    </Card>
  );
}