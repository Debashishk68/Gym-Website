import { useMutation } from "@tanstack/react-query";
import { certificateApi, IdCard } from "../apis/Certificate";

const useCertificate = () => {
  return useMutation({
    mutationFn: certificateApi,
    mutationKey: ["certificate"],
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "certificate.png";
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      alert(error.message || "Failed to generate certificate");
    },
  });
};

export const useIdCard = () => {
  return useMutation({
    mutationFn: IdCard,
    mutationKey: ["id"],
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ID-Card.png`;
      document.body.appendChild(a); // ensure Firefox support
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      alert(error.message || "Failed to generate ID card");
    },
  });
}

export default useCertificate;
