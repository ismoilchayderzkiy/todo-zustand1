import React, { useEffect, useState } from 'react'
import { api, useCounter } from './counter/home'
import axios from 'axios'
import { Button, Input, Modal, Select } from 'antd'

interface User {
	id: number
	name: string
	status: boolean
}

const App: React.FC = () => {
	const [inpAddName, setInpAddName] = useState<string>('')
	const [inpEditName, setInpEditName] = useState<string>('')
	const [statusAdd, setStatusAdd] = useState<boolean | null>(null)
	const [idx, setIdx] = useState<number | null>(null)

	const { data, getData } = useCounter((state) => state)

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [isModalOpen1, setIsModalOpen1] = useState<boolean>(false)

	useEffect(() => {
		getData()
	}, [getData])

	const deleteUser = async (id: number) => {
		try {
			await axios.delete(`${api}/${id}`)
			getData()
		} catch (error) {
			console.error('Error deleting user:', error)
		}
	}

	const editStatus = async (id: number) => {
		try {
			const user = data.find((e: User) => e.id === id)
			if (!user) return

			const updatedUser = { ...user, status: !user.status }
			await axios.put(`${api}/${id}`, updatedUser)
			getData()
		} catch (error) {
			console.error('Error updating status:', error)
		}
	}

	const showModal = () => setIsModalOpen(true)
	const handleCancel = () => setIsModalOpen(false)

	const showModal1 = (user: User) => {
		setInpEditName(user.name)
		setIdx(user.id)
		setIsModalOpen1(true)
	}
	const handleCancel1 = () => setIsModalOpen1(false)

	const addUser = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!inpAddName || statusAdd === null) return

		const newUser = { name: inpAddName, status: statusAdd }

		try {
			await axios.post(api, newUser)
			getData()
			setIsModalOpen(false)
			setInpAddName('')
			setStatusAdd(null)
		} catch (error) {
			console.error('Error adding user:', error)
		}
	}

	const edited = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!inpEditName || idx === null) return

		try {
			await axios.put(`${api}/${idx}`, { name: inpEditName })
			getData()
			setIsModalOpen1(false)
		} catch (error) {
			console.error('Error editing user:', error)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
			<div className="max-w-2xl mx-auto space-y-8">
				<h1 className="text-3xl font-bold text-center text-gray-800">User Manager</h1>

				<Button
					type="primary"
					onClick={showModal}
					className="w-full !bg-indigo-600 hover:!bg-indigo-700 text-white py-2 text-lg font-semibold rounded-lg"
				>
					Add New User
				</Button>

				<div className="space-y-4">
					{data.map((user: User) => (
						<div
							key={user.id}
							className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition"
						>
							<div>
								<p className="text-lg font-medium text-gray-900">{user.name}</p>
								<p className="text-sm text-gray-400">ID: {user.id}</p>
							</div>

							<div className="flex gap-2">
								<button
									onClick={() => editStatus(user.id)}
									className={`px-3 py-1 rounded text-sm font-medium text-white transition ${
										user.status
											? 'bg-green-500 hover:bg-green-600'
											: 'bg-gray-400 hover:bg-gray-500'
									}`}
								>
									{user.status ? 'Active' : 'Inactive'}
								</button>
								<button
									onClick={() => showModal1(user)}
									className="px-3 py-1 rounded text-sm font-medium bg-yellow-400 hover:bg-yellow-500 text-white"
								>
									Edit
								</button>
								<button
									onClick={() => deleteUser(user.id)}
									className="px-3 py-1 rounded text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Add User Modal */}
			<Modal title="Add User" open={isModalOpen} footer={null} onCancel={handleCancel}>
				<form onSubmit={addUser} className="space-y-4 mt-4">
					<Input
						placeholder="Enter name"
						value={inpAddName}
						onChange={(e) => setInpAddName(e.target.value)}
					/>
					<Select
						style={{ width: '100%' }}
						allowClear
						options={[
							{ value: true, label: 'Active' },
							{ value: false, label: 'Inactive' },
						]}
						value={statusAdd}
						onChange={(value) => setStatusAdd(value)}
						placeholder="Select status"
					/>
					<Button
						type="primary"
						htmlType="submit"
						className="w-full !bg-indigo-600 hover:!bg-indigo-700 text-white"
					>
						Add
					</Button>
				</form>
			</Modal>

			{/* Edit User Modal */}
			<Modal title="Edit User" open={isModalOpen1} footer={null} onCancel={handleCancel1}>
				<form onSubmit={edited} className="space-y-4 mt-4">
					<Input
						placeholder="Edit name"
						value={inpEditName}
						onChange={(e) => setInpEditName(e.target.value)}
					/>
					<Button
						type="primary"
						htmlType="submit"
						className="w-full !bg-green-600 hover:!bg-green-700 text-white"
					>
						Save
					</Button>
				</form>
			</Modal>
		</div>
	)
}

export default App