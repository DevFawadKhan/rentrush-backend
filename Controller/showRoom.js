import { validationResult } from 'express-validator';
import ShowRoomSchema from '../Model/showroom.js';
import bcrypt from 'bcryptjs';

export const showRoom = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // Corrected variable name from `email` to `showRoomEmail`
    const alredyShowroom = await ShowRoomSchema.findOne({ showRoomEmail: req.body.showRoomEmail });
    if (alredyShowroom) return res.status(400).json('Showroom already exists');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    let user = {
        showRoomName: req.body.showRoomName,
        ownerName: req.body.ownerName,
        showRoomEmail: req.body.showRoomEmail,
        ownerCnic: req.body.ownerCnic, // Changed to match casing
        contactNumber: req.body.contactNumber,
        showroomAddress: req.body.showroomAddress, // Changed to match casing
        password: password,
    };

    const showRoomInstance = new ShowRoomSchema(user); // Changed to avoid confusion
    showRoomInstance.save()
        .then(() => {
            return res.status(200).json('Showroom has been successfully registered');
        })
        .catch((err) => {
            return res.status(400).json(err);
        });
};
