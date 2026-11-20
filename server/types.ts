export type BookingStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'

export type SeatKind = 'seat' | 'empty'

export type EnquiryType = 'membership' | 'booking' | 'general'

export type DayHours = {
  day: string
  open: string
  close: string
  closed: boolean
  note: string
}

export type Facility = {
  id: string
  name: string
  description: string
  icon: string
  published: boolean
}

export type MembershipPlan = {
  id: string
  name: string
  duration: string
  price: string
  benefits: string[]
  published: boolean
}

export type GalleryImage = {
  id: string
  url: string
  caption: string
  published: boolean
  createdAt: string
}

export type ReviewHighlight = {
  id: string
  quote: string
  published: boolean
}

export type Seat = {
  id: string
  label: string
  row: number
  col: number
  kind: SeatKind
  active: boolean
}

export type TimeSlot = {
  id: string
  label: string
  start: string
  end: string
  active: boolean
}

export type Booking = {
  id: string
  name: string
  phone: string
  planId: string | null
  date: string
  timeSlotId: string | null
  seatIds: string[]
  notes: string
  status: BookingStatus
  adminNote: string
  createdAt: string
  updatedAt: string
}

export type Student = {
  id: string
  name: string
  phone: string
  createdAt: string
}

export type Enquiry = {
  id: string
  name: string
  phone: string
  email: string
  type: EnquiryType
  message: string
  createdAt: string
  read: boolean
}

export type SocialLink = {
  id: string
  platform: string
  url: string
}

export type SiteContent = {
  name: string
  tagline: string
  heroHeadline: string
  heroSubheading: string
  aboutTitle: string
  aboutBody: string
  aboutHighlights: string[]
  phoneDisplay: string
  phoneE164: string
  whatsappE164: string
  email: string
  addressLines: string[]
  city: string
  state: string
  postalCode: string
  country: string
  plusCode: string
  mapsQuery: string
  mapsReviewsUrl: string
  googleRating: string
  googleReviewCount: number
  hoursNotice: string
  heroImage: string
  aboutImage: string
  socials: SocialLink[]
}

export type Database = {
  content: SiteContent
  hours: DayHours[]
  facilities: Facility[]
  plans: MembershipPlan[]
  gallery: GalleryImage[]
  reviews: ReviewHighlight[]
  seats: Seat[]
  gridRows: number
  gridCols: number
  capacity: number
  timeSlots: TimeSlot[]
  bookings: Booking[]
  students: Student[]
  enquiries: Enquiry[]
}
