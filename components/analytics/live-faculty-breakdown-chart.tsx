"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface FacultyData {
  name: string
  count: number
  percentage: number
}

interface LiveFacultyBreakdownChartProps {
  facultyData: FacultyData[]
}

export function LiveFacultyBreakdownChart({ facultyData }: LiveFacultyBreakdownChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || facultyData.length === 0) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Colors for faculties
    const colors = [
      "#003B71", // Primary blue
      "#0056a8",
      "#0071df",
      "#3a95ff",
      "#75b6ff",
      "#a8d1ff",
      "#d6ebff",
      "#FF8C00", // Orange accent
    ]

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: facultyData.map((f) => f.name),
        datasets: [
          {
            data: facultyData.map((f) => f.count),
            backgroundColor: colors.slice(0, facultyData.length),
            borderColor: "#ffffff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 15,
              padding: 15,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.parsed || 0
                const percentage = facultyData[context.dataIndex]?.percentage || 0
                return `${label}: ${value} votes (${percentage.toFixed(1)}%)`
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 500,
        },
        cutout: "60%",
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [facultyData])

  return <canvas ref={chartRef} />
}
