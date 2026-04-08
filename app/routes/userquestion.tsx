import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getQuestion, getQuestionListItems } from "~/models/question.server";
import { createUserQuestion } from "~/models/userQuestion.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    if (params.userquestionId)
        return null;
    const userId = await requireUserId(request);
    const questionsList = await getQuestionListItems();
    const randomIndex = Math.floor(Math.random() * questionsList.length);
    const randomQuestion = questionsList[randomIndex];
    const userQuestion = await createUserQuestion({
        questionId: randomQuestion.id,
        userId
    });
    return redirect(`/userquestion/${userQuestion.id}`);
};

export default function newQuestion() {
    return (
        <div>
            <Outlet />
        </div>
    )
}