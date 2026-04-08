import { json, LoaderFunctionArgs, ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Alternative from "~/components/alternative";
import { getQuestion, getQuestionListItems } from "~/models/question.server";
import { createUserQuestion, getUserQuestion, setUserResponse } from "~/models/userQuestion.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    invariant(params.userquestionId, "userquestionId not found");
    console.log("Loader called with userquestionId:", params.userquestionId);
    const userQuestion = await getUserQuestion({ id: params.userquestionId });
    if (!userQuestion) {
        throw new Response("Not Found", { status: 404 });
    }
    return json({ question: userQuestion });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
    const userId = await requireUserId(request);
    const formData = await request.formData();
    const alternativa = formData.get("alternativa");
    if (alternativa === "proxima") {
        const questionsList = await getQuestionListItems();
        const randomIndex = Math.floor(Math.random() * questionsList.length);
        const randomQuestion = questionsList[randomIndex];
        const userQuestion = await createUserQuestion({
            questionId: randomQuestion.id,
            userId
        });
        return redirect(`/userquestion/${userQuestion.id}`);
    }
    invariant(params.userquestionId, "userquestionId not found");
    const userQuestion = await getUserQuestion({ id: params.userquestionId });
    if (!userQuestion) {
        throw new Response("Not Found", { status: 404 });
    }
    if (userQuestion.userResponse) {
        return json({ error: "Question already answered" });
    }
    await setUserResponse({
        id: params.userquestionId,
        userResponse: alternativa as string,
    });
    return redirect(`/userquestion/${params.userquestionId}`);
};

export default function UserQuestionRoute() {
    const data = useLoaderData<typeof loader>();
    const base = data.question.base.split("\n").map((line: string, index: number) => <p key={index} className="text-sm">{line}</p>);
    return (
        <div className="w-full p-4">
            <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-4 border rounded shadow">
                <p className="p-4">{data.question.questionText}</p>
                <hr className="my-2" />
                <Form method="post"
                    className="flex flex-col gap-2 w-full ">
                    <Alternative text={`${data.question.alternativaA} `} alternativa="A" question={data.question} />
                    <Alternative text={`${data.question.alternativaB}`} alternativa="B" question={data.question} />
                    <Alternative text={`${data.question.alternativaC}`} alternativa="C" question={data.question} />
                    <Alternative text={`${data.question.alternativaD}`} alternativa="D" question={data.question} />
                    {data.question.userResponse && (
                        <p className={`text-center font-bold flex flex-col ${data.question.userResponse === data.question.correctResponse ? 'text-green-600' : 'text-red-600'}`}>
                            {data.question.userResponse === data.question.correctResponse ? 'Correto!' : `Errado! A resposta correta era ${data.question.correctResponse}.`}
                            <button className="bg-blue-600 text-white hover:bg-blue-500 px-4 py-2 rounded mt-2 w-full text-center" value="proxima" name="alternativa" type="submit">
                                Próxima pergunta
                            </button>

                        </p>
                    )}
                </Form>

                {data.question.userResponse && data.question.correctResponse !== data.question.userResponse && (
                    <div className="p-4">
                        <p className=" text-center font-bold text-blue-600">
                            Conhecimento Relevante:
                        </p>
                        <div className="text-justify mt-2 text-sm">
                            {base}
                        </div>
                    </div>
                )}
                <Outlet />
            </div>
        </div>
    )
}

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}