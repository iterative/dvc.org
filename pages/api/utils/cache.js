export default function cache(res, cacheTime = 900) {
  res.setHeader('cache-control', `max-age=${cacheTime}, public`)
}
