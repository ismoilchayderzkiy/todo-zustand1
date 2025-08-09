import axios from 'axios'
import { create } from 'zustand'
export let api='https://68223a6fb342dce8004d921a.mockapi.io/ishoq' 
export let useCounter=create((set,get)=>({
	data:[],
	getData:async()=>{
		try {
			let {data}=await axios.get(api)
				set({data})
				return data
		} catch (error) {
			console.error(error);
		}
	}
}))