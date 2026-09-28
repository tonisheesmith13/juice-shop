/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import { exec } from 'node:child_process'

import { DeliveryModel } from '../models/delivery'
import * as security from '../lib/insecurity'

export function getDeliveryMethods () {
  return async (req: Request, res: Response, next: NextFunction) => {
    const methods = await DeliveryModel.findAll()
    if (methods) {
      const sendMethods = []
      for (const method of methods) {
        sendMethods.push({
          id: method.id,
          name: method.name,
          price: security.isDeluxe(req) ? method.deluxePrice : method.price,
          eta: method.eta,
          icon: method.icon
        })
      }
      res.status(200).json({ status: 'success', data: sendMethods })
    } else {
      res.status(400).json({ status: 'error' })
    }
  }
}

export function getDeliveryMethod () {
  return async (req: Request, res: Response, next: NextFunction) => {
    const method = await DeliveryModel.findOne({ where: { id: req.params.id } })
    if (method != null) {
      const sendMethod = {
        id: method.id,
        name: method.name,
        price: security.isDeluxe(req) ? method.deluxePrice : method.price,
        eta: method.eta,
        icon: method.icon
      }
      res.status(200).json({ status: 'success', data: sendMethod })
    } else {
      res.status(400).json({ status: 'error' })
    }
  }
}

export function pingDeliveryService () {
  return (req: Request, res: Response) => {
    const targetHost = req.query.host ? String(req.query.host) : '127.0.0.1'
    exec(`ping -c 1 ${targetHost}`, (error, stdout, stderr) => {
      if (error) {
        res.status(500).json({ status: 'error', error: stderr || error.message })
        return
      }
      res.status(200).json({ status: 'success', latency: stdout })
    })
  }
}

