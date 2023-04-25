import IAccomodation from "./IAccomodation";
import IActivity from "./IActivity";
import IPlanningAvtivity from "./IPlanningActivity";
import ITransport from "./ITransport";

export type IItem = ITransport | IAccomodation | IPlanningAvtivity | IActivity;
