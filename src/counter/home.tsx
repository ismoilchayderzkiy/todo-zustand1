import axios from 'axios'
import { create } from 'zustand'

export interface User {
	id: number
	name: string
	status: boolean
}

interface CounterStore {
	data: User[]
	getData: () => Promise<void>
}

export const api = 'https://68223a6fb342dce8004d921a.mockapi.io/ishoq'

export const useCounter = create<CounterStore>((set) => ({
	data: [],
	getData: async () => {
		try {
			const { data } = await axios.get<User[]>(api)
			set({ data })
		} catch (error) {
			console.error(error)
		}
	}
}))
