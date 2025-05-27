"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function ParticipationTrendsChart() {
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
      type: "line",
      data: {
        labels: [
          "Nov 2023",
          "Dec 2023",
          "Jan 2024",
          "Feb 2024",
          "Mar 2024",
          "Apr 2024",
          "May 2024",
          "Jun 2024",
          "Jul 2024",
          "Aug 2024",
          "Sep 2024",
          "Oct 2024",
          "Nov 2024",
          "Dec 2024",
          "Jan 2025",
          "Feb 2025",
          "Mar 2025",
          "Apr 2025",
          "May 2025",
        ],
        datasets: [
          {
            label: "Overall Participation Rate",
            data: [65, 68, 64, 69, 72, 74, 71, 68, 65, 67, 70, 73, 79, 76, 74, 68, 77, 75, 82],
            borderColor: "#003B71",
            backgroundColor: "rgba(0, 59, 113, 0.1)",
            tension: 0.3,
            fill: true,
          },
          {
            label: "First-time Voters",
            data: [40, 42, 38, 41, 45, 48, 44, 40, 38, 39, 42, 45, 50, 48, 46, 42, 49, 47, 52],
            borderColor: "#FF8C00",
            backgroundColor: "rgba(255, 140, 0, 0.1)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Voter Participation Trends Over Time",
            font: {
              size: 16,
            },
          },
          legend: {
            position: "bottom",
          },
          tooltip: {
            mode: "index",
            callbacks: {
              label: (context) => context.dataset.label + ": " + context.parsed.y + "%",
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Month",
            },
          },
          y: {
            title: {
              display: true,
              text: "Participation Rate (%)",
            },
            min: 0,
            max: 100,
          },
        },
        elements: {
          point: {
            radius: 3,
            hoverRadius: 5,
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
