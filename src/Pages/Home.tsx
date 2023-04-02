import { Grid } from "@mui/material";
import styles from "./Home.module.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  deleteTrip,
  getAllTrips,
  selectTrips,
} from "../features/Redux/JourneyPlanSlice";
import TripsTile from "../Components/TripsTile";
import { useNavigate } from "react-router-dom";
import { routerPathes } from "../Helper/routerPathes";
import AddTripTile from "../Components/AddTripTile";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  DragStart,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export default function Home() {
  const trips = useAppSelector(selectTrips);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const onClick = (id: number) => {
    navigate(routerPathes.planning + "/" + id);
  };

  const [tripDragged, setTripDragged] = useState<string | undefined>();

  const onDragStart = (result: DragStart) => {
    setTripDragged(result.draggableId);
  };
  const onDragEnd = (result: DropResult) => {
    if (result.destination?.droppableId === "deleteZone") {
      dispatch(deleteTrip(parseInt(result.draggableId)));
    }
    setTripDragged(undefined);
  };

  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <div className={styles.homeContainer}>
        <Droppable droppableId="deleteZone">
          {(provided, snapshot) => (
            <div className={styles.deleteZone}>
              <div
                className={`${styles.deleteUI} ${
                  tripDragged && styles.showDelete
                } ${snapshot.isDraggingOver && styles.isOver} `}
              >
                <DeleteRoundedIcon fontSize="large" />
              </div>
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  overflow: "hidden",
                  height: "100%",
                  width: "21rem",
                  position: "absolute",
                }}
              >
                {provided.placeholder}
              </div>
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
              <Droppable
                key={trip.id}
                droppableId={trip.id.toString()}
                isDropDisabled={trip.id.toString() !== tripDragged}
              >
                {(provided) => (
                  <Grid
                    item
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
