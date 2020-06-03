const express = require('express');
const app = express();
const expressGraphQL = require('express-graphql');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const courses = require('./src/DataBase/courses.json');
const students = require('./src/DataBase/students.json');
const grades = require('./src/DataBase/grades.json');
// const { CourseType, StudentType, GradeType } = require('./src/types/index')

const CourseType = new GraphQLObjectType({
    name: 'Course',
    description: 'Represent course',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
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
                } else {
                    throw new Error('does not exist course with that id')
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
                        if (args.grade >= 0 && args.grade <= 10) {

                            const grade = {
                                id: grades.length + 1,
                                courseId: args.courseId,
                                studentId: args.studentId,
                                grade: args.grade,

                            };
                            grades.push(grade);
                            return grade
                        } else {
                            throw new Error('the note is not between 0 and 10')

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
                    // console.log(`the note is ${nota}`);
                    // console.log(`the student is ${alumno}`);
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

                } else {
                    throw new Error('do not delet a course whit that id , becouse this course have a student or grade');

                }
            }
        },
        deleteGrade: {
            type: GraphQLList(GradeType),
            description: ('delete a grade'),
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {

                let index = -1;
                grades.forEach((grade, i) => {
                    if (grade.id === args.id) {
                        index = i;
                    }
                })
                if (index >= 0) {
                    grades.splice(index, 1);
                    return grades;
                } else {
                    throw new Error('no exist grade')
                }
            }
        },
        deleteStudent: {
            type: GraphQLList(StudentType),
            description: ('delete a grade'),
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                let index = -1;

                const grade = grades.find(grade => grade.studentId === args.id);
                if (!grade) {
                    students.forEach((student, i) => {
                        if (student.id === args.id) {
                            index = i;
                        }
                    })
                    if (index >= 0) {
                        students.splice(index, 1)
                        return students;
                    } else {
                        throw new Error('')
                    }
                } else {
                    throw new Error('')
                }
            }

        }


    })
});

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});


app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))

app.listen(3000, () => {
    console.log('Server running');

});