import { useToastStore } from "../../../store/toastStore";
import Toast from "./Toast";

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[999999] flex flex-col gap-3 pointer-events-none"
      style={{ maxWidth: "calc(100vw - 2rem)" }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full sm:w-96">
          <Toast toast={toast} onClose={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
