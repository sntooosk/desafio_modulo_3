import { json } from 'co-body'
import PokemonResponse from './pokemonResponse'

export async function getPokemon(ctx: Context, next: () => Promise<void>) {
  try {
    const { id } = (await json(ctx.req)) as { id?: string }

    if (!id) {
      ctx.status = 400
      ctx.body = { message: 'O campo id é obrigatório no body.' }
      return
    }

    const pokemon: PokemonResponse = await ctx.clients.pokemon.getPokemonById(id)

    if (pokemon.height >= 15) {
      ctx.status = 400
      ctx.body = { message: 'O Pokémon é grande demais' }
      return
    }

    ctx.status = 200
    ctx.body = pokemon
  } catch (error) {
    const status = error.response?.status ?? 500
    const message =
      status === 404
        ? 'Pokémon não encontrado'
        : status === 400
        ? 'Requisição inválida à PokeAPI'
        : 'Erro interno ao consultar a PokeAPI'

    ctx.status = status
    ctx.body = { message }
  }

  await next()
}
