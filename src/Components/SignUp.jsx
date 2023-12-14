import React from "react";
import { useNavigate } from "react-router-dom";
import { clientId, url } from "../App";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { GoogleLogin } from "react-google-login";

function SignUp() {
  const navigate = useNavigate();
  const responseSuccess = (response) => {
    handleSubmit({
      name: response.profileObj.name,
      email: response.profileObj.email,
      password: response.profileObj.googleId,
    });
  };
  const responseFailure = (response) => {
    window.alert("Sign In Failed!");
    console.error(response);
  };

  const handleSubmit = async (data) => {
    try {
      const request = await axios.post(`${url}/sign-up`, data);
      if (request.data.status === 200) {
        window.alert(request.data.message);
        navigate("/sign-in");
      }
      if (request.data.status === 402) {
        window.confirm(request.data.message);
        navigate("/sign-in");
      }
      if (request.data.status === 403) {
        window.alert(request.data.message);
      }
      if (request.data.status === 404) {
        window.alert(request.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Required"),
      email: yup.string().email("Enter a valid email").required("Required"),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]+$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .required("Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <>
      <div className="max-w-md mx-auto bg-white rounded p-6 shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-gray-700 font-semibold mb-2"
            >
              Name
            </label>
            <input
              type="password"
              id="name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            />
            {formik.touched.name && formik.errors.name ? (
              <div style={{ color: "red" }}>{formik.errors.name}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            />

            {formik.touched.email && formik.errors.email ? (
              <div style={{ color: "red" }}>{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            />
            {formik.touched.password && formik.errors.password ? (
              <div style={{ color: "red" }}>{formik.errors.password}</div>
            ) : null}
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Sign Up
            </button>
          </div>
          <div className="mb-4">
            <h6 className="">OR</h6>
          </div>
          <div className="mb-4">
            <GoogleLogin
              clientId={clientId}
              buttonText="Sign up with Google"
              onSuccess={responseSuccess}
              onFailure={responseFailure} // Handle failure if needed
              cookiePolicy={"single_host_origin"}
            />
          </div>
          <div className="mb-4">
            <h6 className="">
              Have an account?{" "}
              <a href="/sign-in" className="text-sky-500">
                Sign In
              </a>
            </h6>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignUp;
