import { useContext } from "react";
import { AuthContext } from "./components/AuthContext";

function Login() {
  const { logIn } = useContext(AuthContext);

  return (
    <section className="container-fluid row d-flex flex-column justify-content-center align-items-center text-center">
      <div className="col-12 my-5 py-5">
        <h1>Spendings</h1>
        <p className="mt-5">Before you log in please keep in mind that this is a practice project. <br />
          This application's purpose is to provide a clear understanding of my skills <br />
          and to have an application that could help not just me.
        </p>
        <p>For your safety, the authentication goes through a Google account.</p>
        <button onClick={logIn}>Login with Google</button>
      </div>
    </section>
  );
}
export default Login;