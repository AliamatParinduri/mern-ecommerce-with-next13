// eslint-disable-next-line array-callback-return

import { Request } from 'express'

import { RajaOngkirRepository } from '@/repository'
import { RAJAONGKIR_APIKEY, originKecamatanId, originKecamatanType } from '@config/index'

class RajaongkirService {
  rajaOngkirRepository = new RajaOngkirRepository()
  keyword = `key=${RAJAONGKIR_APIKEY}`

  joinKeyword = (query: object) => {
    const keys = Object.keys(query)
    const values = Object.values(query)

    for (const [i, key] of keys.entries()) {
      this.keyword += `&${key}=${values[i]}`
    }

    return this.keyword
  }

  getProvinsi = async (req: Request) => {
    return await this.rajaOngkirRepository.getProvinsi(this.joinKeyword(req.query))
  }

  getKabKot = async (req: Request) => {
    return await this.rajaOngkirRepository.getKabKot(this.joinKeyword(req.query))
  }

  getKecamatan = async (req: Request) => {
    return await this.rajaOngkirRepository.getKecamatan(this.joinKeyword(req.query))
  }

  getOngkir = async (payload: any, token: string) => {
    payload = {
      ...payload,
      origin: originKecamatanId,
      originType: originKecamatanType
    }

    const config = {
      headers: {
        key: RAJAONGKIR_APIKEY
      }
    }

    return await this.rajaOngkirRepository.getOngkir(payload, config)
  }
}

export default RajaongkirService
