export type NewTool = {
    createdAt: Date;
    name : string,
    isTakenOut : boolean,
    maintenancePeriod : number,
    lastMaintained: Date,
    dailyRate: number
}