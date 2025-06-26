"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function VotingTimeChart() {
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

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["6-8 AM", "8-10 AM", "10-12 PM", "12-2 PM", "2-4 PM", "4-6 PM", "6-8 PM", "8-10 PM", "10-12 AM"],
        datasets: [
          {
            label: "Day 1",
            data: [45, 120, 180, 210, 190, 240, 280, 220, 90],
            backgroundColor: "#003B71",
          },
          {
            label: "Day 2",
            data: [50, 130, 190, 220, 200, 250, 290, 230, 100],
            backgroundColor: "#0056a8",
          },
          {
            label: "Day 3",
            data: [60, 140, 200, 230, 210, 260, 300, 240, 110],
            backgroundColor: "#0071df",
          },
          {
            label: "Day 4",
            data: [70, 150, 210, 240, 220, 270, 310, 250, 120],
            backgroundColor: "#3a95ff",
          },
          {
            label: "Day 5",
            data: [80, 160, 220, 250, 230, 280, 320, 260, 130],
            backgroundColor: "#75b6ff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Voting Time Distribution During Election Period",
            font: {
              size: 16,
            },
          },
          legend: {
            position: "bottom",
          },
          tooltip: {
            mode: "index",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Time of Day",
            },
          },
          y: {
            title: {
              display: true,
              text: "Number of Votes Cast",
            },
            beginAtZero: true,
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
