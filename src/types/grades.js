const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const CourseType = require('./courses');
const StudentType = require('./students');


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

module.exports = GradeType;