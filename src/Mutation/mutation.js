const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
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

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addCourse: {
            type: CourseType,
            description: 'Add a course',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const course = {
                    id: courses.length + 1,
                    name: args.name,
                    description: args.description
                }
                courses.push(course)
                return course
            }
        },
        addStudent: {
            type: StudentType,
            description: 'Add a student',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                lastName: { type: GraphQLNonNull(GraphQLString) },
                courseId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const curso = courses.filter(course => course.id === args.courseId);
                if (curso) {
                    const student = {
                        id: students.length + 1,
                        name: args.name,
                        lastName: args.lastName,
                        courseId: args.courseId,
                    };
                    students.push(student);
                    return student
                }
            }
        },
        addgrade: {
            type: GradeType,
            description: 'Add a grade',
            args: {
                courseId: { type: GraphQLNonNull(GraphQLInt) },
                studentId: { type: GraphQLNonNull(GraphQLInt) },
                grade: { type: GraphQLNonNull(GraphQLInt) },

            },
            resolve: (parent, args) => {
                const curso = courses.filter(course => course.id === args.courseId);
                const alumno = students.filter(student => student.id === args.studentId);
                if (curso != null) {
                    if (alumno != null) {
                        if (args.grade > 0 && args.grade <= 10) {

                            const grade = {
                                id: grades.length + 1,
                                courseId: args.courseId,
                                studentId: args.studentId,
                                grade: args.grade,

                            };
                            grades.push(grade);
                            return grade
                        }
                    }
                }
            }
        },
        deleteCourse: {
            type: GraphQLList(CourseType),
            description: 'Delete a course',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                let index = -1;
                const alumno = students.find(student => student.courseId === args.id);
                const nota = grades.find(grade => grade.courseId === args.id);

                if (!nota && !alumno) {
                    console.log(`la nota es ${nota}`);
                    console.log(`el alumno es ${alumno}`);
                    courses.forEach((course, i) => {
                        if (course.id === args.id) {
                            index = i;
                        }
                    })

                    if (index >= 0) {
                        courses.splice(index, 1);
                        return courses;

                    } else {
                        throw new Error('no exist course')
                    }

                }

            }
        }


    })
});

module.exports = RootMutationType;