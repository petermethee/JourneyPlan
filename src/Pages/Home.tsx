import { Grid } from "@mui/material";
import styles from "./Home.module.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getAllTrips, selectTrips } from "../features/Redux/JourneyPlanSlice";
import TripsTile from "../Components/TripsTile";
import { useNavigate } from "react-router-dom";
import { routerPathes } from "../Helper/routerPathes";
import AddTripTile from "../Components/AddTripTile";
import { useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export default function Home() {
  const trips = useAppSelector(selectTrips);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const onClick = (id: number) => {
    navigate(routerPathes.planning + "/" + id);
  };

  const onDragEnd = (e: any) => {
    //TODO
  };

  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.homeContainer}>
        <Droppable droppableId="deleteZone">
          {(provided) => (
            <div
              className={styles.deleteZone}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className={styles.homeTitle}>Journey Plan</div>
        <Grid
          container
          justifyContent="space-evenly"
          alignItems="center"
          padding="20px 50px"
          rowGap={6}
          columnGap={6}
        >
          {trips.map((trip, index) => {
            return (
              <Droppable droppableId={trip.id.toString()}>
                {(provided) => (
                  <Grid
                    item
                    key={trip.id}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <TripsTile
                      title={trip.name}
                      endDate={trip.end_date}
                      startDate={trip.start_date}
                      id={trip.id}
                      imagePath={trip.image_path}
                      onClick={onClick}
                      index={index}
                    />
                    {provided.placeholder}
                  </Grid>
                )}
              </Droppable>
            );
          })}
          <Grid item>
            <AddTripTile
              onClick={() => {
                navigate(routerPathes.addTrip);
              }}
            />
          </Grid>
        </Grid>
      </div>
    </DragDropContext>
  );
}
