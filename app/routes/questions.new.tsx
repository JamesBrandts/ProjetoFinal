import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createQuestion } from "~/models/question.server";

type ActionErrors = {
  question?: string;
  alternativaA?: string;
  alternativaB?: string;
  alternativaC?: string;
  alternativaD?: string;
  base?: string;
};


export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const question = formData.get("question");
  const alternativaA = formData.get("alternativaA");
  const alternativaB = formData.get("alternativaB");
  const alternativaC = formData.get("alternativaC");
  const alternativaD = formData.get("alternativaD");
  const base = formData.get("base");

  const errors: ActionErrors = {};

  if (typeof question !== "string" || question.length === 0) {
    errors.question = "Question is required";
  }

  if (typeof alternativaA !== "string" || alternativaA.length === 0) {
    errors.alternativaA = "Alternative A is required";
  }

  if (typeof alternativaB !== "string" || alternativaB.length === 0) {
    errors.alternativaB = "Alternative B is required";
  }

  if (typeof alternativaC !== "string" || alternativaC.length === 0) {
    errors.alternativaC = "Alternative C is required";
  }

  if (typeof alternativaD !== "string" || alternativaD.length === 0) {
    errors.alternativaD = "Alternative D is required";
  }

  if (typeof base !== "string" || base.length === 0) {
    errors.base = "Base is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  await createQuestion({ question: question as string, alternativaA: alternativaA as string, alternativaB: alternativaB as string, alternativaC: alternativaC as string, alternativaD: alternativaD as string, base: base as string });

  return redirect(`/questions/new`);
};

export default function NewQuestionPage() {
  const actionData = useActionData<{ errors: ActionErrors }>();
  const questionRef = useRef<HTMLTextAreaElement>(null);
  const alternativaARef = useRef<HTMLInputElement>(null);
  const alternativaBRef = useRef<HTMLInputElement>(null);
  const alternativaCRef = useRef<HTMLInputElement>(null);
  const alternativaDRef = useRef<HTMLInputElement>(null);
  const baseRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors?.question) {
      questionRef.current?.focus();
    } else if (actionData?.errors?.alternativaA) {
      alternativaARef.current?.focus();
    } else if (actionData?.errors?.alternativaB) {
      alternativaBRef.current?.focus();
    } else if (actionData?.errors?.alternativaC) {
      alternativaCRef.current?.focus();
    } else if (actionData?.errors?.alternativaD) {
      alternativaDRef.current?.focus();
    } else if (actionData?.errors?.base) {
      baseRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Question: </span>
          <textarea
            ref={questionRef}
            name="question"
            rows={4}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.question ? true : undefined}
            aria-errormessage={
              actionData?.errors?.question ? "question-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.question ? (
          <div className="pt-1 text-red-700" id="question-error">
            {actionData.errors.question}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Conhecimento Relevante: </span>
          <textarea
            ref={baseRef}
            name="base"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.base ? true : undefined}
            aria-errormessage={
              actionData?.errors?.base ? "base-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.base ? (
          <div className="pt-1 text-red-700" id="base-error">
            {actionData.errors.base}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Alternative A: </span>
          <input
            ref={alternativaARef}
            name="alternativaA"
            className="w-full rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.alternativaA ? true : undefined}
            aria-errormessage={
              actionData?.errors?.alternativaA
                ? "alternativaA-error"
                : undefined
            }
          />
        </label>
        {actionData?.errors?.alternativaA ? (
          <div className="pt-1 text-red-700" id="alternativaA-error">
            {actionData.errors.alternativaA}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Alternative B: </span>
          <input
            ref={alternativaBRef}
            name="alternativaB"
            className="w-full rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.alternativaB ? true : undefined}
            aria-errormessage={
              actionData?.errors?.alternativaB
                ? "alternativaB-error"
                : undefined
            }
          />
        </label>
        {actionData?.errors?.alternativaB ? (
          <div className="pt-1 text-red-700" id="alternativaB-error">
            {actionData.errors.alternativaB}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Alternative C: </span>
          <input
            ref={alternativaCRef}
            name="alternativaC"
            className="w-full rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.alternativaC ? true : undefined}
            aria-errormessage={
              actionData?.errors?.alternativaC
                ? "alternativaC-error"
                : undefined
            }
          />
        </label>
        {actionData?.errors?.alternativaC ? (
          <div className="pt-1 text-red-700" id="alternativaC-error">
            {actionData.errors.alternativaC}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Alternative D: </span>
          <input
            ref={alternativaDRef}
            name="alternativaD"
            className="w-full rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.alternativaD ? true : undefined}
            aria-errormessage={
              actionData?.errors?.alternativaD
                ? "alternativaD-error"
                : undefined
            }
          />
        </label>
        {actionData?.errors?.alternativaD ? (
          <div className="pt-1 text-red-700" id="alternativaD-error">
            {actionData.errors.alternativaD}
          </div>
        ) : null}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
