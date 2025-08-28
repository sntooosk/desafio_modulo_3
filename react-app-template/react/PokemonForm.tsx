import React, { useState, FormEvent } from 'react'

type Pokemon = {
  id: number
  name: string
  height?: number
  weight?: number
  abilities?: Array<{ ability: { name: string }; is_hidden?: boolean }>
  stats?: Array<{ base_stat: number; stat: { name: string } }>
  types?: Array<{ type: { name: string } }>
  moves?: Array<{ move: { name: string } }>
  sprites?: { front_default?: string; other?: any }
}

type Props = {
  endpointBase?: string
  placeholder?: string
  buttonText?: string
}

const PokemonForm: React.FC<Props> = ({
  endpointBase = '/_v/find-pokemon',
  placeholder = 'Digite o ID do Pokémon (ex: 25)',
  buttonText = 'Buscar',
}) => {
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Pokemon | null>(null)
  const [showMore, setShowMore] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setData(null)
    try {
      setLoading(true)
      const res = await fetch(endpointBase, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(id.trim() ? { id: Number(id) } : {}),
      })
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        setError(errJson.message || '')
        return
      }
      const json: Pokemon = await res.json()
      setData(json)
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({
        event: 'pokemonSearch',
        pokemonSearch: {
          id: json.id,
          name: (json.name || '').toLowerCase(),
          height: json.height ?? 0,
        },
      })
    } catch (err) {
      setError((err as { message?: string })?.message || '')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      id="pokemon-form-container"
      data-testid="pokemon-form-container"
      style={styles.container}
    >
      <form
        id="pokemon-form"
        data-testid="pokemon-form"
        onSubmit={onSubmit}
        style={styles.form}
      >
        <input
          id="pokemon-input"
          data-testid="pokemon-input"
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder={placeholder}
          style={styles.input}
        />
        <button
          id="pokemon-button"
          data-testid="pokemon-button"
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? 'Carregando...' : buttonText}
        </button>
      </form>

      {error && (
        <div
          id="pokemon-error"
          data-testid="pokemon-error"
          style={styles.error}
        >
          {error}
        </div>
      )}

      {data && (
        <div
          id="pokemon-result"
          data-testid="pokemon-result"
          style={styles.card}
        >
          <div id="pokemon-result-row" data-testid="pokemon-result-row" style={styles.row}>
            {data.sprites?.front_default && (
              <img
                id="pokemon-image"
                data-testid="pokemon-image"
                src={data.sprites.front_default}
                alt={data.name}
                width={84}
                height={84}
                style={styles.img}
              />
            )}
            <div id="pokemon-summary" data-testid="pokemon-summary" style={{ flex: 1 }}>
              <strong
                id="pokemon-name"
                data-testid="pokemon-name"
                style={styles.title}
              >
                #{data.id} {data.name}
              </strong>
              <div
                id="pokemon-types"
                data-testid="pokemon-types"
                style={styles.muted}
              >
                Tipos:{' '}
                {(data.types || []).map((t) => t.type?.name).join(', ') || '—'}
              </div>
              <div id="pokemon-meta" data-testid="pokemon-meta" style={styles.meta}>
                {data.height != null && (
                  <span id="pokemon-height" data-testid="pokemon-height">
                    Altura: {data.height}
                  </span>
                )}
                {data.weight != null && (
                  <span id="pokemon-weight" data-testid="pokemon-weight">
                    Peso: {data.weight}
                  </span>
                )}
              </div>
            </div>
            <button
              id="pokemon-more-btn"
              data-testid="pokemon-more-btn"
              onClick={() => setShowMore(true)}
              style={styles.ghostButton}
              aria-haspopup="dialog"
              aria-controls="pokemon-details-modal"
            >
              Ver mais informações
            </button>
          </div>
        </div>
      )}

      {data && showMore && (
        <PokemonDetailsModal
          id="pokemon-details-modal"
          dataTestId="pokemon-details-modal"
          pokemon={data}
          onClose={() => setShowMore(false)}
        />
      )}
    </div>
  )
}

export default PokemonForm

// -------- Modal usando SOMENTE os dados da sua API --------
const PokemonDetailsModal: React.FC<{
  id?: string
  dataTestId?: string
  pokemon: Pokemon
  onClose: () => void
}> = ({ id, dataTestId, pokemon, onClose }) => {
  const art =
    (pokemon.sprites as any)?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default ||
    ''

  return (
    <div
      id={id}
      data-testid={dataTestId}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pokemon-details-title"
      onClick={onClose}
      style={styles.backdrop}
    >
      <div
        id="pokemon-details-card"
        data-testid="pokemon-details-card"
        onClick={(e) => e.stopPropagation()}
        style={styles.modal}
      >
        <div
          id="pokemon-details-header"
          data-testid="pokemon-details-header"
          style={styles.modalHeader}
        >
          <h2
            id="pokemon-details-title"
            data-testid="pokemon-details-title"
            style={styles.modalTitle}
          >
            #{pokemon.id} {pokemon.name}
          </h2>
          <button
            id="pokemon-details-close"
            data-testid="pokemon-details-close"
            onClick={onClose}
            style={styles.iconButton}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div
          id="pokemon-details-content"
          data-testid="pokemon-details-content"
          style={styles.modalContent}
        >
          {/* Imagem + Infos */}
          <div
            id="pokemon-details-hero"
            data-testid="pokemon-details-hero"
            style={styles.hero}
          >
            {art && (
              <img
                id="pokemon-details-image"
                data-testid="pokemon-details-image"
                src={art}
                alt={pokemon.name}
                style={styles.heroImg}
              />
            )}
            <div
              id="pokemon-details-info"
              data-testid="pokemon-details-info"
            >
              <div
                id="pokemon-details-grid"
                data-testid="pokemon-details-grid"
                style={styles.grid}
              >
                <InfoItem
                  label="Base XP"
                  value={String((pokemon as any).base_experience ?? '—')}
                />
                <InfoItem
                  label="Altura"
                  value={pokemon.height != null ? `${pokemon.height} dm` : '—'}
                />
                <InfoItem
                  label="Peso"
                  value={pokemon.weight != null ? `${pokemon.weight} hg` : '—'}
                />
                <InfoItem
                  label="Tipos"
                  value={
                    (pokemon.types || []).map((t) => t.type?.name).join(', ') ||
                    '—'
                  }
                />
              </div>
            </div>
          </div>

          {/* Habilidades */}
          <Section title="Habilidades">
            <div id="pokemon-abilities" data-testid="pokemon-abilities" style={styles.chips}>
              {(pokemon.abilities || []).map((a, i) => (
                <span
                  key={i}
                  style={styles.chip}
                  data-testid={`ability-${i}`}
                  id={`ability-${i}`}
                >
                  {a.ability.name}
                  {a.is_hidden ? ' (oculta)' : ''}
                </span>
              ))}
              {(pokemon.abilities || []).length === 0 && (
                <span id="abilities-empty" data-testid="abilities-empty" style={styles.muted}>—</span>
              )}
            </div>
          </Section>

          {/* Atributos */}
          <Section title="Atributos">
            <div id="pokemon-stats" data-testid="pokemon-stats" style={styles.stats}>
              {(pokemon.stats || []).map((s, i) => (
                <div
                  key={i}
                  style={styles.statRow}
                  id={`stat-${s.stat.name}`}
                  data-testid={`stat-${s.stat.name}`}
                >
                  <span
                    style={styles.statLabel}
                    id={`stat-label-${s.stat.name}`}
                    data-testid={`stat-label-${s.stat.name}`}
                  >
                    {s.stat.name}
                  </span>
                  <div
                    style={styles.statBarWrap}
                    id={`stat-barwrap-${s.stat.name}`}
                    data-testid={`stat-barwrap-${s.stat.name}`}
                    aria-hidden
                  >
                    <div
                      style={{
                        ...styles.statBar,
                        width: `${Math.min(100, s.base_stat)}%`,
                      }}
                      id={`stat-bar-${s.stat.name}`}
                      data-testid={`stat-bar-${s.stat.name}`}
                    />
                  </div>
                  <span
                    style={styles.statValue}
                    id={`stat-value-${s.stat.name}`}
                    data-testid={`stat-value-${s.stat.name}`}
                  >
                    {s.base_stat}
                  </span>
                </div>
              ))}
              {(pokemon.stats || []).length === 0 && (
                <span id="stats-empty" data-testid="stats-empty" style={styles.muted}>—</span>
              )}
            </div>
          </Section>

          {/* Golpes (limitado para desempenho) */}
          <Section title="Golpes">
            <div id="pokemon-moves" data-testid="pokemon-moves" style={styles.listWrap}>
              {(pokemon.moves || []).slice(0, 30).map((m, i) => (
                <span
                  key={i}
                  style={styles.listItem}
                  id={`move-${i}`}
                  data-testid={`move-${i}`}
                >
                  {m.move.name}
                </span>
              ))}
              {(pokemon.moves?.length || 0) > 30 && (
                <span
                  id="moves-more"
                  data-testid="moves-more"
                  style={styles.muted}
                >
                  … e mais {pokemon.moves!.length - 30}
                </span>
              )}
              {(pokemon.moves || []).length === 0 && (
                <span id="moves-empty" data-testid="moves-empty" style={styles.muted}>—</span>
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => {
  const slug = label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div
      style={styles.infoItem}
      id={`info-${slug}`}
      data-testid={`info-${slug}`}
    >
      <span
        style={styles.infoLabel}
        id={`info-label-${slug}`}
        data-testid={`info-label-${slug}`}
      >
        {label}
      </span>
      <span
        style={styles.infoValue}
        id={`info-value-${slug}`}
        data-testid={`info-value-${slug}`}
      >
        {value}
      </span>
    </div>
  )
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const slug = title.toLowerCase().replace(/\s+/g, '-')
  return (
    <section
      style={{ marginTop: 16 }}
      id={`section-${slug}`}
      data-testid={`section-${slug}`}
    >
      <h3
        style={styles.sectionTitle}
        id={`section-title-${slug}`}
        data-testid={`section-title-${slug}`}
      >
        {title}
      </h3>
      {children}
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 640, margin: '0 auto', padding: 12 },
  form: { display: 'flex', gap: 8 },
  input: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    outline: 'none',
  },
  button: {
    padding: '10px 16px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    background: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    boxShadow: '0 2px 8px rgba(37,99,235,.25)',
  },
  buttonDisabled: { opacity: 0.7, cursor: 'not-allowed' },
  error: { marginTop: 12, color: '#b00020' },
  card: {
    marginTop: 16,
    padding: 14,
    border: '1px solid #eee',
    borderRadius: 14,
    boxShadow: '0 4px 18px rgba(0,0,0,.06)',
    background: '#fff',
  },
  row: { display: 'flex', alignItems: 'center', gap: 12 },
  img: {
    borderRadius: 12,
    background: '#f8fafc',
    boxShadow: 'inset 0 0 0 1px #eef2f7',
  },
  title: { fontSize: 18 },
  muted: { color: '#6b7280' },
  meta: { display: 'flex', gap: 12, marginTop: 6, color: '#374151' },
  ghostButton: {
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    zIndex: 9999,
  },
  modal: {
    width: 'min(920px, 96vw)',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: '#ffffff',
    borderRadius: 16,
    boxShadow: '0 20px 60px rgba(0,0,0,.25)',
    padding: 16,
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    background: '#fff',
    paddingBottom: 8,
    borderBottom: '1px solid #f1f5f9',
    zIndex: 1,
  },
  modalTitle: { margin: 0, fontSize: 20 },
  iconButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 20,
    lineHeight: 1,
  },
  modalContent: { paddingTop: 12, paddingBottom: 8 },
  hero: { display: 'flex', gap: 16, alignItems: 'center' },
  heroImg: {
    width: 120,
    height: 120,
    objectFit: 'contain',
    borderRadius: 16,
    background: '#f8fafc',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))',
    gap: 12,
    marginTop: 12,
  },
  infoItem: {
    padding: 10,
    border: '1px solid #eef2f7',
    borderRadius: 12,
    background: '#fbfdff',
  },
  infoLabel: { display: 'block', fontSize: 12, color: '#6b7280' },
  infoValue: { fontWeight: 700, marginTop: 2 },
  sectionTitle: { margin: '12px 0 8px', fontSize: 16 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: {
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid #e5e7eb',
    background: '#fff',
  },
  stats: { display: 'grid', gap: 10 },
  statRow: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr 40px',
    alignItems: 'center',
    gap: 10,
  },
  statLabel: { color: '#374151', textTransform: 'capitalize' },
  statBarWrap: {
    height: 8,
    borderRadius: 999,
    background: '#eef2f7',
    overflow: 'hidden',
  },
  statBar: { height: '100%', background: '#22c55e' },
  statValue: { textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  listWrap: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  listItem: {
    padding: '6px 10px',
    borderRadius: 8,
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
  },
}

export const schema = {
  title: 'Pokemon Form',
  description:
    'Busca Pokémon por ID, usa sua API e dispara evento no dataLayer.',
  type: 'object',
  properties: {
    endpointBase: {
      title: 'Base do endpoint',
      type: 'string',
      default: '/_v/find-pokemon',
    },
    placeholder: {
      title: 'Placeholder do input',
      type: 'string',
      default: 'Digite o ID do Pokémon (ex: 25)',
    },
    buttonText: { title: 'Texto do botão', type: 'string', default: 'Buscar' },
  },
}
