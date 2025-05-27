"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function LiveVotingHeatmapChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Generate mock data for the heatmap
    // Days of the week
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

    // Hours of the day (6 AM to 10 PM)
    const hours = [
      "6 AM",
      "7 AM",
      "8 AM",
      "9 AM",
      "10 AM",
      "11 AM",
      "12 PM",
      "1 PM",
      "2 PM",
      "3 PM",
      "4 PM",
      "5 PM",
      "6 PM",
      "7 PM",
      "8 PM",
      "9 PM",
      "10 PM",
    ]

    // Generate realistic voting patterns
    // Morning peak, lunch peak, evening peak
    const generateHeatmapData = () => {
      const data = []
      for (let day = 0; day < days.length; day++) {
        for (let hour = 0; hour < hours.length; hour++) {
          // Base activity level
          let activity = 30 + Math.random() * 20

          // Morning peak (8-10 AM)
          if (hour >= 2 && hour <= 4) {
            activity += 30 + Math.random() * 20
          }

          // Lunch peak (12-2 PM)
          if (hour >= 6 && hour <= 8) {
            activity += 20 + Math.random() * 15
          }

          // Evening peak (4-8 PM)
          if (hour >= 10 && hour <= 14) {
            activity += 40 + Math.random() * 25
          }

          // Midweek tends to be busier
          if (day === 2 || day === 3) {
            activity *= 1.2
          }

          // Add some randomness
          activity += Math.random() * 10 - 5

          data.push({
            x: hours[hour],
            y: days[day],
            v: Math.round(activity),
          })
        }
      }
      return data
    }

    const heatmapData = generateHeatmapData()

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Voting Activity",
            data: heatmapData,
            backgroundColor: (context) => {
              const value = context.raw?.v
              if (!value) return "rgba(0, 59, 113, 0.1)"

              // Color scale from light to dark blue based on activity
              const alpha = Math.min(1, Math.max(0.1, value / 100))
              return `rgba(0, 59, 113, ${alpha})`
            },
            pointRadius: 15,
            pointHoverRadius: 18,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "category",
            position: "bottom",
            title: {
              display: true,
              text: "Time of Day",
            },
            grid: {
              display: false,
            },
          },
          y: {
            type: "category",
            position: "left",
            reverse: true,
            title: {
              display: true,
              text: "Day",
            },
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw?.v
                return `${context.raw?.y}, ${context.raw?.x}: ${value} votes`
              },
            },
          },
          legend: {
            display: false,
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return <canvas ref={chartRef} />
}
