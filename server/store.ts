import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Database } from './types.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const dataDir = path.join(root, 'data')
export const dbPath = path.join(dataDir, 'db.json')
export const uploadsDir = path.join(root, 'public', 'uploads')

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function createSeed(): Database {
  return {
    content: {
      name: 'VISIONPLUS LIBRARY',
      tagline: 'Study Library · Patan, Gujarat',
      heroHeadline: 'Your Space. Your Focus. Your Success.',
      heroSubheading:
        'Discover a peaceful and comfortable study environment designed to help you focus, learn and achieve your goals.',
      aboutTitle: 'A focused study space in the heart of Patan',
      aboutBody:
        'VISIONPLUS LIBRARY is a study and reading library in Patan, Gujarat. Students come here for a peaceful environment, comfortable seating, and an atmosphere built for focused work. The library is known locally for a calm setting that supports reading capacity and long, uninterrupted study sessions — at reasonable prices.',
      aboutHighlights: [
        'Peaceful reading environment',
        'Comfortable study experience',
        'Focus-oriented atmosphere',
      ],
      phoneDisplay: '+91 90999 29095',
      phoneE164: '919099929095',
      whatsappE164: '919099929095',
      email: '',
      addressLines: [
        '14-18, 2nd Floor, Shiv Arcade Complex',
        'Patan - Chanasma Highway Road',
        'Near Padmanabh Road, Chowkdi',
      ],
      city: 'Patan',
      state: 'Gujarat',
      postalCode: '384265',
      country: 'India',
      plusCode: 'R4QG+9Q, Patan, Gujarat',
      mapsQuery: 'VISIONPLUS LIBRARY, Shiv Arcade Complex, Patan, Gujarat 384265',
      mapsReviewsUrl:
        'https://www.google.com/maps/search/?api=1&query=VISIONPLUS%20LIBRARY%20Patan%20Gujarat',
      googleRating: '5.0',
      googleReviewCount: 38,
      hoursNotice:
        'Currently listed as open until 12 AM. Full weekly hours will be published here once confirmed by the library.',
      heroImage: '/hero-library.jpg',
      aboutImage: '/about-study.jpg',
      socials: [],
    },
    hours: DAYS.map((day) => ({
      day,
      open: '',
      close: '',
      closed: false,
      note: '',
    })),
    facilities: [],
    plans: [],
    gallery: [],
    reviews: [
      {
        id: 'r1',
        quote: 'Peaceful environment for reading.',
        published: true,
      },
      {
        id: 'r2',
        quote: 'Good seating arrangements.',
        published: true,
      },
      {
        id: 'r3',
        quote: 'Superb facilities at reasonable prices.',
        published: true,
      },
      {
        id: 'r4',
        quote: 'Comfortable atmosphere for focused studying.',
        published: true,
      },
      {
        id: 'r5',
        quote: 'A good place to improve reading capacity.',
        published: true,
      },
    ],
    seats: [],
    gridRows: 0,
    gridCols: 0,
    capacity: 0,
    timeSlots: [],
    bookings: [],
    students: [],
    enquiries: [],
  }
}

let cache: Database | null = null
let queue: Promise<void> = Promise.resolve()

export async function loadDb(): Promise<Database> {
  if (cache) return cache
  await mkdir(dataDir, { recursive: true })
  await mkdir(uploadsDir, { recursive: true })
  try {
    const raw = await readFile(dbPath, 'utf8')
    cache = JSON.parse(raw) as Database
  } catch {
    cache = createSeed()
    await writeFile(dbPath, JSON.stringify(cache, null, 2), 'utf8')
  }
  return cache
}

export function mutate(updater: (db: Database) => void): Promise<Database> {
  const run = queue.then(async () => {
    const db = await loadDb()
    updater(db)
    await writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8')
    return db
  })
  queue = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}
