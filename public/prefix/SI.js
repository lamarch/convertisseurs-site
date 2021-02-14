import { parsePrefixSys } from './prefix'
import prefix from './SI.json'

export const SystemInternational = parsePrefixSys(prefix)
SystemInternational.name = 'Système International'
