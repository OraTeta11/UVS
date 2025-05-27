"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function ElectionComparisonChart() {
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
        labels: [
          "Student Guild Elections 2023",
          "Student Guild Elections 2024",
          "Student Guild Elections 2025",
          "Faculty Representatives 2023",
          "Faculty Representatives 2024",
          "Faculty Representatives 2025",
          "Department Heads 2023",
          "Department Heads 2024",
          "Department Heads 2025",
        ],
        datasets: [
          {
            label: "Turnout Rate (%)",
            data: [72.5, 76.8, 82.3, 68.4, 72.5, 76.8, 62.3, 65.7, 68.5],
            backgroundColor: "#003B71",
            yAxisID: "y",
          },
          {
            label: "Total Votes Cast",
            data: [2250, 2380, 2670, 2120, 2250, 2442, 1930, 2040, 1952],
            backgroundColor: "#FF8C00",
            type: "line",
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Election Comparison: Turnout Rate and Total Votes",
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
              label: (context) => {
                let label = context.dataset.label || ""
                if (label) {
                  label += ": "
                }
                if (context.datasetIndex === 0) {
                  label += context.parsed.y + "%"
                } else {
                  label += context.parsed.y
                }
                return label
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Election",
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Turnout Rate (%)",
            },
            min: 50,
            max: 100,
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: "Total Votes Cast",
            },
            min: 1500,
            max: 3000,
            grid: {
              drawOnChartArea: false,
            },
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
