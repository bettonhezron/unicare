import { Request, Response } from "express";
import { findStudentByRegNo } from "../../services/userService";
import {
  assignRoom,
  getRoomById,
  updateDischargePatient,
} from "../../services/roomServices";

export const getStudent = async (req: Request, res: Response) => {
  const { regNo } = req.body;
  try {
    findStudentByRegNo(regNo).then((student) => {
      if (student.length > 0) {
        res.status(200).json({
          message: "Student found",
          student,
        });
        return;
      } else {
        res.status(404).json({ message: "Student not found" });
        return;
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const assignPatientRoom = async (req: Request, res: Response) => {
  const { regNo, roomId } = req.body;

  if (!roomId) {
    res.status(403).json({ message: "roomId is required" });
  }

  try {
    findStudentByRegNo(regNo).then(async (student) => {
      if (student.length > 0) {
        const assignedRoom = await getRoomById(roomId);
        if (assignedRoom.length === 0)
          return res.status(404).json({ message: "Room not found" });

        const roomAssigned = await assignRoom(regNo, roomId);
        if (roomAssigned.length > 0)
          return res.status(200).json({
            message: `Patient assigned to room ${assignedRoom[0].name}`,
          });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Server failure due to ${err}` });
  }
};

export const dischargePatient = async (req: Request, res: Response) => {
  const { regNo } = req.body;

  try {
    const discharged = await updateDischargePatient(regNo);
    if (discharged.length > 0)
      return res.status(201).json({ message: "Patient discharged" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Server error due to ${err}` });
  }
};
