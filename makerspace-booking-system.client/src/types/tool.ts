export type Tool = {
    id: number;
    createdAt: Date;
    name : string,
    isTakenOut : boolean,
    maintenancePeriod : number,
    lastMaintained : Date
}