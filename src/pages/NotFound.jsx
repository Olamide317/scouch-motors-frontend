import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-white px-5 py-20">
      <div className="max-w-[520px] text-center">
        <p className="text-lg font-bold text-[#F87927]">
          ERROR 404
        </p>

        <h1 className="mt-4 text-4xl font-bold text-[#233D4D]">
          Page Not Found
        </h1>

        <p className="mt-5 leading-7 text-[#3D3D3D]/70">
          The page you're looking for doesn't exist
          or may have been moved.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-xl bg-[#233D4D] px-8 font-semibold text-white transition-colors hover:bg-[#34596F]"
        >
          Return to Homepage
        </Link>
      </div>
    </main>
  );
}

export default NotFound;