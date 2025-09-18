import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function CreateAccount() {

   const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      password: ""
   });

   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.fullName || !formData.email || !formData.password) {
         toast.error("Complete all fields to continue");
         return;
      }

      try {
         setLoading(true);
         await axios.post("http://localhost:4000/createadmin", formData);
         navigate('/');
      } catch (err) {
         toast.error("Signup failed. Try again.");
         console.log(err)
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-[#F6F6EF]">
         <div className="flex flex-col items-center justify-center py-20 px-10">
            <div className="w-full max-w-md bg-white rounded-lg">
   
               <div className="mb-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                     <div className="flex items-center justify-center rounded-sm bg-[#FE6603] px-2 py-2 mt-10">
                        <CiUser size={40} className="text-white" />
                     </div>
                     <h1 className="mt-2 text-xl font-bold text-black">Sign up to access Work</h1>
                  </div>
               </div>
   
               <form className="space-y-7 px-5" onSubmit={handleSubmit}>
                  <div>
                     <label>
                        <span className="text-black font-medium">Full Name</span>
                     </label>
                     <div className="border border-[#FF8162] mt-2 py-3 rounded-md relative">
                        <div className="text-black opacity-80 absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                           <FaRegUser />
                        </div>
                        <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="text-black w-full pl-10 focus:outline-none focus:ring-0" placeholder="Ashish Jha"/>
                     </div>
                  </div>

                  <div>
                     <label>
                        <span className="text-black font-medium">Email</span>
                     </label>
                     <div className="border border-[#FF8162] mt-2 py-3 rounded-md relative">
                        <div className="text-black opacity-80 absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail size-5 text-base-content/40"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                        </div>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="text-black w-full pl-10 focus:outline-none focus:ring-0" placeholder="you@example.com"/>
                     </div>
                  </div>
   
                  <div>
                     <label>
                        <span className="text-black font-medium">Password</span>
                     </label>
                     <div className="border border-[#FF8162] mt-2 py-3 rounded-md relative">
                        <div className="text-black opacity-80 absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock size-5 text-base-content/40"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </div>
                        <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input input-bordered w-full pl-10 text-black focus:outline-none focus:ring-0" placeholder="••••••••"/>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-black opacity-70 absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                           {showPassword ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye size-6 text-base-content/40"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                              ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
                           )}
                        </button>
                     </div>
                  </div>
                   
                  <button type="submit" disabled={loading} className="bg-[#FE6603] hover:bg-[#FF762D] font-semibold tracking-wide rounded-sm py-3 cursor-pointer text-white w-full">{ loading ? "Signing up..." : "Sign Up" }</button>
               </form>
   
               <div className="text-center pt-5 pb-10">
                  <p className="text-black/60">
                     Already have an account?
                     <Link className="text-[#FF6600] hover:text-[#FF6600]/90 px-2" to={"/"} data-discover="true">
                        Log in.
                     </Link>
                  </p>
               </div>

            </div>
         </div>
      </div>
   )
}

export default CreateAccount