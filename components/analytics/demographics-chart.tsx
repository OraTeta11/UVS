"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function DemographicsChart() {
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
        labels: ["18-21", "22-25", "26-30", "31+"],
        datasets: [
          {
            label: "Science and Technology",
            data: [420, 380, 150, 50],
            backgroundColor: "#003B71",
            stack: "Stack 0",
          },
          {
            label: "Business and Economics",
            data: [380, 320, 120, 40],
            backgroundColor: "#0056a8",
            stack: "Stack 0",
          },
          {
            label: "Medicine and Health Sciences",
            data: [320, 280, 100, 60],
            backgroundColor: "#0071df",
            stack: "Stack 0",
          },
          {
            label: "Arts and Social Sciences",
            data: [280, 240, 80, 40],
            backgroundColor: "#3a95ff",
            stack: "Stack 0",
          },
          {
            label: "Education",
            data: [220, 180, 60, 20],
            backgroundColor: "#75b6ff",
            stack: "Stack 0",
          },
          {
            label: "Law",
            data: [180, 140, 40, 10],
            backgroundColor: "#a8d1ff",
            stack: "Stack 0",
          },
          {
            label: "Agriculture",
            data: [150, 120, 30, 10],
            backgroundColor: "#d6ebff",
            stack: "Stack 0",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Voter Demographics by Age Group and Faculty",
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
              text: "Age Group",
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: "Number of Voters",
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
