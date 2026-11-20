import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
try {
  const envFile = readFileSync(path.join(root, '.env'), 'utf8')
  for (const line of envFile.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
} catch {
  // .env is optional in production when variables are provided by the host
}
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { loadDb, mutate, uploadsDir } from './store.ts'
import type {
  BookingStatus,
  Database,
  EnquiryType,
  Seat,
} from './types.ts'

const PORT = Number(process.env.PORT ?? 3001)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'
const JWT_SECRET = process.env.JWT_SECRET ?? ''
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ''
const TOKEN_COOKIE = 'vp_admin'
const isProd = process.env.NODE_ENV === 'production'

function requireEnv() {
  if (!JWT_SECRET || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.warn(
      '[visionplus] Set JWT_SECRET, ADMIN_USERNAME and ADMIN_PASSWORD in .env before using the admin dashboard.',
    )
  }
}

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString('hex')
}

const passwordSalt = createHash('sha256').update(`${JWT_SECRET}:visionplus`).digest('hex')
const passwordHash = ADMIN_PASSWORD ? hashPassword(ADMIN_PASSWORD, passwordSalt) : ''

function verifyPassword(password: string) {
  if (!ADMIN_PASSWORD || !passwordHash) return false
  const next = hashPassword(password, passwordSalt)
  const a = Buffer.from(passwordHash, 'hex')
  const b = Buffer.from(next, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}

function signToken() {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured')
  return jwt.sign({ role: 'admin', sub: ADMIN_USERNAME }, JWT_SECRET, { expiresIn: '12h' })
}

function readToken(token: string) {
  if (!JWT_SECRET) return null
  try {
    return jwt.verify(token, JWT_SECRET) as { role: string; sub: string }
  } catch {
    return null
  }
}

mkdirSync(uploadsDir, { recursive: true })

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase()
      const safe = ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext) ? ext : '.jpg'
      cb(null, `${Date.now()}-${randomBytes(6).toString('hex')}${safe}`)
    },
  }),
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image uploads are allowed'))
  },
})

const app = express()
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use('/uploads', express.static(uploadsDir))

function publicSite(db: Database) {
  return {
    content: db.content,
    hours: db.hours,
    facilities: db.facilities.filter((item) => item.published),
    plans: db.plans.filter((item) => item.published),
    gallery: db.gallery.filter((item) => item.published),
    reviews: db.reviews.filter((item) => item.published),
    seats: db.seats.filter((seat) => seat.kind === 'seat' && seat.active),
    layout: {
      rows: db.gridRows,
      cols: db.gridCols,
      capacity: db.capacity,
      configured: db.seats.some((seat) => seat.kind === 'seat' && seat.active),
    },
    timeSlots: db.timeSlots.filter((slot) => slot.active),
    socials: db.content.socials.filter((link) => link.url.trim()),
  }
}

function occupiedSeatIds(db: Database, date: string, timeSlotId: string | null, exceptBookingId?: string) {
  const blocking: BookingStatus[] = ['Pending', 'Approved']
  const taken = new Set<string>()
  for (const booking of db.bookings) {
    if (exceptBookingId && booking.id === exceptBookingId) continue
    if (!blocking.includes(booking.status)) continue
    if (booking.date !== date) continue
    if ((booking.timeSlotId ?? null) !== (timeSlotId ?? null)) continue
    for (const seatId of booking.seatIds) taken.add(seatId)
  }
  return taken
}

function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.cookies?.[TOKEN_COOKIE] as string | undefined
  const payload = token ? readToken(token) : null
  if (!payload || payload.role !== 'admin') {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/public/site', async (_req, res) => {
  const db = await loadDb()
  res.json(publicSite(db))
})

app.get('/api/public/availability', async (req, res) => {
  const date = String(req.query.date ?? '')
  const timeSlotId = req.query.timeSlotId ? String(req.query.timeSlotId) : null
  if (!date) {
    res.status(400).json({ error: 'Date is required' })
    return
  }
  const db = await loadDb()
  if (!db.seats.some((seat) => seat.kind === 'seat' && seat.active)) {
    res.json({ configured: false, seats: [], occupied: [] })
    return
  }
  const taken = occupiedSeatIds(db, date, timeSlotId)
  const seats = db.seats.map((seat) => ({
    ...seat,
    occupied: taken.has(seat.id),
  }))
  res.json({
    configured: true,
    rows: db.gridRows,
    cols: db.gridCols,
    capacity: db.capacity,
    occupied: [...taken],
    seats,
  })
})

app.post('/api/public/enquiries', async (req, res) => {
  const name = String(req.body?.name ?? '').trim()
  const phone = String(req.body?.phone ?? '').trim()
  const email = String(req.body?.email ?? '').trim()
  const message = String(req.body?.message ?? '').trim()
  const type = (req.body?.type ?? 'general') as EnquiryType
  if (!name || !phone || !message) {
    res.status(400).json({ error: 'Name, phone and message are required' })
    return
  }
  const allowed: EnquiryType[] = ['membership', 'booking', 'general']
  const enquiryType = allowed.includes(type) ? type : 'general'
  await mutate((db) => {
    db.enquiries.unshift({
      id: randomUUID(),
      name,
      phone,
      email,
      type: enquiryType,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    })
  })
  res.status(201).json({ ok: true })
})

app.post('/api/public/bookings', async (req, res) => {
  const name = String(req.body?.name ?? '').trim()
  const phone = String(req.body?.phone ?? '').trim()
  const planId = req.body?.planId ? String(req.body.planId) : null
  const date = String(req.body?.date ?? '').trim()
  const timeSlotId = req.body?.timeSlotId ? String(req.body.timeSlotId) : null
  const seatIds = Array.isArray(req.body?.seatIds) ? req.body.seatIds.map(String) : []
  const notes = String(req.body?.notes ?? '').trim()

  if (!name || !phone || !date || seatIds.length === 0) {
    res.status(400).json({ error: 'Name, phone, date and at least one seat are required' })
    return
  }

  try {
    const booking = await mutate((db) => {
      const activeSeats = db.seats.filter((seat) => seat.kind === 'seat' && seat.active)
      if (activeSeats.length === 0) {
        throw new Error('Seat layout is not configured yet. Please enquire via WhatsApp or phone.')
      }
      const validIds = new Set(activeSeats.map((seat) => seat.id))
      if (seatIds.some((id: string) => !validIds.has(id))) {
        throw new Error('One or more selected seats are invalid')
      }
      if (db.timeSlots.some((slot) => slot.active) && !timeSlotId) {
        throw new Error('Please select a time option')
      }
      if (timeSlotId && !db.timeSlots.some((slot) => slot.id === timeSlotId && slot.active)) {
        throw new Error('Selected time option is not available')
      }
      if (planId && !db.plans.some((plan) => plan.id === planId && plan.published)) {
        throw new Error('Selected membership option is not available')
      }
      const taken = occupiedSeatIds(db, date, timeSlotId)
      if (seatIds.some((id: string) => taken.has(id))) {
        throw new Error('One or more selected seats are no longer available')
      }

      let student = db.students.find((item) => item.phone === phone)
      if (!student) {
        student = {
          id: randomUUID(),
          name,
          phone,
          createdAt: new Date().toISOString(),
        }
        db.students.unshift(student)
      } else {
        student.name = name
      }

      const now = new Date().toISOString()
      const created = {
        id: randomUUID(),
        name,
        phone,
        planId,
        date,
        timeSlotId,
        seatIds,
        notes,
        status: 'Pending' as const,
        adminNote: '',
        createdAt: now,
        updatedAt: now,
      }
      db.bookings.unshift(created)
      return created
    })
    res.status(201).json({
      ok: true,
      bookingId: booking.id,
      status: booking.status,
      message: 'Booking request received. You will get confirmation after admin approval.',
    })
  } catch (error) {
    res.status(409).json({ error: error instanceof Error ? error.message : 'Unable to book' })
  }
})

app.get('/api/public/bookings/lookup', async (req, res) => {
  const phone = String(req.query.phone ?? '').trim()
  if (!phone) {
    res.status(400).json({ error: 'Phone is required' })
    return
  }
  const db = await loadDb()
  const history = db.bookings
    .filter((booking) => booking.phone === phone)
    .map((booking) => ({
      id: booking.id,
      date: booking.date,
      status: booking.status,
      seatLabels: booking.seatIds
        .map((id) => db.seats.find((seat) => seat.id === id)?.label ?? id)
        .join(', '),
      createdAt: booking.createdAt,
      planName: db.plans.find((plan) => plan.id === booking.planId)?.name ?? null,
      timeLabel: db.timeSlots.find((slot) => slot.id === booking.timeSlotId)?.label ?? null,
    }))
  res.json({ bookings: history })
})

app.post('/api/auth/login', (req, res) => {
  const username = String(req.body?.username ?? '')
  const password = String(req.body?.password ?? '')
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
    res.status(503).json({ error: 'Admin authentication is not configured on the server' })
    return
  }
  if (username !== ADMIN_USERNAME || !verifyPassword(password)) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }
  const token = signToken()
  res.cookie(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 12 * 60 * 60 * 1000,
    path: '/',
  })
  res.json({ ok: true })
})

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(TOKEN_COOKIE, { path: '/' })
  res.json({ ok: true })
})

app.get('/api/auth/me', auth, (_req, res) => {
  res.json({ ok: true, username: ADMIN_USERNAME })
})

app.get('/api/admin/dashboard', auth, async (_req, res) => {
  const db = await loadDb()
  const pending = db.bookings.filter((item) => item.status === 'Pending').length
  const approved = db.bookings.filter((item) => item.status === 'Approved').length
  const unread = db.enquiries.filter((item) => !item.read).length
  res.json({
    pendingBookings: pending,
    approvedBookings: approved,
    totalBookings: db.bookings.length,
    students: db.students.length,
    unreadEnquiries: unread,
    publishedPlans: db.plans.filter((item) => item.published).length,
    publishedFacilities: db.facilities.filter((item) => item.published).length,
    galleryCount: db.gallery.length,
    configuredSeats: db.seats.filter((seat) => seat.kind === 'seat' && seat.active).length,
    capacity: db.capacity,
  })
})

app.get('/api/admin/data', auth, async (_req, res) => {
  res.json(await loadDb())
})

app.put('/api/admin/content', auth, async (req, res) => {
  const next = req.body ?? {}
  const db = await mutate((state) => {
    state.content = { ...state.content, ...next }
  })
  res.json(db.content)
})

app.put('/api/admin/hours', auth, async (req, res) => {
  const hours = Array.isArray(req.body?.hours) ? req.body.hours : null
  const hoursNotice = req.body?.hoursNotice
  if (!hours) {
    res.status(400).json({ error: 'Hours payload is required' })
    return
  }
  const db = await mutate((state) => {
    state.hours = hours
    if (typeof hoursNotice === 'string') state.content.hoursNotice = hoursNotice
  })
  res.json({ hours: db.hours, hoursNotice: db.content.hoursNotice })
})

app.put('/api/admin/facilities', auth, async (req, res) => {
  const facilities = Array.isArray(req.body) ? req.body : req.body?.facilities
  if (!Array.isArray(facilities)) {
    res.status(400).json({ error: 'Facilities array is required' })
    return
  }
  const db = await mutate((state) => {
    state.facilities = facilities
  })
  res.json(db.facilities)
})

app.put('/api/admin/plans', auth, async (req, res) => {
  const plans = Array.isArray(req.body) ? req.body : req.body?.plans
  if (!Array.isArray(plans)) {
    res.status(400).json({ error: 'Plans array is required' })
    return
  }
  const db = await mutate((state) => {
    state.plans = plans
  })
  res.json(db.plans)
})

app.put('/api/admin/reviews', auth, async (req, res) => {
  const reviews = Array.isArray(req.body) ? req.body : req.body?.reviews
  const mapsReviewsUrl = req.body?.mapsReviewsUrl
  if (!Array.isArray(reviews)) {
    res.status(400).json({ error: 'Reviews array is required' })
    return
  }
  const db = await mutate((state) => {
    state.reviews = reviews
    if (typeof mapsReviewsUrl === 'string') state.content.mapsReviewsUrl = mapsReviewsUrl
  })
  res.json({ reviews: db.reviews, mapsReviewsUrl: db.content.mapsReviewsUrl })
})

app.put('/api/admin/socials', auth, async (req, res) => {
  const socials = Array.isArray(req.body) ? req.body : req.body?.socials
  if (!Array.isArray(socials)) {
    res.status(400).json({ error: 'Socials array is required' })
    return
  }
  const db = await mutate((state) => {
    state.content.socials = socials
  })
  res.json(db.content.socials)
})

app.post('/api/admin/gallery', auth, upload.single('image'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Image file is required' })
    return
  }
  const caption = String(req.body?.caption ?? '').trim()
  const db = await mutate((state) => {
    state.gallery.unshift({
      id: randomUUID(),
      url: `/uploads/${req.file!.filename}`,
      caption,
      published: true,
      createdAt: new Date().toISOString(),
    })
  })
  res.status(201).json(db.gallery[0])
})

app.put('/api/admin/gallery/:id', auth, async (req, res) => {
  const id = req.params.id
  const db = await mutate((state) => {
    const item = state.gallery.find((image) => image.id === id)
    if (!item) throw new Error('Not found')
    if (typeof req.body?.caption === 'string') item.caption = req.body.caption
    if (typeof req.body?.published === 'boolean') item.published = req.body.published
  })
  res.json(db.gallery.find((image) => image.id === id))
})

app.delete('/api/admin/gallery/:id', auth, async (req, res) => {
  const id = req.params.id
  await mutate((state) => {
    state.gallery = state.gallery.filter((image) => image.id !== id)
  })
  res.json({ ok: true })
})

app.put('/api/admin/seats', auth, async (req, res) => {
  const rows = Number(req.body?.gridRows ?? 0)
  const cols = Number(req.body?.gridCols ?? 0)
  const capacity = Number(req.body?.capacity ?? 0)
  const seats = Array.isArray(req.body?.seats) ? (req.body.seats as Seat[]) : null
  const timeSlots = Array.isArray(req.body?.timeSlots) ? req.body.timeSlots : undefined
  if (!seats || rows < 0 || cols < 0 || capacity < 0) {
    res.status(400).json({ error: 'Valid seat layout is required' })
    return
  }
  const db = await mutate((state) => {
    state.gridRows = rows
    state.gridCols = cols
    state.capacity = capacity
    state.seats = seats
    if (timeSlots) state.timeSlots = timeSlots
  })
  res.json({
    gridRows: db.gridRows,
    gridCols: db.gridCols,
    capacity: db.capacity,
    seats: db.seats,
    timeSlots: db.timeSlots,
  })
})

app.put('/api/admin/bookings/:id', auth, async (req, res) => {
  const id = req.params.id
  const status = req.body?.status as BookingStatus | undefined
  const adminNote = req.body?.adminNote
  const allowed: BookingStatus[] = ['Pending', 'Approved', 'Rejected', 'Cancelled']
  try {
    const db = await mutate((state) => {
      const booking = state.bookings.find((item) => item.id === id)
      if (!booking) throw new Error('Booking not found')
      if (status) {
        if (!allowed.includes(status)) throw new Error('Invalid status')
        if (status === 'Approved' || status === 'Pending') {
          const taken = occupiedSeatIds(state, booking.date, booking.timeSlotId, booking.id)
          if (booking.seatIds.some((seatId) => taken.has(seatId))) {
            throw new Error('Cannot approve: seat is already held by another booking')
          }
        }
        booking.status = status
      }
      if (typeof adminNote === 'string') booking.adminNote = adminNote
      booking.updatedAt = new Date().toISOString()
    })
    res.json(db.bookings.find((item) => item.id === id))
  } catch (error) {
    res.status(409).json({ error: error instanceof Error ? error.message : 'Update failed' })
  }
})

app.put('/api/admin/students/:id', auth, async (req, res) => {
  const id = req.params.id
  const db = await mutate((state) => {
    const student = state.students.find((item) => item.id === id)
    if (!student) throw new Error('Student not found')
    if (typeof req.body?.name === 'string') student.name = req.body.name
    if (typeof req.body?.phone === 'string') student.phone = req.body.phone
  })
  res.json(db.students.find((item) => item.id === id))
})

app.delete('/api/admin/students/:id', auth, async (req, res) => {
  await mutate((state) => {
    state.students = state.students.filter((item) => item.id !== req.params.id)
  })
  res.json({ ok: true })
})

app.put('/api/admin/enquiries/:id', auth, async (req, res) => {
  const db = await mutate((state) => {
    const enquiry = state.enquiries.find((item) => item.id === req.params.id)
    if (!enquiry) throw new Error('Enquiry not found')
    if (typeof req.body?.read === 'boolean') enquiry.read = req.body.read
  })
  res.json(db.enquiries.find((item) => item.id === req.params.id))
})

const distDir = path.join(root, 'dist')
if (existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api')) {
      next()
      return
    }
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

requireEnv()
app.listen(PORT, () => {
  console.log(`VISIONPLUS API listening on http://localhost:${PORT}`)
})
