import { Photon } from '@prisma/photon'

export interface Context {
  photon: Photon
  request: any
  response: any
}

export interface Token {
  userId: string
  type: string
  timestamp: number
}
