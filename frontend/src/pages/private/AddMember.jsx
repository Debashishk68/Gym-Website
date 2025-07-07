import AddMemberForm from "../../components/AddMemberForm";

const AddMemberPage = () => {
  const handleAdd = (data) => {
    console.log("Added Member:", data);
    // send to backend or store in state
  };

  return <AddMemberForm onAdd={handleAdd} />;
};

export default AddMemberPage;
