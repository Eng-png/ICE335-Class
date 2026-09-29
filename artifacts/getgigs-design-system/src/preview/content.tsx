import { Guidelines } from './parts';

export function VoiceAndTonePage() {
  return (
    <div className="space-y-6 rounded-xl border bg-card p-6 text-card-foreground">
      <section className="space-y-2">
        <h2 className="font-semibold">Make the next step feel possible</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          GetGigs speaks to artists who are building momentum and venue teams
          who need a dependable fit. Copy should feel direct, encouraging, and
          grounded in the real details that make a booking work.
        </p>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Use language that builds trust</h3>
          <Guidelines
            items={[
              { kind: 'do', text: 'Name the practical next step: check availability, view the fit, or send an inquiry.' },
              { kind: 'do', text: 'Make paid and unpaid opportunities explicit instead of hiding the terms.' },
              { kind: 'do', text: 'Keep venue and artist profiles specific, human, and easy to scan.' },
            ]}
          />
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Avoid unnecessary friction</h3>
          <Guidelines
            items={[
              { kind: 'dont', text: 'Do not use hype that obscures location, genre, date, or compensation.' },
              { kind: 'dont', text: 'Do not make a new artist sound unqualified for being early in their career.' },
              { kind: 'dont', text: 'Do not turn a match into a dead end; always explain what can happen next.' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}