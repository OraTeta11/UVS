"use client"

import { useState, useEffect, useCallback } from "react"

type ConnectionStatus = "Connecting" | "Open" | "Closing" | "Closed"

interface WebSocketHook {
  sendMessage: (message: string) => void
  lastMessage: WebSocketEventMap["message"] | null
  connectionStatus: ConnectionStatus
  reconnect: () => void
}

export function useWebSocket(url: string): WebSocketHook {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [lastMessage, setLastMessage] = useState<WebSocketEventMap["message"] | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("Connecting")

  // Initialize WebSocket connection
  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url)
      setSocket(ws)
      setConnectionStatus("Connecting")

      ws.onopen = () => {
        setConnectionStatus("Open")
        console.log("WebSocket connection established")
      }

      ws.onmessage = (event) => {
        setLastMessage(event)
      }

      ws.onclose = () => {
        setConnectionStatus("Closed")
        console.log("WebSocket connection closed")
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setConnectionStatus("Closed")
      }

      return ws
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error)
      setConnectionStatus("Closed")
      return null
    }
  }, [url])

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    const ws = connect()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [connect])

  // Send message function
  const sendMessage = useCallback(
    (message: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message)
      } else {
        console.error("WebSocket is not connected")
      }
    },
    [socket],
  )

  // Reconnect function
  const reconnect = useCallback(() => {
    if (socket) {
      socket.close()
    }
    connect()
  }, [socket, connect])

  return { sendMessage, lastMessage, connectionStatus, reconnect }
}
