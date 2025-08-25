// react/PokemonForm.tsx
import React, { useState, FormEvent } from 'react'

type Pokemon = {
  id: number
  name: string
  height?: number
  weight?: number
  types?: Array<{ type: { name: string } }>
  sprites?: { front_default?: string }
  [key: string]: any
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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setData(null)

    try {
      setLoading(true)

      const numericId = id.trim()
      const body = numericId ? { id: Number(numericId) } : {}

      const res = await fetch(endpointBase, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({} as any))
        setError((errJson as any).message || '')
        return
      }

      const json: Pokemon = await res.json()
      setData(json)

      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({
        event: 'pokemonSearch',
        pokemonSearch: {
          id: Number(json.id),
          name: String(json.name || '').toLowerCase(),
          height: Number(json.height),
        },
      })
    } catch (err) {
      const e = err as { message?: string }
      setError(e?.message || '')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto' }}>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          type="number"
          value={id}
          onChange={e => setId(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: 8,
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Carregando...' : buttonText}
        </button>
      </form>

      {error && <div style={{ marginTop: 12, color: '#b00020' }}>{error}</div>}

      {data && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            border: '1px solid #eee',
            borderRadius: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {data.sprites?.front_default && (
              <img
                src={data.sprites.front_default}
                alt={data.name}
                width={72}
                height={72}
              />
            )}
            <div>
              <strong>#{data.id} {data.name}</strong>
              <div>Tipos: {(data.types || []).map(t => t.type?.name).join(', ') || '-'}</div>
              {data.height && <div>Altura: {data.height}</div>}
              {data.weight && <div>Peso: {data.weight}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PokemonForm

export const schema = {
  title: 'Pokemon Form',
  description:
    'Formulário para buscar Pokémon por ID, consumir endpoint do Módulo 2 e disparar evento no dataLayer.',
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
    buttonText: {
      title: 'Texto do botão',
      type: 'string',
      default: 'Buscar',
    },
  },
}
