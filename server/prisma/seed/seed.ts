import {PERMISSIONS_DATA} from "./permissionsData";
import {ROLE_PERMISSIONS} from "../../src/constants/roles";
import {prisma} from "../../src/lib/prisma";
import {
    CourseLevel,
    ExerciseType,
    UserRole
} from "../../generated/prisma/enums";
import {hashPassword} from "../../src/utils/password";
import {ACHIEVEMENTS_DATA} from "./achievementsData";

async function seedRoles() {
    await prisma.permission.createMany({
        data: PERMISSIONS_DATA,
        skipDuplicates: true
    })

    const dbPermissions = await prisma.permission.findMany();
    const permissionMap = new Map(dbPermissions.map(p => [p.code, p.id]));

    for (const [role, permissions] of Object.entries(ROLE_PERMISSIONS)) {
        for (const permission of permissions) {
            await prisma.rolePermission.upsert({
                where: {
                    role_permissionId: {
                        role: role as UserRole,
                        permissionId: permissionMap.get(permission)
                    }
                },
                update: {},
                create: {
                    role: role as UserRole,
                    permissionId: permissionMap.get(permission)
                }
            })
        }
    }
}

async function seedAdmin() {
    await prisma.user.upsert({
        where: {email: "admin@langbang.com"},
        update: {},
        create: {
            username: "admin",
            email: "admin@langbang.com",
            passwordHash: await hashPassword('admin123'),
            role: "admin"
        }
    })
}

async function seedCoursesAndLessonsAndExercises() {
    const english = await prisma.language.upsert({
        where: { code: 'en' },
        update: {},
        create: {
            code: 'en',
            name: 'English',
        },
    })

    console.log(`Language created: ${english.name}`)

    const courseA1 = await prisma.course.create({
        data: {
            title: 'English for Beginners',
            description: 'Базовий курс для вивчення основ англійської мови.',
            level: CourseLevel.A1,
            targetLanguageId: english.id,

            lessons: {
                create: [
                    // --- УРОК 1: Greetings ---
                    {
                        title: 'Greetings & Introductions',
                        description: 'Learn basic greetings and introductions in English.',
                        sequence: 1,
                        exercises: {
                            create: [
                                {
                                    sequence: 1,
                                    type: ExerciseType.translation,
                                    question: 'Translate into Ukrainian: "Hello"',
                                    correctAnswer: 'Привіт',
                                    points: 10,
                                    metadata: { hint: 'Найпоширеніше привітання' }
                                },
                                {
                                    sequence: 2,
                                    type: ExerciseType.translation,
                                    question: 'Translate into Ukrainian: "Laptop"',
                                    correctAnswer: 'Ноутбук',
                                    points: 10,
                                    metadata: { }
                                },
                                {
                                    sequence: 3,
                                    type: ExerciseType.translation,
                                    question: 'Translate into Ukrainian: "Mouse"',
                                    correctAnswer: 'Миша',
                                    points: 15,
                                    metadata: {}
                                },
                                {
                                    sequence: 4,
                                    type: ExerciseType.translation,
                                    question: 'Translate into Ukrainian: "Comb"',
                                    correctAnswer: 'Гребінець',
                                    points: 15,
                                    metadata: {}
                                }
                            ]
                        }
                    },
                    // --- УРОК 2: Numbers ---
                    {
                        title: 'Numbers 1-10',
                        description: 'Learn how to count',
                        sequence: 2,
                        exercises: {
                            create: [
                                {
                                    sequence: 1,
                                    type: ExerciseType.translation,
                                    question: 'Write in English: "Один"',
                                    correctAnswer: 'One',
                                    points: 10
                                },
                                {
                                    sequence: 2,
                                    type: ExerciseType.writing,
                                    question: 'Fill gaps: One, Two, Three, ____, Five',
                                    correctAnswer: 'Four',
                                    points: 20
                                },
                                {
                                    sequence: 3,
                                    type: ExerciseType.translation,
                                    question: 'Write in English: "Дванадцять"',
                                    correctAnswer: 'Twelve',
                                    points: 10
                                },
                            ]
                        }
                    }
                ]
            }
        }
    })
    console.log(`Course created with ID: ${courseA1.courseId}`)
}

async function seedAchievements() {
    await prisma.achievement.createMany({
        data: ACHIEVEMENTS_DATA,
        skipDuplicates: true
    })
}

async function main() {
    await seedRoles();
    await seedAdmin();
    await seedAchievements();
    await seedCoursesAndLessonsAndExercises();
}

main()
    .then(async () => {
        console.log('Seeding done.');
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })

