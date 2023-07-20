import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useOrderDataContext } from "./Order";
import { useOrderContext } from "./MyOrderTable";

export default function RemoveModal({ removeData, closeRemoveModal }) {
  const [loading, setLoading] = useState(false);

  const modalRef = useRef();
  const { removeOne } = useOrderDataContext();
  const { setRemoveLoading } = useOrderContext();

  useEffect(() => {
    let handler = (e) => {
      if (!modalRef.current.contains(e.target)) {
        closeRemoveModal();
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const confirmDelete = async () => {
    // setLoading(() => true);
    // const loaderToast = toast.loading(`Removing ${removeData.id}`);

    setRemoveLoading(() => ({ id: removeData.id, loading: true }));
    closeRemoveModal();
    const res = await removeOne(removeData.entry, removeData.id);
    // setLoading(() => false);
    // toast.remove(loaderToast);
    if (res?.error) toast.error(res.error, { duration: 10000 });
    else {
      // toast.remove(loaderToast);
      toast.success(res.success);
      setRemoveLoading(() => ({ id: removeData.id, loading: false }));
      // closeRemoveModal();
    }
  };

  return (
    <section
      className="my-auto w-[80%] md:w-[65%] lg:w-[40%] mx-auto overflow-y-scroll no-scrollbar rounded-lg bg-neutral-900"
      ref={modalRef}
    >
      <header className="p-4 relative">
        <button
          name="close-delete-modal"
          type="button"
          className="absolute top-5 right-5 text-white bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          data-modal-hide="authentication-modal"
          onClick={() => closeRemoveModal()}
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
        <h3 className="text-xl text-center font-medium text-red-600">
          {`Remove ${removeData?.id} from ${removeData?.entry}?`}
        </h3>
      </header>
      <div className="text-center text-white w-[97%] mx-auto">
        <div
          id="alert-dialog-description"
          className="py-5 flex flex-col items-center justify-between gap-5"
        >
          <span className="text-md w-full border-y text-center py-3 ">
            This Action is Irreversible !
          </span>
          <span className="text-white mb-2">
            This will remove the customer <b>{removeData?.id}</b> along with all
            his/her orders.
          </span>
          <span className="font-semibold text-white">
            Are you sure you want to continue?
          </span>
        </div>
      </div>
      <footer className=" flex justify-center items-center gap-6 py-2">
        <motion.button
          id="removeAllBtn"
          disabled={loading}
          onClick={() => confirmDelete(removeData)}
          autoFocus
          name="removeAll"
          className="text-red-600 bg-transparent px-3 py-2"
          whileHover={{
            // scale: 1.05,
            backgroundColor: "rgba(68 18 18 0.1)",
            borderRadius: "8px",
            transition: {
              duration: 0.5,
            },
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          Confirm
        </motion.button>
        <motion.button
          onClick={closeRemoveModal}
          className="text-blue-500 bg-transparent px-3 py-2"
          whileHover={{
            backgroundColor: "rgba(53 96 130 0.1)",
            borderRadius: "8px",
            transition: {
              duration: 0.5,
            },
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          Cancel
        </motion.button>
      </footer>
    </section>
  );
}
