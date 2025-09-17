import { Form, Link, useActionData } from "react-router";

// export function Featured({ img, price, title, grade, itemId }) {
//   return (
//     <div className="w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//       <Link to={`/products/${itemId}`} className="block">
//         <img
//           src={img}
//           alt={`Cover of ${title}`}
//           className="w-full h-48 object-cover"
//           loading="lazy"
//         />
//         <div className="p-4">
//           <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
//           <p className="text-sm text-gray-600 mb-2">Grade: {grade}</p>
//           <p className="text-indigo-600 font-bold text-lg">{price}</p>
//         </div>
//       </Link>
//     </div>
//   );
// }

export function Card({ id, title, category, price, image }) {
  return (
    <article className="group relative flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Link to={`/products/${id}`} className="block w-full h-full">
          <img
            src={image}
            alt={`Product image for ${title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </Link>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow">
        {category && (
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">
            {category}
          </p>
        )}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight flex-grow">
          <Link to={`/products/${id}`} className="hover:underline">
            {title}
          </Link>
        </h2>
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
            ksh {price}
          </p>
          <Form method="post">
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-200"
            >
              + Add to Cart
            </button>
          </Form>
        </div>
      </div>
    </article>
  );
}

export function AuthField({
  title,
  message,
  route,
  routeText,
  includeName = false,
  includeConfirmPassword = false,
  checkboxText,
  submitLabel = "Submit",
  reset,
  divider = false,
  includePhone = false,
}) {
  let actionData = useActionData();
  let emailError = actionData?.errors?.email;
  let passwordError = actionData?.errors?.password;
  let usernameError = actionData?.errors?.username; // Add this line
  return (
    <>
      <div className="leading-tight mb-4">
        <h1 className="text-2xl text-center  font-extrabold text-blue-700 dark:text-blue-400">
          Collins
        </h1>
        <h2 className="text-lg text-center font-extrabold text-gray-600 dark:text-gray-300">
          EduMart
        </h2>
      </div>

      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {message && (
        <p className="text-sm">
          {message}{" "}
          <Link to={route} className="text-blue-600 hover:underline">
            {routeText}
          </Link>
        </p>
      )}

      <Form method="post" className="space-y-4">
        {includeName && (
          <div>
            <label htmlFor="username" className="block text-sm mb-1">
              Username{" "}
              {usernameError && (
                <span className="text-red-600">{usernameError}</span>
              )}
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="user" className="block text-sm mb-1">
            Email
            {emailError && <span className="text-red-600">{emailError}</span>}
          </label>
          <input
            autoFocus
            autoComplete="email"
            type="text"
            name="email"
            id="email"
            placeholder="example@gmail.com"
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>

        {includePhone && (
          <div>
            <label htmlFor="phone" className="block text-sm mb-1">
              Phone Number
            </label>
            <input
              autoComplete="phone"
              type="tel"
              name="phone"
              id="phone"
              placeholder="0712345678"
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm mb-1">
            Password
            {passwordError && (
              <span className="text-red-600">{passwordError}</span>
            )}
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="********"
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>

        {includeConfirmPassword && (
          <div>
            <label htmlFor="confirm" className="block text-sm mb-1">
              Confirm Password{" "}
              {/* {confirmError && (
                <span className="text-red-600">{confirmError}</span>
              )} */}
            </label>
            <input
              type="password"
              name="confirm"
              id="confirm"
              placeholder="********"
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
        )}

        {checkboxText && (
          <label className="flex items-center space-x-2 text-sm">
            <input type="checkbox" className="accent-blue-500" />
            <span>{checkboxText}</span>
          </label>
        )}

        {reset && (
          <div>
            <Link
              to="/reset"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-sky-500 focus:outline-offset-4 focus:outline-violet-500 text-white py-2 rounded"
        >
          {submitLabel}
        </button>

        {divider && (
          <>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 my-4">
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
              <span className="px-3">or continue with</span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
            </div>
            <div className="flex justify-center">
              <Link to="#" aria-label="Sign in with Google">
                <img
                  src="/media/google.svg"
                  alt="Google Login"
                  className="h-7 w-7"
                />
              </Link>
            </div>
            <p className="text-xs text-center mt-2">
              <Link to="/privacy" className="hover:underline">
                Privacy and Terms
              </Link>
            </p>
          </>
        )}
      </Form>
    </>
  );
}

//reuseable outside component
export function AuthLayout({ children, image = "/sign/vector.jpg" }) {
  return (
    <main className="min-h-screen bg-gray-100 p-4 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden md:grid md:grid-cols-2">
        {/* Left side - whatever we pass */}
        <div className="p-6 space-y-6 flex flex-col justify-center">
          {children}
        </div>

        {/* Right side - brand or illustration */}
        <div className="hidden md:block bg-gray-50 dark:bg-gray-700">
          <img
            src={image}
            alt="Auth Visual"
            className="w-full h-full object-contain p-10"
          />
        </div>
      </div>
    </main>
  );
}
