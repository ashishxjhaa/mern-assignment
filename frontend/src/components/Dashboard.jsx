import axios from "axios";
import { IoAdd } from "react-icons/io5";
import { BsUpload } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast } from "sonner";



function Dashboard() {
    const [showCard, setShowCard] = useState(false);
    const [uploadCard, setUploadCard] = useState(false);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [openAgents, setOpenAgents] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [agentLists, setAgentLists] = useState({});
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const adminName = localStorage.getItem("fullName") || "";
    
    const [form, setForm] = useState({ 
        name: "", 
        email: "", 
        mobileNumber: "", 
        password: "" 
    });

    const toggleAgent = async (id) => {
        if (openAgents.includes(id)) {
            setOpenAgents(openAgents.filter((openId) => openId !== id));
        } else {
            setOpenAgents([...openAgents, id]);

            if (!agentLists[id]) {
                try {
                    const res = await axios.get(`http://localhost:4000/distributed-list/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }});
                    setAgentLists((prev) => ({ ...prev, [id]: res.data }));
                } catch (e) {
                    toast.error(e.response?.data?.error || "Failed to load lists");
                }
            }
        }
    };


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

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select a file");
            return;
        }

        const allowedTypes = [".csv", ".xlsx", ".xls"];
        const ext = selectedFile.name.split('.').pop().toLowerCase();

        if (!allowedTypes.includes(`.${ext}`)) {
            toast.error("Only CSV, XLSX, and XLS files are allowed");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await axios.post("http://localhost:4000/upload",
                formData,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "multipart/form-data" } }
            );

            setUploadCard(false);
            setUploadedFileName(selectedFile.name);
            setSelectedFile(null);

            openAgents.forEach((id) => {
                axios.get(`http://localhost:4000/distributed-list/${id}`, {headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }})
                    .then((res) => { setAgentLists((prev) => ({ ...prev, [id]: res.data }));
                });
            });
            toast.success("List uploaded successfully!");
        } catch (err) {
            toast.error(err.response?.data?.error || "Upload failed");
        };
    }


    return(
        <div className="min-h-screen bg-[#F6F6EF] py-15 w-full overflow-x-hidden">
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
                    <div onClick={() => { if (agents.length === 0) { toast.error("Add at least 1 agent before uploading a list"); return } setUploadCard(true) }} className="flex gap-2 items-center px-1 sm:px-2 sm:pr-3 py-1 border border-[#FE6603] hover:bg-[#FE6603] text-black hover:text-white rounded-xs cursor-pointer whitespace-nowrap">
                        <BsUpload />
                        <span className="text-sm sm:text-md">Upload List</span>
                    </div>

                    {uploadCard && (
                        <div className="fixed inset-0 z-10 flex flex-col items-center justify-center">
                            <div className="bg-[#F6F6EF] border rounded-xl py-5 px-10 flex flex-col gap-4 sm:gap-6 w-[60%] max-w-md h-auto max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-md">Upload files</span>
                                        <span className="text-sm opacity-70">Select and upload the files</span>
                                    </div>  
                                    <div onClick={() => setUploadCard(false)} className="p-1 bg-white hover:bg-[#FE6603] text-black hover:text-white border border-black/20 rounded-full cursor-pointer text-[18px] sm:text-[25px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </div>
                                </div>
                                <div className="bg-white border-2 border-dashed border-[#FE6603] rounded-xl px-4 py-4 relative flex flex-col justify-center items-center gap-6">
                                    <input type="file" onChange={(e) => {if (e.target.files[0]) { setSelectedFile(e.target.files[0]); setUploadedFileName(e.target.files[0].name);}}} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <IoCloudUploadOutline size={28} sm:size={35} />
                                    <div className="hidden sm:flex flex-col justify-center text-center gap-1 whitespace-nowrap">
                                        <span className="font-medium text-md text-black">Choose a file or drag & drop it here</span>
                                        <span className="text-sm text-black opacity-70">CSV, XLSX and XLS format only, up to 20MB</span>
                                    </div>
                                    <div className="px-3 py-1 border border-black text-black rounded-sm w-fit h-fit">Browse File</div>
                                </div>
                                {uploadedFileName && (
                                    <div className="bg-white rounded-md text-md text-green-700 px-4 mt-2 py-2 flex items-center gap-4 w-fit">
                                        <FaFileAlt />
                                        <span className="font-medium">{uploadedFileName}</span>
                                    </div>
                                )}
                            </div>
                            <div onClick={handleUpload} className="px-3 py-1 mt-5 bg-[#FE6603] text-white rounded-sm cursor-pointer w-fit h-fit">
                                Upload
                            </div>
                        </div>
                    )}

                </div>
                {agents.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-3 sm:gap-5 py-4 px-3 sm:px-10 text-md sm:font-medium border-b border-[#FE6603] whitespace-nowrap overflow-hidden">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Mobile Number</div>
                </div>
                )}
                {agents.map((agent) => (
                <>
                <div key={agent._id} onClick={() => toggleAgent(agent._id)} className="grid grid-cols-1 gap-2 md:gap-0 md:grid-cols-3 px-10 py-4 border-b border-black/30 hover:bg-[#F6F6EF] whitespace-nowrap overflow-hidden cursor-pointer">
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
                {openAgents.includes(agent._id) && (
                    <div>
                        {agentLists[agent._id]?.map((list, idx) => (
                            <div key={idx} className="grid sm:grid-cols-3 gap-2 sm:gap-0 py-4 px-3 sm:px-10 text-md border-b border-black/70 bg-[#F6F6EF] whitespace-nowrap overflow-hidden">
                                <div>{list.firstName}</div>
                                <div>{list.phoneNumber}</div>
                                <div>{list.notes}</div>
                            </div>
                        ))}
                    </div>
                )}
                </>
                ))}
            </div>
        </div>
    )
}

export default Dashboard