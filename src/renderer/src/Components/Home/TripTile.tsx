import EditRoundedIcon from '@mui/icons-material/EditRounded'
import styles from './TripsTile.module.css'
import { Button, ButtonBase } from '@mui/material'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { ERouterPaths } from '../../Helper/ERouterPaths'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import ITrip from '../../Models/ITrip'
import { useAppDispatch } from '../../app/hooks'
import { deleteTrip, setCurrentTrip } from '../../features/Redux/tripSlice'
import AmazingCardEffect from '../AmazingCardEffect/AmazingCardEffect'
import { useMemo, useState } from 'react'

export default function TripTile({ trip }: { trip: ITrip }) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [pointerPosition, setPointerPosition] = useState<{
    x: number
    y: number
    fromCenter: number
  }>({ x: 0, y: 0, fromCenter: 0 })
  const buttons = useMemo(() => {
    return (
      <>
        <Button
          variant="outlined"
          color="error"
          onClick={(event) => {
            event.stopPropagation()
            dispatch(deleteTrip(trip.id))
          }}
        >
          <DeleteRoundedIcon color="error" />
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={(event) => {
            event.stopPropagation()
            dispatch(setCurrentTrip(trip))
            navigate(`${ERouterPaths.addTrip}`)
          }}
        >
          <EditRoundedIcon />
        </Button>
      </>
    )
  }, [dispatch, trip, navigate])

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const { clientX, clientY } = e

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const mouseY = clientY - top
    const mouseX = clientX - left

    setPointerPosition({
      x: mouseX,
      y: mouseY,
      fromCenter:
        Math.sqrt((mouseX - width / 2) ** 2 + (mouseY - height / 2) ** 2) /
          Math.sqrt(width ** 2 + height ** 2) +
        0.1
    })
  }

  return (
    <AmazingCardEffect buttons={buttons}>
      <div
        className={styles.cardContainer}
        onClick={() => {
          dispatch(setCurrentTrip(trip))
          navigate(ERouterPaths.planning + '/' + trip.id)
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={(e) => {
          setPointerPosition((prevState) => ({
            x: prevState.x,
            y: prevState.y,
            fromCenter: 0.1
          }))
        }}
      >
        <div className={styles.background}>
          <img
            src={trip.image_path ?? 'src/assets/trip_bg.jpg'}
            alt={`Trip`}
            className={styles.cardBg}
          />
          <div
            className={styles.glare}
            style={{
              background: `radial-gradient(farthest-corner circle at ${pointerPosition.x}px ${pointerPosition.y}px, #d2d2d2ba, #96969640 50%, #363636 110%)`,
              opacity: pointerPosition.fromCenter * 0.7
            }}
          />
          <div
            className={styles.shinning}
            style={{
              backgroundPositionX: `${
                Math.sqrt(pointerPosition.x ** 2 + pointerPosition.y ** 2) * 1.5
              }px`,
              opacity: pointerPosition.fromCenter
            }}
          />

          <ButtonBase
            className={styles.rippleEffect}
            sx={{ position: 'absolute', color: 'white' }}
          />
        </div>

        <div className={styles.content}>
          <div className={styles.title}>{trip.name}</div>

          <div className={styles.date}>
            {dayjs(trip.start_date).format('DD MMM YYYY').toUpperCase()} -{' '}
            {dayjs(trip.end_date).format('DD MMM YYYY').toUpperCase()}
          </div>
        </div>
      </div>
    </AmazingCardEffect>
  )
}
