import net from 'node:net'

let cachedReachable: boolean | null = null

function parseDatabaseHostAndPort() {
  const rawUrl = process.env.DATABASE_URL
  if (!rawUrl) {
    return { host: 'localhost', port: 5432 }
  }

  try {
    const parsed = new URL(rawUrl)
    return {
      host: parsed.hostname || 'localhost',
      port: Number(parsed.port) || 5432,
    }
  } catch {
    return { host: 'localhost', port: 5432 }
  }
}

export async function isDatabaseReachable(timeoutMs = 500): Promise<boolean> {
  if (cachedReachable !== null) {
    return cachedReachable
  }

  const { host, port } = parseDatabaseHostAndPort()

  cachedReachable = await new Promise<boolean>((resolve) => {
    const socket = new net.Socket()
    let resolved = false

    const settle = (value: boolean) => {
      if (resolved) return
      resolved = true
      socket.destroy()
      resolve(value)
    }

    socket.setTimeout(timeoutMs)
    socket.once('connect', () => settle(true))
    socket.once('timeout', () => settle(false))
    socket.once('error', () => settle(false))
    socket.connect(port, host)
  })

  return cachedReachable
}
