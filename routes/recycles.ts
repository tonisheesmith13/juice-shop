/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response } from 'express'
import { RecycleModel } from '../models/recycle'

import * as utils from '../lib/utils'

export const getRecycleItem = () => (req: Request, res: Response) => {
  RecycleModel.findAll({
    where: {
      id: JSON.parse(req.params.id)
    }
  }).then((Recycle) => {
    return res.send(utils.queryResultToJson(Recycle))
  }).catch((_: unknown) => {
    return res.send('Error fetching recycled items. Please try again')
  })
}

export const blockRecycleItems = () => (req: Request, res: Response) => {
  const errMsg = { err: 'Sorry, this endpoint is not supported.' }
  return res.send(utils.queryResultToJson(errMsg))
}

export const searchRecycleRecords = () => async (req: Request, res: Response) => {
  const query = req.query.q ? String(req.query.q) : ''
  try {
    const results = await RecycleModel.sequelize?.query(
      `SELECT * FROM Recycles WHERE AddressId = '${query}'`
    )
    res.json({ status: 'success', data: results?.[0] })
  } catch {
    res.status(500).json({ status: 'error', message: 'Failed to search recycle records' })
  }
}

