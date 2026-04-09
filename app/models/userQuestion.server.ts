import { prisma } from "~/db.server";

export async function createUserQuestion({ questionId, userId }: {
    questionId: string;
    userId: string;
}) {
    const question = await prisma.question.findUnique({
        where: { id: questionId },
    });
    if (!question) {
        throw new Error("Question not found");
    }
    const alternativas =[
        {correct: true, text: question.alternativaA},
        {correct: false, text: question.alternativaB},
        {correct: false, text: question.alternativaC},
        {correct: false, text: question.alternativaD}
    ];
    const alternativasShuffled = shuffleArray(alternativas);
    const correctResponse = ["A", "B", "C", "D"][alternativasShuffled.findIndex(a => a.correct)];
    return prisma.userQuestion.create({
        data: {
            userId,
            questionId,
            correctResponse,
            questionText: question.question,
            alternativaA: alternativasShuffled[0].text,
            alternativaB: alternativasShuffled[1].text,
            alternativaC: alternativasShuffled[2].text,
            alternativaD: alternativasShuffled[3].text,
            base: question.base
        }
    });
}

export function getUserQuestion({
    id
}: {
    id: string;
}) {
    return prisma.userQuestion.findFirst({
        where: { id },
    });
}

export function setUserResponse({
    id,
    userResponse }: {
        id: string;
        userResponse: string;
    }) {
    return prisma.userQuestion.update({
        where: { id },
        data: { userResponse: userResponse }
    });
}

function shuffleArray(array: any[]) {
    let arrayCopy = [...array];
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements array[i] and array[j]
        [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }
    return arrayCopy;
}