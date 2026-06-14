import { GlassCard } from '../../components/ui'

export function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#0b1c30' }}>Help Center</h2>
        <p style={{ fontSize: 16, color: '#464555', marginTop: 4 }}>
          Find answers, tutorials, and contact support.
        </p>
      </div>

      <GlassCard style={{ padding: 28 }}>
        <div className="py-16 text-center" style={{ color: '#464555', fontSize: 15 }}>
          Help resources coming soon.
        </div>
      </GlassCard>
    </div>
  )
}
