/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import config from 'config'
import { type Request, type Response } from 'express'

import * as utils from '../lib/utils'

export function retrieveAppVersion () {
  return (_req: Request, res: Response) => {
    res.json({
      version: config.get('application.showVersionNumber') ? utils.version() : ''
    })
  }
}

export function checkAppUpdate () {
  return async (req: Request, res: Response) => {
    const updateUrl = req.query.url ? String(req.query.url) : 'https://api.github.com/repos/juice-shop/juice-shop/releases/latest'
    try {
      const response = await fetch(updateUrl)
      const data = await response.json()
      res.status(200).json({ status: 'success', data })
    } catch {
      res.status(502).json({ status: 'error', message: 'Failed to fetch release metadata' })
    }
  }
}

