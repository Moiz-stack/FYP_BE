const Review = require('../models/Review');

exports.getStudentReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('student', 'name')
            .sort({ createdAt: -1 })
            .limit(15);

        const formattedReviews = reviews.map(review => ({
            studentId: review.student._id,
            studentImg: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.student.name)}&background=random`,
            studentName: review.student.name,
            ReviewMassage: review.message
        }));

        res.json(formattedReviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
}; 