import { FC } from "react";




interface EmailTemplateProps {
  name: string;
  message: string;
}



export const  EmailTemplate :FC<Readonly<EmailTemplateProps>> = ({ name, message }) => {
  return (
    <div className="mx-auto max-w-lg rounded-2xl bg-slate-950 px-8 py-10 text-slate-50 shadow-xl">
      <h1 className="text-3xl font-semibold tracking-tight">Welcome, {name}!</h1>
      <p className="mt-4 text-base leading-7 text-slate-300">{message}</p>
    </div>
  );
}