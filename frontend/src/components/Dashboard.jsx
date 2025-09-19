import axios from "axios";
import { IoAdd } from "react-icons/io5";
import { BsUpload } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { toast } from "sonner";



function Dashboard() {
    const [showCard, setShowCard] = useState(false);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const adminName = localStorage.getItem("fullName") || "";
    
    const [form, setForm] = useState({ 
        name: "", 
        email: "", 
        mobileNumber: "", 
        password: "" 
    });

    const fetchAgents = async () => {
        try {
            const res = await axios.get("http://localhost:4000/allagents", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }});
            setAgents(res.data);
        } catch (e) {
            toast.error(e.response?.data?.error || "Failed to load agents");
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.name || !form.email || !form.mobileNumber) {
            toast.error("All fields are required");
            return;
        }

        const mobileRegex = /^\+[1-9]\d{1,14}$/;
        if (!mobileRegex.test(form.mobileNumber)) {
            toast.error("Invalid phone number format");
            return;
        }

        try {
            setLoading(true);
            if (editingId) {
                const updateData = {
                    name: form.name, 
                    email: form.email, 
                    mobileNumber: form.mobileNumber
                };

                if (form.password) {
                    updateData.password = form.password;
                }

                await axios.put(`http://localhost:4000/agent/${editingId}`, updateData, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
                toast.success("Agent updated!");
            } else {
                if (!form.password) {
                    toast.error("Password is required");
                    return;
                }
                await axios.post("http://localhost:4000/createagent", form, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }});
                toast.success("Agent Created!");
            }
            setShowCard(false);
            setForm({ name: "", email: "", mobileNumber: "", password: "" });
            fetchAgents();
        } catch (e) {
            toast.error(e.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (agent) => {
        setEditingId(agent._id);
        setForm({
            name: agent.name,
            email: agent.email,
            mobileNumber: agent.mobileNumber,
            password: ""
        });
        setShowCard(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/agent/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, });
            toast.success("Agent deleted!");
            fetchAgents();
        } catch (e) {
            toast.error(e.response?.data?.error || "Failed to delete agent");
        }
    };



    return(
        <div className="min-h-screen bg-[#F6F6EF] pt-15 w-full overflow-x-hidden">
            <div className="bg-white mx-auto w-[80%] sm:w-[90%] max-w-4xl h-fit rounded-sm border border-gray-500/50">
                <div className="text-center font-medium text-xl text-[#FE6603] py-5 border-b border-black">Welcome {adminName}</div>
                <div className="flex justify-between sm:justify-end gap-5 px-4 sm:px-10 py-4 overflow-hidden">
                    <div onClick={() => setShowCard(true)} className="flex gap-2 items-center px-1 sm:px-2 sm:pr-3 py-1 border border-[#FE6603] hover:bg-[#FE6603] text-black hover:text-white rounded-xs cursor-pointer whitespace-nowrap">
                        <IoAdd size={20} />
                        <span className="text-sm sm:text-md">Add Agent</span>
                    </div>

                    {showCard && (
                        <div className="fixed inset-0 z-10 flex items-center justify-center">
                            <div className="relative bg-[#F6F6EF] rounded-xl p-6 w-[90%] max-w-md max-h-[90vh] overflow-y-auto border border-black/50">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="font-semibold text-lg text-black tracking-wide">AGENT DETAILS</div>
                                    <button onClick={() => { setShowCard(false); setEditingId(null); setForm({ name: "", email: "", mobileNumber: "", password: "" });}} className="p-1 bg-white hover:bg-[#FE6603] text-black hover:text-white rounded-full cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </button>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="bg-white rounded-md p-2 px-3">
                                        <label className="block text-md font-medium text-black tracking-wide">Name</label>
                                        <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} type="text" className="w-full mt-1 p-2 mb-2 rounded-md border border-black/50 focus:outline-none" />
                                    </div>
                                    <div className="bg-white rounded-md p-2 px-3">
                                        <label className="block text-md font-medium text-black tracking-wide">Email</label>
                                        <input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} type="text" className="w-full mt-1 p-2 mb-2 rounded-md border border-black/50 focus:outline-none" />
                                    </div>
                                    <div className="bg-white rounded-md p-2 px-3">
                                        <label className="block text-md font-medium text-black tracking-wide">Mobile Number</label>
                                        <input value={form.mobileNumber} onChange={(e) => { const value = e.target.value; if (value === "" || /^\+[0-9]*$/.test(value)) setForm({...form, mobileNumber: e.target.value}) }} maxLength={16} type="tel" placeholder="+919876543210" className="w-full mt-1 p-2 mb-2 rounded-md border border-black/50 focus:outline-none" />
                                    </div>
                                    <div className="bg-white rounded-md p-2 px-3">
                                        <label className="block text-md font-medium text-black tracking-wide">Password</label>
                                        <input value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} type="password" className="w-full mt-1 p-2 mb-2 rounded-md border border-black/50 focus:outline-none" />
                                    </div>

                                    <button onClick={handleSubmit} disabled={loading} className="bg-[#FE6603] hover:bg-[#FF762D] text-white font-semibold tracking-wide rounded-md py-2 cursor-pointer w-full">
                                        {loading ? "Creating..." : "Create"}
                                    </button>
                                </div>
                            </div>
                        </div>  
                    )}
                    <div className="flex gap-2 items-center px-1 sm:px-2 sm:pr-3 py-1 border border-[#FE6603] hover:bg-[#FE6603] text-black hover:text-white rounded-xs cursor-pointer whitespace-nowrap">
                        <BsUpload />
                        <span className="text-sm sm:text-md">Upload List</span>
                    </div>
                </div>
                {agents.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-3 sm:gap-5 py-4 px-3 sm:px-10 text-md sm:font-medium border-b border-[#FE6603] whitespace-nowrap overflow-hidden">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Mobile Number</div>
                </div>
                )}
                {agents.map((agent) => (
                <div key={agent._id} className="grid grid-cols-1 gap-2 md:gap-0 md:grid-cols-3 px-10 py-4 border-b border-black/30 whitespace-nowrap overflow-hidden">
                    <div>{agent.name}</div>
                    <div>{agent.email}</div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                        <span>{agent.mobileNumber}</span>
                        <div className="flex px-4 gap-4 items-center">
                            <div onClick={() => handleEdit(agent)} className="cursor-pointer border p-1.5 rounded-xs hover:border-[#FE6603] hover:bg-[#FE6603] hover:text-white"><MdEdit /></div>
                            <div onClick={() => handleDelete(agent._id)} className="cursor-pointer border p-1.5 rounded-xs hover:border-[#FE6603] hover:bg-[#FE6603] hover:text-white"><MdDelete /></div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}

export default Dashboard