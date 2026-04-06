import { prisma } from "~/db.server";

export function createQuestion({
    question, alternativaA, alternativaB, alternativaC, alternativaD, base}: {
    question: string;
    alternativaA: string;
    alternativaB: string;
    alternativaC: string;
    alternativaD: string;
    base: string;
}) {
    return prisma.question.create({
        data: {
            question,
            alternativaA,
            alternativaB,
            alternativaC,
            alternativaD,
            base
        }
    });
}

export function getQuestion({
    id
}: {
    id: string;
}) {
    return prisma.question.findFirst({
        where: { id },
    });
}

export function getQuestionListItems() {
    return prisma.question.findMany({
        select: { id: true},
    });
}

export function deleteQuestion({
    id,
}: { id: string }) {
    return prisma.question.deleteMany({
        where: { id },
    });
}

