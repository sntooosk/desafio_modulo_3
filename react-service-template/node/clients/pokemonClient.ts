import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import type PokemonResponse from '../middlewares/pokemonResponse'

export default class PokemonClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('https://pokeapi.co/api/v2/pokemon', context, options)
  }

  public getPokemonById(id: number | string): Promise<PokemonResponse> {
    return this.http.get(`/${id}`)
  }
}
