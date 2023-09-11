/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { Chart } from 'chart.js'

type Props = {
  type: string
  labels: string[]
  value: number[]
  elId: string
  detail?: boolean
  diffPercentage?: string
  backgroundColor?: string
}

function Charts({
  type,
  labels,
  value,
  elId,
  detail = true,
  diffPercentage = '',
}: Props) {
  useEffect(() => {
    const myChart: any = document.getElementById(elId)!
    const ctx = myChart.getContext('2d')
    let detailsObject = {}
    let borderColor = '#3e95cd'
    let backgroundColor = '#7bb6dd'

    if (diffPercentage != '' && !detail) {
      borderColor = diffPercentage.charAt(0) === '+' ? '#22c55e' : '#e44345'
      backgroundColor = diffPercentage.charAt(0) === '+' ? '#7adc9e' : '#ef8e8f'
    }

    if (!detail) {
      detailsObject = {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            stacked: true,
            gridLines: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        ],
      }
    } else {
      detailsObject = {
        yAxes: [
          {
            stacked: true,
          },
        ],
      }
    }

    new Chart(ctx, {
      type,
      data: {
        labels: labels,
        datasets: [
          {
            data: value,
            label: elId,
            borderColor,
            backgroundColor,
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
        responsive: true,
        aspectRatio: 1,
        tooltips: {
          enabled: detail,
        },
        legend: {
          display: !detail ? false : true,
        },
        scales: {
          ...detailsObject,
        },
      },
    })
  }, [value])
  return (
    <div
      className={`${
        detail ? 'w-full' : 'w-28 h-full sm:w-28 sm:h-32 lg:w-20 md:h-24'
      } flex justify-start`}
    >
      <canvas className='w-full' id={elId} />
    </div>
  )
}

export default Charts
