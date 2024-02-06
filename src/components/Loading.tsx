import React from 'react'
import style from '@/styles/loading.module.css'

function Loading() {
  return (
      // make a buetifull loading page
      <div className={style.loading}>
      <div className={style.loading__container}>
        <div className={style.loading__container__spinner}></div>
      </div>
      </div>
    )
}

export default Loading