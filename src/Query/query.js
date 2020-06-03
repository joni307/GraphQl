const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLInt
} = require('graphql');

//dataBase
const courses = require('../DataBase/courses.json');
const grades = require('../DataBase/grades.json');
const students = require('../DataBase/students.json');

// types
const CourseType = require('../types/courses');
const StudentType = require('../types/students');
const GradeType = require('../types/grades');

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        courses: {
            type: new GraphQLList(CourseType),
            description: 'List of All Course',
            resolve: () => courses
        },
        students: {
            type: new GraphQLList(StudentType),
            description: 'List of All student',
            resolve: () => students,
        },
        grades: {
            type: new GraphQLList(GradeType),
            description: 'List of All grade',
            resolve: () => grades,
        },
        course: {
            type: CourseType,
            description: 'Particular course',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => courses.find(course => course.id === args.id)
        },
        grade: {
            type: GradeType,
            description: 'Particular grade',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => grades.find(grade => grade.id === args.id)
        },
        student: {
            type: StudentType,
            description: 'Particular student',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => students.find(student => student.id === args.id)
        }

    }),
});


module.exports = RootQueryType;