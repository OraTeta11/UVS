"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function VoterTurnoutChart() {
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
      type: "radar",
      data: {
        labels: [
          "Science and Technology",
          "Business and Economics",
          "Medicine and Health Sciences",
          "Arts and Social Sciences",
          "Education",
          "Law",
          "Agriculture",
        ],
        datasets: [
          {
            label: "Year 1",
            data: [85, 78, 82, 68, 75, 72, 70],
            backgroundColor: "rgba(0, 59, 113, 0.2)",
            borderColor: "rgba(0, 59, 113, 0.8)",
            pointBackgroundColor: "rgba(0, 59, 113, 1)",
          },
          {
            label: "Year 2",
            data: [82, 75, 80, 65, 72, 70, 68],
            backgroundColor: "rgba(255, 140, 0, 0.2)",
            borderColor: "rgba(255, 140, 0, 0.8)",
            pointBackgroundColor: "rgba(255, 140, 0, 1)",
          },
          {
            label: "Year 3",
            data: [78, 72, 76, 62, 70, 68, 65],
            backgroundColor: "rgba(46, 204, 113, 0.2)",
            borderColor: "rgba(46, 204, 113, 0.8)",
            pointBackgroundColor: "rgba(46, 204, 113, 1)",
          },
          {
            label: "Year 4+",
            data: [75, 70, 74, 60, 68, 65, 62],
            backgroundColor: "rgba(155, 89, 182, 0.2)",
            borderColor: "rgba(155, 89, 182, 0.8)",
            pointBackgroundColor: "rgba(155, 89, 182, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Voter Turnout by Faculty and Year of Study (%)",
            font: {
              size: 16,
            },
          },
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: (context) => context.dataset.label + ": " + context.parsed.r + "%",
            },
          },
        },
        scales: {
          r: {
            min: 50,
            max: 100,
            ticks: {
              stepSize: 10,
              callback: (value) => value + "%",
            },
            pointLabels: {
              font: {
                size: 12,
              },
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
