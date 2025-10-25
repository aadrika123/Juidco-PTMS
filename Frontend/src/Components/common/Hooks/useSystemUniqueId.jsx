import React, { useState, useEffect } from 'react'

export default function useSystemUniqueID() {
  const [uniqueId, setUniqueId] = useState('')
  const [fingerprint, setFingerprint] = useState('')
  const [details, setDetails] = useState(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateUniqueSystemID()
  }, [])

  const generateUniqueSystemID = async () => {
    const components = []

    // Screen information
    components.push(window.screen.width)
    components.push(window.screen.height)
    components.push(window.screen.colorDepth)
    components.push(window.screen.pixelDepth)
    components.push(window.devicePixelRatio)

    // Browser information
    components.push(navigator.userAgent)
    components.push(navigator.language)
    components.push(navigator.platform)
    components.push(navigator.hardwareConcurrency)
    components.push(navigator.maxTouchPoints)
    components.push(navigator.vendor)
    components.push(navigator.deviceMemory || 0)

    // Timezone
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone)
    components.push(new Date().getTimezoneOffset())

    // Canvas fingerprint
    const canvasFingerprint = getCanvasFingerprint()
    components.push(canvasFingerprint)

    // WebGL fingerprint
    const webglInfo = getWebGLInfo()
    if (webglInfo) {
      components.push(webglInfo.vendor)
      components.push(webglInfo.renderer)
    }

    // Audio fingerprint
    const audioFingerprint = await getAudioFingerprint()
    components.push(audioFingerprint)

    // Fonts detection
    const fonts = detectFonts()
    components.push(fonts.join(','))

    // Plugins
    const plugins = Array.from(navigator.plugins || [])
      .map((p) => p.name)
      .join(',')
    components.push(plugins)

    // Create fingerprint from all components
    const fingerprintStr = components.join('|')
    const hash = await hashString(fingerprintStr)

    // Generate unique ID with different segments
    const uniqueID = formatUniqueID(hash)

    setFingerprint(hash)
    setUniqueId(uniqueID)
    setDetails({
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      colorDepth: window.screen.colorDepth,
      platform: navigator.platform,
      cpuCores: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory || 'N/A',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      canvasFingerprint: canvasFingerprint.substring(0, 16),
      webglVendor: webglInfo?.vendor || 'N/A',
      audioFingerprint: audioFingerprint.substring(0, 16),
      fontsDetected: fonts.length,
    })
    setLoading(false)
  }

  const getCanvasFingerprint = () => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return 'canvas_error'

      canvas.width = 200
      canvas.height = 50

      ctx.textBaseline = 'top'
      ctx.font = '14px "Arial"'
      ctx.textBaseline = 'alphabetic'
      ctx.fillStyle = '#f60'
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = '#069'
      ctx.fillText('UniqueSystem🎨', 2, 15)
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
      ctx.fillText('UniqueSystem🎨', 4, 17)

      return canvas.toDataURL()
    } catch (e) {
      return 'canvas_error'
    }
  }

  const getWebGLInfo = () => {
    try {
      const canvas = document.createElement('canvas')
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) return null

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (!debugInfo) return null

      return {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
      }
    } catch (e) {
      return null
    }
  }

  const getAudioFingerprint = () => {
    return new Promise((resolve) => {
      try {
        const AudioContext =
          window.AudioContext || window.webkitAudioContext
        if (!AudioContext) {
          resolve('no_audio')
          return
        }

        const context = new AudioContext()
        const oscillator = context.createOscillator()
        const analyser = context.createAnalyser()
        const gainNode = context.createGain()
        const scriptProcessor = context.createScriptProcessor(4096, 1, 1)

        gainNode.gain.value = 0
        oscillator.connect(analyser)
        analyser.connect(scriptProcessor)
        scriptProcessor.connect(gainNode)
        gainNode.connect(context.destination)

        scriptProcessor.onaudioprocess = (event) => {
          const output = event.outputBuffer.getChannelData(0)
          let sum = 0
          for (let i = 0; i < output.length; i++) {
            sum += Math.abs(output[i])
          }
          const fingerprint = sum.toString()

          oscillator.disconnect()
          scriptProcessor.disconnect()
          gainNode.disconnect()
          context.close()

          resolve(fingerprint)
        }

        oscillator.start(0)

        setTimeout(() => resolve('audio_timeout'), 100)
      } catch (e) {
        resolve('audio_error')
      }
    })
  }

  const detectFonts = () => {
    const baseFonts = ['monospace', 'sans-serif', 'serif']
    const testFonts = [
      'Arial',
      'Verdana',
      'Times New Roman',
      'Courier New',
      'Georgia',
      'Palatino',
      'Garamond',
      'Bookman',
      'Comic Sans MS',
      'Trebuchet MS',
      'Impact',
      'Lucida Console',
      'Tahoma',
      'Helvetica',
      'Century Gothic',
    ]

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return []

    const text = 'mmmmmmmmmmlli'
    const textSize = '72px'

    const baseFontSizes = {}
    baseFonts.forEach((baseFont) => {
      ctx.font = `${textSize} ${baseFont}`
      baseFontSizes[baseFont] = ctx.measureText(text).width
    })

    const detectedFonts = []
    testFonts.forEach((font) => {
      baseFonts.forEach((baseFont) => {
        ctx.font = `${textSize} '${font}', ${baseFont}`
        const width = ctx.measureText(text).width
        if (width !== baseFontSizes[baseFont]) {
          if (!detectedFonts.includes(font)) {
            detectedFonts.push(font)
          }
        }
      })
    })

    return detectedFonts
  }

  const hashString = async (str) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  const formatUniqueID = (hash) => {
    const match = hash.match(/.{1,4}/g)
    return match ? match.join('-').toUpperCase() : hash.toUpperCase()
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uniqueId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return {
    loading,
    uniqueId,
    fingerprint,
    details,
    copied,
    copyToClipboard,
    getCanvasFingerprint,
  }
}
