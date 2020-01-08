import { Photon } from '@prisma/photon'
import { ContextParameters } from 'graphql-yoga/dist/types'

export interface Context {
  photon: Photon
  request: ContextParameters['request']
  response: ContextParameters['response']
}

export interface Token {
  userId: string
  type: string
  timestamp: number
}
