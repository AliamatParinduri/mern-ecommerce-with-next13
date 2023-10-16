/* eslint-disable no-unreachable */
import axios from 'axios'

import { InternalServerError, logger } from '@/utils'
import { RAJAONGKIR_ENDPOINT } from '@config/index'

class RajaOngkirRepository {
  getProvinsi = async (keyword: any) => {
    try {
      return await axios
        .get(`${RAJAONGKIR_ENDPOINT}/province?${keyword}`)
        .then((res: any) => res.data.rajaongkir.results)
    } catch (err: any) {
      logger.error('ERR = Get data Provinsi ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  getKabKot = async (keyword: any) => {
    try {
      return await axios.get(`${RAJAONGKIR_ENDPOINT}/city?${keyword}`).then((res: any) => res.data.rajaongkir.results)
    } catch (err: any) {
      logger.error('ERR = Get data Kabupaten/Kota ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  getKecamatan = async (keyword: any) => {
    try {
      return await axios
        .get(`${RAJAONGKIR_ENDPOINT}/subdistrict?${keyword}`)
        .then((res: any) => res.data.rajaongkir.results)
    } catch (err: any) {
      logger.error('ERR = Get data Kabupaten/Kota ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  getOngkir = async (payload: any, config: object) => {
    try {
      return await axios
        .post(`${RAJAONGKIR_ENDPOINT}/cost`, payload, config)
        .then((res: any) => res.data.rajaongkir.results)
    } catch (err: any) {
      logger.error('ERR = Get data Ongkir ', err.message)
      throw new InternalServerError(err.message)
    }
  }
}

export default RajaOngkirRepository
