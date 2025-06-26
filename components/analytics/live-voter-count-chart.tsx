"use client"

import { useEffect, useRef, useState } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface LiveVoterCountChartProps {
  currentCount: number
  totalEligible: number
}

export function LiveVoterCountChart({ currentCount, totalEligible }: LiveVoterCountChartProps) {
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
      // Start with a value close to the current count and work backwards
      const factor = Math.max(0.5, i / 30) // Decreases as we get closer to now
      const randomVariation = Math.random() * 20 - 10 // -10 to +10
      const value = Math.max(0, Math.round(currentCount * factor + randomVariation))
      initialData.push(value)
    }

    setChartData(initialData)
    setChartLabels(initialLabels)
  }, [currentCount])

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
            label: "Voter Count",
            data: chartData,
            borderColor: "#003B71",
            backgroundColor: "rgba(0, 59, 113, 0.1)",
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
              text: "Number of Voters",
            },
            min: 0,
            max: totalEligible,
            ticks: {
              callback: (value) => value.toString(),
            },
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
  }, [chartData, chartLabels, totalEligible])

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
        // Add small random variation to the current count
        const randomVariation = Math.floor(Math.random() * 21) - 10 // -10 to +10
        const newValue = Math.max(0, currentCount + randomVariation)
        const newData = [...prev.slice(1), newValue]
        return newData
      })
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [currentCount])

  // Update the last data point with the current count
  useEffect(() => {
    setChartData((prev) => {
      if (prev.length === 0) return prev
      const newData = [...prev.slice(0, -1), currentCount]
      return newData
    })
  }, [currentCount])

  return <canvas ref={chartRef} />
}
