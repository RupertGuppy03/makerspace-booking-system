export type Reservation = {
    id: number,
    startDay: Date,
    endDay: Date,
    toolId: number,
    userId: string,
    status: string,
    collectedAt: Date,
    returnedAt: Date,
    cancelledAt: Date,
    amountCharged: number

};