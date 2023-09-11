/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { Chart } from 'chart.js'

type Props = {
  type: string
  labels: string[]
  value1: number[]
  value2: number[]
  elId: string
  detail?: boolean
  backgroundColor?: string
}

function MultipleCharts({
  type,
  labels,
  value1,
  value2,
  elId,
  detail = true,
}: Props) {
  useEffect(() => {
    const myChart: any = document.getElementById(elId)!
    const ctx = myChart.getContext('2d')
    let detailsObject = {}

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
        yAxes: [{}],
      }
    }

    const dataFirst = {
      label: 'Previous Week',
      data: value2,
      color: 'red',
      backgroundColor: '#3e95cd',
      fill: false,
      borderColor: 'red',
    }

    const dataSecond = {
      label: 'Current Week',
      data: value1,
      backgroundColor: '#7bb6dd',
      fill: false,
      borderColor: 'blue',
    }

    const speedData = {
      labels: labels,
      datasets: [dataFirst, dataSecond],
    }

    new Chart(ctx, {
      type,
      data: speedData,
      options: {
        maintainAspectRatio: true,
        responsive: true,
        aspectRatio: 1,
        tooltips: {
          enabled: detail,
        },
        legend: {
          display: !detail ? false : true,
          position: 'top',
          labels: {
            boxWidth: 80,
            fontColor: 'black',
          },
        },
        scales: {
          ...detailsObject,
        },
      },
    })
  }, [value1, value2])
  return (
    <div
      className={`${
        detail ? 'w-full' : 'w-28 h-full sm:w-28 sm:h-32 md:w-20 md:h-24'
      } flex justify-start`}
    >
      <canvas className='w-full' id={elId} />
    </div>
  )
}

export default MultipleCharts
