"use client"

import { useEffect, useRef, useState } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface LiveVotingRateChartProps {
  currentRate: number
}

export function LiveVotingRateChart({ currentRate }: LiveVotingRateChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [chartData, setChartData] = useState<number[]>([])
  const [chartLabels, setChartLabels] = useState<string[]>([])

  // Initialize with some data
  useEffect(() => {
    // Create initial data points (last 30 minutes with 1-minute intervals)
    const initialData: number[] = []
    const initialLabels: string[] = []

    const now = new Date()
    for (let i = 30; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000)
      initialLabels.push(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))

      // Generate some realistic looking historical data
      const baseRate = currentRate * 0.8 // Base rate slightly lower than current
      const timeVariation = Math.sin((i / 30) * Math.PI) * 2 // Sinusoidal variation
      const randomVariation = (Math.random() - 0.5) * 1.5 // Random noise
      const value = Math.max(0, baseRate + timeVariation + randomVariation)
      initialData.push(Number.parseFloat(value.toFixed(1)))
    }

    setChartData(initialData)
    setChartLabels(initialLabels)
  }, [currentRate])

  // Update chart when data changes
  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Votes per Minute",
            data: chartData,
            borderColor: "#FF8C00",
            backgroundColor: "rgba(255, 140, 0, 0.1)",
            tension: 0.3,
            fill: true,
            pointRadius: 2,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (context) => `${context.parsed.y} votes/min`,
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Time",
            },
            grid: {
              display: false,
            },
          },
          y: {
            title: {
              display: true,
              text: "Votes per Minute",
            },
            min: 0,
            suggestedMax: Math.max(...chartData) * 1.2,
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        animation: {
          duration: 500,
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [chartData, chartLabels])

  // Update chart with new data point every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const timeLabel = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      setChartLabels((prev) => {
        const newLabels = [...prev.slice(1), timeLabel]
        return newLabels
      })

      setChartData((prev) => {
        // Add small random variation to the current rate
        const randomVariation = (Math.random() - 0.5) * 1.5
        const newValue = Math.max(0, Number.parseFloat((currentRate + randomVariation).toFixed(1)))
        const newData = [...prev.slice(1), newValue]
        return newData
      })
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [currentRate])

  // Update the last data point with the current rate
  useEffect(() => {
    setChartData((prev) => {
      if (prev.length === 0) return prev
      const newData = [...prev.slice(0, -1), currentRate]
      return newData
    })
  }, [currentRate])

  return <canvas ref={chartRef} />
}
