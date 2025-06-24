const express = require("express");
const router = express.Router();



const TripModel = require('../models/trips');
const ActivityModel = require('../models/activities');


//Decline Invitation
router.put("/:id/remove-user/:userId", (req, res) => {
  const { id, userId } = req.params;

  TripModel.findByIdAndUpdate(
    id,
    { $pull: { selectedUsers: userId } },
    { new: true }
  )
    .then((updatedTrip) => {
      if (!updatedTrip) {
        return res.status(404).json({ error: "Trip not found" });
      }

      return res
        .status(200)
        .json({ message: "User removed from trip successfully", updatedTrip });
    })
    .catch((error) => {
      console.error("Error updating trip data:", error);
      return res.status(500).json({ error: "Server error" });
    });
});

// Route for adding a member to a trip
router.put("/:tripId/add-member/:userId", async (req, res) => {
  const { tripId, userId } = req.params;
  try {
    // Fetch the trip document by ID
    const trip = await TripModel.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Check if the user is already a member
    if (trip.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    // Add the user to the members array
    trip.members.push(userId);

    // Remove the user ID from selectedUsers array
    trip.selectedUsers = trip.selectedUsers.filter(
      (selectedUserId) => selectedUserId.toString() !== userId
    );

    await trip.save();

    res.status(200).json({ message: "User added as a member" });
  } catch (error) {
    console.error("Error adding member to trip:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route for updating activities with the new userId
router.put("/update-user/:tripId/:userId", async (req, res) => {
  const { tripId, userId } = req.params;
  try {
    // Find activities associated with the tripId and update the userId field
    const activities = await ActivityModel.find({ tripId: tripId });
    // Assuming activities is an array of activity documents
  
      for (const activity of activities) {
        if (activity.type === "stays") {
          // Update the userId field of the activity document
          activity.userId = userId;
          await activity.save();
        }
      }
    

    res.status(200).json({ message: "Activities updated successfully" });
  } catch (error) {
    console.error("Error updating activities:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
