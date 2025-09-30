import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-12">
      <div className="grid max-w-5xl w-full grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left side (text) */}
        <div className="text-center md:text-left">
          <h1 className="text-6xl font-bold text-red-500">404</h1>
          <h2 className="mt-4 text-3xl font-semibold text-gray-800">
            Something is not right...
          </h2>
          <p className="mt-3 text-gray-600">
            The page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved. If you think this is an
            error, please contact support.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-medium shadow-md hover:bg-blue-700 transition"
          >
            Go Back Home
          </Link>
        </div>

        {/* Right side (image) */}
        <div className="flex justify-center">
          <Image
            src="/notfound.jpg"
            alt="404 illustration"
            width={400}
            height={400}
            className="w-full max-w-sm md:max-w-md h-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
}
