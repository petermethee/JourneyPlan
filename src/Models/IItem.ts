import IAccomodation from "./IAccomodation";
import IActivity from "./IActivity";
import IPlanningArtifact from "./IPlanningArtifact";
import ITransport from "./ITransport";

export type IItem = ITransport | IAccomodation | IPlanningArtifact | IActivity;
