'use strict'

import 'alpinejs'
import 'focus-visible'
import './libs/library'
import Swiper from 'swiper'
import ApexCharts from 'apexcharts'
import feather from 'feather-icons'

window.globalAlpine = function () {
  return {}
}

feather.replace()

const swiper = new Swiper(document.getElementById('swiperRef'), {
  slidesPerView: 1,
  spaceBetween: 0,
  allowTouchMove: false,
  watchOverflow: true,
  // Responsive breakpoints
  breakpoints: {
    // when window width is >= 768px
    320: {
      initialSlide: 1,
      slidesPerView: 1.2,
      centeredSlides: true,
      allowTouchMove: true,
      spaceBetween: 15,
      autoplay: {
        delay: 5000,
      },
    },
    // when window width is >= 768px
    768: {
      slidesPerView: 2,
      slidesPerColumn: 2,
      slidesPerColumnFill: 'row',
    },
    // when window width is >= 1024px
    1024: {
      slidesPerView: 2,
      slidesPerColumn: 2,
      slidesPerColumnFill: 'row',
    },
    // when window width is >= 1440px
    1440: {
      slidesPerView: 4,
      spaceBetween: 15,
    },
  },
})

const colors = ['#ec4899', '#818cf8', '#38bdf8', '#14b8a6']
const series = [
  [40, 55, 40, 75, 65, 115, 100],
  [80, 89, 45, 80, 40, 55, 30],
  [31, 55, 40, 75, 45, 115, 100, 80],
  [85, 115, 89, 56, 70, 45, 88, 55],
]
swiper.slides.forEach((el, index) => {
  const chart = new ApexCharts(el.querySelector(`#widget-chart-${index}`), {
    series: [
      {
        name: 'series1',
        data: series[index],
      },
    ],
    chart: {
      height: 65,
      type: 'area',
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 5,
        blur: 5,
        color: colors[index],
        opacity: 0.25
      }
    },
    stroke: {
      curve: 'smooth',
    },
    colors: [colors[index]], // 400
    fill: {
      color: colors[index], // 400
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 1,
        opacityFrom: 0.1,
        opacityTo: 0.35,
      },
    },
    tooltip: {
      enabled: false,
    },
  })

  chart.render()
})
