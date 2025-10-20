export function cleanTitle(title: string) {
  // buang " - Sumber" di akhir judul
  return title.replace(/\s+-\s+[^-]+$/,'').trim()
}
export function domainFrom(url: string) {
  try { return new URL(url).hostname.replace(/^www\./,'') } catch { return '' }
}
export function relativeTimeFrom(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const diff = (Date.now() - d.getTime()) / 1000
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  const map: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'second'], [3600, 'minute'], [86400, 'hour'],
    [604800, 'day'], [2629800, 'week'], [31557600, 'month']
  ]
  for (let i=map.length-1;i>=0;i--){
    const [sec, unit] = map[i]
    if (diff >= sec) return rtf.format(-Math.round(diff/sec), unit)
  }
  return rtf.format(0, 'second')
}
