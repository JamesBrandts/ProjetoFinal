import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getQuestionListItems } from "~/models/question.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
      const questionsList = await getQuestionListItems();
      const randomIndex = Math.floor(Math.random() * questionsList.length);
      const randomQuestion = questionsList[randomIndex];
      return redirect(`/questions/${randomQuestion.id}`);
};