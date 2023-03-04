import express from 'express'
const router=express.Router();
import {
getReservedTables,
getWaitingTables,
postReservationAndWaitingList,
updateReservationAndWaitingList,
deleteReservationAndWaitingList,
getReservationAndWaitingListById
} from '../api/tables-reservation&waitingList.js'
router.get('/reserved',getReservedTables)
router.get('/waiting',getWaitingTables)
router.get('/table-operator/:_id',getReservationAndWaitingListById)
router.post('/table-operator',postReservationAndWaitingList)
router.put('/table-operator/:_id',updateReservationAndWaitingList)
router.delete('/table-operator/:_id',deleteReservationAndWaitingList)
export default router;