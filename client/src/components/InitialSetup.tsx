import { useRef, useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../utils/AuthContext';

function InitialSetup() {

  const backendServer = import.meta.env.VITE_APP_SERVER;
  const { setIsFirstLogin } = useContext(AuthContext);
  const [primaryAmount, setPrimaryAmount] = useState("0.00");
  const [secondaryAmount, setSecondaryAmount] = useState("0.00");
  const [thirdAmount, setThirdAmount] = useState("0.00");
  const [primaryName, setPrimaryName] = useState("");
  const [primaryFormat, setPrimaryFormat] = useState("");
  const [primaryTag, setPrimaryTag] = useState("");
  const [secondaryName, setSecondaryName] = useState("");
  const [secondaryFormat, setSecondaryFormat] = useState("");
  const [secondaryTag, setSecondaryTag] = useState("");
  const [thirdName, setThirdName] = useState("");
  const [thirdFormat, setThirdFormat] = useState("");
  const [thirdTag, setThirdTag] = useState("");
  const navigate = useNavigate();


  const initialSetupRef = useRef<HTMLDivElement>(null);
  const currencySetupRef = useRef<HTMLDivElement>(null);
  const savingsSetupRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const secondaryBRef = useRef<HTMLDivElement>(null);
  const thirdRef = useRef<HTMLDivElement>(null);
  const thirdBRef = useRef<HTMLDivElement>(null);


  const handleSavingsSubmit = async () => {
    const response = await fetch(`${backendServer}/changesavings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: localStorage.getItem('userEmail'),
        month: 'initial',
        income: Number(0),
        saving: Number(primaryAmount),
        currency: localStorage.getItem('primary_name')
      })
    });
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status);
    }
    if(secondaryAmount !== "0.00"){
      const response = await fetch(`${backendServer}/changesavings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          month: 'initial',
          income: Number(0),
          saving: Number(secondaryAmount),
          currency: localStorage.getItem('secondary_name')
        })
      });
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
    }
    if(thirdAmount !== "0.00"){
      const response = await fetch(`${backendServer}/changesavings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          month: 'initial',
          income: Number(0),
          saving: Number(thirdAmount),
          currency: localStorage.getItem('third_name')
        })
      });
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
    }
    setIsFirstLogin(false);
  };


  const startSetup = () => {
    if (initialSetupRef.current && currencySetupRef.current) { // Ensure both refs are valid
      initialSetupRef.current.classList.add("d-none");
      currencySetupRef.current.classList.remove("d-none");
      currencySetupRef.current.classList.add("d-block");
    } else {
      console.error("Refs not initialized yet!");
    }
  };

  const next = async () => {
    if (primaryName && primaryFormat && primaryTag) { 
      localStorage.setItem("primary_name", primaryName);
      localStorage.setItem("secondary_name", secondaryName);
      localStorage.setItem("third_name", thirdName);
      localStorage.setItem("primary_format", primaryFormat);
      localStorage.setItem("secondary_format", secondaryFormat);
      localStorage.setItem("third_format", thirdFormat);
      localStorage.setItem("primary_tag", primaryTag);
      localStorage.setItem("secondary_tag", secondaryTag);
      localStorage.setItem("third_tag", thirdTag);


      // Prepare data for the backend (only include set values)
      const data = {
        email: localStorage.getItem("userEmail"),
        displayName: localStorage.getItem("userName"),
        photoURL: localStorage.getItem("userPhoto"),
        primary_name: primaryName,
        primary_format: primaryFormat,
        primary_tag: primaryTag,
        secondary_name: secondaryName || null, 
        secondary_format: secondaryFormat || null, 
        secondary_tag: secondaryTag || null, 
        third_name: thirdName || null, 
        third_format: thirdFormat || null, 
        third_tag: thirdTag || null, 
      };
        
      if (currencySetupRef.current && savingsSetupRef.current) {
        try {
          const response = await axios.post(`${backendServer}/login`, data);
          if (response.status === 200) { // Check for successful response (status code 200)
            currencySetupRef.current.classList.remove("d-block");
            currencySetupRef.current.classList.add("d-none");
            savingsSetupRef.current.classList.remove("d-none");
            savingsSetupRef.current.classList.add("d-block");
          } else {
            console.error("Error sending data to backend:", response.statusText);
            alert("An error occurred while saving your data. Please try again.");
          }
        } catch (error) {
          console.error("Error sending data to backend:", error);
          alert("An error occurred while saving your data. Please try again.");
        }
      } else {
        console.error("Refs not initialized yet!");
      }
    }
    else{
      alert("Please fill the visible currency profile details.");
    }
    
  };

  const showSecondary = () => {
    if (secondaryRef.current) {
      secondaryRef.current.classList.remove("d-none");
      secondaryRef.current.classList.add("d-block");
      // Toggle visibility class for the "Remove" button
      secondaryBRef.current?.classList.remove("d-none");
      secondaryBRef.current?.classList.add("d-block");
    } else {
      console.error("Secondary ref not initialized yet!");
    }
  };
  const hideSecondary = () => {
    if(secondaryRef.current) {
      secondaryRef.current.classList.remove("d-block");
      secondaryRef.current.classList.add("d-none");
      //Toggle visibility class for The "Remove" button
      secondaryBRef.current?.classList.remove("d-block");
      secondaryBRef.current?.classList.add("d-none");
    }
    else{
      console.error("Secondary ref not initialized yet!");
    }
  };  

  const showThird = () => {
    if (thirdRef.current && thirdBRef.current) {
      thirdRef.current.classList.remove("d-none");
      thirdRef.current.classList.add("block");
      thirdBRef.current.classList.remove("d-none");
      thirdBRef.current.classList.add("d-block"); 
    } else {
      console.error("Third ref not initialized yet!");
    }
  };
  const hideThird = () => {
    if(thirdRef.current && thirdBRef.current) {
      thirdRef.current.classList.remove("d-block");
      thirdRef.current.classList.add("d-none");
      thirdBRef.current.classList.remove("d-block");
      thirdBRef.current.classList.add("d-none");
    }
    else{
      console.error("Third ref not initialized yet!");
    }
  };


  return (
    <section className="h-100 row d-flex flex-column justify-content-center align-items-center text-center mt-2 pt-2 mt-md-5 pt-md-5 mx-2">
      <div>
        <h1>Welcome to Spendings!</h1>
      </div>
        <div id="initialSetup" ref={initialSetupRef} className="box-ui info mt-md-5 pt-md-5 col-11 col-md-8 col-lg-6">
          <h3 className="text-center">Why We Gather Information During Initial Setup</h3>
          <p>
            To provide you with the best financial management experience, we'll guide you through a quick initial setup process. 
            This helps us personalize your experience and ensure accurate tracking of your finances.
          </p>

          <h4>
            Here's why we collect some details:
          </h4>
          
            <p>
              <span>Default Currency:</span> Specifying your primary currency type allows Spendings App to accurately categorize your transactions and visualize your spending habits.
            </p>
            <p>
            <span>Currency Profiles (Up to 3):</span> Do you deal with multiple currencies? Spendings App allows you to create up to 3 custom currency profiles. 
              This enables seamless transaction tracking for different currencies, a valuable feature for frequent travelers or business owners.
            </p>
            <p>
            <span>Savings Account Balance:</span> Knowing your current savings balance gives you a complete picture of your overall financial health within Spendings App. 
              You can track income and expenses alongside your savings, making informed budgeting decisions.
            </p>
          

          <p className="link" onClick={startSetup}>Let's get started!</p>
        </div>  


        <div id="currencySetup" ref={currencySetupRef} className="box-ui info col-11 col-md-8 col-lg-6 d-none mt-md-5 pt-md-5">
          <h3>Currency Profiles</h3>
          <p>
          Do you have frequent transactions in other currencies? <br />
          Spendings App allows you to create up to <span>3</span> custom currency profiles to provide the utmost flexibility in managing your finances. <br />
          This level of customization ensures accurate tracking and informed financial decisions regardless of the currencies you use.
          </p>
          <div id="mandatory" className="currencyProfile d-flex flex-column my-2 mx-5">
            <h4>Primary Currency Profile</h4>
            <input className="my-2" name="mandatoryname" placeholder="Name (EUR, HUF, ...)" type="text" onChange={e => setPrimaryName(e.target.value)} title="Choose a clear and recognizable name for your currency profile. This name will be displayed within the app to help you easily identify the currency."/>
            <input className="my-2" name="mandatoryformat" placeholder="Format (0.00, 0, ...)" type="text" onChange={e => setPrimaryFormat(e.target.value)} title="Specify how you want numbers to be formatted within this currency profile. For example, some currencies use two decimal places (0.00), while others might not use any decimals (0)."/>
            <input className="my-2" name="mandatorytag" placeholder="Tag (€, Ft, ...)" type="text" onChange={e => setPrimaryTag(e.target.value)} title="Define a symbol or tag to visually represent your chosen currency. This tag will be displayed alongside the amount when viewing transactions in this currency profile."/>
            <span className="my-3" onClick={showSecondary}>Add More</span>
          </div>
          <div id="secondary" ref={secondaryRef} className="currencyProfile d-flex flex-column my-2 mx-5 d-none">
            <h4>Secondary Currency Profile</h4>
            <input className="my-2" name="secondaryname" placeholder="Name (EUR, HUF, ...)" type="text" onChange={e => setSecondaryName(e.target.value)} title="Choose a clear and recognizable name for your currency profile. This name will be displayed within the app to help you easily identify the currency."/>
            <input className="my-2" name="secondaryformat" placeholder="Format (0.00, 0, ...)" type="text" onChange={e => setSecondaryFormat(e.target.value)} title="Specify how you want numbers to be formatted within this currency profile. For example, some currencies use two decimal places (0.00), while others might not use any decimals (0)."/>
            <input className="my-2" name="secondarytag" placeholder="Tag (€, Ft, ...)" type="text"  onChange={e => setSecondaryTag(e.target.value)} title="Define a symbol or tag to visually represent your chosen currency. This tag will be displayed alongside the amount when viewing transactions in this currency profile."/>
            <span className="my-2" ref={secondaryBRef} onClick={hideSecondary}>Remove</span>
            <span className="my-1" onClick={showThird}>Add More</span>
          </div>
          <div id="third" ref={thirdRef} className="currencyProfile d-flex flex-column my-2 mx-5 d-none">
            <h4>Tertiary Currency Profile</h4>
            <input className="my-2" name="thirdname" placeholder="Name (EUR, HUF, ...)" type="text" onChange={e => setThirdName(e.target.value)} title="Choose a clear and recognizable name for your currency profile. This name will be displayed within the app to help you easily identify the currency."/>
            <input className="my-2" name="thirdformat" placeholder="Format (0.00, 0, ...)" type="text" onChange={e => setThirdFormat(e.target.value)} title="Specify how you want numbers to be formatted within this currency profile. For example, some currencies use two decimal places (0.00), while others might not use any decimals (0)."/>
            <input className="my-2" name="thirdtag" placeholder="Tag (€, Ft, ...)" type="text" onChange={e => setThirdTag(e.target.value)} title="Define a symbol or tag to visually represent your chosen currency. This tag will be displayed alongside the amount when viewing transactions in this currency profile."/>
            <span className="d-none my-3" ref={thirdBRef} onClick={hideThird}>Remove</span>
          </div>
          <br />
          <button className="my-3" onClick={next}>Next</button>
        </div>




        <div id="savingsSetup" ref={savingsSetupRef} className="box-ui info col-11 col-md-8 col-lg-6 d-none">
          <h3>Savings Account Balance</h3>
          <p>
            Please enter your current savings account balance. 
            <br />This is entirely optional, but it allows you to get a more comprehensive view of your overall financial situation within Spendings App. 
            <br />You can always update this information later.
          </p>
          <input className="my-2" placeholder="Savings Balance" type="text" onChange={e => setPrimaryAmount(e.target.value)} />{primaryTag}
          {secondaryName && secondaryName !== '' && (
            <>
              <input className="my-2" placeholder="Savings Balance" type="text" onChange={e => setSecondaryAmount(e.target.value)} />
              <span>{secondaryTag}</span>
            </>
          )}
          {thirdName && thirdName !== '' && (
            <>
              <input className="my-2" placeholder="Savings Balance" type="text" onChange={e => setThirdAmount(e.target.value)} />
              <span>{thirdTag}</span>
            </>
          )}
          <div className="d-flex justify-content-center align-items-center text-center gap-3 mt-4">
            <span onClick={() => {setIsFirstLogin(false); navigate("/")}}>Skip</span>
            <button onClick={handleSavingsSubmit}>Save</button>
          </div>
        </div>
        <h5 className="mt-5 col-11 col-md-8 col-lg-6">Once you've completed these steps, you're all set to start managing your finances with Spendings App!</h5>
        
        
    </section>
  )
}

export default InitialSetup