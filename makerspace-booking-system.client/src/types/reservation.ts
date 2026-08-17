import type { Tool } from "./tool";

export type Reservation = {
    id: number,
    starDay: Date,
    endDay: Date,
    toolId: number,
    userId: string,
    status: string,
    collectedAt: Date,
    returnedAt: Date,
    cancelledAt: Date,
    amountCharged: number,

    tool: Tool

};