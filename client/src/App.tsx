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
    {id: 15, position: 14, amount: 0, type: 'Withdraw', emoji: '💶'},
    {id: 16, position: 16, amount: 0, type: 'Savings', emoji: '🔐'},
    {id: 17, position: 15, amount: 0, type: 'Exchange', emoji: '🪙'}
    ];
  const [spendings, setSpendings] = useState<Spending[]>(initialSpendings);
  const [logEntries, setLogEntries] = useState<Log[]>([]);
  const primaryCurrency = localStorage.getItem("primary_name") ?? ""; 
  const secondaryCurrency = localStorage.getItem("secondary_name") ?? "";
  const thirdCurrency = localStorage.getItem("third_name") ?? "";
  const primaryFormat = localStorage.getItem("primary_format") ?? "";
  const secondaryFormat = localStorage.getItem("secondary_format") ?? "";
  const thirdFormat = localStorage.getItem("third_format") ?? "";
  const primaryTag = localStorage.getItem("primary_tag") ?? "";
  const secondaryTag = localStorage.getItem("secondary_tag") ?? "";
  const thirdTag = localStorage.getItem("third_tag") ?? "";
  const [choosenCurrency, setChoosenCurrency] = useState<string>(primaryCurrency);
  const [choosenFormat, setChoosenFormat] = useState<number>(getFormatNumber(primaryFormat));
  const [choosenTag, setChoosenTag] = useState<string>(primaryTag);
  const [newCurrencyName ,setNewCurrencyName] = useState<string>("");
  const [newCurrencyFormat ,setNewCurrencyFormat] = useState<string>("");
  const [newCurrencyTag ,setNewCurrencyTag] = useState<string>("");
  const [exchangeAmount, setExchangeAmount] = useState<string>("");
  // const [choosedCurrency, setChoosedCurrency] = useState<string>("");
  const [incomeOfPrimaryAccount, setIncomeOfPrimaryAccount] = useState<string>("");
  const [incomeOfSecondaryAccount, setIncomeOfSecondaryAccount] = useState<string>("");
  const [incomeOfThirdAccount, setIncomeOfThirdAccount] = useState<string>("");
  const [initialIncome, setInitialIncome] = useState<number>(0);
  // const [exchangeDifference, setExchangeDifference] = useState<number>(0);

  const errorModalCurrency = useRef<HTMLDivElement>(null);
  const exchangedRef = useRef<HTMLDivElement>(null);

  function getFormatNumber(formatString: string): number {
    const decimalMatch = formatString.match(/^\$?\d{1,3}(?:,\d{3})*(?:\.\d+)?$/); // Extract decimal part
    if (decimalMatch) {
      const decimalPlaces = decimalMatch[0].split('.')[1]?.length || 0; // Get decimal places
      return decimalPlaces;
    } else {
      // Handle invalid formats (optional)
      console.warn(`Invalid format: ${formatString}. Defaulting to 2.`);
      return 2;  // Or return another default value
    }
  }
  const filterByCurrency = (data: any[], chosenCurrency: string) => {
    return data.filter(item => item.currency === chosenCurrency);
  };

  //Conditional Rendering
  const [isDataFetched, setIsDataFetched] = useState(false); 
  const [showTypes, setShowTypes] = useState<boolean>(false);
  const [showAddCurrencyModal, setShowAddCurrencyModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);  


  // Months Related
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  const currentDate = new Date();
  const [choosenMonth, setChoosenMonth] = useState(monthNames[currentDate.getMonth()])
  const [uniqueMonths, setUniqueMonths] = useState<string[]>([]);
  const isCurrentMonth = choosenMonth === monthNames[new Date().getMonth()];

  // Styles
  const tableHeader = {backgroundColor: '#424769', color: '#f9b17a', fontWeight: '1000'};
  const table = {backgroundColor: '#676f9d', color: 'white', borderColor: '#525252', fontWeight: '400'};
  const radius = {width: "90%", margin: "auto"};
  //Inital Values END



  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------\\

  


  //Fetching the Data from the DB START
  //Fetch Data based on User and currentMonth
  const fetchData = async (choosenMonth: string | number | boolean) => {
    const response = await fetch(`${backendServer}/getspendingsUserMonth?user_id=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&month=${encodeURIComponent(choosenMonth)}&currency=${encodeURIComponent(choosenCurrency)}`, {
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
    const userRows = fetchedData.filter(row => row.user_email === localStorage.getItem('userEmail') && row.month === choosenMonth)
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
      setIncome(userRows[userRows.length - 1].income);
    } else {
      setIncome(0);
    }
    setSpendings(mergedData);
    // setExchangeDifference(0);

    // const exchangeEntries = filteredData.filter(row => row.user_email === localStorage.getItem('userEmail') && row.month === choosenMonth && row.currency === choosenCurrency && row.type_id === 17); // Focus on no amount exchanges
    // let exchangeSumNotNull = exchangeEntries.reduce((sum, entry) => sum + (entry.type_id === 17 && entry.amount !== null  ? Number(entry.amount) : 0), 0);
    
    // let exchangeSumNull = exchangeEntries.reduce((sum, entry) => sum + (entry.type_id === 17 && entry.amount === null ? Number(entry.income) : 0), 0);

    // // console.log("Initial Income Entry (" + choosenCurrency + "):", initialIncomeEntry);
    // console.log("Initial Income (" + choosenCurrency + "):", initialIncome);
    // console.log("Exchange Entries (" + choosenCurrency + "):", exchangeEntries);
    // console.log("Exchange Sum Not Null (" + choosenCurrency + "):", exchangeSumNotNull);
    // console.log("Exchange Sum Null (" + choosenCurrency + "):", exchangeSumNull);

    

    // let exchangeDifferenceLocal = 0;

    // //if exchangeSumNotNull set exchangeDifference to exchangeSumNotNull
    // //if exchangeSumNull calculate the difference between exchangeSumNotNull and initialIncome, then set exchangeDifference to that value.
    // //if exchangeSumNotNull and exchangeSumNull is 0, set exchangeDifference to 0.

    // if(exchangeSumNotNull === 0){
    //   exchangeDifferenceLocal = Number(exchangeSumNull) -  Number(initialIncome);
    // } else if(exchangeSumNotNull !== 0 && exchangeSumNull !== 0){
    //   if(exchangeSumNull > initialIncome){
    //     exchangeDifferenceLocal =  Number(exchangeSumNotNull);
    //   }
    //   else{
    //     exchangeDifferenceLocal = Number(exchangeSumNull) - Number(initialIncome);
    //   }
    //   // exchangeDifferenceLocal = Number(exchangeSumNull) -  Number(initialIncome);
    // }else if(exchangeSumNotNull !== 0 && exchangeSumNull === 0){
    //   exchangeDifferenceLocal = Number(exchangeSumNotNull);
    // }else if(exchangeSumNull !== 0){
    //   exchangeDifferenceLocal = Number(exchangeSumNull) - Number(initialIncome);
    // } else if(exchangeSumNotNull === 0 && exchangeSumNull === 0){
    //   exchangeDifferenceLocal = 0;
    // }




    

    
    

    // console.log("Exchange Difference (" + choosenCurrency + "):", exchangeDifferenceLocal*-1);
    // setExchangeDifference(exchangeDifferenceLocal*-1);

    

    
    
    
    
    
    // exchangeDifferenceLocal = 0;
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

    const currentMonth = monthNames[new Date().getMonth()];
    let uniqueMonthsFromData = [...new Set(fetchedData.map(item => item.month))] as string[];

    if (!uniqueMonthsFromData.includes(currentMonth)) {
      uniqueMonthsFromData = [...uniqueMonthsFromData, currentMonth];
    }
    setUniqueMonths(uniqueMonthsFromData);

    const filteredData = filterByCurrency(fetchedData, choosenCurrency);

    const initialIncomeEntry = filteredData.find(row => row.user_email === localStorage.getItem('userEmail') && row.month === choosenMonth && row.currency === choosenCurrency && row.type_id === null);
    setInitialIncome(initialIncomeEntry ? initialIncomeEntry.income : 0);

    // Sort the fetched data by month in ascending order
    fetchedData.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    // Filter data for the user
    const userData = fetchedData.filter(row => row.user_email === localStorage.getItem('userEmail'));

    userData.sort((a, b) => b.id - a.id); // Sort by ID in descending order (highest ID first)

    for (const row of userData.reverse()) {
      if (row.currency === primaryCurrency) {
        setIncomeOfPrimaryAccount(row.income.toString()); // Update state with income value
      } else if (row.currency === secondaryCurrency) {
        setIncomeOfSecondaryAccount(row.income.toString()); // Update state with income value
      } else if (row.currency === thirdCurrency) {
        setIncomeOfThirdAccount(row.income.toString()); // Update state with income value
      }
    }
    // const primaryCurrencyRow = userData.find(row => row.currency === primaryCurrency);
    // const secondaryCurrencyRow = userData.find(row => row.currency === secondaryCurrency);
    // const thirdCurrencyRow = userData.find(row => row.currency === thirdCurrency);

    // // Update state variables with income values (or "0" if no row found)
    // setIncomeOfPrimaryAccount(primaryCurrencyRow ? primaryCurrencyRow.income.toString() : "0");
    // setIncomeOfSecondaryAccount(secondaryCurrencyRow ? secondaryCurrencyRow.income.toString() : "0");
    // setIncomeOfThirdAccount(thirdCurrencyRow ? thirdCurrencyRow.income.toString() : "0");



    // Sort the fetched data by month in ascending order
    fetchedData.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    const lastMonthData = filteredData.filter(row => row.user_email === localStorage.getItem('userEmail') && row.month === monthNames[new Date().getMonth() - 1]);
    const currentMonthData = filteredData.filter(row => row.user_email === localStorage.getItem('userEmail') && row.month === monthNames[new Date().getMonth()]);
    const lastMonthIncome = lastMonthData[lastMonthData.length - 1];
    const currentMonthIncome = currentMonthData[currentMonthData.length - 1];
    if(!lastMonthIncome && !currentMonthIncome){
      setIncome(0);
    }
    if (lastMonthIncome && currentMonthIncome) {
      setIncome(currentMonthIncome.income);
    } 
    if(!currentMonthIncome && lastMonthIncome){
      setIncome(lastMonthIncome.income);
    }
    if(currentMonthIncome && !lastMonthIncome){
      setIncome(currentMonthIncome.income);
    }

    const savingsData = filteredData.map(item => Number(item.saving));
    setAllSavings(savingsData);
  }
  //Fetching the Data from the DB END

  useEffect(() => {  
    fetchData(monthNames[currentDate.getMonth()]);
    fetchAllDataFromUser();
  }, [isDataFetched, choosenCurrency]);
  


  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------\\


  //Calculations START
  useEffect(() => {
    //console.log(allSavings);
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
  const resetSpendings: () => void = async () => {
    if(!window.confirm("Are you sure you want to delete everything from the current period?")){
      return;
    }

    
    
    // // Sum up the amounts in spendings and add it to income

    // // console.log("Income: " + income);
    // // console.log("Exchange Difference: " + exchangeDifference);
    // const totalSpending = spendings.reduce((total, spending) => {
    //   if (spending.type === 'Exchange') {
    //     console.log("Found spending with Exchange type:", spending);
    //     return Number(total - spending.amount);
    //   }
    //   if (spending.type !== 'Exchange' && spending.amount !== 0) {
    //     console.log("Found spending without Exchange type:", spending);
    //     return Number(total + spending.amount);
    //   }
    //   return total;
    // }, 0);
    // //Correct
    // console.log("Total Spending: " + totalSpending);

    // //If (exchangDifference !== 0) then add the exchangeDifference to the totalSpending + income
    // //if (exchangDifference === 0) then income + total Spending.

    // let newIncome = 0;
    // if(exchangeDifference !== 0){
    //   newIncome = Number(income) + totalSpending + exchangeDifference;
    // }
    // else{
    //   newIncome = Number(income) + totalSpending;
    // }
    
    // console.log("New Income: " + newIncome);
    // // let newIncome = Number(income) + totalSpending;
    // // console.log("New Income: " + newIncome);
    

    
    // // console.log(newIncome);
    // setIncome(newIncome);
    
    

    // console.log("New Income: " + newIncome);
  
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
    // setExchangeDifference(0);
    // newIncome = 0;
  }
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
    if (event.key === 'Enter') {
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
      //console.log("Error in the choosedCurrency");
    }

    // console.log("---------------------");

    // console.log("TO: " + choosedCurrency)
    // console.log("Value: " + exchangeAmount); //This will go to the income of the B account
    const newBIncom = Number(incomeOfOtherAccount)+Number(exchangeAmount); //This will be the new income of the B account
    // console.log("New Income " + newBIncom + " to " + choosedCurrency);
    
    // console.log("---------------------");
    
    //What we need to remove (Insert into DB) from the A account
    // console.log("FROM: " + choosenCurrency)
    const currentAmount = Number(amount);
    // console.log("Amount got exchanged: " + currentAmount); //This should be set to the Exchange amount id 17
    const newAIncome = Number(income)-Number(currentAmount); //This should be the new income of the A account
    // console.log("New Income " + newAIncome + " to " + choosenCurrency);


    
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
        })
      });
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      setAllSavings(prevSavings => [...prevSavings, Number(currentAmount)]);
      setAmount('');
    }
    else if(type === 'Exchange'){
      exchangedRef.current?.classList.remove("d-none");
      exchangedRef.current?.classList.add("d-block");
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
      fetchData(event.target.value);
  };
  const handleAddCurrency: () => void = async () => {
    // Add new currency to the list
    if(newCurrencyName && newCurrencyFormat && newCurrencyTag){
        if(secondaryCurrency === 'null'){
          localStorage.setItem("secondary_name", newCurrencyName);
          localStorage.setItem("secondary_format", newCurrencyFormat);
          localStorage.setItem("secondary_tag", newCurrencyTag);
          setChoosenCurrency(newCurrencyName);
          setChoosenFormat(getFormatNumber(newCurrencyFormat));
          setChoosenTag(newCurrencyTag);

          const response = await fetch(`${backendServer}/addSecondaryCurrency`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: localStorage.getItem('userEmail'),
              secondary_name: newCurrencyName,
              secondary_format: newCurrencyFormat,
              secondary_tag: newCurrencyTag,
            })
          });
          if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
          }
        }
        if(thirdCurrency === 'null'){
          localStorage.setItem("third_name", newCurrencyName);
          localStorage.setItem("third_format", newCurrencyFormat);
          localStorage.setItem("third_tag", newCurrencyTag);
          setChoosenCurrency(newCurrencyName);
          setChoosenFormat(getFormatNumber(newCurrencyFormat));
          setChoosenTag(newCurrencyTag);

          const response = await fetch(`${backendServer}/addThirdCurrency`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: localStorage.getItem('userEmail'),
              third_name: newCurrencyName,
              third_format: newCurrencyFormat,
              third_tag: newCurrencyTag,
            })
          });
          if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
          }
        }
      
      setShowAddCurrencyModal(false);
    }
    else{
      errorModalCurrency.current?.classList.remove("d-none");
      errorModalCurrency.current?.classList.add("d-block");
    }
  }
  //Functions and Event handlers END


  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------\\


  return (
    <section className="container-fluid">  
    {/* Navbar */}
    <nav className="navbar fixed-top mx-2">
      <div className="currency d-flex flex-row gap-2">
      {primaryCurrency !== 'null' && (
          <> 
            <p key={primaryCurrency} onClick={() => {setChoosenCurrency(primaryCurrency); setChoosenFormat(getFormatNumber(primaryFormat)); setChoosenTag(primaryTag)}}>{primaryCurrency}</p>
            {secondaryCurrency !== 'null' && <p key={secondaryCurrency} onClick={() => {setChoosenCurrency(secondaryCurrency); setChoosenFormat(getFormatNumber(secondaryFormat)); setChoosenTag(secondaryTag)}}>{secondaryCurrency}</p>}
            {thirdCurrency !== 'null' && <p key={thirdCurrency} onClick={() => {setChoosenCurrency(thirdCurrency); setChoosenFormat(getFormatNumber(thirdFormat)); setChoosenTag(thirdTag)}}>{thirdCurrency}</p>}
            {thirdCurrency === 'null' && <span key={"+"} className="" onClick={()=> setShowAddCurrencyModal(true)}>+</span>}
          </>
        )}
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
            <Dropdown.Item className="drop-item" onClick={authContext.logOut}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {/* <p className="name">
          {localStorage.getItem("userName")}
        </p>
        <img id="ProfilePIC" src={localStorage.getItem("userPhoto") || ''} alt="" /> */}
      </div> 
      {/* Settings */}
      <Modal className="modal-lg" show={showSettingsModal} onHide={() => setShowSettingsModal(false)}>
        <Modal.Header className="header">
          <Modal.Title>Settings</Modal.Title>
          <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowSettingsModal(false)}></button>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column px-5 py-5">
          <aside className="menu">
            <p>Profile</p>
            <p>Currency</p>

          </aside>
          
          
        </Modal.Body>
      </Modal>
    </nav>
    {/* Currency Modal */}
    {showAddCurrencyModal && (
      <Modal className="modal" show={showAddCurrencyModal} onHide={() => setShowAddCurrencyModal(false)}>
        <Modal.Header className="header" >
          <Modal.Title>Add New Currency</Modal.Title>
          <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowAddCurrencyModal(false)}></button>
        </Modal.Header>
        <Modal.Body className="text-center d-flex flex-column px-5 py-5">
          
          <p className="d-none error" ref={errorModalCurrency}>Please fill out all the fields!</p>
          <input className="my-2" placeholder="Name (EUR, HUF, ...)" type="text" onChange={e => setNewCurrencyName(e.target.value)} title="Choose a clear and recognizable name for your currency profile. This name will be displayed within the app to help you easily identify the currency."/>
          <input className="my-2" placeholder="Format (0.00, 0, ...)" type="text" onChange={e => setNewCurrencyFormat(e.target.value)} title="Specify how you want numbers to be formatted within this currency profile. For example, some currencies use two decimal places (0.00), while others might not use any decimals (0)."/>
          <input className="my-2" placeholder="Tag (€, Ft, ...)" type="text"  onChange={e => setNewCurrencyTag(e.target.value)} title="Define a symbol or tag to visually represent your chosen currency. This tag will be displayed alongside the amount when viewing transactions in this currency profile."/>
          
        </Modal.Body>
        <Modal.Footer className="footer gap-3">
          <a onClick={() => setShowAddCurrencyModal(false)}>
            Close 
          </a>
          <button className="button" onClick={() => handleAddCurrency()}>
            Save
          </button>
        </Modal.Footer>
      </Modal>
    )}

    {/* Header - Month & Income */}
    <header className="d-flex flex-column flex-md-row justify-content-center justify-content-md-evenly mt-5 pt-5">
      {/* Month */}
      <h5 className="text-center">
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
            {" "} - <a onClick={resetSpendings}>Reset Monthly Spending</a>
            </>
        )}
      </h5>

      {/* Income */}
      <h5 className="text-center my-3 my-md-0 d-flex flex-column flex-md-row"> 
        <span className="income mx-3 mx-md-1">
        {income ? (
          Number(income).toFixed(choosenFormat)+""+choosenTag
        ) : (Number(income) + "" + choosenTag)}
        </span>
        {isCurrentMonth && (
          <input className="mx-5 mx-md-1" value={incomeInput} onChange={handleIncomeChange} onKeyDown={handleIncomeSubmit} type="text" placeholder="income"/>
        )}
      </h5>
    </header>

    {/* Spent */}
    <section className="d-flex justify-content-center align-items-center mt-5 flex-column">
      <h3 className="mb-4 mb-md-2">
      {isCurrentMonth && (
        <input value={amount} onChange={handleAmountChange} onKeyDown={handleAmountSubmit} type="text" placeholder="spent" />
      )}
      </h3>
      <h3 className="mt-3 mt-md-5 mb-4 mb-md-2 d-none d-flex flex-column justify-content-center align-items-center" ref={exchangedRef}>
        <input type="text" value={exchangeAmount} onChange={handleExchangeChange} placeholder="Exchanged Value" />
        <div className="currency d-flex flex-row gap-2">
        {primaryCurrency !== 'null' && (
          <> 
            {choosenCurrency !== primaryCurrency && <button onClick={() => {handleExchangeSubmit(primaryCurrency)}}>{primaryCurrency}</button>}
            {choosenCurrency !== secondaryCurrency && secondaryCurrency !== 'null' && <button onClick={() => {handleExchangeSubmit(secondaryCurrency)}}>{secondaryCurrency}</button>}
            {choosenCurrency !== thirdCurrency && thirdCurrency !== 'null' && <button onClick={() => {handleExchangeSubmit(thirdCurrency)}}>{thirdCurrency}</button>}
          </>
        )}
      </div>
      </h3>
    </section>
    

    {/* Types, Categories */}
    <section className="d-flex flex-row justify-content-evenly">
      {showTypes && (
        <div>
          {initialSpendings.sort((a, b) => a.position - b.position).map((spending) => (
            <button className="button-secondary" key={spending.position} onClick={() => handleTypeClick(spending.type, spending.id)}>
              {spending.emoji+" "+spending.type}
            </button>
          ))}
        </div>
      )}  
    </section>

    {/* Spendings */}
    <section className="mt-lg-5 my-1 mb-5 pb-5">
      <div className="row justify-content-evenly">
        {spendings.sort((a, b) => a.position - b.position).map((spending, index) => (
          <div className="col-6 col-md-4 col-lg-2 my-2 text-center" key={index}>
            <h1>{spending.emoji}</h1>
            <span>{spending.type}</span>
            <h2>{Number(spending.amount || 0).toFixed(choosenFormat)}{choosenTag}</h2>
          </div>
        ))}
      </div>
    </section>

    <hr />

    {/* Log */}
    <section className="row mt-lg-5 my-1 mb-5 pb-5">
      <h2 className="text-center mb-5">Previous Entries</h2>
      <table style={radius} className="col-11 col-md-8 col-lg-6 table table-hover">
        <thead>
          <tr>
            <th scope="col" style={tableHeader}>Income After</th>
            <th scope="col" style={tableHeader}>Category</th>
            <th scope="col" style={tableHeader}>Amount</th>
          </tr>
        </thead>
        <tbody>
        {logEntries.slice().reverse().map((entry, index) => (
            <tr key={index}>
              <th style={table}>{Number(entry.income).toFixed(choosenFormat)}{choosenTag}</th>
              <th style={table}>{entry.emoji +' '+ entry.type}</th>
              <th style={table}>{Number(entry.amount || 0).toFixed(choosenFormat)}{choosenTag}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </section>


    {/* Footer */}
    <footer className="fixed-bottom d-flex justify-content-center gap-5 py-3">
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
