const Course = require('../models/Course');

exports.getTopCourses = async (req, res) => {
    try {
        const topCourses = await Course.find()
            .sort({ rating: -1 })
            .limit(4)
            .populate('instructor', 'name')
            .select('_id image name instructor rating');

        const formattedCourses = topCourses.map(course => ({
            id: course._id,
            img: course.image,
            "courses name": course.name,
            "instructor name": course.instructor.name,
            rating: course.rating
        }));

        res.json(formattedCourses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top courses', error: error.message });
    }
}; 