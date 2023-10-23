const express = require('express');
const StudentPersonal = require('../models/StudentPersonal');
const PreviousResult = require('../models/previousAcademicResults');
const router = express.Router();
const FeesAddress = require('../models/feesAddressParents');
const McaResult = require('../models/mcaResult');
const AchievementCompetitive = require('../models/achievementsCompetitive')
const TrainingPlacement = require('../models/trainingPlacement')
const PaperPublished = require('../models/researchPaper')
const YearResult = require('../models/yearResult')
const Images = require('../models/images')
const fetchadmin = require('../middleware/fetchadmin');

// Routes for Previous Academic Results 
router.get('/fetchpreviousResults/:mcaprn', async (req, res) => {
  try {
    const mcaprn = req.params.mcaprn;

    // Fetch student data based on mcaprn
    const studentData = await PreviousResult.findOne({ mcaprn }).lean().exec();

    if (!studentData) {
      return res.status(404).json({ message: 'Student data not found' });
    }

    res.status(200).json(studentData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student data' });
  }
});

// Route for Student Data Card
router.post('/fetchStudentDataCard/:year/:Branch',fetchadmin, async (req, res) => {
  try {
    const {year, Branch} = req.params;
console.log(year);
    // Fetch student data based on year
    const studentData = await StudentPersonal.find({ AdmissionYear : year, Branch: Branch }).lean().exec();

    if (studentData.length === 0) { // Check if the array is empty
      return res.status(404).json({ message: 'Student data not found' });
    }

    res.status(200).json({formData: studentData});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student data' });
  }
});


// Route for Fee Parent Address
router.get('/fetchFeeParent/:mcaprn', async (req, res) => {
  try {
    const mcaprn = req.params.mcaprn;

    // Fetch student data based on mcaprn
    const studentData = await FeesAddress.findOne({ mcaprn }).lean().exec();

    if (!studentData) {
      return res.status(404).json({ message: 'Student data not found' });
    }

    res.status(200).json(studentData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student data' });
  }
});

// Route for Current Mca Result
router.get('/fetchCurrentMcaResult/:mcaprn', async (req, res) => {
  try {
    const mcaprn = req.params.mcaprn;

    // Fetch student data based on mcaprn
    const studentData = await McaResult.findOne({ mcaprn }).lean().exec();

    if (!studentData) {
      return res.status(404).json({ message: 'Student data not found' });
    }

    res.status(200).json(studentData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student data' });
  }
});

//Route Academic Results

router.get('/fetchAcademicResult/:Branch/:AdmissionYear', async (req, res) => {
  try {
    const { Branch, AdmissionYear } = req.params;

    // Fetch student data based on branch and admission year
    const studentData1 = await McaResult.find({ Branch, AdmissionYear }).lean().exec();
    const studentData = await YearResult.find({ Branch, AdmissionYear }).lean().exec();

    

    if (!studentData && !studentData1) {
      return res.status(404).json({ formData: 0 });
    } else {
      res.status(200).json({ formData: studentData, formData1: studentData1 });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student data' });
  }
});


// Route for Achievements
router.post('/fetchAchievements/:year1/:dept/:cat/:level',fetchadmin, async (req, res) => {
  try {
    const {year1, dept, cat, level} = req.params;
console.log(year1);
    // Fetch student data based on mcaprn
    const studentData = await AchievementCompetitive.find({AdmissionYear: year1, Branch: dept , $or: [
      {
        $or: [
          { Type1: cat },
          { Type2: cat },
          { Type3: cat },
          { Type4: cat },
          { Type5: cat }
        ]
      },
      {
        $or: [
          { Level1: level },
          { Level2: level },
          { Level3: level },
          { Level4: level },
          { Level5: level }
        ]
      }
    ]
    }).lean().exec();

    if (!studentData) {
      return res.status(404).json({ message: 'Student data not found' });
    }

    res.status(200).json({formData : studentData});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student data' });
  }
});


// Route for Competitive
router.post('/fetchCompetitive/:year1/:dept/:exam', fetchadmin, async (req, res) => {
  try {
    const { year1, dept, exam } = req.params;
    let studentData; // Declare the variable here

    if (exam === "GATE") {
      studentData = await AchievementCompetitive.find({ AdmissionYear: year1, Branch: dept, GATEValidity: "Valid" }).lean().exec();
    } else if (exam === "CAT") {
      studentData = await AchievementCompetitive.find({ AdmissionYear: year1, Branch: dept, CATValidity: "Valid" }).lean().exec();
    } else if (exam === "GRE") {
      studentData = await AchievementCompetitive.find({ AdmissionYear: year1, Branch: dept, GREValidity: "Valid" }).lean().exec();
    } else if (exam === "MPSC") {
      studentData = await AchievementCompetitive.find({ AdmissionYear: year1, Branch: dept, MPSCValidity: "Valid" }).lean().exec();
    } else if (exam === "UPSC") {
      studentData = await AchievementCompetitive.find({ AdmissionYear: year1, Branch: dept, UPSCValidity: "Valid" }).lean().exec();
    } else if (exam === "OtherExam") {
      studentData = await AchievementCompetitive.find({ AdmissionYear: year1, Branch: dept, OtherExamValidity: "Valid" }).lean().exec();
    } else {
      studentData = await AchievementCompetitive.find({ AdmissionYear: year1, Branch: dept }).lean().exec();
    }

    if (!studentData) {
      return res.status(404).json({ message: 'Student data not found' });
    }

    res.status(200).json({ formData: studentData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student data' });
  }
});




// Route for Training And Placement
router.post('/fetchPlacements/:year1/:dept/:cat', fetchadmin, async (req, res) => {
  try {
    const { year1, dept, exam } = req.params;

    
    const studentData = await TrainingPlacement.find({ AdmissionYear: year1, Branch: dept }).lean().exec();

    if (!studentData) {
      return res.status(404).json({ message: 'Student data not found' });
    }

    res.status(200).json({ formData: studentData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student data' });
  }
});


// Route for Research Paper Published
router.post('/fetchResearchPaper/:year1/:dept', fetchadmin, async (req, res) => {
  try {
    const { year1, dept } = req.params;

    
    const studentData = await PaperPublished.find({ AdmissionYear: year1, Branch: dept }).lean().exec();

    if (!studentData) {
      return res.status(404).json({ message: 'Student data not found' });
    }

    res.status(200).json({ formData: studentData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student data' });
  }
});

//Student report

router.post('/fetchStudentReport/:mcaprn',fetchadmin, async (req, res) => {
  try {
    const mcaprn = req.params.mcaprn;

    // Fetch student data based on mcaprn
    const data1 = await StudentPersonal.find({ mcaprn: mcaprn});
    const data2 = await PreviousResult.find({ mcaprn: mcaprn});
    const data3 = await FeesAddress.find({ mcaprn: mcaprn});
    const data4 = await McaResult.find({ mcaprn: mcaprn});
    const data5 = await YearResult.find({ mcaprn: mcaprn});
    const data6 = await AchievementCompetitive.find({ mcaprn: mcaprn});
    const data7 = await TrainingPlacement.find({ mcaprn: mcaprn});
    const data8 = await PaperPublished.find({ mcaprn: mcaprn});
    const ImageData = await Images.find({ mcaprn: mcaprn });
    //let data = [data1, data2, data3, data4, data5, data6, data7, data8, data9 ];
    let data = data1.concat(data2, data3, data4, data5, data6, data7, data8);
    
    if (data.length === 0) {
      res.json({ status: "OK", formData: 0 });
    } else {
      res.json({ status: "OK", formData: data, ImageData : ImageData[0].images });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error occurred" });
  }
});



module.exports = router;