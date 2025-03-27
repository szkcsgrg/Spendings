import React from "react";
import { useRef, useState, useEffect, useContext} from "react";
import { AuthContext } from "./utils/AuthContext";
import { Modal, Dropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { motion } from "framer-motion";
// import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';


type InputEvent = (event: React.ChangeEvent<HTMLInputElement>) => void;
type KeyboardEvent = (event: React.KeyboardEvent<HTMLInputElement>) => void;


interface Log{
  id: number;
  income: number;
  saving: number;
  amount: number;
  emoji: string;
  type: string;
  payment: string,
  visible: boolean;
  currency: string;
  difference: number;
  note: string;
  information: string;
}

interface Spending {
  id: number;
  position: number;
  amount: number;
  type: string;
  emoji: string;
  payment: string;
  visible: boolean;
  currency: string;
  difference: number;
  note: string;
  information: string;
}

function App() {
  /*  @collapsed */

  //Inital Values START
  //Defualt
  const authContext = useContext(AuthContext);
  const backendServer = import.meta.env.VITE_APP_SERVER;
  const [deviceType, setDeviceType] = useState('');


  //Variables
  const [income, setIncome] = useState<string | number>(0);
  const [incomeInput, setIncomeInput] = useState<string>('');
  const [amount, setAmount] = useState<string | number>('');
  const [allSavings, setAllSavings] = useState<number[]>([]);
  const [allInvestments, setAllInvestments] = useState<number[]>([]);
  const [totalSavings, setTotalSavings] = useState('0.00'); 
  const [totalInvestment, setTotalInvestment] = useState('0.00');
  const [monthlyIncomeAndSpending, setMonthlyIncomeAndSpending] = useState<[string, number]>(["", 0]);
  const initialSpendings: Spending[] = [
    {id: 1, position: 1, amount: 0, type: 'Wages & Subscriptions', emoji: '💰', visible: true, payment: "", currency: "", difference: 0, note: "", information: ""},
    {id: 2, position: 2, amount: 0, type: 'Transport', emoji: '🚆', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 3, position: 3, amount: 0, type: 'Gas & Roads', emoji: '🚗', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 4, position: 4, amount: 0, type: 'Occupations & Travel', emoji: '🏨', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 5, position: 5, amount: 0, type: 'Health & Beauty', emoji: '💊', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 6, position: 6, amount: 0, type: 'Shopping', emoji: '🛍️', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 7, position: 7, amount: 0, type: 'Food & Delivery', emoji: '🍔', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 8, position: 8, amount: 0, type: 'Clothes', emoji: '👕', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 9, position: 9, amount: 0, type: 'Education', emoji: '🎓', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 10, position: 10, amount: 0, type: 'Fun & Games', emoji: '🎮', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 11, position: 11, amount: 0, type: 'Technologies', emoji: '🖥️', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 12, position: 18, amount: 0, type: 'Missing & Error', emoji: '❌', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 13, position: 12, amount: 0, type: 'Donation & Gift', emoji: '🎁', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 14, position: 13, amount: 0, type: 'Transfer', emoji: '💸', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 15, position: 14, amount: 0, type: 'Withdraw & Deposit', emoji: '💶', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 16, position: 16, amount: 0, type: 'Savings', emoji: '🔐', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 17, position: 15, amount: 0, type: 'Exchange', emoji: '🪙', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""},
    {id: 18, position: 17, amount: 0, type: 'Investment', emoji: '💼', visible: true, payment: "", currency: "",  difference: 0, note: "", information: ""}
  ];

  {/* 
      +----+--------------+
      | id | type_name    |
      +----+--------------+
      |  1 | wages        |
      |  2 | transport    |
      |  3 | gas          |
      |  4 | occupations  |
      |  5 | health       |
      |  6 | shopping     |
      |  7 | food         |
      |  8 | clothes      |
      |  9 | education    |
      | 10 | fun          |
      | 11 | technologies |
      | 12 | missing      |
      | 13 | donation     |
      | 14 | transfer     |
      | 15 | withdraw     |
      | 16 | savings      |
      | 17 | exchange     |
      | 18 | investment   | //Make it 
      +----+--------------+

    */}


  const [spendings, setSpendings] = useState<Spending[]>(initialSpendings);
  const [updatedSpendings, setUpdatedSpendings] = useState<Spending[]>(initialSpendings);
  const [logEntries, setLogEntries] = useState<Log[]>([]);
  const [allLogEntries, setAllLogEntries] = useState<Log[]>([]);

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
  const [primaryCurrencyData, setPrimaryCurrencyData] = useState<any[]>([]);
  const [secondaryCurrencyData, setSecondaryCurrencyData] = useState<any[]>([]);
  const [thirdCurrencyData, setThirdCurrencyData] = useState<any[]>([]);
  const [initialIncome, setInitialIncome] = useState<number>(0);

  const [choosenPaymentMethod, setChoosenPaymentMethod] = useState<string>("card");
  const [otherPaymentMethodsIncome, setOtherPaymentMethodsIncome] = useState<string | number>("");

  const [noteValue, setNoteValue] = useState<string>("");
  let informationValue = "";

  const [editingEntryId, setEditingEntryId] = useState<number>();
  const [editedAmount, setEditedAmount] = useState<string | number>();
  const [editedNote, setEditedNote] = useState('');
  const [editedCategory, setEditedCategory] = useState('');

  // const [pretag, setPreTag] = useState<string>("");

  // const [lastId, setLastId] = useState<number>(0);

  const exchangedRef = useRef<HTMLDivElement>(null);
  const exchangeRef = useRef<HTMLDivElement>(null);
  const exchangeNewRef = useRef<HTMLDivElement>(null);
  const ProfileRef = useRef<HTMLImageElement>(null);
  const CurrencyRef = useRef<HTMLDivElement>(null);
  const SpendingsRef = useRef<HTMLDivElement>(null);
  const VisibilityRef = useRef<HTMLDivElement>(null);
  const warningRefPrimaryDelete = useRef<HTMLParagraphElement>(null);
  const warningRefEmptyDelete = useRef<HTMLParagraphElement>(null);
  // const editEntryRef = useRef<HTMLDivElement>(null);
  const simpleEntryRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLDivElement>(null);



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
  const [showNote, setShowNote] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);  
  const [showAreYouSureModal, setShowAreYouSureModal] = useState(false);
  const [showAreYouSureGenericModal, setShowAreYouSureGenericModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [ShowErrorMessage, setShowErrorMessage] = useState(false);
  const [confirmFunction, setConfirmFunction] = useState<() => Promise<void> | null>(() => null);
  const [clickedItemId, setClickedItemId] = useState<string | null>(null);
  const [copyEffect, setCopyEffect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dontAskAgainCurrencyAdd, setDontAskAgainCurrencyAdd] = useState(localStorage.getItem("dontAskAgainCurrencyAdd") || "false");
  const [settingsData] = useState(localStorage.getItem("settings"));
  const [incomeVisibility, setIncomeVisibility] = useState(true);
  const [noteVisibility, setNoteVisibility] = useState(true);

  const [fetchNow, setFetchNow] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isIncomeSetByAllData, setIsIncomeSetByAllData] = useState(false);

  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setInitialLoad(false);
    }, 1000);
  }, []);
  //setSettingsData


  // Datum Related
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentDate = new Date();
  const [choosenMonth, setChoosenMonth] = useState(monthNames[currentDate.getMonth()])
  const [uniqueMonths, setUniqueMonths] = useState<string[]>([]);
  const [monthsInFetchedData, setMonthsInFetchedData] = useState<string[]>([]);
  const isCurrentMonth = choosenMonth === monthNames[new Date().getMonth()];
  const [lastMonthValue, setLastMonthValue] = useState<string>("");
  const [choosenYear, setChoosenYear] = useState(new Date().getFullYear())
  const [uniqueYears, setUniqueYears] = useState<number[]>([]);
  const currentYear = new Date().getFullYear();
  // const years = Array.from({ length: currentYear - 2024 + 1 }, (_, i) => 2024 + i);
  const isCurrentYear = choosenYear === new Date().getFullYear();

  // Styles
  const itemStyle = (itemId: string) => ({
    color: clickedItemId === itemId && '#2d3250',
    backgroundColor: clickedItemId === itemId && '#daa4fc',
  });
  
  let uniqueCurrencies: any[] = []; 
  //Inital Values END

  // const { scrollYProgress } = useScroll()
  // const scale = useTransform(scrollYProgress, [0.5, 1], [0.5, 1]);


  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------\\


  //Fetching the Data from the DB START

  //Fetch Data from the User
  const fecthUser = async () => {
    const response = await fetch(`${backendServer}/checkUser?user_id=${encodeURIComponent(localStorage.getItem("userEmail") || "")}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status)
    }
    const fetchedData = await response.json();
    
    const settings = fetchedData[0].settings_json || JSON.parse(settingsData || '{}');
    const spendingsFromSettings = settings.spendings;

    // console.log(settings)
    const updatedInitialSpendings = initialSpendings.map(initialSpending => {
      const spendingUpdate = spendingsFromSettings.find((s: { id: number; }) => s.id === initialSpending.id);
      return {
        ...initialSpending,
        // Override properties from spendingsFromSettings if available
        ...(spendingUpdate ? { emoji: spendingUpdate.emoji, visible: spendingUpdate.visible } : {}),
      };
    });
    setUpdatedSpendings(updatedInitialSpendings);


    setPrimaryCurrency(fetchedData[0].primary_name);
    setSecondaryCurrency(fetchedData[0].secondary_name);
    setThirdCurrency(fetchedData[0].third_name);
    setPrimaryFormat(fetchedData[0].primary_format);
    setSecondaryFormat(fetchedData[0].secondary_format);
    setThirdFormat(fetchedData[0].third_format);
    setPrimaryTag(fetchedData[0].primary_tag);
    setSecondaryTag(fetchedData[0].secondary_tag);
    setThirdTag(fetchedData[0].third_tag);

    // setChoosenCurrency(fetchedData[0].primary_name);
    // setChoosenFormat(getFormatNumber(fetchedData[0].primary_format));
    // setChoosenTag(fetchedData[0].primary_tag);
  }

  //Fetch Data based on User and currentMonth
  const fetchData = async (choosenMonth: string | number | boolean) => {
    const response = await fetch(`${backendServer}/getspendingsUserMonth?user_id=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&month=${encodeURIComponent(choosenMonth)}&currency=${encodeURIComponent(choosenCurrency)}&payment=${encodeURIComponent(choosenPaymentMethod)}&year=${encodeURIComponent(choosenYear)}`, {
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

    // const initialIncomeEntry = filteredData.find(row => row.user_email === localStorage.getItem('userEmail') && row.currency === choosenCurrency && row.month === choosenMonth && row.type_id === null);
    // if(initialIncomeEntry){
    //   setInitialIncome(initialIncomeEntry.income);
    // }
    // else{
    //   setInitialIncome(0);
    // }
    // setInitialIncome(initialIncomeEntry?.income || 0);

    const userEntries = filteredData.filter(row => row.user_email === localStorage.getItem('userEmail') && row.month === choosenMonth && row.year === Number(choosenYear)).map(entry => {
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
          payment: entry.payment,
          visible: true,
          currency: entry.currency,
          difference: entry.difference,
          note: entry.note,
          information: entry.information,
        };
      } else {
        //Here we need to add everything else based on initialSpendings types.
        const initialItem = updatedSpendings.find(item => item.id === entry.type_id);
        return {
          id: entry.id,
          income: entry.income,
          saving: entry.saving,
          amount: entry.amount,
          emoji: initialItem?.emoji || '💳',
          type: initialItem?.type || 'Income',
          payment: entry.payment,
          visible: true,
          currency: entry.currency,
          difference: entry.difference,
          note: entry.note,
          information: entry.information,
        };
      }

    });
    setLogEntries(userEntries);
    setAllLogEntries(userEntries);
    setIsDataFetched(true);

    // Merge fetched data with initial spendings
    const mergedData = updatedSpendings.map(initialItem => {
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
    
    if (!isIncomeSetByAllData) {
      const incomeToSet = userRows.length > 0 ? userRows[userRows.length - 1].income : 0;
      setIncome(incomeToSet);
    }
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
    let emptyData = false;
    // - If fetchedData is [] then set emptyData to true;
    if(fetchedData.length === 0){
      emptyData = true;
    }
    uniqueCurrencies = [...new Set(fetchedData.map(item => item.currency).filter(currency => currency))]; // filter out falsy values
    // uniqueFormats = [...new Set(fetchedData.map(item => item.format).filter(format => format))]; // filter out falsy values
    // uniqueTags = [...new Set(fetchedData.map(item => item.tag).filter(tag => tag))]; // filter out falsy values




    // ! ORIGINAL uniqueMonths
    const currentYear = new Date().getFullYear();
    const currentMonth = monthNames[currentDate.getMonth()];
    let uniqueMonthsFromData = [...new Set(fetchedData.map(item => item.month))] as string[];

    if (!uniqueMonthsFromData.includes(currentMonth)) {
      uniqueMonthsFromData = [...uniqueMonthsFromData, currentMonth];
    }
    // setUniqueMonths(uniqueMonthsFromData);


    let months: React.SetStateAction<string[]>;
    let years = [];

    if(!emptyData){
      const filteredData = fetchedData.filter(entry => entry.month !== "initial");
      const firstEntryDateMonth = filteredData.length > 0 ? filteredData[0].month : null;
      const firstEntryDateYear = fetchedData[0].year;
      const firstEntryMonthIndex = monthNames.indexOf(firstEntryDateMonth);
      // console.log(firstEntryDateMonth, firstEntryDateYear, firstEntryMonthIndex)

      years = Array.from({ length: currentYear - firstEntryDateYear + 1 }, (_, i) => firstEntryDateYear + i).reverse();

      if (Number(choosenYear) === firstEntryDateYear) {
        months = monthNames.slice(firstEntryMonthIndex);
      } else if (Number(choosenYear) === currentYear) {
        months = monthNames.slice(0, currentDate.getMonth() + 1);
      } else {
        months = [];
      }
    }
    else{
      // # In 2026 fix this :) 
      years.push(2025);

      months = monthNames.slice(0, currentDate.getMonth() + 1);
    }

    // setMonthsInFetchedData(uniqueMonthsFromData.filter(month => month !== "initial"));
    // # This might be a problem for later. In main account get back to this in July. 
    setMonthsInFetchedData(fetchedData
      .filter(entry => entry.year === Number(choosenYear) && entry.month !== "initial")
      .map(entry => entry.month));
    setUniqueMonths(months);
    setUniqueYears(years);
    // console.log(uniqueMonths, uniqueYears)
    // console.log(monthsInFetchedData)

    const lastMonth = months[months.length - 1];
    // console.log(lastMonth);
    setLastMonthValue(lastMonth);











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
    // setLastId(userData[0].id);

    const primaryCurrencyData = userData.filter(row => row.currency === primaryCurrency);
    const secondaryCurrencyData = userData.filter(row => row.currency === secondaryCurrency);
    const thirdCurrencyData = userData.filter(row => row.currency === thirdCurrency);

    setPrimaryCurrencyData(primaryCurrencyData);
    setSecondaryCurrencyData(secondaryCurrencyData);
    setThirdCurrencyData(thirdCurrencyData);

    
    const monthlySpent = uniqueMonthsFromData.reduce((acc, month) => {
      const totalSpent = userData
        .filter(row => row.month === month)
        .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
      acc[month] = Number(totalSpent);
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(monthlySpent).forEach(([monthName, totalSpent]) => {
      setMonthlyIncomeAndSpending([monthName, totalSpent]);
    });
    
    //  ? Here is a bug with the income value. Because of that If I enter a value in previous month on the actual month will be not the correct value
    for (const row of userData.reverse()) {
      if (row.currency === primaryCurrency) {
        // console.log(row.income)
        setIncomeOfPrimaryAccount(row.income); // Update state with income value
      } else if (row.currency === secondaryCurrency) {
        setIncomeOfSecondaryAccount(row.income); // Update state with income value
      } else if (row.currency === thirdCurrency) {
        setIncomeOfThirdAccount(row.income); // Update state with income value
      }
      if(row.payment !== choosenPaymentMethod){
        if(row.income !== null)
        {
          setOtherPaymentMethodsIncome(row.income);
        }
        else{ 
          setOtherPaymentMethodsIncome("0");
          }
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
    

    const lastMonthData = filteredData
    .filter(row => 
      row.user_email === localStorage.getItem('userEmail') && 
      row.currency === choosenCurrency &&
      row.payment === choosenPaymentMethod && 
      row.month !== monthNames[new Date().getMonth()]
    )
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    
    // Filter data for the current month
    const currentMonthData = filteredData.filter(row => 
      row.user_email === localStorage.getItem('userEmail') && 
      row.currency === choosenCurrency &&
      row.payment === choosenPaymentMethod &&
      row.month === monthNames[new Date().getMonth()]
    );
    
    // Get the last entry for last month and current month
    const lastMonthIncome = lastMonthData.length > 0 ? lastMonthData[lastMonthData.length - 1] : { income: undefined };
    // console.log("Last Month: " + lastMonthIncome.month);
    // console.log("Last Months Income: " + lastMonthIncome.income);
    setInitialIncome(lastMonthIncome.income);

    
    const currentMonthIncome = currentMonthData.length > 0 ? currentMonthData[currentMonthData.length - 1] : { income: undefined };
    // console.log("Current Month: " + currentMonthIncome.month);
    // console.log("Current Months Income: " + currentMonthIncome.income);
    
    if(!lastMonthIncome.income && !currentMonthIncome.income){
      // console.log("No income");
      setIncome(0);
    }else if(lastMonthIncome.income && currentMonthIncome.income){
      // console.log("Both income");
      if(choosenMonth === monthNames[currentDate.getMonth()]){
        setIncome(currentMonthIncome.income);
      }
      else{
        //we need to get the income of the choosenmonth. 
        const choosenMonthData = filteredData.filter(row => 
          row.user_email === localStorage.getItem('userEmail') && 
          row.currency === choosenCurrency &&
          row.payment === choosenPaymentMethod &&
          row.month === choosenMonth
        );
        // console.log(choosenMonthData);
        // console.log(choosenMonthData[choosenMonthData.length - 1].income);
        setIncome(choosenMonthData[choosenMonthData.length - 1].income);
      }
    }else if(currentMonthIncome.income === undefined && lastMonthIncome.income){  
      // console.log("Last income");
      if(choosenMonth === monthNames[currentDate.getMonth()]){
        setIncome(lastMonthIncome.income);
        // setInitialIncome(lastMonthIncome.income);
      }
      else{
        //we need to get the income of the choosenmonth. 
        const choosenMonthData = filteredData.filter(row => 
          row.user_email === localStorage.getItem('userEmail') && 
          row.currency === choosenCurrency &&
          row.payment === choosenPaymentMethod &&
          row.month === choosenMonth
        );
        // console.log(choosenMonthData);
        // console.log(choosenMonthData[choosenMonthData.length - 1].income);
        setIncome(choosenMonthData[choosenMonthData.length - 1].income);
      }   
    }else if(currentMonthIncome.income && !lastMonthIncome.income){
      // console.log("Current income");
      setIncome(currentMonthIncome.income);
    }
    // console.log(initialIncome);

    setIsIncomeSetByAllData(true);

    

    const savingsData = filteredData.map(item => Number(item.saving));
    setAllSavings(savingsData);
    const investmentData = filteredData.map(item => Number(item.type_id === 18 ? item.amount : 0));
    setAllInvestments(investmentData);
  }

  //Fetching the Data from the DB END
  useEffect(() => {
    fecthUser();
    const getDeviceType = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

      if (/android/i.test(userAgent)) {
        return 'Android';
      }

      if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
        return 'iOS';
      }

      if (/Win(dows )?NT|Win(dows )?9x|Win(dows )?ME|Win(dows )?XP|Win(dows )?Vista|Win(dows )?7|Win(dows )?8|Win(dows )?10/.test(userAgent)) {
        return 'Windows';
      }

      if (/Mac|PPC/.test(userAgent)) {
        return 'macOS';
      }

      if (/Linux/.test(userAgent)) {
        return 'Linux';
      }

      return 'unknown';
    };
    setDeviceType(getDeviceType());
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    Array.from(tooltipTriggerList).map(tooltipTriggerEl => new window.bootstrap.Tooltip(tooltipTriggerEl));
  
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
          // throw new Error('HTTP error ' + error);
          console.error("Error fetching data: ", error);
          setIsLoading(false); // Stop loading in case of error
        });
      }, 500);
    }
    else{
      setIsLoading(true); // Start loading
      setTimeout(() => {
        Promise.all([fetchData(choosenMonth)])
        .then(() => {
          setIsLoading(false); // Stop loading once data is fetched
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setIsLoading(false); // Stop loading in case of error
        });
      }, 1500);
    }
  }, [choosenYear, choosenMonth, isDataFetched, choosenCurrency, choosenPaymentMethod, income, fetchNow]);
  useEffect(() => {
    setTimeout(() => {
      Promise.all([fetchAllDataFromUser()])
      .then(() => {
        setIsLoading(false);
        setIsDataFetched(true); 
      })
      .catch((error) => {
        // throw new Error('HTTP error ' + error);
        console.error("Error fetching data: ", error);
        setIsLoading(false); // Stop loading in case of error
      });
    }, 1500);
  },[choosenYear, choosenMonth, choosenCurrency, choosenPaymentMethod])

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------\\


  //Calculations START
  useEffect(() => {
    //(allSavings);
    const total = allSavings.reduce((total: number, saving: number) => {
      return total + saving;
    }, 0).toFixed(choosenFormat);
    setTotalSavings(total);
  }, [allSavings, fetchNow]);

  useEffect(() => {
    const total = allInvestments.reduce((total: number, investment: number) => {
      return total + investment;
    }, 0).toFixed(choosenFormat);
    setTotalInvestment(total);
  }, [allInvestments, fetchNow]);

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
    console.log(uniqueCurrencies);
    console.log(monthlyIncomeAndSpending)
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
  // Monthly Income and Spending reset
  const resetSpendings: () => void = async () => {
    console.log(initialIncome);
    setShowSettingsModal(false);
    setShowAreYouSureModal(true);
    setConfirmFunction(() => async () => {
  
    // Calculate the removed saving value and update totalSavings
    const removedSaving = spendings.reduce((total, spending) => total + (spending.type === 'Savings' ? spending.amount : 0), 0);
    setTotalSavings(prevTotalSavings => (Number(prevTotalSavings) - removedSaving).toFixed(choosenFormat));

    const removedInvestment = spendings.reduce((total, spending) => total + (spending.type === 'Investment' ? spending.amount : 0), 0);
    setTotalInvestment(prevTotalInvestment => (Number(prevTotalInvestment) - removedInvestment).toFixed(choosenFormat));

    setSpendings(prevSpendings => prevSpendings.map(spending => ({...spending, amount: 0})));

    // Send a DELETE request to the server
    const response = await fetch(`${backendServer}/deletespendingsUserMonth?userId=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&month=${encodeURIComponent(monthNames[currentDate.getMonth()])}&currency=${encodeURIComponent(choosenCurrency)}&year=${encodeURIComponent(choosenYear)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status);
    }

    // Send a POST request to the server with the new income value
    // const postResponse = await fetch(`${backendServer}/setIncomeAfterWipe`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     userId: localStorage.getItem("userEmail"),
    //     month: choosenMonth, 
    //     income: initialIncome,
    //     currency: choosenCurrency,
    //     payment: choosenPaymentMethod,
    //     information: "Wiped",
    //     year: choosenYear,
    //   }),
    // });
    // if (!postResponse.ok) {
    //   throw new Error('HTTP error ' + postResponse.status);
    // }
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
  const handleIncomeSubmitClickable: () => Promise<void> = async () => {
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
          month: choosenMonth, 
          income: newIncome,
          currency: choosenCurrency,
          payment: choosenPaymentMethod,
          difference: Number(incomeInput.replace(',', '.')).toFixed(choosenFormat),
          year: choosenYear,
        }),
      });
      if (!postResponse.ok) {
        throw new Error('HTTP error ' + postResponse.status);
      }
      setFetchNow(!fetchNow);
  }
  const handleIncomeSubmit: KeyboardEvent = async (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      const sentIncome = Number(incomeInput);
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
          month: choosenMonth, 
          income: newIncome,
          currency: choosenCurrency,
          payment: choosenPaymentMethod,
          difference: Number(incomeInput.replace(',', '.')).toFixed(choosenFormat),
          information: "Income Change",
          year: choosenYear,
        }),
      });
      if (!postResponse.ok) {
        throw new Error('HTTP error ' + postResponse.status);
      }

      //IF the choosenMonth is not the currentMonth then create another entry in the DB for the currentMonth updated with the income. 
    let currentMonthIncome = 0;

    if(choosenCurrency === primaryCurrency){
      currentMonthIncome = Number(incomeOfPrimaryAccount);
    }
    else if(choosenCurrency === secondaryCurrency){
      currentMonthIncome = Number(incomeOfSecondaryAccount);
    }
    else if(choosenCurrency === thirdCurrency){
      currentMonthIncome = Number(incomeOfThirdAccount);
    }
    else{
      // console.log("Error in the choosenCurrency");
      // console.log(choosenCurrency);
      // console.log(currentMonthIncome);
    }
    // console.log(currentMonthIncome + " " + Number(incomeInput.replace(',', '.')).toFixed(choosenFormat));
    const differenceIncome = Number(incomeInput.replace(',', '.')) + Number(currentMonthIncome);
    // console.log("Dif: " + differenceIncome);
    // console.log(choosenMonth !== monthNames[currentDate.getMonth()])
    if(choosenMonth !== monthNames[currentDate.getMonth()] || choosenYear !== new Date().getFullYear()){
      const monthResponse = await fetch(`${backendServer}/setIncomeAfterWipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userEmail"),
          month: monthNames[currentDate.getMonth()], 
          // ? Not always correct, maybe
          income: Number(differenceIncome).toFixed(choosenFormat),
          currency: choosenCurrency,
          payment: choosenPaymentMethod,
          difference: Number(newIncome).toFixed(choosenFormat),
          information: "Difference from previous Month(s). "+ Number(sentIncome),
          year: currentYear,
        }),
      });
      if(!monthResponse.ok){
        throw new Error('HTTP error ' + monthResponse.status);
      }
    }

      setFetchNow(!fetchNow);
    }
    if(event.key === 'Escape'){
      setIncomeInput('');
    }

  }
  const handleAmountChange: InputEvent = (event)  => {
    const newValue = event.target.value.replace(',', '.');
    const isValid = /^-?(\d+([.,]\d{0,2})?)?$/.test(newValue);
    if (isValid) {
      setAmount(newValue);
    }
  }
  const handleEditedAmountChange: InputEvent = (event) => {
    const newValue = event.target.value.replace(',', '.');
    const isValid = /^-?(\d+([.,]\d{0,2})?)?$/.test(newValue);
    if (isValid) {
      setEditedAmount(newValue);
    }
    // if(Number.isNaN(parseFloat(newValue))){
    //   setEditedAmount(0);
    // }
  }
  const handleNoteChange: InputEvent = (event) => {
    setNoteValue(event.target.value);
  }
  const handleAmountSubmit: KeyboardEvent = (event) => {
    //&& choosenCategory
    if (event.key === 'Enter' || event.key === 'Escape') {
      setShowTypes(false);
    }
    else{
      if(noteVisibility){
        setShowNote(true);
      }
      setShowTypes(true);
    }
  }

  // Exchange Submit
  const handleExchangeSubmit = async (choosedCurrency:any) => {
    // A account is the currenct B account is the choosenCurrency Account.
    // let incomeOfOtherAccount = 0 as number;
    // //What we need to add to the B account
    // if(choosedCurrency === primaryCurrency){
    //   incomeOfOtherAccount = Number(incomeOfPrimaryAccount);
    // }
    // else if(choosedCurrency === secondaryCurrency){
    //   incomeOfOtherAccount = Number(incomeOfSecondaryAccount);
    // }
    // else if(choosedCurrency === thirdCurrency){
    //   incomeOfOtherAccount = Number(incomeOfThirdAccount);
    // }
    // else{
    //   //("Error in the choosedCurrency");
    // }

    // ("---------------------");

    // ("TO: " + choosedCurrency)
    // ("Value: " + exchangeAmount); //This will go to the income of the B account
    // const newBIncom = Number(incomeOfOtherAccount)+Number(exchangeAmount); //This will be the new income of the B account
    // ("New Income " + newBIncom + " to " + choosedCurrency);
    
    // ("---------------------");
    
    //What we need to remove (Insert into DB) from the A account
    // ("FROM: " + choosenCurrency)
    const currentAmount = Number(amount);
    // ("Amount got exchanged: " + currentAmount); //This should be set to the Exchange amount id 17
    // console.log(income);
    // const newAIncome = Number(income) //-Number(currentAmount); //This should be the new income of the A account
    // ("New Income " + newAIncome + " to " + choosenCurrency);

    // console.log(incomeOfOtherAccount)
    // console.log("+ " + exchangeAmount);
    // console.log("= " + newBIncom);
    exchangedRef.current?.classList.remove("d-block");
    exchangedRef.current?.classList.add("d-none");

    // ?  Here is also a big problem: 
    // +-------+--------------------+---------+----------+-----------+---------+---------+----------+---------+------------+---------------------------------------------+-------------------------------------------+------+
    // | 14598 | szkcsgrg@gmail.com |      17 | December | 134000.00 |    NULL |    NULL | HUF      | card    | 4000.00    |                                             | 10.00 EUR to 4000.00 HUF                  | 2024 |
    // | 14599 | szkcsgrg@gmail.com |      17 | December |    700.00 |    NULL |   10.00 | EUR      | card    | 10.00      |                                             | 10.00 EUR to 4000.00 HUF                  | 2024 |
    // | 14600 | szkcsgrg@gmail.com |    NULL | March    |   1000.00 |    NULL |    NULL | EUR      | card    | 500.00     | NULL                                        | Income Change                             | 2025 |
    // | 14601 | szkcsgrg@gmail.com |    NULL | March    | 100000.00 |    NULL |    NULL | HUF      | card    | 6000       | NULL                                        | Income Change                             | 2025 |
    // | 14602 | szkcsgrg@gmail.com |      17 | December | 140000.00 |    NULL |    NULL | HUF      | card    | 40000.00   |                                             | 100.00 EUR to 40000.00 HUF                | 2024 |
    // | 14603 | szkcsgrg@gmail.com |      17 | December |    600.00 |    NULL |  100.00 | EUR      | card    | 100.00     |                                             | 100.00 EUR to 40000.00 HUF                | 2024 |
    // +-------+--------------------+---------+----------+-----------+---------+---------+----------+---------+------------+---------------------------------------------+-------------------------------------------+------+

    // HUF SIDE 134000 + 40000  is not 140000 
    // The calculation is wrong.

    let choosenData = [];
    let choosedData = [];
    if(choosenCurrency === primaryCurrency){
      choosenData = primaryCurrencyData.filter(row => row.month === choosenMonth);
      // console.log("Primary Choosen Currency: ");
      // console.log(choosenData)
    }
    if(choosenCurrency === secondaryCurrency){
      choosenData = secondaryCurrencyData.filter(row => row.month === choosenMonth);
      // console.log("Secondary Choosen Currency: ");
      // console.log(choosenData)
    }
    if(choosenCurrency === thirdCurrency){
      choosenData = thirdCurrencyData.filter(row => row.month === choosenMonth);
      // console.log("Third Choosen Currency: ");
      // console.log(choosenData)
    }

    if(choosedCurrency === primaryCurrency){
      choosedData = primaryCurrencyData.filter(row => row.month === choosenMonth);
      // console.log("Primary Choosed Currency: ");
      // console.log(choosedData)
    }
    if(choosedCurrency === secondaryCurrency){
      choosedData = secondaryCurrencyData.filter(row => row.month === choosenMonth);
      // console.log("Secondary Choosed Currency: ");
      // console.log(choosedData)
    }
    if(choosedCurrency === thirdCurrency){
      choosedData = thirdCurrencyData.filter(row => row.month === choosenMonth);
      // console.log("Third Choosed Currency: ");
      // console.log(choosedData)
    }
    // Get the last entry for the choosen currency
      const choosenCurrencyData = choosenData.filter(row => row.currency === choosenCurrency);
      const incomeOfChoosenC = choosenCurrencyData.length > 0 ? choosenCurrencyData[0].income : 0;

      // Get the last entry for the choosed currency
      const choosedCurrencyData = choosedData.filter(row => row.currency === choosedCurrency);
      const incomeOfChoosedC = choosedCurrencyData.length > 0 ? choosedCurrencyData[0].income : 0;

      // console.log(choosenCurrency + ": " + incomeOfChoosenC);
      // console.log(choosedCurrency + ": " + incomeOfChoosedC);

      console.log("Choosen Currency's income: " + incomeOfChoosenC);
      console.log("Choosed Currency's income: " + incomeOfChoosedC);

      const updatedChoosenIncomeForChoosenMonth = Number(incomeOfChoosenC) - Number(amount);
      const updatedChoosedIncomeForChoosenMonth = Number(incomeOfChoosedC) + Number(exchangeAmount);

      console.log("Updated Choosen Currency's income: " + updatedChoosenIncomeForChoosenMonth);
      console.log("Updated Choosed Currency's income: " + updatedChoosedIncomeForChoosenMonth);




    //Send Post method to the Server to the ChoosedCurrency - Exchange to. 
    if(choosedCurrency !== null){
      const response = await fetch(`${backendServer}/changespendings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          month: choosenMonth, 
          type_id: 17,
          income: updatedChoosedIncomeForChoosenMonth,
          currency: choosedCurrency,
          payment: choosenPaymentMethod,
          difference: Number(exchangeAmount).toFixed(choosenFormat),
          information: Number(amount).toFixed(choosenFormat) + " "  + choosenCurrency + " to " + Number(exchangeAmount).toFixed(choosenFormat) + " " + choosedCurrency,
          note: noteValue,
          year: choosenYear,
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
          month: choosenMonth, 
          type_id: 17,
          income: updatedChoosenIncomeForChoosenMonth,
          amount: Number(currentAmount),
          currency: choosenCurrency,
          payment: choosenPaymentMethod,
          difference: Number(currentAmount).toFixed(choosenFormat),
          information: Number(amount).toFixed(choosenFormat) + " "  + choosenCurrency + " to " + Number(exchangeAmount).toFixed(choosenFormat) + " " + choosedCurrency,
          note: noteValue,
          year: choosenYear,
        })
      });
      if (!response2.ok) {
        throw new Error('HTTP error ' + response.status);
      }
    }

    // ? I think we need to add the two other post if the month is not the current. 
    if(choosenMonth !== monthNames[currentDate.getMonth()] || choosenYear !== new Date().getFullYear()){
      // console.log("The month is not the current. And here we need to update the current month!")
      // console.log("//////////////////////////////////////////////////////////")
      // console.log("Updatding: " + monthNames[currentDate.getMonth()] + " because of we are changing in " + choosenMonth);
      // console.log("Choosen Month: " + choosenMonth);
      // console.log("Current Month: " + monthNames[currentDate.getMonth()]);
      // console.log("Choosen Year: " + choosenYear);
      // console.log("Current Year: " + new Date().getFullYear());
      // // We need to have a get first. 
      // console.log("Choosen Currency: " + choosenCurrency);
      // console.log("Choosed Currency: " + choosedCurrency);
      /*
      Test #4
      Choosen Month: December
      Current Month: March
      Choosen Year: 2024
      Current Year: 2025

      Choosen Month's income: 770
      Current Month's income: NA

      Choosen Currency: EUR
      Choosed Currency: HUF
      */


      //Get get the data in the current Month. We need only the last entry for both the choosed and the choosen currency.
      //Check if choosen currency and the choosed currency is the Primary or secondary or thid currency.
      let choosenData = [];
      let choosedData = [];
      if(choosenCurrency === primaryCurrency){
        choosenData = primaryCurrencyData.filter(row => row.month === monthNames[currentDate.getMonth()]);
        // console.log("Primary Choosen Currency: ");
        // console.log(choosenData)
      }
      if(choosenCurrency === secondaryCurrency){
        choosenData = secondaryCurrencyData.filter(row => row.month === monthNames[currentDate.getMonth()]);
        // console.log("Secondary Choosen Currency: ");
        // console.log(choosenData)
      }
      if(choosenCurrency === thirdCurrency){
        choosenData = thirdCurrencyData.filter(row => row.month === monthNames[currentDate.getMonth()]);
        // console.log("Third Choosen Currency: ");
        // console.log(choosenData)
      }

      if(choosedCurrency === primaryCurrency){
        choosedData = primaryCurrencyData.filter(row => row.month === monthNames[currentDate.getMonth()]);
        // console.log("Primary Choosed Currency: ");
        // console.log(choosedData)
      }
      if(choosedCurrency === secondaryCurrency){
        choosedData = secondaryCurrencyData.filter(row => row.month === monthNames[currentDate.getMonth()]);
        // console.log("Secondary Choosed Currency: ");
        // console.log(choosedData)
      }
      if(choosedCurrency === thirdCurrency){
        choosedData = thirdCurrencyData.filter(row => row.month === monthNames[currentDate.getMonth()]);
        // console.log("Third Choosed Currency: ");
        // console.log(choosedData)
      }
      

      // Get the last entry for the choosen currency
      const choosenCurrencyData = choosenData.filter(row => row.currency === choosenCurrency);
      const incomeOfChoosenC = choosenCurrencyData.length > 0 ? choosenCurrencyData[0].income : 0;

      // Get the last entry for the choosed currency
      const choosedCurrencyData = choosedData.filter(row => row.currency === choosedCurrency);
      const incomeOfChoosedC = choosedCurrencyData.length > 0 ? choosedCurrencyData[0].income : 0;

      // console.log(choosenCurrency + ": " + incomeOfChoosenC);
      // console.log(choosedCurrency + ": " + incomeOfChoosedC);

      // console.log("Choosen Currency's income: " + incomeOfChoosenC);
      // console.log("Choosed Currency's income: " + incomeOfChoosedC);

      const updatedChoosenIncomeForCurrentMonth = Number(incomeOfChoosenC) - Number(amount);
      const updatedChoosedIncomeForCurrentMonth = Number(incomeOfChoosedC) + Number(exchangeAmount);

      // console.log("Updated Choosen Currency's income: " + updatedChoosenIncomeForCurrentMonth);
      // console.log("Updated Choosed Currency's income: " + updatedChoosedIncomeForCurrentMonth);

      const choosenCurrencyUpdate = await fetch(`${backendServer}/setIncomeAfterWipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userEmail"),
          month: monthNames[currentDate.getMonth()], 
          income: updatedChoosenIncomeForCurrentMonth,
          currency: choosenCurrency,
          payment: choosenPaymentMethod,
          difference: Number(currentAmount).toFixed(choosenFormat),
          note: "Collapsable",
          information: "Difference from previous Month(s)",
          year: currentYear,
        }),
      });
      if(!choosenCurrencyUpdate.ok){
        throw new Error('HTTP error ' + choosenCurrencyUpdate.status);
      }
      const choosedCurrencyUpdate = await fetch(`${backendServer}/setIncomeAfterWipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userEmail"),
          month: monthNames[currentDate.getMonth()], 
          income: updatedChoosedIncomeForCurrentMonth,
          currency: choosedCurrency,
          payment: choosenPaymentMethod,
          difference: Number(currentAmount).toFixed(choosenFormat),
          note: "Collapsable",
          information: "Difference from previous Month(s)",
          year: currentYear,
        }),
      });
      if(!choosedCurrencyUpdate.ok){
        throw new Error('HTTP error ' + choosedCurrencyUpdate.status);
      }
      
      
    }
    
    setSpendings(prevSpendings => {
      return [...prevSpendings, { 
        id: 17, 
        amount: currentAmount, 
        type: 'Exchange', 
        emoji: '🪙', 
        position: 15, 
        visible: true, 
        payment: choosenPaymentMethod, 
        currency: choosedCurrency, 
        difference: Number(exchangeAmount), 
        note: noteValue, 
        information: choosenCurrency + " to " + choosedCurrency
      }];
    });
    setIncomeOfPrimaryAccount("");
    setIncomeOfSecondaryAccount("");
    setIncomeOfThirdAccount("");
    sessionStorage.clear();
    setAllSavings(prevSavings => [...prevSavings, Number(currentAmount)]);
    // setChoosedCurrency("");
    setExchangeAmount("");
    setAmount('');
    setNoteValue("");
    setShowNote(false);
    setIsDataFetched(false);
    // fetchAllDataFromUser();
  }
  const handleTypeClick: (type: string, id: number) => void = async (type, id) => {
    // console.log(noteValue);
    // console.log("Amount: "+Number(amount) + " Inc: " +  Number(income));
    const currentAmount = Number(amount);
    const newIncome = Number(income)-currentAmount;
    // console.log("New Income: " + newIncome);
    
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
          position: newSpendings[existingSpendingIndex].position,
          visible: newSpendings[existingSpendingIndex].visible,
          payment: newSpendings[existingSpendingIndex].payment,
          
        };
        return newSpendings;
      } else {
        // Retrieve emoji from initialSpendings for consistency
        const initialSpendingItem = initialSpendings.find(item => item.id === id);
        const emoji = initialSpendingItem?.emoji || ''; // Use '?.' for optional chaining
        return [...prevSpendings, { id, amount: currentAmount, type, emoji, position: id, visible: true, payment: choosenPaymentMethod, currency: choosenCurrency, difference: 0, note: noteValue, information: informationValue }];
      }
    });
    
    
    // console.log(secondaryCurrency, thirdCurrency);
    
    // console.log(type);
    
    
    // POST request to server
    if(type === 'Savings'){
      // console.log("Savings");
      const response = await fetch(`${backendServer}/changesavings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          month: choosenMonth, 
          income: newIncome,
          saving: Number(currentAmount),
          currency: choosenCurrency,
          payment: choosenPaymentMethod,
          difference : null,
          note: noteValue,
          year: choosenYear,
        })
      });
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      setAllSavings(prevSavings => [...prevSavings, Number(currentAmount)]);
      setAmount('');
      setNoteValue("");
    }
    else if(type === 'Investment'){
      setAllInvestments(prevInvestments => [...prevInvestments, Number(currentAmount)]);
      const response = await fetch(`${backendServer}/changespendings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          type_id: id,
          month: choosenMonth, 
          income: newIncome,
          amount: Number(currentAmount),
          currency: choosenCurrency,
          payment: choosenPaymentMethod,
          difference: null,
          note: noteValue,
          year: choosenYear,
        })
      });
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      setAmount('');
      setNoteValue("");
    }
    else if(type === 'Exchange' && ((secondaryCurrency === 'null' || secondaryCurrency === 'undefined' || secondaryCurrency === '')  && dontAskAgainCurrencyAdd === "true")){
      // console.log("Exchnage but there is no other Currency and Dont ask again is true.")
      // ? Does this even get called?  
      // - Probably when there is no other currency only. 
      // - In that case the delete should also work differently. 

      const response = await fetch(`${backendServer}/changespendings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          type_id: id,
          month: choosenMonth, 
          income: newIncome,
          amount: Number(currentAmount).toFixed(choosenFormat),
          currency: choosenCurrency,
          payment: choosenPaymentMethod,
          difference : Number(currentAmount).toFixed(choosenFormat),
          note: noteValue,
          year: choosenYear,
        })
      });
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      setAmount('');
    
      setShowTypes(false);
      setIsDataFetched(false);
    }
    else if(type === 'Exchange' && ((secondaryCurrency === 'null' || secondaryCurrency === 'undefined' || secondaryCurrency === ''))){  
      // console.log("Exchange with a Currency but There is no other Currency.");
      exchangeNewRef.current?.classList.remove("d-none");
      exchangeNewRef.current?.classList.add("d-block");
      if (exchangeRef.current) {
        exchangeRef.current.focus();
      }
    }
    else if(type === 'Exchange' && (secondaryCurrency || thirdCurrency)){
      // console.log("Exchange with a Currency");
      exchangedRef.current?.classList.remove("d-none");
      exchangedRef.current?.classList.add("d-block");
      if (exchangeRef.current) {
        exchangeRef.current.focus();
      }
    }
    else if(type === 'Withdraw & Deposit'){
      

      //Get the the income values of cash and card for the choosenMonth
      
      let choosenDataPast = [];
      let choosedDataPast = [];

      const notTheChoosenPaymentMethod = choosenPaymentMethod === 'card' ? 'cash' : 'card';

      switch (choosenCurrency) {
        case primaryCurrency:
          choosenDataPast = primaryCurrencyData.filter(row => row.payment === choosenPaymentMethod && row.month === choosenMonth);
          choosedDataPast = primaryCurrencyData.filter(row => row.payment === notTheChoosenPaymentMethod && row.month === choosenMonth);
          break;
        case secondaryCurrency:
          choosenDataPast = secondaryCurrencyData.filter(row => row.payment === choosenPaymentMethod && row.month === choosenMonth);
          choosedDataPast = secondaryCurrencyData.filter(row => row.payment === notTheChoosenPaymentMethod && row.month === choosenMonth);
          break;
        case thirdCurrency:
          choosenDataPast = thirdCurrencyData.filter(row => row.payment === choosenPaymentMethod && row.month === choosenMonth);
          choosedDataPast = thirdCurrencyData.filter(row => row.payment === notTheChoosenPaymentMethod && row.month === choosenMonth);
          break;
        default:
          break;
      }
      const incomeOfChoosenCPast = choosenDataPast.length > 0 ? choosenDataPast[0].income : 0;
  
      // Get the last entry for the choosed currency
      const incomeOfChoosedCPast = choosedDataPast.length > 0 ? choosedDataPast[0].income : 0;

      // console.log(choosenCurrency + ": " + incomeOfChoosenC);
      // console.log(choosedCurrency + ": " + incomeOfChoosedC);

      console.log("Choosen Currency's income: " + incomeOfChoosenCPast);
      console.log("Choosed Currency's income: " + incomeOfChoosedCPast);

      const updatedChoosenIncomeForChoosenMonth = Number(incomeOfChoosenCPast) - Number(amount);
      const updatedChoosedIncomeForChoosenMonth = Number(incomeOfChoosedCPast) + Number(amount);

      console.log("Updated Current Month's (choosen)income: " + updatedChoosenIncomeForChoosenMonth);
      console.log("Updated Current Month's (choosed)income: " + updatedChoosedIncomeForChoosenMonth);

      
      const choosenPaymentMethodResponse = await fetch(`${backendServer}/changespendings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          type_id: id,
          month: choosenMonth, 
          income: updatedChoosenIncomeForChoosenMonth,
          amount: Number(amount),
          currency: choosenCurrency,
          payment: choosenPaymentMethod,
          difference: Number(currentAmount).toFixed(choosenFormat),
          note: noteValue,
          year: choosenYear,
        })
      })
      if (!choosenPaymentMethodResponse.ok) {
        throw new Error('HTTP error ' + choosenPaymentMethodResponse.status);
      }

      const choosedPaymentMethodResponse = await fetch(`${backendServer}/changespendings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          type_id: id,
          month: choosenMonth, 
          income: updatedChoosedIncomeForChoosenMonth,
          currency: choosenCurrency,
          payment: notTheChoosenPaymentMethod,
          difference: Number(amount).toFixed(choosenFormat),
          note: noteValue,
          year: choosenYear,
        })
      })
      if (!choosedPaymentMethodResponse.ok) {
        throw new Error('HTTP error ' + choosedPaymentMethodResponse.status);
      }
      


      if(choosenMonth !== monthNames[currentDate.getMonth()] || choosenYear !== new Date().getFullYear()){
        let choosenData = [];
        let choosedData = [];

        
        switch (choosenCurrency) {
          case primaryCurrency:
            choosenData = primaryCurrencyData.filter(row => row.payment === choosenPaymentMethod && row.month === monthNames[currentDate.getMonth()]);
            choosedData = primaryCurrencyData.filter(row => row.payment === notTheChoosenPaymentMethod && row.month === monthNames[currentDate.getMonth()]);
            break;
          case secondaryCurrency:
            choosenData = secondaryCurrencyData.filter(row => row.payment === choosenPaymentMethod && row.month === monthNames[currentDate.getMonth()]);
            choosedData = secondaryCurrencyData.filter(row => row.payment === notTheChoosenPaymentMethod && row.month === monthNames[currentDate.getMonth()]);
            break;
          case thirdCurrency:
            choosenData = thirdCurrencyData.filter(row => row.payment === choosenPaymentMethod && row.month === monthNames[currentDate.getMonth()]);
            choosedData = thirdCurrencyData.filter(row => row.payment === notTheChoosenPaymentMethod && row.month === monthNames[currentDate.getMonth()]);
            break;
          default:
            break;
        }
  
        // Get the last entry for the choosen currency
        const incomeOfChoosenC = choosenData.length > 0 ? choosenData[0].income : 0;

        // Get the last entry for the choosed currency
        const incomeOfChoosedC = choosedData.length > 0 ? choosedData[0].income : 0;

        // console.log(choosenCurrency + ": " + incomeOfChoosenC);
        // console.log(choosedCurrency + ": " + incomeOfChoosedC);

        console.log("Choosen Currency's income: " + incomeOfChoosenC);
        console.log("Choosed Currency's income: " + incomeOfChoosedC);

        const updatedChoosenIncomeForCurrentMonth = Number(incomeOfChoosenC) - Number(amount);
        const updatedChoosedIncomeForCurrentMonth = Number(incomeOfChoosedC) + Number(amount);

        console.log("Updated Current Month's (choosen)income: " + updatedChoosenIncomeForCurrentMonth);
        console.log("Updated Current Month's (choosed)income: " + updatedChoosedIncomeForCurrentMonth);


        const choosenPaymentMethodPast = await fetch(`${backendServer}/setIncomeAfterWipe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userEmail"),
            month: monthNames[currentDate.getMonth()], 
            income: updatedChoosenIncomeForCurrentMonth,
            currency: choosenCurrency,
            payment: choosenPaymentMethod,
            difference: Number(currentAmount).toFixed(choosenFormat),
            note: "Collapsable",
            information: "Difference from previous Month(s)",
            year: currentYear,
          }),
        });
        if(!choosenPaymentMethodPast.ok){
          throw new Error('HTTP error ' + choosenPaymentMethodPast.status);
        }
        const choosedPaymentMethodPast = await fetch(`${backendServer}/setIncomeAfterWipe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userEmail"),
            month: monthNames[currentDate.getMonth()], 
            income: updatedChoosedIncomeForCurrentMonth,
            currency: choosenCurrency,
            payment: notTheChoosenPaymentMethod,
            difference: Number(currentAmount).toFixed(choosenFormat),
            note: "Collapsable",
            information: "Difference from previous Month(s)",
            year: currentYear,
          }),
        });
        if(!choosedPaymentMethodPast.ok){
          throw new Error('HTTP error ' + choosedPaymentMethodPast.status);
        }





      }

      // setOtherPaymentMethodsIncome(Number(newIncomeForWithdraw));
      setAmount("");
      setNoteValue("");
      // newIncomeForWithdraw = 0;


    }
    else{
      // - Default Submit
      // console.log("else state at the end.")
      const response = await fetch(`${backendServer}/changespendings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail'),
          type_id: id,
          month: choosenMonth, 
          // monthNames[currentDate.getMonth()]
          income: newIncome,
          amount: Number(currentAmount),
          currency: choosenCurrency,
          payment: choosenPaymentMethod,
          difference: null,
          note: noteValue,
          year: choosenYear,
        })
      });
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      // if(type === 'Savings'){
      //   setAllSavings(prevSavings => [...prevSavings, Number(currentAmount)]);
      // }
      setAmount('');
      setNoteValue("");
    }

    //IF the choosenMonth is not the currentMonth then create another entry in the DB for the currentMonth updated with the income. 
    let currentMonthIncome = 0;

    if(choosenCurrency === primaryCurrency){
      currentMonthIncome = Number(incomeOfPrimaryAccount);
    }
    else if(choosenCurrency === secondaryCurrency){
      currentMonthIncome = Number(incomeOfSecondaryAccount);
    }
    else if(choosenCurrency === thirdCurrency){
      currentMonthIncome = Number(incomeOfThirdAccount);
    }
    else{
      console.log("Error in the choosenCurrency");
      // console.log(choosenCurrency);
      // console.log(currentMonthIncome);
    }
    // console.log(currentMonthIncome);

    const getIncome = await fetch(`${backendServer}/getspendingsUserMonth?user_id=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&month=${monthNames[currentDate.getMonth()]}&currency=${choosenCurrency}&payment=${choosenPaymentMethod}&year=${currentYear}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(!getIncome.ok){
      throw new Error('HTTP error ' + getIncome.status);
    }
    const getIncomeData = await getIncome.json();
    let actualMonthIncome = income;
    if(getIncomeData.length > 0){
      actualMonthIncome = getIncomeData[getIncomeData.length-1].income;
    }
    else{ 
      actualMonthIncome = income;
    }
    // console.log(getIncomeData)
    // console.log("Current Month actual Income "+actualMonthIncome);
    // console.log("Current Amount: "+currentAmount);

    const incomeIfPast = Number(actualMonthIncome) - currentAmount;

    if(type !== 'Withdraw & Deposit'){
      if((choosenMonth !== monthNames[currentDate.getMonth()] || choosenYear !== new Date().getFullYear()) && (type !== 'Exchange')){
        const monthResponse = await fetch(`${backendServer}/setIncomeAfterWipe`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userEmail"),
            month: monthNames[currentDate.getMonth()], 
            income: incomeIfPast,
            currency: choosenCurrency,
            payment: choosenPaymentMethod,
            difference: Number(currentAmount).toFixed(choosenFormat),
            note: "Collapsable",
            information: "Difference from previous Month(s)",
            year: currentYear,
          }),
        });
        if(!monthResponse.ok){
          throw new Error('HTTP error ' + monthResponse.status);
        }
        
        const newIn = Number(currentMonthIncome) - currentAmount;
        if(choosenCurrency === primaryCurrency){
          setPrimaryCurrency(newIn.toString());
        }
        else if(choosenCurrency === secondaryCurrency){
          setSecondaryCurrency(newIn.toString());
        }
        else if(choosenCurrency === thirdCurrency){
          setThirdCurrency(newIn.toString());
        }
        else{
          console.log("Error in the choosenCurrency setting the new income.");
        }
      }
    }
  

    setShowTypes(false);
    setShowNote(false);
    setFetchNow(!fetchNow);
    setIsDataFetched(false);
    setIncome(newIncome);
  }
  const handleSelectChange = (event: { target: { value: any; }; }) => {
    const yearElement = document.getElementsByName('year')[0] as HTMLSelectElement;
    
    setChoosenMonth(event.target.value);
    setChoosenYear(Number(yearElement.value));
    console.log(event.target.value, yearElement.value)



    setAnimationKey(prevKey => prevKey + 1);
    exchangedRef.current?.classList.remove("d-block");
    exchangedRef.current?.classList.add("d-none");
    setAmount("");
    setShowTypes(false);
    setShowNote(false);
  };
  const handleYearChange = (event: { target: { value: any; }; }) => {
    const monthElement = document.getElementsByName('month')[0] as HTMLSelectElement;
    setChoosenYear(Number(event.target.value));
    setTimeout(() => {
      setChoosenMonth(monthElement.options[monthElement.options.length - 1].value);
      console.log(event.target.value, monthElement.options[monthElement.options.length - 1].value);
      (document.getElementsByName('month')[0] as HTMLSelectElement).value = monthElement.options[monthElement.options.length - 1].value;
    }, 2000);
    
    
    setAnimationKey(prevKey => prevKey + 1);
    exchangedRef.current?.classList.remove("d-block");
    exchangedRef.current?.classList.add("d-none");
    setAmount("");
    setShowTypes(false);
    setShowNote(false); 
  };

  // General Data delete from all time.
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
  // Delete everyhthing and the profile as well.
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

  // Settings
  const handleSettingShow = (type: string) => {
    switch (type) {
      case 'profile':
        handleProfileShow();
        break;
      case 'currency':
        handleCurrencyShow();
        break;
      case 'spendings':
        handleSpendingsShow();
        break;
      case 'visibility':
        handleVisibilityShow();
        break;
      default:
        break;
    }
  }
  const handleProfileShow = () => {
    if(ProfileRef.current?.classList.contains("d-none")){
      ProfileRef.current?.classList.remove("d-none");
      ProfileRef.current?.classList.add("d-block");
      CurrencyRef.current?.classList.remove("d-block");
      CurrencyRef.current?.classList.add("d-none");
      SpendingsRef.current?.classList.remove("d-block");
      SpendingsRef.current?.classList.add("d-none");
      VisibilityRef.current?.classList.remove("d-block");
      VisibilityRef.current?.classList.add("d-none");
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
      SpendingsRef.current?.classList.remove("d-block");
      SpendingsRef.current?.classList.add("d-none");
      VisibilityRef.current?.classList.remove("d-block");
      VisibilityRef.current?.classList.add("d-none");
    } else {
      CurrencyRef.current?.classList.remove("d-block");
      CurrencyRef.current?.classList.add("d-none");
    } 
  }
  const handleSpendingsShow = () => {
    if(SpendingsRef.current?.classList.contains("d-none")){
      SpendingsRef.current?.classList.remove("d-none");
      SpendingsRef.current?.classList.add("d-block");
      ProfileRef.current?.classList.remove("d-block");
      ProfileRef.current?.classList.add("d-none");
      CurrencyRef.current?.classList.remove("d-block");
      CurrencyRef.current?.classList.add("d-none");
      VisibilityRef.current?.classList.remove("d-block");
      VisibilityRef.current?.classList.add("d-none");
    } else {
      SpendingsRef.current?.classList.remove("d-block");
      SpendingsRef.current?.classList.add("d-none");
    }
  }
  const handleVisibilityShow = () => {
    if(VisibilityRef.current?.classList.contains("d-none")){
      VisibilityRef.current?.classList.remove("d-none");
      VisibilityRef.current?.classList.add("d-block");
      ProfileRef.current?.classList.remove("d-block");
      ProfileRef.current?.classList.add("d-none");
      CurrencyRef.current?.classList.remove("d-block");
      CurrencyRef.current?.classList.add("d-none");
      SpendingsRef.current?.classList.remove("d-block");
      SpendingsRef.current?.classList.add("d-none");
    } else {
      VisibilityRef.current?.classList.remove("d-block");
      VisibilityRef.current?.classList.add("d-none");
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
  const updateSpendingVisibility: (id: number) => void = (id) => {
    setUpdatedSpendings(prevSpendings => {
      const updated = prevSpendings.map(spending => {
        if (spending.id === id) {
          return { ...spending, visible: !spending.visible };
        }
        return spending;
      });
      setSpendings(updated); // Ensure both states are updated
      return updated;
    });
  }
  const updateUIVisibility: (type: string) => void = (type) => {
    switch (type) {
      case 'income':
        setIncomeVisibility(!incomeVisibility);
        break;
      case 'note':
        setNoteVisibility(!noteVisibility);
        break;
      default:
        break;
    }
  }
  // Settings Changes
  const handleSpendingChange: () => void = async () => {
    const settingsJson = JSON.stringify({
      spendings: spendings.map(spending => ({
        id: spending.id,
        position: spending.position,
        amount: spending.amount,
        type: spending.type,
        emoji: spending.emoji,
        visible: spending.visible
      })),
      visibility: {
        income: incomeVisibility,
        note: noteVisibility,
      }
    });
    

    //Send post method to update the users table in the DB
    const response = await fetch(`${backendServer}/updateSettings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: localStorage.getItem('userEmail'),
        settings: settingsJson
      })
    })
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status);
    }
    setShowSettingsModal(false);
    setFetchNow(true);
  }
  const enableAll: () => void = () => {
    setUpdatedSpendings(prevSpendings => {
      return prevSpendings.map(spending => {
        return {...spending, visible: true};
      });
    });
    setSpendings(prevSpendings => {
      return prevSpendings.map(spending => {
        return {...spending, visible: true};
      });
    });
  }
  const disableAll: () => void = () => {
    setUpdatedSpendings(prevSpendings => {
      return prevSpendings.map(spending => {
        return {...spending, visible: false};
      });
    });
    setSpendings(prevSpendings => {
      return prevSpendings.map(spending => {
        return {...spending, visible: false};
      });
    });
  }
  // Delete an Entry from the Month
  const handleDeleteEntry: (id: number, type: string, amount: number, payment: string) => Promise<void> = async (id: number, type: string, amount: number, payment: string) => {

    if(type === 'Income'){
      setErrorMessage("You can't delete this entry!");
      setShowErrorMessage(true);
    }
    else{
      //Show Are you sure modal
      setModalMessage("Are you sure you want to delete this entry?");
      setShowAreYouSureGenericModal(true);

      setConfirmFunction(() => async () => {
        //Calculate the new income value

        // ! Missing fucntion
        // ? if the month or the year is different we need to also update the current Income value 
        let newIncome = Number(income) + Number(amount);
        switch(type){
          case 'Investment':
            setTotalInvestment(prevTotalInvesment => (Number(prevTotalInvesment) - amount).toFixed(choosenFormat));
            //Send a DELETE request to the server to delete only this entry
                const respo = await fetch(`${backendServer}/deleteSpendingsEntry?id=${id}`, {
                  method: "DELETE",
                  headers: {
                  "Content-Type": "application/json",
                },
              });
              if (!respo.ok) {
                throw new Error('HTTP error ' + respo.status);
              }
                
              //Update the db with the new income value
              const preso = await fetch(`${backendServer}/setIncomeAfterWipe`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: localStorage.getItem("userEmail"),
                  month: choosenMonth, 
                  income: newIncome,
                  currency: choosenCurrency,
                  payment: choosenPaymentMethod,
                  information: "Reverse",
                  year: choosenYear,
                }),
              });
              if (!preso.ok) {
                throw new Error('HTTP error ' + preso.status);
              }
              setIsDataFetched(false);
            break;
          case 'Savings':
            //Send a DELETE request to the server to delete only this entry
            const deleteResponse = await fetch(`${backendServer}/deleteSpendingsEntry?id=${id}`, {
              method: "DELETE",
              headers: {
              "Content-Type": "application/json",
              },
            });
            if (!deleteResponse.ok) {
              throw new Error('HTTP error ' + deleteResponse.status);
            }
            
            //Update the db with the new income value
            const IncomeResponse = await fetch(`${backendServer}/setIncomeAfterWipe`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: localStorage.getItem("userEmail"),
                month: choosenMonth, 
                income: newIncome,
                currency: choosenCurrency,
                payment: choosenPaymentMethod,
                information: "Reverse",
                year: choosenYear,
              }),
            });
            if (!IncomeResponse.ok) {
              throw new Error('HTTP error ' + IncomeResponse.status);
            }
            setTotalSavings(prevTotalSavings => (Number(prevTotalSavings) - amount).toFixed(choosenFormat));
            setFetchNow(!fetchNow);
            setIsDataFetched(false);
            break;
          case 'Withdraw & Deposit':

            // other income means always not the current, choosen one.
            let otherIncome = 0;
            let otherPaymentMethod = payment === 'card' ? 'cash' : 'card';

            /*
              // - Helper Data
              +-------+---------+----------+----------+---------+---------+----------+---------+------------+------------------+-------------------------------------------+------+
              | id    | type_id | month    | income   | saving  | amount  | currency | payment | difference | note             | information                               | year |
              +-------+---------+----------+----------+---------+---------+----------+---------+------------+------------------+-------------------------------------------+------+
              | 14545 |      15 | March    |   430.00 |    NULL |   10.00 | EUR      | card    | 10.00      |                  | NULL                                      | 2025 |
              | 14546 |      15 | March    |   120.00 |    NULL |    NULL | EUR      | cash    | 10.00      |                  | NULL                                      | 2025 |  
              +-------+---------+----------+----------+---------+---------+----------+---------+------------+------------------+-------------------------------------------+------+      
            */

            // - As first step Get the income of the other paymentMethod
            // If the amount is null, that means that payment method is the secondary one.
            // In that case we need to -1 of the id so we could get back the data from that id.
            if(amount === null || amount.toString().includes("null")){
              id=id-1;        
              let getIncomeResponse = await fetch(`${backendServer}/getIncome?userId=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&month=${monthNames[currentDate.getMonth()]}&currency=${choosenCurrency}&payment=${otherPaymentMethod}&id=${id}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (!getIncomeResponse.ok) {
                throw new Error('HTTP error ' + getIncomeResponse.status);
              } 
              let getIncomeData = await getIncomeResponse.json();
              // ? this row might be wrong. Amount is null in that case
              otherIncome = Number(getIncomeData[0].income) + Number(getIncomeData[0].amount);
              newIncome = Number(income) - Number(getIncomeData[0].amount);
            }
            else 
            {
                id=id+1;
                let getIncomeResponse = await fetch(`${backendServer}/getIncome?userId=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&month=${monthNames[currentDate.getMonth()]}&currency=${choosenCurrency}&payment=${otherPaymentMethod}&id=${id}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                if (!getIncomeResponse.ok) {
                  throw new Error('HTTP error ' + getIncomeResponse.status);
                } 
                let getIncomeData = await getIncomeResponse.json();
                newIncome = Number(income) + Number(amount);
                otherIncome = Number(getIncomeData[0].income) - Number(getIncomeData[0].difference);
                id=id-1;
            }
            //Send a post methods to the server to update the income values. 
            //Other payment account
            let otherPaymentMethodPost = await fetch(`${backendServer}/setIncomeAfterWipe`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: localStorage.getItem("userEmail"),
                month: choosenMonth, 
                income: otherIncome,
                currency: choosenCurrency,
                payment: otherPaymentMethod,
                information: "Reverse",
                year: choosenYear,
              }),
            });
            if (!otherPaymentMethodPost.ok) {
              throw new Error('HTTP error ' + otherPaymentMethodPost.status);
            }
            //Current payment account
            let choosenPaymentMethodPost = await fetch(`${backendServer}/setIncomeAfterWipe`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: localStorage.getItem("userEmail"),
                month: choosenMonth, 
                income: newIncome,
                currency: choosenCurrency,
                payment: payment,
                information: "Reverse",
                year: choosenYear,
              }),
            });
            if (!choosenPaymentMethodPost.ok) {
              throw new Error('HTTP error ' + choosenPaymentMethodPost.status);
            } 


            //Not current month
            if(choosenMonth !== monthNames[currentDate.getMonth()] || choosenYear !== new Date().getFullYear()){
              const getIncome = await fetch(`${backendServer}/getspendingsUserMonth?user_id=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&month=${monthNames[currentDate.getMonth()]}&currency=${choosenCurrency}&payment=${payment}&year=${currentYear}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if(!getIncome.ok){
                throw new Error('HTTP error ' + getIncome.status);
              }
              const getIncomeData = await getIncome.json();
              let actualMonthIncome = income;
              if(getIncomeData.length > 0){
                actualMonthIncome = getIncomeData[getIncomeData.length-1].income;
              }
              console.log("Current Month actual Income "+actualMonthIncome);

              const incomeIfPast = Number(actualMonthIncome) - Number(amount);
              console.log(incomeIfPast);
              // const incomeChangePost = await fetch(`${backendServer}/setIncomeAfterWipe`, {
              //   method: "POST",
              //   headers: {
              //     "Content-Type": "application/json",
              //   },
              //   body: JSON.stringify({
              //     userId: localStorage.getItem("userEmail"),
              //     month: monthNames[currentDate.getMonth()], 
              //     income: incomeIfPast,
              //     currency: choosenCurrency,
              //     payment: payment,
              //     difference: Number(amount).toFixed(choosenFormat),
              //     note: "Collapsable",
              //     information: "Difference from previous Month(s)",
              //     year: currentYear,
              //   }),
              // });
              // if(!incomeChangePost.ok){
              //   throw new Error('HTTP error ' + incomeChangePost.status);
              // }
            }

            
            // //Send two Delete methods to the server to delete the two entries.
            let currenctPaymentMethodDelete = await fetch(`${backendServer}/deleteSpendingsEntry?id=${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (!currenctPaymentMethodDelete.ok) {
              throw new Error('HTTP error ' + currenctPaymentMethodDelete.status);
            }
            id=id+1;
            let otherPaymentMethodDelete = await fetch(`${backendServer}/deleteSpendingsEntry?id=${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (!otherPaymentMethodDelete.ok) {
              throw new Error('HTTP error ' + otherPaymentMethodDelete.status);
            }
            id=id-1;
            
            setIncome(newIncome);


            // - Set the new income value to the currentMonths income value.
           
            
            
            // - Post the new Income Value as well.
            if(choosenMonth !== monthNames[currentDate.getMonth()] || choosenYear !== new Date().getFullYear()){
              // - Get the current Income
              const getIncome = await fetch(`${backendServer}/getspendingsUserMonth?user_id=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&month=${monthNames[currentDate.getMonth()]}&currency=${choosenCurrency}&payment=${choosenPaymentMethod}&year=${currentYear}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if(!getIncome.ok){
                throw new Error('HTTP error ' + getIncome.status);
              }
              const getIncomeData = await getIncome.json();
              let actualMonthIncome = income;
              if(getIncomeData.length > 0){
                actualMonthIncome = getIncomeData[getIncomeData.length-1].income;
              }
              console.log("Current Month actual Income "+actualMonthIncome);

              // - Calculate the new income value
              const incomeIfPast = Number(actualMonthIncome) + amount;
              console.log(incomeIfPast);
              // # GET BACK TO HERE :) 
              // const incomeChangePost = await fetch(`${backendServer}/setIncomeAfterWipe`, {
              //   method: "POST",
              //   headers: {
              //     "Content-Type": "application/json",
              //   },
              //   body: JSON.stringify({
              //     userId: localStorage.getItem("userEmail"),
              //     month: monthNames[currentDate.getMonth()], 
              //     income: incomeIfPast,
              //     currency: choosenCurrency,
              //     payment: choosenPaymentMethod,
              //     difference: Number(amount).toFixed(choosenFormat),
              //     note: "Collapsable",
              //     information: "Difference from previous Month(s)",
              //     year: currentYear,
              //   }),
              // });
              // if(!incomeChangePost.ok){
              //   throw new Error('HTTP error ' + incomeChangePost.status);
              // }
            }


            break;
          case "Exchange":
            let otherCIncome = 0;
            let otherCurrencyProfile = '';
            let otherCurrencyProfileLatestIncome = 0;
            let otherCurrencyProfileGotExchanged = 0;
            // //If there is no secondary currency just revert the spendings like a siple spent category. 

            // //If there is a secondary currency or third currency check which one is the other currency.
            // //To do that first we need to get the next line from the DB. 
            // //After that we need to se set the otherCurrencyProfile to the other currency name.
            // //Then we can start the calculations and delete and insert into the db.

            // // console.log(amount);
            // //If the Entry amount is 0 or null ->
            if(amount === null || amount.toString().includes("null")){
              // console.log("Amount is 0 -> Other Profile")
              id=id+1;
              console.log(id);
              let getIncomeResponse = await fetch(`${backendServer}/getIncome?userId=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&id=${id}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (!getIncomeResponse.ok) {
                throw new Error('HTTP error ' + getIncomeResponse.status);
              } 
              let getIncomeData = await getIncomeResponse.json();

              //Get the latest income value from the other currency profile. 
              if(getIncomeData[0].type_id === null){
                otherCurrencyProfile = "null";
                newIncome = Number(income) + Number(amount);
              }
              if(getIncomeData[0].type_id === 17){
                if(getIncomeData[0].currency === choosenCurrency){
                  otherCurrencyProfile = "null";
                  newIncome = Number(income) + Number(amount);
                }
                else{
                  // console.log("Other Currency Profile: "+getIncomeData[0].currency);
                  otherCurrencyProfile = getIncomeData[0].currency;

                  if(otherCurrencyProfile === primaryCurrency){
                    //Go trough the data where type_id is 17 before the getIncomeData[0].type_id and payment is same as getIncomeData[0].payment and get the income value.
                    for (let i = primaryCurrencyData.length - 1; i >= 0; i--) {
                      const element = primaryCurrencyData[i];
                      if (element.id === id) {
                        otherCurrencyProfileGotExchanged = element.difference;
                      }
                      otherCurrencyProfileLatestIncome = Number(parseFloat(incomeOfPrimaryAccount));
                    }
                  }
                  if(otherCurrencyProfile === secondaryCurrency){
                    for (let i = secondaryCurrencyData.length - 1; i >= 0; i--) {
                      const element = secondaryCurrencyData[i];
                      if (element.id === id) {
                        otherCurrencyProfileGotExchanged = element.difference;
                      }
                      otherCurrencyProfileLatestIncome = Number(parseFloat(incomeOfSecondaryAccount));
                    }
                  }
                  if(otherCurrencyProfile === thirdCurrency){
                    for (let i = thirdCurrencyData.length - 1; i >= 0; i--) {
                      const element = thirdCurrencyData[i];
                      if (element.id === id) {
                        otherCurrencyProfileGotExchanged = element.difference;
                      }
                      otherCurrencyProfileLatestIncome = Number(parseFloat(incomeOfThirdAccount));
                    }
                  }

                  // console.log("latest income: " + otherCurrencyProfileLatestIncome);
                  // console.log("got exchanged: " + otherCurrencyProfileGotExchanged);
                  otherCIncome = Number(otherCurrencyProfileLatestIncome) + Number(otherCurrencyProfileGotExchanged);

                  


                  //To calculate the new Income on this current Currency Profile we need the previous income VAlue. \
                  id=id-1;
                  let getIncomeResponse2 = await fetch(`${backendServer}/getIncome?userId=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&id=${id}`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                  if (!getIncomeResponse2.ok) {
                    throw new Error('HTTP error ' + getIncomeResponse2.status);
                  } 
                  let getDifferenceCurrentProfile = await getIncomeResponse2.json();
                  
                  let latestIncomeCurrentProfile = 0;
                  if(choosenCurrency === primaryCurrency){
                    latestIncomeCurrentProfile = Number(parseFloat(incomeOfPrimaryAccount));
                  }
                  if(choosenCurrency === secondaryCurrency){
                    latestIncomeCurrentProfile = Number(parseFloat(incomeOfSecondaryAccount));
                  }
                  if(choosenCurrency === thirdCurrency){
                    latestIncomeCurrentProfile = Number(parseFloat(incomeOfThirdAccount));
                  }

                  newIncome = Number(latestIncomeCurrentProfile) - Number(getDifferenceCurrentProfile[0].difference);

                  id = id-1;
                  // console.log("Current Profiles new Income: " + newIncome);
                  // console.log("Other Currencys Income After Calculation: "+ otherCIncome);
                }
              }
            }
            else 
            { /* If the Entry is not Null ->   In that scenario the user wants to delete the exchange from the currency profile where it was initiated first. */
              console.log("Amount is not 0 -> Current Profile")
                id=id-1;
                let getIncomeResponse = await fetch(`${backendServer}/getIncome?userId=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&id=${id}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                if (!getIncomeResponse.ok) {
                  setErrorMessage("You can't delete this entry!");
                  setShowErrorMessage(true);
                  // throw new Error('HTTP error ' + getIncomeResponse.status);

                } 
                let getIncomeData = await getIncomeResponse.json();
                newIncome = Number(income) + Number(amount);

                // if(getIncomeData[0].type_id === null){
                //   otherCurrencyProfile = "null";
                //   newIncome = Number(income) + Number(amount);
                // }
                // console.log(getIncomeData);
                if (getIncomeData.length === 0 || getIncomeData[0] === undefined) {
                  otherCurrencyProfile = "null";
                } else if (getIncomeData[0].type_id === 17) {
                  if (getIncomeData[0].currency !== choosenCurrency) {
                    otherCurrencyProfile = getIncomeData[0].currency;
                
                    // To calculate the otherCurrencysIncome we need to get the previous income from that Currency profile and from that Payment method from the same user. 
                    // After that we can calculate the new income value oldOtherIncome - getIncomeData[0].income
                
                    let otherCurrencyProfilesOlderIncome = 0;
                    if (otherCurrencyProfile === primaryCurrency) {
                      otherCurrencyProfilesOlderIncome = Number(parseFloat(incomeOfPrimaryAccount));
                    }
                    if (otherCurrencyProfile === secondaryCurrency) {
                      otherCurrencyProfilesOlderIncome = Number(parseFloat(incomeOfSecondaryAccount));
                    }
                    if (otherCurrencyProfile === thirdCurrency) {
                      otherCurrencyProfilesOlderIncome = Number(parseFloat(incomeOfThirdAccount));
                    }
                    // console.log("Other Currency profiles Older Income "+ Number(otherCurrencyProfilesOlderIncome));
                    otherCIncome = Number(otherCurrencyProfilesOlderIncome) - Number(getIncomeData[0].difference);
                    // console.log("Other Currency profile New Income: "+otherCIncome);
                }
              }
                // console.log("Choosen Currency Profile: "+ choosenCurrency);
                // console.log("New Income " + newIncome);
                id=id+1;
            }
            if(otherCurrencyProfile === "" || otherCurrencyProfile === 'null'){  
              console.log(id);
              // console.log("Send the Currenct Profile: "+ newIncome);
              //Send a DELETE request to the server to delete only this entry
              const response = await fetch(`${backendServer}/deleteSpendingsEntry?id=${id}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                },
              });
              if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
              }
                
              // Update the db with the new income value
              const postResponse = await fetch(`${backendServer}/setIncomeAfterWipe`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: localStorage.getItem("userEmail"),
                  month: choosenMonth, 
                  income: newIncome,
                  currency: choosenCurrency,
                  payment: choosenPaymentMethod,
                  information: "Reverse",
                  year: choosenYear,
                }),
              });
              setIncome(newIncome);
              if (!postResponse.ok) {
                throw new Error('HTTP error ' + postResponse.status);
              }
            }
            else{
              // console.log("Advanced Delete -> " + otherCurrencyProfile) 

              // console.log("Send the Other Profile firstly: "+ otherCIncome);
              // console.log("Send the Other Profile firstly: "+ otherCurrencyProfile);
              // console.log("Send the Currenct Profile secondly: "+ newIncome);
              // console.log("Send the Currenct Profile secondly: "+ choosenCurrency);
            
              // Send a post methods to the server to update the income values. 
              // Other payment account
              let otherCurrencyPost = await fetch(`${backendServer}/setIncomeAfterWipe`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: localStorage.getItem("userEmail"),
                  month: choosenMonth, 
                  income: otherCIncome,
                  currency: otherCurrencyProfile,
                  payment: choosenPaymentMethod,
                  information: "Reverse",
                  year: choosenYear,
                }),
              });
              if (!otherCurrencyPost.ok) {
                  throw new Error('HTTP error ' + otherCurrencyPost.status);
              }
              // Current payment account
              let choosenCurrencyPost = await fetch(`${backendServer}/setIncomeAfterWipe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify({
                  userId: localStorage.getItem("userEmail"),
                  month: choosenMonth, 
                  income: newIncome,
                  currency: choosenCurrency,
                  payment: choosenPaymentMethod,
                  information: "Reverse",
                  year: choosenYear,
                 }),
              });
              if (!choosenCurrencyPost.ok) {
                  throw new Error('HTTP error ' + choosenCurrencyPost.status);
              } 
              setIncome(newIncome);

              
              if(amount === null || amount.toString().includes("null")){
                id=id+1
              }
              else{
                id=id-1;
              }
              console.log(id);
              // Send two Delete methods to the server to delete the two entries.
              let choosenCurrencyDelete = await fetch(`${backendServer}/deleteSpendingsEntry?id=${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                  },
                });
              if (!choosenCurrencyDelete.ok) {
                throw new Error('HTTP error ' + choosenCurrencyDelete.status);
              }    
              id = id+1;
              console.log(id);
              let otherCurrencyDelete = await fetch(`${backendServer}/deleteSpendingsEntry?id=${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
              });
              if (!otherCurrencyDelete.ok) {
                  throw new Error('HTTP error ' + otherCurrencyDelete.status);
              }
            }
            break;
          default:
            // ? Here is another bug with positive and negative values? 
            //Send a DELETE request to the server to delete only this entry
            const response = await fetch(`${backendServer}/deleteSpendingsEntry?id=${id}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
              },
            });
            if (!response.ok) {
              throw new Error('HTTP error ' + response.status);
            }
             
            //IF the choosenMonth is not the currentMonth then, add the amount to the currentMonthsIncome. 
            if(choosenMonth !== monthNames[currentDate.getMonth()] || choosenYear !== new Date().getFullYear()){
              const getIncome = await fetch(`${backendServer}/getspendingsUserMonth?user_id=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&month=${monthNames[currentDate.getMonth()]}&currency=${choosenCurrency}&payment=${payment}&year=${currentYear}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if(!getIncome.ok){
                throw new Error('HTTP error ' + getIncome.status);
              }
              const getIncomeData = await getIncome.json();
              let actualMonthIncome = income;
              if(getIncomeData.length > 0){
                actualMonthIncome = getIncomeData[getIncomeData.length-1].income;
              }
              console.log("Current Month actual Income "+actualMonthIncome);

              const incomeIfPast = Number(actualMonthIncome) + Number(amount);
              console.log(incomeIfPast);
              const incomeChangePost = await fetch(`${backendServer}/setIncomeAfterWipe`, {
                method: "POST", 
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: localStorage.getItem("userEmail"),
                  month: monthNames[currentDate.getMonth()], 
                  income: incomeIfPast,
                  currency: choosenCurrency,
                  payment: payment,
                  difference: Number(amount).toFixed(choosenFormat),
                  note: "Collapsable",
                  information: "Difference from previous Month(s)",
                  year: currentYear,
                }),
              });
              if(!incomeChangePost.ok){
                throw new Error('HTTP error ' + incomeChangePost.status);
              }
            }

            //Update the db with the new income value
            const postResponse = await fetch(`${backendServer}/setIncomeAfterWipe`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: localStorage.getItem("userEmail"),
                month: choosenMonth, 
                income: newIncome,
                currency: choosenCurrency,
                payment: choosenPaymentMethod,
                information: "Reverse",
                year: choosenYear,
              }),
            });
            if (!postResponse.ok) {
              throw new Error('HTTP error ' + postResponse.status);
            }
            setIsDataFetched(false);
          break;
            }

        setFetchNow(!fetchNow);
        setIncome(newIncome);

        setShowAreYouSureGenericModal(false);
      });
    }
    }
  // Calculates the total amount of the entries
  const getEntryAmount = (entry: Log) => {
    // ? could be a bug here with Log NAN output
    // if(choosenMonth !== monthNames[currentDate.getMonth()])
    if ((entry.type === "Exchange" || entry.type === "Withdraw & Deposit") && entry.amount === null) {
      return "+" + Number(entry.difference).toFixed(choosenFormat) + choosenTag;
    } else if (entry.type === "Income" && entry.amount === null) {
      if(entry.difference <= 0){
        const income = Number(entry.difference).toFixed(choosenFormat).slice(1);
        return "-" + income + choosenTag;
      }
      else{
        return "+" + Number(entry.difference).toFixed(choosenFormat) + choosenTag;
      }
    } else {
      if(entry.amount <= 0)
      {
        const amount = Number(entry.amount || 0).toFixed(choosenFormat).slice(1);
        return "+" + amount + choosenTag;
      }
      else{
        return (entry.amount >= 0 ? "-" : "" ) + Number(entry.amount).toFixed(choosenFormat) + choosenTag;
      }
    }
  };
  // Edit Category Change
  const handleCategoryChange = (event: { target: { value: string; }; }) => {
    const selectedValue = event.target.value; // Declare the 'selectedValue' variable
  
    if (selectedValue === "Choose an option") {
      // Reset logEntries to show all items
      setLogEntries(allLogEntries); // Assuming allLogEntries contains all the log entries
    } else {
      // const selectedCategory = updatedSpendings.find(spending => spending.id === parseInt(selectedValue))?.type || '';
      // console.log(selectedCategory);
      // setLogEntries(prevLogEntries => {
      //   return prevLogEntries.filter(entry => entry.type === selectedCategory);
      // });
      const selectedCategory = updatedSpendings.find(spending => spending.id === parseInt(selectedValue))?.type || '';

      setLogEntries(allLogEntries.filter(entry => entry.type === selectedCategory));
    }
  };
  // Based on the id of the spendings it determines if the user can edit or not the entry.
  const getTitle = (date: string, monthNames: string[], entry: { type: string }) => { 
    // const currentMonthName = monthNames[currentDate.getMonth()];
    // if (date !== currentMonthName) {
    //   return "You can't edit past Entries!";
    // }
    // console.log(date, monthNames)
    if (entry.type === 'Income' ) { //|| entry.type === 'Exchange'
      return "You can't edit this Entry!";
    }
    else if(entry.type === 'Exchange' || entry.type === "Withdraw" ){
      // # For later change it here accordignly Exchange Witdraw TITLE
      return "Click to delete this Entry!";
    }
    return "Click to edit this entry!";
  };
  // Looks for the click event
  const handleEditClick = (entry: Log) => {
    if (entry.type === 'Income') {
      setErrorMessage("You can't edit this entry!");
      setShowErrorMessage(true);
    }
    else {
      if (editingEntryId === entry.id) {
        // If the same entry is clicked again, exit edit mode
        setEditingEntryId(0);
      } else {
        // Enter edit mode for the clicked entry
        // setEditedAmount(entry.amount);
        entry.amount === (0 || null) ? setEditedAmount(entry.difference) : setEditedAmount(entry.amount);
        setEditingEntryId(entry.id);
        setEditedNote(entry.note);
        setEditedCategory(entry.type);
      }
    }
  }
  //Based on the Changes in the Edit Modal it updates the state of the editedAmount
  const handleEntryChange = async (entry: Log) => {
    // Save the changes (e.g., update the state or make an API call)
    setEditingEntryId(0);
    // ! Missing function
    // ? if the month or the year is different we need to also update the current Income value 
    // - We need the current months income value and the actual months income. 
    switch (entry.type) {
      case 'Income':
        setErrorMessage("You can't edit this entry!");
        setShowErrorMessage(true);
        break;
      case 'Investment':
        //Remove from the total Investment or add then run the default section. 
        const newIncomeInv = ( Number(income) + Number(entry.amount) ) - Number(editedAmount);
        const typeInv = updatedSpendings.find(spending => spending.type === editedCategory)?.id || 0;

        // console.log("ID: "+entry.id);
        // console.log("Original Type: "+entry.type);
        // console.log("Edited Type: "+typeInv);
        // console.log("Amount: "+Number(entry.amount).toFixed(choosenFormat));
        // console.log("Difference: "+ Number(entry.difference).toFixed(choosenFormat))
        // console.log("Edited Amount: "+Number(entry.amount).toFixed(choosenFormat))
        // console.log("NEW INCOME: "+Number(newIncomeInv).toFixed(choosenFormat));

        // console.log("Default Note: "+entry.note);
        // console.log("Updated Note: "+editedNote);
        // Send a PUT request to the server to update the entry
        const postResponseINV = await fetch(`${backendServer}/editEntry`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userEmail"),
            id: entry.id,
            amount: Number(editedAmount).toFixed(choosenFormat),
            month: choosenMonth,
            type_id: typeInv,
            income: newIncomeInv,
            currency: choosenCurrency,
            payment: choosenPaymentMethod,
            difference: Number(entry.difference).toFixed(choosenFormat),
            note: editedNote,
            information: "Edited",
            year: choosenYear,
          }),
        });
        if (!postResponseINV.ok) {
          throw new Error('HTTP error ' + postResponseINV.status);
        }
        const postINCOMEINV = await fetch(`${backendServer}/setIncomeAfterWipe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userEmail"),
            month: choosenMonth,
            income: newIncomeInv,
            currency: choosenCurrency,
            payment: choosenPaymentMethod,
            information: "Edited Income",
            year: choosenYear,
          }),
        });
        if(!postINCOMEINV.ok){
          throw new Error('HTTP error ' + postINCOMEINV.status);
        }

        setTotalInvestment(prevTotalInvesment => (Number(prevTotalInvesment) - Number(entry.amount)+Number(editedAmount)).toFixed(choosenFormat));
        // console.log(Number(totalInvestment)-Number(entry.amount)+Number(editedAmount));
        // console.log(totalInvestment);
        setIncome(newIncomeInv);
        // setFetchNow(!fetchNow);
        break;
      case 'Savings':
        const newIncomeSav = ( Number(income) + Number(entry.amount) ) - Number(editedAmount);
        const typeSav = updatedSpendings.find(spending => spending.type === editedCategory)?.id || 0;
        const newSaving = (Number(entry.saving) - Number(entry.amount) + Number(editedAmount)).toFixed(choosenFormat);

        const postResponseSAV = await fetch(`${backendServer}/editEntry`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userEmail"),
            id: entry.id,
            amount: Number(editedAmount).toFixed(choosenFormat),
            saving: Number(newSaving).toFixed(choosenFormat),
            month: choosenMonth,
            type_id: typeSav,
            income: newIncomeSav,
            currency: choosenCurrency,
            payment: choosenPaymentMethod,
            difference: Number(entry.difference).toFixed(choosenFormat),
            note: editedNote,
            information: "Edited",
            year: choosenYear,
          }),
        });
        if (!postResponseSAV.ok) {
          throw new Error('HTTP error ' + postResponseSAV.status);
        }
        const postINCOMESAV = await fetch(`${backendServer}/setIncomeAfterWipe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userEmail"),
            month: choosenMonth,
            income: newIncomeSav,
            currency: choosenCurrency,
            payment: choosenPaymentMethod,
            information: "Edited Income",
            year: choosenYear,
          }),
        });
        if(!postINCOMESAV.ok){
          throw new Error('HTTP error ' + postINCOMESAV.status);
        }

        setTotalSavings(prevTotalSaving => (Number(prevTotalSaving) - Number(entry.amount) + Number(editedAmount)).toFixed(choosenFormat));
        // console.log(Number(prevTotalSaving)-Number(entry.amount)+Number(editedAmount));
        // console.log(totalSavings);
        setIncome(newIncomeSav);
        // setFetchNow(!fetchNow);
        break;
      case 'Withdraw & Deposit':
        /* 
        //Calculate the new income value for both payment methods.
        //Chose the other payment method
        let otherIncome = 0;
        let currentIncome = 0;
        // let otherPaymentMethod = (choosenPaymentMethod === 'card' ? 'cash' : 'card');
        let comeFrom = "";
        // let searchedId = entry.id;
        let otherId = 0;
        let currentId = 0;
        let amountForOriginal = null;
        let differencBetweenAmounts = Number(entry.difference) - Number(editedAmount);
        
        // +-------+-----------------------+---------+-----------+-----------+--------+-----------+----------+---------+------------+------+-------------+
        // | id    | user_email            | type_id | month     | income    | saving | amount    | currency | payment | difference | note | information |
        // +-------+-----------------------+---------+-----------+-----------+--------+-----------+----------+---------+------------+------+-------------+
        // | 13829 | legoger0312@gmail.com |    NULL | September |     18.00 |   NULL |      NULL | EUR      | cash    | 18.00      | NULL | NULL        |
        // | 13830 | legoger0312@gmail.com |      15 | September |    900.00 |   NULL |     82.00 | EUR      | card    | 82.00      |      | NULL        | 82 side
        // | 13831 | legoger0312@gmail.com |      15 | September |    100.00 |   NULL |      NULL | EUR      | cash    | 82.00      |      | NULL        | 0  side


        //Change on 0 side amount will be 90 then the income of that accound should be income+difference-editedAmount the other account should be income-amount+editedAmount? 
        //so the changed amount is 90 insted of the 82. that means the income of the other accout is 900-82=818+90=908 other account is = 100+82=182-90=92
        
        //Change on 82 side amount will be 90 as well. 
        //Income the current account will be then: 900-82+90=908 that means income-amount+editedAmount
        //Income the other account will be then: 100+82-90=92 that means income+difference-editedAmount


        // Another Example
        // +-------+-----------------------+---------+-----------+-----------+--------+-----------+----------+---------+------------+------+-------------+
        // | id    | user_email            | type_id | month     | income    | saving | amount    | currency | payment | difference | note | information |
        // +-------+-----------------------+---------+-----------+-----------+--------+-----------+----------+---------+------------+------+-------------+
        // | 13855 | legoger0312@gmail.com |    NULL | September | 100.00 |   NULL |   NULL | EUR      | card    | 0.00       | NULL | NULL        |
        // | 13856 | legoger0312@gmail.com |    NULL | September |  30.00 |   NULL |   NULL | EUR      | cash    | 0.00       | NULL | NULL        |
        // | 13857 | legoger0312@gmail.com |      15 | September |  50.00 |   NULL |  50.00 | EUR      | card    | 50.00      |      | NULL        |
        // | 13858 | legoger0312@gmail.com |      15 | September |  80.00 |   NULL |   NULL | EUR      | cash    | 50.00      |      | NULL        |
        // +-------+-----------------------+---------+-----------+--------+--------+--------+----------+---------+------------+------+-------------+


        //New calculation methode. We counted the difference of the original amount and the edited amount. 
        //We will change the 50 to 70. In this case the differenceBetweenAmounts will be (-20).
        
        //If amount is not null. IN our case it is 50.
        //income = income - differnceBetweenAmounts
        //otherIncome = otherIncome + differnceBetweenAmounts

        //If amount is null. In our case it is 0.
        //income = income + differnceBetweenAmounts
        //otherIncome = otherIncome - differnceBetweenAmounts


        //This should be the outcome no matter what.
        // | 13857 | legoger0312@gmail.com |      15 | September | 30.00 |   NULL |  70.00 | EUR      | card    | 70.00      |      | Edited      |
        // | 13858 | legoger0312@gmail.com |      15 | September | 100.00 |   NULL |  70.00 | EUR      | cash    | 70.00      |      | Edited      |
        // +-------+-----------------------+---------+-----------+--------+--------+--------+----------+---------+------------+------+-------------+


        if(entry.amount === null || entry.amount.toString().includes("null")){
          comeFrom = (entry.payment === 'card' ? 'cash' : 'card');
          // console.log("felso");
          // console.log(comeFrom);
          //id should be: entry.id
          //searchedId should be: entry.id + 1
          currentId = entry.id 
          otherId = entry.id - 1;
          if(choosenPaymentMethod === comeFrom){
            amountForOriginal = Number(editedAmount);
            // console.log("Amount Value: "+amountForOriginal);
          }
        }
        else{
          comeFrom = (entry.payment === 'card' ? 'card' : 'cash');
          // console.log("also")
          // console.log(comeFrom);
          //Here we need to set the amount. 
          //id should be: entry.id
          //searchedId should be: entry.id - 1
          currentId = entry.id
          otherId = entry.id + 1;
          if(choosenPaymentMethod === comeFrom){
            amountForOriginal = Number(editedAmount);
            // console.log("Amount Value: "+amountForOriginal);
          }
        }

        // console.log(currentId);
        // console.log(otherId);
        if(entry.amount === null || entry.amount.toString().includes("null")){
          // console.log("Amount is 0 and + -> Other Profile")

          const fetchResponse = await fetch(`${backendServer}/getIncome?userId=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&month=${monthNames[currentDate.getMonth()]}&currency=${choosenCurrency}&payment=${comeFrom}&id=${otherId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if(!fetchResponse.ok){
            throw new Error('HTTP error ' + fetchResponse.status);
          }
          const data = await fetchResponse.json();
          // console.log(data);
          otherIncome = Number(data[0].income) + Number(differencBetweenAmounts);
          currentIncome = Number(income) - Number(differencBetweenAmounts);

        }
        else{
          // console.log("Amount is not 0 -> Current Profile")
          const fetchResponse = await fetch(`${backendServer}/getIncome?userId=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&month=${monthNames[currentDate.getMonth()]}&currency=${choosenCurrency}&payment=${comeFrom}&id=${otherId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if(!fetchResponse.ok){
            throw new Error('HTTP error ' + fetchResponse.status);
          }
          const data = await fetchResponse.json();
          // console.log(data);
          otherIncome = Number(data[0].income) - Number(differencBetweenAmounts) ;
          currentIncome = Number(income) + Number(differencBetweenAmounts);
        }
        
        // console.log("//////////////////////////////////////////////////////////////////")
        // console.log("Current id: "+currentId);
        // console.log("Current Income: "+currentIncome);
        // console.log("------------------")
        // console.log("Other id: " +otherId);
        // console.log("Other income: " +otherIncome);
        // console.log("//////////////////////////////////////////////////////////////////")
        


        //We need change the amount only on the original entry. where we have an amount. 
        //if we dont have an amount just pass it without amount. We need to aufpassen which payment method was the original. 
        
        // console.log(entry.amount);
        // console.log(entry.payment);
        //we got the comeFrom value which helps us to understand where does the original entry come from.
        //we need to get also which id belong to where and which incom belong to where.

        //Then send the to update like this
        //First: otherid, otherPaymentMethode, otherIncome, difference = editedAmount
        //Second: searchedId, entry.payment, currentIncome, difference = editedAmount, amount = editedAmount


        if(amountForOriginal !== null && choosenPaymentMethod === comeFrom){
          //Current
          // console.log("This will be the current account");
          // console.log(comeFrom);
          // console.log(currentId);
          //send amount for current
          //send other account as well without amount

          // 
          //Current
          let choosenPaymentMethodPost = await fetch(`${backendServer}/editEntry`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: localStorage.getItem("userEmail"),
              id: currentId,
              amount: Number(editedAmount).toFixed(choosenFormat),
              month: choosenMonth,
              type_id: 15,
              income: Number(currentIncome).toFixed(choosenFormat),
              currency: choosenCurrency,
              payment: choosenPaymentMethod,
              difference: Number(editedAmount).toFixed(choosenFormat),
              note: editedNote,
              information: "Edited",
              year: choosenYear,
            }),
          });
          if(!choosenPaymentMethodPost.ok){
            throw new Error('HTTP error ' + choosenPaymentMethodPost.status);
          }

          comeFrom = (choosenPaymentMethod === 'card' ? 'cash' : 'card');
          // console.log(comeFrom)
          //Other
          let otherPaymentMethodPost = await fetch(`${backendServer}/editEntry`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: localStorage.getItem("userEmail"),
              id: otherId,
              // amount: Number(editedAmount).toFixed(choosenFormat),
              month: choosenMonth,
              type_id: 15,
              income: Number(otherIncome).toFixed(choosenFormat),
              currency: choosenCurrency,
              payment: comeFrom,
              difference: Number(editedAmount).toFixed(choosenFormat),
              note: editedNote,
              information: "Edited",
              year: choosenYear,
            }),
          });
          if(!otherPaymentMethodPost.ok){
            throw new Error('HTTP error ' + otherPaymentMethodPost.status);
          }
          // 
        }
        else{
          //send without amount for current and send for other
          // console.log("This will be the other account");
          // console.log(currentId)
          comeFrom = (choosenPaymentMethod === 'card' ? 'cash' : 'card');
          // console.log(comeFrom)
          //No AMOUNT 

          // /*
          //Current
          let choosenPaymentMethodPost = await fetch(`${backendServer}/editEntry`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: localStorage.getItem("userEmail"),
              id: currentId,
              // amount: Number(editedAmount).toFixed(choosenFormat),
              month: choosenMonth,
              type_id: 15,
              income: Number(currentIncome).toFixed(choosenFormat),
              currency: choosenCurrency,
              payment: choosenPaymentMethod,
              difference: Number(editedAmount).toFixed(choosenFormat),
              note: editedNote,
              information: "Edited",
              year: choosenYear,
            }),
          });
          if(!choosenPaymentMethodPost.ok){
            throw new Error('HTTP error ' + choosenPaymentMethodPost.status);
          }

          // comeFrom = (comeFrom === 'card' ? 'cash' : 'card');
          // console.log(comeFrom)
          
          //Other
          let otherPaymentMethodPost = await fetch(`${backendServer}/editEntry`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: localStorage.getItem("userEmail"),
              id: otherId,
              amount: Number(editedAmount).toFixed(choosenFormat),
              month: choosenMonth,
              type_id: 15,
              income: Number(otherIncome).toFixed(choosenFormat),
              currency: choosenCurrency,
              payment: comeFrom,
              difference: Number(editedAmount).toFixed(choosenFormat),
              note: editedNote,
              information: "Edited",
              year: choosenYear,
            }),
          });
          if(!otherPaymentMethodPost.ok){
            throw new Error('HTTP error ' + otherPaymentMethodPost.status);
          }
          // 
        }

        otherId = 0;
        currentId = 0;
        differencBetweenAmounts = 0;
        setFetchNow(!fetchNow);
        setIncome(currentIncome);
        */
        break;
      default:
        // ? Here is huge bug. Not always. Maybe fixed. NOT

        const type = updatedSpendings.find(spending => spending.type === editedCategory)?.id || 0;

        let dataPast = [];
        let data = [];

        switch (choosenCurrency) {
          case primaryCurrency:
            data = primaryCurrencyData.filter(row => row.payment === choosenPaymentMethod && row.month === monthNames[currentDate.getMonth()]);
            break;
          case secondaryCurrency:
            data = secondaryCurrencyData.filter(row => row.payment === choosenPaymentMethod && row.month === monthNames[currentDate.getMonth()]);
            break;
          case thirdCurrency:
            data = thirdCurrencyData.filter(row => row.payment === choosenPaymentMethod && row.month === monthNames[currentDate.getMonth()]);
            break;
          default:
            break;
        }

        switch (choosenCurrency) {
          case primaryCurrency:
            dataPast = primaryCurrencyData.filter(row => row.payment === choosenPaymentMethod && row.month === choosenMonth);
            break;
          case secondaryCurrency:
            dataPast = secondaryCurrencyData.filter(row => row.payment === choosenPaymentMethod && row.month === choosenMonth);
            break;
          case thirdCurrency:
            dataPast = thirdCurrencyData.filter(row => row.payment === choosenPaymentMethod && row.month === choosenMonth);
            break;
          default:
            break;
        }

        const incomePast = dataPast.length > 0 ? dataPast[0].income : 0;
        const incomeCurrent = data.length > 0 ? data[0].income : 0;

        console.log("Income Current: "+incomeCurrent);
        console.log("Income Past: "+incomePast);
        console.log("Edited Amount: "+editedAmount);
        console.log("Entry Amount: "+entry.amount);

        const newIncomeOfPast = Number(incomePast) + Number(entry.amount) - Number(editedAmount);
        const newIncomeOfCurrent = Number(incomeCurrent) + Number(entry.amount) - Number(editedAmount);

        console.log("Past income: "+newIncomeOfPast);
        console.log("Current income: "+newIncomeOfCurrent);

        // ChoosenMonth
        const postResponse = await fetch(`${backendServer}/editEntry`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userEmail"),
            id: entry.id,
            amount: Number(editedAmount).toFixed(choosenFormat),
            month: choosenMonth,
            type_id: type,
            currency: choosenCurrency,
            payment: choosenPaymentMethod,
            difference: Number(entry.difference).toFixed(choosenFormat),
            note: editedNote,
            information: "Edited",
            year: choosenYear,
          }),
        });
        if (!postResponse.ok) {
          throw new Error('HTTP error ' + postResponse.status);
        }
        const choosenMonthResponse = await fetch(`${backendServer}/setIncomeAfterWipe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userEmail"),
            month: choosenMonth, 
            income: newIncomeOfPast,
            currency: choosenCurrency,
            payment: choosenPaymentMethod,
            note: "Collapsable",
            information: "Difference from previous Month(s)",
            year: choosenYear,
          }),
        });
        if(!choosenMonthResponse.ok){
          throw new Error('HTTP error ' + choosenMonthResponse.status);
        }

        // Current Month
        if(choosenMonth !== monthNames[currentDate.getMonth()] || choosenYear !== new Date().getFullYear()){
          const currentMonthResponse = await fetch(`${backendServer}/setIncomeAfterWipe`, {
              method: "POST",
              headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: localStorage.getItem("userEmail"),
              month: monthNames[currentDate.getMonth()], 
              income: newIncomeOfCurrent,
              currency: choosenCurrency,
              payment: choosenPaymentMethod,
              note: "Collapsable",
              information: "Difference from previous Month(s)",
              year: currentYear,
            }),
          });
          if(!currentMonthResponse.ok){
            throw new Error('HTTP error ' + currentMonthResponse.status);
          }
        }


        /*
        // - Set the actual current Months Income
        const pastChange = monthNames[currentDate.getMonth()] !== choosenMonth;
        console.log(localStorage.getItem("userEmail"), monthNames[currentDate.getMonth()], choosenCurrency, choosenPaymentMethod, choosenYear);
        const getIncome = await fetch(`${backendServer}/getspendingsUserMonth?user_id=${encodeURIComponent(localStorage.getItem("userEmail") || "")}&month=${monthNames[currentDate.getMonth()]}&currency=${choosenCurrency}&payment=${choosenPaymentMethod}&year=${choosenYear}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if(!getIncome.ok){
          throw new Error('HTTP error ' + getIncome.status);
        }
        const getIncomeData = await getIncome.json();
        let actualMonthIncome = income;
        if(getIncomeData.length > 0){
          actualMonthIncome = getIncomeData[getIncomeData.length-1].income;
        }
        console.log("Current Month actual Income "+actualMonthIncome);
        const newIncomeForActualMonth = Number(actualMonthIncome) + (Number(entry.amount) - Number(editedAmount));
        console.log("New Income for actual Month "+ newIncomeForActualMonth);
        
        if(pastChange){ //If the choosen month is not the actual month...
          console.log("Its past change");
          const pastINCOME = await fetch(`${backendServer}/setIncomeAfterWipe`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: localStorage.getItem("userEmail"),
              month: monthNames[currentDate.getMonth()],
              income: newIncomeForActualMonth,
              currency: choosenCurrency,
              payment: choosenPaymentMethod,
              information: "Edited Income",
              year: currentYear,
            }),
          });
          if(!pastINCOME.ok){
            throw new Error('HTTP error ' + pastINCOME.status);
          }
        }
        
        // - Set the choosenMonths Income. 
        const newIncome = ( Number(income) + Number(entry.amount) ) - Number(editedAmount);
        const type = updatedSpendings.find(spending => spending.type === editedCategory)?.id || 0;
        console.log("ID: "+entry.id);
        console.log("Original Type: "+entry.type);
        console.log("Edited Type: "+type);
        console.log("Amount: "+Number(entry.amount).toFixed(choosenFormat));
        console.log("Difference: "+ Number(entry.difference).toFixed(choosenFormat))
        console.log("Edited Amount: "+Number(entry.amount).toFixed(choosenFormat))
        console.log("NEW INCOME: "+Number(newIncome).toFixed(choosenFormat));

        console.log("Default Note: "+entry.note);
        console.log("Updated Note: "+editedNote);
        // Send a PUT request to the server to update the entry
        
        const postResponse = await fetch(`${backendServer}/editEntry`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userEmail"),
            id: entry.id,
            amount: Number(editedAmount).toFixed(choosenFormat),
            month: choosenMonth,
            type_id: type,
            income: newIncome,
            currency: choosenCurrency,
            payment: choosenPaymentMethod,
            difference: Number(entry.difference).toFixed(choosenFormat),
            note: editedNote,
            information: "Edited",
            year: choosenYear,
          }),
        });
        if (!postResponse.ok) {
          throw new Error('HTTP error ' + postResponse.status);
        }
        const postINCOME = await fetch(`${backendServer}/setIncomeAfterWipe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userEmail"),
            month: choosenMonth,
            income: newIncome,
            currency: choosenCurrency,
            payment: choosenPaymentMethod,
            information: "Edited Income",
            year: choosenYear,
          }),
        });
        if(!postINCOME.ok){
          throw new Error('HTTP error ' + postINCOME.status);
        }
        */

        setFetchNow(!fetchNow);
        // setIncome(newIncome);
        break;

    }
  };

  //Functions and Event handlers END
  /*  @end */

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------\\
  
  return (
    <section className="container-fluid"> 
      {/* > Navbar */}
      <nav 
      className="navbar mx-2 d-flex justify-content-around align-items-start">

        {/* > Currency */}
        <div className="col-4 gap-1 gap-md-2 currency d-flex flex-column flex-md-row">
          <> 
            {primaryCurrency !== 'null' && 
              <p 
                className={(choosenCurrency === primaryCurrency ? 'activeCurrency' : '')}  
                key={primaryCurrency} 
                onClick={() => {
                  setChoosenCurrency(primaryCurrency); 
                  setChoosenFormat(getFormatNumber(primaryFormat)); 
                  setChoosenTag(primaryTag);
                  setChoosenPaymentMethod("card");
                  setFetchNow(true);
                  setAnimationKey(prevKey => prevKey + 1);
                  exchangedRef.current?.classList.remove("d-block");
                  exchangedRef.current?.classList.add("d-none");
                  setAmount("");
                }}>
                  {primaryCurrency}
              </p>
            }
            {secondaryCurrency !== 'null' &&
              <p className={choosenCurrency === secondaryCurrency ? 'activeCurrency' : '' } key={secondaryCurrency} onClick={() => {setChoosenCurrency(secondaryCurrency); setChoosenFormat(getFormatNumber(secondaryFormat)); setChoosenTag(secondaryTag); setChoosenPaymentMethod("card"); setFetchNow(true); setAnimationKey(prevKey => prevKey + 1); exchangedRef.current?.classList.remove("d-block"); exchangedRef.current?.classList.add("d-none");setAmount("");}}>{secondaryCurrency}</p>
            }
            {thirdCurrency !== 'null' && 
              <p className={choosenCurrency === thirdCurrency ? 'activeCurrency' : ''} key={thirdCurrency} onClick={() => {setChoosenCurrency(thirdCurrency); setChoosenFormat(getFormatNumber(thirdFormat)); setChoosenTag(thirdTag); setChoosenPaymentMethod("card"); setFetchNow(true); setAnimationKey(prevKey => prevKey + 1); exchangedRef.current?.classList.remove("d-block"); exchangedRef.current?.classList.add("d-none");setAmount("");}}>{thirdCurrency}</p>
            }
          </>
        </div>

        {/* > Cash/Card ; Date ; Bin  */}
        <div className="col-4 my-lg-5 d-flex justify-content-center">
        
          <h5 className="text-center d-flex flex-row align-items-center gap-1 gap-md-3">
            {/* > Cash Card Icon */}
            <button title="Swap between Cash and Card" className="button-round pointer d-flex align-items-center justify-content-center" onClick={() => {setChoosenPaymentMethod(choosenPaymentMethod === "cash" ? "card" : "cash"); setAnimationKey(prevKey => prevKey + 1); setAmount(""); setShowTypes(false);setShowNote(false);}}>
              {choosenPaymentMethod === "card" ? <i className="bi bi-credit-card-fill"></i> : <i className="bi bi-coin"></i>}
            </button>
            {/* > Year Month SELECTION */}
            
            {/* Original 
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
            */}

            <div> 
              {/* # uniqueMonths should be the accent color */}
              <select name="year" onChange={handleYearChange} defaultValue={Number(currentDate.getFullYear())}>
                {uniqueYears.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select name="month" onChange={handleSelectChange} defaultValue={lastMonthValue}>
                {uniqueMonths.filter(month => month !== 'initial').map((month, index) => (
                  <option key={index} value={month}  style={monthsInFetchedData.includes(month) ? { fontWeight: 'bold', color: '#daa4fc' } : {}}>
                    {month}
                  </option>
                ))}
              </select>
            </div>


            {/* - Reset Icon */}
            {isCurrentMonth && isCurrentYear && (
              <>
                <button title="Delete Monthly-Spendings on this Currency-Profile" className="button-round pointer d-flex align-items-center justify-content-center" onClick={resetSpendings}><i className="bi bi-trash-fill"></i></button>
              </>
            )}
          </h5>
        </div>

        {/* > Settings Icon */}
        <div className="col-4 user d-flex flex-row justify-content-end" >
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

        {/* > Settings */}
        <Modal className="modal-xl" show={showSettingsModal} onHide={() => setShowSettingsModal(false)}>
          <Modal.Header className="modal-header">
            <Modal.Title>Settings</Modal.Title>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowSettingsModal(false)}></button>
          </Modal.Header>
          <Modal.Body className="modal-body d-flex flex-column flex-lg-row px-3 py-3 px-lg-5 py-lg-5 gap-1 gap-lg-5">
             <aside className="menu d-flex flex-row row text-center flex-lg-column col-lg-3">
              <p className="pointer col-6 col-md-12" onClick={() => handleSettingShow("profile")}>Profile</p>
              <p className="pointer col-6 col-md-12" onClick={() => handleSettingShow("currency")}>Currency</p>
              <p className="pointer col-6 col-md-12" onClick={() => handleSettingShow("spendings")}>Categories</p>
              <p className="pointer col-6 col-md-12" onClick={() => handleSettingShow("visibility")}>Visbility</p>
            </aside> 
            {/* Change it back to 8 from md */}
            <hr className="d-block d-md-none" />
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
                      <div className="simpleInputs py-1 px-1 col-11 col-md-7 col-lg-7 col-xl-12 d-flex flex-row gap-3 justify-content-center">
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
                      <div className="simpleInputs py-1 px-1 col-11 col-md-7 col-lg-7 col-xl-12 d-flex flex-row gap-3 justify-content-center">
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
                      <div className="simpleInputs py-1 px-1 col-11 col-md-7 col-lg-7 col-xl-12 d-flex flex-row gap-3 justify-content-center">
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
              <div className="d-none" ref={SpendingsRef}>
                <div className="text-center  mx-3">
                  <button className="mx-1" onClick={enableAll}>Enable All</button>
                  <button className="mx-1 mb-3 button-secondary" onClick={disableAll}>Disable All</button>

                  {updatedSpendings.sort((a, b) => a.position - b.position).map((spending) => (     
                      <div className="d-flex flex-row justify-content-center" key={spending.id}>
                        <div className="d-flex flex-row col-8 col-md-6 col-xl-4 justify-content-start align-items-center gap-2">
                          <h3>{spending.emoji}</h3>
                          <span>{spending.type}</span>
                        </div>
                        <div className="d-flex flex-row col-4 justify-content-end">
                          <label className="switch">
                            <input type="checkbox" hidden defaultChecked={spending.visible} checked={spending.visible} onChange={() => { updateSpendingVisibility(spending.id) }} /> 
                              <div className="switch__wrapper">
                                <div className="switch__toggle"></div>
                              </div>
                            </label>
                        </div>
                      </div>
                  ))}
                  <button className="mt-5 col-3 col-md-2" onClick={handleSpendingChange}>Save</button>    
                </div>
              </div>
              <div className="d-none" ref={VisibilityRef}>
                <div className="text-center my-5 mx-3">
                  <div className="d-flex col-12 flex-column align-items-around gap-2">
                    <div className="d-flex flex-row ">
                      <p className="col-8 justify-content-center">Income</p>
                      <label className="switch col-4 justify-content-end">
                        <input type="checkbox" hidden defaultChecked={incomeVisibility}  onChange={() => {updateUIVisibility("income")}} /> 
                          <div className="switch__wrapper">
                            <div className="switch__toggle"></div>
                          </div>
                      </label>
                    </div>
                    <div className="d-flex flex-row col-12 justify-content-between">
                    <p className="col-8 justify-content-center">Notes</p>
                    <label className="switch col-4 justify-content-end">
                        <input type="checkbox" hidden defaultChecked={noteVisibility}  onChange={() => {updateUIVisibility("note")}} /> 
                          <div className="switch__wrapper">
                            <div className="switch__toggle"></div>
                          </div>
                      </label>
                    </div>
                  </div>
                  <button className="mt-5 col-3 col-md-2" onClick={handleSpendingChange}>Save</button>    
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* > Are you sure Modal */}
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

        {/* > Are you sure Generic Modal */}
        <Modal className="modal" show={showAreYouSureGenericModal} onHide={() => setShowAreYouSureGenericModal(false)} >
          <Modal.Header>
            <Modal.Title>Are you sure?</Modal.Title>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowAreYouSureGenericModal(false)}></button>
          </Modal.Header>
          <Modal.Body className="py-5 text-center">
            {modalMessage && <p>{modalMessage}</p>}
            <div className="d-flex align-items-center gap-4 justify-content-center mt-2">
              <span className="pointer" onClick={() => { setShowAreYouSureGenericModal(false)}}>Cancel</span>
              {confirmFunction && (
                <button type="button" className="button-secondary" onClick={() => confirmFunction()}>
                  Yes
                </button>
              )}
            </div>
            {ShowErrorMessage && <p className="mt-3">{ShowErrorMessage}</p>}
          </Modal.Body>
        </Modal>

        {/* > Error Modal */}
        <Modal className="modal" show={ShowErrorMessage} onHide={() => setShowErrorMessage(false)} >
            <Modal.Header>
              <Modal.Title>{errorMessage}</Modal.Title>
              <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowErrorMessage(false)}></button>
            </Modal.Header>
            <Modal.Body className="py-5 text-center">
              {errorMessage === "You can't delete this entry!" && (
                <>
                  <h4>Possible solution:</h4>
                  <div className="mb-3">
                    <span>
                      Please ensure you are using the correct formant in the income field to change the value of your income.
                    </span>
                  </div>
                  <ul className="text-start">
                    <li>To add an amount, enter the value. <br /> For example: <code>100</code></li>
                    <li>To remove an amount, prefix the value with a <strong>-</strong> sign. <br /> For example: <code>-50</code></li>
                  </ul>
                </>
              )}
              {/* {errorMessage === ""} */}
            </Modal.Body>
        </Modal>

      </nav>

      {/* > Income & Spending */}
      <motion.section 
      initial={{ opacity: 0 }}
      transition={{ duration: 2.5, delay: 0.5 }}
      animate={{ opacity: 1}}
      className="incomeANDspending d-flex justify-content-center align-items-center flex-column">
      {incomeVisibility && (
        <h5 className="text-center my-1 my-md-0 d-flex flex-column align-items-center"> 
            <span 
            className="income mx-3 mx-md-1">
              <motion.div
                key={animationKey}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                animate={{ opacity: 1}}>
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
              </motion.div>
              </span>
              {/* {isCurrentMonth && ( */}
                <div className="d-flex align-items-center gap-1 my-2 position-relative">
                  <input
                    className="mx-1"
                    value={incomeInput}
                    onChange={handleIncomeChange}
                    onKeyDown={handleIncomeSubmit}
                    type="text"
                    placeholder="income"
                    />
                  <span className="input-tag">{choosenTag}</span>
                </div>
              {/* )} */}
              {(isCurrentMonth && deviceType === "Android") && 
                <h6 className="my-2 mb-4">
                  <span className="button-secondary pointer" onClick={handleIncomeSubmitClickable}>Send</span>  
                </h6>
              }
        </h5>
      )}
      <h3 className="mb-4 mb-md-2 ">
        {/* {isCurrentMonth && ( */}
            <div className="d-flex align-items-center gap-1 position-relative">
              <input value={amount} onChange={handleAmountChange} onKeyDown={handleAmountSubmit} type="text" placeholder="spent" className="mx-1"/> 
              <span className="input-tag">{choosenTag}</span>
            </div>
          {/* )} */}
        </h3>
        {(noteVisibility && showNote) && (
          <h5>
            <input value={noteValue} onChange={handleNoteChange} type="text" placeholder="note" className="mx-1"/> 
          </h5>
        )}
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
        <div className="mt-3 mb-4 mb-md-2 d-none d-flex flex-column justify-content-center align-items-center" ref={exchangedRef}>
          <h4>
            <input ref={exchangeRef as React.RefObject<HTMLInputElement>} type="text" value={exchangeAmount} onChange={handleExchangeChange} placeholder="Exchanged Value" />
          </h4>
          <div className="currency d-flex flex-row gap-2 ">
            {primaryCurrency !== 'null' && (
              <> 
                {choosenCurrency !== primaryCurrency &&  <button onClick={() => {handleExchangeSubmit(primaryCurrency)}}>{primaryCurrency}</button>}
                {choosenCurrency !== secondaryCurrency && secondaryCurrency !== 'null' && secondaryCurrency !== undefined && secondaryCurrency !== "" && <button onClick={() => {handleExchangeSubmit(secondaryCurrency)}}>{secondaryCurrency}</button>}
                {choosenCurrency !== thirdCurrency && thirdCurrency !== 'null' && thirdCurrency !== undefined && thirdCurrency !== "" && <button onClick={() => {handleExchangeSubmit(thirdCurrency)}}>{thirdCurrency}</button>}
              </>
            )}
          </div>
        </div>
      </motion.section>
      
      {/* > Types, Categories */} 
      <motion.section 
      initial={{ opacity: 0 }}
      transition={{ duration: 2 }}
      whileInView={{ opacity: 1}}
      className="d-flex justify-content-center">
        <div className="col-12 col-md-10 col-lg-10 col-xl-8 col-xxl-6">
          {showTypes && (
            <div className="text-center">
              {spendings.sort((a, b) => a.position - b.position).map((spending) => (
                <React.Fragment key={spending.position}>
                  {spending.visible && (
                    <button className="button-secondary p-3 m-1" onClick={() => handleTypeClick(spending.type, spending.id)}>
                    <span className="d-block d-xl-none">{spending.emoji+" "+spending.type}</span>
                    <p className="d-none d-xl-block">{spending.emoji+" "+spending.type}</p>
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}  
        </div>
      </motion.section>

      {/* > Spendings */}
      <motion.section 
      className="mt-md-5 my-1 mb-5 d-flex justify-content-center"
      initial={{ opacity: 0}}
      transition={{ duration: 2 }}
      animate={{ opacity: 1}}>
        
        <motion.div 
        key={animationKey}
        initial={{ opacity: 0, y: -100}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: initialLoad ? 2 : 0 }}
        className="col-12 col-md-10 col-xxl-8 box-ui p-md-5">
          {/* col-lg-10 col-xl-8 */}
          <motion.div
          key={animationKey}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1 , y: 0}}
          transition={{ duration: 1, delay: initialLoad ? 2.5 : 0.5 }}
          // viewport={{ once: false }}
           className="row justify-content-evenly">
            {spendings.sort((a, b) => a.position - b.position).map((spending) => (
              <React.Fragment key={spending.id}>
                {spending.visible && (
                  <div className="col-6 col-md-4 col-lg-2 my-2 mx-md-3 text-center d-flex flex-column justify-content-around">
                    <h1>{spending.emoji}</h1>
                    <span>{spending.type}</span>
                    <h2>{Number(spending.amount || 0).toFixed(choosenFormat)}{choosenTag}</h2>
                  </div>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* > Log */}
      {/* ? To many Difference from previous months messages */}
      {/* # if the user has 0 entry point in the current month, dont include the income changes where difference is "" */}
      {/* # OR add a new collapse section. */}
      {/* # OR add a new sorting option where the user can disable informations like "Difference..."  */} {/* ! I like this more */}
      {/* - I added "Collapsable" text for Notes # If multiple Notes has the same text it should get them together and sum the values up with Information shown. */}
      {/*  */}
      <motion.section 
      initial={{ opacity: 0, y: 100 }}
      transition={{ duration: 1, delay: 3 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="row mt-lg-5 my-1 mb-5 pb-5 d-flex justify-content-center">
        <div className="col-12 col-md-10 col-lg-10 col-xl-8 col-xxl-6 d-flex flex-column align-items-center"> 
        <select className="text-center mb-3" defaultValue="Choose an option" onChange={handleCategoryChange}>
          <option value="Choose an option">Choose an option</option>
          {updatedSpendings.map((spending) => (
            spending.visible &&
            <option key={spending.id} value={spending.id}>{spending.type}</option>
          ))}
        </select>

          {logEntries.slice().reverse().map((entry, index) => (
            (entry.information !== 'Reverse') &&
              entry.information !== "Edited Income" && 
                entry.information !== "Wiped" &&
                <React.Fragment key={entry.id}>
                  <motion.div 
                    // key={animationKey}
                    initial={{ opacity: 0, x: index % 2 === 0 ? 200 : -200 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: initialLoad ? 3.5 : 0  }}
                    // viewport={{ once: true }}
                    data-bs-toggle="tooltip" 
                    data-bs-placement="top"
                    data-bs-custom-class="custom-tooltip"  
                    data-bs-title={getTitle(choosenMonth, monthNames, entry)}
                    title={getTitle(choosenMonth, monthNames, entry)}
                    
                    // onClick={getOnClickHandler(choosenMonth, monthNames, entry, handleDeleteEntry)} 
                    onClick={() => handleEditClick(entry)}
                    className={"logEntry col-12 col-lg-5 m-1 p-3 p-lg-4 " + (entry.type !== 'Income' ?  "pointer" : "not-allowed")}
                    ref={editingEntryId === entry.id ? editRef : null}>
                    <div className="d-block" ref={simpleEntryRef} >
                      <div className="d-flex justify-content-between">
                        {editingEntryId === entry.id && entry.type !== 'Exchange' && entry.type !== 'Withdraw & Deposit' ? (
                          <h6 className="col-5 d-flex align-items-center justify-content-start ">
                            <select name="" id="" value={editedCategory} onChange={(e) => setEditedCategory(e.target.value)} onClick={(e) => e.stopPropagation()} >
                            {updatedSpendings
                              .filter(spending => spending.type !== 'Exchange' && spending.type !== 'Withdraw & Deposit')
                              .map(spending => (
                                <option key={spending.type} value={spending.type}>
                                  {spending.emoji + " " + spending.type}
                                </option>
                              ))
                            }
                            </select>
                          </h6>
                        ) : (
                          <h5 className="">{entry.emoji +' '+ entry.type}</h5>
                        )
                        }
                  
                        {(editingEntryId === entry.id && (entry.type !== 'Exchange' && entry.type !== "Withdraw & Deposit")) ? (
                          <>
                            <h5 className="col-6 smallerI d-flex align-items-center justify-content-end position-realtive">
                              <span className="pre-tag">{getEntryAmount(entry).slice(0, 1)}</span>
                              <input 
                                className="smallerInput"
                                type="text" 
                                placeholder="Amount"
                                value={editedAmount} 
                                onChange={handleEditedAmountChange} 
                                onClick={(e) => e.stopPropagation()} 
                                />
                              <span className="input-tag">{choosenTag}</span>
                            </h5>
                          </>
                        ) : (
                          entry.information && !entry.information.includes("Difference from previous Month(s)") ?
                            <h5>{getEntryAmount(entry)}</h5>
                            :
                            <h5>{entry.information ?
                               parseFloat(entry.information.split(".")[1]) > 0 ?
                               "+" + parseFloat(entry.information.split(".")[1]).toFixed(choosenFormat) + choosenTag
                               :
                               parseFloat(entry.information.split(".")[1]).toFixed(choosenFormat) + choosenTag

                               : 
                               getEntryAmount(entry)
                               }</h5>
                        )}
                      
                      </div>

                      {/* {editingEntryId === entry.id && entry.type === "Exchange" && 
                        <h5 className="col-12 smallerI d-flex align-items-center justify-content-end position-realtive">
                          <span className="pre-tag">{getEntryAmount(entry).slice(0, 1)}</span>
                          <input 
                          className="smallerInput"
                          type="text" 
                          placeholder="Amount"
                          value={editedAmount} 
                          onChange={handleEditedAmountChange} 
                          onClick={(e) => e.stopPropagation()} 
                          />
                          <span className="input-tag">{choosenTag}</span>
                        </h5>
                      }  */}
                      <div className="col d-flex justify-content-between">
                        {(editingEntryId === entry.id && (entry.type !== 'Exchange' && entry.type !== "Withdraw & Deposit")) ? (
                          <span className="d-flex align-items-center justify-content-start">
                            <input 
                              className="smallerInput"
                              placeholder="Note"
                              type="text" 
                              value={editedNote} 
                              onChange={(e) => setEditedNote(e.target.value)} 
                              onClick={(e) => e.stopPropagation()} 
                              />
                          </span>
                        ) : (
                          // entry.note ? 
                          //   <>
                          //     {entry.information !== 'Edited' &&
                          //       <>
                          //         {/* <span>{entry.note}</span> */}
                          //         <span>{entry.information}</span>
                          //       </>
                          //     }
                          //   </>
                          // : 
                            (
                              entry.information && !entry.information.includes("Difference from previous Month(s)") ? 
                              (
                                entry.information !== 'Edited' && (
                                  <>
                                    <span>{entry.information}</span>
                                  </>
                                )
                              ) : (
                                entry.information ? <span>{entry.information.split(".")[0]}</span> : null
                              )
                            )
                        )}
                        {incomeVisibility && (
                          entry.information !== 'Edited' ? (
                            <>
                              {editingEntryId !== entry.id && <span>{entry.note}</span>}
                              <span>Income After: {Number(entry.income).toFixed(choosenFormat)}{choosenTag}</span>
                            </>
                          ) :(
                            <>
                              {editingEntryId !== entry.id && <span>{entry.note}</span>}
                              <span>Income After Edit: {Number(entry.income).toFixed(choosenFormat)}{choosenTag}</span>
                            </>
                          )
                        )}
                      </div>
                    </div>
                    {(editingEntryId === entry.id) && (
                      <div className="d-flex justify-content-end gap-2 mt-3">
                        <button className={(entry.type !== 'Exchange' && entry.type !== "Withdraw & Deposit") ? "button-secondary" : ""} onClick={(e) => {e.stopPropagation(); handleDeleteEntry(entry.id, entry.type, entry.amount, entry.payment);}}>Delete</button>
                        {(entry.type !== 'Exchange' && entry.type !== "Withdraw & Deposit") &&
                          <button onClick={(e) => {e.stopPropagation(); handleEntryChange(entry);}}>Save</button>
                        }
                      </div>
                    )}
                  </motion.div>

                </React.Fragment>
          ))}
        </div>
      </motion.section>


      {/* > Footer */}
      <footer className="fixed-bottom py-2 py-lg-3">
        <div className="d-none d-lg-flex flex-row justify-content-center gap-5">
          <h5 className="text-center">
            <span>Spent this month: {Number(totalSpent).toFixed(choosenFormat)}{choosenTag}</span>  
          </h5>
          <h5 className="text-center">
            <span>Total savings: {Number(totalSavings).toFixed(choosenFormat)}{choosenTag}</span>
          </h5>
          <h5 className="text-center">
            <span>Total Investment: {Number(totalInvestment).toFixed(choosenFormat)}{choosenTag}</span>
          </h5>
        </div>
        <div className="d-flex flex-column d-lg-none">
          <h5 className="text-center">
            <span>Spent this month: {Number(totalSpent).toFixed(choosenFormat)}{choosenTag}</span>  
          </h5>
          <div className="d-flex flex-row justify-content-center gap-2 my-1">
            <h5 className="text-center col-6">
              Total savings 
              <br />
              {Number(totalSavings).toFixed(choosenFormat)}{choosenTag}
            </h5>
            <h5 className="text-center col-6">
              Total Investment
              <br />
             {Number(totalInvestment).toFixed(choosenFormat)}{choosenTag}
            </h5>
          </div>
        </div>
      </footer>
    </section>
  )
}

export default App


