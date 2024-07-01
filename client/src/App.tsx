import { useRef, useState, useEffect, useContext} from "react";
import { AuthContext } from "./utils/AuthContext";
import { Modal, Dropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";

type InputEvent = (event: React.ChangeEvent<HTMLInputElement>) => void;
type KeyboardEvent = (event: React.KeyboardEvent<HTMLInputElement>) => void;


interface Log{
  id: number;
  income: number;
  saving: number;
  amount: number;
  emoji: string;
  type: string;
}

interface Spending {
  id: number;
  position: number;
  amount: number;
  type: string;
  emoji: string;
}

function App() {
  /*  @collapsed */

  //Inital Values START
  //Defualt
  const authContext = useContext(AuthContext);
  const backendServer = import.meta.env.VITE_APP_SERVER;


  //Variables
  const [income, setIncome] = useState<string | number>(0);
  const [incomeInput, setIncomeInput] = useState<string>('');
  const [amount, setAmount] = useState<string | number>('');
  const [allSavings, setAllSavings] = useState<number[]>([]);
  const [totalSavings, setTotalSavings] = useState('0.00'); 
  const initialSpendings: Spending[] = [
    {id: 1, position: 1, amount: 0, type: 'Wages & Subscriptions', emoji: '💰'},
    {id: 2, position: 2, amount: 0, type: 'Transport', emoji: '🚆'},
    {id: 3, position: 3, amount: 0, type: 'Gas & Roads', emoji: '🚗'},
    {id: 4, position: 4, amount: 0, type: 'Occupations & Travel', emoji: '🏨'},
    {id: 5, position: 5, amount: 0, type: 'Health & Beauty', emoji: '💊'},
    {id: 6, position: 6, amount: 0, type: 'Shopping', emoji: '🛍️'},
    {id: 7, position: 7, amount: 0, type: 'Food & Delivery', emoji: '🍔'},
    {id: 8, position: 8, amount: 0, type: 'Clothes', emoji: '👕'},
    {id: 9, position: 9, amount: 0, type: 'Education', emoji: '🎓'},
    {id: 10, position: 10, amount: 0, type: 'Fun & Games', emoji: '🎮'},
    {id: 11, position: 11, amount: 0, type: 'Technologies', emoji: '🖥️'},
    {id: 12, position: 17, amount: 0, type: 'Missing & Error', emoji: '❌'},
    {id: 13, position: 12, amount: 0, type: 'Donation & Gift', emoji: '🎁'},
    {id: 14, position: 13, amount: 0, type: 'Transfer', emoji: '💸'},
    {id: 15, position: 14, amount: 0, type: 'Withdraw & Deposit', emoji: '💶'},
    {id: 16, position: 16, amount: 0, type: 'Savings', emoji: '🔐'},
    {id: 17, position: 15, amount: 0, type: 'Exchange', emoji: '🪙'}
    ];
  const [spendings, setSpendings] = useState<Spending[]>(initialSpendings);
  const [logEntries, setLogEntries] = useState<Log[]>([]);

  const [primaryCurrency, setPrimaryCurrency] = useState<string>(localStorage.getItem("primary_name") ?? ""); 
  const [secondaryCurrency, setSecondaryCurrency] = useState<string>(localStorage.getItem("secondary_name") ?? "");
  const [thirdCurrency, setThirdCurrency] = useState<string>(localStorage.getItem("third_name") ?? "");
  const [primaryFormat, setPrimaryFormat]= useState<string>(localStorage.getItem("primary_format") ?? "");
  const [secondaryFormat, setSecondaryFormat ]= useState<string>(localStorage.getItem("secondary_format") ?? "");
  const [thirdFormat, setThirdFormat ]= useState<string>(localStorage.getItem("third_format") ?? "");
  const [primaryTag, setPrimaryTag ]= useState<string>(localStorage.getItem("primary_tag") ?? "");
  const [secondaryTag, setSecondaryTag ]= useState<string>(localStorage.getItem("secondary_tag") ?? "");
  const [thirdTag, setThirdTag ]= useState<string>(localStorage.getItem("third_tag") ?? "");

  const [choosenCurrency, setChoosenCurrency] = useState<string>(primaryCurrency !=='null' || secondaryCurrency !== 'null' || thirdCurrency !== 'null' ? primaryCurrency || secondaryCurrency || thirdCurrency : "");
  const [choosenFormat, setChoosenFormat] = useState<number>(getFormatNumber(primaryFormat) || getFormatNumber(secondaryFormat) || getFormatNumber(thirdFormat));
  const [choosenTag, setChoosenTag] = useState<string>(primaryTag || secondaryTag || thirdTag);
  const [exchangeAmount, setExchangeAmount] = useState<string>("");

  const [incomeOfPrimaryAccount, setIncomeOfPrimaryAccount] = useState<string>("");
  const [incomeOfSecondaryAccount, setIncomeOfSecondaryAccount] = useState<string>("");
  const [incomeOfThirdAccount, setIncomeOfThirdAccount] = useState<string>("");
  const [initialIncome, setInitialIncome] = useState<number>(0);

  const [choosenPaymentMethod, setChoosenPaymentMethod] = useState<string>("card");
  const [otherPaymentMethodsIncome, setOtherPaymentMethodsIncome] = useState<string>("");


  const exchangedRef = useRef<HTMLDivElement>(null);
  const exchangeNewRef = useRef<HTMLDivElement>(null);
  const ProfileRef = useRef<HTMLImageElement>(null);
  const CurrencyRef = useRef<HTMLDivElement>(null);
  const warningRefPrimaryDelete = useRef<HTMLParagraphElement>(null);
  const warningRefEmptyDelete = useRef<HTMLParagraphElement>(null);


  function getFormatNumber(formatString: string): number {
    const decimalMatch = formatString.match(/^\$?\d{1,3}(?:,\d{3})*(?:\.\d+)?$/); // Extract decimal part
    if (decimalMatch) {
      const decimalPlaces = decimalMatch[0].split('.')[1]?.length || 0; // Get decimal places
      return decimalPlaces;
    } else {
      return 2; 
    }
  }
  const filterByCurrency = (data: any[], chosenCurrency: string) => {
    return data.filter(item => item.currency === chosenCurrency);
  };

  //Conditional Rendering
  const [isDataFetched, setIsDataFetched] = useState(false); 
  const [showTypes, setShowTypes] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);  
  const [showAreYouSureModal, setShowAreYouSureModal] = useState(false);
  const [confirmFunction, setConfirmFunction] = useState<() => Promise<void> | null>(() => null);
  const [clickedItemId, setClickedItemId] = useState<string | null>(null);
  const [copyEffect, setCopyEffect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dontAskAgainCurrencyAdd, setDontAskAgainCurrencyAdd] = useState(localStorage.getItem("dontAskAgainCurrencyAdd") || "false");



  // Months Related
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentDate = new Date();
  const [choosenMonth, setChoosenMonth] = useState(monthNames[currentDate.getMonth()])
  const [uniqueMonths, setUniqueMonths] = useState<string[]>([]);
  const isCurrentMonth = choosenMonth === monthNames[new Date().getMonth()];

  // Styles
  const tableStyle = {
    background: 'rgba( 51, 55, 59, 0.35 )',
    boxShadow: '0 8px 32px 0 rgba(115, 116, 131, 0.37)',
    backdropFilter: 'blur( 4.5px )',
    WebkitBackdropFilter: 'blur( 4.5px )',
  };
  const tableHeaderStyle = {
    background: 'rgba( 51, 55, 59, 0.35 )',
    // boxShadow: '0 8px 32px 0 rgba(115, 116, 131, 0.37)',
    backdropFilter: 'blur( 4.5px )',
    WebkitBackdropFilter: 'blur( 4.5px )',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#e0e4e8',
  };
  const tableBodyStyle = {
    background: 'rgba( 51, 55, 59, 0.35 )',
    // boxShadow: '0 8px 32px 0 rgba(115, 116, 131, 0.37)',
    backdropFilter: 'blur( 4.5px )',
    WebkitBackdropFilter: 'blur( 4.5px )',
    borderColor: '#525252',
    fontWeight: '400',
    color: '#e0e4e8',
    fontSize: '1.1rem',
    border: 0,
  };
  const itemStyle = (itemId: string) => ({
    color: clickedItemId === itemId && '#2d3250',
    backgroundColor: clickedItemId === itemId && '#daa4fc',
  });
  
  let uniqueCurrencies: any[] = [];
  //Inital Values END


  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------\\


  //Fetching the Data from the DB START
  //Fetch Data based on User and currentMonth
  const fetchData = async (choosenMonth: string | number | boolean) => {
    const response = await fetch(`${backendServer}/getspendingsUserMonth?user_id=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&month=${encodeURIComponent(choosenMonth)}&currency=${encodeURIComponent(choosenCurrency)}&payment=${encodeURIComponent(choosenPaymentMethod)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status)
    }

    const fetchedData: any[] = await response.json();

    const filteredData = filterByCurrency(fetchedData, choosenCurrency)

    const initialIncomeEntry = filteredData.find(row => row.user_email === localStorage.getItem('userEmail') && row.currency === choosenCurrency && row.month === choosenMonth && row.type_id === null);
    if(initialIncomeEntry){
      setInitialIncome(initialIncomeEntry.income);
    }
    else{
      setInitialIncome(0);
    }
    // setInitialIncome(initialIncomeEntry?.income || 0);

    const userEntries = filteredData.filter(row => row.user_email === localStorage.getItem('userEmail') && row.month === choosenMonth).map(entry => {
      //If the userRows has only an income value. Not type_id no amount, then set the initalIncome to that income.


      // Check if the saving has any value. If there is, add that value to the .amount. Add 'Saving' to the .type.
      // Keep the rest as well
    
      if (entry.saving !== null) {
        return {
          id: entry.id,
          income: entry.income,
          saving: entry.saving,
          amount: entry.saving,
          emoji: '🔐',
          type: 'Savings',
        };
      } else {
        //Here we need to add everything else based on initialSpendings types.
        const initialItem = initialSpendings.find(item => item.id === entry.type_id);
        return {
          id: entry.id,
          income: entry.income,
          saving: entry.saving,
          amount: entry.amount,
          emoji: initialItem?.emoji || '💳',
          type: initialItem?.type || 'Income',
        };
      }

    });
    setLogEntries(userEntries);
    setIsDataFetched(true);

    // Merge fetched data with initial spendings
    const mergedData = initialSpendings.map(initialItem => {
      // Find all fetched items of this type
      const fetchedItems = fetchedData.filter(item => item.type_id === initialItem.id);

      if (fetchedItems.length > 0) {
        // If there are fetched items of this type, sum their amounts
        const totalAmount = fetchedItems.reduce((sum, item) => sum + Number(item.amount), 0);
        return { ...initialItem, amount: totalAmount };
      } else {
        // If there are no fetched items of this type, use the initial amount
        return initialItem;
      }
    });

    // Get all rows of the fetched data for the specific user and month
    const userRows = fetchedData.filter(row => row.user_email === localStorage.getItem('userEmail') && row.month === choosenMonth && row.currency === choosenCurrency && row.payment === choosenPaymentMethod);
    if (userRows.length > 0) {  
      let totalSavings = 0;
      userRows.forEach(row => {
        const saving = Number(row.saving || 0);
        totalSavings += saving; // add the saving, whether it's positive or negative
      });
      const savingsIndex = mergedData.findIndex(item => item.id === 16);
      if (savingsIndex !== -1) {
        mergedData[savingsIndex].amount = totalSavings;
      }
    } 
    setSpendings(mergedData);
    
    // const incomeToSet = userRows.length > 0 ? userRows[userRows.length - 1].income : 0;
    // setIncome(incomeToSet);
  };
  
  //Fetch Data - The full spendings of the user
  const fetchAllDataFromUser = async () => {
    setIncomeOfPrimaryAccount("");
    setIncomeOfSecondaryAccount("");
    setIncomeOfThirdAccount("");
    const response = await fetch(`${backendServer}/getspendingsUser?user_id=${encodeURIComponent(localStorage.getItem("userEmail") || "")}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const fetchedData: any[] = await response.json();

    uniqueCurrencies = [...new Set(fetchedData.map(item => item.currency).filter(currency => currency))]; // filter out falsy values

    const currentMonth = monthNames[new Date().getMonth()];
    let uniqueMonthsFromData = [...new Set(fetchedData.map(item => item.month))] as string[];

    if (!uniqueMonthsFromData.includes(currentMonth)) {
      uniqueMonthsFromData = [...uniqueMonthsFromData, currentMonth];
    }
    setUniqueMonths(uniqueMonthsFromData);

    const filteredData = filterByCurrency(fetchedData, choosenCurrency);

    // const initialIncomeEntry = filteredData.find(row => row.user_email === localStorage.getItem('userEmail') && row.currency === choosenCurrency && row.month === choosenMonth && row.type_id === null);
    // console.log(initialIncomeEntry)
    // setInitialIncome(initialIncomeEntry);
    
    // Sort the fetched data by month in ascending order
    fetchedData.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    
    // Filter data for the user
    const userData = fetchedData.filter(row => row.user_email === localStorage.getItem('userEmail'));
    userData.sort((a, b) => b.id - a.id); // Sort by ID in descending order (highest ID first)
    (userData)
    
    for (const row of userData.reverse()) {
      if (row.currency === primaryCurrency) {
        setIncomeOfPrimaryAccount(row.income); // Update state with income value
      } else if (row.currency === secondaryCurrency) {
        setIncomeOfSecondaryAccount(row.income); // Update state with income value
      } else if (row.currency === thirdCurrency) {
        setIncomeOfThirdAccount(row.income); // Update state with income value
      }
      if(row.payment !== choosenPaymentMethod){
        setOtherPaymentMethodsIncome(row.income);
      }
    }
    // Sort the fetched data by month in ascending order
    // fetchedData.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    // const lastMonthData = filteredData.filter(row => row.user_email === localStorage.getItem('userEmail') && row.month === monthNames[new Date().getMonth() - 1]);
    // const currentMonthData = filteredData.filter(row => row.user_email === localStorage.getItem('userEmail') && row.month === monthNames[new Date().getMonth()]);
    // const lastMonthIncome = lastMonthData[lastMonthData.length - 1];
    // const currentMonthIncome = currentMonthData[currentMonthData.length - 1];
    // if(!lastMonthIncome && !currentMonthIncome){
    //   setIncome(0);
    // }
    // else if (lastMonthIncome && currentMonthIncome) {
    //   setIncome(currentMonthIncome.income);
    // } 
    // else if(currentMonthIncome === undefined && lastMonthIncome){  
    //   setIncome(lastMonthIncome.income);     
    // }
    // else if(currentMonthIncome && !lastMonthIncome){
    //   setIncome(currentMonthIncome.income);
    // }
    // console.log(income)
    
    const lastMonthData = filteredData.filter(row => 
      row.user_email === localStorage.getItem('userEmail') && 
      row.currency === choosenCurrency &&
      row.payment === choosenPaymentMethod &&
      row.month === monthNames[new Date().getMonth() - 1] || 
      (new Date().getMonth() === 0 && row.month === monthNames[11]) // Handle January case
    );
    
    // Filter data for the current month
    const currentMonthData = filteredData.filter(row => 
      row.user_email === localStorage.getItem('userEmail') && 
      row.month === monthNames[new Date().getMonth()]
    );
    
    // Get the last entry for last month and current month
    const lastMonthIncome = lastMonthData[lastMonthData.length - 1];
    const currentMonthIncome = currentMonthData[currentMonthData.length - 1];
    
    // Set income based on available data
    if (!lastMonthIncome && !currentMonthIncome) {
      setIncome(0); // No data available
    } else if (currentMonthIncome) {
      setIncome(currentMonthIncome.income); // Current month data available
    } else if (lastMonthIncome) {
      setIncome(lastMonthIncome.income); // Only last month data available
    }

    

    const savingsData = filteredData.map(item => Number(item.saving));
    setAllSavings(savingsData);
  }

  //Fetching the Data from the DB END
  useEffect(() => {
    // (choosenMonth, monthNames[currentDate.getMonth()]);
    if(choosenMonth === monthNames[currentDate.getMonth()]){
      setIsLoading(true);
      setTimeout(() => {
        Promise.all([fetchData(monthNames[currentDate.getMonth()])])
        .then(() => {
          // setIncome("");
          setPrimaryCurrency(localStorage.getItem("primary_name") ?? "");
          setSecondaryCurrency(localStorage.getItem("secondary_name") ?? "");
          setThirdCurrency(localStorage.getItem("third_name") ?? "");
          setPrimaryTag(localStorage.getItem("primary_tag") ?? "");
          setSecondaryTag(localStorage.getItem("secondary_tag") ?? "");
          setThirdTag(localStorage.getItem("third_tag") ?? "");
          setPrimaryFormat(localStorage.getItem("primary_format") ?? "");
          setSecondaryFormat(localStorage.getItem("secondary_format") ?? "");
          setThirdFormat(localStorage.getItem("third_format") ?? "");

          if(primaryCurrency === 'null') {
            setChoosenCurrency(secondaryCurrency);
            setChoosenFormat(getFormatNumber(secondaryFormat));
            setChoosenTag(secondaryTag);
          } else if (primaryCurrency === 'null' && secondaryCurrency === 'null') {
            setChoosenCurrency(thirdCurrency);
            setChoosenFormat(getFormatNumber(thirdFormat));
            setChoosenTag(thirdTag);
          }
          setIsLoading(false);
          setIsDataFetched(true);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setIsLoading(false); // Stop loading in case of error
        });
      }, 500);
      fetchAllDataFromUser();
    }
    else{
      setIsLoading(true); // Start loading
      setTimeout(() => {
        Promise.all([fetchData(choosenMonth), fetchAllDataFromUser()])
        .then(() => {
          while (uniqueCurrencies.length < 3) uniqueCurrencies.push(undefined);
          setPrimaryCurrency(uniqueCurrencies[0] || '');
          setSecondaryCurrency(uniqueCurrencies[1] || '');
          setThirdCurrency(uniqueCurrencies[2] || '');
          setPrimaryTag("");
          setSecondaryTag("");
          setThirdTag("");  
          setPrimaryFormat("0.00");
          setSecondaryFormat("0.00");
          setThirdFormat("0.00");

          setChoosenFormat(0.00);
          setChoosenTag("");
          
          setIsLoading(false); // Stop loading once data is fetched
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setIsLoading(false); // Stop loading in case of error
        });
      }, 1500);
    }
  }, [choosenMonth, isDataFetched, choosenCurrency, choosenPaymentMethod]);
  


  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------\\


  //Calculations START
  useEffect(() => {
    //(allSavings);
    const total = allSavings.reduce((total: number, saving: number) => {
      return total + saving;
    }, 0).toFixed(choosenFormat);
    setTotalSavings(total);
  }, [allSavings]);

  const totalSpent: string = spendings.reduce((total: number, spending: Spending) => {
    const amount = Number(spending.amount);
    if (!isNaN(amount) && spending.type !== 'Savings') {
      total += amount;
    }
    return total;
  }, 0).toFixed(choosenFormat);
  //Calculations END


  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------\\


  //Functions and Event handlers START
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
  const resetSpendings: () => void = async () => {
    setShowSettingsModal(false);
    setShowAreYouSureModal(true);
    setConfirmFunction(() => async () => {
  
    // Calculate the removed saving value and update totalSavings
    const removedSaving = spendings.reduce((total, spending) => total + (spending.type === 'Savings' ? spending.amount : 0), 0);
    setTotalSavings(prevTotalSavings => (Number(prevTotalSavings) - removedSaving).toFixed(choosenFormat));


    setSpendings(prevSpendings => prevSpendings.map(spending => ({...spending, amount: 0})));

    // Send a DELETE request to the server
    const response = await fetch(`${backendServer}/deletespendingsUserMonth?userId=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&month=${encodeURIComponent(monthNames[currentDate.getMonth()])}&currency=${encodeURIComponent(choosenCurrency)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status);
    }

    // Send a POST request to the server with the new income value
    const postResponse = await fetch(`${backendServer}/setIncomeAfterWipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userEmail"),
        month: monthNames[currentDate.getMonth()],
        income: initialIncome,
        currency: choosenCurrency,
      }),
    });
    if (!postResponse.ok) {
      throw new Error('HTTP error ' + postResponse.status);
    }
    setIncome(initialIncome);
    setIsDataFetched(false);
    setShowAreYouSureModal(false);;
    });
  };
  const handleIncomeChange: InputEvent =  (event) => {
    const newIncomeInput = event.target.value.replace(',', '.');
    const isValid = /^-?(\d+([.,]\d{0,2})?)?$/.test(newIncomeInput);
    if (isValid) {
      setIncomeInput(newIncomeInput);
    }  
  }
  const handleExchangeChange: InputEvent = (event) => {
    const newExchangeInput = event.target.value.replace(',', '.');
    const isValid = /^-?(\d+([.,]\d{0,2})?)?$/.test(newExchangeInput);
    if (isValid) {
      setExchangeAmount(newExchangeInput);
    }  
  }
  const handleIncomeSubmit: KeyboardEvent = async (event) => {
    if (event.key === 'Enter') {
      const newIncome = (Number(income) + Number(incomeInput.replace(',', '.'))).toFixed(choosenFormat);
      setIncome(newIncome);
      setIncomeInput('');

      //First a delete
      // const response = await fetch(`${backendServer}/deleteIncomesUserMonth?userId=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&month=${encodeURIComponent(monthNames[currentDate.getMonth()])}&currency=${encodeURIComponent(choosenCurrency)}`, {
      //   method: "DELETE",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // if (!response.ok) {
      //   throw new Error('HTTP error ' + response.status);
      // }

      // Here we need a PUT 
      const postResponse = await fetch(`${backendServer}/setIncomeAfterWipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userEmail"),
          month: monthNames[currentDate.getMonth()],
          income: newIncome,
          currency: choosenCurrency,
          payment: choosenPaymentMethod,
        }),
      });
      if (!postResponse.ok) {
        throw new Error('HTTP error ' + postResponse.status);
      }
      fetchData(monthNames[currentDate.getMonth()]);
    }
  }
  const handleAmountChange: InputEvent = (event)  => {
    const newValue = event.target.value.replace(',', '.');
    const isValid = /^-?(\d+([.,]\d{0,2})?)?$/.test(newValue);
    if (isValid) {
      setAmount(newValue);
    }
  }
  const handleAmountSubmit: KeyboardEvent = (event) => {
    //&& choosenCategory
    if (event.key === 'Enter' || event.key === 'Escape') {
      setShowTypes(false);
      //handleTypeClick(, );
    }
    else{
      setShowTypes(true);
    }
  }
  const handleExchangeSubmit = async (choosedCurrency:any) => {
    // A account is the currenct B account is the choosenCurrency Account.
    // fetchAllDataFromUser();
    

    
    //Fetch the data from the B account - choosenCurrency

    let incomeOfOtherAccount = 0 as number;
    //What we need to add to the B account
    if(choosedCurrency === primaryCurrency){
      incomeOfOtherAccount = Number(incomeOfPrimaryAccount);
    }
    else if(choosedCurrency === secondaryCurrency){
      incomeOfOtherAccount = Number(incomeOfSecondaryAccount);
    }
    else if(choosedCurrency === thirdCurrency){
      incomeOfOtherAccount = Number(incomeOfThirdAccount);
    }
    else{
      //("Error in the choosedCurrency");
    }

    // ("---------------------");

    // ("TO: " + choosedCurrency)
    // ("Value: " + exchangeAmount); //This will go to the income of the B account
    const newBIncom = Number(incomeOfOtherAccount)+Number(exchangeAmount); //This will be the new income of the B account
    // ("New Income " + newBIncom + " to " + choosedCurrency);
    
    // ("---------------------");
    
    //What we need to remove (Insert into DB) from the A account
    // ("FROM: " + choosenCurrency)
    const currentAmount = Number(amount);
    // ("Amount got exchanged: " + currentAmount); //This should be set to the Exchange amount id 17
    const newAIncome = Number(income)-Number(currentAmount); //This should be the new income of the A account
    // ("New Income " + newAIncome + " to " + choosenCurrency);


    
    setSpendings(prevSpendings => {
      return [...prevSpendings, { id: 17, amount: currentAmount, type: 'Exchange', emoji: '🪙', position: 15 }];
    });
    exchangedRef.current?.classList.remove("d-block");
    exchangedRef.current?.classList.add("d-none");

    //Send Post method to the Server to the ChoosedCurrency - Exchange to. 
    if(choosedCurrency !== null){
      const response = await fetch(`${backendServer}/changespendings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          month: monthNames[currentDate.getMonth()],
          type_id: 17,
          income: newBIncom,
          currency: choosedCurrency,
        })
      });
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      //Send Post method to the Server from the ChoosenCurrency - Exchange from.
      const response2 = await fetch(`${backendServer}/changespendings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          month: monthNames[currentDate.getMonth()],
          type_id: 17,
          income: newAIncome,
          amount: Number(currentAmount),
          currency: choosenCurrency,
        })
      });
      if (!response2.ok) {
        throw new Error('HTTP error ' + response.status);
      }
    }
    setIncomeOfPrimaryAccount("");
    setIncomeOfSecondaryAccount("");
    setIncomeOfThirdAccount("");
    sessionStorage.clear();
    setAllSavings(prevSavings => [...prevSavings, Number(currentAmount)]);
    // setChoosedCurrency("");
    setExchangeAmount("");
    setAmount('');
    setIsDataFetched(false);
    // fetchAllDataFromUser();
  }
  const handleTypeClick: (type: string, id: number) => void = async (type, id) => {
    const currentAmount = Number(amount);
    const newIncome = Number(income)-currentAmount;
    
    setIncome(Number(income) - currentAmount);
    setSpendings(prevSpendings => {
      const existingSpendingIndex = prevSpendings.findIndex(spending => spending.type === type);
      if (existingSpendingIndex !== -1) {
        const newSpendings = [...prevSpendings];
        newSpendings[existingSpendingIndex] = {
          ...newSpendings[existingSpendingIndex],
          amount: Number((newSpendings[existingSpendingIndex].amount + currentAmount).toFixed(choosenFormat)),
          // Ensure emoji preservation
          emoji: newSpendings[existingSpendingIndex].emoji,
          position: newSpendings[existingSpendingIndex].position
        };
        return newSpendings;
      } else {
        // Retrieve emoji from initialSpendings for consistency
        const initialSpendingItem = initialSpendings.find(item => item.id === id);
        const emoji = initialSpendingItem?.emoji || ''; // Use '?.' for optional chaining
        return [...prevSpendings, { id, amount: currentAmount, type, emoji, position: id }];
      }
    });
    
    
    
    // POST request to server
    if(type === 'Savings'){
      const response = await fetch(`${backendServer}/changesavings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          month: monthNames[currentDate.getMonth()],
          income: newIncome,
          saving: Number(currentAmount),
          currency: choosenCurrency,
          payment: choosenPaymentMethod,
        })
      });
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      setAllSavings(prevSavings => [...prevSavings, Number(currentAmount)]);
      setAmount('');
    }
    else if(type === 'Exchange' && (secondaryCurrency === 'null' || secondaryCurrency === 'undefined' || secondaryCurrency === '') && dontAskAgainCurrencyAdd === "true"){
      const response = await fetch(`${backendServer}/changespendings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          type_id: id,
          month: monthNames[currentDate.getMonth()],
          income: newIncome,
          amount: Number(currentAmount),
          currency: choosenCurrency,
          payment: choosenPaymentMethod,
        })
      });
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      setAmount('');
    
      setShowTypes(false);
      setIsDataFetched(false);
    }
    else if(type === 'Exchange' && (secondaryCurrency === 'null' || secondaryCurrency === 'undefined' || secondaryCurrency === '')){
      exchangeNewRef.current?.classList.remove("d-none");
      exchangeNewRef.current?.classList.add("d-block");
    }
    else if(type === 'Exchange'){
      exchangedRef.current?.classList.remove("d-none");
      exchangedRef.current?.classList.add("d-block");
    }
    else if(type === 'Withdraw & Deposit'){
      //Send a post method to the server with choosenPayment to the other not the current as income and keep the widraw here as it is. 
      //First send a simple post method as usualy to the currenct payment method.
      const response = await fetch(`${backendServer}/changespendings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          type_id: id,
          month: monthNames[currentDate.getMonth()],
          income: newIncome,
          amount: Number(currentAmount),
          currency: choosenCurrency,
          payment: choosenPaymentMethod,
        })
      })
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      //Secondly send the post method to the other payment method with the amount as income.
      //We need to get the other payment methods income value to add to it the currentAmount. 
      let newIncomeForWithdraw = Number(otherPaymentMethodsIncome) + currentAmount;
      const response2 = await fetch(`${backendServer}/changespendings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          type_id: id,
          month: monthNames[currentDate.getMonth()],
          income: Number(newIncomeForWithdraw),
          currency: choosenCurrency,
          payment: choosenPaymentMethod === 'card' ? 'cash' : 'card',
        })
      })
      if (!response2.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      setAmount("");
    }
    else{
      const response = await fetch(`${backendServer}/changespendings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          type_id: id,
          month: monthNames[currentDate.getMonth()],
          income: newIncome,
          amount: Number(currentAmount),
          currency: choosenCurrency,
          payment: choosenPaymentMethod,
        })
      });
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      setAmount('');
    }
    setShowTypes(false);
    setIsDataFetched(false);
  }
  const handleSelectChange = (event: { target: { value: any; }; }) => {
      setChoosenMonth(event.target.value);
      // fetchData(event.target.value);
  };
  const handleDeleteData = () => {
    setShowAreYouSureModal(true);
    setShowSettingsModal(false);
    setConfirmFunction(() => async () => {
      try {
        const response = await fetch(`${backendServer}/deleteAllData?userId=${encodeURIComponent(localStorage.getItem("userEmail") || "")}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        ('Data deleted!'); // Replace with appropriate success handling
        setShowSettingsModal(false);
        setShowAreYouSureModal(false);
        fetchData(monthNames[currentDate.getMonth()]);
      } catch (error) {
        console.error('Error deleting data:', error); // Handle errors appropriately
      }
    });
  };
  const handleDeleteProfile = () => {
    setShowAreYouSureModal(true);
    setShowSettingsModal(false);
    setDontAskAgainCurrencyAdd("false")
    localStorage.removeItem("dontAskAgainCurrencyAdd");
    setConfirmFunction(() => async () => {
      try {
        const response1 = await fetch(`${backendServer}/deleteAllData?userId=${encodeURIComponent(localStorage.getItem("userEmail") || "")}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response1.ok) {
          throw new Error('HTTP error ' + response1.status);
        }
        ('Data deleted!'); // Replace with appropriate success handling
        setShowSettingsModal(false);
        setShowAreYouSureModal(false);
        fetchData(monthNames[currentDate.getMonth()]);
        const response2 = await fetch(`${backendServer}/deleteUser?userId=${encodeURIComponent(localStorage.getItem("userEmail") || "")}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response2.ok) {
          throw new Error('HTTP error ' + response2.status);
        }
        ('Profile deleted!'); // Replace with appropriate success handling
        authContext.logOut(); // Assuming this logs out the user
      } catch (error) {
        console.error('Error deleting profile:', error); // Handle errors appropriately
      }
    });
  };
  const handleProfileShow = () => {
    if(ProfileRef.current?.classList.contains("d-none")){
      ProfileRef.current?.classList.remove("d-none");
      ProfileRef.current?.classList.add("d-block");
      CurrencyRef.current?.classList.remove("d-block");
      CurrencyRef.current?.classList.add("d-none");
    } else{
      ProfileRef.current?.classList.remove("d-block");
      ProfileRef.current?.classList.add("d-none");
    }
  };
  const handleCurrencyShow = () => {
    if(CurrencyRef.current?.classList.contains("d-none")){
      CurrencyRef.current?.classList.remove("d-none");
      CurrencyRef.current?.classList.add("d-block");
      ProfileRef.current?.classList.remove("d-block");
      ProfileRef.current?.classList.add("d-none");
    } else {
      CurrencyRef.current?.classList.remove("d-block");
      CurrencyRef.current?.classList.add("d-none");
    } 
  }
  const handleCurrencyChange: () => void = async () => {
    //Update DB Table: users. Send Post method to the Server
    setPrimaryCurrency(primaryCurrency === null ? "" : primaryCurrency);
    setSecondaryCurrency(secondaryCurrency === null ? "" : secondaryCurrency);
    setThirdCurrency(thirdCurrency === null ? "" : thirdCurrency);
    setPrimaryFormat(primaryFormat === null ? "" : primaryFormat);
    setSecondaryFormat(secondaryFormat === null ? "" : secondaryFormat);
    setThirdFormat(thirdFormat === null ? "" : thirdFormat);
    setPrimaryTag(primaryTag === null ? "" : primaryTag);
    setSecondaryTag(secondaryTag === null ? "" : secondaryTag);
    setThirdTag(thirdTag === null ? "" : thirdTag);
    localStorage.setItem("primary_name", primaryCurrency);
    localStorage.setItem("secondary_name", secondaryCurrency);
    localStorage.setItem("third_name", thirdCurrency);
    localStorage.setItem("primary_format", primaryFormat);
    localStorage.setItem("secondary_format", secondaryFormat);
    localStorage.setItem("third_format", thirdFormat);
    localStorage.setItem("primary_tag", primaryTag);
    localStorage.setItem("secondary_tag", secondaryTag);
    localStorage.setItem("third_tag", thirdTag);
    
    const response = await fetch(`${backendServer}/addPrimaryCurrency`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: localStorage.getItem('userEmail'),
        primary_name: primaryCurrency,
        primary_format: primaryFormat,
        primary_tag: primaryTag,
      })
    });
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status);
    }
    const response2 = await fetch(`${backendServer}/addSecondaryCurrency`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: localStorage.getItem('userEmail'),
        secondary_name: secondaryCurrency,
        secondary_format: secondaryFormat,
        secondary_tag: secondaryTag,
      })
    });
    if (!response.ok) {
      throw new Error('HTTP error ' + response2.status);
    }
    const response3 = await fetch(`${backendServer}/addThirdCurrency`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: localStorage.getItem('userEmail'),
        third_name: thirdCurrency,
        third_format: thirdFormat,
        third_tag: thirdTag,
      })
    });
    if (!response.ok) {
      throw new Error('HTTP error ' + response3.status);
    }
    
    setShowSettingsModal(false);
    setChoosenCurrency(primaryCurrency || secondaryCurrency || thirdCurrency);
    setChoosenFormat(getFormatNumber(primaryFormat || secondaryFormat || thirdFormat));
    setChoosenTag(primaryTag || secondaryTag || thirdTag);
    fetchData(monthNames[currentDate.getMonth()]);

  }
  const deleteCurrency: (currency: string) => void = async (currency) => {
    if(currency === "" || currency === 'null' || currency === null){
      if(warningRefEmptyDelete.current)
      {
        warningRefEmptyDelete.current.classList.remove("d-none");
        warningRefEmptyDelete.current.classList.add("d-block");
        setTimeout(() => {
          if (warningRefEmptyDelete.current) {
            warningRefEmptyDelete.current.classList.remove("d-block");
            warningRefEmptyDelete.current.classList.add("d-none");
          }
        }, 7500);
      }
    }
    else if(currency === primaryCurrency){
      setPrimaryCurrency("");
      setPrimaryFormat("");
      setPrimaryTag("");
      localStorage.removeItem("primary_name");
      localStorage.removeItem("primary_format");
      localStorage.removeItem("primary_tag");
    }
    else if(currency === secondaryCurrency){
      setSecondaryCurrency("");
      setSecondaryFormat("");
      setSecondaryTag("");
      localStorage.removeItem("secondary_name");
      localStorage.removeItem("secondary_format");
      localStorage.removeItem("secondary_tag");
    }
    else if(currency === thirdCurrency){
      setThirdCurrency("");
      setThirdFormat("");
      setThirdTag("");
      localStorage.removeItem("third_name");
      localStorage.removeItem("third_format");
      localStorage.removeItem("third_tag");
    }
  }
  const handlePrimaryCurrencyChange: InputEvent = (event) => {
    const newSecondaryCurrency = event.target.value;
    const isValid = newSecondaryCurrency === '' || /^[a-zA-Z]+$/.test(newSecondaryCurrency);
    if (isValid) {
      setPrimaryCurrency(newSecondaryCurrency);
    } 
  }
  const handlePrimaryFormatChange: InputEvent = (event) => {
    const newSecondaryFormat = event.target.value.replace(',', '.');
    const isValid = newSecondaryFormat === '' || /^(0+([.,]0{0,2})?)?$/.test(newSecondaryFormat);
    if (isValid) {
      setPrimaryFormat(newSecondaryFormat);
    } 
  }
  const handlePrimaryTagChange: InputEvent = (event) => {
    const newSecondaryTag = event.target.value;
    const isValid = newSecondaryTag === '' || /^[a-zA-Z$£€¥₹₩₽元ლ₦₫₡ƒ]+$/.test(newSecondaryTag);
    if (isValid) {
      setPrimaryTag(newSecondaryTag);
    } 
  }
  const handleSecondCurrencyChange: InputEvent = (event) => {
    const newSecondaryCurrency = event.target.value;
    const isValid = newSecondaryCurrency === '' || /^[a-zA-Z]+$/.test(newSecondaryCurrency);
    if (isValid) {
      setSecondaryCurrency(newSecondaryCurrency);
    } 
  }
  const handleSecondFormatChange: InputEvent = (event) => {
    const newSecondaryFormat = event.target.value.replace(',', '.');
    const isValid = newSecondaryFormat === '' || /^(0+([.,]0{0,2})?)?$/.test(newSecondaryFormat);
    if (isValid) {
      setSecondaryFormat(newSecondaryFormat);
    } 
  }
  const handleSecondTagChange: InputEvent = (event) => {
    const newSecondaryTag = event.target.value;
    const isValid = newSecondaryTag === '' || /^[a-zA-Z$£€¥₹₩₽元ლ₦₫₡ƒ]+$/.test(newSecondaryTag);
    if (isValid) {
      setSecondaryTag(newSecondaryTag);
    } 
  }
  const handleThirdCurrencyChange: InputEvent = (event) => {
    const newSecondaryCurrency = event.target.value;
    const isValid = newSecondaryCurrency === '' || /^[a-zA-Z]+$/.test(newSecondaryCurrency);
    if (isValid) {
      setThirdCurrency(newSecondaryCurrency);
    } 
  }
  const handleThirdFormatChange: InputEvent = (event) => {
    const newSecondaryFormat = event.target.value.replace(',', '.');
    const isValid = newSecondaryFormat === '' || /^(0+([.,]0{0,2})?)?$/.test(newSecondaryFormat);
    if (isValid) {
      setThirdFormat(newSecondaryFormat);
    } 
  }
  const handleThirdTagChange: InputEvent = (event) => {
    const newSecondaryTag = event.target.value;
    const isValid = newSecondaryTag === '' || /^[a-zA-Z$£€¥₹₩₽元ლ₦₫₡ƒ]+$/.test(newSecondaryTag);
    if (isValid) {
      setThirdTag(newSecondaryTag);
    } 
  }
  //Functions and Event handlers END


  /*  @end */

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------\\


  return (
    <section className="container-fluid">    
      {/* Navbar */}
      <nav className="navbar fixed-top mx-2">
        <div className="currency d-flex flex-row">
          <> 
            {primaryCurrency !== 'null' && 
            <div className="text-center">
              <p 
                className={choosenCurrency === primaryCurrency ? 'activeCurrency' : ''} 
                key={primaryCurrency} 
                onClick={() => {
                  setChoosenCurrency(primaryCurrency); 
                  setChoosenFormat(getFormatNumber(primaryFormat)); 
                  setChoosenTag(primaryTag);
                  setChoosenPaymentMethod("card");
                }}>
                  {primaryCurrency}
                </p>
            </div>
            }
            {secondaryCurrency !== 'null' &&
              <div className="text-center">
                <p className={choosenCurrency === secondaryCurrency ? 'activeCurrency' : '' } key={secondaryCurrency} onClick={() => {setChoosenCurrency(secondaryCurrency); setChoosenFormat(getFormatNumber(secondaryFormat)); setChoosenTag(secondaryTag); setChoosenPaymentMethod("card");}}>{secondaryCurrency}</p>
              </div> 
            }
            {thirdCurrency !== 'null' && 
              <div className="text-center">
                <p className={choosenCurrency === thirdCurrency ? 'activeCurrency' : ''} key={thirdCurrency} onClick={() => {setChoosenCurrency(thirdCurrency); setChoosenFormat(getFormatNumber(thirdFormat)); setChoosenTag(thirdTag); setChoosenPaymentMethod("card");}}>{thirdCurrency}</p>
              </div>
            }
          </>
        </div>
        {/* Settings Icon */}
        <div className="user d-flex flex-row gap-2" >
          <Dropdown className="dropdown" title="Settings">
            <Dropdown.Toggle className="drop-toggle" variant="" id="dropdown-menu">
              <i className="bi bi-gear-fill"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Link className="drop-item dropdown-item" to="/whatisnew">What is New?</Link>
              <Dropdown.Item className="drop-item" onClick={() => setShowSettingsModal(true)}>Settings</Dropdown.Item>
              <Dropdown.Item className="drop-item" onClick={() => {authContext.logOut(); setChoosenCurrency(""); setChoosenFormat(0.00); setChoosenTag("")}}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        
        </div> 
        {/* Settings */}
        <Modal className="modal-xl" show={showSettingsModal} onHide={() => setShowSettingsModal(false)}>
          <Modal.Header className="modal-header">
            <Modal.Title>Settings</Modal.Title>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowSettingsModal(false)}></button>
          </Modal.Header>
          <Modal.Body className="modal-body d-flex flex-column flex-lg-row px-3 py-3 px-lg-5 py-lg-5 gap-1 gap-lg-5">
             <aside className="menu d-flex flex-row gap-3 gap-md-0 flex-lg-column col-12 col-lg-2">
              <p onClick={handleProfileShow}>Profile</p>
              <p onClick={handleCurrencyShow}>Currency</p>
            </aside> 
            {/* Change it back to 8 from md */}
            <div className="col-12 col-lg-9">
              <div className="d-block" ref={ProfileRef}>
                <div className="text-center">
                  <img id="ProfilePIC" src={localStorage.getItem("userPhoto") || ''} alt="" />
                  <p className="name">{localStorage.getItem("userName")}</p>
                </div>
                <div className="text-center">
                  <div className="my-3 py-3">
                    {isCurrentMonth && (
                      <p className="pointer" onClick={resetSpendings}>Reset Monthly Spending</p>     
                    )}
                  </div>
                  <hr />
                  <div className="my-3 my-lg-5 info">
                    <p>
                      <span>Warning:</span> This button will permanently erase all your data. This includes information from all previous months and the current month, with the exception of your login credentials. This action cannot be undone. Please confirm only if you intend to wipe out all your data except your login details.
                    </p>
                    <button onClick={handleDeleteData}>Delete Data</button>
                  </div>
                  <div className="my-3 my-lg-5 info">
                    <p>
                      <span>Warning:</span> This button will permanently erase your profile. This action cannot be undone. Please confirm only if you intend to delete your profile and all associated data permanently.
                    </p>
                    <button onClick={handleDeleteProfile} className="button-secondary">
                      Delete Profile
                    </button>
                  </div>
                </div>
              </div>
              <div className="d-none" ref={CurrencyRef}>
                <div className="d-flex flex-column justify-content-center align-items-md-start gap-2">
                    <div className="d-flex flex-row align-items-center gap-3">
                      <span>1.</span> 
                      <div className="simpleInputs py-1 px-1 col-11 col-md-7 col-lg-8 col-xl-12 d-flex flex-row gap-3 justify-content-center">
                        <input id={primaryCurrency} value={primaryCurrency !== 'null' ? primaryCurrency : ''} onChange={handlePrimaryCurrencyChange}  placeholder="EUR" className="currencyName currencyInput" type="text" /> 
                        <input id={primaryFormat} value={primaryFormat !== 'null' ? primaryFormat : ''} onChange={handlePrimaryFormatChange} placeholder="0.00" className="currencyFormat currencyInput"  type="text" /> 
                        <input id={primaryTag} value={primaryTag !== 'null' ? primaryTag : ''} onChange={handlePrimaryTagChange} placeholder="€" className="currencyTag currencyInput"  type="text" />
                        <i className="btn-bin bi bi-trash-fill" onClick={() => {
                          if ((secondaryCurrency && secondaryCurrency !== 'null') || (thirdCurrency && thirdCurrency !== 'null')) {
                            deleteCurrency(primaryCurrency);
                            if (warningRefPrimaryDelete.current) {
                              warningRefPrimaryDelete.current.classList.remove('d-flex'); 
                              warningRefPrimaryDelete.current.classList.add('d-none'); 
                            }
                          } else {
                            if (warningRefPrimaryDelete.current) {
                              warningRefPrimaryDelete.current.classList.remove('d-none'); 
                              warningRefPrimaryDelete.current.classList.add('d-flex'); 
                            }
                            setTimeout(() => {
                              if (warningRefPrimaryDelete.current) {
                                warningRefPrimaryDelete.current.classList.remove('d-flex'); 
                                warningRefPrimaryDelete.current.classList.add('d-none');
                              }
                            }, 25000);
                          }
                          }}>
                        </i>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <span>2.</span> 
                      <div className="simpleInputs py-1 px-1 col-11 col-md-7 col-lg-8 col-xl-12 d-flex flex-row gap-3 justify-content-center">
                        <input id={secondaryCurrency}
                         value={secondaryCurrency !== 'null' ? secondaryCurrency : ''} 
                         onChange={handleSecondCurrencyChange} placeholder="EUR" className="currencyName currencyInput" type="text" /> 
                        <input 
                        id={secondaryFormat}
                        value={secondaryFormat !== 'null' ? secondaryFormat : ''} 
                        onChange={handleSecondFormatChange} placeholder="0.00" className="currencyFormat currencyInput"  type="text" /> 
                        <input 
                        id={secondaryTag}
                        value={secondaryTag !== 'null' ? secondaryTag : ''} 
                        onChange={handleSecondTagChange} placeholder="€" className="currencyTag currencyInput"  type="text" />
                        <i className="btn-bin bi bi-trash-fill" onClick={() => {
                          if ((primaryCurrency && primaryCurrency !== 'null') || (thirdCurrency && thirdCurrency !== 'null')) {
                            deleteCurrency(secondaryCurrency);
                            if (warningRefPrimaryDelete.current) {
                              warningRefPrimaryDelete.current.classList.remove('d-flex'); 
                              warningRefPrimaryDelete.current.classList.add('d-none'); 
                            }
                          } else {
                            if (warningRefPrimaryDelete.current) {
                              warningRefPrimaryDelete.current.classList.remove('d-none'); 
                              warningRefPrimaryDelete.current.classList.add('d-flex'); 
                            }
                            setTimeout(() => {
                              if (warningRefPrimaryDelete.current) {
                                warningRefPrimaryDelete.current.classList.remove('d-flex'); 
                                warningRefPrimaryDelete.current.classList.add('d-none');
                              }
                            }, 25000);
                          }
                          }}>
                        </i>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3">
                      <span>3.</span> 
                      <div className="simpleInputs py-1 px-1 col-11 col-md-7 col-lg-8 col-xl-12 d-flex flex-row gap-3 justify-content-center">
                        <input id={thirdCurrency} value={thirdCurrency !== 'null' ? thirdCurrency : ''} onChange={handleThirdCurrencyChange} placeholder="EUR" className="currencyName currencyInput" type="text" /> 
                        <input id={thirdFormat} value={thirdFormat !== 'null' ? thirdFormat : ''} onChange={handleThirdFormatChange} placeholder="0.00" className="currencyFormat currencyInput"  type="text" /> 
                        <input id={thirdTag} value={thirdTag !== 'null' ? thirdTag : ''} onChange={handleThirdTagChange} placeholder="€" className="currencyTag currencyInput"  type="text" />
                        <i className="btn-bin bi bi-trash-fill" onClick={() => {
                          if ((secondaryCurrency && secondaryCurrency !== 'null') || (primaryCurrency && primaryCurrency !== 'null')) {
                            deleteCurrency(thirdCurrency);
                            if (warningRefPrimaryDelete.current) {
                              warningRefPrimaryDelete.current.classList.remove('d-flex'); 
                              warningRefPrimaryDelete.current.classList.add('d-none'); 
                            }
                          } else {
                            if (warningRefPrimaryDelete.current) {
                              warningRefPrimaryDelete.current.classList.remove('d-none'); 
                              warningRefPrimaryDelete.current.classList.add('d-flex'); 
                            }
                            setTimeout(() => {
                              if (warningRefPrimaryDelete.current) {
                                warningRefPrimaryDelete.current.classList.remove('d-flex'); 
                                warningRefPrimaryDelete.current.classList.add('d-none');
                              }
                            }, 25000);
                          }
                          }}>
                        </i>
                      </div>
                    </div>
                </div>
                <div className="info warning">
                  <p className="d-none flex-column text-center col-12 mt-5" ref={warningRefPrimaryDelete}>
                  <span>Action Required:</span><br />
                    To maintain a functional currency system, at least one currency must be designated as the primary currency. <br />
                    Currently, the action to remove the existing primary currency cannot be completed because it necessitates the presence of an alternative currency to take over as the new primary currency. <br />
                    Please designate a secondary or tertiary currency as the new primary currency before proceeding with the removal of the current primary currency.
                  </p>
                  <p className="d-none flex-column text-center col-12 mt-5" ref={warningRefEmptyDelete}>
                  <span>Whoops!</span><br />
                    The Currency Profile is Empty: You can't delete an empty currency profile. 
                  </p>
                </div>
                <div className="info d-flex flex-column justify-content-center align-items-center">
                  <p className="mt-4 text-center">Click on any of the symbols below to copy it to your clipboard.</p>
                  <div className="copyItems text-center">
                    <ul className="d-flex justify-content-center align-items-center flex-wrap gap-1 gap-md-2 px-2 px-md-4 pt-3"> 
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
                  <button className="mt-5 col-3 col-md-2" onClick={handleCurrencyChange}>Save</button>           
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {/* Are you sure Modal */}
        <Modal className="modal" show={showAreYouSureModal} onHide={() => setShowAreYouSureModal(false)} >
          <Modal.Header>
            <Modal.Title>Are you sure?</Modal.Title>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowAreYouSureModal(false)}></button>
          </Modal.Header>
          <Modal.Body className="py-5 text-center d-flex align-items-center gap-4 justify-content-center">
            <span className="pointer" onClick={() => { setShowAreYouSureModal(false); setShowSettingsModal(true)}}>Cancel</span>
            {confirmFunction && (
              <button type="button" className="button-secondary" onClick={() => confirmFunction()}>
                Yes
              </button>
            )}
          </Modal.Body>
        </Modal>
      </nav>
      
      {/* Header - Month & Income */}
      <header className="mt-5 pt-5">
        <h4 onClick={() => setChoosenPaymentMethod(choosenPaymentMethod === "cash" ? "card" : "cash")} className="text-center mb-2 mb-lg-5 pointer">{choosenPaymentMethod.toUpperCase()}</h4>
        
        {/* Month */}
        <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-evenly">
          <h5 className="text-center my-3 my-md-0 d-flex flex-column flex-md-row align-items-center">
          {uniqueMonths.length > 0 ? (
            <select className="month" onChange={handleSelectChange} defaultValue={monthNames[currentDate.getMonth()]}>
              {uniqueMonths.filter(month => month !== 'initial').map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
            ) : (
              <span className="month">{monthNames[currentDate.getMonth()]}</span> 
            )}
            {isCurrentMonth && (
                <>
                {" "} - <a className="pointer" onClick={resetSpendings}>Reset Monthly Spending</a>
                </>
            )}
          </h5>

          {/* Income */}
          <h5 className="text-center my-3 my-md-0 d-flex flex-column flex-md-row align-items-center"> 
          <span className="income mx-3 mx-md-1">
            {isLoading ? (
              <div className="loader"></div>
            ) : (
              <>
                {income ? (
                  Number(income).toFixed(choosenFormat) + "" + choosenTag
                ) : (
                  Number(income) + "" + choosenTag
                )}
              </>
            )} 
            </span>
            {isCurrentMonth && (
              <div className="d-flex align-items-center gap-1">
                <input
                  className="mx-md-1 my-2"
                  value={incomeInput}
                  onChange={handleIncomeChange}
                  onKeyDown={handleIncomeSubmit}
                  type="text"
                  placeholder="income"
                />
                <span>{choosenTag}</span>
              </div>
            )}
          </h5>
        </div>
      </header>

      {/* Spent */}
      <section className="d-flex justify-content-center align-items-center mt-5 flex-column">
        <h3 className="mb-4 mb-md-2">
        {isCurrentMonth && (
          <>
            <input value={amount} onChange={handleAmountChange} onKeyDown={handleAmountSubmit} type="text" placeholder="spent"className="mx-2"/> 
            <span>{choosenTag}</span>
          </>
        )}
        </h3>
        <span className="mt-3 mt-md-5 mb-4 mb-md-2 d-none d-flex flex-column justify-content-center align-items-center text-center" ref={exchangeNewRef}>
          It looks like you haven't added a secondary currency yet. <br /> We can help you set it up!
          <div className="d-flex gap-2 mt-2">
            <button onClick={() => {setShowSettingsModal(true); setTimeout(() => {
              handleCurrencyShow();
              setAmount('');
              exchangeNewRef.current?.classList.remove("d-block");
              exchangeNewRef.current?.classList.add("d-none");
            }, 400);}}>Yes</button>
            <button className="button-secondary" onClick={() => {setDontAskAgainCurrencyAdd("true"); exchangeNewRef.current?.classList.remove("d-block"); exchangeNewRef.current?.classList.add("d-none"); setShowTypes(true); localStorage.setItem("dontAskAgainCurrencyAdd", "true");}}>No</button>
          </div>
        </span>
        <h3 className="mt-3 mt-md-5 mb-4 mb-md-2 d-none d-flex flex-column justify-content-center align-items-center" ref={exchangedRef}>
          <input type="text" value={exchangeAmount} onChange={handleExchangeChange} placeholder="Exchanged Value" />
          <div className="currency d-flex flex-row gap-2 my-2 my-lg-3">
          {primaryCurrency !== 'null' && (
            <> 
              {choosenCurrency !== primaryCurrency &&  <button onClick={() => {handleExchangeSubmit(primaryCurrency)}}>{primaryCurrency}</button>}
              {choosenCurrency !== secondaryCurrency && secondaryCurrency !== 'null' && <button onClick={() => {handleExchangeSubmit(secondaryCurrency)}}>{secondaryCurrency}</button>}
              {choosenCurrency !== thirdCurrency && thirdCurrency !== 'null' && <button onClick={() => {handleExchangeSubmit(thirdCurrency)}}>{thirdCurrency}</button>}
            </>
          )}
        </div>
        </h3>
      </section>
      

      {/* Types, Categories */} 
      <section className="d-flex justify-content-center">
        <div className="col-12 col-md-10 col-lg-10 col-xl-8 col-xxl-6">
          {showTypes && (
            <div className="text-center">
              {initialSpendings.sort((a, b) => a.position - b.position).map((spending) => (
                <button className="button-secondary p-3 m-1" key={spending.position} onClick={() => handleTypeClick(spending.type, spending.id)}>
                  <span className="d-block d-xl-none">{spending.emoji+" "+spending.type}</span>
                  <p className="d-none d-xl-block">{spending.emoji+" "+spending.type}</p>
                </button>
              ))}
            </div>
          )}  
        </div>
      </section>

      {/* Spendings */}
      <section className="mt-md-5 my-1 mb-5 pb-5 d-flex justify-content-center">
        <div className="col-12 col-md-10 col-lg-10 col-xl-8 col-xxl-6 box-ui p-md-5">
          <div className="row justify-content-evenly">
            {spendings.sort((a, b) => a.position - b.position).map((spending, index) => (
              <div className="col-6 col-md-4 col-lg-2 my-2 text-center" key={index}>
                <h1>{spending.emoji}</h1>
                <span>{spending.type}</span>
                <h2>{Number(spending.amount || 0).toFixed(choosenFormat)}{choosenTag}</h2>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr />

      {/* Log */}
      <section className="row mt-lg-5 my-1 mb-5 pb-5 d-flex justify-content-center">
        <div className="col-12 col-md-10 col-lg-10 col-xl-8 col-xxl-6"> 
          <h2 className="text-center mb-5">Previous Entries</h2>
          <table style={tableStyle} className="col-11 col-md-8 col-lg-6 table table-hover">
            <thead>
              <tr>
                <th style={tableHeaderStyle} scope="col">Income After</th>
                <th style={tableHeaderStyle} scope="col">Category</th>
                <th style={tableHeaderStyle} scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
            {logEntries.slice().reverse().map((entry, index) => (
              <tr key={index}>
                  <th style={tableBodyStyle}>{Number(entry.income).toFixed(choosenFormat)}{choosenTag}</th>
                  <th style={tableBodyStyle}>{entry.emoji +' '+ entry.type}</th>
                  <th style={tableBodyStyle}>{Number(entry.amount || 0).toFixed(choosenFormat)}{choosenTag}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>


      {/* Footer */}
      <footer className="fixed-bottom d-flex justify-content-center gap-5 py-3 alig">
        <h5 className="text-center">
          <span>Spent this month: {Number(totalSpent).toFixed(choosenFormat)}{choosenTag}</span>  
        </h5>
        <h5 className="text-center">
          <span>Total savings: {Number(totalSavings).toFixed(choosenFormat)}{choosenTag}</span>
        </h5>
      </footer>
    </section>
  )
}

export default App

