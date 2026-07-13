export interface AIModels {
  models: {
    name: string
  }[]
}

export interface ModelStore {
    model: string,
    setModel: (model: string) => void
}