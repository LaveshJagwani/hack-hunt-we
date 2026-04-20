import { GoogleIcon } from "./Icons";

export default function GoogleButton({ children }) {
  return (
    <button
      className="inline-flex items-center justify-center gap-3 border-4 border-ink bg-white px-[17px] py-[14px] font-mono text-[12px] font-bold uppercase tracking-[0.16em] transition duration-150 hover:-translate-y-[3px] hover:rotate-[1deg]"
      type="button"
    >
      <GoogleIcon />
      {children}
    </button>
  );
}
