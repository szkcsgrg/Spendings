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
  const [clickedItemId, setClickedItemId] = useState<string | null>(null);
  const [copyEffect, setCopyEffect] = useState(false);


  const initialSetupRef = useRef<HTMLDivElement>(null);
  const currencySetupRef = useRef<HTMLDivElement>(null);
  const savingsSetupRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const secondaryBRef = useRef<HTMLDivElement>(null);
  const thirdRef = useRef<HTMLDivElement>(null);
  const thirdBRef = useRef<HTMLDivElement>(null);
  const warningRefPrimary = useRef<HTMLParagraphElement>(null);

  const itemStyle = (itemId: string) => ({
    color: clickedItemId === itemId && '#2d3250',
    backgroundColor: clickedItemId === itemId && '#daa4fc',
  });


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
      if(warningRefPrimary.current)
        {
          warningRefPrimary.current.classList.remove("d-none");
          warningRefPrimary.current.classList.add("d-block");
          setTimeout(() => {
            if (warningRefPrimary.current) {
              warningRefPrimary.current.classList.remove("d-block");
              warningRefPrimary.current.classList.add("d-none");
            }
          }, 15000);
        }
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

  const copyTextToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyEffect(true);
      setClickedItemId(itemId);
      setTimeout(() => {
        setCopyEffect(false); 
        setClickedItemId(null); 
      }, 2000);

    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };


  return (
    <section className="h-100 row d-flex flex-column justify-content-center align-items-center text-center mt-2 pt-2 mt-md-5 pt-md-5 mx-2">
      <div className="mb-3">
        <h1>Welcome to Spendings!</h1>
      </div>

      <div id="initialSetup" ref={initialSetupRef} className="box-ui info mt-4 mt-md-5 pt-md-5 col-11 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
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


      <div id="currencySetup" ref={currencySetupRef} className="box-ui info col-11 col-md-8 col-lg-6 col-xl-5 col-xxl-4 d-none mt-md-5 pt-md-5">
        <h3>Currency Profiles</h3>
        <p>
        Do you have frequent transactions in other currencies? <br />
        Spendings App allows you to create up to <span>3</span> custom currency profiles to provide the utmost flexibility in managing your finances. <br />
        This level of customization ensures accurate tracking and informed financial decisions regardless of the currencies you use.
        </p>
        <p className="mt-4 text-center">Click on any of the symbols below to copy it to your clipboard.</p>
        <div className="copyItems-initial text-center">
          <ul className="d-flex flex-wrap justify-content-center align-items-center gap-1 gap-md-2 px-2 px-md-4 pt-3"> 
            <li onClick={() => copyTextToClipboard('$', '1')} style={itemStyle('1') as React.CSSProperties}>$</li>
            <li onClick={() => copyTextToClipboard('£', '2')} style={itemStyle('2') as React.CSSProperties}>£</li>
            <li onClick={() => copyTextToClipboard('€', '3')} style={itemStyle('3') as React.CSSProperties}>€</li>
            <li onClick={() => copyTextToClipboard('¥', '4')} style={itemStyle('4') as React.CSSProperties}>¥</li>
            <li onClick={() => copyTextToClipboard('₹', '5')} style={itemStyle('5') as React.CSSProperties}>₹</li>
            <li onClick={() => copyTextToClipboard('₩', '6')} style={itemStyle('6') as React.CSSProperties}>₩</li>
            <li onClick={() => copyTextToClipboard('₽', '7')} style={itemStyle('7') as React.CSSProperties}>₽</li>
            <li onClick={() => copyTextToClipboard('元', '8')} style={itemStyle('8') as React.CSSProperties}>元</li>
            <li onClick={() => copyTextToClipboard('ლ', '9')} style={itemStyle('9') as React.CSSProperties}>ლ</li>
            <li onClick={() => copyTextToClipboard('₦', '10')} style={itemStyle('10') as React.CSSProperties}>₦</li>
            <li onClick={() => copyTextToClipboard('₫', '11')} style={itemStyle('11') as React.CSSProperties}>₫</li>
            <li onClick={() => copyTextToClipboard('₡', '12')} style={itemStyle('12') as React.CSSProperties}>₡</li>
            <li onClick={() => copyTextToClipboard('ƒ', '13')} style={itemStyle('13') as React.CSSProperties}>ƒ</li>
          </ul>
        </div>
        <p className="mb-2">
          {copyEffect && 'Copied!' }
        </p>
        <div id="mandatory" className="currencyProfile d-flex flex-column my-2 mx-5">
          <h4>Primary Currency Profile</h4>
          <input className="currencyInput my-2" name="mandatoryname" placeholder="Name (EUR, HUF, ...)" type="text" onChange={e => setPrimaryName(e.target.value)} title="Choose a clear and recognizable name for your currency profile. This name will be displayed within the app to help you easily identify the currency."/>
          <input className="currencyInput my-2" name="mandatoryformat" placeholder="Format (0.00, 0, ...)" type="text" onChange={e => setPrimaryFormat(e.target.value)} title="Specify how you want numbers to be formatted within this currency profile. For example, some currencies use two decimal places (0.00), while others might not use any decimals (0)."/>
          <input className="currencyInput my-2" name="mandatorytag" placeholder="Tag (€, Ft, ...)" type="text" onChange={e => setPrimaryTag(e.target.value)} title="Define a symbol or tag to visually represent your chosen currency. This tag will be displayed alongside the amount when viewing transactions in this currency profile."/>
          <span className="link my-3" onClick={showSecondary}>Add More</span>
        </div>
        <div id="secondary" ref={secondaryRef} className="currencyProfile d-flex flex-column my-2 mx-5 d-none">
          <h4>Secondary Currency Profile</h4>
          <input className="currencyInput my-2" name="secondaryname" placeholder="Name (EUR, HUF, ...)" type="text" onChange={e => setSecondaryName(e.target.value)} title="Choose a clear and recognizable name for your currency profile. This name will be displayed within the app to help you easily identify the currency."/>
          <input className="currencyInput my-2" name="secondaryformat" placeholder="Format (0.00, 0, ...)" type="text" onChange={e => setSecondaryFormat(e.target.value)} title="Specify how you want numbers to be formatted within this currency profile. For example, some currencies use two decimal places (0.00), while others might not use any decimals (0)."/>
          <input className="currencyInput my-2" name="secondarytag" placeholder="Tag (€, Ft, ...)" type="text"  onChange={e => setSecondaryTag(e.target.value)} title="Define a symbol or tag to visually represent your chosen currency. This tag will be displayed alongside the amount when viewing transactions in this currency profile."/>
          <span className="link my-2" ref={secondaryBRef} onClick={hideSecondary}>Remove</span>
          <span className="link my-1" onClick={showThird}>Add More</span>
        </div>
        <div id="third" ref={thirdRef} className="currencyProfile d-flex flex-column my-2 mx-5 d-none">
          <h4>Tertiary Currency Profile</h4>
          <input className="currencyInput my-2" name="thirdname" placeholder="Name (EUR, HUF, ...)" type="text" onChange={e => setThirdName(e.target.value)} title="Choose a clear and recognizable name for your currency profile. This name will be displayed within the app to help you easily identify the currency."/>
          <input className="currencyInput my-2" name="thirdformat" placeholder="Format (0.00, 0, ...)" type="text" onChange={e => setThirdFormat(e.target.value)} title="Specify how you want numbers to be formatted within this currency profile. For example, some currencies use two decimal places (0.00), while others might not use any decimals (0)."/>
          <input className="currencyInput my-2" name="thirdtag" placeholder="Tag (€, Ft, ...)" type="text" onChange={e => setThirdTag(e.target.value)} title="Define a symbol or tag to visually represent your chosen currency. This tag will be displayed alongside the amount when viewing transactions in this currency profile."/>
          <span className="link my-3" ref={thirdBRef} onClick={hideThird}>Remove</span>
        </div>
        <br />
        <p className="d-none flex-column text-center col-12 mt-5" ref={warningRefPrimary}>
        <span>Action Required:</span><br />
          To maintain a functional currency system, at least one currency must be designated as the primary currency. <br />
        </p>
        <button className="my-3" onClick={next}>Next</button>
      </div>




      <div id="savingsSetup" ref={savingsSetupRef} className="box-ui info col-11 col-md-8 col-lg-6 col-xl-5 col-xxl-4 d-none">
        <h3>Savings Account Balance</h3>
        <p>
          Please enter your current savings account balance. 
          <br />This is entirely optional, but it allows you to get a more comprehensive view of your overall financial situation within Spendings App. 
        </p>
        <div className="d-flex flex-column">
          <div>
            <input className="mt-5 my-3 mx-2" placeholder="Savings Balance" type="text" onChange={e => setPrimaryAmount(e.target.value)} />{primaryTag}
          </div>
          {secondaryName && secondaryName !== '' && (
            <div>
              <input className="my-3 mx-2" placeholder="Savings Balance" type="text" onChange={e => setSecondaryAmount(e.target.value)} />
              <span>{secondaryTag}</span>
            </div>
          )}
          {thirdName && thirdName !== '' && (
            <div>
              <input className="my-3 mx-2" placeholder="Savings Balance" type="text" onChange={e => setThirdAmount(e.target.value)} />
              <span>{thirdTag}</span>
            </div>
          )}
        </div>
        <div className="d-flex justify-content-center align-items-center text-center gap-4 mt-4">
          <span onClick={() => {setIsFirstLogin(false); navigate("/")}}>Skip</span>
          <button onClick={handleSavingsSubmit}>Save</button>
        </div>
      </div>

      <h5 className="mt-5 mb-5 col-11 col-md-8 col-lg-6">Once you've completed these steps, you're all set to start managing your finances with Spendings App!</h5>
        
        
    </section>
  )
}

export default InitialSetup