export interface Ability {
  ability: {
    name: string
    url: string
  }
  is_hidden: boolean
  slot: number
}

export interface Form {
  name: string
  url: string
}

export interface GameIndex {
  game_index: number
  version: {
    name: string
    url: string
  }
}

export interface HeldItemVersion {
  version: {
    name: string
    url: string
  }
  rarity: number
}

export interface HeldItem {
  item: {
    name: string
    url: string
  }
  version_details: HeldItemVersion[]
}

export interface MoveLearnMethod {
  name: string
  url: string
}

export interface VersionGroup {
  name: string
  url: string
}

export interface MoveVersion {
  move_learn_method: MoveLearnMethod
  version_group: VersionGroup
  level_learned_at: number
}

export interface Move {
  move: {
    name: string
    url: string
  }
  version_group_details: MoveVersion[]
}

export interface Species {
  name: string
  url: string
}

export interface Sprites {
  back_default: string | null
  back_female: string | null
  back_shiny: string | null
  back_shiny_female: string | null
  front_default: string | null
  front_female: string | null
  front_shiny: string | null
  front_shiny_female: string | null
  // You can add more sprite fields if needed
}

export interface Stat {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export interface Type {
  slot: number
  type: {
    name: string
    url: string
  }
}

export default interface PokemonResponse {
  id: number
  name: string
  base_experience: number
  height: number
  is_default: boolean
  order: number
  weight: number
  abilities: Ability[]
  forms: Form[]
  game_indices: GameIndex[]
  held_items: HeldItem[]
  moves: Move[]
  species: Species
  sprites: Sprites
  stats: Stat[]
  types: Type[]
}
