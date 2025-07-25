import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import sushilGhimire from "../assets/sushil-ghimire.jpg";
import Navbar from "./NavBar";
import { SelectField } from "./SelectedField";
import { useAddMember } from "../hooks/useAddMember";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useGetPlans } from "../hooks/useGetplans";

const AddMemberForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fathersname: "",
    age: "",
    gender: "Male",
    address: "",
    membershipType: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    emergencyContact: "",
    status: "Active",
    notes: "",
    profileImage: null,
  });

  const {
    mutate: AddMember,
    isSuccess,
    isError,
    error,
    isPending,
  } = useAddMember();

  const { data, isSuccess: plansSuccess } = useGetPlans();
  const [plans, setPlans] = useState([]);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  
  const defaultPlaceholder =
    "https://ui-avatars.com/api/?name=New+Member&background=1a1a1a&color=ffc107&rounded=true";

  const selectedPlan = plans.find(
    (plan) => plan.name === formData.membershipType
  );
  const planPrice = selectedPlan?.durations?.[0]?.price;
  const planDuration = selectedPlan?.durations?.[0]?.months;

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    if (plansSuccess) {
      setPlans(data.plans);
      if (!formData.membershipType && data.plans.length > 0) {
        setFormData((prev) => ({
          ...prev,
          membershipType: data.plans[0].name,
        }));
      }
    }
  }, [plansSuccess, data]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully added member");
      navigate("/members");
    }
    if (isError) {
      toast.error(`Error: ${error.message}`);
    }
  }, [isSuccess, isError]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage" && files[0]) {
      setFormData({ ...formData, profileImage: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const err = {};
    if (!formData.name) err.name = "Name is required";
    if (!formData.email) err.email = "Email is required";
    if (!formData.phone) err.phone = "Phone is required";
    if (!formData.age) err.age = "Age is required";
    if (!formData.address) err.address = "Address is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    AddMember({
      formData,
      membershipPrice: planPrice,
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${sushilGhimire})` }}
    >
      <Navbar />
      <ToastContainer position="top-right" />

      <div className="max-w-5xl mt-2 mx-auto bg-black/80 backdrop-blur-md text-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
          Add New Member
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="flex justify-center">
            <label className="cursor-pointer text-center">
              <input
                type="file"
                accept="image/*"
                name="profileImage"
                onChange={handleChange}
                className="hidden"
              />
              <img
                src={imagePreview || defaultPlaceholder}
                alt="Profile Preview"
                className="w-28 h-28 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
              />
              <p className="text-center text-sm text-yellow-300 mt-2">
                Upload Photo
              </p>
            </label>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              icon={<FaUser />}
              placeholder="John Doe"
            />
            <InputField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<FaEnvelope />}
              placeholder="john@example.com"
            />
            <InputField
              label="Father's Name"
              name="fathersname"
              value={formData.fathersname}
              onChange={handleChange}
              icon={<FaUser />}
              placeholder="Mr. Smith"
            />
            <InputField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              icon={<FaPhone />}
              placeholder="9876543210"
            />
            <InputField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              error={errors.age}
              placeholder="22"
            />
            <SelectField
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
            />
            <SelectField
              label="Plan"
              name="membershipType"
              value={formData.membershipType}
              onChange={handleChange}
              options={plans.map((plan) => ({
                value: plan.name,
                label: plan.name,
              }))}
            />
            <InputField
              label="Emergency Contact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              icon={<FaPhone />}
              placeholder="9988776655"
            />
            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={["Active", "Inactive", "Pending"]}
            />
          </div>

          {/* Plan Price */}
          {selectedPlan && (
            <p className="text-sm text-yellow-300 mt-2 md:ml-1">
              💳 Plan Price: ₹{planPrice} for {planDuration} {planDuration>1?"Months":"Month"}
            </p>
          )}

          {/* Address & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Street, City, State"
                className="w-full p-3 rounded-lg bg-zinc-800 border border-gray-600 text-white"
              />
              {errors.address && (
                <p className="text-red-400 text-sm">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Optional notes (e.g., injury, diet)"
                className="w-full p-3 rounded-lg bg-zinc-800 border border-gray-600 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-lg transition"
          >
            {isPending ? "Adding..." : "Add Member"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Reusable InputField Component
const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  icon,
  type = "text",
}) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <div className="flex items-center gap-2 bg-zinc-800 border border-gray-600 rounded-lg px-3">
      {icon && <span className="text-yellow-400">{icon}</span>}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 bg-transparent text-white outline-none"
      />
    </div>
    {error && <p className="text-red-400 text-sm">{error}</p>}
  </div>
);

export default AddMemberForm;
