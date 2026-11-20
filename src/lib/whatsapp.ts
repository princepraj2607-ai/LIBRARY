export function waLink(phone: string, text: string) {
  const digits = phone.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

export function membershipMessage(name = 'VISIONPLUS LIBRARY') {
  return `Hello ${name}, I would like to enquire about membership plans.`
}

export function bookingMessage(name = 'VISIONPLUS LIBRARY') {
  return `Hello ${name}, I would like to enquire about seat booking.`
}

export function generalMessage(name = 'VISIONPLUS LIBRARY') {
  return `Hello ${name}, I have a general enquiry.`
}
