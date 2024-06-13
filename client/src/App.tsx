import { useState, useEffect, useContext} from "react";
import { AuthContext } from "./components/AuthContext";
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
    {id: 1, amount: 0, type: 'Wages & Subscriptions', emoji: '💰'},
    {id: 2, amount: 0, type: 'Transport', emoji: '🚆'},
    {id: 3, amount: 0, type: 'Gas & Roads', emoji: '🚗'},
    {id: 4, amount: 0, type: 'Occupations & Travel', emoji: '🏨'},
    {id: 5, amount: 0, type: 'Health', emoji: '💊'},
    {id: 6, amount: 0, type: 'Shopping', emoji: '🛍️'},
    {id: 7, amount: 0, type: 'Food & Delivery', emoji: '🍔'},
    {id: 8, amount: 0, type: 'Clothes', emoji: '👕'},
    {id: 9, amount: 0, type: 'Education', emoji: '🎓'},
    {id: 10, amount: 0, type: 'Fun & Games', emoji: '🎮'},
    {id: 11, amount: 0, type: 'Technologies', emoji: '🖥️'},
    {id: 12, amount: 0, type: 'Missing & Error', emoji: '❌'},
    {id: 13, amount: 0, type: 'Donation', emoji: '🎁'},
    {id: 14, amount: 0, type: 'Transfer', emoji: '💸'},
    {id: 15, amount: 0, type: 'Withdraw', emoji: '💶'},
    {id: 16, amount: 0, type: 'Savings', emoji: '🔐'},
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

  function getFormatNumber(formatString: string): number {
    const decimalMatch = formatString.match(/\d+(?:\.\d+)?/); // Extract decimal part
    if (decimalMatch) {
      const decimalPlaces = decimalMatch[0].split('.')[1]?.length || 0; // Get decimal places
      return decimalPlaces;
    } else {
      // Handle invalid formats (optional)
      console.warn(`Invalid format: ${formatString}. Defaulting to 2.`);
      return 2;  // Or return another default value
    }
  }

  //Conditional Rendering
  const [isDataFetched, setIsDataFetched] = useState(false); 
  const [showTypes, setShowTypes] = useState<boolean>(false);
  
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

  const filterByCurrency = (data: any[], chosenCurrency: string) => {
    return data.filter(item => item.currency === chosenCurrency);
  };


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
  };
  
  //Fetch Data - The full spendings of the user
  const fetchAllDataFromUser = async () => {
    const response = await fetch(`${backendServer}/getspendingsUser?user_id=${encodeURIComponent(localStorage.getItem("userEmail") || "")}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // if (!response.ok) {
    //   throw new Error('HTTP error ' + response.status);
    // }

    const fetchedData: any[] = await response.json();

    const currentMonth = monthNames[new Date().getMonth()];
    let uniqueMonthsFromData = [...new Set(fetchedData.map(item => item.month))] as string[];

    if (!uniqueMonthsFromData.includes(currentMonth)) {
        uniqueMonthsFromData = [...uniqueMonthsFromData, currentMonth];
    }
    setUniqueMonths(uniqueMonthsFromData);

    const filteredData = filterByCurrency(fetchedData, choosenCurrency);

    // Sort the fetched data by month in ascending order
    fetchedData.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    const lastMonthData = filteredData.filter(row => row.user_email === localStorage.getItem('userEmail') && row.month === monthNames[new Date().getMonth() - 1]);
    const currentMonthData = filteredData.filter(row => row.user_email === localStorage.getItem('userEmail') && row.month === monthNames[new Date().getMonth()]);
    const lastMonthIncome = lastMonthData[lastMonthData.length - 1];
    const currentMonthIncome = currentMonthData[currentMonthData.length - 1];
    if (lastMonthIncome && currentMonthIncome) {
      setIncome(currentMonthIncome.income);
    } else {
       setIncome(lastMonthIncome.income);
      
      const newIncome = (Number(income) + Number(incomeInput.replace(',', '.'))).toFixed(choosenFormat);
      const postResponse = await fetch(`${backendServer}/setIncomeAfterWipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userEmail"),
          month: monthNames[currentDate.getMonth()],
          income: newIncome,
        }),
      });
      if (!postResponse.ok) {
        throw new Error('HTTP error ' + postResponse.status);
      }
    }
    

    const savingsData = fetchedData.map(item => Number(item.saving));
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

    // Sum up the amounts in spendings and add it to income
    const totalSpending = spendings.reduce((total, spending) => total + spending.amount, 0);
    const newIncome = Number(income) + totalSpending;
    setIncome(newIncome);
  
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
        income: newIncome,
        currency: choosenCurrency,
      }),
    });
    if (!postResponse.ok) {
      throw new Error('HTTP error ' + postResponse.status);
    }
  }
  const handleIncomeChange: InputEvent =  (event) => {
    const newIncomeInput = event.target.value.replace(',', '.');
    const isValid = /^-?(\d+([.,]\d{0,2})?)?$/.test(newIncomeInput);
    if (isValid) {
      setIncomeInput(newIncomeInput);
    }
    
  }
  const handleIncomeSubmit: KeyboardEvent = async (event) => {
    if (event.key === 'Enter') {
      const newIncome = (Number(income) + Number(incomeInput.replace(',', '.'))).toFixed(choosenFormat);
      setIncome(newIncome);
      setIncomeInput('');
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
        }),
      });
      if (!postResponse.ok) {
        throw new Error('HTTP error ' + postResponse.status);
      }
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
          emoji: newSpendings[existingSpendingIndex].emoji
        };
        return newSpendings;
      } else {
        // Retrieve emoji from initialSpendings for consistency
        const initialSpendingItem = initialSpendings.find(item => item.id === id);
        const emoji = initialSpendingItem?.emoji || ''; // Use '?.' for optional chaining
        return [...prevSpendings, { id, amount: currentAmount, type, emoji }];
      }
    });
    
  
    setAmount('');
    setShowTypes(false);
  

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
    }
    setIsDataFetched(false);
  }
  const handleSelectChange = (event: { target: { value: any; }; }) => {
      setChoosenMonth(event.target.value);
      fetchData(event.target.value);
  };
  //Functions and Event handlers END


  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------\\


  return (
    <section className="container-fluid">  

      {/* Navbar */}
      <nav className="navbar fixed-top mx-2">
        <div className="currency d-flex flex-row gap-2">
          {primaryCurrency !== 'null' && (
            <> {/* Wrap in fragment to avoid unnecessary element */}
              <p onClick={() => {setChoosenCurrency(primaryCurrency); setChoosenFormat(getFormatNumber(primaryFormat)); setChoosenTag(primaryTag)}}>{primaryCurrency}</p>
              {secondaryCurrency !== 'null' && <p onClick={() => {setChoosenCurrency(secondaryCurrency); setChoosenFormat(getFormatNumber(secondaryFormat)); setChoosenTag(secondaryTag)}}>{secondaryCurrency}</p>}
              {thirdCurrency !== 'null' && <p onClick={() => {setChoosenCurrency(thirdCurrency); setChoosenFormat(getFormatNumber(thirdFormat)); setChoosenTag(thirdTag)}}>{thirdCurrency}</p>}
            </>
          )}
        </div>
        <div className="user d-flex flex-row gap-2" onClick={authContext.logOut}>
          <p className="name">
            {localStorage.getItem("userName")}
          </p>
          <img id="ProfilePIC" src={localStorage.getItem("userPhoto") || ''} alt="" />
        </div> 
      </nav>

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
          {income && (
            Number(income).toFixed(choosenFormat)+""+choosenTag
          )}
          </span>
          {isCurrentMonth && (
            <input className="mx-5 mx-md-1" value={incomeInput} onChange={handleIncomeChange} onKeyDown={handleIncomeSubmit} type="text" placeholder="income"/>
          )}
        </h5>
      </header>

      {/* Spent */}
      <section className="d-flex justify-content-center align-items-center mt-4">
        <h3 className="mb-4 mb-md-0">
        {isCurrentMonth && (
          <input value={amount} onChange={handleAmountChange} onKeyDown={handleAmountSubmit} type="text" placeholder="spent" />
        )}
        </h3>
      </section>

      {/* Types, Categories */}
      <section className="d-flex flex-row justify-content-evenly">
        {showTypes && (
          <div>
            {initialSpendings.map((spending) => (
              <button className="button-secondary" key={spending.type} onClick={() => handleTypeClick(spending.type, spending.id)}>
                {spending.emoji+" "+spending.type}
              </button>
            ))} 
          </div>
        )}  
      </section>

      {/* Spendings */}
      <section className="mt-lg-5 my-1 mb-5 pb-5">
        <div className="row justify-content-evenly">
          {spendings.map((spending, index) => (
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
                <th style={table}>{entry.income}{choosenTag}</th>
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
          <span>Spent this month: {Number(totalSpent).toFixed(choosenFormat)}</span>  
        </h5>
        <h5 className="text-center">
          <span>Total savings: {Number(totalSavings).toFixed(choosenFormat)}</span>
        </h5>
      </footer>
    </section>
  )
}

export default App
