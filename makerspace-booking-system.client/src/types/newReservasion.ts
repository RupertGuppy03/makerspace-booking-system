export type NewReservation = {
    //NewReservation is the same as Reservation, but without id and foreign keys
    startDay: Date,
    endDay: Date,
    toolId: number,
    userId: string,
    status: string,
    collectedAt?: Date,
    returnedAt?: Date,
    cancelledAt?: Date,
    amountCharged: number,

};