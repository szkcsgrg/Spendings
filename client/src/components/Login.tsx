import { useContext,
  //  useState 
  } from "react";
import { AuthContext } from "../utils/AuthContext";
import { Link } from "react-router-dom";

function Login() {
  const {
    // loginPassword,
     logIn, logInGithub } = useContext(AuthContext);

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const newemail = event.target.value;
  //   const isValid = newemail === '' || /^[a-zA-Z.,0-9@]+$/.test(newemail);
  //   if (isValid) {
  //     setEmail(newemail);
  //   } 
  // }
  // const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const newpassword = event.target.value;
  //   const isValid = newpassword
  //   //  === '' || /^[a-zA-Z.,0-9@]+$/.test(newpassword);
  //   if (isValid) {
  //     setPassword(newpassword);
  //   } 
  // }

  return (
    <section className="row d-flex flex-column justify-content-center align-items-center">
      <header className="header-login col-12 col-lg-7 d-flex flex-column align-items-center justify-content-center text-center px-4 ">
        <h1 className="my-2">Spendings</h1>
        <p>Take control of your finances with our easy-to-use money management app.</p>

        {/* <input placeholder="Email" value={email} onChange={handleEmailChange} type="text" />
        <input placeholder="Password" value={password} onChange={handlePasswordChange} type="text" />
        <button className="my-2 d-flex gap-1" onClick={() => loginPassword(email, password)}>Login</button> */}
        <div className="d-flex gap-2 flex-column flex-md-row">
          <button className="my-2 d-flex gap-1" onClick={logIn}><i className="bi bi-google"></i>Login with Google</button>
          <button className="my-2 d-flex gap-1" onClick={logInGithub}><i className="bi bi-github"></i>Login with Github</button>
        </div>
      </header>                     

    <footer className="fixed-bottom col-12 d-flex flex-column align-items-center justify-content-center text-center px-4 ">
      <p>Made by: <Link to={"https://szakacsgergo.com/"}>Gergő Szakács</Link></p>
    </footer>
    </section>
  );
}
export default Login;