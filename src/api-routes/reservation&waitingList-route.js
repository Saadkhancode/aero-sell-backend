import express from 'express'
const router=express.Router();
import {
getReservedTables,
getWaitingTables,
getReservationAndWaitingListbyId,
postReservationAndWaitingList,
updateReservationAndWaitingList,
deleteReservationAndWaitingList
} from '../api/tables-reservation&waitingList.js'
router.get('/reserved',getReservedTables)
router.get('/waiting',getWaitingTables)
router.post('/table-operator',postReservationAndWaitingList)
router.get('/table-operator/:_id',getReservationAndWaitingListbyId)
router.put('/table-operator/:_id',updateReservationAndWaitingList)
router.delete('/table-operator/:_id',deleteReservationAndWaitingList)
export default router;