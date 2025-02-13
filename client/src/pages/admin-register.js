import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminRegister = () => {
  const navigate = useNavigate();
  const [errorMsg, seterrorMsg] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      fullname: formData.get("fullname"),
      userid: formData.get("userid"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch("http://localhost:8080/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        if (result.success) {
          seterrorMsg(result.message);
          localStorage.setItem("token", result.token);
          if (result.user.role === "admin") {
            navigate("/home");
          } else {
            navigate("/invoice");
          }
        } else {
          seterrorMsg(result.message);
        }
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
      seterrorMsg("An error occurred. Please try again.");
    }

  };

  return (
    <Fragment>
      <div className="bg-zinc-900 h-screen w-full flex justify-center items-center">
        <div className="flex flex justify-center items-center flex-col rounded-md px-10 py-10 bg-zinc-800">
          <h4 className="text-2xl mb-5 text-white">Admin Register</h4>
          <form onSubmit={handleSubmit}>
            <input
              className="bg-zinc-100 block px-3 py-2 border-1px rounded-md mb-3 border-zinc-200"
              type="text"
              placeholder="Full Name"
              name="fullname"
              required
            ></input>
            <input
              className="bg-zinc-100 block px-3 py-2 border-1px rounded-md mb-3 border-zinc-200"
              type="userid"
              placeholder="User ID"
              name="userid"
              required
            ></input>
            <input
              className="bg-zinc-100 block px-3 py-2 border-1px rounded-md mb-3 border-zinc-200"
              type="password"
              placeholder="Password"
              name="password"
              required
            ></input>
            <input
              className="px-5 rounded-full py-3 mt-2 bg-blue-500 text-white"
              type="submit"
              value="Create My Account"
            ></input>
          </form>
          <p className="text-red-600 mt-2">{errorMsg}</p>
          <p className="text-white mt-5">
            Already have an account?{" "}
            <a href="/admin-login" className="text-blue-500">
              Login
            </a>
          </p>
        </div>
      </div>
    </Fragment>
  );
};
