import { useEffect, useState } from "react"




export default function App() {

  const [entered_amount , set_entered_amount] = useState("") ;
  function handle_input_amount_change_function(event_info_object) {
    set_entered_amount(event_info_object.target.value) ;
  }

  const [from_currency , set_from_currency] = useState("USD") ;
  function handle_from_currency_change(event_info_object) {
    set_from_currency(event_info_object.target.value)
  }

  const [to_currency , set_to_currency] = useState("EUR") ;
  function handle_to_currency_change(event_info_object){
    set_to_currency(event_info_object.target.value)
  }

  const [output , set_output] = useState("0.00") ;

  const controller = new AbortController() ;

  const [is_loading , set_is_loading] = useState(false)


  

  // fetch(`https://${host}/latest?amount=10&from=GBP&to=USD`)

  useEffect( function() {

    async function conver_amount() {

      try{

        set_is_loading(true) ;
        const res = await fetch(`https://api.frankfurter.app/latest?amount=${entered_amount}&from=${from_currency}&to=${to_currency}`
        ,{signal: controller.signal}) ;

        const data = await res.json() ;

        
        set_output(data.rates[to_currency])

        

      }
      catch(err){

        if(err.name !== "AbortError")
        console.log(err) ;
      }
      finally{

        set_is_loading(false) ;
      }

    }

    if(!entered_amount) {
      
      set_output("0.00")
      return ;
    }
    if(to_currency === from_currency )
    {
      set_output(entered_amount) ;
      return ;
    }
    conver_amount() ;

    return function(){
      controller.abort() ;
    }
  },[entered_amount , to_currency , from_currency])





  return(

    <div>
      
      <input type="text"  placeholder="Enter amount" 
      value={entered_amount}
      onChange={(e) => handle_input_amount_change_function(e)}
      
       />

      <select onChange={(e) => handle_from_currency_change(e)} 
      value={from_currency}
      disabled={is_loading ? true : false}
      >
        <option>USD</option>
        <option>EUR</option>
        <option>GBP</option>
        <option>INR</option>
      </select>

      <select onChange={(e) => handle_to_currency_change(e)}
      value={to_currency}
      disabled={is_loading ? true : false}
      >
        <option>EUR</option>
        <option>GBP</option>
        <option>INR</option>
        <option>USD</option>
      </select>

      <p>{from_currency} &rarr; {to_currency} : {output}</p>
      
    </div>
  )
}