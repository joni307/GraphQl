const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const courses = require('../DataBase/courses.json');
const students = require('../DataBase/students.json');
const grades = require('../DataBase/grades.json');

const CourseType = new GraphQLObjectType({
    name: 'Course',
    description: 'Represent course',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
    })
});

const GradeType = new GraphQLObjectType({
    name: 'Grade',
    description: 'Represent Grade',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        courseId: { type: GraphQLNonNull(GraphQLInt) },
        course: {
            type: CourseType,
            resolve: (grade) => {
                return courses.find(course => course.id === grade.id)
            }
        },
        studentId: { type: GraphQLNonNull(GraphQLInt) },
        student: {
            type: StudentType,
            resolve: (grade) => {
                return students.find(student => student.id === grade.studentId)
            }
        },
        grade: { type: GraphQLNonNull(GraphQLInt) },
    })
});



const StudentType = new GraphQLObjectType({
    name: 'Student',
    description: 'Represent Student',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        lastName: { type: GraphQLNonNull(GraphQLString) },
        courseId: { type: GraphQLNonNull(GraphQLInt) },
        course: {
            type: CourseType,
            resolve: (student) => {
                return courses.find(course => course.id === student.courseId)
            }
        }
    })
});


module.exports = StudentType;
module.exports = GradeType;
module.exports = CourseType;