import {prisma} from "../lib/prisma";
import {NotFoundError} from "../errors";
import {
    CreateExerciseInput, ExerciseProgressInput, UpdateExerciseInput
} from "../middlewares/validation/exerices.schema";

export const createExercise = async (
    data: CreateExerciseInput
) => {
    return prisma.exercise.create({data})
};

export const getExercises = async (lessonId: number) => {
    return prisma.exercise.findMany({
        where: {
            lessonId
        }
    })
}

export const exerciseProgress = async (data: ExerciseProgressInput) => {
    const exercise = await prisma.exercise.findUnique({
        where: {exerciseId: data.exerciseId}
    })

    if (!exercise) {
        throw new NotFoundError('Exercise not found');
    }

    return prisma.exerciseProgress.create({data})
}

export const updateExercise = async (data:
                                         {exerciseId: number} & UpdateExerciseInput
) => {
    const exercise = await prisma.exercise.findUnique({
        where: {exerciseId: data.exerciseId}
    })

    if (!exercise) {
        throw new NotFoundError('Exercise not found');
    }

    return prisma.exercise.update({
        where: {exerciseId: data.exerciseId},
        data
    });
}

export const deleteExercise = async (exerciseId: number) => {
    const exercise = await prisma.exercise.findUnique({
        where: {exerciseId: exerciseId}
    })

    if (!exercise) {
        throw new NotFoundError('Exercise not found');
    }

    return prisma.exercise.delete({
        where: {exerciseId}
    });
}