const mongoose = require('mongoose');
const Course = require('./models/Course');
const Instructor = require('./models/Instructor');
const Student = require('./models/Student');
const Review = require('./models/Review');

// Sample instructors
const instructors = [
    {
        name: "John Smith",
        email: "john.smith@example.com"
    },
    {
        name: "Sarah Johnson",
        email: "sarah.j@example.com"
    },
    {
        name: "Michael Brown",
        email: "michael.b@example.com"
    }
];

// Sample courses
const courses = [
    {
        name: "Web Development Bootcamp",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3",
        rating: 4.8
    },
    {
        name: "Data Science Fundamentals",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3",
        rating: 4.6
    },
    {
        name: "Machine Learning Masterclass",
        image: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?ixlib=rb-4.0.3",
        rating: 4.9
    },
    {
        name: "Mobile App Development",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3",
        rating: 4.7
    },
    {
        name: "UI/UX Design Principles",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3",
        rating: 4.5
    }
];

// Sample students
const students = [
    {
        name: "Alice Johnson",
        email: "alice.j@example.com"
    },
    {
        name: "Bob Wilson",
        email: "bob.w@example.com"
    },
    {
        name: "Carol Davis",
        email: "carol.d@example.com"
    },
    {
        name: "David Miller",
        email: "david.m@example.com"
    },
    {
        name: "Emma Taylor",
        email: "emma.t@example.com"
    }
];

// Sample review messages
const reviewMessages = [
    "This course exceeded my expectations! The instructor was very knowledgeable and the content was well-structured.",
    "Great learning experience. I've learned so much in such a short time.",
    "The practical exercises were very helpful in understanding the concepts.",
    "Excellent course material and teaching methodology.",
    "I would highly recommend this course to anyone interested in this field.",
    "The instructor's explanations were clear and easy to follow.",
    "This course helped me land my dream job!",
    "The best online course I've taken so far.",
    "Very comprehensive and well-organized content.",
    "The instructor was very responsive to questions.",
    "I learned more than I expected from this course.",
    "The course projects were challenging but rewarding.",
    "Great community support and resources.",
    "The course pace was perfect for me.",
    "I'm looking forward to taking more courses from this instructor."
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/llbe');
        console.log('Connected to MongoDB');

        // Clear existing data
        await Course.deleteMany({});
        await Instructor.deleteMany({});
        await Student.deleteMany({});
        await Review.deleteMany({});
        console.log('Cleared existing data');

        // Create instructors
        const createdInstructors = await Instructor.insertMany(instructors);
        console.log('Created instructors');

        // Create courses with instructor references
        const coursesWithInstructors = courses.map((course, index) => ({
            ...course,
            instructor: createdInstructors[index % createdInstructors.length]._id
        }));

        const createdCourses = await Course.insertMany(coursesWithInstructors);
        console.log('Created courses');

        // Create students with course enrollments
        const studentsWithCourses = students.map((student, index) => {
            const enrolledCourses = createdCourses.slice(index % 3, (index % 3) + 2);
            const completedCourses = [enrolledCourses[0]];
            
            return {
                ...student,
                enrolledCourses: enrolledCourses.map(course => course._id),
                completedCourses: completedCourses.map(course => course._id)
            };
        });

        const createdStudents = await Student.insertMany(studentsWithCourses);
        console.log('Created students');

        // Update courses with enrolled and completed students
        for (let i = 0; i < createdCourses.length; i++) {
            const course = createdCourses[i];
            const enrolledStudents = studentsWithCourses
                .filter(student => student.enrolledCourses.includes(course._id))
                .map(student => student._id);
            const completedStudents = studentsWithCourses
                .filter(student => student.completedCourses.includes(course._id))
                .map(student => student._id);

            await Course.findByIdAndUpdate(course._id, {
                enrolledStudents,
                completedStudents
            });
        }
        console.log('Updated course enrollments');

        // Create reviews
        const reviews = [];
        for (let i = 0; i < 15; i++) {
            const student = createdStudents[i % createdStudents.length];
            const course = createdCourses[i % createdCourses.length];
            reviews.push({
                student: student._id,
                course: course._id,
                message: reviewMessages[i],
                rating: Math.floor(Math.random() * 2) + 4 // Random rating between 4-5
            });
        }

        await Review.insertMany(reviews);
        console.log('Created reviews');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase(); 