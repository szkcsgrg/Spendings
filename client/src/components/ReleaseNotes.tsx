import { Link } from "react-router-dom"


function ReleaseNotes() {
  return (
    <section className="container-fluid">
      <nav className="navbar fixed-top mx-2">
        <Link to={"/"} className="link d-flex flex-row gap-2" >
          Login
        </Link> 
      </nav>
      <header className="row d-flex justify-content-center my-lg-5">
        <div className="text-center col-12">
          <h1 className="mt-5">
            Version: 1.2.5
          </h1>
          <h3>
            Release Date: 2024-07-04
          </h3>
        </div>
        <div className="info text-center col-12 col-md-4">
          <p className="mt-5">We're excited to announce the latest update to the Spendings App version <span> 1.2.5</span>! <br />
           This update brings new features, improvements, and bug fixes to enhance your financial management experience.</p>
           <Link to={"https://github.com/szkcsgrg/Spendings"} target="_blank">Source Code</Link>
            <br />
        </div>
      </header>
      
      <section className="row justify-content-center">
        <div className="col-11 col-md-10 col-lg-8 col-xl-6 col-xxl-4 d-flex flex-column jusitify-content-center px-lg-5 mx-lg-5 py-lg-5 my-lg-5 box-ui">
          <section className="info my-3 px-1 px-lg-5 mx-lg-5">
            <h2>New Features</h2>
            <p>Customizable Spending Categories: You now have more control over your spending view! In the settings panel, you can hide and show existing spending categories to personalize your experience.</p>
          </section>
          <section className="info my-3 px-1 px-lg-5 mx-lg-5">
            <h2>Improvements - Bug Fixes</h2>
            <p>Data Accuracy: We've resolved an issue that caused data retrieval problems. Your financial information should now be displayed accurately.</p>
            <p>Login Enhancements: Using different login providers (like Google or Github) with the same email address should now work seamlessly.</p>
            <p>UI Refinements: We've made some minor adjustments to improve the app's visual alignment and overall look.</p>
            <p>Security Update: We've implemented a security improvement to better protect your data.</p>
          </section>
          <section className="info my-3 px-1 px-lg-5 mx-lg-5">
            <h2>Known Issues</h2>
            <p>Temporary Login Experience: Due to recent changes by Firebase, we've implemented a temporary login method ("loginPopUp") on mobile devices. This might occasionally lead to error messages. We're actively working on a permanent solution and will keep you updated.</p>
          </section>
          <section className="info my-3 px-1 px-lg-5 mx-lg-5">
            <h2>Upcoming Features</h2>
            <p>Budgeting Support: We're excited to announce upcoming budgeting features! Set spending limits and stay on track with your financial goals.</p>
            <p>Detailed Reports: Gain deeper insights into your finances with the upcoming report generation feature. Generate reports for a comprehensive financial analysis.</p>
            <p>Focus on User Comfort: We're continuously working on improving the user experience. Stay tuned for additional features designed to make managing your finances even easier.</p>
            <p>More Login Options: We're exploring the possibility of adding more login options beyond Google and Github to provide greater flexibility in the future.</p>
          </section>
          <section className="mt-3 px-1 px-lg-5 mx-lg-5 text-center">
            Explore previous versions on the <Link to={"https://github.com/szkcsgrg/Spendings/releases"}>Github</Link> repo.
          </section>
        </div>
      </section>
    </section>
  )
}

export default ReleaseNotes