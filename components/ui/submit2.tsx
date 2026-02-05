// "use client";

// import { useFormStatus } from "react-dom";
// import { useState, useEffect, useRef } from "react";
// import { Button } from "./button";

// type SubmitButtonProps = {
//   onSuccess: () => void;
// };

// export function SubmitButton({ onSuccess }: SubmitButtonProps) {
//   //   const { pending } = useFormStatus();
//   //   const [emailSent, setEmailSent] = useState(false);

//   //   useEffect(() => {
//   //     if (!pending) {
//   //       onSuccess();
//   //     }
//   //   }, [pending, onSuccess]);
//   const { pending } = useFormStatus();
//   const hasSubmitted = useRef(false);

//   useEffect(() => {
//     if (pending) {
//       hasSubmitted.current = true;
//     } else if (hasSubmitted.current) {
//       onSuccess();
//       hasSubmitted.current = false;
//     }
//   }, [pending, onSuccess]);

//   //   tracks whether a submission has started.
//   // • 	 only runs after a real submission completes.
//   // • 	Prevents false positives on initial render.

//   return (
//     // <Button disabled={pending} className="w-full" variant="default">
//     //   {pending ? "Sending Email..." : "Send Email"}
//     // </Button>

//     <button
//       type="submit"
//       disabled={pending}
//       className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//     >
//       {pending ? "Submitting..." : "Submit"}
//     </button>
//   );
// }
