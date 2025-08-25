import { IOClients } from '@vtex/api'

import PokemonClient from './pokemonClient'

export class Clients extends IOClients {
  public get pokemon() {
    return this.getOrSet('pokemon', PokemonClient)
  }
}
