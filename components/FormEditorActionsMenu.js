import { nanoid } from "nanoid";
import { useContext } from "react";
import { FormEditorContext } from "../contexts/FormEditorContext";
import { useRouter } from "next/router";
import axios from "axios";
import { ModalWindowContext } from "../contexts/ModalWindowContext";

export default function FormEditorActionsMenu() {
  const router = useRouter();
  const { pathname } = router;

  const { showModal, setShowModal } = useContext(ModalWindowContext);

  const { formData, dispatch, previewForm, setPreviewForm } =
    useContext(FormEditorContext);

  const handleAddNewQuestion = () => {
    const newQuestion = {
      id: nanoid(),
      title: "Untitled question",
      option: "shortAnswer",
      inputData: {
        type: "text",
        minLength: 0,
        maxLength: 100,
      },

      required: false,
    };

    return dispatch({ type: "ADD_NEW_QUESTION", payload: { newQuestion } });
  };

  const handleCreateForm = async () => {
    const data = { id: nanoid(), ...formData, updatedAt: new Date() };

    try {
      const res = await axios.post(`/api/account/forms/`, data);
      console.log(res.status);
    } catch (error) {
      console.warn("error!");
    }
  };

  const handleUpdateForm = async () => {
    const data = { ...formData, updatedAt: new Date() };

    try {
      const res = await axios.put(`/api/account/forms/${formData.id}`, data);
      console.log(res.status);
    } catch (error) {
      console.warn("error!");
    }
  };

  const handleDeleteForm = async () => {
    try {
      const res = await axios.delete(`/api/account/forms/${formData.id}`);
      console.log(res.status);
      router.push("/user/forms/view");
    } catch (error) {
      console.warn("error!");
    }
  };

  return (
    <>
      <menu className="flex flex-col gap-2 p-2 text-xl border rounded bg-white shadow-md">
        <section className="flex flex-col gap-2">
          <button
            title={previewForm ? "Back to edit mode" : "Preview form"}
            onClick={() => setPreviewForm(!previewForm)}
          >
            <i className="bi bi-eye" />
          </button>

          <button title="Share form" onClick={() => setShowModal(true)}>
            <i className="bi bi-share" />
          </button>
        </section>
        {pathname === "/user/forms/edit/[formId]" && !previewForm ? <hr /> : ""}

        <section className="flex flex-col gap-2">
          {!previewForm && (
            <button title="Add new question" onClick={handleAddNewQuestion}>
              <i className="bi bi-plus-circle" />
            </button>
          )}

          {pathname === "/user/forms/edit/[formId]" && !previewForm ? (
            <>
              <button ttile="Update form" onClick={handleUpdateForm}>
                <i className="bi bi-arrow-up-circle" />
              </button>

              <button title="Delete form" onClick={handleDeleteForm}>
                <i className="bi bi-x-circle" />
              </button>
            </>
          ) : null}
        </section>
      </menu>
    </>
  );
}
