const Student = require('../models/Student');
const Course = require('../models/Course');
const Instructor = require('../models/Instructor');

exports.getStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalCourses = await Course.countDocuments();
        const totalInstructors = await Instructor.countDocuments();
        const totalCompletedCourses = await Course.aggregate([
            { $project: { completedCount: { $size: "$completedStudents" } } },
            { $group: { _id: null, total: { $sum: "$completedCount" } } }
        ]);

        res.json({
            students: totalStudents,
            courses: totalCourses,
            instructor: totalInstructors,
            award: totalCompletedCourses[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
}; 