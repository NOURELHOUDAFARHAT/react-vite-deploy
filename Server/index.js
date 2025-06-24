const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const nodemailer = require('nodemailer');


const tripRoutes = require('./routes/tripRoutes');
const signInRoutes = require('./routes/signInRoutes');
const signUpRoutes = require('./routes/signUpRoutes');
const userRoutes = require('./routes/userRoutes');
const dataTripRoutes = require('./routes/dataTripRoutes');
const dataUserRoutes = require('./routes/dataUserRoutes');
const proposeUrlRoutes = require('./routes/proposeUrlRoutes');
const activityRoutes = require('./routes/activityRoutes');
const rangedayTripRoutes = require('./routes/rangedayTripRoutes');
const generateInviRoutes = require('./routes/GenerateInviRoutes');
const PlacesRoutes = require('./routes/PlacesRoutes');
const CommentRoutes = require('./routes/commentRoutes');
const commentDataRoutes = require('./routes/commentsDataRoutes');
const placesDataRoutes = require('./routes/placesDataRoutes');
const ActivityModel = require("./models/activities");
const PlacesModel = require("./models/places");
const TripModel = require("./models/trips");
const UserModel = require("./models/Users");

//const OPENGRAPH_API_KEY = '0d978159-a126-4896-bc46-e66a3750d45a';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/tripease", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/categories", (req, res) => {
  // Assuming you want to fetch the first user's ObjectID
  const { activityId } = req.query; // Assuming categoryId is passed as a query parameter
  ActivityModel.find({ activityId }) // Find places with the specified tripId

  .select(" _id title description image from to type userId placeId tripId day suggestedBy") // Select both _id and title fields
  .then((activities) => {
    if (activities.length === 0) {
      return res
        .status(404)
        .json({ message: "No places found for the specified tripId" });
    }
    // Return the _id and titles of each place
    const activitiesData = activities.map((activity) => ({
      placeId: activity.placeId,
      title: activity.title,
      userId: activity.userId,
      image: activity.image,
      _id: activity._id,
      from:activity.from,
      day:activity.day,
      suggestedBy:activity.suggestedBy,
      to:activity.to,
      type:activity.type,
      tripId: activity.tripId,
      description: activity.description,
   
    }));
    res.status(200).json(activitiesData);
  })
  .catch((error) => {
    console.error("Error fetching places:", error);
    res.status(500).json({ message: "Server error" });
  });

})

// Endpoint to delete an activity by ID
app.delete("/deleteactivity/:id", (req, res) => {
  const { id } = req.params;

  ActivityModel.findByIdAndDelete(id)
    .then(() => {
      res.status(200).json({ message: "Activity deleted successfully." });
    })
    .catch((error) => {
      console.error("Error deleting activity:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the activity." });
    });
});

// Route to update an activity
app.post("/activities/:activityId/update", async (req, res) => {
  const { activityId } = req.params;
  const { from, to } = req.body;

  try {
    // Find the activity by ID and update "from" and "to" values
    const updatedActivity = await ActivityModel.findByIdAndUpdate(
      activityId,
      { from, to },
      { new: true }
    );

    res.status(200).json({ message: "Activity updated successfully", updatedActivity });
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.use('/', signInRoutes);
app.use('/sign-up', signUpRoutes);
app.use('/user', userRoutes);
app.use('/trips', tripRoutes);
app.use('/notifcard', dataTripRoutes);
app.use('/DropDownUsers', dataUserRoutes);
app.use('/linkPreview', proposeUrlRoutes);
app.use('/activityUrl', activityRoutes);
app.use('/AddPlace', PlacesRoutes);
app.use('/planning', rangedayTripRoutes);
app.use('/generate/trips', generateInviRoutes);
app.use('/tripPlaces', placesDataRoutes);
app.use('/Comment', CommentRoutes);
app.use('/CommentsData', commentDataRoutes);
//app.use('/activityday', activitydayRoutes);

app.get("/activityday/:tripId", (req, res) => {
  const { tripId } = req.params;

  ActivityModel.find({ tripId }) // Find activities with the specified tripId
    .select("numDay") // Select only the numDay field
    .then((activities) => {
      if (activities.length === 0) {
        return res
          .status(404)
          .json({ message: "No activities found for the specified tripId" });
      }
      // Return the numDay of each activity
      const numDays = activities.map((activity) => activity.numDay);
      res.status(200).json({ numDays });
    })
    .catch((error) => {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Server error" });
    });
});


app.get("/StayswithPlace/:placeId", (req, res) => {
  const { placeId } = req.params;

  ActivityModel.find({ placeId }) // Find activities with the specified placeId
    .then((activities) => {
      res.json(activities); // Return activities even if empty
    })
    .catch((error) => {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Server error" });
    });
});

app.get('/country/:tripId', (req, res) => {
  const {tripId}= req.params; // Change 'id' to 'tripId'
  TripModel.findById(tripId)
  .select('country')
    .then(trips => {
      if (!trips) {
        return res.status(404).json({ message: 'Trip not found' });
      }
    
      res.json( {country: trips.country} );
    })
    .catch(err => res.json(err));
});


app.get("/placesforstays/:tripId", (req, res) => {
  const { tripId } = req.params;

  PlacesModel.find({ tripId }) // Find places with the specified tripId
    .select("_id title numDay") // Select both _id and title fields
    .then((places) => {
      if (places.length === 0) {
        return res
          .status(404)
          .json({ message: "No places found for the specified tripId" });
      }
      // Return the _id and titles of each place
      const placeData = places.map((place) => ({
        _id: place._id,
        title: place.title,
        numDay: place.numDay,
      }));
      res.status(200).json(placeData);
    })
    .catch((error) => {
      console.error("Error fetching places:", error);
      res.status(500).json({ message: "Server error" });
    });
});


// Fetch trip members with full names and emails by trip ID
app.get("/members/:tripId", async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await TripModel.findById(tripId)
    .populate({
      path: 'members plannerName', // Include plannerName in the population
      select: 'fullName email avatar', // Select fields to include
      model: UserModel
    })
    .exec();

  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  // Extract relevant member data
  const members = trip.members.map(member => ({
    _id: member._id,
    fullName: member.fullName,
    email: member.email,
    avatar: member.avatar
  }));

  // Extract plannerName
  const plannerName = trip.plannerName ? {
    _id: trip.plannerName._id,
    fullName: trip.plannerName.fullName,
    email: trip.plannerName.email,
    avatar: trip.plannerName.avatar
  } : null;

  res.json({ members, plannerName });
  } catch (error) {
    console.error("Error fetching trip members:", error);
    res.status(500).json({ message: "Server error" });
  }
});




app.get("/placesDays/:tripId", (req, res) => {
  const { tripId } = req.params;

  PlacesModel.find({ tripId }) // Find activities with the specified tripId
    .select("numDay") // Select only the numDay field
    .then((places) => {
      if (places.length === 0) {
        return res
          .status(404)
          .json({ message: "No places found for the specified tripId" });
      }
      // Return the numDay of each activity
      const numDays = places.map((place) => place.numDay);
      res.status(200).json({ numDays });
    })
    .catch((error) => {
      console.error("Error fetching places days:", error);
      res.status(500).json({ message: "Server error" });
    });
});



app.get("/placesDaysTrip/:tripId", (req, res) => {
  const { tripId } = req.params;

  PlacesModel.find({ tripId }) // Find activities with the specified tripId
    .select("numDay") // Select only the numDay field
    .then((places) => {
      if (places.length === 0) {
        return res
          .status(404)
          .json({ message: "No places found for the specified tripId" });
      }
      // Return the numDay of each activity
      const numDays = places.map((place) => place.numDay);
      res.status(200).json({ numDays });
    })
    .catch((error) => {
      console.error("Error fetching places days:", error);
      res.status(500).json({ message: "Server error" });
    });
});






app.delete("/deleteplace/:placeId", (req, res) => {
  const { placeId } = req.params;

  PlacesModel.findByIdAndDelete(placeId)
    .then(() => {
      res.status(200).json({ message: "place deleted successfully." });
    })
    .catch((error) => {
      console.error("Error deleting place:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the place." });
    });
});


app.delete("/deletestay/:activityId", (req, res) => {
  const { activityId } = req.params;

  ActivityModel.findByIdAndDelete(activityId)
    .then(() => {
      res.status(200).json({ message: "stay deleted successfully." });
    })
    .catch((error) => {
      console.error("Error deleting stay:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the stay." });
    });
});



app.get("/plannerTrip/:tripId", (req, res) => {
  const { tripId } = req.params;

  TripModel.findById(tripId) // Find activities with the specified tripId
    .select("plannerName")
    .then((trip) => {
      if (!trip) { // Check if trip is null
        return res
          .status(404)
          .json({ message: "No planner found for the specified tripId" });
      }
      res.status(200).json({ plannerName: trip.plannerName }); // Return plannerName directly
    })
    .catch((error) => {
      console.error("Error fetching planners:", error);
      res.status(500).json({ message: "Server error" });
    });
});


app.put('/user/:userId/AvatarChange', (req, res) => {
  const userId = req.params.userId;
  const { newAvatar } = req.body;
  UserModel.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Update user's avatar
      user.avatar = newAvatar;
      return user.save();
    })
    .then(() => {
      // Return success response
      return res.status(200).json({ message: 'User avatar updated successfully' });
    })
    .catch(error => {
      console.error('Error updating user avatar:', error);
      return res.status(500).json({ error: 'Internal server error' });
    });
});

app.post("/activities/:activityId/join", (req, res) => {
  const { activityId } = req.params;
  const { userId } = req.body;

  ActivityModel.findByIdAndUpdate(
    activityId,
    { $addToSet: { userId: userId } },
    { new: true }
  )
    .then((activity) => {
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }else if (activity.type ==="experience")
      return res.status(200).json({ message: "User joined activity successfully", activity });
    })
    .catch((error) => {
      console.error("Error joining activity:", error);
      return res.status(500).json({ message: "Internal server error" });
    });
});


app.post("/trips/:tripId/invite", (req, res) => {
  const { tripId } = req.params;
  const { userId } = req.body;

  TripModel.findByIdAndUpdate(
    tripId,
    { $addToSet: { selectedUsers: userId } },
    { new: true }
  )
    .then((trip) => {
      if (!trip) {
        return res.status(404).json({ message: "trip not found" });
      }
      return res.status(200).json({ message: "User invited in trip successfully", trip });
    })
    .catch((error) => {
      console.error("Error inviting:", error);
      return res.status(500).json({ message: "Internal server error" });
    });
});


// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'tripeaseplatform@gmail.com', // Your Gmail email address
    pass: 'uzsl hdgx xlhy rlmo', // Your Gmail email password
  },
});

// POST endpoint for sending invitation emails
app.post('/sendinvitation', (req, res) => {
  const { emails } = req.body; // Assuming 'emails' is an array of email addresses

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: 'Email list is empty or invalid.' });
  }

  const mailOptions = {
    from: 'tripeaseplatform@gmail.com',
    to: emails.join(', '),
    subject: 'Invitation to Join Our Platform',
    html: `
    <div style="font-family: Satoshi, sans-serif; padding: 20px; background-color: #f0f0f0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <div style="padding: 20px;">
          <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px;">Invitation to Join Our Platform</h1>
          <p style="color: #555555; font-size: 16px; line-height: 1.6;">Hello! You have been invited to join our platform. Click on the link below to get started.</p>
          <a href="https://yourplatform.com/signup" style="display: inline-block; padding: 10px 20px; background-color: #FFAF20; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold;">Get Started</a>
        </div>
      </div>
    </div>
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending invitation email:', error);
      res.status(500).json({ error: 'An error occurred while sending the invitation email.' });
    } else {
      console.log('Invitation email sent:', info.response);
      res.status(200).json({ message: 'Invitation email sent successfully.' });
    }
  });
});




// API endpoint to fetch activities by user ID
app.get("/pricebyuser/:userId/:tripId", async (req, res) => {
  const { userId, tripId } = req.params;
  try {
    // Fetch activities based on userId
    const activities = await ActivityModel.find({ userId, tripId }).exec();
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching user activities:", error);
    res.status(500).json({ error: "Error fetching user activities" });
  }
});


app.get("/allmembers/:tripId", (req, res) => {
  const { tripId } = req.params;

  TripModel.findById(tripId) // Find activities with the specified tripId
    .select("plannerName members")
    .then((trip) => {
      if (!trip) { // Check if trip is null
        return res
          .status(404)
          .json({ message: "No planner found for the specified tripId" });
      }
      res.status(200).json({ plannerName: trip.plannerName, members: trip.members.map(member => member._id)  }); // Return plannerName directly
    })
    .catch((error) => {
      console.error("Error fetching planners:", error);
      res.status(500).json({ message: "Server error" });
    });
});

// API endpoint to fetch activities by user ID
app.get("/numberofplaces/:tripId", async (req, res) => {
  const { tripId } = req.params;
  try {
    // Count activities based on tripId
    const count = await PlacesModel.countDocuments({ tripId }).exec();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting places:", error);
    res.status(500).json({ error: "Error counting places" });
  }
});


// API endpoint to fetch activities by tripId and userId
app.get("/numberofactivities/:tripId/:userId", async (req, res) => {
  const { tripId, userId } = req.params;
  try {
    // Fetch activities based on tripId and userId
    const activities = await ActivityModel.find({ tripId, userId }).exec();

    // Count stays and experiences
    const staysCount = activities.filter(activity => activity.type === 'stays').length;
    const experiencesCount = activities.filter(activity => activity.type === 'experience').length;

    res.status(200).json({ staysCount, experiencesCount });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Error fetching activities" });
  }
});


app.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    // Using regular expression to perform a case-insensitive search
    const trips = await TripModel.find({ title: { $regex: new RegExp(query, 'i') } });
    res.status(200).json(trips);
  } catch (error) {
    console.error('Error searching trips:', error);
    res.status(500).json({ error: 'An error occurred while searching trips' });
  }
});


// API endpoint to fetch activities by trip ID and activity ID
app.get("/userbytripid/:tripId/:activityId", async (req, res) => {
  const { tripId, activityId } = req.params;
  try {
    // Fetch activities based on tripId and activityId
    const activity = await ActivityModel.findOne({ tripId, _id: activityId }).select("userId price").exec();
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ error: "Error fetching activity" });
  }
});


// API endpoint for fetching trips
app.get('/getnotification', async (req, res) => {
  try {
    const trips = await TripModel.find().select('selectedUsers');
    res.json({ trips });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Error fetching trips' });
  }
});



app.listen(3001, () => {
  console.log("server is runnig");
});


