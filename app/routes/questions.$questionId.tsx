import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import Alternative from "~/components/alternative";
import { getQuestion, getQuestionListItems } from "~/models/question.server";
import { requireUserId } from "~/session.server";


export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.questionId, "questionId not found");
  const question = await getQuestion({ id: params.questionId });
  if (!question) {
    throw new Response("Not Found", { status: 404 });  }
  const alternativas = [question.alternativaA, question.alternativaB, question.alternativaC, question.alternativaD];
  const values = [Math.random(), Math.random(), Math.random(), Math.random()];
  const sortedAlternativas = alternativas
    .map((alternativa, index) => ({ alternativa, value: values[index] }))
    .sort((a, b) => a.value - b.value)
    .map(({ alternativa }) => alternativa);    
  const outQuestion = {
    id: question.id,
    question: question.question,
    alternativaA: sortedAlternativas[0],
    alternativaB: sortedAlternativas[1],
    alternativaC: sortedAlternativas[2],
    alternativaD: sortedAlternativas[3],
  };
  return json({ question: outQuestion });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("alternativa");
  const userId = await requireUserId(request);
  const alternativa = formData.get("alternativa");
  console.log("Alternativa: ", title);
  invariant(params.questionId, "questionId not found");
  const questionsList = await getQuestionListItems();
  const randomIndex = Math.floor(Math.random() * questionsList.length);
  const randomQuestion = questionsList[randomIndex];
  return redirect(`/questions/${randomQuestion.id}`);
};

export default function QuestionDetailsPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="w-full p-4">
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-4 border rounded shadow">
        <p className="p-4">{data.question.question}</p>
        <hr className="my-2" />
        <Form method="post"
          className="flex flex-col gap-2 w-full ">
            <Alternative text={`${data.question.alternativaA} `} alternativa="a" />
            <Alternative text={`${data.question.alternativaB}`} alternativa="b" />
            <Alternative text={`${data.question.alternativaC}`} alternativa="c" />
            <Alternative text={`${data.question.alternativaD}`} alternativa="d" /> 
        </Form>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
