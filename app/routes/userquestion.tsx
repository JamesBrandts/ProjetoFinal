import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getQuestionListItems } from "~/models/question.server";
import { createUserQuestion } from "~/models/userQuestion.server";
import { requireUser, requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const userId = await requireUserId(request);
    if (params.userquestionId) {
        const user = await requireUser(request);
        return json({ user: user });
    }
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
    const data = useLoaderData<typeof loader>();
    const user = data.user;
    return (
        <div className="flex h-full min-h-screen flex-col">
            <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
                <h1 className="text-2xl sm:text-3xl font-bold">
                    <Link to=".">Questões</Link>
                </h1>
                <div className="flex gap-2 items-center">
                <Link to="/cp/pie">{user.email}</Link>
                <Form action="/logout" method="post">
                    <button
                        type="submit"
                        className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                    >
                        Logout
                    </button>
                </Form>
                </div>
            </header>
            <Outlet />
        </div>
    )
}
