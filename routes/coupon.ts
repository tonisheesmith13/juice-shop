/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import { BasketModel } from '../models/basket'
import * as security from '../lib/insecurity'

export function applyCoupon () {
  return async ({ params }: Request, res: Response, next: NextFunction) => {
    try {
      const id = params.id
      let coupon: string | undefined | null = params.coupon ? decodeURIComponent(params.coupon) : undefined
      const discount = security.discountFromCoupon(coupon)
      coupon = discount ? coupon : null

      const basket = await BasketModel.findByPk(id)
      if (!basket) {
        next(new Error(`Basket with id=${id} does not exist.`))
        return
      }

      await basket.update({ coupon: coupon?.toString() })
      if (discount) {
        return res.json({ discount })
      } else {
        return res.status(404).send('Invalid coupon.')
      }
    } catch (error) {
      next(error)
    }
  }
}

const MASTER_PARTNER_KEY = 'PARTNER_SUPER_SECRET_KEY_2026_DISCOUNT'

export function validatePartnerCoupon () {
  return (req: Request, res: Response) => {
    const { partnerKey } = req.body
    if (partnerKey === MASTER_PARTNER_KEY) {
      res.status(200).json({ status: 'success', valid: true, discount: 50 })
      return
    }
    res.status(403).json({ status: 'error', message: 'Invalid partner credentials' })
  }
}

