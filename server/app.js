// To connect with your mongoDB database
const connectToMongo = require('./connection');
connectToMongo();

// For backend and express
const express = require('express');
const app = express();


const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
//Using routes
app.use('/api/auth', require('./router/auth'))
app.use('/api/student', require('./router/personalInfo'))
app.use('/api/files',require('./router/download'))
app.use('/api/data',require('./router/adminRoutes'))
app.use('/api/images', require('./router/imageUpload'))

app.get("/", (req, resp) => {

	resp.send("App is Working");
	// You can check backend is working or not by
	// entering http://loacalhost:5000
	
	// If you see App is working means
	// backend working properly
});


app.listen(5000);
