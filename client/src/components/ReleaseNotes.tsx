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
            Version: 1.2.3
          </h1>
          <h3>
            Release Date: 2024-06-26
          </h3>
        </div>
        <div className="info text-center col-12 col-md-4">
          <p className="mt-5">We're excited to announce the latest update to the Spendings App version <span> 1.2.3</span>! <br />
           This update brings new features, improvements, and bug fixes to enhance your financial management experience.</p>
           <Link to={"https://github.com/szkcsgrg/Spendings"} target="_blank">Source Code</Link>
        </div>
      </header>
      <section className="row">
        <aside className="d-flex flex-column col-12 col-md-3 col-lg-3 col-xl-2 px-lg-5">
          <h2 className="my-3">Versions</h2>
          <ul>
            <li>1.2.3 - 2024-06-26</li>
            <li>
              1.2.2 - 2024-06-21
            </li>
            <li>
              1.2.1 - 2024-06-12
            </li>
          </ul>
        </aside>
        <div className="col-12 col-md-7 d-flex flex-column jusitify-content-center px-lg-5 mx-lg-5">
          <section className="info my-3 px-1 px-lg-5 mx-lg-5">
            <h2>New Features</h2>
            <p>Enhanced Currency Management: We've added a dedicated "Currency" section in Settings. <br /> Now you can easily create, edit, and delete your currency profiles, making it simpler to track your finances across different currencies.</p>
          </section>
          <section className="info my-3 px-1 px-lg-5 mx-lg-5">
            <h2>Improvements</h2>
            <p>Introducing Release Notes: We've created a brand new "What's New" section! Easily access release notes directly within the app to stay informed about all the latest changes and updates.
            </p>
          </section>
          <section className="info my-3 px-1 px-lg-5 mx-lg-5">
            <h2>Bug Fixes</h2>
            <p>Smoother Multi-Currency Experience: We've fixed an issue that caused problems when switching between currency profiles while viewing past data (like previous months). Now you can seamlessly manage your finances in different currencies.</p>
          </section>
          <section className="info my-3 px-1 px-lg-5 mx-lg-5">
            <h2>Known Issues</h2>
            <p>Temporary Login Experience: Due to recent changes by Firebase, we've implemented a temporary login method ("loginPopUp") on mobile devices. This might occasionally lead to error messages. We're actively working on a permanent solution and will keep you updated.</p>
          </section>
          <section className="info my-3 px-1 px-lg-5 mx-lg-5">
            <h2>Upcoming Features</h2>
            <p>Budgeting Support: We're excited to announce upcoming budgeting features! Set spending limits and stay on track with your financial goals.</p>
            <p>Enhanced Security: Rest assured, your data is protected with strong security measures. We'll be providing more details about these measures in a future update.</p>
            <p>Customizable Interface: Take control of your app experience! A future update will allow you to toggle specific UI elements on or off to personalize your view.</p>
            <p>Detailed Reports: Gain deeper insights into your finances with the upcoming report generation feature. Generate reports for a comprehensive financial analysis.</p>
            <p>Focus on User Comfort: We're continuously working on improving the user experience. Stay tuned for additional features designed to make managing your finances even easier.</p>
            <p>More Login Options: We're exploring the possibility of adding more login options beyond Google to provide greater flexibility in the future.</p>
          </section>
        </div>
      </section>
    </section>
  )
}

export default ReleaseNotes