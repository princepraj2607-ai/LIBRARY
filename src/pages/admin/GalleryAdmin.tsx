import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { api } from '../../lib/api'
import { useAdminData } from './useAdminData'

export function GalleryAdmin() {
  const { data, load, save, error } = useAdminData()
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [localError, setLocalError] = useState('')

  if (!data) return <p>Loading…</p>

  const upload = async () => {
    if (!file) return
    setLocalError('')
    const body = new FormData()
    body.append('image', file)
    body.append('caption', caption)
    try {
      await fetch('/api/admin/gallery', { method: 'POST', body, credentials: 'include' })
        .then(async (res) => {
          const json = await res.json()
          if (!res.ok) throw new Error(json.error || 'Upload failed')
        })
      setFile(null)
      setCaption('')
      await load()
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  return (
    <div>
      <h1 className="font-serif text-4xl">Gallery</h1>
      <p className="mt-2 text-sm text-navy/60">Upload only photographs of this library.</p>
      {(error || localError) && <p className="mt-3 text-sm text-red-700">{error || localError}</p>}
      <div className="mt-6 space-y-3 rounded-2xl bg-white p-4">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" className="w-full rounded-lg border px-3 py-2" />
        <Button type="button" onClick={() => void upload()}>Upload photograph</Button>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.gallery.map((image) => (
          <figure key={image.id} className="overflow-hidden rounded-2xl bg-white">
            <img src={image.url} alt={image.caption} className="h-44 w-full object-cover" />
            <figcaption className="space-y-2 p-3 text-sm">
              <input defaultValue={image.caption} onBlur={(e) => void save(`/api/admin/gallery/${image.id}`, { caption: e.target.value })} className="w-full rounded border px-2 py-1" />
              <label className="block">
                <input type="checkbox" checked={image.published} onChange={(e) => void save(`/api/admin/gallery/${image.id}`, { published: e.target.checked })} /> Published
              </label>
              <button className="text-red-700" onClick={() => void api(`/api/admin/gallery/${image.id}`, { method: 'DELETE' }).then(load)}>Delete</button>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
