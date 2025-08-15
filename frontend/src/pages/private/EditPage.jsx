import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaTrashAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import sushilGhimire from "../../assets/sushil-ghimire.jpg";
import Navbar from "../../components/NavBar.jsx";
import { SelectField } from "../../components/SelectedField.jsx";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useMembersInfo } from "../../hooks/useDashboard.js";
import { useDeleteMember, useEditMember } from "../../hooks/useAddMember.js";
import { useGetPlans } from "../../hooks/useGetplans.js";
import { InputField } from "../../components/InputField.jsx";

const EditMemberForm = () => {
  const { id } = useParams();
  const { data: memberData, isLoading: loadingMember } = useMembersInfo(id);
  const { data: plansData, isSuccess: plansSuccess } = useGetPlans();
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();
  const { mutate: editMember, isSuccess, isPending } = useEditMember();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [isExpired, setIsExpired] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fathersname: "",
    age: "",
    gender: "Male",
    address: "",
    membershipType: "",
    emergencyContact: "",
    status: "Active",
    notes: "",
    profileImage: "",
    planEndDate: "",
    discount:"",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [renewPlan, setRenewPlan] = useState(false);
  const defaultPlaceholder = `https://ui-avatars.com/api/?name=${memberData?.client.fullname}&background=1a1a1a&color=ffc107&rounded=true`;

  useEffect(() => {
    if (plansSuccess) {
      setPlans(plansData.plans);
      setFormData((prev) => ({
        ...prev,
        membershipType: prev.membershipType || plansData.plans[0]?.name,
      }));
    }
  }, [plansSuccess, plansData]);

  useEffect(() => {
    if (memberData && plans.length > 0) {
      const c = memberData.client;

      setFormData({
        name: c.fullname || "",
        email: c.email || "",
        phone: c.phone || "",
        age: c.age || "",
        fathersname: c.fathersname || "",
        gender: c.gender || "Male",
        address: c.address || "",
        membershipType: c.plan || plans[0]?.name || "",
        emergencyContact: c.emergencyContact || "",
        status: c.status || "Active",
        notes: c.notes || "",
        profileImage: c.profilePic || "",
        planEndDate: c.membershipDeadline || "",
        renewDate: c.renewDate || "",
      });

      if (c.profilePic) setImagePreview(c.profilePic);

      if (c.membershipDeadline) {
        const today = new Date();
        const endDate = new Date(c.membershipDeadline);
        setIsExpired(endDate <= today);
      }
    }
  }, [memberData, plans]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Member updated successfully");
      setRenewPlan(false);
      navigate("/members");
    }
  }, [isSuccess]);

  const selectedPlan = plans.find((p) => p.name === formData.membershipType);
   const rawPrice = selectedPlan?.durations?.[0]?.price || 0;
  const discountPercent = parseFloat(formData.discount) || 0;
  const planPrice = rawPrice - (rawPrice * discountPercent) / 100;
  const planDuration = selectedPlan?.durations?.[0]?.months;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files?.length) {
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const err = {};
    ["name", "email", "phone", "age", "address"].forEach((f) => {
      if (!formData[f])
        err[f] = `${f.charAt(0).toUpperCase() + f.slice(1)} is required`;
    });
    setErrors(err);
    return !Object.keys(err).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    editMember({ id, data: formData, planPrice:rawPrice, renewPlan });
  };

  if (loadingMember)
    return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${sushilGhimire})` }}
    >
      <Navbar />
      <ToastContainer position="top-right" />
      <div className="max-w-5xl mt-4 mx-auto bg-black/70 backdrop-blur-md text-white p-10 rounded-2xl shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 tracking-wide mb-4 sm:mb-0">
            ✨ Edit Member Profile
          </h2>

          <button
            type="button"
            onClick={() => {
              const confirmed = window.confirm(
                "Are you sure you want to delete this member?"
              );
              if (confirmed) {
                deleteMember(id, { onSuccess: () => navigate("/members") });
              }
            }}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm sm:text-base"
          >
            <FaTrashAlt className="text-lg" />
            {isDeleting ? "Deleting" : "Delete Member"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image */}
          <div className="flex justify-center">
            <label className="cursor-pointer text-center">
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <img
                src={imagePreview || defaultPlaceholder}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-lg hover:scale-105 transition-transform"
              />
              <p className="text-sm text-yellow-300 mt-2 underline">
                Change Photo
              </p>
            </label>
          </div>

          {/* Input Fields */}
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
              label="Father's Name"
              name="fathersname"
              value={formData.fathersname}
              onChange={handleChange}
              icon={<FaUser />}
              placeholder="Father's full name"
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
             <InputField
              label="Discount (%)"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
              error={errors.discount}
              placeholder="e.g. 10"
            />

            <SelectField
              label="Plan"
              name="membershipType"
              value={formData.membershipType}
              onChange={handleChange}
              options={plans.map((p) => ({ value: p.name, label: p.name }))}
            />
            <InputField
              label="Renew Date"
              type="date"
              name="renewDate"
              value={formData.renewDate}
              onChange={handleChange}
              icon={<FaCalendarAlt />}
              placeholder="Select renew date"
            />
          </div>

          {/* Plan Info */}
          <div className="mt-2 text-sm text-yellow-200">
            💳 Plan Price: ₹{planPrice} for {planDuration}{" "}
            {planDuration > 1 ? "Months" : "Month"}
            {formData.planEndDate && (
              <p className="mt-1">
                🗓️ Plan Ends:{" "}
                <span
                  className={
                    isExpired ? "text-red-400" : "text-green-400 font-semibold"
                  }
                >
                  {new Date(formData.planEndDate).toLocaleDateString()}
                </span>
              </p>
            )}
          </div>

          {/* Emergency Contact & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Address & Notes */}
          <TextareaField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            placeholder="123 Street, City, State"
          />
          <TextareaField
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Optional notes (e.g., injury, diet)"
          />

          {/* Renew Plan Checkbox */}
          {isExpired && (
            <div className="flex items-center mt-4 space-x-3">
              <input
                type="checkbox"
                id="renewPlan"
                checked={renewPlan}
                onChange={(e) => setRenewPlan(e.target.checked)}
                className="w-5 h-5 accent-yellow-400"
              />
              <label htmlFor="renewPlan" className="text-yellow-300 text-sm">
                Renew expired plan upon saving
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-6 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-lg transition duration-300"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

const TextareaField = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
}) => (
  <div>
    <label className="block mb-1 text-sm font-medium text-yellow-300">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 rounded-lg bg-zinc-800 border border-gray-600 text-white focus:ring-2 ring-yellow-400"
    />
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </div>
);

export default EditMemberForm;
